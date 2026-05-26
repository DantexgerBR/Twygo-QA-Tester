import type { Locator } from '@playwright/test';
import { expect } from '@playwright/test';

export interface ExpectImageLoadedOptions {
  timeout?: number;
  expectMinWidth?: number;
}

/**
 * Valida que uma imagem foi carregada com sucesso (não-broken).
 * - visible no DOM
 * - tem atributo src
 * - complete=true + naturalWidth>0 (broken images têm naturalWidth=0)
 *
 * Substitui o anti-pattern `expect(img).toBeVisible()` que passa mesmo
 * com imagem quebrada. Ver skill validar-preview-visual-twygo + CONTRACT.md §15.
 */
export async function expectImageLoaded(
  locator: Locator,
  options: ExpectImageLoadedOptions = {},
): Promise<void> {
  const { timeout = 5000, expectMinWidth = 1 } = options;

  await expect(locator).toBeVisible({ timeout });

  const src = await locator.getAttribute('src');
  expect(src, 'img sem atributo src').toBeTruthy();

  // Retry loop até a imagem terminar de carregar (complete + naturalWidth>0)
  await expect(async () => {
    const state = await locator.evaluate((img: HTMLImageElement) => ({
      complete: img.complete,
      naturalWidth: img.naturalWidth,
    }));
    expect(state.complete, `imagem ainda carregando (src=${src})`).toBe(true);
    expect(
      state.naturalWidth,
      `imagem broken (naturalWidth=${state.naturalWidth}, src=${src})`,
    ).toBeGreaterThanOrEqual(expectMinWidth);
  }).toPass({ timeout, intervals: [200, 500, 1000] });
}

/**
 * Inverso: valida que a imagem está QUEBRADA (não carregou).
 * Útil para TCs que validam graceful degradation.
 */
export async function expectImageBroken(
  locator: Locator,
  options: { timeout?: number } = {},
): Promise<void> {
  const { timeout = 5000 } = options;
  await expect(locator).toBeVisible({ timeout });
  await expect(async () => {
    const state = await locator.evaluate((img: HTMLImageElement) => ({
      naturalWidth: img.naturalWidth,
    }));
    expect(state.naturalWidth, 'esperava imagem quebrada (naturalWidth=0)').toBe(0);
  }).toPass({ timeout, intervals: [200, 500, 1000] });
}
