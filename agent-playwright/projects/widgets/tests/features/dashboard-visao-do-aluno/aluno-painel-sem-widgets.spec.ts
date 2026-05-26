import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { alunoPainelSemWidgetsData as data } from './aluno-painel-sem-widgets.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Dashboard - Visão do aluno', () => {
  test.afterEach(async ({ page }) => {
    await new ProfileSwitcher(page).revertToAdminSafe();
  });

  test('Aluno acessa painel sem widgets configurados', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story('Aluno acessa painel sem widgets configurados');
    await allure.severity('normal');

    const switcher = new ProfileSwitcher(page);

    await step('1. Acessar painel do aluno (switch para perfil Aluno via popover)', async () => {
      await switcher.switchToViaUrl('Aluno');
    });

    await step('2. Verificar que empty-state de admin NÃO aparece na visão Aluno', async () => {
      await expect(page.getByText(data.adminEmptyStateText)).toBeHidden();
    });
  });
});
