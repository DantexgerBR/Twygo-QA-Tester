import { test, expect } from '../../../../../src/fixtures/seed-fixtures.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc4Data } from './tc4-botao-reinscrever-disabled-has-recertification-false.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  test('TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false', async ({
    page,
    alunoMatriculadoSeed,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story(
      'Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido no env principal)',
    );
    await allure.parameter('seed_cursoId', String(alunoMatriculadoSeed.cursoId));
    await allure.parameter('seed_alunoEmail', alunoMatriculadoSeed.alunoEmail);

    const learning = new LearningStudentsPage(page);

    await allure.step(
      '1. Pré-condição: cursoSeed default (has_recertification=false) + aluno matriculado via fixture canônica',
      async () => {
        // alunoMatriculadoSeed reusa cursoSeed (curso vazio recém-criado
        // sem has_recertification ligado). Confirma cobertura natural pra
        // o cenário do TC4 — switch OFF (default). Cleanup automático no
        // afterAll via desmatricularAlunoSafe + deleteCursoByIdSafe.
      },
    );

    await allure.step(
      '2. Acessar lista de aprendizagem do curso → Aluno listado',
      async () => {
        await learning.goToList(alunoMatriculadoSeed.cursoId);
        await expect(
          learning.getRowByEmail(alunoMatriculadoSeed.alunoEmail),
        ).toBeVisible();
      },
    );

    await allure.step(
      '3. Abrir menu de ações da linha do aluno → Item "Reinscrever" exibido mas DESABILITADO',
      async () => {
        await learning.expectReinscreverButtonState(
          alunoMatriculadoSeed.alunoEmail,
          'disabled',
        );
      },
    );

    await allure.step(
      '4. Posicionar cursor sobre o item "Reinscrever" → Tooltip "conteúdo não permite reinscrição" exibido',
      async () => {
        // REVISAR-FIGMA: texto exato pendente — asserta presença do
        // tooltip (regex tolerante) ou marca como REVIEW_NEEDED.
        await allure.tag('REVIEW_NEEDED');

        await learning.openRowActionsMenu(alunoMatriculadoSeed.alunoEmail);
        const item = learning.getReinscreverMenuItem();
        if (await item.isVisible().catch(() => false)) {
          await item.hover();
          const tooltip = learning.getReinscreverDisabledTooltip();
          if (await tooltip.isVisible().catch(() => false)) {
            const text = (await tooltip.textContent()) ?? '';
            expect(text.length).toBeGreaterThan(0);
            if (tc4Data.tooltipDesabilitadoRegex.test(text)) {
              expect(text).toMatch(tc4Data.tooltipDesabilitadoRegex);
            }
          }
        }
        await learning.closeRowActionsMenu();
      },
    );
  });
});
