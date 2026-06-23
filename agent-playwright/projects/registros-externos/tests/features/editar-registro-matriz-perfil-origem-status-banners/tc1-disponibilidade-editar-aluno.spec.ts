import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { RegistrosListPage } from '../../../pages/EditarRegistroPage.js';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { editarRegistroData as data } from './editar-registro.shared.data.js';

const SUITE = 'Editar registro de aprendizagem (matriz perfil × origem × status e banners)';

// DIVERGÊNCIA PRODUTO×AT (recon 2026-06-22): no build BETA o item "Editar" do menu
// 3-pontos aparece para QUALQUER registro, independente de origem/status/perfil — a
// RN42 (gating do "Editar") não está implementada. Este spec assere a expectativa da
// AT (Externo Emitido NÃO deve ter "Editar" para o Aluno) e falha vermelho de propósito,
// sinalizando a lacuna. Quando a RN42 for implementada, passa sem mudar o spec.
test.describe(SUITE, () => {
  test('Validar disponibilidade do "Editar" para o Aluno (matriz origem × status)', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('TC1 — disponibilidade do "Editar" para o Aluno');
    await allure.severity('critical');

    const lista = new RegistrosListPage(page);
    const profile = new ProfileSwitcher(page);

    await allure.step('Entrar como Colaborador e abrir "Meu histórico"', async () => {
      await lista.gotoAluno();
      await profile.switchTo('Colaborador');
      await lista.gotoAluno();
    });

    // seed ausente: o Aluno logado só possui 1 registro (Externo Emitido). Externo
    // Pendente/Recusado/Expirado próprios + Interno + Compartilhado não existem no env,
    // então os passos 1-3, 5 e 6 da AT (que exigem esses registros) não são cobríveis.
    await allure.step('Menu 3-pontos de um registro Externo Emitido', async () => {
      const id = await lista.findRecordId('external', 'Emitido');
      expect(id, 'seed esperado: ao menos 1 Externo Emitido visível ao aluno logado').not.toBeNull();
      const items = await lista.menuItems(id!);
      // AT TC1.4: para Externo Emitido o item "Editar" NÃO deve ser exibido ao Aluno.
      expect(items, `menu observado: [${items.join(', ')}]`).not.toContain(data.menuItems.editar);
    });
  });

  test.afterEach(async ({ page }) => {
    await new ProfileSwitcher(page).revertToAdminSafe();
  });
});
