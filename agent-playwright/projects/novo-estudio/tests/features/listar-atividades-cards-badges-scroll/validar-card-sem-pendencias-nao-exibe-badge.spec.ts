import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

// TC8 — Card sem pendências NÃO exibe badge de etapa. Read-only: o curso base
// (807533) tem as 12 atividades completas (Liberada), então qualquer card base
// serve. Validado via recon 2026-06-04: card completo → 0 pending-badge + status
// "Liberada".
test.describe(suiteData.suiteName, () => {
  test('Validar card sem pendências NÃO exibe badges', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar card sem pendências NÃO exibe badges');
    await allure.severity('normal');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    // 1ª atividade é completa (badges seed, se houver, entram no FIM da lista).
    const completeCard = studio.cards.first();
    await expect(completeCard).toBeVisible();

    await allure.step('Card completo não exibe badge de pendências', async () => {
      await expect(studio.pendingBadge(completeCard)).toHaveCount(0);
    });

    await allure.step('Card completo exibe status "Liberada"', async () => {
      await expect(studio.statusReleased(completeCard)).toBeVisible();
    });
  });
});
