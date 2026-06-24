import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { RegistrosAdminPage } from './RegistrosAdminPage.js';

/**
 * Tela Admin "Aprendizagem > Registros" focada no **drawer de filtros** e na
 * **personalização de colunas (DnD)** — suíte "Filtros via drawer e
 * personalização de colunas (DnD)".
 *
 * COMPÕE {@link RegistrosAdminPage} para navegação + gate de hidratação dos KPIs.
 * Acrescenta as ações do drawer (Modo A "Lista de filtros" / Modo B "Filtro
 * rápido"), o toggle de colunas e o drag-and-drop por teclado (react-beautiful-dnd).
 *
 * Seletores validados em recon ao vivo 2026-06-23 — ver
 * `inputs/recon-filtros-drawer-personalizacao-colunas-dnd.md`. Drawer é o
 * componente compartilhado Twygo (`#open-filter` / `#form-filter-*`), mesmo da
 * suíte widgets (skill `testar-filtro-drawer-twygo`).
 *
 * ⚠️ Divergências do build atual (ver recon): o grupo "Filtros padrão" não tem
 * os radios Válidos/Expirados/Pendentes/Recusados (mostra "Não há filtros nessa
 * seção."); "+ Opções de filtro" abre menu funcional (não toast "Em breve"); a
 * customização de colunas PERSISTE após reload.
 */

/** Chave interna (`#show-<key>`, `data-rbd-draggable-id`) → rótulo exibido. */
export const COLUMN_KEY_TO_LABEL = {
  person: 'Pessoa',
  content: 'Conteúdo',
  origin: 'Origem',
  created_by: 'Criado por',
  learning_experience: 'Experiência',
  provider: 'Provedor',
  website: 'Website',
  evidences: 'Evidências',
  workload_seconds: 'Carga horária',
  situation: 'Situação',
  certificate_situation: 'Situação do certificado',
  progress_score: 'Progresso',
  final_score: 'Desempenho',
  content_value: 'Valor do conteúdo',
  start_date: 'Data de início',
  end_date: 'Data de término',
  approved_at: 'Data de aprovação',
  certificate_date: 'Data do certificado',
  expiration_date: 'Data de validade',
} as const;

export type ColumnKey = keyof typeof COLUMN_KEY_TO_LABEL;

/** Colunas visíveis por padrão na tabela do Admin (recon 2026-06-23). */
export const DEFAULT_VISIBLE_COLUMNS: ColumnKey[] = [
  'person',
  'content',
  'origin',
  'created_by',
  'learning_experience',
  'provider',
  'website',
  'evidences',
  'workload_seconds',
  'situation',
  'certificate_situation',
];

export const EMPTY_GROUP_TEXT = 'Não há filtros nessa seção.';

export class FiltrosColunasPage {
  private readonly base: RegistrosAdminPage;

  constructor(private readonly page: Page) {
    this.base = new RegistrosAdminPage(page);
  }

  goto(): Promise<void> {
    return this.base.goto();
  }

  // ---- Botão Filtro + Limpar filtro (toolbar) ----

  filterButton(): Locator {
    return this.page.locator('#open-filter');
  }

  clearFilterButton(): Locator {
    return this.page.locator('#clear-filter');
  }

  /** Filtro/customização aplicado? O sinal confiável é o botão "Limpar filtro" visível. */
  async isFilterApplied(): Promise<boolean> {
    return this.clearFilterButton().isVisible().catch(() => false);
  }

  /** Botão "Filtro" em variante sólida (ativo) vs outline. Detecta pela classe Chakra. */
  async isFilterButtonSolid(): Promise<boolean> {
    const cls = (await this.filterButton().getAttribute('class')) ?? '';
    // outline = css-it72td (recon); sólida = css-1py8e62. Heurística: mudou de classe.
    return !cls.includes('css-it72td');
  }

  async clearFilter(): Promise<void> {
    if (await this.isFilterApplied()) {
      await this.clearFilterButton().click();
      await expect(this.clearFilterButton()).toBeHidden({ timeout: 10_000 });
      await this.page.waitForLoadState('networkidle').catch(() => undefined);
    }
  }

  // ---- Drawer (genérico) ----

  drawer(): Locator {
    return this.page.locator('.chakra-modal__content.chakra-slide');
  }

  /** Abre o drawer e devolve o modo em que ele abriu ('lista' | 'rapido'). */
  async openDrawer(): Promise<'lista' | 'rapido'> {
    await this.filterButton().click();
    await expect(this.drawer()).toBeVisible({ timeout: 10_000 });
    // O conteúdo do drawer renderiza DEPOIS do slide container ficar visível —
    // esperar um dos títulos antes de inspecionar o modo (senão checagem corre
    // antes do render e devolve o modo errado).
    await expect(this.listTitle().or(this.formTitle())).toBeVisible({ timeout: 10_000 });
    return (await this.listTitle().isVisible().catch(() => false)) ? 'lista' : 'rapido';
  }

