import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Tela "Meu Histórico" (Registros de Aprendizagem) — visão do Aluno/Colaborador.
 *
 * Nesta org (registros-externos) a persona aluno é rotulada "Colaborador" e o
 * usuário do globalSetup já cai nela; a rota com `in_use_mode_layout=true`
 * renderiza o layout embarcado do aluno independentemente do perfil ativo, então
 * não é necessário trocar de perfil pela UI para acessar a tela.
 */
export type KpiStatus = 'emitted' | 'expired' | 'pending' | 'rejected';

/** Rótulo PT-BR exibido em cada card, na ordem canônica (RN 18). */
export const KPI_LABEL: Record<KpiStatus, string> = {
  emitted: 'Emitidos',
  expired: 'Expirados',
  pending: 'Pendentes',
  rejected: 'Recusados',
};

/**
 * Cor canônica por status (RN 18), em `rgb(...)` como o browser computa.
 * O donut é um `<canvas>` (Chart.js) — a cor não é introspectável no DOM, mas o
 * card ativo adota a MESMA cor de design no `border`, então validamos a cor por
 * essa via (ver MeuHistoricoPage.getActiveBorderColor).
 */
export const KPI_COLOR: Record<KpiStatus, string> = {
  emitted: 'rgb(56, 161, 105)', // #38A169 verde
  expired: 'rgb(245, 101, 101)', // #F56565 vermelho
  pending: 'rgb(221, 107, 32)', // #DD6B20 laranja
  rejected: 'rgb(113, 128, 150)', // #718096 cinza
};

const ORDER: KpiStatus[] = ['emitted', 'expired', 'pending', 'rejected'];

/** Texto exibido na linha placeholder da tabela quando não há dados. */
export const EMPTY_ROW_TEXT = 'Não há dados para exibir';

export class MeuHistoricoPage {
  constructor(private readonly page: Page) {}

  /** Rota do Aluno (layout embarcado). orgId resolvido por env — nunca hardcode. */
  private url(): string {
    return `/o/${getOrgId()}/records?in_use_mode_layout=true`;
  }

  tabRecords(): Locator {
    return this.page.getByTestId('tab-records-tab');
  }

