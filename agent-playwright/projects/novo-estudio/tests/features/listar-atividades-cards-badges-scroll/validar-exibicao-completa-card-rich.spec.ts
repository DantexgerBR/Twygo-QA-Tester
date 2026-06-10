import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  test('Validar exibição completa do card-rich da atividade', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar exibição completa do card-rich da atividade');
    await allure.severity('critical');

    const studio = new StudioActivitiesPage(page);

    await allure.step('2. Aguardar a coluna esquerda da lista de atividades ser exibida', async () => {
      await studio.goto(suiteData.contentId);
      await expect(studio.list).toBeVisible();
      await expect(studio.cards.first()).toBeVisible();
    });

    await allure.step('3. Verificar os componentes do card-rich da atividade', async () => {
      const card = studio.cards.first();
      // Componentes sempre presentes no card-rich (badges de etapa são
      // condicionais a pendências — cobertos por TC2-8).
      await expect(studio.checkbox(card)).toBeVisible();
      await expect(studio.dragHandle(card)).toBeVisible();
      await expect(studio.position(card)).toHaveText(/^\d+$/);
      await expect(studio.type(card)).toBeVisible();
      await expect(studio.title(card)).toBeVisible();
    });
  });
});
