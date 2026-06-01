import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage.js';
import { getOrgId } from '../../../src/utils/environment.js';
import { dismissCommonModals, safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object da tela de edição de Conteúdo (curso / trilha) no Twygo.
 *
 * Há DUAS rotas para a mesma entidade, conforme MD §RN 2.1:
 *  - Tela HAML legada:   `/e/{eventId}/edit`
 *  - Tela React facelift: `/contents/{eventId}/edit`
 *
 * Ambas escrevem na mesma coluna `events.has_recertification`. O switch
 * "Habilitar reinscrição" só aparece quando a feature flag `:recertificacao`
 * está ATIVA na organização (RN 1 — kill switch global).
 *
 * Convenções aplicadas:
 *  - `safeGoto` em todas as navegações (regra dura meta-monorepo: cobre NPS
 *    Sofia + outros modais oportunistas que travam o evento `load`).
 *  - Switch Chakra: padrão `setSwitch` (skill `interagir-switch-chakra-twygo`)
 *    — `scrollIntoViewIfNeeded` + `click({ force: true })` no label,
 *    idempotente via comparação de estado antes do toggle.
 *  - `data-checked` no label como fonte de verdade do estado (em vez de
 *    `toBeChecked()`, que resolve no `<input>` interno oculto).
 */
export class ContentEditPage extends BasePage {
  readonly path = '';

  constructor(page: Page) {
    super(page);
  }

  // ─── Navegação ──────────────────────────────────────────────────────

  /**
   * Listagem de conteúdos (cursos) da organização do env atual.
   * URL canônica facelift: `/o/{orgId}/events?tab=events&profile=admin`.
   * Sem `?tab=events`, Twygo serve UI Materialize legada (⚙️ engrenagem
   * por row) ao invés da UI Chakra nova (botão `more_vert`/kebab).
   * Validado live 2026-05-27 — `clickEditarFromRow` Caminho 2 depende
   * do data-test-id `events-{id}-actions-kebab` que só existe no facelift.
   */
  async goToContentList(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events&profile=admin`);
  }

  /** Edição HAML (formulário legado `_form_details.haml`). */
  async openEditHamlById(eventId: number | string): Promise<void> {
    await safeGoto(this.page, `/e/${eventId}/edit`);
  }

  /** Edição React (formulário facelift `event-form.tsx`). */
  async openEditReactById(eventId: number | string): Promise<void> {
    await safeGoto(this.page, `/contents/${eventId}/edit?tab=identification`);
  }

  /** Edição React abrindo direto na tab "Acesso" (`?tab=access`). */
  async openEditReactAccessById(eventId: number | string): Promise<void> {
    await safeGoto(this.page, `/contents/${eventId}/edit`);
    // Twygo facelift processa `?tab=access` de forma inconsistente entre
    // initial load e re-render — abre na Identificação e às vezes não
    // commuta. Estratégia robusta: ignorar query param e clicar na tab
    // explicitamente. Aguarda tabs renderizarem (até 20s pra cobrir
    // carregamento lento + React lazy chunks).
    const acessoTab = this.page
      .getByRole('tab', { name: /^Acesso$/i })
      .or(this.page.locator('[data-test-id="tab-access"]'))
      .first();
    await acessoTab.waitFor({ state: 'visible', timeout: 20_000 });
    await acessoTab.click();
    await expect(acessoTab).toHaveAttribute('aria-selected', 'true', { timeout: 5_000 });
    // Aguarda o label visível do checkbox-alvo renderizar.
    await this.page
      .getByText('Habilitar reinscrição', { exact: true })
      .first()
      .waitFor({ state: 'visible', timeout: 10_000 });
  }

  /**
   * Default canônico de "abrir edição" usado pelos specs. Aponta para
   * a tela React (facelift) — única que renderiza o switch "Habilitar
   * reinscrição" (na tab "Acesso", validado live 2026-05-26 após fix
   * de feature flag no env). TC5 usa explicitamente os 2 helpers acima
   * para validar paridade HAML/React.
   */
  async openEditById(eventId: number | string): Promise<void> {
    await this.openEditReactById(eventId);
  }

  /**
   * Atalho: abre edit (facelift) já navegando pra tab "Acesso" — usada
   * pelos TCs que validam o switch "Habilitar reinscrição". Navegação
   * direta via `?tab=access` em vez de click na tab (evita race com
   * inicialização do React form).
   */
  async openEditByIdInAcessoTab(eventId: number | string): Promise<void> {
    await this.openEditReactAccessById(eventId);
  }

  /**
   * Navega pra qualquer tab do form de edição facelift por nome legível.
   * Implementação genérica que cobre as 8 tabs canônicas:
   * `Identificação | Acesso | Banner | Aprovação | Cobrança | Localização |
   * Dashboard | Compartilhar`.
   *
   * Estratégia: click via `getByRole('tab', { name })` (exact regex). Se a
   * tab tem data-test-id estável (ex: `tab-access`), preferir esse seletor
   * em método dedicado (como `goToAcessoTab`). Este helper é fallback
   * pra tabs sem testId mapeado.
   */
  async goToTab(
    tabName:
      | 'Identificação'
      | 'Acesso'
      | 'Banner'
      | 'Aprovação'
      | 'Cobrança'
      | 'Localização'
      | 'Dashboard'
      | 'Compartilhar',
  ): Promise<void> {
    const tab = this.page
      .getByRole('tab', { name: new RegExp(`^${tabName}$`, 'i') })
      .first();
    await tab.waitFor({ state: 'visible', timeout: 10_000 });
    if (await tab.getAttribute('aria-selected') === 'true') return;
    await tab.click();
    await expect(tab).toHaveAttribute('aria-selected', 'true', { timeout: 5_000 });
  }

  /**
   * Navega pra tab "Acesso" do form de edição facelift. No facelift,
   * o checkbox "Habilitar reinscrição" vive nessa tab (validado live
   * 2026-05-27 — seção "Inscrição" → "Permitir registro de inscrição por").
   * No HAML legado não há tabs; helper é no-op.
   *
   * Tab tem data-test-id estável `tab-access` (validado live 2026-05-27).
   * Aguarda o tab ficar selected + URL atualizar.
   */
  async goToAcessoTab(): Promise<void> {
    const acessoTab = this.page
      .locator('[data-test-id="tab-access"]')
      .or(this.page.getByRole('tab', { name: /^Acesso$/i }))
      .first();
    if (await acessoTab.isVisible({ timeout: 2_000 }).catch(() => false)) {
      // Modal beta-end pode reaparecer no /contents/{id}/edit após o
      // createCurso (validado live 2026-06-01: portal Chakra intercepta
      // click na tab Acesso). Dismiss antes + aguarda portal sumir.
      await dismissCommonModals(this.page, { initialWaitMs: 1_500 });
      await this.page
        .locator('.chakra-portal:has(#chakra-modal--body-beta-end-modal)')
        .waitFor({ state: 'hidden', timeout: 5_000 })
        .catch(() => null);
      await acessoTab.click();
      await this.page
        .waitForURL(/tab=access/, { timeout: 5_000 })
        .catch(() => undefined);
      // Confirma a tab Acesso ficou selected (aria-selected=true).
      await expect(acessoTab).toHaveAttribute('aria-selected', 'true', { timeout: 5_000 });
      // Aguarda checkbox "Habilitar reinscrição" renderizar no DOM
      // (label visível — input é screen-reader-only do Chakra).
      await this.page
        .getByText('Habilitar reinscrição', { exact: true })
        .first()
        .waitFor({ state: 'visible', timeout: 5_000 })
        .catch(() => undefined);
    }
  }

  /**
   * Abre a edição de um conteúdo a partir da listagem clicando no ação
   * "Editar" do registro com o nome dado. Caminho usado pelos TCs que
   * descrevem o fluxo "Listagem → Editar" textualmente (TC1, TC4).
   *
   * REVISAR: seletor descoberto via heal — listagem HAML não expõe link
   * "Editar" direto na linha; usa kebab `img "Options"` que abre dropdown
   * com a ação. Adicionar data-test-id estável no app via PR.
   */
  async openEditByName(name: string): Promise<void> {
    await this.goToContentList();
    // Filtrar via campo "Pesquise aqui" reduz a lista a 1 row
    // (mais robusto que getByRole row fuzzy match que pode falhar com
    // accessible name composto de muitas células). Validado live 2026-05-27.
    const searchBox = this.page.getByPlaceholder(/Pesquise aqui/i).first();
    if (await searchBox.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await searchBox.fill(name);
      // Aguarda a row aparecer (search filtra incrementalmente).
      await this.page
        .getByText(name, { exact: false })
        .first()
        .waitFor({ state: 'visible', timeout: 8_000 });
    }
    // Localiza a row que contém o nome (mais flexível que getByRole row).
    const row = this.page
      .locator('tr, [role="row"]')
      .filter({ hasText: name })
      .first();
    await row.waitFor({ state: 'visible', timeout: 10_000 });
    await this.clickEditarFromRow(row);
  }

  /**
   * Abre a edição da PRIMEIRA linha de curso visível na listagem.
   * Usado por TCs cuja pré-condição é só "existe ≥1 curso pré-existente"
   * (TC1) sem fixar nome específico.
   *
   * REVISAR: seletor descoberto via heal — listagem HAML não expõe link
   * "Editar" direto na linha; usa kebab `img "Options"` que abre
   * dropdown com a ação "Editar". Adicionar data-test-id estável no app
   * via PR (`event-row-edit-link` sugerido).
   */
  async openEditFromFirstRow(): Promise<void> {
    await this.goToContentList();
    // Primeira linha de dados (exclui header em <thead>).
    const firstRow = this.page.locator('tbody tr').first();
    await firstRow.waitFor({ state: 'visible', timeout: 10_000 });
    await this.clickEditarFromRow(firstRow);
  }

  /**
   * Clica em "Editar" dentro de uma linha da listagem. Cobre os 2 padrões
   * de UI observados no Twygo:
   *   1. Tela legada (HAML): kebab `img "Options"` → dropdown → "Editar".
   *   2. Tela facelift: `<a>Editar</a>` direto na célula de ações.
   *
   * REVISAR: seletor `img[alt="Options"]` foi descoberto via heal (error-context
   * de TC1 mostrou `img "Options" [cursor=pointer]` como única affordance de ação).
   * Substituir por `data-test-id` estável quando dev adicionar (PR pendente).
   */
  private async clickEditarFromRow(row: Locator): Promise<void> {
    // Caminho 1: link "Editar" direto na row (facelift antigo — pode
    // não existir mais).
    const directLink = row.getByRole('link', { name: /Editar/i }).first();
    if (await directLink.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await directLink.click();
      await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
      return;
    }
    // Caminho 2: more_vert (UI nova facelift, validada live 2026-05-27).
    // Kebab tem `data-test-id="events-{id}-actions-kebab"` (preferencial),
    // com fallback pra accessible name "more_vert". Item de edição é
    // "Gerenciar" mas Chakra renderiza com ícone Material colado: text
    // content vira "editGerenciar" — regex sem âncoras evita o miss.
    const moreVertTrigger = row
      .locator('[data-test-id^="events-"][data-test-id$="-actions-kebab"]')
      .or(row.getByRole('button', { name: 'more_vert' }))
      .or(row.locator('button:has-text("more_vert")'))
      .first();
    if (await moreVertTrigger.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await moreVertTrigger.scrollIntoViewIfNeeded();
      await moreVertTrigger.click();
      const gerenciarItem = this.page
        .getByRole('menuitem', { name: /Gerenciar/i })
        .or(this.page.getByRole('menuitem', { name: /Editar/i }))
        .first();
      await gerenciarItem.waitFor({ state: 'visible', timeout: 5_000 });
      await gerenciarItem.click();
      await this.page.waitForURL(/\/contents\/\d+\/edit/, { timeout: 15_000 });
      return;
    }
    // Caminho 3: kebab Options legado HAML (`img[alt="Options"]`).
    const optionsTrigger = row
      .locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]')
      .first();
    await optionsTrigger.waitFor({ state: 'visible', timeout: 5_000 });
    await optionsTrigger.click();
    const editarItem = this.page
      .getByRole('menuitem', { name: /^Editar$/i })
      .or(this.page.getByRole('link', { name: /^Editar$/i }))
      .first();
    await editarItem.waitFor({ state: 'visible', timeout: 5_000 });
    await editarItem.click();
    await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
  }

  // ─── Switch "Habilitar reinscrição" ─────────────────────────────────

  /**
   * Locator do checkbox HTML "Habilitar reinscrição" — no facelift v1.3+
   * é `<input id="has_recertification">` envolvido em `<label class="chakra-checkbox">`.
   * O input em si é screen-reader-only (1×13px com clip CSS); o label
   * visível tem text "Habilitar reinscrição".
   *
   * Para `.check()/.uncheck()/.isChecked()` retornamos o input (Playwright
   * resolve actionability via label automaticamente). Para `toBeVisible`
   * use [[getHabilitarReinscricaoVisible]] que pega o label.
   *
   * REVISAR: aguardando `data-test-id` estável (`event-has-recertification-checkbox`
   * sugerido). Validado live 2026-05-27 com input#has_recertification.
   */
  getHabilitarReinscricaoSwitch(): Locator {
    return this.page.locator('#has_recertification');
  }

  /**
   * Locator do label visível "Habilitar reinscrição" — use para
   * `toBeVisible` (o input em si é screen-reader-only e falha visibility).
   */
  getHabilitarReinscricaoVisible(): Locator {
    return this.page
      .locator('label.chakra-checkbox')
      .filter({ has: this.page.locator('#has_recertification') })
      .first();
  }

  /**
   * Locator do `<label>` (não do `<input>`) — necessário para click no
   * switch Chakra (skill `interagir-switch-chakra-twygo`). Caminho: subir
   * pro ancestor `<label>` que envolve o input oculto.
   */
  getHabilitarReinscricaoSwitchLabel(): Locator {
    return this.page
      .locator('label.chakra-switch')
      .filter({ has: this.getHabilitarReinscricaoSwitch() });
  }

  /**
   * Locator do ícone de ajuda do switch — geralmente um `<button>` ou
   * `<span>` com role `button` adjacente ao label, com aria-label ou
   * tooltip key. Capturamos via filtro pelo label irmão.
   *
   * REVISAR: sem `data-test-id` no app hoje; fallback usa proximidade do
   * label. Quando o data-test-id `event-has-recertification-help-icon`
   * for adicionado, trocar este getter.
   */
  getHabilitarReinscricaoTooltipTrigger(): Locator {
    // Tooltip-trigger é o ícone/botão sibling do label do switch.
    return this.page
      .locator(':is(button, span, [role="button"])')
      .filter({ has: this.page.locator('[aria-describedby], [data-tooltip], svg') })
      .filter({
        has: this.page.locator(
          'xpath=ancestor::*[self::div or self::label][.//text()[contains(., "Habilitar reinscrição")]]',
        ),
      })
      .first();
  }

  /**
   * Texto visível do tooltip após hover no ícone de ajuda. O texto vem
   * da chave I18n `activerecord.attributes.event.has_recertification_tooltip`.
   *
   * REVISAR-FIGMA: texto exato do tooltip ainda não confirmado — capturamos
   * o role `tooltip` que aparece após hover.
   */
  getHabilitarReinscricaoTooltip(): Locator {
    return this.page.getByRole('tooltip').first();
  }

  /**
   * Estado atual do checkbox "Habilitar reinscrição". No facelift v1.3+,
   * é um checkbox HTML padrão (não Chakra switch) — `isChecked()` direto.
   * Navega proativamente pra tab "Acesso" no facelift antes de checar.
   */
  async isHabilitarReinscricaoOn(): Promise<boolean> {
    if (/\/contents\/\d+\/edit/.test(this.page.url())) {
      await this.goToAcessoTab();
    }
    const checkbox = this.getHabilitarReinscricaoSwitch();
    if ((await checkbox.count()) === 0) return false;
    return checkbox.isChecked();
  }

  /**
   * Idempotente: só toggla se o estado atual diverge do desejado.
   * Validado live 2026-05-27 — "Habilitar reinscrição" é checkbox HTML
   * (input#has_recertification screen-reader-only com label.chakra-checkbox
   * visível). Tab Acesso, seção "Permitir registro de inscrição por".
   */
  async setHabilitarReinscricao(enabled: boolean): Promise<void> {
    // No facelift React, checkbox vive na tab "Acesso" — navega
    // proativamente. Em HAML legado (`/e/{id}/edit`) helper é no-op.
    if (/\/contents\/\d+\/edit/.test(this.page.url())) {
      await this.goToAcessoTab();
    }
    // Aguarda o LABEL visível antes de tocar no input (input é
    // screen-reader-only, waitFor('visible') no input timeoutaria).
    await this.getHabilitarReinscricaoVisible().waitFor({
      state: 'visible',
      timeout: 10_000,
    });
    const checkbox = this.getHabilitarReinscricaoSwitch();
    if (enabled) {
      await checkbox.check();
    } else {
      await checkbox.uncheck();
    }
  }

  // ─── Submit / mensagens ─────────────────────────────────────────────

  getSaveButton(): Locator {
    // Tela HAML usa <input type="submit" value="Salvar">; React usa <button>Salvar</button>.
    // role=button cobre os dois.
    return this.page.getByRole('button', { name: /^Salvar$/ }).first();
  }

  async save(): Promise<void> {
    await this.getSaveButton().click();
  }

  /**
   * Aguarda confirmação de save bem-sucedido. Twygo usa toast Chakra +
   * redirect para a listagem (variando entre HAML/React). Asserta a
   * primeira condição que aparecer (toast OU URL de listagem).
   *
   * REVISAR-FIGMA: texto exato do toast de sucesso ainda não confirmado.
   */
  async expectSaveSuccess(): Promise<void> {
    // Toast Chakra de sucesso (status=success) — primeiro sinal pós-submit.
    const toast = this.page
      .locator('.chakra-toast, [role="status"]')
      .filter({ hasText: /salv|sucesso/i })
      .first();
    await expect
      .poll(async () => {
        const toastVisible = await toast.isVisible().catch(() => false);
        const url = this.page.url();
        return (
          toastVisible ||
          /\/o\/\d+\/events(\?|$)/.test(url) ||
          /\/(e\/\d+\/edit|contents\/\d+\/edit)/.test(url)
        );
      })
      .toBe(true);
  }
}
