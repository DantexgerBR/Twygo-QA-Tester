import { expect, type Locator, type Page } from '@playwright/test';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Page Object da listagem de Painéis (módulo Widgets).
 *
 * URL canônica: `/o/{orgId}/use_modes?tab=panels-tab`
 *
 * Observações de contrato (re-exploradas em 2026-05-06 com seed de 30 painéis
 * na org 36988 do env `staging`):
 * - O componente NÃO é um web-component `<list-control>` literal — é uma
 *   estrutura de divs Chakra UI. Asserções de "listagem renderizou" devem
 *   usar os sub-componentes (search input, add button) como prova.
 * - A listagem da aba Painéis NÃO compartilha estrutura com a aba irmã
 *   "Modos de uso" (que usa um componente legado de cards).
 * - **Toggle Lista/Cards EXISTE**: dois `<span>` Material Symbols dentro do
 *   mesmo container — `#grid-view-icon` (`data-icon="grid_view"`) muda para
 *   cards e `#list-icon` (`data-icon="reorder"`) muda para lista. O modo
 *   ativo se distingue pela cor do ícone (mais escura quando ativo).
 * - **Default no viewport 1920x1080 é Lista** (tabela com `<table>` Chakra).
 *   Em viewports menores o default pode ser cards — por isso specs que
 *   dependem de modo determinístico fazem `test.use({ viewport: 1920x1080 })`
 *   e chamam `setViewMode('lista'|'cards')` explicitamente.
 * - **Colunas em modo Lista** (re-confirmado 2026-05-06): Nome, Descrição,
 *   Data de criação, Ativo? (com `?`), e um `<th>` vazio para Ações.
 *   **Provedora NÃO existe** (XML descrevia coluna inexistente).
 * - **Colunas ordenáveis**: apenas 3 — Nome, Data de criação, Ativo. Cada
 *   uma tem um SVG indicador com id estável (`panels-order-by-name`,
 *   `panels-order-by-created_at`, `panels-order-by-is_active`). A classe do
 *   SVG é hashada (Chakra `css-*`); para asserções de sort use comparação
 *   de texto das linhas em vez do indicador visual.
 * - **Coluna Ativo é checkbox**: `<input type="checkbox">` sem `role="switch"`.
 * - **Paginação** existe e é interativa quando há >25 painéis (re-confirmado
 *   2026-05-06 com seed de 30 painéis: chevron_right enabled, página 2
 *   acessível). IDs estáveis: `first-page-button`, `previous-page-button`,
 *   `page-button-N`, `next-page-button`.
 * - **Ações por linha/card**: cada item expõe três ícones com IDs do tipo
 *   `panels-{id}-edit-element-1-button-0` (editar), `panels-{id}-custom-element-1-button-1`
 *   (duplicar/content_copy), `panels-{id}-destroy-element-1-button-2` (excluir).
 *
 * Status data-test-id: NENHUM elemento da listagem tem `data-test-id` ainda
 * (PR pendente para o time de dev — ver plano em `specs/`). Fallbacks usam
 * id estável (`#page-breadcrumb`, `#open-filter`, `#panels-add-button`,
 * `#first-page-button`, etc.), `getByRole`, `getByPlaceholder`. Cada uso
 * fica marcado com `// REVISAR: aguardando data-test-id`.
 */
export class PaineisListPage {
  constructor(private readonly page: Page) {}

  // ---------- Navegação ----------

  /**
   * Acessa a listagem via UI: sidebar "Menu" → tab "Modos de uso" (default)
   * → tab "Painéis". Usado pelo TC1 que valida o caminho de navegação real.
   */
  async openByMenu(): Promise<void> {
    await this.openAdminContext();
    await this.clickMenuLink();
    await this.getModosDeUsoTab().waitFor();
    await this.getPaineisTab().click();
    await this.page.waitForURL(/tab=panels-tab/);
  }

  /**
   * Garante que a página está em contexto admin (sidebar com link "Menu"
   * presente). Necessário porque storageState sozinho não navega — testes
   * iniciam em about:blank.
   */
  async openAdminContext(): Promise<void> {
    if (!this.page.url().includes(`/o/${getOrgId()}/`)) {
      await this.page.goto(`/o/${getOrgId()}/dashboard`);
    }
  }

