import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage, RegistroFormPage } from '../../../pages/EditarRegistroPage.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// DIVERGÊNCIA (recon 2026-06-22): o form de edição do registro Externo Emitido NÃO exibe
// o banner verde "Certificado aprovado" nem o botão "Histórico" da RN46 — não há banner
// contextual algum no form. Assere a expectativa da AT e falha vermelho.
test.describe(SUITE, () => {
  test('Validar banner verde de registro Emitido', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC10 — banner verde de registro Emitido');
    await allure.severity('normal');

    const lista = new RegistrosListPage(page);
    const form = new RegistroFormPage(page);

    await allure.step('Admin: abrir "Editar" de um Externo Emitido', async () => {
      await lista.gotoAdmin();
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed: 1 Externo Emitido').not.toBeNull();
      await lista.openEdit(id!);
    });

    await allure.step('Banner verde "Certificado aprovado" + botão "Histórico" (RN46)', async () => {
      await expect(form.greenBanner().first()).toBeVisible();
      await expect(form.historicoButton().first()).toBeVisible();
    });
  });
});
