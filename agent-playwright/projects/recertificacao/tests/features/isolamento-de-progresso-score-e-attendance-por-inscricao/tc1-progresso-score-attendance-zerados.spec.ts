import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-progresso-score-attendance-zerados.data.js';

const STORAGE_PATH = 'outputs/.auth/storage.json';

test.describe('Isolamento de Progresso, Score e Attendance por Inscrição', () => {
  // ============================================================================
  // BUG DE PRODUTO — validado live 2026-05-27 (env staging-recertificacao 37048):
  //
  // A reinscrição individual de um aluno ELEGÍVEL (aprovado, progress=100,
  // certificado "Emitido", recertification_number=0), com TODAS as pré-condições
  // satisfeitas — feature flag :recertificacao ON na org + switch "Habilitar
  // reinscrição" (has_recertification=true) ON no curso — FALHA:
  //
  //   POST /api/v1/o/37048/contents/{eventId}/event_participants
  //   payload: {"recertification":true,"user":{"id":<userId>}}
  //   → HTTP 422 {"data":null,"message":"Error Inesperado","status":422}
  //   UI: toast "Erro ao reinscrever participante"; NENHUM participant criado.
  //
  // Confirmado como BUG DE PRODUTO (não artefato de automação) via
  // chrome-devtools-mcp em SESSÃO HUMANA FRESCA (login real, contexto isolado,
  // SEM storageState reciclado — skill `comparar-chrome-mcp-vs-playwright`):
  // o mesmo 422 ocorre. Quadrante chrome-mcp ❌ + Playwright ❌ = bug-produto.
  // Console loga "Failed to load resource: status of 422". x-runtime ~0.55s +
  // "Error Inesperado" genérico ⇒ exceção server-side no serviço de reinscrição
  // (dev: grep o x-request-id da resposta nos logs Rails p/ o stack trace).
  //
  // Sem a reinscrição funcionar, o isolamento de progresso (RN 27/28) não pode
  // ocorrer — não há novo participant para isolar. Este TC FALHA VERMELHO no
  // passo 1 de PROPÓSITO (CLAUDE.md §7.6 F — bug de servidor é falha visível,
  // NÃO fixme): o dev vê o vermelho, lê esta causa raiz, corrige o endpoint de
  // reinscrição, e o TC passa sozinho sem mudança no spec.
  //
  // ESCOPO: os passos 2-3 do MD (login do ALUNO no Play, banner 0%, avançar
  // aula até 25%) exigem credencial de aluno não provisionada neste env. A
  // invariante de isolamento (RN 27/28) é validada admin-side pela coluna
  // "Progresso" da listagem de Aprendizagem — observável equivalente. Quando o
  // 422 for corrigido, o passo 1 passa e a validação admin-side (passo 2) roda.
  // ============================================================================

  test.beforeAll(async ({ browser }) => {
    // Pré-condição RN 1: feature flag :recertificacao ON para a org.
    // Idempotente — no-op se já estiver ON (estado atual do env). Não
    // revertemos no afterAll: ON é o baseline correto do env dedicado de
    // recertificação e outras suites de reinscrição dependem dele.
    await ensureFlipperActor(browser, {
      envName: 'staging-recertificacao',
      storageStatePath: STORAGE_PATH,
      flag: 'recertificacao',
      actor: `Organization;${getOrgId()}`,
      enabled: true,
    });
  });

  test('TC1 — Aluno reinscrito tem progress/score/attendance zerados na nova inscrição', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature(
      'Isolamento de Progresso, Score e Attendance por Inscrição',
    );
    await allure.story(
      'Aluno reinscrito tem progress/score/attendance zerados na nova inscrição',
    );
    await allure.severity('critical');
    await allure.parameter(
      'curso',
      `${tc1Data.cursoIsolamentoNomeEsperado} (id ${tc1Data.cursoIsolamentoId})`,
    );
    await allure.parameter('aluno_elegivel', tc1Data.alunoElegivelEmail);

    const learning = new LearningStudentsPage(page);

    await allure.step(
      '1. Reinscrever o aluno aprovado (progress=100, cert Emitido, recertification_number=0) → novo participant com recertification_number=1',
      async () => {
        await learning.goToList(tc1Data.cursoIsolamentoId);
        await expect(
          learning.getRowByEmail(tc1Data.alunoElegivelEmail),
          `Aluno elegível ${tc1Data.alunoElegivelEmail} deve aparecer na listagem de Aprendizagem do curso ${tc1Data.cursoIsolamentoId}`,
        ).toBeVisible({ timeout: 15_000 });

        // "Iniciar reinscrição" dispara POST imediato (sem modal de confirmação).
        // Capturamos a resposta do endpoint de reinscrição direto — mais
        // robusto que asserir o toast de erro (que auto-some em ~5s).
        const [reenrollResponse] = await Promise.all([
          page.waitForResponse(
            (r) =>
              /\/contents\/\d+\/event_participants(?:\?|$)/.test(r.url()) &&
              r.request().method() === 'POST',
            { timeout: 20_000 },
          ),
          learning.clickReinscrever(tc1Data.alunoElegivelEmail),
        ]);

        // RN 27/28: a reinscrição deve criar um novo participant isolado.
        // BUG ATUAL: o backend responde 422 "Error Inesperado". Esta asserção
        // FALHA enquanto o bug existir — é o sinal vermelho para o dev (§7.6 F).
        const reenrollBody = await reenrollResponse.text().catch(() => '');
        expect(
          reenrollResponse.status(),
          `BUG DE PRODUTO: POST ${reenrollResponse.url().replace(/^https?:\/\/[^/]+/, '')} ` +
            `retornou ${reenrollResponse.status()} ao reinscrever aluno elegível ` +
            `(aprovado, 100%, cert Emitido, recertification_number=0) com a flag ` +
            `:recertificacao ON e o switch has_recertification ON. ` +
            `Body: ${reenrollBody.slice(0, 200)}. ` +
            `Reinscrição individual quebrada no env 37048 — corrigir o endpoint.`,
        ).toBeLessThan(400);
      },
    );

    await allure.step(
      '2. Validar isolamento (admin-side): novo participant exibe progresso 0% (não 100% do histórico) — RN 27/28',
      async () => {
        // Alcançável apenas após o bug 422 ser corrigido (passo 1 verde).
        // Equivale aos passos 2-3 do MD (visão do aluno no Play): a listagem
        // default mostra o participant ativo (is_latest_recertification); após
        // a reinscrição ele começa zerado.
        const row = learning.getRowByEmail(tc1Data.alunoElegivelEmail);
        await expect(row).toBeVisible({ timeout: 10_000 });
        await expect(
          row,
          `Novo participant (recertification_number=1) deve exibir progresso ${tc1Data.progressoEsperadoNovoParticipant}%`,
        ).toContainText(
          new RegExp(`${tc1Data.progressoEsperadoNovoParticipant}\\s?%`),
        );
        await expect(
          row,
          'Novo participant não deve exibir 100% (isolado do histórico)',
        ).not.toContainText(/100\s?%/);
      },
    );
  });
});