  // ---- Modo A — Lista de filtros ----

  listTitle(): Locator {
    return this.page.locator('#list-filter-title');
  }
  listSearchInput(): Locator {
    return this.page.locator('#icon-search-filter');
  }
  newButton(): Locator {
    return this.page.locator('#list-filter-new');
  }
  listApplyButton(): Locator {
    return this.page.locator('#list-filter-apply');
  }
  listCancelButton(): Locator {
    return this.page.locator('#list-filter-cancel');
  }
  listCloseButton(): Locator {
    return this.page.locator('#list-filter-close');
  }
  defaultFiltersGroup(): Locator {
    return this.page.locator('#expand-default-filters');
  }
  sharedFiltersGroup(): Locator {
    return this.page.locator('#expand-shared-filters');
  }
  myFiltersGroup(): Locator {
    return this.page.locator('#expand-my-filters');
  }

  /** Quantos radios de filtro padrão existem (0 no build atual — feature ausente). */
  async defaultFilterRadioCount(): Promise<number> {
    return this.page.locator('[role="radiogroup"] [role="radio"], [role="radiogroup"] input[type="radio"]').count();
  }

  /** innerText do item do accordion (header + corpo) para checar empty state. */
  async groupText(group: 'default' | 'shared' | 'my'): Promise<string> {
    const id = { default: 'expand-default-filters', shared: 'expand-shared-filters', my: 'expand-my-filters' }[group];
    return this.page.evaluate((sel) => {
      const item = document.querySelector(`#${sel}`)?.closest('.chakra-accordion__item') as HTMLElement | null;
      return item?.innerText?.replace(/\s+/g, ' ').trim() ?? '';
    }, id);
  }

  // ---- Modo B — Filtro rápido ----

  formTitle(): Locator {
    return this.page.locator('#form-filter-title');
  }
  backToListaButton(): Locator {
    return this.page.locator('#form-filter-list-button');
  }
  columnsFilterAccordion(): Locator {
    return this.page.locator('#accordion-button-expand-columns-filters');
  }
  columnsShowAccordion(): Locator {
    return this.page.locator('#accordion-button-expand-columns-show');
  }
  optionsFilterMenuButton(): Locator {
    return this.page.locator('#menu-button-plus-options-filters');
  }
  optionsFilterMenu(): Locator {
    return this.page.locator('#menu-list-plus-options-filters');
  }
  formApplyButton(): Locator {
    return this.page.locator('#form-filter-apply');
  }
  formCancelButton(): Locator {
    return this.page.locator('#form-filter-cancel');
  }

  /** Garante estar na view "Filtro rápido" (a partir do drawer aberto em qualquer modo). */
  async gotoFiltroRapido(): Promise<void> {
    if (await this.formTitle().isVisible().catch(() => false)) return; // já está na view
    // Esperar o botão "Novo" estar acionável (o conteúdo da lista pode renderizar
    // com atraso após o slide) antes de clicar — evita pular o click e travar.
    await expect(this.newButton()).toBeVisible({ timeout: 10_000 });
    await this.newButton().click();
    await expect(this.formTitle()).toBeVisible({ timeout: 8_000 });
  }

  /** Volta para a view "Lista de filtros" a partir do "Filtro rápido". */
  async backToLista(): Promise<void> {
    await this.backToListaButton().click();
    await expect(this.listTitle()).toBeVisible({ timeout: 8_000 });
  }

  async expandColumnsShow(): Promise<void> {
    // Idempotente: se as checkboxes ainda não estão visíveis, expandir o accordion.
    if (!(await this.columnCheckbox('person').isVisible().catch(() => false))) {
      await this.columnsShowAccordion().click();
    }
    await expect(this.columnCheckbox('person')).toBeVisible({ timeout: 8_000 });
  }

  // ---- Colunas para exibir (checkboxes) ----

  columnCheckbox(key: ColumnKey): Locator {
    return this.page.locator(`#show-${key}`);
  }

  async isColumnChecked(key: ColumnKey): Promise<boolean> {
    return this.columnCheckbox(key).isChecked();
  }

