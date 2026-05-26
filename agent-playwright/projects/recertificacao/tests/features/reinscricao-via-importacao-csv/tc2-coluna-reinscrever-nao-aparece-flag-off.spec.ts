import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CsvImportPage } from '../../../pages/CsvImportPage.js';

test.describe('Reinscrição via Importação CSV', () => {
  // Decisão locked do QA (Suite 04 — TC2 regressão flag OFF): a flag
  // `:recertificacao` está assumida ON em `staging-base-de-conhecimento`
  // (orgId 37007). Validar o cenário OFF exige toggle runtime via Flipper
  // Admin — fora do escopo desta suite automatizada (ver skill
  // `testar-feature-flag-twygo` para o plano).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente.
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao OFF. Validar manualmente.',
  );

  test('TC2 — Coluna "Reinscrever" NÃO aparece no template CSV com flag OFF (regressão)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via Importação CSV');
    await allure.story(
      'Coluna "Reinscrever" NÃO aparece no template CSV com flag OFF (regressão)',
    );
    await allure.severity('high');
    await allure.tag('REGRESSION_FLAG_OFF');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=OFF (não automatizado nesta suite)',
    );

    const csvImport = new CsvImportPage(page);

    await allure.step(
      '1. Desativar a feature flag `:recertificacao` para a organização',
      async () => {
        // REVISAR: passo de toggle runtime de flag não automatizado nesta suite.
        // Quando habilitarmos, usar `FlipperAdminPage.ensureFlipperActor`
        // (skill `testar-feature-flag-twygo`).
      },
    );

    await allure.step(
      '2. Acessar a página de importação e baixar o template CSV',
      async () => {
        // REVISAR-FIGMA: URL exata ainda não confirmada.
        // Sem flag OFF efetivada, validamos apenas que a tela carrega.
        await csvImport.goToImport(2);
        await expect(page).toHaveURL(/import_participants/);
      },
    );

    await allure.step(
      '3. Abrir o arquivo template.csv → header NÃO contém a coluna "Reinscrever"; demais colunas (Nome, Email, CPF, etc.) presentes',
      async () => {
        // Validação manual: baixar template com flag OFF e confirmar ausência
        // da coluna "Reinscrever" + presença das colunas legadas (Nome, Email,
        // CPF, etc.).
      },
    );
  });
});
