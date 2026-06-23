import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage, RegistroFormPage } from '../../../pages/EditarRegistroPage.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// Roda contra o Externo Emitido: no build BETA, clicar "Editar" num registro Pendente NÃO
// abre o form (no-op — o menu do Pendente lidera com "Avaliar"), então o único registro que
// abre o form de edição de forma confiável é o Emitido. A validação esperada BLOQUEIA o save
// (sem mutação); se a validação não disparar (divergência), o teste falha e sinaliza.
test.describe(SUITE, () => {
  test('Validar validação de obrigatórios na edição', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC6 — validação de obrigatórios na edição');
    await allure.severity('normal');

    const lista = new RegistrosListPage(page);
    const form = new RegistroFormPage(page);

    await allure.step('Abrir "Editar" de um Externo Emitido', async () => {
      await lista.gotoAdmin();
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed: 1 Externo Emitido').not.toBeNull();
      await lista.openEdit(id!);
    });

    await allure.step('Limpar "Data de término *" e tentar salvar', async () => {
      await form.dateInput('endDate').fill('');
      await form.clickSave();
      // A validação de obrigatório É aplicada e bloqueia o save (segue no form).
      // DIVERGÊNCIA de cópia: a AT documenta a mensagem genérica "Campo obrigatório", mas o
      // produto exibe a mensagem específica do campo ("Data de término é obrigatório").
      await expect(page.getByText(/é obrigatóri|Campo obrigatório/i).first()).toBeVisible();
      await expect(page).toHaveURL(/\/records\/\d+\/edit/);
    });
  });
});
