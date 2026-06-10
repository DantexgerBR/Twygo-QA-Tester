import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  test('Validar exibição de sub-atividades com numeração hierárquica X.Y', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar exibição de sub-atividades com numeração hierárquica X.Y');
    await allure.severity('critical');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    // Card pai com sub-atividades (curso de recon tem cards com toggle-children).
    const toggle = page.getByTestId('creation-studio-activity-card-toggle-children').first();
    const parentCard = studio.cards.filter({ has: toggle }).first();
    await expect(parentCard).toBeVisible();
    const parentTestId = (await parentCard.getAttribute('data-test-id')) ?? '';
    const parentId = parentTestId.replace('creation-studio-activity-card-', '');
    const children = studio.childrenContainer(parentId);

    await allure.step('2/4. Sub-atividades expandidas por padrão com numeração X.Y', async () => {
      // No Estúdio as sub-atividades já vêm expandidas (aria-expanded=true).
      await expect(children).toBeVisible();
      await expect(
        children.getByTestId('creation-studio-activity-card-position').filter({ hasText: /^\d+\.\d+$/ }).first(),
      ).toBeVisible();
    });

    await allure.step('5. Recolher sub-atividades (toggle oculta a árvore)', async () => {
      await toggle.click();
      await expect(children).toBeHidden();
    });

    await allure.step('6. Reexibir sub-atividades', async () => {
      await toggle.click();
      await expect(children).toBeVisible();
    });
  });
});
