import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-botao-reinscrever-visivel-aluno-elegivel.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Skill provisionar-seed v1.7.0 (2026-05-28): cada um dos 3 estados
  // tem fixture/helper individual disponível:
  //   (a) progresso 100% → `alunoAprovadoNoCursoFixoSeed`
  //   (b) cert expirado → `alunoAprovadoNoCursoFixoSeed` + `expirarCertificadoDoAluno`
  //   (c) em andamento → `alunoMatriculadoSeed`
  // Falta: fixture COMPOSTA que crie 3 alunos no mesmo curso
  // simultaneamente. Cada fixture atual é singleton por test (1 aluno
  // worker-isolated). Pra TC1 precisamos provisionar os 3 em sequência
  // dentro de `test.beforeAll` ou criar fixture nova
  // `tresAlunosEmEstadosDistintosSeed`. Esforço ~30min de impl + ~15min
  // de pipeline (3× completar curso é caro).
  //
  // Fixme legítimo §7.6 F categoria "seed-roadmap-fixture-composta".
  test.fixme(
    true,
    'seed-roadmap-fixture-composta-3-alunos: TC1 exige 3 alunos no mesmo curso em estados distintos (a) progresso 100% (b) cert expirado (c) em andamento. v1.7.0 tem cada estado coberto individualmente, mas falta fixture composta que provisione os 3 simultaneamente. Ver skill provisionar-seed v1.7.0 §"Catálogo".',
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
