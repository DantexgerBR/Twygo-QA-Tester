import { expect, type Locator, type Page } from '@playwright/test';
import { getOrgId } from '../../../src/utils/environment.js';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object do formulário de criação/edição de Painel (módulo Widgets).
 *
 * URLs canônicas:
 * - Criação: `/o/{orgId}/panels/new`
 * - Edição: `/o/{orgId}/panels/{id}/edit` (com `?tab=layouts` para abrir Layouts).
 *
 * Estrutura observada ao vivo (2026-05-11 via planner, env `staging-widgets`):
 *
 * - Tela tem 2 tabs: **Identificação** (ativa por default) e **Layouts**.
 *   Layouts inicia desabilitada — só habilita após salvar a Identificação.
 * - Campo Nome*: `<input id="panel-form-name-input" maxLength="250">`. XML
 *   documenta 255 mas DOM limita em 250 (REVISAR).
 * - Campo Descrição: rich-text ProseMirror dentro do tabpanel "Identificação"
 *   (não é input simples). Contador mostra "X / 500".
 * - Botão Salvar (Identificação): `data-test-id="panel-form-save-button"`.
 * - Botão Cancelar (Identificação): `data-test-id="panel-form-cancel-button"`.
 * - Tab Layouts → renderiza navegação de abas + botão "Adicionar aba"
 *   (`data-test-id="tabs-navigation-add-button"`). Aba inicial "Nova aba" é
 *   criada automaticamente.
 * - Cada aba tem botões `Renomear` (lápis) e `Excluir` (lixeira) sem
 *   data-test-id — uso `getByRole('button', { name: 'Renomear'|'Excluir' })`
 *   escopado no grupo da aba. Excluir fica `[disabled]` quando há 1 aba só.
 * - Modal de Renomear aba: dialog Chakra com input "Nome da aba*" (maxLength=255).
 * - Modal de Adicionar nova aba: 2 steps.
 *   - Step 1 (seleção de tipo): botões `add-tab-type-modal-create-new-button`,
 *     `add-tab-type-modal-import-button`, `add-tab-type-modal-cancel-button`.
 *   - Step 2 (criar nova): inputs Nome e Categoria; botões
 *     `create-tab-modal-back-button`, `create-tab-modal-cancel-button`,
 *     `create-tab-modal-create-button` (este último disabled até preencher Nome).
 */
export class PainelFormPage {
  constructor(private readonly page: Page) {}

  // ---------- Navegação ----------

