import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

// Page Object pra criação/edição de Design (Página) dentro de um modelo.
// Suite: Criação de Design de Página.
export class DesignPageEditPage {
  constructor(private readonly page: Page) {}

  // Navega direto pra criação de novo design tipo Página.
  // contentModelId = ID do modelo dono. Sem ID conhecido, usar gotoFromModelDesignTab.
  async gotoNew(contentModelId: number | string): Promise<void> {
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/content_models/${contentModelId}/template_designs/new?kind=page`,
    );
    await this.expectIdentificationTabActive();
  }

  // Caminho via UI: aba Design do modelo → Adicionar → Página.
  async gotoFromFirstModel(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
    await this.page.waitForTimeout(1500);
    const editIcon = this.page
      .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
      .first();
    await editIcon.evaluate((el: HTMLElement) => el.click());
    await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
    const designTab = this.page.getByRole('tab', { name: 'Design', exact: true });
    await designTab.click();
    await expect(designTab).toHaveAttribute('aria-selected', 'true', { timeout: 10_000 });
    // Clica Adicionar (menu trigger)
    await this.page.locator('[data-test-id="content-models-design-add-menu-button"]').click();
    await this.page.waitForTimeout(500);
    await this.page.locator('[data-test-id="content-models-design-add-page"]').click();
    await this.expectIdentificationTabActive();
  }

  async expectIdentificationTabActive(): Promise<void> {
    await expect(this.page).toHaveURL(/template_designs\/new/, { timeout: 15_000 });
    await this.page.waitForTimeout(1500);
  }

  // Botões menu Adicionar (estado: aba Design do modelo)
  addMenuButton(): Locator {
    return this.page.locator('[data-test-id="content-models-design-add-menu-button"]');
  }
  addLessonOption(): Locator {
    return this.page.locator('[data-test-id="content-models-design-add-lesson"]');
  }
  addPageOption(): Locator {
    return this.page.locator('[data-test-id="content-models-design-add-page"]');
  }

  // Campos da aba Identificação do Design
  nameInput(): Locator {
    return this.page.locator('#content-models-page-name-input');
  }

  sequenceInput(): Locator {
    return this.page.locator('#sequence');
  }

  // Tipo: react-select creatable. Label htmlFor="content-models-page-type-creatable".
  // Selecionar via keyboard (ArrowDown navega options, Enter confirma) ou texto direto.
  async selectTipo(option: 'Capa' | 'Introdução' | 'Corpo' | 'Encerramento' | 'Recapitulação' | 'Sumário'): Promise<void> {
    // Click no campo (container do react-select)
    const wrapper = this.page.locator(
      'xpath=//label[@for="content-models-page-type-creatable"]/following-sibling::*[1]',
    );
    await wrapper.click();
    await this.page.waitForTimeout(500);
    // Procura input interno
    const rsInput = this.page.locator('input[id^="react-select-"]:visible').last();
    if (await rsInput.isVisible().catch(() => false)) {
      await rsInput.fill(option);
      await this.page.waitForTimeout(400);
    }
    // Click no option literal
    await this.page.getByText(option, { exact: true }).first().click();
    await this.page.waitForTimeout(500);
  }

  // Botão Salvar (Identificação do design — fica no canto direito bottom)
  saveButton(): Locator {
    // Sem testId conhecido. Procura submit dentro do form com texto "Salvar".
    return this.page.locator('button[type="submit"]').filter({ hasText: /^Salvar$/ }).first();
  }

  async save(): Promise<void> {
    const btn = this.saveButton();
    await btn.scrollIntoViewIfNeeded();
    await btn.evaluate((el: HTMLButtonElement) => el.click());
  }
}
