import { expect, type Page, type Locator } from '@playwright/test';

/**
 * Clica numa tab `role="tab"` garantindo que ela esteja habilitada antes.
 *
 * Problema canônico: tabs Twygo em fluxos wizard (knowledge_repositories form,
 * painel form, etc) têm atributo HTML `disabled` enquanto o passo anterior
 * não foi salvo. Playwright `.click()` faz actionability check que inclui
 * "não disabled" — se a tab continua disabled (race entre save→redirect e
 * re-render React removendo disabled), o click espera 30s e dá timeout.
 *
 * Sintoma frequente:
 *   `TimeoutError: locator.click: Timeout 30000ms exceeded.
 *    Call log: - waiting for getByRole('tab', { name: 'Fontes de conhecimento' })`
 *
 * Causa raiz NÃO é "Web Component sem role" — tabs são `<button role="tab">`
 * Chakra padrão. O problema é o `disabled=""` HTML attribute removido apenas
 * após o save anterior completar + React re-renderizar.
 *
 * Use no lugar de `page.getByRole('tab', { name }).click()` SEMPRE.
 *
 * **`scope`**: `Page` ou `Locator` (ancorar em dialog/section quando há
 * múltiplos tablists — ex: form dentro de modal + tabs do app por baixo).
 *
 * **`opts.timeout`** (default 30_000): cap pro toBeEnabled.
 *
 * **`opts.selected`** (default `false`): se true, valida `aria-selected="true"`
 * pós-click (5s extra). Útil quando o spec depende imediatamente do conteúdo
 * da tab ter renderizado.
 *
 * Documentação completa: skill `testar-tabs-progressivas-twygo`.
 */
export async function clickTabWhenEnabled(
  scope: Page | Locator,
  name: string | RegExp,
  opts: { timeout?: number; selected?: boolean } = {},
): Promise<void> {
  const timeout = opts.timeout ?? 30_000;
  const tab = scope.getByRole('tab', { name });
  await expect(tab).toBeEnabled({ timeout });
  await tab.click();
  if (opts.selected) {
    await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 5_000 });
  }
}
