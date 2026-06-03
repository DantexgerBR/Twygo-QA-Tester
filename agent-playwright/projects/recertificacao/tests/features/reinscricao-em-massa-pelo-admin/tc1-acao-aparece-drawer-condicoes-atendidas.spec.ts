import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-acao-aparece-drawer-condicoes-atendidas.data.js';

test.describe('Reinscrição em Massa pelo Admin', () => {
  // Heal 2026-05-26: eventId placeholder — GET /o/37007/events/3/learning_students
  // retorna 404 no env staging-base-de-conhecimento. Confirmar seed real e
  // atualizar `tc1Data.cursoIdRecertOn` em
  // `tc1-acao-aparece-drawer-condicoes-atendidas.data.ts`.
  test.fixme(
    true,
    'seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc1-acao-aparece-drawer-condicoes-atendidas.data.ts.',
  );
  test('TC1 — Ação "Reinscrição em massa" aparece no drawer quando todas as condições atendidas', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição em Massa pelo Admin');
    await allure.story(
      'Ação "Reinscrição em massa" aparece no drawer quando todas as condições atendidas',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Acessar a lista de aprendizagem do curso em "/learning_students?event_id={eventId}"',
      async () => {
        await learningStudents.goToList(tc1Data.cursoIdRecertOn);
        await expect(page).toHaveURL(/learning_students/);
      },
    );

    await allure.step(
      `2. Selecionar ${tc1Data.studentsToSelect} alunos clicando nos checkboxes correspondentes → Drawer exibe "${tc1Data.studentsToSelect} selecionados"`,
      async () => {
        // REVISAR-SEED: usa selectFirstNStudents pra não acoplar a e-mails
        // específicos do seed; assume ≥3 alunos elegíveis visíveis na
        // primeira página (pré-condição MD §437).
        await learningStudents.selectFirstNStudents(tc1Data.studentsToSelect);
        await learningStudents.openMassActionsDrawer(tc1Data.studentsToSelect);
      },
    );

    await allure.step(
      '3. Inspecionar as opções do drawer → Opção "Reinscrição em massa" está visível e habilitada',
      async () => {
        const action = learningStudents.getMassReenrollAction();
        await expect(action).toBeVisible();
        // RN 8: gate combinado (flag ON + has_recertification=true + tipo ≠ pacote) ⇒ ação habilitada.
        await expect(action).toBeEnabled();
      },
    );
  });
});
