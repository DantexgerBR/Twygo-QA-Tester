import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { widgetSemCustomizacoesData as data } from './widget-sem-customizacoes.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Dashboard - Visão do aluno', () => {
  test.afterEach(async ({ page }) => {
    await new ProfileSwitcher(page).revertToAdminSafe();
  });

  test('Renderização de widget configurado sem título e ícone customizados', async ({
    page,
    step,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story('Renderização de widget configurado sem título e ícone customizados');
    await allure.severity('normal');

    const switcher = new ProfileSwitcher(page);

    await step('1. Acessar painel do aluno (switch para perfil Aluno via popover)', async () => {
      await switcher.switchToViaUrl('Aluno');
    });

    await step('2. Verificar widget exibe título default e nenhum título customizado', async () => {
      await expect(page.getByRole('heading', { name: data.defaultTitle })).toBeVisible();
      await expect(page.getByText(data.customTitle, { exact: true })).toBeHidden();
    });
  });
});
