import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  test('Validar checkbox de seleção em massa', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar checkbox de seleção em massa');
    await allure.severity('normal');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    const c0 = studio.cards.nth(0);
    const c1 = studio.cards.nth(1);
    const c2 = studio.cards.nth(2);

    await allure.step('2. Marcar o checkbox de 3 atividades distintas', async () => {
      await studio.toggleSelect(c0);
      await studio.toggleSelect(c1);
      await studio.toggleSelect(c2);
      await expect(studio.checkboxInput(c0)).toBeChecked();
      await expect(studio.checkboxInput(c1)).toBeChecked();
      await expect(studio.checkboxInput(c2)).toBeChecked();
    });

    await allure.step('3. Ações em massa ficam disponíveis (Excluir habilita)', async () => {
      await expect(page.getByRole('button', { name: 'Excluir' }).first()).toBeEnabled();
    });

    await allure.step('4. Desmarcar uma — 2 permanecem selecionadas', async () => {
      await studio.toggleSelect(c1);
      await expect(studio.checkboxInput(c1)).not.toBeChecked();
      await expect(studio.checkboxInput(c0)).toBeChecked();
      await expect(studio.checkboxInput(c2)).toBeChecked();
    });
  });
});
