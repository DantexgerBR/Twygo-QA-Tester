import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AcoesEmMassaPage } from '../../../pages/AcoesEmMassaPage.js';
import { acoesEmMassaData as data } from './acoes-em-massa.shared.data.js';

const SUITE = data.suiteName;

// Sem cleanup: somente leitura/navegação (convenção do projeto).
test.describe(SUITE, () => {
  test('Validar disponibilidade do botão e abertura sem seleção', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar disponibilidade do botão e abertura sem seleção');
    await allure.severity('critical');

    const massa = new AcoesEmMassaPage(page);

    await allure.step('1. Layout do Aluno NÃO exibe "Ações em massa"', async () => {
      // Proxy do passo "como Aluno": o user de teste é Admin, então usamos o
      // layout embarcado (in_use_mode_layout=true), que renderiza a visão do
      // colaborador — sem ações administrativas na toolbar. // REVISAR: persona
      // Aluno real (via troca de perfil) não exercida.
      await massa.gotoAlunoLayout();
      await expect(massa.massButton()).toHaveCount(0);
    });

    await allure.step('2. Admin exibe "Ações em massa" habilitado sem seleção', async () => {
      await massa.goto();
      await expect(massa.massButton()).toBeVisible();
      await expect(massa.massButton()).toBeEnabled();
    });

    await allure.step('3. Clicar abre o drawer "Ações em massa"', async () => {
      await massa.openDrawer();
      await expect(massa.drawer()).toContainText('Ações em massa');
    });
  });
});
