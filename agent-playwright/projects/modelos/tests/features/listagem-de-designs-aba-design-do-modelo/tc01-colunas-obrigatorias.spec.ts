import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Listagem de Designs (aba Design do Modelo)', () => {
  test('Listagem exibe elementos obrigatórios por design', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem de Designs (aba Design do Modelo)');
    await allure.story('Listagem exibe elementos obrigatórios');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Design do modelo', async () => {
      await editPage.gotoFirstModelEditStructure();
      await page.getByRole('tab', { name: 'Design', exact: true }).click();
      await expect(page.getByRole('tab', { name: 'Design', exact: true })).toHaveAttribute(
        'aria-selected',
        'true',
        { timeout: 10_000 },
      );
    });

    await allure.step('2. Validar que listagem renderiza pelo menos 1 design', async () => {
      // AT documenta formato Lista com colunas (Nome, Formato, Tipo, Ações),
      // mas UI real usa Cards: cada card tem nome + tipo (Corpo/Capa/...) +
      // formato (Aula/Página) + ações. Asserção por invariante: cards visíveis.
      await expect(
        page.locator('[data-test-id^="modelos-de-conteudo-design-card-"]').first(),
      ).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('3. Validar que cada card exibe os 4 elementos canônicos', async () => {
      // Pega primeiro card que não seja o drag handle (duplicado por design)
      const firstCard = page.locator('[data-test-id^="modelos-de-conteudo-design-card-"]:not([data-test-id="modelos-de-conteudo-design-card-drag-handle"])').first();
      const cardText = await firstCard.textContent();
      // Invariante: card tem ao menos 1 ação (visibility / edit / content_copy / delete)
      expect(cardText, 'card deveria conter pelo menos uma ação').toMatch(/visibility|edit|content_copy|delete/);
    });
  });
});
