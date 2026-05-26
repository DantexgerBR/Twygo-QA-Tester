import { expect, type Locator, type Page } from '@playwright/test';
import { getOrgId } from '../../../src/utils/environment.js';
import { safeGoto, safeReload } from '../../../src/utils/modals.js';

/**
 * Page Object da listagem de Repositórios (módulo Base de Conhecimento).
 *
 * URL canônica: `/o/{orgId}/knowledge_repositories`
 *
 * Observações de recon (2026-05-19, env staging — orgId 36602):
 * - `data-test-id="knowledge-repositories-list-container"` (container da lista)
 * - `data-test-id="filter-control-open-button"` (botão Filtrar)
 * - Placeholder do campo de busca: "Buscar repositórios"
 * - Modal aberto detectado no recon — `safeGoto` obrigatório (dismissCommonModals).
 * - Colunas da listagem (extraídas do recon): Nome, Descrição, Categoria, Classificação
 *
 * Drawer de filtros — padrão Chakra slide-in compartilhado:
 * - IDs canônicos: `#list-filter-apply`, `#list-filter-cancel`, `#list-filter-close`,
 *   `#form-filter-apply`, `#form-filter-cancel`, `#clear-filter`
 * - Modo A (sem filtro ativo): `#list-filter-apply` visível
 * - Modo B (filtro ativo): `#form-filter-apply` visível
 * - Filtros Categoria e Classificação via accordion "Colunas para filtrar" dentro
 *   do drawer modo B. Seleção via checkbox/radio — marcado como REVISAR-FIGMA pois
 *   recon não capturou drawer aberto; implementação usa seletor robusto por label.
 *
 * Compartilhado com a suíte "Listagem básica de repositórios".
 *
 * `orgIdOverride` (opcional) força o orgId nos paths `/o/{X}/...` — usado por
 * specs cross-env (suite ambientes-adicionais-isolamento). Sem override,
 * fallback é `getOrgId()` da project.config. Ver skill
 * testar-ambientes-adicionais-twygo. Construtor 1-arg continua funcionando
 * (backward-compat com specs existentes).
 */
export class KnowledgeRepositoryListPage {
  constructor(
    private readonly page: Page,
    private readonly orgIdOverride?: string,
  ) {}

  private get orgId(): string {
    return this.orgIdOverride ?? getOrgId();
  }

  // ---------- Navegação ----------

