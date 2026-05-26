import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc2Data } from './tc2-acao-nao-aparece-evento-pacote.data.js';

test.describe('Reinscrição em Massa pelo Admin', () => {
  // Heal 2026-05-26: pacoteId placeholder — GET /o/37007/events/4/learning_students
  // retorna 404 no env staging-base-de-conhecimento. Confirmar seed real e
  // atualizar `tc2Data.pacoteIdRecertOn` em
  // `tc2-acao-nao-aparece-evento-pacote.data.ts`.
  test.fixme(
    true,
    'seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts.',
  );
  test('TC2 — Ação "Reinscrição em massa" NÃO aparece em evento do tipo pacote', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição em Massa pelo Admin');
    await allure.story(
      'Ação "Reinscrição em massa" NÃO aparece em evento do tipo pacote',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Pré-condição: pacote com has_recertification=true e ao menos 3 alunos pré-existe',
      async () => {
        // REVISAR-SEED: pré-condição depende do seed conter `tc2Data.pacoteIdRecertOn`
        // como ContentKind.package com flag e gate ON. Se falhar, ajustar `tc2Data`.
        await allure.tag('REVIEW_NEEDED');
        // Validação implícita ao navegar — se o id não for pacote ou se
        // for inválido, o passo 2 falha visivelmente.
      },
    );

    await allure.step(
      '2. Acessar a lista de aprendizagem do pacote em "/learning_students?event_id={packageId}"',
      async () => {
        await learningStudents.goToList(tc2Data.pacoteIdRecertOn);
        await expect(page).toHaveURL(/learning_students/);
      },
    );

    await allure.step(
      `3. Selecionar ${tc2Data.studentsToSelect} alunos → Drawer de ações em massa é exibido`,
      async () => {
        await learningStudents.selectFirstNStudents(tc2Data.studentsToSelect);
        await learningStudents.openMassActionsDrawer(tc2Data.studentsToSelect);
      },
    );

    await allure.step(
      '4. Inspecionar as opções do drawer → Opção "Reinscrição em massa" NÃO está presente',
      async () => {
        // RN 8: pacote nunca expõe "Reinscrição em massa", mesmo com flag e gate ON.
        const action = learningStudents.getMassReenrollAction();
        await expect(action).toHaveCount(0, { timeout: 5_000 });
      },
    );
  });
});
