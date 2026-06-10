import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  test('Validar botão "Recolher lista de atividades"', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar botão "Recolher lista de atividades"');
    await allure.severity('normal');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);
    await expect(studio.cards.first()).toBeVisible();

    await allure.step('1. Recolher a lista de atividades', async () => {
      // "Recolher" e "Expandir" são botões distintos (recon 2026-06-03):
      // ao recolher, o botão "Recolher" some e dá lugar a "Expandir".
      await studio.collapseList();
      await expect(studio.cards.first()).toBeHidden();
      await expect(studio.expandButton).toBeVisible();
    });

    await allure.step('2. Expandir novamente a lista', async () => {
      await studio.expandList();
      await expect(studio.cards.first()).toBeVisible();
    });
  });
});
