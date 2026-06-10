import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  test('Validar header da aba "Atividades" com contagem total', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar header da aba "Atividades" com contagem total');
    await allure.severity('critical');

    const studio = new StudioActivitiesPage(page);

    await allure.step('2/3. Abrir a aba Atividades e validar o heading "Atividades (N)"', async () => {
      await studio.goto(suiteData.contentId);
      await expect(studio.listTitle).toBeVisible();
      // Invariante (não o literal "32" da AT): a contagem do header reflete o
      // total real de cards top-level carregados.
      await expect(studio.listTitle).toHaveText(/Atividades\s*\(\d+\)/);
      const headerCount = await studio.titleCount();
      const cardCount = await studio.cards.count();
      expect(headerCount).toBe(cardCount);
    });

    await allure.step('4. Validar botões "Adicionar" e "Recolher lista" no cabeçalho', async () => {
      await expect(studio.addButton).toBeVisible();
      await expect(studio.collapseButton).toBeVisible();
    });
  });
});
