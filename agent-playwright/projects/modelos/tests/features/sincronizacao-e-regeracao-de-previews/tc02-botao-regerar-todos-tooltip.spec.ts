import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

// FIXME (2026-05-20): audit MCP confirmou que botão "Regerar todos"
// (data-test-id="modelos-de-conteudo-design-regenerate") existe e renderiza
// quando Kit foi alterado, MAS não tem tooltip implementado:
//   - sem atributo title
//   - sem aria-label
//   - sem aria-describedby
//   - sem wrapper Chakra Tooltip
// Hover via MCP não disparou nada. AT (RN 59.3) documenta tooltip literal
// "O kit de marca foi alterado. Clique em 'Regerar todos'..." — divergência
// produto vs AT. Destinatário: PO/QA Lead validar se tooltip deveria existir
// (UX defendendo "Regerar todos" como ação clara) ou se foi descopado.
test.describe.fixme('Sincronização e Regeração de Previews', () => {
  test('Botão "Regerar todos" exibe tooltip correto', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Sincronização e Regeração de Previews');
    await allure.story('Botão "Regerar todos" exibe tooltip correto');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await editPage.gotoFirstModelEditStructure();
    await page.getByRole('tab', { name: 'Design', exact: true }).click();
    await page.waitForTimeout(2000);
    const regerarBtn = page.locator('[data-test-id="modelos-de-conteudo-design-regenerate"]');
    await regerarBtn.hover();
    await expect(
      page.locator('[role="tooltip"]').filter({ hasText: 'O kit de marca foi alterado' }),
    ).toBeVisible({ timeout: 5_000 });
  });
});
