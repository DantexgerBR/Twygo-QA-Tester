import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage, RegistroFormPage } from '../../../pages/EditarRegistroPage.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// DIVERGÊNCIA (recon 2026-06-22): o campo é rotulado "Pessoas*" (plural, obrigatório) e o
// input `people-selector-input` NÃO está disabled — diferente da RN43 (dono fixo, campo
// "Pessoa" desabilitado em admin-editar). Assere a expectativa da AT e falha vermelho.
test.describe(SUITE, () => {
  test('Validar campo Pessoa desabilitado na edição do Admin', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC5 — campo Pessoa desabilitado (Admin)');
    await allure.severity('normal');

    const lista = new RegistrosListPage(page);
    const form = new RegistroFormPage(page);

    await allure.step('Admin: abrir "Editar" de um Externo Emitido', async () => {
      await lista.gotoAdmin();
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed: 1 Externo Emitido').not.toBeNull();
      await lista.openEdit(id!);
    });

    await allure.step('Campo Pessoa desabilitado (RN43)', async () => {
      await expect(form.peopleInput()).toBeDisabled();
    });
  });
});
