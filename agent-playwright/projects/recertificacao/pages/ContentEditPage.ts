import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage.js';
import { getOrgId } from '../../../src/utils/environment.js';
import { safeGoto } from '../../../src/utils/modals.js';

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
   * URL canônica: `/o/{orgId}/events`.
   */
  async goToContentList(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/events`);
  }

  /** Edição HAML (formulário legado `_form_details.haml`). */
  async openEditHamlById(eventId: number | string): Promise<void> {
    await safeGoto(this.page, `/e/${eventId}/edit`);
  }

  /** Edição React (formulário facelift `event-form.tsx`). */
  async openEditReactById(eventId: number | string): Promise<void> {
    await safeGoto(this.page, `/contents/${eventId}/edit`);
  }

  /**
   * Default canônico de "abrir edição" usado pelos specs. Hoje aponta para
   * a tela HAML — é onde a maior parte dos campos vive (Detalhes). TC5
   * usa explicitamente os 2 helpers acima para validar paridade.
   */
  async openEditById(eventId: number | string): Promise<void> {
    await this.openEditHamlById(eventId);
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
    const row = this.page.getByRole('row', { name: new RegExp(name, 'i') }).first();
    await row.waitFor({ state: 'visible' });
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
    // Caminho 1: link "Editar" direto (facelift).
    const directLink = row.getByRole('link', { name: /Editar/i }).first();
    if (await directLink.isVisible().catch(() => false)) {
      await directLink.click();
      await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
      return;
    }
    // Caminho 2: kebab Options (HAML). Abre dropdown e clica "Editar".
    const optionsTrigger = row
      .locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]')
      .first();
    await optionsTrigger.waitFor({ state: 'visible', timeout: 5_000 });
    await optionsTrigger.click();
    // Item "Editar" do dropdown — pode ser <a>, <li>, ou role=menuitem.
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
   * Locator do `<label>` do switch Chakra "Habilitar reinscrição".
   * Preferimos o role `checkbox` (semântico, estável entre HAML e React),
   * mas o click subsequente é via `setSwitch` no label — ver skill
   * `interagir-switch-chakra-twygo`.
   *
   * REVISAR: aguardando `data-test-id` estável (`event-has-recertification-switch`
   * sugerido). Quando o atributo for adicionado no app, trocar este getter.
   */
  getHabilitarReinscricaoSwitch(): Locator {
    // Fallback semântico — funciona em HAML e React enquanto o data-test-id
    // não existe. Atalho para o role+name canônico definido pela prosa do MD.
    return this.page.getByRole('checkbox', { name: /Habilitar reinscrição/i });
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
   * Estado atual do switch (lê `data-checked` do label — fonte de verdade
   * para switches Chakra; ver skill `interagir-switch-chakra-twygo`).
   */
  async isHabilitarReinscricaoOn(): Promise<boolean> {
    const label = this.getHabilitarReinscricaoSwitchLabel();
    if ((await label.count()) === 0) return false;
    return (await label.getAttribute('data-checked')) !== null;
  }

  /**
   * Idempotente: só clica se o estado atual diverge do desejado. Usa
   * `force: true` + `scrollIntoViewIfNeeded` no `<label>` Chakra.
   *
   * Skill `interagir-switch-chakra-twygo` documenta o porquê (label
   * intercepta pointer event do input oculto, scroll necessário em
   * drawers altos).
   */
  async setHabilitarReinscricao(enabled: boolean): Promise<void> {
    const label = this.getHabilitarReinscricaoSwitchLabel();
    await label.waitFor({ state: 'visible' });
    const isOn = (await label.getAttribute('data-checked')) !== null;
    if (isOn !== enabled) {
      await label.scrollIntoViewIfNeeded();
      await label.click({ force: true });
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