  /**
   * Navega para a tela com tolerância a 503 transitório do nginx (o staging
   * devolve "503 Service Temporarily Unavailable" sob carga — é resposta HTTP
   * válida, então safeGoto não a trata como erro de rede). Tenta recarregar até
   * a faixa de KPIs aparecer.
   */
  async goto(): Promise<void> {
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await safeGoto(this.page, this.url());
      const loaded = await this.tabRecords().isVisible({ timeout: 12_000 }).catch(() => false);
      if (loaded) {
        await this.expectLoaded();
        return;
      }
      // Backoff antes de retentar (setTimeout do node — não é waitForTimeout,
      // que é proibido pela regra dura #1; mesmo padrão usado em safeGoto).
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 3_000));
    }
    // Última tentativa: deixa a asserção estourar com a mensagem real.
    await this.expectLoaded();
  }

  /** Garante que a faixa de KPIs renderizou (espera o stats popular os cards). */
  async expectLoaded(): Promise<void> {
    await expect(this.tabRecords()).toBeVisible({ timeout: 20_000 });
    for (const s of ORDER) {
      await expect(this.card(s)).toBeVisible({ timeout: 20_000 });
    }
  }

  // ---- KPI cards ----

  card(status: KpiStatus): Locator {
    return this.page.getByTestId(`records-kpi-card-${status}`);
  }

  countNode(status: KpiStatus): Locator {
    return this.page.getByTestId(`records-kpi-count-${status}`);
  }

  /** Número exibido no card (contagem do status para o aluno). */
  async getCount(status: KpiStatus): Promise<number> {
    const txt = (await this.countNode(status).innerText()).trim();
    return Number.parseInt(txt.replace(/\D/g, '') || '0', 10);
  }

  /** Rótulos dos 4 cards na ordem em que aparecem no DOM. */
  async getCardLabelsInOrder(): Promise<string[]> {
    return this.page
      .locator('[data-test-id^="records-kpi-card-"]')
      .evaluateAll((cards) =>
        cards.map((c) => {
          const m = (c.textContent || '').match(/(Emitidos|Expirados|Pendentes|Recusados)/);
          return m ? m[1] : (c.textContent || '').trim();
        }),
      );
  }

  /** Cada card tem donut (canvas), número e label. */
  async expectCardAnatomy(status: KpiStatus): Promise<void> {
    const card = this.card(status);
    await expect(card.locator('canvas')).toBeVisible();
    await expect(this.countNode(status)).toBeVisible();
    await expect(card).toContainText(KPI_LABEL[status]);
  }

  async clickCard(status: KpiStatus): Promise<void> {
    await this.card(status).click();
    // Aguarda a re-renderização do estado ativo (boxShadow de elevação aparece).
    await expect
      .poll(async () => this.isActive(status), { timeout: 10_000 })
      .toBe(true);
  }

  /** Click cru, sem assertir estado resultante (para toggle off / desseleção). */
  async clickCardRaw(status: KpiStatus): Promise<void> {
    await this.card(status).click();
  }

  /** Clica o card ativo de novo e aguarda ele ficar inativo (RN 26.1). */
  async deactivateCard(status: KpiStatus): Promise<void> {
    await this.card(status).click();
    await expect
      .poll(async () => this.isActive(status), { timeout: 10_000 })
      .toBe(false);
  }

  /**
   * Card ativo recebe elevação (boxShadow != none) além do border colorido.
   * boxShadow é estável entre status (não depende da classe Chakra hasheada).
   */
  async isActive(status: KpiStatus): Promise<boolean> {
    return this.card(status).evaluate((el) => getComputedStyle(el).boxShadow !== 'none');
  }

  async getBorderColor(status: KpiStatus): Promise<string> {
    return this.card(status).evaluate((el) => getComputedStyle(el).borderColor);
  }

  /** Ativa o card e devolve a cor do border no estado ativo (= cor do donut). */
  async getActiveBorderColor(status: KpiStatus): Promise<string> {
    await this.clickCard(status);
    return this.getBorderColor(status);
  }

  /**
   * Ativa o card e aguarda a cor do border ESTABILIZAR na cor canônica do status
   * (a transição CSS leva alguns ms — ler imediatamente pega a cor intermediária).
   */
  async expectActiveBorderColor(status: KpiStatus): Promise<void> {
    await this.clickCard(status);
    await expect
      .poll(async () => this.getBorderColor(status), { timeout: 5_000 })
      .toBe(KPI_COLOR[status]);
  }

  // ---- Tooltips ----

  async hoverCard(status: KpiStatus): Promise<void> {
    await this.card(status).hover();
  }

  tooltip(): Locator {
    return this.page.locator('[role="tooltip"]');
  }

  /** Hover no card e devolve o texto do tooltip exibido. */
  async readTooltip(status: KpiStatus): Promise<string> {
    // Garante que o tooltip do card anterior já sumiu antes de hoverar o próximo
    // — o Chakra tooltip tem closeDelay, e ler com ele ainda na tela devolve o
    // texto stale do card anterior.
    await this.page.mouse.move(0, 0);
    await this.tooltip().first().waitFor({ state: 'hidden', timeout: 5_000 }).catch(() => {});
    await this.hoverCard(status);
    await expect(this.tooltip().first()).toBeVisible({ timeout: 10_000 });
    const txt = (await this.tooltip().first().innerText()).trim();
    await this.page.mouse.move(0, 0);
    return txt;
  }

  // ---- Carga horária ----

  workload(): Locator {
    return this.page.getByTestId('records-total-workload');
  }

  async getWorkloadText(): Promise<string> {
    return (await this.workload().innerText()).replace(/\s+/g, ' ').trim();
  }

  // ---- Lista de registros ----

  /** Linhas de dados reais (exclui a linha placeholder "Não há dados para exibir"). */
  dataRows(): Locator {
    return this.page
      .locator('table tbody tr')
      .filter({ hasNotText: EMPTY_ROW_TEXT });
  }

  async getVisibleRecordCount(): Promise<number> {
    return this.dataRows().count();
  }

  emptyIndicator(): Locator {
    return this.page.getByText(EMPTY_ROW_TEXT, { exact: false });
  }

  async isEmptyState(): Promise<boolean> {
    return this.emptyIndicator().first().isVisible();
  }

  // ---- Drawer de filtros ----

  filterButton(): Locator {
    return this.page.getByTestId('filter-control-open-button');
  }

  filterDrawer(): Locator {
    return this.page.locator('.chakra-modal__content.chakra-slide');
  }

  async openFilterDrawer(): Promise<void> {
    await this.filterButton().click();
    await expect(this.filterDrawer()).toBeVisible({ timeout: 10_000 });
  }

  /**
   * Aplica um filtro padrão pelo nome (ex.: "Pendentes", "Expirados") e confirma.
   * Os filtros padrão ficam sob o accordion "Filtros padrão".
   */
  async applyDefaultFilter(name: string): Promise<void> {
    const drawer = this.filterDrawer();
    const accordion = drawer.getByRole('button', { name: /Filtros padrão/i });
    if (await accordion.isVisible().catch(() => false)) {
      await accordion.click().catch(() => {});
    }
    await drawer.getByText(name, { exact: true }).first().click();
    await drawer.getByRole('button', { name: 'Aplicar' }).click();
    await expect(this.filterDrawer()).toBeHidden({ timeout: 10_000 });
  }

  async cancelFilterDrawer(): Promise<void> {
    await this.filterDrawer().getByRole('button', { name: 'Cancelar' }).click();
    await expect(this.filterDrawer()).toBeHidden({ timeout: 10_000 });
  }

  /** Botão externo de limpar filtros (aparece quando há filtro ativo). */
  clearFiltersButton(): Locator {
    return this.page.getByRole('button', { name: /Limpar filtros/i });
  }

  /**
   * Reset robusto de qualquer filtro (card client-side ou filtro do drawer
   * persistido server-side): clica "Limpar filtros" se presente e recarrega.
   */
  async clearAllFilters(): Promise<void> {
    const clear = this.clearFiltersButton();
    if (await clear.isVisible({ timeout: 2_000 }).catch(() => false)) {
      await clear.click().catch(() => {});
    }
    await this.goto();
  }
}
