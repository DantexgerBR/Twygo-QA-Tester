import type { Page, Locator } from '@playwright/test';

/**
 * Fecha modais oportunistas que aparecem em sessões do Twygo e podem
 * bloquear cliques em elementos da página principal:
 * - NPS Sofia ("Em uma escala de 1 a 10...") — botão "Close" no banner
 * - "Continuar mesmo assim" (modal de aviso de sessão) — botão homônimo
 *
 * O modal NPS pode aparecer alguns segundos APÓS goto (gatilho de inactivity).
 * Por isso, o helper itera até `maxAttempts` ou até nenhum dialog estar
 * visível, com timeouts curtos por iteração.
 *
 * Chame logo após `page.goto(...)`.
 */
export async function dismissCommonModals(
  page: Page,
  opts: { maxAttempts?: number } = {},
): Promise<void> {
  const maxAttempts = opts.maxAttempts ?? 3;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    let clickedAny = false;

    const candidates: Locator[] = [
      page.getByRole('dialog', { name: /sofia/i }).getByRole('button', { name: /close/i }),
      page.getByRole('button', { name: /Continuar mesmo assim/i }).first(),
      page.getByRole('link', { name: /Continuar mesmo assim/i }).first(),
      // Botão "Close" genérico em qualquer dialog visível (cobre casos novos)
      page.getByRole('dialog').getByRole('button', { name: /close/i }).first(),
    ];

    for (const cand of candidates) {
      const visible = await cand.isVisible().catch(() => false);
      if (visible) {
        await cand.click({ timeout: 1500 }).catch(() => null);
        clickedAny = true;
      }
    }

    // Se não havia nada visível pra fechar, sai. Se fechou algo, dá uma volta
    // pra cobrir modais sequenciais (Sofia depois do "Continuar...", p.ex.).
    if (!clickedAny) return;
  }
}
