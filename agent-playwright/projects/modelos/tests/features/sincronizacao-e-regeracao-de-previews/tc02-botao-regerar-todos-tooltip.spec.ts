import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

// FIXME (2026-05-20): TC depende de Kit alterado previamente (TC1) E do botão
// "Regerar todos" estar visível na aba Design. Audit screenshot mostrou que
// o spec não chegou na aba Design — gotoFirstModelEditStructure + click tab-design
// retornou a aba Identificação. Pode requerer URL direta ?tab=design + wait
// melhor. Botão "Regerar todos" só renderiza quando há designs com Kit defasado;
// sem o TC1 funcional, TC2 fica bloqueado.
// Destinatário: QA Lead — sequenciar TC1 → TC2 → TC3 como cenário único OU
// re-implementar com helpers que controlam estado encadeado.
test.describe.fixme('Sincronização e Regeração de Previews', () => {
  test('Botão "Regerar todos" exibe tooltip correto', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Sincronização e Regeração de Previews');
    await allure.story('Botão "Regerar todos" exibe tooltip correto');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Acessar aba Design do modelo (com Kit alterado)', async () => {
      // TC1 já alterou o Kit; aqui acessamos a aba Design pra ver o botão
      // "Regerar todos". Se rodar isolado e o Kit ainda não estiver alterado,
      // botão pode não aparecer — REVISAR depende de estado de TC1.
      await editPage.gotoFirstModelEditStructure();
      await page.locator('[data-test-id="tab-design"]').click();
      await page.waitForTimeout(2000);
    });

    await allure.step('2. Validar botão "Regerar todos" + tooltip literal', async () => {
      const regerarBtn = page.getByRole('button', { name: /Regerar todos/i }).first();
      await expect(regerarBtn).toBeVisible({ timeout: 10_000 });
      // Tooltip: hover dispara
      await regerarBtn.hover();
      await expect(
        page.locator('[role="tooltip"]').filter({ hasText: 'O kit de marca foi alterado' }),
      ).toBeVisible({ timeout: 5_000 });
    });
  });
});
