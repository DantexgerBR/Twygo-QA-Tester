import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage } from '../../../pages/EditarRegistroPage.js';
import { editarRegistroData as data } from './editar-registro.shared.data.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// DIVERGÊNCIA (recon 2026-06-22): o form de edição abre com breadcrumb "Registros > Editar"
// e o título do conteúdo, NÃO com o cabeçalho literal "Editar registro" / "Editar registro
// de aprendizagem" da RN42. Assere a expectativa da AT (Admin) e falha vermelho.
// O cabeçalho do Aluno depende de registro próprio editável (só Emitido) — coberto no comentário.
test.describe(SUITE, () => {
  test('Validar cabeçalhos do form de edição por perfil', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC3 — cabeçalhos do form por perfil');
    await allure.severity('normal');

    const lista = new RegistrosListPage(page);

    await allure.step('Admin: abrir "Editar" de um Externo Emitido', async () => {
      await lista.gotoAdmin();
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed: 1 Externo Emitido').not.toBeNull();
      await lista.openEdit(id!);
      // AT TC3.2: cabeçalho "Editar registro".
      await expect(page.getByText(data.headers.admin, { exact: true }).first()).toBeVisible();
    });

    // seed ausente: passo 1 (Aluno) exige um Externo Pendente próprio do aluno; o aluno
    // logado só possui Externo Emitido. Cobertura do cabeçalho do Aluno pendente — QA Lead.
  });
});
