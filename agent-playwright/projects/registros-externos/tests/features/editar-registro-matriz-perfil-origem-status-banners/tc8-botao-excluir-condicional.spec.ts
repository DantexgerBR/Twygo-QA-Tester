import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage, RegistroFormPage } from '../../../pages/EditarRegistroPage.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// DIVERGÊNCIA (recon 2026-06-22): o rodapé do form de edição Admin tem apenas "Salvar" e
// "Cancelar" (+ "Voltar"/"more_horiz" vazio); o botão "Excluir" da RN45 NÃO é exibido.
// Assere a expectativa da AT (Admin Emitido → "Excluir") e falha vermelho.
test.describe(SUITE, () => {
  test('Validar presença condicional do botão "Excluir" no rodapé', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC8 — botão "Excluir" condicional no rodapé');
    await allure.severity('normal');

    const lista = new RegistrosListPage(page);
    const form = new RegistroFormPage(page);

    await allure.step('Admin: abrir "Editar" de um Externo Emitido', async () => {
      await lista.gotoAdmin();
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed: 1 Externo Emitido').not.toBeNull();
      await lista.openEdit(id!);
    });

    await allure.step('Rodapé exibe botão "Excluir" (AT TC8.3 / RN45)', async () => {
      await expect(form.deleteButton()).toBeVisible();
    });

    // seed ausente: passos 1-2 (Aluno · Externo Pendente e Recusado próprios) não cobríveis.
  });
});
