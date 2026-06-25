import type { Locator, Page } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object do formulário "Novo conteúdo externo" (`/o/{orgId}/records/new`).
 *
 * Usado pela suíte Trial (TC1/TC4) para criar um registro Externo pela UI.
 * Recebe `orgId` explícito porque a suíte Trial roda contra a org Trial
 * (37078), não contra o env principal do projeto — `getOrgId()` apontaria
 * pro env errado.
 *
 * **Gotchas descobertos live (recon 2026-06-25, org Trial 37078)**:
 * - Comboboxes (Provedor/Conteúdo/Tipo/Categorias) são react-select
 *   *creatable*: digitar + Enter cria/seleciona. Localizados pelo placeholder
 *   único de cada um (ids `react-select-N-input` são mount-order, frágeis).
 * - Pessoas abre um drawer (`resource-selector-drawer`). O checkbox da pessoa
 *   é um `<input>` 1×1px interceptado pelo `.chakra-checkbox__control` — clicar
 *   no CARD (`people-selector-card-*`) é o que marca.
 * - `data-test-id="record-form-save-button"` fica no canto inferior esquerdo,
 *   exatamente sob o widget flutuante Sophia (`#plan_sub_notification_modal`
 *   / sophia.svg) que existe em toda org Trial → click normal é interceptado.
 *   `dispatchEvent('click')` contorna a actionability e submete o form
 *   (padrão `clicar-parent-expander-sem-href-twygo`). Validado live: redireciona
 *   pra listagem `/records` e o registro aparece (situation pending).
 * - `#endDate` é `<input type="date">` → preencher com `YYYY-MM-DD`.
 * - `#workload_seconds` aceita `HH:MM:SS` (ex.: `40:00:00`) e normaliza p/ `0040:00:00`.
 */

export interface NovoRegistroExternoInput {
  provider: string;
  content: string;
  experience: string;
  category: string;
  workload: string; // HH:MM:SS
  endDate: string; // YYYY-MM-DD
}

export class NovoRegistroExternoPage {
  constructor(
    private readonly page: Page,
    private readonly orgId: string | number,
  ) {}

  async goto(): Promise<void> {
    await safeGoto(this.page, `/o/${this.orgId}/records/new`);
    await this.page.getByRole('heading', { name: 'Novo conteúdo externo' }).waitFor({ state: 'visible' });
  }

  // ---------- Pessoas (drawer) ----------

  getPeopleSelectorInput(): Locator {
    return this.page.getByTestId('people-selector-input');
  }

  getPeopleDrawer(): Locator {
    return this.page.getByTestId('resource-selector-drawer');
  }

  /** Abre o drawer de Pessoas e vincula a primeira pessoa disponível. */
  async linkFirstPerson(): Promise<void> {
    await this.getPeopleSelectorInput().click();
    await this.getPeopleDrawer().waitFor({ state: 'visible' });
    // Clicar no CARD (não no checkbox — input 1×1px é interceptado pelo control Chakra).
    const firstCard = this.page.locator('[data-test-id^="people-selector-card-"]').first();
    await firstCard.click();
    await this.page.getByTestId('resource-selector-drawer-confirm-button').click();
    await this.getPeopleDrawer().waitFor({ state: 'hidden' });
  }

  // ---------- Comboboxes creatable (por label do campo) ----------

  /**
   * Localiza o input do react-select creatable pelo `role=group` do campo +
   * o label EXATO. Estável durante a digitação: o placeholder some assim que
   * você digita (causando re-resolução falha do locator), mas o label persiste.
   */
  private getCreatableInput(label: string): Locator {
    return this.page
      .getByRole('group')
      .filter({ has: this.page.getByText(label, { exact: true }) })
      .locator('input.creatable-select-field__input');
  }

  /** Digita o valor num combobox creatable e pressiona Enter (cria ou seleciona). */
  private async fillCreatable(label: string, value: string): Promise<void> {
    const input = this.getCreatableInput(label);
    await input.fill(value);
    await input.press('Enter');
  }

  async setProvider(value: string): Promise<void> {
    await this.fillCreatable('Provedor', value);
  }

  async setContent(value: string): Promise<void> {
    await this.fillCreatable('Conteúdo', value);
  }

  async setExperience(value: string): Promise<void> {
    await this.fillCreatable('Tipo de experiência', value);
  }

  async setCategory(value: string): Promise<void> {
    await this.fillCreatable('Categorias', value);
  }

  // ---------- Campos simples ----------

  async setWorkload(value: string): Promise<void> {
    await this.page.locator('#workload_seconds').fill(value);
  }

  async setEndDate(isoDate: string): Promise<void> {
    await this.page.locator('#endDate').fill(isoDate);
  }

  // ---------- Salvar ----------

  getSaveButton(): Locator {
    return this.page.getByTestId('record-form-save-button');
  }

  /**
   * Submete o form. `dispatchEvent('click')` porque o widget Sophia flutuante
   * intercepta o click físico no botão (canto inferior esquerdo). Espera o
   * redirect pra listagem de registros.
   */
  async save(): Promise<void> {
    await this.getSaveButton().dispatchEvent('click');
    await this.page.waitForURL(
      (url) => /\/records(?:$|\?)/.test(url.pathname + url.search) && !url.pathname.endsWith('/new'),
      { timeout: 30_000 },
    );
  }

  /** Fluxo completo de criação de um registro Externo pela UI. */
  async createExternalRecord(input: NovoRegistroExternoInput): Promise<void> {
    await this.linkFirstPerson();
    await this.setProvider(input.provider);
    await this.setContent(input.content);
    await this.setExperience(input.experience);
    await this.setCategory(input.category);
    await this.setWorkload(input.workload);
    await this.setEndDate(input.endDate);
    await this.save();
  }
}
