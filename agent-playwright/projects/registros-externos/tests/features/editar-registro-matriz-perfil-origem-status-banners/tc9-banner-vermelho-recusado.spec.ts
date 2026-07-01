import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage, RegistroFormPage } from '../../../pages/EditarRegistroPage.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// Seed de Recusado agora existe no env (org 37079) — TC9 deixou de ser fixme e roda.
// DIVERGÊNCIA esperada (recon + auditoria 2026-06-22): o form de edição não renderiza o
// banner vermelho "Registro de aprendizagem recusado" da RN46 (assim como não renderiza o
// verde no Emitido). Assere a expectativa da AT; falha vermelho documenta o gap.
test.describe(SUITE, () => {
  test('Validar banner vermelho de registro Recusado com justificativa', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC9 — banner vermelho de registro Recusado');
    await allure.severity('critical');

    const lista = new RegistrosListPage(page);
    const form = new RegistroFormPage(page);

    await allure.step('Abrir "Editar" de um Externo Recusado', async () => {
      await lista.gotoAdmin();
      const id = await lista.findRecordId('external', 'Recusado');
      expect(id, 'seed: Externo Recusado').not.toBeNull();
      await lista.openEdit(id!);
    });

    await allure.step('Banner vermelho + botão "Histórico" (RN46)', async () => {
      await expect(form.redBanner().first()).toBeVisible();
      await expect(form.historicoButton().first()).toBeVisible();
      await form.historicoButton().first().click();
      await expect(page.getByText(/Histórico -/).first()).toBeVisible();
    });
  });
});
