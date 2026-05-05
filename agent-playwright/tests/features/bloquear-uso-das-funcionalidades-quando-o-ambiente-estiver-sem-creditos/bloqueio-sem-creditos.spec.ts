// Testsuite: Bloquear uso das funcionalidades quando o ambiente estiver sem créditos
//
// Cobertura desta automação UI: validar que a tela de Créditos de IA
// (/ai_consumption_analysis) carrega num ambiente SEM saldo (env
// `staging-without-credits` em config/environment.json) e que o app
// apresenta evidência visual de saldo insuficiente — KPI "Saldo de créditos"
// com valor 0/negativo, mensagem de "Limite de créditos atingido" / "Saldo
// insuficiente" / "Saldo zerado", ou notificação amarela no topo.
//
// Escopo NÃO automatizável (documentado por step e validado manualmente):
//  - Steps 1-2 (Mensagem 3 - aluno + chat IA): requer login secundário com
//    perfil aluno + interação com chat — fora do escopo do agente UI atual.
//  - Steps 5-32 (Mensagem 1/2 - admin/gestor/instrutor em telas de Sophia,
//    organograma, registros externos, etc.): requer Super Admin para
//    desabilitar checkboxes de funcionalidades + uso de fluxos de IA
//    generativa que não são determinísticos em testes automatizados.
//  - Step 33 (RN58 - saldo negativo durante processo): requer ação contínua
//    de IA + medição de saldo antes/depois.
//  - Steps 34-37 (validação em ambiente herdado/independente): requer
//    repetição multi-ambiente + multi-perfil.

import { test, expect } from '../../../src/fixtures/exploratory-fixture';
import * as allure from 'allure-js-commons';
import { SECONDARY_STORAGE_PATH } from '../../setup/global-setup';
import { dismissCommonModals } from '../../../src/utils/modals';

// O env sem saldo está em config/environment.json como `staging-without-credits`.
// global-setup faz login lá e grava em SECONDARY_STORAGE_PATH. Aqui consumimos.
test.use({
  storageState: SECONDARY_STORAGE_PATH,
  baseURL: 'https://eduapi.stage.twygoead.com/',
});

