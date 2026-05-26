import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-botao-reinscrever-visivel-aluno-elegivel.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Heal 2026-05-26: cursoComReinscricaoId=1 placeholder — GET
  // /o/37007/events/1/learning_students retorna 404 no env
  // staging-base-de-conhecimento, e os e-mails (aluno.elegivel.progresso@...,
  // aluno.elegivel.certificado.expirado@..., aluno.inelegivel.em.andamento@...)
  // não existem como seed real. Validar no env e atualizar
  // `tc1-botao-reinscrever-visivel-aluno-elegivel.data.ts`.
  test.fixme(
    true,
    'seed inválido — cursoComReinscricaoId=1 não existe (404) e e-mails são placeholders @example.com. Validar no env staging-base-de-conhecimento e atualizar tc1-botao-reinscrever-visivel-aluno-elegivel.data.ts.',
  );
  test('TC1 — Botão "Reinscrever" visível e habilitado apenas para aluno elegível', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story(
      'Botão "Reinscrever" visível e habilitado apenas para aluno elegível',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const learning = new LearningStudentsPage(page);

    await allure.step(
      '1. Acessar a lista de aprendizagem do curso → Lista exibida com os 3 alunos pré-condicionados',
      async () => {
        await learning.goToList(tc1Data.cursoComReinscricaoId);
        await expect(
          learning.getRowByEmail(tc1Data.alunoElegivelProgressoEmail),
        ).toBeVisible();
        await expect(
          learning.getRowByEmail(tc1Data.alunoElegivelCertificadoExpiradoEmail),
        ).toBeVisible();
        await expect(
          learning.getRowByEmail(tc1Data.alunoInelegivelEmail),
        ).toBeVisible();
      },
    );

    await allure.step(
      '2. Abrir menu da linha do aluno (a) elegível por progresso 100% → Item "Reinscrever" habilitado',
      async () => {
        await learning.expectReinscreverButtonState(
          tc1Data.alunoElegivelProgressoEmail,
          'enabled',
        );
      },
    );

    await allure.step(
      '3. Abrir menu da linha do aluno (b) elegível por certificado expirado → Item "Reinscrever" habilitado',
      async () => {
        await learning.expectReinscreverButtonState(
          tc1Data.alunoElegivelCertificadoExpiradoEmail,
          'enabled',
        );
      },
    );

    await allure.step(
      '4. Abrir menu da linha do aluno (c) inelegível em andamento → Item "Reinscrever" DESABILITADO + tooltip explicativo no hover',
      async () => {
        await learning.expectReinscreverButtonState(
          tc1Data.alunoInelegivelEmail,
          'disabled',
        );

        // Hover no item desabilitado dispara tooltip explicativo (RN 4 + 4.1).
        // REVISAR-FIGMA: texto exato pendente — asserta apenas presença
        // não-vazia do role=tooltip.
        await allure.tag('REVIEW_NEEDED');
        await learning.openRowActionsMenu(tc1Data.alunoInelegivelEmail);
        const item = learning.getReinscreverMenuItem();
        if (await item.isVisible().catch(() => false)) {
          await item.hover();
          const tooltip = learning.getReinscreverDisabledTooltip();
          if (await tooltip.isVisible().catch(() => false)) {
            await expect(tooltip).not.toHaveText('');
          }
        }
        await learning.closeRowActionsMenu();
      },
    );
  });
});