  /**
   * Clica no link "Menu" da sidebar e aguarda a navegação para `/use_modes`.
   * REVISAR: aguardando data-test-id no link "Menu" da sidebar.
   * Fluxo real (sidebar desktop, viewport 1280): o link "Menu" vive dentro
   * do submenu "Configurações" que é `display: none` até o primeiro click no
   * próprio item "Configurações". Sem expandir antes, `.click()` no link
   * Menu trava no actionability (elemento existe mas tem bbox 0x0).
   * Escopamos tudo a `#menu` (container desktop) — o DOM mobile duplica
   * `id="navigation-menu"` em `.mobile-nav` mas fica off-screen no viewport
   * de teste e roubaria o `.first()`.
   */
  async clickMenuLink(): Promise<void> {
    await this.page.locator('#menu a[name="settings-main-menu"]').click();
    await this.page.locator('#menu a#navigation-menu').click();
    await this.page.waitForURL(/\/use_modes/);
  }

  /**
   * Atalho: navega direto para a rota com `?tab=panels-tab`. Usado por
   * todos os TCs que não testam o caminho de navegação em si.
   */
  async goToList(): Promise<void> {
    await this.page.goto(`/o/${getOrgId()}/use_modes?tab=panels-tab`);
    await this.page.getByRole('tab', { name: 'Painéis', selected: true }).waitFor();
  }

  // ---------- Container / cabeçalho ----------

  getBreadcrumb(): Locator {
    // REVISAR: aguardando data-test-id "page-title-breadcrumb"; fallback usa
    // id estável "page-breadcrumb" (re-confirmado 2026-05-06).
    return this.page.locator('#page-breadcrumb');
  }

  getModosDeUsoTab(): Locator {
    // REVISAR: aguardando data-test-id "use-modes-tab-modos-de-uso"
    return this.page.getByRole('tab', { name: 'Modos de uso' });
  }

  getPaineisTab(): Locator {
    // REVISAR: aguardando data-test-id "use-modes-tab-paineis"
    return this.page.getByRole('tab', { name: 'Painéis' });
  }

  // ---------- Componentes obrigatórios da listagem (TC2) ----------

  getAddButton(): Locator {
    // REVISAR: aguardando data-test-id "paineis-list-add-button"; o markup
    // real é `<a href=".../panels/new"><button id="panels-add-button">Adicionar</button></a>`.
    // O `<a>` é a âncora estável para asserções de visibilidade/click; a
    // navegação é feita pelo `<a>` quando o `<button>` interno é acionado.
    return this.page.locator('a[href*="/panels/new"]');
  }

  /**
   * Mesmo botão "+ Adicionar", mas retorna o `<button id="panels-add-button">`
   * INTERNO (filho do `<a>`). É este o elemento que recebe foco por Tab/Shift+Tab
   * — o `<a>` wrapper não é focável diretamente. Usado pelo TC8 (acessibilidade
   * por teclado) para asserção `toBeFocused()`. REVISAR: aguardando
   * data-test-id "paineis-list-add-button-focusable".
   */
  getAddButtonFocusable(): Locator {
    return this.page.locator('#panels-add-button');
  }

  getFilterButton(): Locator {
    // REVISAR: aguardando data-test-id "paineis-list-filter-button";
    // fallback usa id estável "open-filter" — botão NOVO observado live,
    // não estava no XML.
    return this.page.locator('#open-filter');
  }

  getSearchInput(): Locator {
    // REVISAR: aguardando data-test-id "paineis-list-search-input";
    // placeholder real (re-confirmado 2026-05-06): "Pesquise por nome ou
    // descrição" — NÃO é "Pesquise aqui" como o XML insinuava.
    return this.page.getByPlaceholder('Pesquise por nome ou descrição');
  }

  // ---------- Empty state (org sem painéis) ----------

  getEmptyStateText(): Locator {
    // REVISAR: aguardando data-test-id "paineis-list-empty-state".
    // Usado apenas em envs com 0 painéis cadastrados — staging atual tem 30
    // painéis seedados, então este locator não resolve no estado normal.
    return this.page.getByText('Não há dados para exibir');
  }

  // ---------- Listagem em cards (default observado live) ----------

  /**
   * Locator que casa todos os botões "edit" dos cards — um por card. Ancora
   * estável usando o id `panels-{paineId}-edit-element-1-button-0` (id real
   * gerado pelo backend; o segmento `-edit-element-1-button-0` é constante).
   * REVISAR: aguardando data-test-id "paineis-list-card-{idx}".
   */
  private getCardEditButtons(): Locator {
    return this.page.locator('[id^="panels-"][id$="-edit-element-1-button-0"]');
  }

  /**
   * Container do grid de cards. Re-confirmado 2026-05-06: cada card tem um
   * `<p>Painel N</p>` como nome e três ícones (edit/content_copy/delete).
   * Implementação evita classes Chakra hashadas (css-*) que mudam entre
   * builds. Em vez disso, ancora no tabpanel filtrado por presença de cards.
   * REVISAR: aguardando data-test-id "paineis-list-cards-container".
   */
  getCardsContainer(): Locator {
    return this.page
      .locator('[role="tabpanel"]')
      .filter({ has: this.getCardEditButtons().first() });
  }

