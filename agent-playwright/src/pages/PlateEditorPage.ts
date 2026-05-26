import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';

/**
 * Page Object pra interagir com o Plate Editor (rich-text Plate.js) em Twygo.
 *
 * Plate.js usa Slate.js por baixo. O editor renderiza como:
 *   <div role="textbox" data-slate-editor="true" contenteditable="true">
 *
 * Container e seletores canônicos vêm da skill testar-plate-editor-twygo.
 */
export class PlateEditorPage {
  constructor(private readonly page: Page) {}

  /**
   * Container principal do editor. Quando há múltiplos editores na página
   * (ex: instrução estrutura + instrução conteúdo), filtre pelo contexto
   * via `getEditor(nth)`.
   */
  getEditor(nth = 0): Locator {
    return this.page.locator('[data-slate-editor="true"]').nth(nth);
  }

  /**
   * Toolbar do Plate. Geralmente role=toolbar dentro do scope do editor.
   */
  getToolbar(): Locator {
    return this.page.locator('[role="toolbar"]').first();
  }

  /**
   * Insere texto via teclado no editor focado. Plate.js processa o keystroke
   * via handler React, então NÃO usar .fill() (vai sobrescrever o estado).
   */
  async typeText(text: string, options?: { nth?: number }): Promise<void> {
    const editor = this.getEditor(options?.nth ?? 0);
    await editor.click();
    await this.page.keyboard.type(text);
  }

  /**
   * Lê texto cru do editor (Slate.js usa <span> internos, então textContent
   * pode ter whitespace estranho — normalizamos via trim + collapse).
   */
  async readText(nth = 0): Promise<string> {
    const editor = this.getEditor(nth);
    const raw = (await editor.textContent()) || '';
    return raw.trim().replace(/\s+/g, ' ');
  }

  /**
   * Conta o número de caracteres no editor via lookup do contador de chars
   * Plate ("N / 500") associado ao editor. Útil para validar input grande
   * em Slate.js (textContent é mentiroso).
   */
  async getCharCount(): Promise<{ current: number; max: number } | null> {
    const counter = this.page.locator('p, span').filter({ hasText: /^\d+\s*\/\s*\d+$/ }).first();
    const text = (await counter.textContent()) || '';
    const match = text.match(/(\d+)\s*\/\s*(\d+)/);
    if (!match) return null;
    return { current: Number(match[1]), max: Number(match[2]) };
  }

  /**
   * Verifica que algum dos editores tem conteúdo (charCount > 0). Útil pra
   * validar auto-fill quando o textContent direto não funciona.
   */
  async expectHasContent(message = 'editor deveria ter conteúdo'): Promise<void> {
    const count = await this.getCharCount();
    expect(count?.current ?? 0, message).toBeGreaterThan(0);
  }

  /**
   * Inserir espaço reservado para IA (placeholder de prompt). Geralmente
   * via toolbar — botão com aria-label "IA" / "AI" / "espaço reservado" OR
   * shortcut. Catálogo de variantes deve crescer conforme uso.
   *
   * REVISAR: seletor canônico ainda não confirmado via audit live —
   * passar via parâmetro fica explícito até descobrirmos.
   */
  async insertAIPlaceholder(buttonName: RegExp | string = /IA|AI|placeholder/i): Promise<void> {
    await this.getToolbar().getByRole('button', { name: buttonName }).click();
  }

  /**
   * Insere logo do Kit de marca via toolbar. Mesma observação do
   * insertAIPlaceholder — seletor depende do UI real.
   */
  async insertLogo(buttonName: RegExp | string = /Logo|Imagem/i): Promise<void> {
    await this.getToolbar().getByRole('button', { name: buttonName }).click();
  }
}
