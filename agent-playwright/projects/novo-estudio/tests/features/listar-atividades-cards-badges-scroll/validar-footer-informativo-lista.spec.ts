import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  // fixme [seed-ausente]: o footer informativo "Mostrando N de M ... / Role até
  // o fim para carregar mais" e a dica de drag só renderizam quando a lista
  // PAGINA (>50 atividades). O curso de recon (807533) tem 12 — recon
  // 2026-06-03 confirmou que a cauda da lista não exibe esse footer. Requer
  // curso de alto volume (seed em massa via API/DB), mesmo bloqueio de TC12/13.
  test('Validar footer informativo da lista (paginação visual)', async ({ page }) => {
    test.fixme(true, '[seed-ausente] footer "Mostrando N de M / Role até o fim" só renderiza com paginação (>50 atividades); curso de recon tem 12. Requer curso de alto volume (API/DB). RN 16. Ver TCS-IGNORADOS-reproducao-manual.md.');
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar footer informativo da lista (paginação visual)');
    await allure.severity('normal');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);
    await studio.scrollArea.evaluate((el) => el.scrollTo(0, el.scrollHeight));
    await expect(page.getByText(/Mostrando\s+\d+\s+de\s+\d+/i)).toBeVisible();
    await expect(
      page.getByText(/Arraste uma atividade sobre outra para criar sub-atividades/i),
    ).toBeVisible();
  });
});