  async getCardCount(): Promise<number> {
    return this.getCardEditButtons().count();
  }

  // ---------- View mode toggle (TC4) ----------

  /**
   * Retorna o `<span>` Material Symbols clicável do toggle:
   * - `'cards'` → `#grid-view-icon` (`data-icon="grid_view"`)
   * - `'lista'` → `#list-icon` (`data-icon="reorder"`)
   *
   * REVISAR: aguardando data-test-id "paineis-list-view-toggle-{mode}". Os
   * IDs Material Symbols são estáveis o suficiente como fallback.
   */
  getViewModeToggle(mode: 'lista' | 'cards'): Locator {
    return this.page.locator(mode === 'cards' ? '#grid-view-icon' : '#list-icon');
  }

  /**
   * Clica no toggle e aguarda a transição: ao virar 'lista' espera
   * `<table>` aparecer; ao virar 'cards' espera ≥1 botão edit de card.
   * Idempotente — clicar no modo já ativo é no-op visual mas o aguardo
   * garante o estado esperado.
   */
  async setViewMode(mode: 'lista' | 'cards'): Promise<void> {
    await this.getViewModeToggle(mode).click();
    if (mode === 'lista') {
      await this.page.locator('table').first().waitFor();
    } else {
      await this.getCardEditButtons().first().waitFor();
    }
  }

  /**
   * Detecta o modo ativo pela presença de `<table>` (lista) vs ausência
   * dela e presença de cards. Útil para asserções do TC4.
   */
  async getCurrentViewMode(): Promise<'lista' | 'cards'> {
    const tableCount = await this.page.locator('table').count();
    return tableCount > 0 ? 'lista' : 'cards';
  }

  // ---------- Colunas (TC3, TC5) ----------

  /**
   * Column header da listagem em modo Lista. Aceita o nome lógico (Nome,
   * Descrição, Data de criação, Ativo, Ações) e mapeia internamente para
   * o `<th id>` real (Chakra). O texto visível do "Ativo" é "Ativo?" e
   * o de "Ações" é vazio — por isso usamos id ao invés de `getByRole`.
   *
   * REVISAR: aguardando data-test-id "paineis-list-column-{slug}". Fallback
   * usa `<th id>` Chakra que é estável (`name`, `description`, `created_at`,
   * `is_active`).
   */
  getColumnHeader(name: string): Locator {
    const slugMap: Record<string, string> = {
      Nome: 'name',
      Descrição: 'description',
      'Data de criação': 'created_at',
      Ativo: 'is_active',
    };
    const slug = slugMap[name];
    if (slug) {
      return this.page.locator(`th#${slug}`);
    }
    if (name === 'Ações') {
      // Coluna Ações é o último <th>, sem id e sem texto visível.
      return this.page.locator('thead th').last();
    }
    return this.page.getByRole('columnheader', { name });
  }

  /**
   * Clica no header da coluna para alternar a ordenação. Apenas três
   * colunas são ordenáveis na UI atual: Nome, Data de criação, Ativo.
   * Cada clique cicla neutral → asc → desc.
   */
  async sortByColumn(name: 'Nome' | 'Data de criação' | 'Ativo'): Promise<void> {
    // O sort é server-side: clicar dispara request, tbody fica brevemente
    // vazio, depois re-renderiza. Polling baseado em condição (não
    // waitForTimeout — regra dura #1 do CLAUDE.md): aguarda apenas que a
    // tabela esteja populada novamente. Asserção sobre mudança de ordem
    // fica a cargo do caller (não cabe ao POM porque colunas booleanas
    // como "Ativo" podem produzir ordem idêntica em asc vs desc quando
    // todos os registros compartilham o mesmo valor).
    await this.getColumnHeader(name).click();
    await expect
      .poll(async () => (await this.getRowNames()).length, {
        timeout: 10_000,
        message: `aguardando tabela re-popular após sortByColumn('${name}')`,
      })
      .toBeGreaterThan(0);
  }

  /**
   * Lê o texto da primeira coluna (Nome) de todas as linhas visíveis em
   * modo Lista. Usado por TC5 para asserir que o sort mudou a ordem dos
   * registros — abordagem comportamental, mais resiliente que comparar
   * classes Chakra hashadas do SVG indicador.
   */
  async getRowNames(): Promise<string[]> {
    return this.page
      .locator('tbody tr td:first-child p')
      .allTextContents();
  }

  // ---------- Linhas / ações (TC3) ----------

