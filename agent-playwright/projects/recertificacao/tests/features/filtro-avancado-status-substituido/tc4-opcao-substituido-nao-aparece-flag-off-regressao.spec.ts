import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Decisão locked do QA (Suite 09 TC4): toggle runtime da flag
  // `:recertificacao` via Flipper Admin não está automatizado nesta suite.
  // A flag é assumida ON em `staging-base-de-conhecimento` — testar a
  // ausência da opção "Substituído" exige `ensureFlipperActor(enabled: false)`
  // + revert no afterAll (skill `testar-feature-flag-twygo`).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente OFF.
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente cenário OFF.',
  );

  test('TC4 — Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Filtro Avançado Status Substituído');
    await allure.story(
      'Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)',
    );
    await allure.severity('normal');
    await allure.tag('REGRESSION_FLAG_OFF');
    await allure.tag('FEATURE_FLAG_TOGGLE');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=OFF (toggle não automatizado nesta suite)',
    );

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Desativar a feature flag `:recertificacao` → Flag OFF',
      async () => {
        // REVISAR: caminho canônico seria `ensureFlipperActor(browser, {
        // flag: 'recertificacao', orgId: getOrgId(), enabled: false })` com
        // revert no afterAll. Bloqueado por falta de user com flag elevada
        // no env atual (ver skill `testar-feature-flag-twygo`).
      },
    );

    await allure.step(
      '2. Acessar a lista de aprendizagem e abrir o filtro avançado de Status do certificado → Drawer de filtro é exibido',
      async () => {
        // REVISAR-SEED: eventId deve apontar para curso pré-existente no env.
        // Quando habilitarmos toggle runtime, importar de
        // `./tc4-...data.ts` com pré-condição declarada.
        await learningStudents.goToList(1);
        await expect(page).toHaveURL(
          /\/o\/\d+\/events\/\d+\/learning_students/,
        );
        await learningStudents.openFilterDrawer();
        await expect(page.getByRole('dialog').first()).toBeVisible();
      },
    );

    await allure.step(
      '3. Inspecionar as opções → Lista contém apenas: Emitido, Pendente, Expirado, Aguardando assinatura. Opção "Substituído" NÃO está presente',
      async () => {
        // Asserção principal de regressão (RN 23): "Substituído" ausente com
        // flag OFF — opções legadas permanecem visíveis.
        await learningStudents.expectFilterOptionVisible('Substituído', false);

        for (const baseline of [
          'Emitido',
          'Pendente',
          'Expirado',
          'Aguardando assinatura',
        ]) {
          await learningStudents.expectFilterOptionVisible(baseline, true);
        }
      },
    );
  });
});
