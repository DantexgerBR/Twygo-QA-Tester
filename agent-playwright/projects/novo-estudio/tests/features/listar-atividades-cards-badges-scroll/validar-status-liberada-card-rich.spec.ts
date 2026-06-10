import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  test('Validar status visual "Liberada" no card-rich', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar status visual "Liberada" no card-rich');
    await allure.severity('normal');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    await allure.step('2. Localizar atividade liberada e validar status "Liberada"', async () => {
      // Curso de recon tem cards com status-released. Invariante: ao menos um
      // card exibe o indicador "Liberada".
      const released = studio.cards
        .filter({ has: page.getByTestId('creation-studio-activity-card-status-released') })
        .first();
      await expect(released).toBeVisible();
      await expect(studio.statusReleased(released)).toContainText(/Liberada/i);
    });
  });
});
