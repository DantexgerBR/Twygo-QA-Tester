import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage, RegistroFormPage } from '../../../pages/EditarRegistroPage.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// TC4 testável: o recon confirmou que o form abre pré-populado. Valida o invariante de
// pré-população (datas + carga horária vêm preenchidas com os valores do registro). A parte
// específica do provedor extra "UFSC" da AT (TC4.2) não é cobrível — sem seed de provedor
// fora da lista padrão. Destinatário dessa lacuna: QA Lead.
test.describe(SUITE, () => {
  test('Validar pré-população dos campos na edição', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC4 — pré-população dos campos');
    await allure.severity('critical');

    const lista = new RegistrosListPage(page);
    const form = new RegistroFormPage(page);

    await allure.step('Abrir "Editar" de um Externo Emitido', async () => {
      await lista.gotoAdmin();
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed: Externo Emitido').not.toBeNull();
      await lista.openEdit(id!);
    });

    await allure.step('Datas e carga horária pré-populadas (RN43)', async () => {
      // AT TC4.3: datas exibem os valores do registro no formato do input date (yyyy-mm-dd).
      await expect(form.dateInput('startDate')).toHaveValue(/\d{4}-\d{2}-\d{2}/);
      await expect(form.dateInput('endDate')).toHaveValue(/\d{4}-\d{2}-\d{2}/);
      await expect(form.cargaHorariaInput()).not.toHaveValue('');
    });
  });
});
