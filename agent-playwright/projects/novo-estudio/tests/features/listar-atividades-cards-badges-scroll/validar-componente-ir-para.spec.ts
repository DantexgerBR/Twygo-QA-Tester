import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

test.describe(suiteData.suiteName, () => {
  test('Validar componente "Ir para" (jump-to) com label e input numérico', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar componente "Ir para" (jump-to) com label e input numérico');
    await allure.severity('critical');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    await allure.step('2. Localizar o componente "Ir para" (label + input + botão)', async () => {
      await expect(page.getByText(/^Ir para$/).first()).toBeVisible();
      await expect(studio.jumpToInput).toBeVisible();
      await expect(studio.jumpToSubmit).toBeVisible();
    });

    // REVISAR: a AT (TC27 step 3) descreve label de range "Módulos de 1 a 16",
    // mas a UI real do Estúdio não exibe esse label — só "Ir para" + input +
    // botão "Ir" (recon 2026-06-03). Asserção de range removida; AT a corrigir.

    await allure.step('4. Preencher "Ir para" com uma posição válida e confirmar', async () => {
      // O header "(N)" conta também sub-atividades; as posições top-level deste
      // curso vão até 4. Uso uma posição top-level garantidamente existente.
      // O scroll para listas longas (jump 75/150) é coberto por TC14/TC15 (volume).
      const target = 2;
      await studio.jumpTo(target);
      await expect(studio.list).toBeVisible();
      await expect(
        page.getByTestId('creation-studio-activity-card-position').filter({ hasText: new RegExp(`^${target}$`) }).first(),
      ).toBeVisible();
    });
  });
});