  /**
   * Retorna a `<tr>` de índice `rowIdx` (0-based) em modo Lista. REVISAR:
   * aguardando data-test-id "paineis-list-row-{idx}".
   */
  getRow(rowIdx: number): Locator {
    return this.page.locator('tbody tr').nth(rowIdx);
  }

  /**
   * Retorna o card de índice `cardIdx` (0-based) em modo Cards. Ancora
   * pelo botão edit do card e sobe ao container do card via `xpath=ancestor`.
   * Evita classes Chakra hashadas. REVISAR: aguardando data-test-id
   * "paineis-list-card-{idx-or-id}".
   */
  getCard(cardIdx: number): Locator {
    // O id `panels-{paineId}-edit-element-1-button-0` está em um <button>
    // dentro do card. Subimos até o ancestor que tem o <p>Painel N</p>.
    return this.getCardEditButtons()
      .nth(cardIdx)
      .locator('xpath=ancestor::*[.//p[starts-with(normalize-space(.), "Painel")]][1]');
  }

  /**
   * Checkbox da coluna "Ativo?" da linha `rowIdx`. O elemento é um
   * `<input type="checkbox">` sem `role="switch"` — a prosa do XML chama
   * de "switch", mas o DOM real é checkbox.
   * REVISAR: aguardando data-test-id "paineis-list-row-{idx}-active-switch".
   */
  getRowActiveSwitch(rowIdx: number): Locator {
    return this.getRow(rowIdx).locator('input[type="checkbox"]');
  }

  /**
   * Ícones de ação por linha (modo Lista). Cada linha tem
   * `<span data-icon="edit">`, `<span data-icon="content_copy">`,
   * `<span data-icon="delete">` na última `<td>`. IDs reais por painel:
   * `panels-{paineId}-edit-element-1-button-0-icon`, `...-custom-...-icon`,
   * `...-destroy-...-icon`. Como `paineId` varia, ancoramos via `[data-icon]`.
   * REVISAR: aguardando data-test-id "paineis-list-row-{idx}-action-{action}".
   */
  getRowActionIcon(
    rowIdx: number,
    action: 'editar' | 'duplicar' | 'excluir',
  ): Locator {
    const iconMap = {
      editar: 'edit',
      duplicar: 'content_copy',
      excluir: 'delete',
    } as const;
    return this.getRow(rowIdx).locator(`[data-icon="${iconMap[action]}"]`);
  }

  async getRowCount(): Promise<number> {
    return this.page.locator('tbody tr').count();
  }

  // ---------- Paginação (TC6) — interativa com >25 painéis ----------

  /**
   * Container da paginação. Re-confirmado 2026-05-06: cada botão tem id
   * estável (`first-page-button`, `previous-page-button`, `page-button-N`,
   * `next-page-button`). Localizamos pelo `#first-page-button` e subimos
   * ao parent comum.
   * REVISAR: aguardando data-test-id "paineis-list-pagination" no container.
   */
  getPagination(): Locator {
    return this.page.locator('#first-page-button').locator('..');
  }

  getNextPageButton(): Locator {
    // REVISAR: aguardando data-test-id "paineis-list-pagination-next";
    // fallback usa id estável `#next-page-button`.
    return this.page.locator('#next-page-button');
  }

  getPreviousPageButton(): Locator {
    // REVISAR: aguardando data-test-id "paineis-list-pagination-prev";
    // fallback usa id estável `#previous-page-button`.
    return this.page.locator('#previous-page-button');
  }

  getFirstPageButton(): Locator {
    // REVISAR: aguardando data-test-id "paineis-list-pagination-first";
    // fallback usa id estável `#first-page-button`.
    return this.page.locator('#first-page-button');
  }

  /**
   * Botão numerado de página (1-based — `#page-button-1` é a página 1).
   * REVISAR: aguardando data-test-id "paineis-list-pagination-page-{n}".
   */
  getPageButton(pageNum: number): Locator {
    return this.page.locator(`#page-button-${pageNum}`);
  }

  async goToNextPage(): Promise<void> {
    await this.getNextPageButton().click();
  }

  async goToPreviousPage(): Promise<void> {
    await this.getPreviousPageButton().click();
  }

  // ---------- Estado de bloqueio por contrato/flag (TC7 — referência) ----------

  /**
   * Mantido como referência para TC7 (feature flag desabilitada). A UI atual
   * (pós-liberação na org 36988) NÃO renderiza este card. Útil só se outra
   * org/env reproduzir o estado bloqueado.
   */
  getContractBlockCard(): Locator {
    return this.page.getByTestId('integrations-contract-block-card');
  }

  getContractBlockTitle(): Locator {
    return this.page.getByTestId('integrations-contract-block-card-title');
  }
}
