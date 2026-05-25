import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { renderizarWidgetResumoAtividadesData as data } from './renderizar-widget-resumo-atividades.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Dashboard - Visão do aluno', () => {
  test.afterEach(async ({ page }) => {
    await new ProfileSwitcher(page).revertToAdminSafe();
  });

  test("Renderizar widget 'Resumo das atividades' para o aluno", async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story("Renderizar widget 'Resumo das atividades' para o aluno");
    await allure.severity('critical');

    const switcher = new ProfileSwitcher(page);

    await step('1. Acessar painel do aluno (switch para perfil Aluno via popover)', async () => {
      await switcher.switchToViaUrl('Aluno');
    });

    await step("2. Verificar widget 'Resumo das atividades' visível", async () => {
      await expect(page.getByRole('heading', { name: data.widgetTitle })).toBeVisible();
    });
  });
});
