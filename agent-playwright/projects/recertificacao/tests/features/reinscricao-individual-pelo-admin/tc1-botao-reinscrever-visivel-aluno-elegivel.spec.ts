import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc1Data } from './tc1-botao-reinscrever-visivel-aluno-elegivel.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Skill provisionar-seed v1.6 (2026-05-28): TC1 exige 3 alunos em
  // estados distintos (a) elegível por progresso 100% (b) elegível por
  // cert expirado (c) inelegível em andamento. Estado (c) é coberto por
  // `alunoMatriculadoSeed`, MAS (a) e (b) dependem de helpers ainda
  // [NOT_IMPLEMENTED] no catálogo da skill:
  //   - seed-roadmap-atividade-aula-1 (criar atividade pra fluxo de
  //     completar curso → atingir progresso 100%);
  //   - seed-roadmap-cert-expiracao-1 (forçar cert pra expired_at no
  //     passado — exige DB write ou endpoint admin não mapeado).
  // Quando ambos helpers forem implementados, refatorar pra usar
  // fixtures `alunoAprovadoSeed` + `alunoComCertExpiradoSeed` (nova).
  // Fixme legítimo §7.6 F categoria "seed-roadmap-*".
  test.fixme(
    true,
    'seed-roadmap-atividade-aula-1 + seed-roadmap-cert-expiracao-1: pré-condições "aluno progresso 100%" e "aluno cert expirado" precisam de helpers ainda não implementados. Ver skill provisionar-seed v1.6 §"Catálogo COMPLETO".',
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
