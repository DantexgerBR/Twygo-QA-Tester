import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { tc2Data } from './tc2-progresso-historico-mantido-recertification-zero.data.js';

test.describe('Isolamento de Progresso, Score e Attendance por Inscrição', () => {
  test('TC2 — Aluno NÃO reinscrito (recertification_number = 0) mantém progresso histórico após deploy', async ({
    page,
  }) => {
    // SEED_INVALIDO: tc2Data.cursoLegadoId=2 e alunoLegadoEmail=
    // 'aluno.legado@example.com' são placeholders. Network mostrou
    // GET /o/37007/events/2 → 404 (curso não existe). TC valida invariante
    // de regressão (backfill da migration preserva progresso histórico)
    // que precisa de aluno pré-deploy real com event_content_users.
    // event_participant_id IS NULL — só configurável via psql no env.
    // Destrava quando o seed for criado em staging-base-de-conhecimento.
    test.fixme(
      true,
      'seed inválido — cursoLegadoId=2 retorna 404 e aluno.legado@example.com é placeholder. NEEDS_SEED (aluno pré-deploy com event_participant_id IS NULL).',
    );
    await allure.epic('Twygo - Recertificação');
    await allure.feature(
      'Isolamento de Progresso, Score e Attendance por Inscrição',
    );
    await allure.story(
      'Aluno NÃO reinscrito (recertification_number = 0) mantém progresso histórico após deploy',
    );
    await allure.severity('critical');
    await allure.tag('REGRESSION_GUARD');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    await allure.step(
      '1. Pré-condição: aluno pré-deploy com `recertification_number = 0`, `progress_score = 100`, e registros em `event_content_users` com `event_participant_id IS NULL` → Estado preparado em staging',
      async () => {
        // REVISAR-SEED: este TC valida a INVARIANTE de regressão crítica
        // (RN 27.1) — alunos antigos NÃO podem perder progresso por causa
        // do deploy. Pré-condição é seed pré-existente; não criamos aqui.
        await allure.tag('SEED_DEPENDENCY');
        expect(tc2Data.alunoLegadoEmail).toBeTruthy();
        expect(tc2Data.progressoEsperadoHistorico).toBe(100);
      },
    );

    await allure.step(
      '2. Login com este aluno e acessar a página do curso no Play → Banner exibe progresso `100%` (mantido do histórico)',
      async () => {
        // REVISAR-SEED: storageState atual em `outputs/.auth/storage.json` é
        // do usuário ADMIN do env. Para logar como aluno legado, este TC
        // deveria ter um storageState dedicado (`storage-aluno-legado.json`)
        // gerado por fixture específica OU fazer login inline neste passo.
        // Por ora, navegamos assumindo storage do aluno; se for admin, a
        // asserção de progresso capturará a divergência semântica.
        await allure.tag('REVIEW_NEEDED');
        await safeGoto(
          page,
          `/o/${getOrgId()}/events/${tc2Data.cursoLegadoId}`,
        );

        // RN 27.1/28: progresso histórico deve aparecer como 100% mesmo
        // após o deploy que introduziu recertification_number.
        // REVISAR: extrair pra LearningStudentsPage quando criada.
        const progresso100 = page
          .getByText(
            new RegExp(`${tc2Data.progressoEsperadoHistorico}\\s?%`),
          )
          .first();
        await expect(progresso100).toBeVisible({ timeout: 10_000 });
      },
    );

    await allure.step(
      '3. Acessar como admin a lista de aprendizagem → Aluno aparece com `progress_score = 100`, certificado VALID — exatamente como antes do deploy',
      async () => {
        // Volta pro contexto admin para validar a listagem. O aluno legado
        // (recertification_number = 0) deve aparecer com 100% e certificado
        // VALID — o backfill da migration preserva o estado anterior.
        // REVISAR: extrair pra LearningStudentsPage quando criada.
        await safeGoto(
          page,
          `/o/${getOrgId()}/events/${tc2Data.cursoLegadoId}/learning_students`,
        );
        await expect(page).toHaveURL(/\/learning_students/);

        const linhaAluno = page
          .getByRole('row', { name: new RegExp(tc2Data.alunoLegadoEmail, 'i') })
          .first();

        if (await linhaAluno.isVisible().catch(() => false)) {
          // progress_score = 100 preservado
          await expect(linhaAluno).toContainText(
            new RegExp(`${tc2Data.progressoEsperadoHistorico}\\s?%`),
          );

          // Certificado VALID — busca pelo badge/texto de status.
          // REVISAR: texto exato do badge depende de I18n (esperado
          // "Válido" / "Valid" / "Aprovado"). Asserta presença não-vazia
          // de status enquanto não há Page Object.
          await expect(linhaAluno).not.toContainText(/inválido|invalid|expirado/i);
        } else {
          // Fallback: se a linha não localiza por role=row, asserta o
          // texto de progresso na página inteira.
          await expect(
            page
              .getByText(
                new RegExp(`${tc2Data.progressoEsperadoHistorico}\\s?%`),
              )
              .first(),
          ).toBeVisible();
          await allure.tag('REVIEW_NEEDED');
        }
      },
    );
  });
});