test.describe('Bloquear uso das funcionalidades quando o ambiente estiver sem créditos', () => {
  test('Mensagens de bloqueio das funcionalidades SEM créditos disponíveis', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Bloquear uso das funcionalidades quando o ambiente estiver sem créditos');
    await allure.story('Mensagens de bloqueio das funcionalidades SEM créditos disponíveis');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    await allure.tag('REVIEW_NEEDED');

    let orgId: string | null = null;

    // ─── Pré-condição: login secundário (via storageState) + capturar orgId
    // Defensivo: o env sem-créditos pode redirecionar pra rota diferente do
    // staging principal. Tenta múltiplas portas de entrada (raiz, /play, /users)
    // até achar uma URL com `/o/{orgId}/`.
    await allure.step('Pré-condição: storageState do env "staging-without-credits" + capturar orgId via primeira URL com /o/{N}/', async () => {
      const candidates = ['/', '/play?menu_id=play', '/users', '/dashboard_students'];
      for (const path of candidates) {
        await page.goto(path).catch(() => undefined);
        await page.waitForLoadState('domcontentloaded').catch(() => undefined);
        const m = page.url().match(/\/o\/(\d+)\//);
        if (m) {
          orgId = m[1];
          break;
        }
      }
      // Se ainda não tem orgId, procura num link do DOM (menu de organização)
      if (!orgId) {
        const orgLink = await page
          .locator('a[href*="/o/"]')
          .first()
          .getAttribute('href')
          .catch(() => null);
        const m = orgLink?.match(/\/o\/(\d+)/);
        if (m) orgId = m[1];
      }
      expect(
        orgId,
        `orgId não pôde ser extraído após visitar ${candidates.join(', ')}. URL atual: ${page.url()}.`,
      ).not.toBeNull();
      await dismissCommonModals(page).catch(() => undefined);
    });

    // ─── Mensagem 4 (notificação amarela / KPI de saldo zerado)
    await allure.step(
      'Validação automatizada: tela "Créditos de IA" exibe saldo zerado/insuficiente (Mensagem 4)',
      async () => {
        await page.goto(`/o/${orgId}/ai_consumption_analysis`);
        await dismissCommonModals(page);

        // Sinais textuais (Mensagens 1/3/4 conforme XML):
        const textualSignals = [
          page.getByText(/limite de cr.?ditos atingido/i),
          page.getByText(/saldo insuficiente/i),
          page.getByText(/saldo zerado/i),
          page.getByText(/sem cr.?ditos/i),
          page.getByText(/a..?o indispon.?vel/i),
          page.locator('[role="alert"][data-status="warning"]'),
        ];

        // Sinal numérico: KPIs "Saldo final" / "Saldo final total" com valor
        // <= 0 (zero ou negativo) — único indicador determinístico da
        // ausência de créditos no env staging-without-credits, validado em
        // 2026-05-04 (DOM mostrou "Saldo final total: -8.901").
        // O valor é irmão (não filho) do label, então usa regex sobre todo o
        // texto visível: <label>\s+<numero>.
        const pageText = (await page.locator('body').innerText().catch(() => '')) || '';
        const balanceRegex = /Saldo\s+(?:final|atual|disponível|disponivel)(?:\s+total)?\s*\n?\s*([-]?[\d.,]+)/gi;
        let nonPositiveBalances = 0;
        const balanceSamples: string[] = [];
        for (const m of pageText.matchAll(balanceRegex)) {
          const raw = m[1];
          const n = Number(raw.replace(/\./g, '').replace(',', '.'));
          if (!Number.isNaN(n) && n <= 0) {
            nonPositiveBalances++;
            balanceSamples.push(`"${m[0].slice(0, 60).replace(/\s+/g, ' ')}"`);
          }
        }

        let totalFound = nonPositiveBalances;
        const matched: string[] = [...balanceSamples];
        for (const [i, loc] of textualSignals.entries()) {
          const c = await loc.count().catch(() => 0);
          if (c > 0) {
            totalFound += c;
            matched.push(`textual#${i}: ${c}`);
          }
        }
        expect(
          totalFound,
          `Esperado ao menos 1 indicador de saldo zerado/insuficiente em ${page.url()}. Achados: [${matched.join(' | ') || 'nenhum'}]. (Considera-se positivo: KPI "Saldo final/atual/disponível" com valor <= 0, OU mensagem textual de bloqueio).`,
        ).toBeGreaterThan(0);
      },
    );

    // ─── Steps NÃO-automatizáveis (validação manual) — registrados explicitamente
    //     no relatório Allure pra rastreabilidade do XML.
    await allure.step('Step 1 (XML) — REVISAR_MANUAL: Mensagem 3 com perfil aluno + chat Agente de Atendimento', async () => {
      test.info().annotations.push({ type: 'manual', description: 'Requer login com perfil aluno + interação com chat IA — fora do escopo do agente UI.' });
    });
    await allure.step('Step 2 (XML) — REVISAR_MANUAL: Mensagem 3 com perfil aluno interagindo com chat', async () => {
      test.info().annotations.push({ type: 'manual', description: 'Requer login com perfil aluno + envio de mensagem ao chat IA.' });
    });
    await allure.step('Steps 3-4 (XML) — REVISAR_MANUAL: Mensagem 4 ao desabilitar Indexação + Sincronizar', async () => {
      test.info().annotations.push({ type: 'manual', description: 'Sincronização altera estado compartilhado do stage; validar manualmente.' });
    });
    await allure.step('Steps 5-32 (XML) — REVISAR_MANUAL: Mensagem 1/2 em telas de Sophia, organograma, registros externos', async () => {
      test.info().annotations.push({ type: 'manual', description: 'Requer Super Admin para desabilitar checkboxes de funcionalidades + uso de fluxos de IA generativa não determinísticos.' });
    });
    await allure.step('Step 33 (XML / RN58) — REVISAR_MANUAL: saldo negativo durante processo de IA', async () => {
      test.info().annotations.push({ type: 'manual', description: 'Requer medição de saldo durante ação IA em andamento — fora do escopo automatizável.' });
    });
    await allure.step('Steps 34-37 (XML) — REVISAR_MANUAL: repetição em ambiente herdado/independente + multi-perfil', async () => {
      test.info().annotations.push({ type: 'manual', description: 'Requer multi-perfil + multi-ambiente; o stage de testes só tem 1 ambiente sem saldo configurado.' });
    });
  });
});