  /** Marca/desmarca idempotente uma coluna na view "Filtro rápido". */
  async setColumn(key: ColumnKey, checked: boolean): Promise<void> {
    await this.expandColumnsShow();
    if ((await this.isColumnChecked(key)) !== checked) {
      // Checkbox Chakra fica escondido (clip); clicar no label irmão é mais robusto.
      const label = this.page.locator(`label[for="show-${key}"]`);
      if (await label.count()) await label.first().click();
      else await this.columnCheckbox(key).click({ force: true });
    }
    await expect(this.columnCheckbox(key)).toBeChecked({ checked });
  }

  // ---- DnD por teclado (react-beautiful-dnd) ----

  dragHandle(key: ColumnKey): Locator {
    return this.page.locator(`[data-rbd-draggable-id="${key}"]`);
  }

  /** Ordem atual das colunas na lista de DnD (por data-rbd-draggable-id). */
  async getColumnOrder(): Promise<string[]> {
    return this.page
      .locator('[data-rbd-draggable-context-id] [data-rbd-draggable-id], [data-rbd-draggable-id]')
      .evaluateAll((els) =>
        Array.from(new Set(els.map((e) => e.getAttribute('data-rbd-draggable-id')))).filter(Boolean) as string[],
      );
  }

  /**
   * Move a coluna `sourceKey` para imediatamente ANTES de `targetKey` usando o
   * DnD por teclado do react-beautiful-dnd (focar handle → Space levanta →
   * ArrowUp/Down move → Space solta). Mais determinístico que arrastar com mouse.
   */
  async moveColumnBefore(sourceKey: ColumnKey, targetKey: ColumnKey): Promise<void> {
    await this.expandColumnsShow();
    const order = await this.getColumnOrder();
    const from = order.indexOf(sourceKey);
    const to = order.indexOf(targetKey);
    if (from < 0 || to < 0) throw new Error(`moveColumnBefore: índice inválido (${sourceKey}=${from}, ${targetKey}=${to})`);
    const steps = from - to; // >0 → mover para cima (antes do alvo)
    const handle = this.dragHandle(sourceKey);
    await handle.focus();
    await this.page.keyboard.press('Space');
    await this.page.waitForTimeout(300); // rbd anuncia o lift (sem condição observável estável)
    const dir = steps > 0 ? 'ArrowUp' : 'ArrowDown';
    for (let i = 0; i < Math.abs(steps); i++) {
      await this.page.keyboard.press(dir);
      await this.page.waitForTimeout(150);
    }
    await this.page.keyboard.press('Space');
    await this.page.waitForTimeout(300);
  }

  // ---- Aplicar ----

  async applyFiltroRapido(): Promise<void> {
    await this.formApplyButton().click();
    await expect(this.drawer()).toBeHidden({ timeout: 10_000 });
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  async applyLista(): Promise<void> {
    await this.listApplyButton().click();
    await expect(this.drawer()).toBeHidden({ timeout: 10_000 });
    await this.page.waitForLoadState('networkidle').catch(() => undefined);
  }

  // ---- Tabela ----

  /** Rótulos dos headers de dados da tabela (ignora colunas vazias de checkbox/ações). */
  async getTableHeaders(): Promise<string[]> {
    const all = await this.page
      .locator('table thead th')
      .evaluateAll((ths) => ths.map((th) => (th as HTMLElement).innerText.replace(/\s+/g, ' ').trim()));
    return all.filter((h) => h.length > 0);
  }

  /** Primeira e última `<th>` (devem ser as colunas fixas: seleção e ações — vazias). */
  async getFirstAndLastHeaderRaw(): Promise<{ first: string; last: string; count: number }> {
    return this.page.locator('table thead th').evaluateAll((ths) => ({
      first: (ths[0] as HTMLElement)?.innerText.trim() ?? '',
      last: (ths[ths.length - 1] as HTMLElement)?.innerText.trim() ?? '',
      count: ths.length,
    }));
  }

  // ---- Restauração de preferência (afterAll) ----

  /**
   * Restaura o conjunto + ordem default de colunas. A customização PERSISTE entre
   * runs (localStorage por usuário) — sem isso, suítes que checam colunas default
   * (ex.: "Listagem Admin", TC2) seriam contaminadas. Pref de UI reversível é
   * exceção legítima à premissa "sem cleanup" deste projeto (que vale p/ registros).
   */
  async restoreDefaultColumns(): Promise<void> {
    await this.goto();
    if (await this.isFilterApplied()) await this.clearFilter();
    await this.openDrawer();
    await this.gotoFiltroRapido();
    await this.expandColumnsShow();
    for (const key of Object.keys(COLUMN_KEY_TO_LABEL) as ColumnKey[]) {
      await this.setColumn(key, DEFAULT_VISIBLE_COLUMNS.includes(key));
    }
    await this.applyFiltroRapido();
    await this.clearFilter();
  }
}