  /**
   * Navega direto para a listagem de repositórios.
   * Obrigatório usar safeGoto — modal detectado no recon (NPS Sofia / "Continuar mesmo assim").
   * Espera até a listagem estar hidratada (tbody com linhas ou empty state) — container
   * visível não basta porque o SPA Chakra renderiza o tbody depois.
   */
  async goToList(): Promise<void> {
    // Retry idempotente — server stage tem flakiness intermitente onde sidebar
    // renderiza mas o container da lista nunca aparece (req travada / hidratação
    // do SPA bloqueada). Reload após 1ª tentativa frequentemente resolve.
    // safeReload com blockTrackers aborta Sophia/Intercom/etc que seguram `load`
    // e deixavam reload pendurado 30s (skill safe-reload-twygo).
    const maxAttempts = 2;
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt === 1) {
          await safeGoto(this.page, `/o/${this.orgId}/knowledge_repositories`);
        } else {
          await safeReload(this.page, { blockTrackers: true });
        }
        await this.page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => null);
        await this.getListContainer().waitFor({ state: 'visible', timeout: 20_000 });
        // .or().toBeVisible() não serve: a `<tr>` placeholder do empty state e o
        // `<div>` interno com o texto contam como 2 matches distintos no a11y
        // tree → strict-mode. Espera qualquer um dos dois isoladamente.
        await Promise.race([
          this.getTableRows().first().waitFor({ state: 'visible', timeout: 20_000 }),
          this.getEmptyState().waitFor({ state: 'visible', timeout: 20_000 }),
        ]);
        return;
      } catch (err) {
        lastErr = err;
         
        console.warn(`[goToList] tentativa ${attempt}/${maxAttempts} falhou: ${(err as Error).message}`);
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('goToList falhou após retries');
  }

  // ---------- Container principal ----------

  getListContainer(): Locator {
    return this.page.getByTestId('knowledge-repositories-list-container');
  }

  // ---------- Busca por nome ----------

  /**
   * Campo de busca da listagem. Placeholder difere entre tenants/envs:
   *  - "Buscar repositórios" (audit principal/stage10 — 2026-05-19)
   *  - "Pesquise por nome ou descrição" (env adicional/stage101parceira — 2026-05-24)
   * Regex tolerante cobre os dois sem perder estabilidade.
   */
  getSearchInput(): Locator {
    return this.page.getByPlaceholder(/Buscar repositórios|Pesquise por nome/i);
  }

  /**
   * Preenche o campo de busca e aguarda a tabela atualizar.
   * Usa pressSequentially (com delay) pra disparar o debounce server-side do
   * Twygo — fill() é instantâneo e o networkidle dispara ANTES do debounce
   * acontecer, então a busca não chega a filtrar.
   */
  async searchByName(query: string): Promise<void> {
    // Espera response da listagem se possível (debounce do Twygo dispara GET re-fetch)
    const respPromise = this.page
      .waitForResponse(
        (r) => r.url().includes('/knowledge_repositories') && r.request().method() === 'GET',
        { timeout: 15_000 },
      )
      .catch(() => null);
    const input = this.getSearchInput();
    await input.click();
    await input.fill('');
    await input.pressSequentially(query, { delay: 80 });
    await respPromise;
    await this.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => null);
  }

  /**
   * Limpa o campo de busca e aguarda networkidle + tabela restaurar.
   */
  async clearSearch(): Promise<void> {
    const respPromise = this.page
      .waitForResponse(
        (r) => r.url().includes('/knowledge_repositories') && r.request().method() === 'GET',
        { timeout: 15_000 },
      )
      .catch(() => null);
    await this.getSearchInput().clear();
    await respPromise;
    await this.page.waitForLoadState('networkidle', { timeout: 10_000 }).catch(() => null);
  }

  // ---------- Botão Filtrar / drawer ----------

  /**
   * Locator do botão "Filtro" da listagem.
   *
   * Audit chrome-devtools-mcp 2026-05-24: `data-test-id="filter-control-open-button"`
   * foi removido do produto; botão agora só tem `id="open-filter"`. Mantemos
   * fallback `.or()` pra retro-compat caso o testid volte.
   */
  getFilterButton(): Locator {
    return this.page.locator('#open-filter').or(
      this.page.getByTestId('filter-control-open-button'),
    );
  }

  getClearFilterButton(): Locator {
    return this.page.locator('#clear-filter');
  }

  /**
   * Indica se o botão "Limpar filtros" está visível (filtro ativo).
   */
  async isCleanFilterVisible(): Promise<boolean> {
    return this.getClearFilterButton().isVisible();
  }

  /** Drawer Chakra slide-in (não popover). É um div.chakra-slide com classe
   * chakra-modal__content (confirmado live 2026-05-19). */
  getDrawer(): Locator {
    return this.page.locator('div.chakra-slide.chakra-modal__content[role="dialog"]');
  }

  /** Alias privado p/ compat com chamadas internas anteriores. */
  private getDrawerSection(): Locator {
    return this.getDrawer();
  }

  /**
   * Abre o drawer de filtros e aguarda aparecer.
   * Auto-detecta se estava em modo B (filtro aplicado) e normaliza para o
   * drawer aberto em qualquer modo antes de retornar.
   */
  async openFilterDrawer(): Promise<void> {
    await this.getFilterButton().click();
    // Escopa pelo drawer Chakra (section.chakra-modal__content); role=dialog
    // genérico colide com popovers Chakra (3+ no DOM da listagem).
    await this.getDrawerSection().waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Fecha o drawer clicando no X.
   */
  async closeFilterDrawer(): Promise<void> {
    const closeBtn =
      this.page.locator('#list-filter-close').or(this.page.locator('#form-filter-close'));
    await closeBtn.first().click();
    await this.getDrawerSection().waitFor({ state: 'hidden', timeout: 10_000 });
  }

  // ---------- Filtros por coluna ----------

  /**
   * Seleciona um valor no filtro de Categoria dentro do drawer.
   * Navega para modo B via "Novo" se o drawer estiver em modo A.
   *
   * REVISAR-FIGMA: recon não capturou drawer aberto — seleção usa padrão
   * Chakra checkbox/radio por label. Se o produto usar outro componente
   * (react-select, etc.), atualizar seletor.
   */
  async selectCategoryFilter(value: string): Promise<void> {
    await this._selectColumnFilter('Categoria', value);
  }

  /**
   * Seleciona um valor no filtro de Classificação dentro do drawer.
   *
   * REVISAR-FIGMA: idem a selectCategoryFilter.
   */
  async selectClassificationFilter(value: string): Promise<void> {
    await this._selectColumnFilter('Classificação', value);
  }

  /**
   * Implementação interna — seleciona uma opção em um filtro de coluna dentro
   * do drawer. O drawer deve estar aberto antes de chamar.
   *
   * Fluxo (padrão Chakra drawer — skill testar-filtro-drawer-twygo):
   * 1. Detecta modo do drawer (A: #list-filter-apply | B: #form-filter-apply).
   * 2. Se modo A: clica em "Novo" para criar filtro rápido (modo B).
   * 3. Expande "Colunas para filtrar" se colapsado.
   * 4. Abre "Opções de filtro" e seleciona a coluna desejada.
   * 5. Preenche o valor.
   */
  private async _selectColumnFilter(column: string, value: string): Promise<void> {
    const drawer = this.getDrawerSection();

    // Detecta modo do drawer
    const isModeB = await this.page.locator('#form-filter-apply').isVisible();

    if (!isModeB) {
      // Modo A: clica em "Novo" para criar filtro rápido. "Novo" é texto clicável,
      // não <button> (confirmado live 2026-05-21).
      await drawer.getByText('Novo', { exact: true }).first().click();
      await this.page.locator('#form-filter-apply').waitFor({ state: 'visible', timeout: 8_000 });
    }

    // Expande accordion "Colunas para filtrar" se colapsado
    const accordionBtn = this.page.locator('#accordion-button-expand-columns-filters');
    const isExpanded = await accordionBtn.getAttribute('aria-expanded');
    if (isExpanded !== 'true') {
      await accordionBtn.click();
    }

    // Abre menu "Opções de filtro"
    await this.page.locator('#menu-button-plus-options-filters').click();

    // Marca a coluna via label do menuitem (padrão Chakra checkbox interno)
    const menuItem = this.page.getByRole('menuitem', { name: column });
    const label = menuItem.locator('label.chakra-checkbox');
    const labelVisible = await label.isVisible().catch(() => false);
    if (labelVisible) {
      await label.click();
    } else {
      await menuItem.click();
    }

    // Fecha menu Chakra (fica aberto por design para multi-select)
    await this.page.keyboard.press('Escape');

    // Após marcar a coluna, o produto renderiza um input/select com label da coluna
    // dentro do drawer. Preenche o valor.
    await this._fillColumnValue(column, value);
  }

  /**
   * Preenche o valor de um filtro de coluna recém-marcado.
   *
   * O componente real é um async-select Chakra (input editável + dropdown async
   * que busca no server). Não basta `fill()` — precisa abrir o dropdown,
   * digitar pra filtrar, esperar "Carregando..." sumir e CLICAR na opção exata.
   * Confirmado live 2026-05-21 via recon: digitar sem clicar manda payload vazio.
   */
  /**
   * Mapa coluna PT-BR → id do container do filtro Twygo.
   * Confirmado live 2026-05-21: cada coluna marcada renderiza
   * `<div id="option_<snake_case>" class="basic-multi-select">` (react-select).
   */
  private static readonly COLUMN_OPTION_IDS: Record<string, string> = {
    Categoria: '#option_category',
    Classificação: '#option_classification',
    Nome: '#option_name',
    Descrição: '#option_description',
  };

  private async _fillColumnValue(column: string, value: string): Promise<void> {
    const drawer = this.getDrawerSection();
    const optionId = KnowledgeRepositoryListPage.COLUMN_OPTION_IDS[column];
    if (!optionId) {
      throw new Error(`Coluna sem mapeamento de id Twygo: "${column}"`);
    }

    // Aguarda o container do filtro de coluna aparecer no DOM
    const container = drawer.locator(optionId);
    await container.waitFor({ state: 'attached', timeout: 10_000 });

    // O input editável do react-select dentro do container
    const colInput = container.locator('input[role="combobox"]');
    await colInput.waitFor({ state: 'attached', timeout: 10_000 });

    // Foca o input e digita (react-select pede digitação no input pra abrir + filtrar).
    // Clica primeiro pra garantir abertura do listbox em alguns browsers.
    await colInput.click();
    await colInput.pressSequentially(value, { delay: 50 });

    // Aguarda "Carregando..." aparecer (até 5s) E sumir (até 20s). API do filtro é lenta.
    const loading = this.page.getByText('Carregando...', { exact: false });
    if (await loading.first().isVisible({ timeout: 5_000 }).catch(() => false)) {
      await loading.first().waitFor({ state: 'hidden', timeout: 20_000 }).catch(() => null);
    }

    // Clica na opção correspondente:
    // 1. role=option com nome exato (case-insensitive) — react-select usa role=option
    const exactOpt = this.page.getByRole('option', { name: new RegExp(`^${value}$`, 'i') });
    if (await exactOpt.first().isVisible({ timeout: 8_000 }).catch(() => false)) {
      await exactOpt.first().click();
      await this._finalizeReactSelectChoice(container, value);
      return;
    }

    // 2. Qualquer role=option (pega primeira) se backend retornou algo
    const anyOpt = this.page.getByRole('option');
    if (await anyOpt.first().isVisible({ timeout: 2_000 }).catch(() => false)) {
      await anyOpt.first().click();
      await this._finalizeReactSelectChoice(container, value);
      return;
    }

    // 3. dentro do container, qualquer elemento clicável com o texto exato
    const localOpt = container.getByText(value, { exact: true }).first();
    if (await localOpt.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await localOpt.click();
      await this._finalizeReactSelectChoice(container, value);
      return;
    }

    // 4. Fallback: Enter pega primeira opção visível do dropdown
    await colInput.press('Enter');
    await this._finalizeReactSelectChoice(container, value);
  }

  /**
   * Após clicar uma opção do react-select async:
   *  1. confirma o chip multi-value apareceu (state React firme)
   *  2. fecha o portal do dropdown (Escape) para liberar pointer-events
   *  3. aguarda `.select__menu-portal` sair do DOM
   *
   * Bug observado live 2026-05-21: sem isso, o portal "Carregando.../option"
   * fica sobreposto e intercepta clicks subsequentes (ex.: abrir Opções de
   * filtro pra adicionar Classificação após Categoria).
   */
  private async _finalizeReactSelectChoice(container: Locator, value: string): Promise<void> {
    // 1. Garante que o chip apareceu (state firmou)
    const chip = container.locator('.select__multi-value__label', { hasText: value });
    await chip.first().waitFor({ state: 'visible', timeout: 8_000 }).catch(() => null);

    // 2. Pressiona Escape no input pra fechar dropdown sem perder a seleção
    const colInput = container.locator('input[role="combobox"]');
    await colInput.press('Escape').catch(() => null);

    // 3. Aguarda o portal sumir (Chakra/react-select usa portal global)
    const portal = this.page.locator('.select__menu-portal');
    await portal
      .first()
      .waitFor({ state: 'hidden', timeout: 5_000 })
      .catch(() => null);
  }

  /**
   * Aplica um filtro padrão (radio em modo A do drawer) — "Bases sem fontes",
   * "Bases sem recursos", etc. Drawer deve estar aberto.
   *
   * Diferente de selectCategoryFilter/selectClassificationFilter, este NÃO usa
   * modo B (Novo → Colunas), e portanto não depende do react-select async que
   * está bugado (cross-origin get_categories_suggest pendente).
   */
  async applyDefaultFilter(labelText: string): Promise<void> {
    const drawer = this.getDrawerSection();
    // Filtros padrão são radios — clicar na label dispara seleção
    const radio = drawer.getByText(labelText, { exact: true }).first();
    await radio.waitFor({ state: 'visible', timeout: 8_000 });
    await radio.click();
    // Aplica
    await this.applyFilters();
  }

  /**
   * Clica no botão de aplicar filtro (#list-filter-apply ou #form-filter-apply)
   * e aguarda drawer fechar + re-listagem do backend.
   *
   * Sincroniza com o GET /knowledge_repositories disparado pelo Aplicar para
   * garantir que a tabela reflete o filtro antes de retornar (sem isso, a
   * asserção que lê linhas roda contra tabela stale).
   */
  async applyFilters(): Promise<void> {
    const respPromise = this.page
      .waitForResponse(
        (r) =>
          r.url().includes('/knowledge_repositories') &&
          !r.url().includes('suggest') &&
          r.request().method() === 'GET' &&
          r.status() === 200,
        { timeout: 15_000 },
      )
      .catch(() => null);
    const applyBtn = this.page
      .locator('#list-filter-apply')
      .or(this.page.locator('#form-filter-apply'));
    await applyBtn.first().click();
    await this.getDrawerSection().waitFor({ state: 'hidden', timeout: 10_000 });
    await respPromise;
    await this.page.waitForLoadState('networkidle').catch(() => null);
  }

  /**
   * Limpa todos os filtros aplicados (clica em #clear-filter).
   * Idempotente: se #clear-filter não estiver visível, não-op.
   */
  async clearAllFilters(): Promise<void> {
    const btn = this.getClearFilterButton();
    const visible = await btn.isVisible().catch(() => false);
    if (visible) {
      await btn.click();
      await this.page.waitForLoadState('networkidle');
    }
  }

  // ---------- Extrair dados (modal "Configurações da extração") ----------

  /**
   * Botão "Extrair dados" da toolbar — `id="data-export-button"`.
   *
   * Audit chrome-devtools-mcp 2026-05-24: botão renderiza com ícone `ios_share`
   * + label "Extrair dados". Recon antigo (2026-05-19) afirmava que botão de
   * exportar não existia; feature foi entregue entre 19/05 e 24/05.
   */
  getExtractDataButton(): Locator {
    return this.page.locator('#data-export-button');
  }

  /**
   * Modal "Configurações da extração" (Chakra dialog) que abre após click no
   * "Extrair dados". Possui 3 grupos de radios obrigatórios:
   *   - Formato: CSV / PDF
   *   - Dados (linhas): Filtro atual / Todos
   *   - Colunas: Filtro atual / Todas
   * + botões "Cancelar" / "Extrair".
   *
   * Locator usa `.chakra-modal__content` (mesma estratégia do drawer)
   * porque o Chakra dialog não expõe `aria-labelledby` apontando pro heading,
   * então `getByRole('dialog', { name: ... })` resolve com name vazio e dá
   * timeout. Escopa pelo heading interno pra distinguir de outros dialogs.
   */
  getExtractDataModal(): Locator {
    return this.page
      .locator('section.chakra-modal__content, div.chakra-modal__content')
      .filter({ has: this.page.getByRole('heading', { name: /Configurações da extração/i }) });
  }

  /**
   * Abre o modal "Configurações da extração" clicando em "Extrair dados".
   * Aguarda o modal aparecer.
   *
   * O botão `#data-export-button` aparece após hidratação da listagem; o
   * `goToList()` já espera por isso, mas garantimos esperar o botão estar
   * visível antes do click (idempotente).
   */
  async openExtractDataModal(): Promise<void> {
    const btn = this.getExtractDataButton();
    await btn.waitFor({ state: 'visible', timeout: 10_000 });
    await btn.click();
    await this.getExtractDataModal().waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Marca os radios obrigatórios do modal de extração. Não chama Extrair —
   * use `confirmExtractAndWaitDownload` em seguida.
   *
   * IDs estáveis confirmados live 2026-05-24:
   *   - `#radio-exportFormat-csv` / `#radio-exportFormat-pdf`
   *   - `#radio-data-filtro_atual` / `#radio-data-todos`
   *   - `#radio-columns-filtro_atual` / `#radio-columns-todas`
   *
   * O `<input type="radio">` Chakra é visualmente escondido (`display:none`-ish);
   * `click({ force: true })` do Playwright às vezes não dispara o `onChange`
   * do React (Chakra usa controlled radios com sync via state). Usar
   * `dispatchEvent('click')` equivale a `inputEl.click()` em JS — esse caminho
   * SEMPRE atualiza React state (confirmado live 2026-05-24 via chrome-devtools).
   * `click()` direto no <label> Chakra também não funciona — o `for` aponta
   * pro input escondido mas o Chakra wrapper engole o evento.
   */
  async configureExtraction(opts: {
    format?: 'csv' | 'pdf';
    data: 'filtro_atual' | 'todos';
    columns: 'filtro_atual' | 'todas';
  }): Promise<void> {
    const format = opts.format ?? 'csv';
    const dataRadio = this.page.locator(`#radio-data-${opts.data}`);
    const colsRadio = this.page.locator(`#radio-columns-${opts.columns}`);
    await this.page.locator(`#radio-exportFormat-${format}`).dispatchEvent('click');
    await dataRadio.dispatchEvent('click');
    await colsRadio.dispatchEvent('click');
    // Confirma que o state React firmou (radios refletem o `checked`).
    // Substitui um waitForTimeout pelo invariante observável.
    await expect(dataRadio).toBeChecked();
    await expect(colsRadio).toBeChecked();
  }

  /**
   * Clica em "Extrair" dentro do modal e aguarda a confirmação de que o
   * processamento começou (toast Chakra "Extração de dados em andamento").
   *
   * **Importante**: a extração é ASSÍNCRONA no Twygo — backend gera o
   * arquivo em background. NÃO há `Download` event imediato no browser.
   * Após click Extrair:
   *   1. Modal fecha
   *   2. Toast aparece: "Extração de dados em andamento. Você receberá uma
   *      notificação no topo da tela quando o arquivo estiver..."
   *   3. Notificação no sininho chega minutos depois com link pro arquivo
   *
   * Spec UI valida só os passos 1+2 (o que está em escopo Playwright).
   * Validação do arquivo gerado é out-of-scope — requer agent-db ou agent-api
   * pra consultar a tabela de exports + buscar o blob.
   *
   * Confirmado live 2026-05-24 via chrome-devtools-mcp.
   *
   * Modal deve estar aberto e radios marcados — caso contrário o Chakra
   * exibe "Dados (linhas) é obrigatório" / "Colunas é obrigatório" e o
   * click no Extrair vira no-op.
   */
  async confirmExtraction(): Promise<void> {
    const modal = this.getExtractDataModal();
    await modal.getByRole('button', { name: /^Extrair$/i }).click();
    // Modal fecha + toast aparece quase imediatamente
    await modal.waitFor({ state: 'hidden', timeout: 10_000 });
    await this.getExtractionInProgressToast().waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Toast Chakra exibido após click "Extrair" — confirma que o backend
   * aceitou o pedido e começou o processamento async.
   *
   * Texto canônico (confirmado live 2026-05-24):
   *   "Extração de dados em andamento. Você receberá uma notificação no
   *    topo da tela quando o arquivo estiver..."
   *
   * Usa `.first()` por design — Chakra acumula múltiplos toasts no manager.
   */
  getExtractionInProgressToast(): Locator {
    return this.page.locator('.chakra-toast').filter({ hasText: /Extração de dados em andamento/i }).first();
  }

  // ---------- Linhas da listagem ----------

  /**
   * Retorna todas as linhas do tbody dentro do container da listagem.
   */
  getTableRows(): Locator {
    return this.getListContainer().locator('tbody tr');
  }

  /**
   * Retorna o número de linhas visíveis na listagem.
   * Aguarda a tabela estabilizar (não conta enquanto tbody está vazio mas a
   * lista ainda está re-fetchando) — race observada pós-limpar filtro.
   */
  async getRowCount(): Promise<number> {
    const rows = this.getTableRows();
    // Mesmo motivo de goToList: .or().toBeVisible() estoura strict-mode quando o
    // estado vazio é o real, porque a `<tr>` placeholder e o `<div>` interno
    // contam como 2 matches distintos.
    await Promise.race([
      rows.first().waitFor({ state: 'visible', timeout: 20_000 }),
      this.getEmptyState().waitFor({ state: 'visible', timeout: 20_000 }),
    ]);
    const count = await rows.count();
    if (count === 1) {
      const text = await rows.first().textContent();
      if (text?.includes('Não há dados para exibir')) return 0;
    }
    return count;
  }

  /**
   * Localizador para o botão "+ Adicionar" da listagem.
   */
  getAddButton(): Locator {
    return this.page.getByRole('button', { name: /Adicionar/i });
  }

  /**
   * Locator do estado vazio ("Não há dados para exibir"). `.first()` porque o
   * produto renderiza o texto em 2 elementos (uma `<tr>` placeholder dentro do
   * tbody + uma `<div>` fora da tabela) — sem o `.first()`, qualquer `.or(empty)`
   * estoura strict-mode quando o estado vazio é o real.
   */
  getEmptyState(): Locator {
    return this.page.getByText('Não há dados para exibir').first();
  }

  // ---------- Ações por linha ----------

  /**
   * Retorna o locator da linha da tabela que contém o nome do repositório.
   */
  getRowByName(name: string): Locator {
    return this.getTableRows().filter({ hasText: name });
  }

  /**
   * Clica no botão "Editar" da linha correspondente ao repositório.
   * Aguarda redirect para a tela de edição.
   *
   * Audit chrome-devtools-mcp 2026-05-21: a coluna Ações usa ícones
   * Material `edit` (texto literal "edit") com cursor=pointer — não `<a>`
   * com texto "Editar". Locator usa o texto do ícone filtrado pela linha.
   */
  async clickEditByName(name: string): Promise<void> {
    const row = this.getRowByName(name);
    await row.getByText('edit', { exact: true }).first().click();
    await this.page.waitForURL(/knowledge_repositories\/\d+\/edit/, { timeout: 15_000 });
  }

  /**
   * Deleta o repositório com o nome informado navegando para a tela de edição
   * e acionando a exclusão (REVISAR-FIGMA: botão "Excluir" ou "Deletar" no form de edição).
   *
   * Uso obrigatório em afterAll para cleanup — variante tolerante a falhas.
   */
  async deleteRepositoryByName(name: string): Promise<void> {
    await this.goToList();
    // Localiza a linha; busca pelo campo de texto para maior robustez
    await this.searchByName(name);
    const row = this.getRowByName(name);
    await row.getByText('edit', { exact: true }).first().click();
    await this.page.waitForURL(/knowledge_repositories\/\d+\/edit/, { timeout: 15_000 });
    // REVISAR-FIGMA: confirmar seletor do botão de exclusão na tela de edição
    await this.page.getByRole('button', { name: /Excluir|Deletar/i }).click();
    // Aguarda confirmação do modal de exclusão (padrão Chakra confirm dialog)
    const confirmBtn = this.page
      .getByRole('dialog')
      .getByRole('button', { name: /Confirmar|Sim|Excluir/i })
      .first();
    const confirmVisible = await confirmBtn.isVisible({ timeout: 3_000 }).catch(() => false);
    if (confirmVisible) {
      await confirmBtn.click();
    }
    await this.page.waitForURL(/knowledge_repositories(?!.*\/edit)/, { timeout: 15_000 });
  }

  /**
   * Cleanup via API REST direta — DELETE /api/v1/o/:org_id/knowledge_repositories/:id.
   * Bypassa fluxo UI (que tem race-conditions com Chakra modal de confirmação) e
   * usa o endpoint canônico documentado no MD §Endpoints.
   *
   * Tolerante a falhas — usado em afterAll/afterEach; nunca propaga erro.
   *
   * Confirmado live 2026-05-19: DELETE via API retorna 200 para repositórios
   * existentes; click no botão UI tem flakiness por timing do modal.
   */
  async deleteRepositoryByNameSafe(name: string): Promise<void> {
    try {
      await this.goToList();
      // Tenta filtrar pra reduzir a tabela, mas captura via data-item-name de qualquer forma
      await this.searchByName(name).catch(() => null);
      const id = await this.page.evaluate((n) => {
        const row = document.querySelector(`[data-item-name="${n.replace(/"/g, '\\"')}"]`);
        return row?.getAttribute('data-item-id') ?? null;
      }, name);
      if (!id) {
         
        console.warn(`[deleteRepositoryByNameSafe] "${name}" não encontrado — cleanup no-op`);
        return;
      }
      const status = await this.page.evaluate(
        async ({ orgId, id }) => {
          const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
          const res = await fetch(`/api/v1/o/${orgId}/knowledge_repositories/${id}`, {
            method: 'DELETE',
            headers: { 'X-CSRF-Token': csrf, Accept: 'application/json' },
            credentials: 'include',
          });
          return res.status;
        },
        { orgId: this.orgId, id },
      );
      if (status >= 400) {
         
        console.warn(`[deleteRepositoryByNameSafe] DELETE "${name}" id=${id} → status ${status}`);
      }
    } catch (err) {
       
      console.warn(
        `[deleteRepositoryByNameSafe] falha ao deletar "${name}": ${(err as Error).message}`,
      );
    }
  }
}
