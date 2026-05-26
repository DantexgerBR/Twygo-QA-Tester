import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';

export interface MarcaDaguaConfig {
  habilitada: boolean;
  tipo: 'fixa' | 'em_movimento' | null;
  posicoes: string[];
  informacoes: string[];
  corFonte: string;
}

export class AdminVideoPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  private editUrl(eventoId: number, atividadeId: number): string {
    return `/e/${eventoId}/contents/${atividadeId}/edit`;
  }

  async abrirEdicao(eventoId: number, atividadeId: number): Promise<void> {
    await safeGoto(this.page, this.editUrl(eventoId, atividadeId));
  }

  getCheckboxMarcaDagua(): Locator {
    return this.page.locator('#water-mark-video-enabled');
  }

  getLabelMarcaDagua(): Locator {
    return this.page.locator('label.chakra-checkbox').filter({ hasText: /Habilitar marca d.água no vídeo/i });
  }

  getRadioFixa(): Locator {
    return this.page.locator('input[type="radio"][value="0"]').first();
  }

  getRadioEmMovimento(): Locator {
    return this.page.locator('input[type="radio"][value="1"]').first();
  }

  getInputCorFonte(): Locator {
    return this.page.locator('#water-mark-video-font-color');
  }

  getBotaoSalvar(): Locator {
    return this.page.locator('#button_send_form');
  }

  async estaMarcado(): Promise<boolean> {
    return this.getCheckboxMarcaDagua().isChecked();
  }

  async habilitarMarcaDagua(): Promise<void> {
    const checked = await this.estaMarcado();
    if (!checked) {
      await this.getLabelMarcaDagua().click();
      await expect(this.getCheckboxMarcaDagua()).toBeChecked();
    }
  }

  async desabilitarMarcaDagua(): Promise<void> {
    const checked = await this.estaMarcado();
    if (checked) {
      await this.getLabelMarcaDagua().click();
      await expect(this.getCheckboxMarcaDagua()).not.toBeChecked();
    }
  }

  async selecionarTipoFixa(): Promise<void> {
    const label = this.page.locator('label').filter({ hasText: /^Fixa$/i });
    await label.click();
  }

  async selecionarTipoEmMovimento(): Promise<void> {
    const label = this.page.locator('label').filter({ hasText: /^Em movimento$/i });
    await label.click();
  }

  async setCorFonteHex(hex: string): Promise<void> {
    const input = this.getInputCorFonte();
    await input.fill(hex);
    await input.press('Tab');
  }

  async salvar(): Promise<void> {
    await this.getBotaoSalvar().click();
  }

  async lerConfigMarcaDagua(): Promise<MarcaDaguaConfig> {
    const habilitada = await this.estaMarcado();

    if (!habilitada) {
      return { habilitada: false, tipo: null, posicoes: [], informacoes: [], corFonte: '' };
    }

    const tipoFixaChecked = await this.page
      .locator('label')
      .filter({ hasText: /^Fixa$/i })
      .locator('input[type="radio"]')
      .isChecked()
      .catch(() => false);

    const tipo = tipoFixaChecked ? 'fixa' : 'em_movimento';

    const posicoes: string[] = await this.page
      .locator('.select-field__multi-value__label')
      .allInnerTexts();

    const informacoes: string[] = await this.page
      .locator('.chakra-select__multi-value__label, [class*="multi-value__label"]')
      .allInnerTexts();

    const corFonte = await this.getInputCorFonte().inputValue().catch(() => '');

    return { habilitada, tipo, posicoes, informacoes, corFonte };
  }

  async clicarRadioMediaType(tipo: string): Promise<void> {
    await this.page.locator(`input[type="radio"][value="${tipo}"]`).click();
  }

  isSecaoMarcaDaguaVisivelLocator(): Locator {
    return this.page.locator('#water-mark-video-enabled');
  }
}
