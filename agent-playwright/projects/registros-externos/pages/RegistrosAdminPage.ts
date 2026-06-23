import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';
import {
  type KpiStatus,
  KPI_LABEL,
  EMPTY_ROW_TEXT,
} from './MeuHistoricoPage.js';

export { type KpiStatus, KPI_LABEL, EMPTY_ROW_TEXT };

const ORDER: KpiStatus[] = ['emitted', 'expired', 'pending', 'rejected'];

/**
 * Tela "Aprendizagem > Registros" na visão **Admin/Líder** — rota `/o/{orgId}/records`
 * (sem `in_use_mode_layout=true`, que é o layout embarcado do Aluno).
 *
 * Diferenças-chave em relação à visão do Aluno (ver {@link MeuHistoricoPage}):
 *  - os 4 KPI cards são um **dashboard estático**: NÃO são clicáveis, não aplicam
 *    filtro de status, não entram em estado "ativo"/"dimmed" (RN 30);
 *  - a contagem cobre toda a organização ativa (Admin) ou os liderados diretos
 *    (Líder), e é puramente informativa — não reage a filtros (RN 31);
 *  - a toolbar tem "Adicionar", "Ações em massa" e "Extrair dados".
 *
 * Os seletores da faixa de KPIs (`records-kpi-card-*`, `records-kpi-count-*`,
 * `records-total-workload`, `tab-records-tab`) são os MESMOS da visão Aluno.
 * O donut é um `<canvas>` (Chart.js) — a cor não é introspectável no DOM; como
 * os cards do Admin nunca ficam ativos, a cor não pode ser validada pela via do
 * border (usada no Aluno). Validamos a anatomia (canvas + número + label).
 */
export class RegistrosAdminPage {
  constructor(private readonly page: Page) {}

  private url(): string {
    return `/o/${getOrgId()}/records`;
  }

  tabRecords(): Locator {
    return this.page.getByTestId('tab-records-tab');
  }

  /**
   * Navega com tolerância a 503 transitório do nginx em Stage e à renderização
   * tardia dos cards (a faixa de KPIs só popula após o fetch de `records/stats`,
   * que pode levar >10s). Mesmo padrão de retry de {@link MeuHistoricoPage.goto}.
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
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 3_000));
    }
    await this.expectLoaded();
  }

  /** Espera a faixa de 4 KPIs renderizar (cards hidratam tarde — timeout largo). */
  async expectLoaded(): Promise<void> {
    await expect(this.tabRecords()).toBeVisible({ timeout: 20_000 });
    for (const s of ORDER) {
      await expect(this.card(s)).toBeVisible({ timeout: 60_000 });
    }
    await this.waitForCountsHydrated();
  }

  /**
   * Os cards renderizam primeiro com "0" (placeholder) e só depois recebem os
   * números de `records/stats` (hidratação assíncrona). Ler `getCount` antes
   * disso devolve 0 e gera falso-vermelho (o snapshot "antes" sai zerado e o
   * "depois" já hidratado). Gate: poll até cada card bater com o stats do
   * backend — só então a faixa está realmente pronta para ser medida.
   */
  async waitForCountsHydrated(): Promise<void> {
    const stats = await this.getStats();
    for (const s of ORDER) {
      await expect
        .poll(async () => this.getCount(s), { timeout: 30_000 })
        .toBe(stats.byStatus[s]);
    }
  }

  // ---- KPI cards ----

  card(status: KpiStatus): Locator {
    return this.page.getByTestId(`records-kpi-card-${status}`);
  }

  countNode(status: KpiStatus): Locator {
    return this.page.getByTestId(`records-kpi-count-${status}`);
  }

  async getCount(status: KpiStatus): Promise<number> {
    const txt = (await this.countNode(status).innerText()).trim();
    return Number.parseInt(txt.replace(/\D/g, '') || '0', 10);
  }

  /** Snapshot das 4 contagens dos cards. */
  async getCounts(): Promise<Record<KpiStatus, number>> {
    const out = {} as Record<KpiStatus, number>;
    for (const s of ORDER) out[s] = await this.getCount(s);
    return out;
  }

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

