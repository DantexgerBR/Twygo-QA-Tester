import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Tab "Provedores" da tela "Aprendizagem > Registros" (entidade `event_sources`)
 * — suíte "CRUD de Provedores e bloqueio de exclusão com vínculo".
 *
 * Seletores confirmados em probe ao vivo 2026-06-25:
 *  - tab: `tab-event-sources-tab` · lista: rota `?tab=event-sources-tab`
 *  - linha: testid de delete `event-source-{id}-delete`, toggle Ativo
 *    `event-sources-list-status-toggle-{id}` (ambos derivam do MESMO id)
 *  - form Adicionar/Editar: rota `/o/{org}/event_sources/new` (ou `/:id/edit`),
 *    botões `event-source-form-save-button` / `event-source-form-cancel-button`,
 *    campos por label "Nome" (obrigatório), "Website", "Descrição".
 */
export class ProvedoresPage {
  constructor(private readonly page: Page) {}

  private tabUrl(): string {
    return `/o/${getOrgId()}/records?tab=event-sources-tab`;
  }

  // ---- Navegação ----

  tab(): Locator {
    return this.page.getByTestId('tab-event-sources-tab');
  }

  tabRegistros(): Locator {
    return this.page.getByTestId('tab-records-tab');
  }

  /** Abre a tela de Registros já na tab Provedores, com retry tolerante a 503. */
  async gotoTab(): Promise<void> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await safeGoto(this.page, this.tabUrl());
      const ok = await this.tab().isVisible({ timeout: 12_000 }).catch(() => false);
      if (ok) break;
      if (attempt < 3) await this.page.waitForTimeout(2_000);
    }
    await this.expectLoaded();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.tab()).toBeVisible({ timeout: 20_000 });
    // Gate de hidratação: a lista (tabela no desktop, cards no mobile) só renderiza
    // após o fetch de event_sources. A 1ª ação de linha/card aparece nos dois
    // layouts — esperar por ela evita ler headers vazios (timing). O botão
    // "Adicionar" some no mobile, por isso NÃO serve de gate universal.
    await expect(this.page.locator('[data-test-id$="-delete"]').first()).toBeVisible({ timeout: 30_000 });
  }

  async isTabActive(): Promise<boolean> {
    const sel = await this.tab().getAttribute('aria-selected');
    if (sel !== null) return sel === 'true';
    // fallback: Chakra marca o tab ativo com data-selected ou aria-selected
    return (await this.tab().getAttribute('data-selected')) !== null;
  }

  // ---- Tabela / toolbar ----

  table(): Locator {
    // `:visible` evita pegar a <table> OCULTA do modal "Compartilhar por e-mail"
    // que vive no DOM antes da tabela real (skill seletores-visiveis-twygo).
    return this.page.locator('table:visible').first();
  }

  async columnHeaderTexts(): Promise<string[]> {
    return (await this.table().locator('thead th').allInnerTexts()).map((t) => t.trim());
  }

  rows(): Locator {
    return this.table().locator('tbody tr');
  }

  /**
   * Linha cujo Nome (2ª coluna) é EXATAMENTE `name`. Match por célula evita
   * falsos positivos por substring noutra coluna — ex.: buscar "Alura" casaria
   * a linha cujo Website é "alura.com.br". `getByRole('cell',{exact})` ancora no
   * conteúdo da célula Nome.
   */
  rowByName(name: string): Locator {
    return this.rows()
      .filter({ has: this.page.getByRole('cell', { name, exact: true }) })
      .first();
  }

  async rowCount(): Promise<number> {
    return this.rows().count();
  }

  /**
   * Busca em tempo real — traz um provedor específico para a lista renderizada
   * (a lista pagina 25/pág ordenada por created_at desc; provedores antigos como
   * "Alura" não estão na 1ª página sem busca).
   */
  async searchFor(term: string): Promise<void> {
    const input = this.searchInput();
    await input.fill(term);
    await input.press('Enter').catch(() => undefined);
    await expect(this.page.locator('[data-test-id$="-delete"]').first())
      .toBeVisible({ timeout: 10_000 })
      .catch(() => undefined);
    await this.page.waitForTimeout(800); // debounce do filtro
  }

  addButton(): Locator {
    return this.page.getByRole('button', { name: /^Adicionar$/ }).first();
  }

  searchInput(): Locator {
    return this.page.getByPlaceholder(/Pesquise aqui/i).first();
  }

  filterButton(): Locator {
    return this.page.getByTestId('filter-control-open-button');
  }

  /** Toggle tabela/grid NÃO existe nesta tab (RN 83) — usado para assertir ausência. */
  gridToggle(): Locator {
    return this.page.getByRole('button', { name: /grid|visualiza/i });
  }

  /** Link externo de Website dentro de uma linha (host limpo, sem https://www.). */
  websiteLinkInRow(row: Locator): Locator {
    return row.locator('a[href^="http"]').first();
  }

  /** Clica o header de uma coluna para ordenar. */
  async sortByColumn(name: string): Promise<void> {
    await this.table().locator('thead th').filter({ hasText: name }).first().click();
    await this.page.waitForTimeout(400); // re-render da ordenação client-side
  }

  /** Nome exibido em cada linha de dados, na ordem da tabela. */
  async rowNamesInOrder(): Promise<string[]> {
    return this.rows().evaluateAll((trs) =>
      trs
        .map((tr) => tr.querySelector('td:nth-child(2)')?.textContent?.trim() ?? '')
        .filter(Boolean),
    );
  }

  // ---- Id da linha (delete e toggle derivam do mesmo id) ----

  /** Extrai o id do provedor a partir do testid de delete da linha. */
  async providerIdFromRow(row: Locator): Promise<string> {
    const el = row.locator('[data-test-id$="-delete"]').first();
    const tid = await el.getAttribute('data-test-id');
    const m = tid?.match(/event-source-(\d+)-delete/);
    if (!m) throw new Error(`não consegui extrair id da linha (testid=${tid})`);
    return m[1];
  }

  // ---- Toggle Ativo (switch Chakra na linha — ver skill interagir-switch-chakra) ----

  async rowToggle(name: string): Promise<Locator> {
    const id = await this.providerIdFromRow(this.rowByName(name));
    return this.page.getByTestId(`event-sources-list-status-toggle-${id}`);
  }

  async isRowActive(name: string): Promise<boolean> {
    return (await (await this.rowToggle(name)).getAttribute('data-checked')) !== null;
  }

  /**
   * Flip do switch da linha (força click no label; input interno é oculto).
   * Desativar dispara modal "Confirmação de inativação" ("Ao inativar, não será
   * possível vincular este provedor a novos registros") — confirmamos se aparece.
   * Ativar não pede confirmação (modal simplesmente não surge).
   */
  async clickRowToggle(name: string): Promise<void> {
    const sw = await this.rowToggle(name);
    await sw.scrollIntoViewIfNeeded();
    await sw.click({ force: true });
    const confirm = this.page
      .locator('[role="dialog"], [role="alertdialog"], .chakra-modal__content')
      .filter({ hasText: /Confirmação de inativação|Tem certeza/i })
      .first();
    if (await confirm.isVisible({ timeout: 2_500 }).catch(() => false)) {
      await confirm.getByRole('button', { name: /Confirmar/i }).click();
    }
  }

  /** Idempotente — usado em setup/cleanup para garantir estado sem disparar toast à toa. */
  async setRowActive(name: string, on: boolean): Promise<void> {
    if ((await this.isRowActive(name)) !== on) await this.clickRowToggle(name);
  }

  // ---- Form Adicionar / Editar ----

  saveFormButton(): Locator {
    return this.page.getByTestId('event-source-form-save-button');
  }

  cancelFormButton(): Locator {
    return this.page.getByTestId('event-source-form-cancel-button');
  }

  nameInput(): Locator {
    return this.page.getByLabel(/^Nome/).first();
  }

  websiteInput(): Locator {
    return this.page.getByLabel(/^Website/).first();
  }

  descriptionInput(): Locator {
    return this.page.getByLabel(/^Descrição/).first();
  }

  // Obs.: o form de criar provedor NÃO tem switch "Ativo" (confirmado em probe
  // 2026-06-25) — só Nome/Website/Descrição. "Ativo" é toggle de LINHA na lista.

  /**
   * Clica "Adicionar" e espera o form carregar. O click ocasionalmente não
   * navega (re-render da lista durante o click) — retry idempotente: se não
   * chegou em /new, recarrega a tab e tenta de novo.
   */
  async openAddForm(): Promise<void> {
    for (let attempt = 1; attempt <= 3; attempt++) {
      await this.addButton().click().catch(() => undefined);
      const onForm = await this.page
        .waitForURL(/\/event_sources\/new/, { timeout: 8_000 })
        .then(() => true)
        .catch(() => false);
      if (onForm && (await this.saveFormButton().isVisible({ timeout: 8_000 }).catch(() => false))) return;
      if (attempt < 3) await this.gotoTab();
    }
    // última tentativa: deixa o erro estourar com contexto
    await this.page.waitForURL(/\/event_sources\/new/, { timeout: 8_000 });
    await expect(this.saveFormButton()).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Abre a tela de edição (ícone de lápis da linha) e espera carregar
   * pré-populado. O ícone de editar NÃO tem data-test-id (só o delete tem) —
   * é um div `id="event_sources-{id}-edit-element-..."` com `data-icon="edit_square"`.
   */
  async openEditByName(name: string): Promise<void> {
    const row = this.rowByName(name);
    const edit = row.locator('[id*="-edit-element"], [data-icon="edit_square"]').first();
    await edit.scrollIntoViewIfNeeded();
    await edit.click();
    await this.page.waitForURL(/\/event_sources\/\d+\/edit/, { timeout: 15_000 });
    await expect(this.saveFormButton()).toBeVisible({ timeout: 15_000 });
  }

  async fillProviderForm(data: { name?: string; website?: string; description?: string }): Promise<void> {
    if (data.name !== undefined) {
      await this.nameInput().fill(data.name);
    }
    if (data.website !== undefined) {
      await this.websiteInput().fill(data.website);
    }
    if (data.description !== undefined) {
      await this.descriptionInput().fill(data.description);
    }
  }

  async saveForm(): Promise<void> {
    await this.saveFormButton().click();
  }

  /**
   * Tenta salvar tolerando botão desabilitado (validação bloqueia o submit, ex.:
   * Nome vazio). Force-click com timeout curto; se disabled, o submit não dispara
   * e o teste valida que permaneceu no form.
   */
  async trySave(): Promise<void> {
    await this.saveFormButton().click({ force: true, timeout: 5_000 }).catch(() => undefined);
  }

  /** Salva e espera voltar para a listagem (criação/edição bem-sucedida). */
  async saveFormAndReturn(): Promise<void> {
    await this.saveForm();
    await this.page.waitForURL(/tab=event-sources-tab/, { timeout: 15_000 });
  }

  /** Erro inline de validação do campo Nome ("Campo obrigatório"). */
  nameFieldError(): Locator {
    return this.page.getByText(/Campo obrigatório/i).first();
  }

  // ---- Excluir ----

  /**
   * Clica o ícone de excluir (div com testid `event-source-{id}-delete`).
   * Esconde tooltips + chat widget antes (o div tem tooltip que intercepta o
   * pointer — mesmo padrão do AdminRegistrosPage.deleteRow).
   */
  async clickDeleteInRow(name: string): Promise<void> {
    await this.page
      .addStyleTag({
        content:
          '[role="tooltip"], .chakra-tooltip, #hubspot-messages-iframe-container { display:none !important; pointer-events:none !important; }',
      })
      .catch(() => undefined);
    const row = this.rowByName(name);
    await row.locator('[data-test-id$="-delete"]').first().click();
  }

  /**
   * Modal de confirmação destrutiva. Texto real (probe 2026-06-25):
   * "Confirmação de exclusão · Provedor: {nome} · Essa ação não poderá ser
   * desfeita. Tem certeza que deseja excluir? · [Cancelar] [Excluir]".
   * O bloqueio por vínculo NÃO aparece aqui — só APÓS clicar Excluir (422 do
   * servidor → mensagem `blockMessage`).
   */
  deleteConfirmModal(): Locator {
    return this.page
      .locator('[role="alertdialog"], [role="dialog"], .chakra-modal__content')
      .filter({ hasText: /Tem certeza|Confirmação de exclusão|desfeit/i })
      .first();
  }

  /**
   * Mensagem de bloqueio por vínculo, exibida APÓS confirmar Excluir quando o
   * provedor tem registros (server responde 422 `blocked_by_records`). Pode vir
   * como toast OU dialog — casa em qualquer um pelo texto.
   */
  blockMessage(): Locator {
    return this.page.getByText(/não pode ser excluído|registros vinculados/i).first();
  }

  // ---- Provedor no dropdown do form de registro (TC7) ----

  /**
   * Abre `/records/new`, abre o combo "Provedor" e procura uma opção pelo nome.
   * Devolve true se a opção aparece no dropdown. (RN 85: provedor inativo some.)
   */
  async recordFormProviderHasOption(name: string): Promise<boolean> {
    await safeGoto(this.page, `/o/${getOrgId()}/records/new`);
    await expect(this.page.getByTestId('record-form-save-button')).toBeVisible({ timeout: 15_000 });
    const group = this.page
      .locator('.chakra-form-control')
      .filter({ has: this.page.locator('label').filter({ hasText: /^Provedor/ }) })
      .first();
    await group.locator('.creatable-select-field__control').first().click();
    await this.page.keyboard.type(name, { delay: 20 });
    await this.page.waitForTimeout(800);
    const option = this.page
      .locator('.creatable-select-field__option, [role="option"]')
      .filter({ hasText: new RegExp(`^${name}$`, 'i') });
    const visible = (await option.count()) > 0 && (await option.first().isVisible().catch(() => false));
    await this.page.keyboard.press('Escape');
    return visible;
  }

  // ---- Toasts (ver skill testar-toast-chakra-twygo) ----

  getToast(text: RegExp | string): Locator {
    return this.page.locator('.chakra-toast').filter({ hasText: text }).first();
  }

  async waitForToastText(re: RegExp): Promise<string> {
    const toast = this.getToast(re);
    await expect(toast).toBeVisible({ timeout: 15_000 });
    return (await toast.innerText()).replace(/\s+/g, ' ').trim();
  }

  async waitForToastsToClear(timeout = 6_000): Promise<void> {
    const toast = this.page.locator('.chakra-toast').first();
    if (await toast.isVisible().catch(() => false)) {
      await toast.waitFor({ state: 'hidden', timeout }).catch(() => undefined);
    }
  }
}
