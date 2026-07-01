import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Aba "Configurações" do menu Controle de IA
 * (`/o/{orgId}/ai_consumption_analysis?tab=settings`).
 *
 * Encapsula o switch "Acesso de IA" — toggle que habilita/desabilita a
 * funcionalidade de preenchimento por IA na organização (TC5 da suíte 1.15).
 *
 * Switch Chakra: `<label data-test-id="...-ai-access-switch-{orgId}">` com
 * `data-checked` presente = ON (skill `interagir-switch-chakra-twygo`).
 * Recon 2026-06-29: nasce ON na org 37093.
 */
export class AiSettingsPage {
  constructor(
    private readonly page: Page,
    private readonly orgId: string | number,
  ) {}

  async goto(): Promise<void> {
    await safeGoto(this.page, `/o/${this.orgId}/ai_consumption_analysis?tab=settings`);
    await expect(this.accessSwitch()).toBeVisible({ timeout: 20_000 });
  }

  accessSwitch(): Locator {
    return this.page.locator(`[data-test-id="ai-consumption-analysis-settings-ai-access-switch-${this.orgId}"]`);
  }

  /** Estado atual do switch de acesso de IA (ON = `data-checked` presente). */
  async isAccessOn(): Promise<boolean> {
    return (await this.accessSwitch().getAttribute('data-checked')) !== null;
  }

  /**
   * Liga/desliga o switch de acesso de IA de forma idempotente
   * (skill `interagir-switch-chakra-twygo`: scroll → force click).
   */
  async setAccess(on: boolean): Promise<void> {
    const sw = this.accessSwitch();
    if ((await this.isAccessOn()) === on) return;
    await sw.scrollIntoViewIfNeeded();
    await sw.click({ force: true });
    await expect
      .poll(async () => this.isAccessOn(), { timeout: 10_000 })
      .toBe(on);
  }
}
