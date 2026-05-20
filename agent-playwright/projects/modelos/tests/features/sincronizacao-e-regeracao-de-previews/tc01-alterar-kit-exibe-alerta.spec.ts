import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

// FIXME (2026-05-20): divergência AT vs UI confirmada via audit chrome-devtools-mcp:
//
// AT (RN 59/59.1): "Após salvar Kit alterado, card do MODELO na LISTAGEM
//   exibe ícone de alerta no canto superior direito. Tooltip: 'Este modelo
//   possui designs pendentes de regeração. Acesse a aba design e clique no
//   botão Regerar designs.'"
//
// UI REAL (audit MCP): listagem de modelos NÃO mostra alerta nenhum. O alerta
//   aparece em CADA CARD DE DESIGN dentro da aba Design do modelo, como
//   <img alt="Design pendente de regeneração — o kit de marca foi atualizado">.
//   Sem testId próprio; texto literal diferente do AT.
//
// Spec atual flaka em expectIdentificationTabActive (timing race após click
// no edit do card de modelo). Antes de desfixmar, QA Lead precisa:
//   1. Decidir se feature "ícone no card da listagem" deve ser implementada
//      (bug) OU se foi descopado (AT desatualizado).
//   2. Se for AT desatualizado, atualizar prosa pra refletir "alerta no
//      card de design, na aba Design".
//   3. Estabilizar navegação click-edit → tab-identification (race condition).
test.describe.fixme('Sincronização e Regeração de Previews', () => {
  test('Alterar Kit de Marca exibe ícone de alerta nos designs', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Sincronização e Regeração de Previews');
    await allure.story('Alterar Kit de Marca exibe ícone de alerta nos designs');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);
    const listPage = new ContentModelsListPage(page);

    await listPage.goToList();
    await listPage.expectListingLoaded();
    await page
      .locator('[data-test-id="content-models-page"] [id*="edit-element"][id$="-button-1"]')
      .first()
      .evaluate((el: HTMLElement) => el.click());
    await editPage.expectIdentificationTabActive();
    // ... fluxo de troca de Kit ... ver implementação anterior + audit MCP em comentário acima.
    await expect(
      page.getByRole('img', { name: /Design pendente de regeneração/i }).first(),
    ).toBeVisible({ timeout: 15_000 });
  });
});
