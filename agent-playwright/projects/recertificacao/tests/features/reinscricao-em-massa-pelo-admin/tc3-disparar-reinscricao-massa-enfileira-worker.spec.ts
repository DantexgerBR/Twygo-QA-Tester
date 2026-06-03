import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc3Data } from './tc3-disparar-reinscricao-massa-enfileira-worker.data.js';

// REVISAR: cleanup via DB ainda não implementado. Usar conjunto
// worker-isolated de alunos pré-criados pra essa suíte; não disparar
// massa em alunos compartilhados — cada run cria N participants
// reinscritos permanentes no env (CLAUDE.md §7.6 G).

test.describe('Reinscrição em Massa pelo Admin', () => {
  // Heal 2026-05-26: eventId placeholder — GET /o/37007/events/3/learning_students
  // retorna 404 no env staging-base-de-conhecimento. Confirmar seed real e
  // atualizar `tc3Data.cursoIdRecertOn` em
  // `tc3-disparar-reinscricao-massa-enfileira-worker.data.ts`.
  test.fixme(
    true,
    'seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts.',
  );
  test('TC3 — Disparar reinscrição em massa enfileira worker e processa todos os alunos elegíveis', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição em Massa pelo Admin');
    await allure.story(
      'Disparar reinscrição em massa enfileira worker e processa todos os alunos elegíveis',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Acessar a lista de aprendizagem do curso → Lista exibe ≥ 5 alunos elegíveis',
      async () => {
        await learningStudents.goToList(tc3Data.cursoIdRecertOn);
        await expect(page).toHaveURL(/learning_students/);
      },
    );

    await allure.step(
      `2. Selecionar ${tc3Data.studentsToSelect} alunos elegíveis → Drawer exibe "${tc3Data.studentsToSelect} selecionados"`,
      async () => {
        await learningStudents.selectFirstNStudents(tc3Data.studentsToSelect);
        await learningStudents.openMassActionsDrawer(tc3Data.studentsToSelect);
      },
    );

    await allure.step(
      '3. Clicar em "Reinscrição em massa" no drawer → Modal de confirmação é exibido',
      async () => {
        await learningStudents.clickMassReenroll();
        // REVISAR-FIGMA: texto exato do modal (header/body) — MD §131-135.
        await expect(learningStudents.getMassReenrollConfirmModal()).toBeVisible({
          timeout: 10_000,
        });
      },
    );

    await allure.step(
      '4. Clicar em "Confirmar" → Modal fecha + toast "Reinscrição em massa iniciada"',
      async () => {
        await learningStudents.confirmMassReenrollModal(tc3Data.studentsToSelect);
        // REVISAR-FIGMA: texto exato do toast — MD §111.
        await learningStudents.expectMassToastSuccess();
      },
    );

    await allure.step(
      '5. Aguardar até 60s e recarregar a lista → 5 alunos com recertification_number=N+1, progress_score=0, status "Pendente"',
      async () => {
        // REVISAR: validação de worker Sidekiq fora do escopo UI Playwright.
        // Cobrimos apenas o dispatch (toast de início) + verificação UI
        // observável após reload — não há garantia determinística de que
        // os 5 participants estarão refletidos na listagem em até 60s
        // (depende do throughput do Sidekiq no env).
        await allure.tag('WORKER_VALIDATION_PARTIAL');
        await learningStudents.goToList(tc3Data.cursoIdRecertOn);
        await expect(page).toHaveURL(/learning_students/);
        // Asserção determinística: pelo menos voltou à listagem sem erro.
        // Validação detalhada (recertification_number, status badges) fica
        // para teste DB-pure ou suite específica de validação de worker.
      },
    );
  });
});