  async goToNew(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/panels/new`);
    await this.getIdentificacaoTab().waitFor();
  }

  async goToEdit(panelId: number, tab: 'identificacao' | 'layouts' = 'identificacao'): Promise<void> {
    const suffix = tab === 'layouts' ? '?tab=layouts' : '';
    await safeGoto(this.page, `/o/${getOrgId()}/panels/${panelId}/edit${suffix}`);
    // App ignora `?tab=layouts` no load inicial — tab Identificação sempre
    // renderiza selected. Sem click explícito, `tabs-navigation-add-button`
    // e `widgets-grid-*` não montam. Validado live 2026-05-13 via Playwright MCP.
    if (tab === 'layouts') {
      const layoutsTab = this.getLayoutsTab();
      await layoutsTab.waitFor();
      const selected = await layoutsTab.getAttribute('aria-selected');
      if (selected !== 'true') {
        await layoutsTab.click();
      }
    }
  }

  // ---------- Aba Identificação ----------

  getIdentificacaoTab(): Locator {
    return this.page.getByRole('tab', { name: 'Identificação' });
  }

  getLayoutsTab(): Locator {
    return this.page.getByRole('tab', { name: 'Layouts' });
  }

  getNomeInput(): Locator {
    return this.page.locator('#panel-form-name-input');
  }

  /**
   * Campo Descrição é um ProseMirror rich-text. O contentEditable é o
   * `[contenteditable="true"]` dentro do tabpanel "Identificação".
   * REVISAR: aguardando data-test-id estável.
   */
  getDescricaoEditor(): Locator {
    return this.page
      .getByRole('tabpanel', { name: 'Identificação' })
      .locator('[contenteditable="true"]')
      .first();
  }

  getSaveButton(): Locator {
    return this.page.getByTestId('panel-form-save-button');
  }

  getCancelButton(): Locator {
    return this.page.getByTestId('panel-form-cancel-button');
  }

  /**
   * Preenche Nome + Descrição e salva, aguardando redirect para a tela de
   * edição do painel recém-criado (URL `/panels/{id}/edit`). Retorna o `id`
   * extraído da URL para uso em cleanup/assertions.
   */
  async createPanel(nome: string, descricao?: string): Promise<number> {
    await this.getNomeInput().fill(nome);
    if (descricao) {
      await this.getDescricaoEditor().fill(descricao);
    }
    await this.getSaveButton().click();
    // Save backend pode esticar >30s sob load paralelo; bump pra 60s evita
    // flakiness intermitente em rodadas full-suite (ver bug 32872141).
    await this.page.waitForURL(/\/panels\/\d+\/edit/, { timeout: 60_000 });
    const match = this.page.url().match(/\/panels\/(\d+)\/edit/);
    if (!match) throw new Error(`Não conseguiu extrair panelId da URL: ${this.page.url()}`);
    return Number(match[1]);
  }

  // ---------- Aba Layouts: navegação de abas ----------

  getAddTabButton(): Locator {
    return this.page.getByTestId('tabs-navigation-add-button');
  }

  /**
   * Localiza o "chip" de uma aba pelo seu nome dentro do tabpanel Layouts.
   * O nome é renderizado como `<p>` (paragraph role) na barra de abas. O
   * `.locator('..')` sobe pra raiz do chip pra escopo de Renomear/Excluir.
   */
  getTabChip(tabName: string): Locator {
    return this.page
      .getByRole('tabpanel', { name: 'Layouts' })
      .locator('xpath=.//p[normalize-space()=' + JSON.stringify(tabName) + ']/ancestor::*[self::div or self::li][1]');
  }

  getRenameTabButton(tabName: string): Locator {
    return this.getTabChip(tabName).getByRole('button', { name: 'Renomear' });
  }

  getDeleteTabButton(tabName: string): Locator {
    return this.getTabChip(tabName).getByRole('button', { name: 'Excluir' });
  }

  // ---------- Modal Renomear aba ----------

  getRenameModal(): Locator {
    return this.page.getByRole('dialog').filter({ hasText: 'Renomear aba' });
  }

  getRenameModalInput(): Locator {
    return this.getRenameModal().locator('input').first();
  }

  getRenameModalSubmit(): Locator {
    return this.getRenameModal().getByRole('button', { name: 'Renomear' });
  }

  getRenameModalCancel(): Locator {
    return this.getRenameModal().getByRole('button', { name: 'Cancelar' });
  }

  async openRenameModal(tabName: string): Promise<void> {
    await this.getRenameTabButton(tabName).click();
    await this.getRenameModal().waitFor();
  }

  // ---------- Modal Adicionar nova aba (2 steps) ----------

  getAddTabModal(): Locator {
    return this.page.getByRole('dialog').filter({ hasText: 'Adicionar nova aba' });
  }

  getCreateNewTabOption(): Locator {
    return this.page.getByTestId('add-tab-type-modal-create-new-button');
  }

  getImportTabOption(): Locator {
    return this.page.getByTestId('add-tab-type-modal-import-button');
  }

  getAddTabTypeCancel(): Locator {
    return this.page.getByTestId('add-tab-type-modal-cancel-button');
  }

  // Step 2 — Criar nova aba (form)
  /**
   * Input "Nome da aba" do step 2. Sem data-test-id/aria-label; o elemento
   * é renderizado como `textbox "Digite o nome da aba"` — placeholder é o
   * accessible name. Confirmado no DOM live (2026-05-11).
   */
  getCreateTabNameInput(): Locator {
    return this.getAddTabModal().getByPlaceholder('Digite o nome da aba');
  }

  getCreateTabCategorySelect(): Locator {
    return this.getAddTabModal().getByRole('combobox');
  }

  getCreateTabBackButton(): Locator {
    return this.page.getByTestId('create-tab-modal-back-button');
  }

  getCreateTabCancelButton(): Locator {
    return this.page.getByTestId('create-tab-modal-cancel-button');
  }

  getCreateTabSubmitButton(): Locator {
    return this.page.getByTestId('create-tab-modal-create-button');
  }

  /**
   * Fluxo completo "Adicionar aba → Criar nova aba → preencher → submeter".
   * Após retornar, a aba `tabName` está visível na navegação.
   */
  async addTab(tabName: string): Promise<void> {
    await this.getAddTabButton().click();
    await this.getCreateNewTabOption().click();
    await this.getCreateTabNameInput().fill(tabName);
    await this.getCreateTabSubmitButton().click();
    await this.getAddTabModal().waitFor({ state: 'hidden' });
    await expect(this.page.getByText(tabName, { exact: true })).toBeVisible();
  }

  // ---------- Step 2 — Importar aba de outro painel ----------

  /**
   * Input "Nome da nova aba" do modal Importar. O `data-test-id` está
   * NO PRÓPRIO <input>, não em wrapper — `<input>` é void element, não tem
   * descendentes. Por isso encadear `.getByPlaceholder()` (como o spec antigo
   * fazia) falha com "element(s) not found". Confirmado via DOM live (2026-05-14).
   */
  getImportTabNameInput(): Locator {
    return this.page.getByTestId('import-tab-modal-tab-name-input');
  }

  /**
   * Dropdown Categoria do modal Importar. Renderizado como `<select>` HTML
   * nativo, sem `data-test-id`. Usar `getByRole('combobox')` escopado ao modal
   * cai em strict-mode (matcha 2 react-select inputs do step "panel/tab"
   * + 1 select HTML). `locator('select')` resolve unicamente.
   */
  getImportCategorySelect(): Locator {
    return this.getAddTabModal().locator('select');
  }

  /**
   * Bloco preview da aba selecionada no modal Importar. Identificado pelo
   * `<p>Preview da aba</p>` (sem testId estável). Útil pra escopar asserts
   * "Aba X" que existem em 2 lugares no modal — label do tab-select + preview.
   */
  getImportPreviewBlock(): Locator {
    return this.getAddTabModal()
      .locator('div')
      .filter({ has: this.page.getByText('Preview da aba') })
      .last();
  }

  // ---------- Salvar Layout ----------

  getSaveLayoutButton(): Locator {
    return this.page.locator('[data-test-id="panel-layout-save-button"]');
  }

  getCancelLayoutButton(): Locator {
    return this.page.locator('[data-test-id="panel-layout-cancel-button"]');
  }

  // ---------- Widgets (drawer + grid) ----------

  /**
   * Botão "Adicionar widget" no header da aba Layouts. Quando o grid está
   * vazio o app também renderiza um botão equivalente em `widgets-grid-
   * empty-state-add-button` — preferimos sempre o do header pra simplicidade.
   */
  getAddWidgetButton(): Locator {
    return this.page.locator('[data-test-id="widgets-grid-add-button"]');
  }

  getEmptyStateAddWidgetButton(): Locator {
    return this.page.locator('[data-test-id="widgets-grid-empty-state-add-button"]');
  }

  getWidgetDrawer(): Locator {
    return this.page.locator('[data-test-id="widget-selector-drawer"]');
  }

  getWidgetDrawerCloseButton(): Locator {
    return this.page.locator('[data-test-id="widget-selector-drawer-close"]');
  }

  getWidgetDrawerSearch(): Locator {
    return this.page.locator('[data-test-id="widget-selector-search"]');
  }

  getWidgetDrawerFilterToggle(): Locator {
    return this.page.locator('[data-test-id="widget-selector-filter-toggle"]');
  }

  /**
   * Input combobox do multi-select "Categorias" no painel Filtros do drawer.
   * É um react-select — o id `widget-filter-categories` é estável e o role
   * `combobox` está no próprio input. O `<div placeholder>` ao redor
   * intercepta pointer events; clicar no input direto abre o dropdown.
   * Confirmado live 2026-05-12.
   */
  getCategoriesMultiselectInput(): Locator {
    return this.page.locator('#widget-filter-categories');
  }

  /**
   * Abre o dropdown do multi-select Categorias e seleciona uma opção pelo
   * nome exato (ex: 'Aprendizagem', 'Todos'). O click no input abre as
   * opções como elementos com role=option.
   */
  async selectCategoryFilter(name: 'Aprendizagem' | 'Todos'): Promise<void> {
    await this.getCategoriesMultiselectInput().click();
    await this.page.getByRole('option', { name, exact: true }).click();
  }

  /**
   * Group da categoria. `category` aceita o slug usado no DOM (ex: 'learning').
   * O XML chama de "Aprendizagem" → mapping ocorre na asserção do spec.
   */
  getWidgetCategoryGroup(category: 'learning'): Locator {
    return this.page.locator(`[data-test-id="widget-category-group-${category}"]`);
  }

  /** IDs canônicos dos widgets de Aprendizagem (validados ao vivo 2026-05-11). */
  static readonly WIDGET_IDS = {
    activity_summary: { title: 'Resumo de atividades', category: 'Aprendizagem' },
    in_progress_contents: { title: 'Conteúdos em andamento', category: 'Aprendizagem' },
    ranking: { title: 'Ranking', category: 'Aprendizagem' },
    my_certificates: { title: 'Meus certificados', category: 'Aprendizagem' },
  } as const;

  getWidgetCard(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
    return this.page.locator(`[data-test-id="widget-catalog-card-${id}"]`);
  }

  getWidgetCardProfile(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
    return this.page.locator(`[data-test-id="widget-catalog-profile-${id}"]`);
  }

  getWidgetCardCategoryLabel(id: keyof typeof PainelFormPage.WIDGET_IDS): Locator {
    return this.page.locator(`[data-test-id="widget-catalog-category-${id}-learning"]`);
  }

  /**
   * Abre o drawer de seleção de widgets a partir do header ou do empty
   * state, conforme o estado atual do grid.
   */
  async openWidgetDrawer(): Promise<void> {
    const headerBtn = this.getAddWidgetButton();
    if (await headerBtn.isVisible().catch(() => false)) {
      await headerBtn.click();
    } else {
      await this.getEmptyStateAddWidgetButton().click();
    }
    await this.getWidgetDrawer().waitFor();
  }

  /**
   * Click em um card adiciona o widget e fecha o drawer automaticamente
   * (comportamento confirmado live 2026-05-11). Não há botão "Adicionar"
   * separado nos cards.
   */
  async addWidget(id: keyof typeof PainelFormPage.WIDGET_IDS): Promise<void> {
    await this.getWidgetCard(id).click();
    await this.getWidgetDrawer().waitFor({ state: 'hidden' });
  }

  /** Items adicionados ao grid (UUIDs dinâmicos). */
  getGridItems(): Locator {
    return this.page.locator('[data-test-id^="widgets-grid-item-"]');
  }

  getWidgetGridTitle(title: string): Locator {
    return this.page
      .locator('[data-test-id^="widgets-grid-widget-"][data-test-id$="-title"]')
      .filter({ hasText: title });
  }

  // ---------- Widget actions no grid (lápis/x) ----------

  /**
   * Localiza o item do grid (wrapper `widgets-grid-item-{uuid}`) que contém
   * o widget com o título dado — usado pra escopar os botões edit/remove.
   * Sobe do `*-title` até o ancestral `widgets-grid-item-*`.
   */
  private getWidgetGridItemByTitle(title: string): Locator {
    return this.page
      .locator('[data-test-id^="widgets-grid-item-"]')
      .filter({ has: this.getWidgetGridTitle(title) });
  }

  getWidgetEditButton(title: string): Locator {
    return this.getWidgetGridItemByTitle(title).locator('[data-test-id$="-edit-button"]');
  }

  getWidgetRemoveButton(title: string): Locator {
    return this.getWidgetGridItemByTitle(title).locator('[data-test-id$="-remove-button"]');
  }

  // ---------- Drawer "Configurações do widget" ----------

  getWidgetSettingsDrawer(): Locator {
    return this.page.getByRole('dialog').filter({ hasText: 'Configurações do widget' });
  }

  getWidgetSettingsNameSwitch(): Locator {
    return this.page.locator('[data-test-id="widget-settings-name-enabled-switch"]');
  }

  getWidgetSettingsNameInput(): Locator {
    return this.page.locator('[data-test-id="widget-settings-name-input"]');
  }

  getWidgetSettingsIconSwitch(): Locator {
    return this.page.locator('[data-test-id="widget-settings-icon-enabled-switch"]');
  }

  getWidgetSettingsIconGrid(): Locator {
    return this.page.locator('[data-test-id="widget-settings-icon-grid"]');
  }

  getWidgetSettingsIconOption(iconName: string): Locator {
    return this.page.locator(`[data-test-id="widget-settings-icon-option-${iconName}"]`);
  }

  getWidgetSettingsCancelButton(): Locator {
    return this.page.locator('[data-test-id="widget-settings-cancel-button"]');
  }

  getWidgetSettingsSaveButton(): Locator {
    return this.page.locator('[data-test-id="widget-settings-save-button"]');
  }

  /**
   * Switch Chakra: o `<label>` intercepta o pointer event do `<input>` interno.
   * Click direto em role=checkbox dá timeout — usar `.click({ force: true })`
   * no próprio label. Mantém o estado idempotente: só clica se o estado
   * atual não bate com o desejado (`data-checked` no label quando ON).
   */
  async setSwitch(locator: Locator, on: boolean): Promise<void> {
    const isOn = (await locator.getAttribute('data-checked')) !== null;
    if (isOn !== on) {
      await locator.scrollIntoViewIfNeeded();
      await locator.click({ force: true });
    }
  }

  async openWidgetSettings(title: string): Promise<void> {
    await this.getWidgetEditButton(title).click();
    await this.getWidgetSettingsDrawer().waitFor();
  }

  /**
   * Customiza um widget já presente no grid (título + ícone).
   * `currentTitle` é o título atual do widget (default ou anterior).
   * `opts.newTitle` substitui o título exibido para o aluno.
   * `opts.iconName` é o nome do ícone material (ex: 'star', 'pie_chart').
   * Se `opts.showTitle` ou `opts.showIcon` for false, desliga o switch correspondente.
   */
  async customizeWidget(
    currentTitle: string,
    opts: { newTitle?: string; iconName?: string; showTitle?: boolean; showIcon?: boolean },
  ): Promise<void> {
    await this.openWidgetSettings(currentTitle);
    if (opts.showTitle !== undefined) {
      await this.setSwitch(this.getWidgetSettingsNameSwitch(), opts.showTitle);
    }
    if (opts.newTitle !== undefined) {
      await this.setSwitch(this.getWidgetSettingsNameSwitch(), true);
      await this.getWidgetSettingsNameInput().fill(opts.newTitle);
    }
    if (opts.showIcon !== undefined) {
      await this.setSwitch(this.getWidgetSettingsIconSwitch(), opts.showIcon);
    }
    if (opts.iconName !== undefined) {
      await this.setSwitch(this.getWidgetSettingsIconSwitch(), true);
      await this.getWidgetSettingsIconOption(opts.iconName).click();
    }
    await this.getWidgetSettingsSaveButton().click();
    await this.getWidgetSettingsDrawer().waitFor({ state: 'hidden' });
  }

  /**
   * Salva o layout do painel (botão "Salvar Layout"). Espera toast de
   * sucesso (best-effort) e qualquer toast pendente sumir.
   */
  async saveLayout(): Promise<void> {
    await this.waitForToastsToClear();
    await this.getSaveLayoutButton().click();
    await this.getToast('Layout salvo')
      .waitFor({ state: 'visible', timeout: 10_000 })
      .catch(() => undefined);
    await this.waitForToastsToClear();
  }

  /**
   * Toast Chakra de sucesso. Sem data-test-id; matching por texto.
   * Usa `.first()` porque toasts adicionais ("Widget adicionado", "Layout salvo")
   * podem coexistir e o filtro por texto sozinho viola strict-mode.
   */
  getToast(text: string): Locator {
    return this.page.locator('.chakra-toast').filter({ hasText: text }).first();
  }

  /**
   * Aguarda toasts ativos sumirem antes de prosseguir. Necessário antes de
   * interagir com elementos que ficam sob o toast manager (Salvar Layout etc).
   * Se nenhum toast estiver presente, retorna imediatamente.
   */
  async waitForToastsToClear(timeout = 5000): Promise<void> {
    const toast = this.page.locator('.chakra-toast').first();
    if (await toast.isVisible().catch(() => false)) {
      await toast.waitFor({ state: 'hidden', timeout }).catch(() => {
        // Toast pode persistir por mais tempo — não falhar aqui, deixar
        // o caller decidir com force:true.
      });
    }
  }
}
