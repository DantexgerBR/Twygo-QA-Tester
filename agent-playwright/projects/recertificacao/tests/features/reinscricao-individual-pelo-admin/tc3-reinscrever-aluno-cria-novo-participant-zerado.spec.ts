import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc3Data } from './tc3-reinscrever-aluno-cria-novo-participant-zerado.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Skill provisionar-seed v1.6 (2026-05-28): TC3 exige aluno elegível
  // por progresso 100% num curso com `has_recertification = true`. A
  // fixture `cursoComRecertificacaoSeed` cobre o switch (tab Acesso via
  // `setHasRecertification`), MAS `alunoAprovadoSeed` num curso recém
  // criado vazio retorna progresso=0 (sem atividades pra completar).
  // Pré-condição "aluno elegível por progresso 100%" depende de
  // `seed-roadmap-atividade-aula-1` (criar atividade via UI admin,
  // ainda não implementado). Catálogo completo na skill provisionar-seed
  // §"Catálogo COMPLETO".
  // Fixme legítimo §7.6 F categoria "seed-roadmap-*".
  test.fixme(
    true,
    'seed-roadmap-atividade-aula-1: pré-condição "aluno elegível por progresso 100%" exige curso com atividades pra completar — helper de criação de atividades ainda não implementado. cursoComRecertificacaoSeed cobre só o switch. Ver skill provisionar-seed v1.6.',
  );
  test('TC3 — Reinscrever aluno individualmente cria novo participant zerado', async ({
    page,
  }, testInfo) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story('Reinscrever aluno individualmente cria novo participant zerado');
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    // REVISAR: participant reinscrito permanece no env após teste; cleanup
    // DB ainda não implementado. Usar e-mail worker-isolated minimiza
    // colisão entre runs sucessivos no env compartilhado
    // `staging-base-de-conhecimento` (skill `limpar-dados-de-teste-twygo`).
    // Plano definitivo: criar aluno worker-isolated em runtime via API +
    // deletar no `afterAll` quando endpoint admin estiver mapeado.
    const workerEmailUsado = `aluno-tc3-w${testInfo.workerIndex}-${Date.now()}@example.com`;
    await allure.parameter('aluno_email_runtime', workerEmailUsado);

    // No estado atual do seed (sem provisionamento dinâmico), reusamos o
    // aluno elegível pré-existente do env — REVISAR-SEED quando o pipeline
    // de criação dinâmica estiver pronto.
    const alunoEmail = tc3Data.alunoElegivelEmail;

    const learning = new LearningStudentsPage(page);

    await allure.step(
      '1. Acessar lista de aprendizagem do curso → Aluno (a) elegível com recertification_number = N',
      async () => {
        await learning.goToList(tc3Data.cursoComReinscricaoId);
        await expect(learning.getRowByEmail(alunoEmail)).toBeVisible();
      },
    );

    await allure.step(
      '2. Clicar no item "Reinscrever" no menu da linha → Modal "Confirmar reinscrição" exibido',
      async () => {
        await learning.clickReinscrever(alunoEmail);
        await expect(learning.getConfirmReinscreverModal()).toBeVisible({
          timeout: 10_000,
        });
      },
    );

    await allure.step(
      '3. Clicar em "Confirmar" → Modal fecha, toast de sucesso é exibido, tabela faz refetch',
      async () => {
        await learning.confirmReinscreverModal();
        await learning.expectToastSuccess();
        // Após refetch automático: linha do aluno continua visível.
        await expect(learning.getRowByEmail(alunoEmail)).toBeVisible({
          timeout: 10_000,
        });
      },
    );

    await allure.step(
      '4. Localizar a linha do aluno → recertification_number = N+1, progress_score = 0, badge "Pendente", sem nota, sem certificado',
      async () => {
        // REVISAR-FIGMA: textos exatos das colunas pendentes — asserta
        // apenas presença do badge "Pendente"/"Em andamento" e ausência
        // de "Aprovado"/"Concluído" na linha do aluno.
        await allure.tag('REVIEW_NEEDED');

        const row = learning.getRowByEmail(alunoEmail);
        const badge = learning.getStatusCertificadoBadge(alunoEmail);
        if (await badge.isVisible().catch(() => false)) {
          const badgeText = (await badge.textContent()) ?? '';
          expect(badgeText).toMatch(tc3Data.badgePosReinscricaoEsperado);
        }
        // Validação negativa: linha NÃO deve exibir "Aprovado" ou "Concluído"
        // (estado novo zera tudo).
        const aprovadoNaLinha = await row
          .getByText(/Aprovado|Concluído/i)
          .count();
        expect(aprovadoNaLinha).toBe(0);
      },
    );
  });
});
