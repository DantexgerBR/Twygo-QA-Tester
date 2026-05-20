import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

// Page Object pra criação/edição de Design (Aula) dentro de um modelo.
// Análogo a DesignPageEditPage mas usa kind=lesson na URL.
export class DesignLessonEditPage {
  constructor(private readonly page: Page) {}

  async gotoNew(contentModelId: number | string): Promise<void> {
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/content_models/${contentModelId}/template_designs/new?kind=lesson`,
    );
    await this.expectIdentificationTabActive();
  }

  async gotoFromFirstModel(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
    await this.page.waitForTimeout(1500);
    const editIcon = this.page
      .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
      .first();
    await editIcon.evaluate((el: HTMLElement) => el.click());
    await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
    await this.page.locator('[data-test-id="tab-design"]').click();
    await expect(this.page.locator('[data-test-id="tab-design"]')).toHaveAttribute(
      'aria-selected',
      'true',
      { timeout: 10_000 },
    );
    await this.page.locator('[data-test-id="content-models-design-add-menu-button"]').click();
    await this.page.waitForTimeout(500);
    await this.page.locator('[data-test-id="content-models-design-add-lesson"]').click();
    await this.expectIdentificationTabActive();
  }

  async expectIdentificationTabActive(): Promise<void> {
    await expect(this.page).toHaveURL(/template_designs\/new.*kind=lesson/, { timeout: 15_000 });
    await this.page.waitForTimeout(1500);
  }

  nameInput(): Locator {
    return this.page.locator('#content-models-page-name-input');
  }

  sequenceInput(): Locator {
    return this.page.locator('#sequence');
  }

  // Tipo do Design de Aula (creatable select análogo ao Página).
  // O label htmlFor deve ser content-models-lesson-type-creatable (analógico).
  // Se diferir, REVISAR via audit.
  async selectTipo(option: 'Capa' | 'Introdução' | 'Corpo' | 'Encerramento' | 'Recapitulação' | 'Sumário'): Promise<void> {
    // Tenta os 2 IDs canônicos (page e lesson) — fallback robusto.
    const wrapperLesson = this.page.locator(
      'xpath=//label[@for="content-models-lesson-type-creatable"]/following-sibling::*[1]',
    );
    const wrapperPage = this.page.locator(
      'xpath=//label[@for="content-models-page-type-creatable"]/following-sibling::*[1]',
    );
    const wrapper = (await wrapperLesson.isVisible().catch(() => false)) ? wrapperLesson : wrapperPage;
    await wrapper.click();
    await this.page.waitForTimeout(500);
    const rsInput = this.page.locator('input[id^="react-select-"]:visible').last();
    if (await rsInput.isVisible().catch(() => false)) {
      await rsInput.fill(option);
      await this.page.waitForTimeout(400);
    }
    await this.page.getByText(option, { exact: true }).first().click();
    await this.page.waitForTimeout(500);
  }

  saveButton(): Locator {
    return this.page.locator('button[type="submit"]').filter({ hasText: /^Salvar$/ }).first();
  }

  async save(): Promise<void> {
    const btn = this.saveButton();
    await btn.scrollIntoViewIfNeeded();
    await btn.evaluate((el: HTMLButtonElement) => el.click());
  }
}
