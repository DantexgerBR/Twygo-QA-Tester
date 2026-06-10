import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  test('Validar checkbox de seleção da atividade no card-rich', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar checkbox de seleção da atividade no card-rich');
    await allure.severity('normal');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);
    const card = studio.cards.first();

    await allure.step('2/3. Marcar o checkbox e validar estado selecionado', async () => {
      // aria-label real do input é genérico "Selecionar atividade" (a AT TC33
      // descreve "Selecionar atividade: <nome>" — divergência menor, REVISAR no AT).
      const cb = studio.checkboxInput(card);
      // garante estado inicial desmarcado (robusto a seleção residual/flaky)
      if (await cb.isChecked()) {
        await studio.toggleSelect(card);
      }
      await expect(cb).not.toBeChecked();
      await studio.toggleSelect(card);
      await expect(cb).toBeChecked();
    });
  });
});
