import type { Locator, Page } from '@playwright/test';

/**
 * Page Object do widget Sophia (mascote coruja no canto inferior esquerdo,
 * visível somente em organizações Trial Twygo).
 *
 * Fluxo coberto: click no ícone flutuante → popover "Oi, eu sou a Sophia." com 4
 * opções → click em "Excluir informações" → modal com 4 checkboxes de
 * categorias de dados → confirmar/cancelar.
 *
 * **Gotchas descobertos live (2026-05-15, chrome-devtools-mcp)**:
 * - `#trial-menu-header` existe mas tem `visibility: hidden` (CSS). Click
 *   Playwright nele não dispara o expand. O `onclick` real está no
 *   ancestor 3 níveis acima (class hashada Chakra, `position: fixed`,
 *   `z-index: 990`, bottom-left). Solução: `evaluate` que sobe o DOM e
 *   dispara click programático no primeiro ancestor com `onclick`.
 * - Modal Chakra renderiza como `<section class="chakra-modal__content">`,
 *   NÃO como `[role="dialog"]` puro — esse último também casa popovers de
 *   notificação. Filtramos por `.chakra-modal__content` + texto único.
 * - Checkboxes são `<input type="checkbox">` 1×1px hidden dentro de
 *   `<label class="chakra-checkbox">`. Click no input ou no label não
 *   marca — apenas click no irmão `<span class="chakra-checkbox__control">`
 *   (o quadradinho visual) dispara o onChange React. Estrutura:
 *
 *     <div.css-uqr5jf>                          ← row
 *       <div.css-q2t97v>
 *         <label.chakra-checkbox>
 *           <input.chakra-checkbox__input ...>  ← 1×1px, NÃO clicável
 *           <span.chakra-checkbox__control>     ← CLICÁVEL
 *         </label>
 *       </div>
 *       <span.chakra-text>{texto da opção}</span>
 *     </div>
 *
 * - Botão "Excluir" começa `disabled` (HTML attr) — habilita quando ≥1
 *   checkbox marcado.
 *
 * Skills: `testar-exclusao-dados-trial-twygo`, `provisionar-trial-projeto-twygo`.
 */

export type DeleteOption =
  | 'sophiatech'      // Todas as informações pré-definidas da SophiaTech
  | 'admin-content'   // Cursos, Trilhas e Conteúdos criados pelos administradores
  | 'admin-users'     // Usuários cadastrados pelos administradores
  | 'all';            // Todas informações (pré-definidas e criadas pelos administradores)

const OPTION_TEXT: Record<DeleteOption, RegExp> = {
  sophiatech: /^Todas as informações pré-definidas da SophiaTech/,
  'admin-content': /^Cursos, Trilhas e Conteúdos criados pelos administradores/,
  'admin-users': /^Usuários cadastrados pelos administradores/,
  all: /^Todas informações \(pré-definidas e criadas pelos administradores\)/,
};

export class SophiaWidget {
  constructor(private readonly page: Page) {}

  // ---------- Trigger flutuante e popover ----------

  getDeleteInfoOption(): Locator {
    return this.page.locator('#accordion-button-delete-info');
  }

  getPopoverHeader(): Locator {
    return this.page.getByText('Oi, eu sou a Sophia.');
  }

  // ---------- Modal "Excluir informações" ----------

  getDeleteModal(): Locator {
    return this.page
      .locator('.chakra-modal__content')
      .filter({ hasText: 'Escolha quais informações você deseja excluir' });
  }

  /**
   * Row da opção (`<div.css-uqr5jf>`) que contém o checkbox + o span de texto.
   * Localiza pelo span exato e sobe pro pai.
   */
  private getOptionRow(opt: DeleteOption): Locator {
    return this.getDeleteModal()
      .locator('span.chakra-text')
      .filter({ hasText: OPTION_TEXT[opt] })
      .locator('xpath=..');
  }

  /**
   * Quadradinho visual clicável (Chakra). Único que dispara o onChange do
   * `<input>` hidden 1×1px da row.
   */
  getCheckboxControl(opt: DeleteOption): Locator {
    return this.getOptionRow(opt).locator('span.chakra-checkbox__control');
  }

  /** Input subjacente — usado pra ler `checked` (NÃO pra clicar). */
  getCheckboxInput(opt: DeleteOption): Locator {
    return this.getOptionRow(opt).locator('input[type="checkbox"]');
  }

  getConfirmDeleteButton(): Locator {
    return this.getDeleteModal().getByRole('button', { name: 'Excluir', exact: true });
  }

  getCancelButton(): Locator {
    return this.getDeleteModal().getByRole('button', { name: 'Cancelar', exact: true });
  }

  // ---------- Ações ----------

  /**
   * Expande o popover Sophia e abre o modal "Excluir informações".
   *
   * Click no trigger flutuante via JS porque o `#trial-menu-header` é
   * hidden CSS e o `onclick` React está no ancestor 3 níveis acima
   * (class hashada Chakra — não estável como selector). Walk programático
   * via `evaluate` é o caminho determinístico.
   */
  async openDeleteModal(): Promise<void> {
    await this.page.evaluate(() => {
      const header = document.querySelector('#trial-menu-header');
      let node: HTMLElement | null = header?.parentElement ?? null;
      while (node && !node.onclick) node = node.parentElement;
      if (!node) {
        throw new Error(
          'Sophia widget: trigger clicável (ancestor de #trial-menu-header com onclick) não encontrado.',
        );
      }
      node.click();
    });
    await this.getPopoverHeader().waitFor({ state: 'visible' });
    await this.getDeleteInfoOption().click();
    await this.getDeleteModal().waitFor({ state: 'visible' });
  }

  async checkOption(opt: DeleteOption): Promise<void> {
    const input = this.getCheckboxInput(opt);
    if (await input.isChecked()) return;
    await this.getCheckboxControl(opt).click();
  }

  async uncheckOption(opt: DeleteOption): Promise<void> {
    const input = this.getCheckboxInput(opt);
    if (!(await input.isChecked())) return;
    await this.getCheckboxControl(opt).click();
  }

  /**
   * Garante que SOMENTE a opção `opt` está marcada — desmarca todas as outras.
   */
  async selectOnly(opt: DeleteOption): Promise<void> {
    const all: DeleteOption[] = ['sophiatech', 'admin-content', 'admin-users', 'all'];
    for (const k of all) {
      if (k === opt) await this.checkOption(k);
      else await this.uncheckOption(k);
    }
  }

  async confirmDelete(): Promise<void> {
    await this.getConfirmDeleteButton().click();
    await this.getDeleteModal().waitFor({ state: 'hidden', timeout: 60_000 });
  }

  async cancelDelete(): Promise<void> {
    await this.getCancelButton().click();
    await this.getDeleteModal().waitFor({ state: 'hidden' });
  }
}
