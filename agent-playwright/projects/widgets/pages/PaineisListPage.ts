import { expect, type Locator, type Page } from '@playwright/test';
import { getOrgId } from '../../../src/utils/environment.js';
import { dismissCommonModals } from '../../../src/utils/modals.js';

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

// Escape user-provided text antes de injetar em RegExp literal.
const escapeRegex = (s: string): string => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class PaineisListPage {
  /**
   * `orgIdOverride` — opcional. Quando ausente, POM usa `getOrgId()` (org do
   * env principal do project.config). Quando presente, força paths `/o/{X}/...`
   * com o orgId fornecido — usado por specs de ambientes adicionais (env
   * multi-tenant pareado) que precisam navegar em outra org sem trocar o
   * project.config. Ver skill `testar-ambientes-adicionais-twygo`.
   */
  constructor(
    private readonly page: Page,
    private readonly orgIdOverride?: string,
  ) {}

  private orgId(): string {
    return this.orgIdOverride ?? getOrgId();
  }

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
    if (!this.page.url().includes(`/o/${this.orgId()}/`)) {
      await this.page.goto(`/o/${this.orgId()}/dashboard`);
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
    await dismissCommonModals(this.page);
    // O React/Chakra pinta `aria-selected=true` na tab ativa em 2 tempos
    // (URL muda antes da re-renderização). Aguardar o atributo evita race
    // com asserções `.toHaveAttribute('aria-selected', 'true')` no spec.
    await this.page
      .getByRole('tab', { name: 'Modos de uso', selected: true })
      .waitFor({ timeout: 15_000 });
  }

  /**
   * Atalho: navega direto para a rota com `?tab=panels-tab`. Usado por
   * todos os TCs que não testam o caminho de navegação em si.
   *
   * Aguarda só a visibilidade da tab — não o `aria-selected=true`. Specs
   * que exigem o estado selected fazem assertion explícita; aqui o waitFor
   * sem `selected: true` evita timeout de 30s+ enquanto o React pinta o
   * atributo (data carrega em paralelo, ~2 tempos de render).
   */
  async goToList(): Promise<void> {
    await this.page.goto(`/o/${this.orgId()}/use_modes?tab=panels-tab`);
    // NPS Sofia + outros modais oportunistas — fechar antes de qualquer
    // ação na listagem. Sem isso, click no toggle/edit cai no overlay
    // do dialog (regra dura: NUNCA `force:true` pra resolver isso, sempre
    // dismiss explícito). Ver skill `fechar-modais-twygo`.
    await dismissCommonModals(this.page);
    await this.page.getByRole('tab', { name: 'Painéis' }).waitFor();
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

  // ---------- Linhas por NOME (suite Ativar / Inativar painel) ----------

  /**
   * Retorna a `<tr>` da listagem em modo Lista cujo `<p>` da primeira coluna
   * tem texto EXATAMENTE igual a `name`. Match exato via regex é obrigatório:
   * `hasText: string` faz substring match, então buscar "Painel X" também
   * casaria a linha "Painel X (cópia)" — quebra strict-mode na suite
   * Duplicar painéis. Regex com `^...$` força match exato.
   * REVISAR: aguardando data-test-id "paineis-list-row-{paineId}".
   */
  getRowByName(name: string): Locator {
    const exactRe = new RegExp(`^${escapeRegex(name)}$`);
    return this.page
      .locator('tbody tr')
      .filter({ has: this.page.locator('td:first-child p', { hasText: exactRe }) });
  }

  /**
   * Checkbox da coluna "Ativo?" da linha cujo nome é `{name}`. O elemento é
   * `<input id="panel-situation-{paineId}" type="checkbox">` (id estável
   * descoberto live em 2026-05-06). O input em si tem `clip: rect(0,0,0,0)`
   * — para CLICK use `getRowActiveSwitchLabelByName`; este locator serve a
   * asserções (`toBeChecked()`) que leem state via attribute.
   * REVISAR: aguardando data-test-id "paineis-list-row-{paineId}-active-switch".
   */
  getRowActiveSwitchByName(name: string): Locator {
    return this.getRowByName(name).locator('input[type="checkbox"]');
  }

  /**
   * Label clicável (chakra-switch) que envolve o `<input>` do switch da linha
   * `{name}`. Necessário porque o input é hidden (clip 1×1 px) — click
   * direto no input falha em actionability. O `<label class="chakra-switch">`
   * captura o click e dispara o toggle do input via DOM.
   *
   * NOTA: tentei trocar pra `.chakra-switch__track` (alinhar com fluxo manual
   * via Jam 12/05/2026), mas o track não passou no actionability check do
   * Playwright em headless — TC1/TC2/TC5 falhavam com toggle 'pending'.
   * O label-wrapper funciona consistente — mantido.
   */
  getRowActiveSwitchLabelByName(name: string): Locator {
    return this.getRowByName(name).locator('label.chakra-switch');
  }

  /**
   * Lê o estado atual do switch da linha `{name}`. Usa o atributo do DOM
   * (não evaluate) — o `<input>` chakra mantém o property `checked`
   * sincronizado com o state interno.
   */
  async getActiveStateByName(name: string): Promise<boolean> {
    return this.getRowActiveSwitchByName(name).isChecked();
  }

  /**
   * Click no label do switch da linha `{name}` e aguarda mudança de estado.
   * Para painel SEM associação a modos de uso, o estado muda imediatamente.
   * Para painel ASSOCIADO, abre modal de bloqueio e o estado NÃO muda — use
   * `getBlockedModal()` para asserir nesse caso.
   */
  async toggleActiveByName(name: string): Promise<void> {
    const before = await this.getActiveStateByName(name);
    // NPS pode reaparecer por inactivity entre `goToList` (que já dismiss-a)
    // e o click no switch. Sem isso o click cai no overlay e o polling
    // termina em "pending" (nem toggled nem modal de bloqueio aparecem).
    await dismissCommonModals(this.page);
    await this.getRowActiveSwitchLabelByName(name).click();
    // Aguarda either: state mudou (caso normal) OU modal de bloqueio apareceu.
    // Polling baseado em condição (regra dura #1).
    await expect
      .poll(
        async () => {
          const dialogVisible = await this.getBlockedModal()
            .isVisible()
            .catch(() => false);
          if (dialogVisible) return 'modal';
          const after = await this.getActiveStateByName(name);
          return after !== before ? 'toggled' : 'pending';
        },
        {
          timeout: 5_000,
          message: `aguardando toggle ou modal após click no switch de "${name}"`,
        },
      )
      .not.toBe('pending');
  }

  /**
   * Garante que o painel `{name}` esteja ATIVO (checked). No-op se já estiver.
   * Usado em pre-conditions de TC1 e em cleanup de TC1/TC2 (`afterEach`)
   * para isolamento entre runs paralelos. **NÃO** trata o caso de painel
   * associado (modal de bloqueio) — caller é responsável por garantir que
   * `{name}` é um painel desassociado.
   */
  async ensureActive(name: string): Promise<void> {
    if (!(await this.getActiveStateByName(name))) {
      await this.toggleActiveByName(name);
    }
  }

  /**
   * Garante que o painel `{name}` esteja INATIVO (unchecked). No-op se já
   * estiver. Usado em pre-condition de TC2.
   */
  async ensureInactive(name: string): Promise<void> {
    if (await this.getActiveStateByName(name)) {
      await this.toggleActiveByName(name);
    }
  }

  // ---------- Modal de bloqueio (TC3) ----------
  // Confirmado live 2026-05-06 com auto-seed via UI (associação painel↔menu
  // funcional após deploy de "Painéis do usuário" no `<select id="page_model">`):
  // ao clicar no switch "Ativo?" de painel ASSOCIADO a 1+ menus, abre
  // `<div role="dialog" class="chakra-modal__content">` com:
  // - Header literal: "Painel em uso" (precedido do ícone material "warning")
  // - Body literal: "Não é possível desabilitar pois existem menus
  //   configurados que estão utilizando este painel no modo de uso." +
  //   lista de cada menu vinculado no formato "Nome do menu: <itemName>
  //   Modo de uso: <useModeName>".
  // - Footer: botão "Entendi" com `data-test-id="panel-in-use-modal-confirm"`
  //   (único data-test-id real descoberto na UI da listagem até hoje).

  /**
   * Modal informativo "Painel em uso" que aparece ao tentar inativar painel
   * vinculado a 1+ menus de modos de uso. Ancoramos pelo botão estável
   * `[data-test-id="panel-in-use-modal-confirm"]` subindo até o
   * `.chakra-modal__content` para evitar o falso positivo do popover de
   * Notificações (que também é `role="dialog"` mas é Chakra Popover, não Modal).
   * REVISAR: aguardando data-test-id no container do modal em si.
   */
  getInactivationBlockedModal(): Locator {
    return this.page
      .locator('.chakra-modal__content')
      .filter({ has: this.page.locator('[data-test-id="panel-in-use-modal-confirm"]') });
  }

  getInactivationBlockedModalTitle(): Locator {
    return this.getInactivationBlockedModal().locator('header.chakra-modal__header');
  }

  getInactivationBlockedModalBody(): Locator {
    return this.getInactivationBlockedModal().locator('.chakra-modal__body');
  }

  /**
   * Botão "Entendi" — único confirm do modal. Texto literal "Entendi" e
   * `data-test-id` estável.
   */
  getInactivationBlockedModalCloseButton(): Locator {
    return this.page.locator('[data-test-id="panel-in-use-modal-confirm"]');
  }

  async closeInactivationBlockedModal(): Promise<void> {
    await this.getInactivationBlockedModalCloseButton().click();
    await expect(this.getInactivationBlockedModal()).not.toBeVisible();
  }

  // ---------- Aliases legados (TC4 ainda referencia getBlockedModal*) ----------
  // Mantidos enquanto TC4 estiver `BLOCKED-BY-SEED`. Quando TC4 for
  // reescrito, migrar pra `getInactivationBlockedModal*` ou criar `getReactivationBlockedModal*`
  // se o modal de TC4 (reativar menu vinculado a painel inativo) tiver
  // estrutura diferente — ainda não validado live.

  getBlockedModal(): Locator {
    return this.getInactivationBlockedModal();
  }

  getBlockedModalTitle(): Locator {
    return this.getInactivationBlockedModalTitle();
  }

  getBlockedModalCloseButton(): Locator {
    return this.getInactivationBlockedModalCloseButton();
  }

  async closeBlockedModal(): Promise<void> {
    await this.closeInactivationBlockedModal();
  }

  // ---------- Modos de uso (TC4) ----------

  /**
   * Navega direto para a aba "Modos de uso" (irmã de Painéis) em modo Lista.
   * Usado pelo TC4 que opera fora da listagem de Painéis.
   */
  async goToModosDeUso(): Promise<void> {
    await this.page.goto(`/o/${this.orgId()}/use_modes?tab=list-tab`);
    await this.page
      .getByRole('tab', { name: 'Modos de uso', selected: true })
      .waitFor();
  }

  /**
   * Linha do modo de uso (Colaborador / Aluno) na aba list-tab. Identifica
   * por `data-item-id="{useModeId}"` na `<tr>` (id da entidade UseMode no
   * backend, descoberto live: 70077 = Colaborador, 70078 = Aluno).
   * Filtramos por texto exato do nome para não acoplar ao id numérico.
   * REVISAR: aguardando data-test-id "use-modes-row-{useModeId}".
   */
  getModoDeUsoRowByName(name: string): Locator {
    return this.page
      .locator('tbody tr[data-item-id]')
      .filter({ has: this.page.locator('p', { hasText: name }) });
  }

  // ---------- CRUD: criação de painel ----------
  // Suite "Ativar / Inativar painel" (TC1/TC2) cria/deleta painel próprio
  // por spec — sem depender de seed externo. Estrutura observada live em
  // 2026-05-06 (org 36988):
  // - Form em /o/{orgId}/panels/new com tabs "Identificação" (ativa) e
  //   "Layouts" (disabled até salvar).
  // - Pós-save: redireciona pra /o/{orgId}/panels/{paineId}/edit (NÃO volta
  //   pra listagem). paineId é numérico (ex.: 802029).
  // - `<tr>` da listagem tem `data-item-id="{paineId}"` e `data-item-name="{name}"`
  //   (selector estável para localizar a linha sem depender do <p> da coluna 1).

  /**
   * Navega ao form de criação. Goto direto é mais rápido que clicar
   * "+ Adicionar" e o teste de navegação por ele já está coberto pelo TC2
   * da listagem.
   */
  async openNewPanelForm(): Promise<void> {
    await this.page.goto(`/o/${this.orgId()}/panels/new`);
    // NPS Sofia (e outros oportunistas) pode renderizar no chakra-portal
    // por cima do form e interceptar o click no Salvar (`panel-form-save-button`).
    // Sem este dismiss, `submitNewPanelForm` quebra com "subtree intercepts
    // pointer events". Ver skill `fechar-modais-twygo`.
    await dismissCommonModals(this.page);
    // Aguarda input do nome estar interagível antes de retornar — evita race
    // com hidratação tardia do React/Chakra (form usa Chakra UI).
    await this.getNewPanelNameInput().waitFor();
  }

  /**
   * Input do nome do painel no form de criação.
   * REVISAR: aguardando data-test-id "panel-form-name-input"; fallback usa
   * id estável `#panel-form-name-input` descoberto live.
   */
  getNewPanelNameInput(): Locator {
    return this.page.locator('#panel-form-name-input');
  }

  /**
   * Botão "Salvar" do form. Já tem `data-test-id` estável.
   */
  getNewPanelSaveButton(): Locator {
    return this.page.locator('[data-test-id="panel-form-save-button"]');
  }

  /**
   * Preenche o form de criação. `description` ignorado por enquanto — o
   * editor é rich-text Chakra e não há TC que precise de descrição
   * preenchida. Painel é criado ATIVO por default (checkbox `#is_active`
   * vem checked); para criar inativo o caller faz toggle pós-criação via
   * `toggleActiveByName`.
   */
  async fillNewPanelForm(data: { name: string; description?: string }): Promise<void> {
    await this.getNewPanelNameInput().fill(data.name);
    if (data.description) {
      // REVISAR: rich-text Chakra (ProseMirror-like). Não há TC que
      // precise — caller que precise descrição customizada deve
      // implementar o flow específico aqui.
      throw new Error('fillNewPanelForm: description ainda não implementado (rich-text Chakra)');
    }
  }

  /**
   * Click "Salvar" e aguarda redirect para `/panels/{paineId}/edit` (sucesso)
   * — comportamento real, NÃO volta para a listagem após salvar (descoberto
   * live 2026-05-06).
   */
  async submitNewPanelForm(): Promise<void> {
    // Defesa em profundidade: NPS pode aparecer por inactivity entre o
    // open (fill) e o submit. Repetimos o dismiss imediatamente antes do
    // click — o helper é idempotente (~50ms quando não há nada visível).
    await dismissCommonModals(this.page);
    await this.getNewPanelSaveButton().click();
    await this.page.waitForURL(/\/panels\/\d+\/edit/);
  }

  /**
   * Conveniência: open + fill + submit. Usado por `beforeAll` dos specs
   * para criar painel próprio antes de cada describe.
   */
  async createPanel(data: { name: string; description?: string }): Promise<void> {
    await this.openNewPanelForm();
    await this.fillNewPanelForm(data);
    await this.submitNewPanelForm();
  }

  // ---------- CRUD: exclusão ----------

  /**
   * Modal de confirmação de exclusão (Chakra `<AlertDialog>`). Aparece após
   * click no ícone delete da linha. IDs estáveis dos botões descobertos live
   * 2026-05-06: `#panels-delete-confirm-button`, `#panels-delete-cancel-button`,
   * `#panels-delete-close-button` (X no header).
   * REVISAR: aguardando data-test-id "paineis-list-delete-modal".
   */
  getDeleteConfirmModal(): Locator {
    return this.page.getByRole('alertdialog');
  }

  getDeleteConfirmButton(): Locator {
    return this.page.locator('#panels-delete-confirm-button');
  }

  getDeleteCancelButton(): Locator {
    return this.page.locator('#panels-delete-cancel-button');
  }

  /**
   * Linha estável por `data-item-name`. Mais robusto que `getRowByName`
   * (que casa via `<p>` na coluna 1) porque não falha se a row tiver
   * variação de whitespace ou se houver outra `<p>` com o mesmo nome em
   * outro contexto. Descoberto live 2026-05-06.
   */
  getRowByItemName(name: string): Locator {
    // CSS attribute selector com escape: nomes com timestamp/aspas seriam
    // problema, mas geramos nomes ASCII-safe (`Painel QA Teste TC1 w0-...`).
    return this.page.locator(`tbody tr[data-item-name="${name}"]`);
  }

  /**
   * Click no ícone delete da linha cujo nome é `{name}` e confirma o modal.
   * Aguarda a linha desaparecer da listagem (condição-based, sem
   * waitForTimeout). Falha se a row ou o modal não aparecerem — caller
   * que precise tolerar painel inexistente deve usar `deletePanelByNameSafe`.
   */
  async deletePanelByName(name: string): Promise<void> {
    // Garante modo Lista antes de buscar — `getRowByName` casa em `tbody tr`,
    // que só existe em modo Lista. Em viewport menor (default ~1280×720,
    // como em afterAll/beforeAll sem test.use), o default é Cards e a row
    // não aparece. setViewMode é idempotente (no-op se já está em Lista).
    await this.setViewMode('lista');
    const row = this.getRowByName(name);
    await row.locator('[data-icon="delete"]').click();
    await this.getDeleteConfirmModal().waitFor();
    await this.getDeleteConfirmButton().click();
    await expect(row).toHaveCount(0, {
      timeout: 10_000,
    });
  }

  /**
   * Versão tolerante a falhas — não estoura se o painel já foi deletado ou
   * nunca foi criado. Usado em `afterAll` para cleanup robusto: se o teste
   * falhou antes de criar o painel, o cleanup vira no-op em vez de
   * mascarar o erro original do teste.
   */
  async deletePanelByNameSafe(name: string): Promise<void> {
    try {
      await this.setViewMode('lista');
      const row = this.getRowByName(name);
      const exists = (await row.count()) > 0;
      if (!exists) {
         
        console.warn(`[deletePanelByNameSafe] painel "${name}" não existe — cleanup no-op`);
        return;
      }
      await this.deletePanelByName(name);
    } catch (err) {
       
      console.warn(
        `[deletePanelByNameSafe] falha ao deletar "${name}": ${(err as Error).message}`,
      );
    }
  }

  // ---------- Associação painel↔menu de modo de uso (TC3) ----------
  // Validado live 2026-05-06 (após deploy da opção "Painéis do usuário" no
  // `<select id="page_model">`). Estrutura do form de novo item de menu:
  // - URL: /o/{orgId}/use_modes/{useModeId}/use_mode_itens/new
  // - Campo Nome: `<input id="title" placeholder="Nome do menu">` (obrigatório)
  // - Campo Ícone: grid de `<i class="material-symbols-outlined">` — ícone
  //   default é selecionado automaticamente pelo backend (não precisa clicar)
  //   se o usuário não escolher; campo é obrigatório por label mas o submit
  //   passa sem click manual no item.
  // - Campo Modelo de página: `<select id="page_model">` com option
  //   `value="user_panels"` (texto "Painéis do usuário") — última posição.
  // - Quando page_model="user_panels": aparece group "Espaço*" com
  //   react-select de container `#panel` e input `input[id^="react-select-"][id$="-input"]`.
  //   Filtro client-side por substring; opções têm id `react-select-{N}-option-{idx}`.
  // - Salvar: botão `#use-model-submit` (texto "Salvar") faz POST e
  //   redireciona para `/use_modes/{useModeId}/edit?tab=items`.
  //
  // Disassociação = excluir o item de menu via ícone Delete da row do item:
  // - Row na tabela de items tem `data-item-name="{itemName}"`.
  // - Ícone Delete: `<span class="material-symbols-outlined">Delete</span>` na
  //   última coluna da row (texto literal "Delete", não "delete" minúsculo —
  //   é o nome do ícone Material Symbols).
  // - Click abre `<div role="alertdialog">` com `#modal-delete-confirm`
  //   (texto "Excluir") e `#modal-delete-cancel`.

  /**
   * Cria item de menu vinculado ao painel `panelName` no modo de uso
   * `useModeId`. Se `itemName` não for fornecido, gera baseado no panelName.
   *
   * Pré-condição: painel `panelName` já existe e está ativo. Se o nome não
   * for único, o react-select pode resolver a primeira ocorrência — caller
   * deve garantir unicidade (TC3 usa nome worker-isolated com timestamp).
   */
  async associatePanelToMenu(
    panelName: string,
    useModeId: number,
    itemName?: string,
  ): Promise<void> {
    const finalItemName = itemName ?? `Item ${panelName}`;
    await this.page.goto(
      `/o/${this.orgId()}/use_modes/${useModeId}/use_mode_itens/new`,
    );
    // Mesmo motivo de openNewPanelForm: NPS pode interceptar o submit
    // (`#use-model-submit`) via chakra-portal. Ver skill `fechar-modais-twygo`.
    await dismissCommonModals(this.page);
    // Plan/contract toggle (skill `alterar-funcionalidade-contrato-twygo`)
    // tem cache TTL no Twygo — option `user_panels` pode demorar segundos
    // pra aparecer no select. Reload + refill até option disponível.
    await expect(async () => {
      const hasOption = await this.page.evaluate(() => {
        const sel = document.getElementById('page_model') as HTMLSelectElement | null;
        if (!sel) return false;
        return Array.from(sel.options).some((o) => o.value === 'user_panels');
      });
      if (!hasOption) {
        await this.page.reload({ waitUntil: 'domcontentloaded' });
        await dismissCommonModals(this.page);
        throw new Error('option user_panels ainda não disponível (cache plan)');
      }
    }).toPass({ timeout: 60_000, intervals: [3_000, 5_000, 8_000] });
    // Refill nome após potencial reload(s).
    await this.getMenuItemNameInput().waitFor();
    await this.getMenuItemNameInput().fill(finalItemName);
    await this.getMenuItemPageModelSelect().selectOption('user_panels');
    // O react-select container `#panel` só renderiza após page_model="user_panels".
    // Aguardamos visibilidade antes de clicar — sem waitForTimeout (regra dura #1).
    await this.getMenuItemPanelChooser().waitFor();
    await this.getMenuItemPanelChooser().click();
    // Filtro client-side: digitar o nome do painel restringe options ao alvo.
    await this.getMenuItemPanelChooserInput().fill(panelName);
    // A primeira (e única, pós-filtro) option tem id `react-select-{N}-option-0`.
    // O `{N}` é dinâmico (incrementa por mount do react-select); ancoramos pelo
    // suffix `-option-0` em qualquer combobox aberto.
    await this.page.locator('[id^="react-select-"][id$="-option-0"]').first().click();
    await this.getMenuItemSubmitButton().click();
    // Produto pode exibir modal "Modelo de página duplicado" se o useMode já
    // tem outro item usando page_model="user_panels" (cenário típico quando
    // TC3 e TC4 rodam na mesma suite, OU quando o env acumulou orphans de
    // execuções anteriores). Aceitamos clicando no botão de confirmação.
    // Selector: button id prefix `duplicated-page-` (confirmado via Jam
    // 12/05/2026), MAS o modal pode ter X-close + Salvar com o mesmo
    // prefix — filtra por texto "Salvar" pra não dismissar sem confirmar.
    // Timeout 5s — headed mode renderiza mais devagar que headless.
    const duplicateConfirmBtn = this.page
      .locator('[id^="duplicated-page-"]')
      .filter({ hasText: /^salvar$/i });
    try {
      await duplicateConfirmBtn.first().waitFor({ state: 'visible', timeout: 5_000 });
      await duplicateConfirmBtn.first().click();
    } catch {
      // Sem modal de duplicação — redirect direto. No-op intencional.
    }
    await this.page.waitForURL(
      new RegExp(`/use_modes/${useModeId}/edit\\?tab=items`),
    );
    // NOTA (12/05/2026): aqui antigamente havia um segundo `getMenuItemSubmitButton().click()`
    // (Salvar no editor) com waitForResponse do bulk_update — tentativa de
    // workaround pro bug `GET /panels/{id}/linked_menus 500` do TC3. Trace
    // de 12/05/2026 mostrou que o workaround não funciona (500 acontece
    // mesmo após o save), e o save extra estava DIFERENCIANDO o fluxo
    // automatizado do manual descrito pelo QA Lead — que faz apenas um
    // Salvar único (após o toggle de menu, não logo após a criação).
    // Removido pra alinhar com o fluxo manual validado.
  }

  /**
   * Remove o item de menu cujo nome é `itemName` do modo de uso `useModeId`.
   * Se `itemName` não fornecido, usa o mesmo padrão de `associatePanelToMenu`
   * (`Item ${panelName}`).
   */
  async disassociatePanelFromMenu(
    panelName: string,
    useModeId: number,
    itemName?: string,
  ): Promise<void> {
    const finalItemName = itemName ?? `Item ${panelName}`;
    await this.page.goto(
      `/o/${this.orgId()}/use_modes/${useModeId}/edit?tab=items`,
    );
    const row = this.getMenuItemRowByName(finalItemName);
    await row.waitFor();
    await this.getMenuItemDeleteIcon(finalItemName).click();
    await this.getMenuItemDeleteConfirmButton().waitFor();
    await this.getMenuItemDeleteConfirmButton().click();
    await expect(row).toHaveCount(0, { timeout: 10_000 });
    // Mesma armadilha do `associatePanelToMenu`: o click final dispara um
    // PATCH `bulk_update` async. Sem esperar a resposta, `ctx.close()` do
    // afterAll aborta o request e a desassociação fica parcial — gerando
    // estado órfão que polui o tenant entre runs.
    await Promise.all([
      this.page.waitForResponse(
        (r) =>
          r.url().includes(`/use_modes/${useModeId}/use_mode_itens/bulk_update`) &&
          r.request().method() === 'PATCH',
      ),
      this.getMenuItemSubmitButton().click(),
    ]);
  }

  /**
   * Versão tolerante a falhas — usado em `afterAll` para cleanup robusto.
   * Se o item já foi deletado ou nunca foi criado, vira no-op em vez de
   * mascarar a falha original do teste.
   */
  async disassociatePanelFromMenu_safe(
    panelName: string,
    useModeId: number,
    itemName?: string,
  ): Promise<void> {
    const finalItemName = itemName ?? `Item ${panelName}`;
    try {
      await this.page.goto(
        `/o/${this.orgId()}/use_modes/${useModeId}/edit?tab=items`,
      );
      const row = this.getMenuItemRowByName(finalItemName);
      const exists = (await row.count()) > 0;
      if (!exists) {
         
        console.warn(
          `[disassociatePanelFromMenu_safe] item "${finalItemName}" não existe no menu ${useModeId} — cleanup no-op`,
        );
        return;
      }
      await this.disassociatePanelFromMenu(panelName, useModeId, itemName);
    } catch (err) {
       
      console.warn(
        `[disassociatePanelFromMenu_safe] falha ao desassociar "${finalItemName}" de ${useModeId}: ${(err as Error).message}`,
      );
    }
  }

  // ---------- Form de item de menu (auxiliares de associação) ----------

  getMenuItemNameInput(): Locator {
    // REVISAR: aguardando data-test-id "use-mode-item-form-name-input";
    // fallback usa id estável `#title` (descoberto live 2026-05-06).
    return this.page.locator('#title');
  }

  getMenuItemPageModelSelect(): Locator {
    // REVISAR: aguardando data-test-id "use-mode-item-form-page-model-select".
    // Atributo name + id são ambos `page_model` no `<select>` real.
    return this.page.locator('#page_model');
  }

  /**
   * Container clicável do react-select que aparece quando page_model="user_panels".
   * O container tem id estável `#panel` (descoberto live). O `<input>` interno
   * tem id dinâmico `react-select-{N}-input` que muda entre re-mounts do
   * componente — por isso ancoramos no container, não no input.
   */
  getMenuItemPanelChooser(): Locator {
    return this.page.locator('#panel');
  }

  /**
   * Input de busca do react-select de painel. ID dinâmico (`react-select-3-input`
   * na exploração live, mas o `3` muda); ancoramos pelo prefix/suffix.
   * REVISAR: o react-select não expõe id estável próprio — caso o backend
   * estabilize via PR de data-test-id, atualizar.
   */
  getMenuItemPanelChooserInput(): Locator {
    return this.page.locator('input[id^="react-select-"][id$="-input"]').first();
  }

  /**
   * Botão Salvar do form de novo item de menu. Mesmo id é usado pelo botão
   * Salvar do menu edit (tab Menu) — ambos com `#use-model-submit`. Descoberto
   * live 2026-05-06.
   */
  getMenuItemSubmitButton(): Locator {
    return this.page.locator('#use-model-submit');
  }

  /**
   * Row da tabela de items na aba Menu do menu edit. Ancora pelo `<p>` da
   * 2ª `<td>` com texto exato (mirror de `getRowByName` para panels — mesmo
   * padrão filter+has).
   *
   * REVISAR: a `<tr>` expõe `data-item-name="{name}"` e o seletor anterior
   * `tbody tr[data-item-name="${name}"]` parecia direto; falha porque o
   * `<input id="title" maxLength="25">` do form de novo item TRUNCA
   * silenciosamente nomes >25 chars no backend. Quando o caller passa
   * "Item Painel Vinculado TC3 w1-1778104667626" (43 chars), o stored fica
   * "Item Painel Vinculado TC3" (25 chars) — `data-item-name` reflete o
   * truncado e o seletor não casa. Truncamos aqui pra refletir o contrato
   * real do backend. Mesma classe de bug do `data-paineid`/encoding em
   * panels (caso anterior que motivou `getRowByName` via `<p>`).
   */
  getMenuItemRowByName(name: string): Locator {
    const truncated = name.slice(0, 25);
    const exactRe = new RegExp(`^${escapeRegex(truncated)}$`);
    return this.page
      .locator('tbody tr')
      .filter({ has: this.page.locator('td:nth-child(2) p', { hasText: exactRe }) });
  }

  /**
   * Ícone Delete (Material Symbol literal "Delete") da última coluna da row
   * de item. Filtro `hasText` exato evita conflito com a coluna "Modelo de
   * página" se algum modelo se chamar literalmente "Delete" no futuro.
   */
  getMenuItemDeleteIcon(name: string): Locator {
    return this.getMenuItemRowByName(name)
      .locator('span.material-symbols-outlined', { hasText: /^Delete$/ });
  }

  /**
   * Botão "Excluir" do `<div role="alertdialog">` que confirma exclusão de
   * item de menu. ID estável `#modal-delete-confirm` (≠ do modal de delete
   * de painel que usa `#panels-delete-confirm-button`).
   */
  getMenuItemDeleteConfirmButton(): Locator {
    return this.page.locator('#modal-delete-confirm');
  }

  // ---------- Editor sub-tab Menu (TC4) — switch de ativação por item ----------

  /**
   * Label clicável (chakra-switch) do switch de ativação do item de menu
   * na sub-tab Menu do editor. Cada row tem 1 `label.chakra-switch` que
   * envolve `input#menu-enabled-{menuId}`. Ancoramos pela row (truncated
   * name) — não precisamos do menuId numérico. Mantemos label (não track)
   * pelo mesmo motivo de getRowActiveSwitchLabelByName.
   *
   * Mesmo gotcha de §7.5: input Chakra é `clip: rect(0,0,0,0); width: 1px`,
   * click direto no input trava por actionability — sempre o label.
   */
  getMenuItemActiveSwitchLabel(itemName: string): Locator {
    return this.getMenuItemRowByName(itemName).locator('label.chakra-switch');
  }

  getMenuItemActiveSwitchInput(itemName: string): Locator {
    return this.getMenuItemRowByName(itemName).locator('input[type="checkbox"]');
  }

  /**
   * Radio "Página inicial" da row do item. Twygo permite UM item por
   * useMode marcado como página padrão (radio com mesmo name agrupado).
   * Clicar no label seleciona o item; após save (bulk_update), passa a
   * ser a landing page do perfil daquele useMode.
   *
   * Estrutura: col 3 (4a coluna) com `label.chakra-radio` envolvendo
   * `input.chakra-radio__input[type="radio"]`. Clicar no LABEL (input
   * é `clip:rect(0,0,0,0)` Chakra, click direto trava actionability).
   *
   * Validado live 2026-05-15 em useMode 70081 (Aluno @ 36989).
   */
  getMenuItemHomepageRadioLabel(itemName: string): Locator {
    return this.getMenuItemRowByName(itemName).locator('label.chakra-radio');
  }

  /**
   * Marca o item como página inicial (padrão) + salva via bulk_update.
   * Idempotente: se já é padrão, no-op no save (mas radio é click-safe).
   */
  async setMenuItemAsHomepage(useModeId: number, itemName: string): Promise<void> {
    await this.page.goto(
      `/o/${this.orgId()}/use_modes/${useModeId}/edit?tab=items`,
    );
    await dismissCommonModals(this.page);
    const radio = this.getMenuItemHomepageRadioLabel(itemName);
    await radio.waitFor({ state: 'visible', timeout: 10_000 });
    await radio.click();
    await Promise.all([
      this.page.waitForResponse(
        (r) =>
          r.url().includes(`/use_modes/${useModeId}/use_mode_itens/bulk_update`) &&
          r.request().method() === 'PATCH',
        { timeout: 15_000 },
      ),
      this.getMenuItemSubmitButton().click(),
    ]);
  }

  // ---------- Cleanup preemptive de items órfãos (TC3/TC4) ----------

  /**
   * Rows de items de menu cujo `data-item-name` ou nome visível começa com
   * `prefix`. Tenant compartilhado (`widgetsdisabled`) acumula órfãos
   * entre runs — `deleteOrphanMenuItemsByPrefix` usa este locator pra
   * limpar antes de cada spec.
   */
  getMenuItemRowsByPrefix(prefix: string): Locator {
    const truncated = prefix.slice(0, 25);
    const prefixRe = new RegExp(`^${escapeRegex(truncated)}`);
    return this.page
      .locator('tbody tr')
      .filter({ has: this.page.locator('td:nth-child(2) p', { hasText: prefixRe }) });
  }

  /**
   * Deleta TODOS os items de menu do `useModeId` cujo nome começa com
   * `prefix`. Cleanup preemptive para specs em tenant compartilhado.
   *
   * Sequência por item:
   *  1. Click no ícone Delete da row
   *  2. Confirma modal `#modal-delete-confirm`
   *  3. Aguarda row sumir do DOM
   *
   * Após deletar todos, faz UM save final (`PATCH bulk_update`) — sem
   * isso, a desassociação fica pendente e ctx.close() do afterAll a
   * descarta. Validado live 2026-05-15.
   */
  async deleteOrphanMenuItemsByPrefix(useModeId: number, prefix: string): Promise<number> {
    await this.page.goto(
      `/o/${this.orgId()}/use_modes/${useModeId}/edit?tab=items`,
    );
    await dismissCommonModals(this.page);

    let deleted = 0;
    let safetyLimit = 50;
    while (safetyLimit-- > 0) {
      const rows = this.getMenuItemRowsByPrefix(prefix);
      const count = await rows.count();
      if (count === 0) break;
      const first = rows.first();
      await first
        .locator('span.material-symbols-outlined', { hasText: /^Delete$/ })
        .click();
      await this.getMenuItemDeleteConfirmButton().waitFor({ state: 'visible', timeout: 5_000 });
      await this.getMenuItemDeleteConfirmButton().click();
      await first.waitFor({ state: 'detached', timeout: 10_000 }).catch(() => null);
      deleted++;
    }

    if (deleted > 0) {
      await Promise.all([
        this.page.waitForResponse(
          (r) =>
            r.url().includes(`/use_modes/${useModeId}/use_mode_itens/bulk_update`) &&
            r.request().method() === 'PATCH',
          { timeout: 15_000 },
        ),
        this.getMenuItemSubmitButton().click(),
      ]);
    }
    return deleted;
  }

  /**
   * Toast Chakra de bloqueio ao tentar RE-ATIVAR menu vinculado a painel
   * inativo (TC4). Confirmado via Jam recording de QA 12/05/2026: id estável
   * `toast-inactive-panel` no elemento (`#toast-inactive-panel`). Fallback
   * pra filter por texto caso o id mude no futuro.
   */
  getPanelInactiveToast(): Locator {
    return this.page.locator('#toast-inactive-panel').first();
  }

  /**
   * Inativa o item de menu cujo nome (truncado p/ 25 chars no backend) é
   * `itemName` no useMode `useModeId`. Idempotente: no-op se já inativo.
   * Pré-condição: caller já chamou `associatePanelToMenu` antes.
   *
   * Usado como SEED do TC4 (pré-condição "menu inativo"). Inativar nunca
   * dispara modal — o bloqueio é só ao RE-ATIVAR com painel vinculado inativo.
   */
  async ensureMenuItemInactive(useModeId: number, itemName: string): Promise<void> {
    await this.page.goto(`/o/${this.orgId()}/use_modes/${useModeId}/edit?tab=items`);
    await dismissCommonModals(this.page);
    const input = this.getMenuItemActiveSwitchInput(itemName);
    await input.waitFor({ state: 'attached' });
    const isActive = await input.isChecked();
    if (!isActive) return;
    await this.getMenuItemActiveSwitchLabel(itemName).click();
    await expect(input).not.toBeChecked();
    // Persist obrigatório — sub-tab Menu não auto-salva. Click no Salvar
    // dispara PATCH bulk_update; sem aguardar a resposta, ctx.close() do
    // beforeAll aborta o request e o toggle reverte ao recarregar a página.
    await Promise.all([
      this.page.waitForResponse(
        (r) =>
          r.url().includes(`/use_modes/${useModeId}/use_mode_itens/bulk_update`) &&
          r.request().method() === 'PATCH',
      ),
      this.getMenuItemSubmitButton().click(),
    ]);
    // Verificação dura: recarregar a página e re-asseverar que o switch
    // realmente persistiu como off. Se bulk_update aceitou 200 mas o backend
    // não reflete (cache, flag não incluída no payload, ou bug), aqui sabemos
    // — em vez de descobrir só na próxima operação que depende dessa state.
    await this.page.reload();
    const inputAfterReload = this.getMenuItemActiveSwitchInput(itemName);
    await inputAfterReload.waitFor({ state: 'attached' });
    await expect(inputAfterReload).not.toBeChecked();
    // Aguarda network estabilizar. Comparação Jam manual × automação (12/05/2026)
    // mostrou que a operação manual passou ~30s entre Salvar do menu e click
    // no toggle do painel, enquanto o agent (sem espera) ia direto e o backend
    // ainda não tinha propagado o estado — `GET /panels/{id}/linked_menus`
    // retornava 500 e `change_status` 422. Network idle dá tempo de propagar.
    await this.page.waitForLoadState('networkidle');
  }

  // ---------- Pesquisa client-side (testsuite Pesquisa e Filtros) ----------
  // Re-explorado live 2026-05-13 na org 36988:
  // - Input de pesquisa tem id estável `#play-interest-search` e placeholder
  //   "Pesquise por nome ou descrição" (já usado em getSearchInput()).
  // - Search é client-side: digitar filtra a tabela imediatamente; limpar
  //   (`fill('')`) restaura a listagem. NÃO há botão "X" para clear — só o
  //   ícone lupa decorativo dentro do `chakra-input__left-element`.
  // - Empty state pós-search: o produto injeta uma `<tr><td colspan="5">
  //   <div class="...">Não há dados para exibir</div></td></tr>` no tbody.

  /**
   * Preenche o input de pesquisa com `term`. Search é client-side
   * (re-confirmado live 2026-05-13) — não dispara request, filtra em
   * memória. Caller deve usar `expect.poll` ou `waitFor` em locator de
   * resultado para sincronizar, não waitForTimeout.
   */
  async searchPanels(term: string): Promise<void> {
    await this.getSearchInput().fill(term);
  }

  /**
   * Limpa o input de pesquisa (volta a listagem completa). Como NÃO existe
   * botão "X" para clear, usamos `fill('')` — comportamento idêntico a
   * apagar manualmente o conteúdo.
   */
  async clearSearch(): Promise<void> {
    await this.getSearchInput().fill('');
  }

  /**
   * Estado vazio "Não há dados para exibir" renderizado COMO LINHA da tabela
   * após search sem matches. Ancoramos no `<div>` dentro de `tbody td` com
   * `colspan` para distinguir do empty state da org sem painéis (que renderiza
   * em outro contexto — ver `getEmptyStateText`).
   * REVISAR: aguardando data-test-id "paineis-list-empty-state-no-results".
   */
  getEmptyStateNoResults(): Locator {
    return this.page.locator('tbody td[colspan]', { hasText: 'Não há dados para exibir' });
  }

  // ---------- Filtros (drawer Lista de filtros + Filtro rápido) ----------
  // Re-explorado live 2026-05-13. Ver SKILL testar-filtro-drawer-twygo.

  /**
   * Botão "Limpar filtro" (singular) que aparece no topo da listagem quando
   * há filtro ativo. Texto literal "Limpar filtro" precedido do ícone
   * `filter_alt_off`. REVISAR: aguardando data-test-id.
   */
  getClearFilterButton(): Locator {
    return this.page.locator('#clear-filter');
  }

  /**
   * Click em "Limpar filtro" — remove filtro ativo. Idempotente: só clica
   * se o botão estiver visível. Aguarda o botão desaparecer (condition-based).
   */
  async clearFilter(): Promise<void> {
    const clearBtn = this.getClearFilterButton();
    if (await clearBtn.isVisible().catch(() => false)) {
      await clearBtn.click();
      await expect(clearBtn).toHaveCount(0, { timeout: 5_000 });
    }
  }

  /**
   * Aplica um filtro padrão do drawer "Lista de filtros". Click no label
   * wrapper (input Chakra é hidden clip 1×1). Pós-condição: #clear-filter visível.
   */
  async applyDefaultFilter(name: 'Painéis ativos' | 'Painéis inativos'): Promise<void> {
    await this.getFilterButton().click();
    await dismissCommonModals(this.page);
    const radioId = name === 'Painéis ativos' ? '#default-filters-0' : '#default-filters-1';
    await this.page.locator(`label.chakra-radio:has(${radioId})`).click();
    await this.page.locator('#list-filter-apply').click();
    await expect(this.getClearFilterButton()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Aplica filtro por coluna via fluxo Novo do drawer. Detalhamento dos
   * controles por coluna na skill `testar-filtro-drawer-twygo`.
   */
  async applyColumnFilter(opts: {
    column: 'Nome' | 'Descrição' | 'Ativo' | 'Data de criação';
    value?: string;
    dateFrom?: string;
    dateTo?: string;
  }): Promise<void> {
    await this.getFilterButton().click();
    await dismissCommonModals(this.page);
    await this.page.locator('.chakra-modal__content').getByText('Novo', { exact: true }).click();
    await this.page.locator('#menu-button-plus-options-filters').click();
    // Click NA LABEL do menuitem (não no `[role=menuitem]` direto) — descoberto
    // 2026-05-11 durante exploração; menuitem-button fecha o menu sem togglar.
    await this.page
      .locator('[role="menuitem"]', { hasText: this.menuItemTextForColumn(opts.column) })
      .locator('label.chakra-checkbox')
      .click();

    switch (opts.column) {
      case 'Nome': {
        if (!opts.value) throw new Error("applyColumnFilter('Nome'): value é obrigatório");
        await this.page.locator('#option_name').click();
        await this.page.locator('#option_name input[role="combobox"]').fill(opts.value);
        await this.page
          .locator('[id^="react-select-"][id$="-option-0"]')
          .first()
          .click();
        break;
      }
      case 'Descrição': {
        if (!opts.value) throw new Error("applyColumnFilter('Descrição'): value é obrigatório");
        // ID duplicado entre `<div>` lupa e `<input>` real — prefixar com `input`.
        await this.page.locator('input#option_description').fill(opts.value);
        break;
      }
      case 'Ativo': {
        if (!opts.value) throw new Error("applyColumnFilter('Ativo'): value é obrigatório");
        const inputId = opts.value === 'Sim' ? '#option_is_active-true' : '#option_is_active-false';
        await this.page.locator(`label.chakra-checkbox:has(${inputId})`).click();
        break;
      }
      case 'Data de criação': {
        if (!opts.dateFrom || !opts.dateTo) {
          throw new Error("applyColumnFilter('Data de criação'): dateFrom e dateTo são obrigatórios");
        }
        await this.page.locator('#option_created_at-from').fill(opts.dateFrom);
        await this.page.locator('#option_created_at-to').fill(opts.dateTo);
        break;
      }
    }

    await this.page.locator('#form-filter-apply').click();
    await expect(this.getClearFilterButton()).toBeVisible({ timeout: 10_000 });
  }

  private menuItemTextForColumn(column: 'Nome' | 'Descrição' | 'Ativo' | 'Data de criação'): RegExp {
    if (column === 'Ativo') return /^Ativo\?$/;
    return new RegExp(`^${escapeRegex(column)}$`);
  }

  /**
   * Retorna o nome do primeiro painel da 1ª linha. Prefere `data-item-name`
   * (estável, mirror do backend); cai pro `td:first-child p` se ausente.
   */
  async getFirstPanelName(): Promise<string> {
    const firstRow = this.page.locator('tbody tr[data-item-name]').first();
    await firstRow.waitFor({ timeout: 10_000 });
    const fromAttr = await firstRow.getAttribute('data-item-name');
    if (fromAttr && fromAttr.trim().length > 0) return fromAttr;
    const fromText = await firstRow.locator('td:first-child p').textContent();
    return (fromText ?? '').trim();
  }
}