  /**
   * Card do Admin é estático: o "estado ativo" do Aluno (elevação via boxShadow)
   * NÃO deve aparecer ao clicar. Reaproveitamos a heurística do Aluno
   * (boxShadow != none = ativo) para PROVAR a ausência de seleção (RN 30).
   */
  async isActive(status: KpiStatus): Promise<boolean> {
    return this.card(status).evaluate((el) => getComputedStyle(el).boxShadow !== 'none');
  }

  /** Cursor computado do card (espera-se `default`, não `pointer`, no Admin — RN 30). */
  async getCursor(status: KpiStatus): Promise<string> {
    return this.card(status).evaluate((el) => getComputedStyle(el).cursor);
  }

  /** Clique cru no card, sem assertir nada (usado para provar não-clicabilidade). */
  async clickCardRaw(status: KpiStatus): Promise<void> {
    await this.card(status).click({ trial: false });
  }

  // ---- Tooltips ----

  tooltip(): Locator {
    return this.page.locator('[role="tooltip"]');
  }

  /** Hover no card e devolve o texto do tooltip exibido. */
  async readTooltip(status: KpiStatus): Promise<string> {
    await this.card(status).hover();
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

  // ---- Lista ----

  dataRows(): Locator {
    return this.page.locator('table tbody tr').filter({ hasNotText: EMPTY_ROW_TEXT });
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

  /** Nome da pessoa exibido na primeira linha de dados (para exercer a busca). */
  async getFirstRowPersonName(): Promise<string> {
    const first = this.dataRows().first();
    const txt = (await first.innerText()).split('\n').map((s) => s.trim()).filter(Boolean);
    return txt[0] ?? '';
  }

  // ---- Busca ----

  searchInput(): Locator {
    return this.page.getByPlaceholder(/Pesquise por pessoa, conteúdo ou provedor/i);
  }

  async search(term: string): Promise<void> {
    const input = this.searchInput();
    await input.fill(term);
    await input.press('Enter');
  }

  async clearSearch(): Promise<void> {
    const input = this.searchInput();
    await input.fill('');
    await input.press('Enter');
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

  /** Filtro padrão pelo nome (ex.: "Pendentes") existe no drawer? */
  async hasDefaultFilter(name: string): Promise<boolean> {
    const drawer = this.filterDrawer();
    const accordion = drawer.getByRole('button', { name: /Filtros padrão/i });
    if (await accordion.isVisible().catch(() => false)) {
      await accordion.click().catch(() => {});
    }
    return drawer.getByText(name, { exact: true }).first().isVisible({ timeout: 2_000 }).catch(() => false);
  }

  async applyDefaultFilter(name: string): Promise<void> {
    const drawer = this.filterDrawer();
    await drawer.getByText(name, { exact: true }).first().click();
    await drawer.getByRole('button', { name: 'Aplicar' }).click();
    await expect(this.filterDrawer()).toBeHidden({ timeout: 10_000 });
  }

  async cancelFilterDrawer(): Promise<void> {
    await this.filterDrawer().getByRole('button', { name: 'Cancelar' }).click();
    await expect(this.filterDrawer()).toBeHidden({ timeout: 10_000 });
  }

  // ---- Stats API (invariante de contagem) ----

  /**
   * Lê o endpoint que popula os cards. Contagens dos cards devem bater com isto
   * (invariante), em vez de números fixos de seed que oscilam no Stage.
   */
  async getStats(): Promise<{ byStatus: Record<string, number>; totalGeneral: number; workloadSeconds: number }> {
    const res = await this.page.request.get(`/api/v1/o/${getOrgId()}/records/stats`);
    expect(res.ok(), `records/stats deveria responder 2xx (status=${res.status()})`).toBeTruthy();
    const json = (await res.json()) as {
      data?: { by_status?: Record<string, number>; total_general?: number; workload_total_seconds?: number };
    };
    const d = json.data ?? {};
    return {
      byStatus: d.by_status ?? {},
      totalGeneral: d.total_general ?? 0,
      workloadSeconds: d.workload_total_seconds ?? 0,
    };
  }
}
