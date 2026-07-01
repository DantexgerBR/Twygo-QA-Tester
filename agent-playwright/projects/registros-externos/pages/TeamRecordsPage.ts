import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto, dismissCommonModals } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';
import { type KpiStatus, EMPTY_ROW_TEXT } from './MeuHistoricoPage.js';

/**
 * Tela "Gestão de Time > Registros externos" — a visão ESCOPADA do **Líder de
 * equipe** sobre os registros dos seus **liderados diretos** (RN 93/96.5).
 *
 * Descoberta no recon "modo de uso" (2026-06-30, ver
 * `inputs/recon-escopo-lider-modo-uso.md`). O recon §9 anterior concluiu, por
 * engano, que "o escopo de Líder não é aplicado a /records neste BETA" — porque
 * só exercitou o popover de perfil (que cai em `/dashboard_students`) e o
 * `/records` admin. A visão real do líder é um **modelo de página do modo de
 * uso "Lider de equipe"** (`use_mode` id 70340), alcançada por menu, NÃO pelo
 * popover:
 *
 *  - Rota da tela:   `/o/{org}/team/records?menu_id=registros-externos`
 *  - Stats escopado: `GET /api/v1/o/{org}/records/stats?in_use_mode_layout=true&team_scope=true`
 *
 * Os três escopos retornam números distintos (prova de que o escopo FUNCIONA):
 * Admin `/records/stats` (org inteira) > Colaborador `?in_use_mode_layout=true`
 * (próprio) > Time `?...&team_scope=true` (liderados). Ver o recon para os
 * valores observados.
 *
 * O perfil "Lider de equipe" desta org usa a classe de link `new-item-aluno`
 * (é o perfil aluno/colaborador renomeado pelo admin), e o trigger exibe
 * "Lider de equipe" — por isso o switch é feito aqui sem assertir o rótulo
 * "Aluno" (ver skill `trocar-perfil-twygo`, seção persona × modelo de página).
 */
export class TeamRecordsPage {
  constructor(private readonly page: Page) {}

  private url(): string {
    return `/o/${getOrgId()}/team/records?menu_id=registros-externos`;
  }

  tabRecords(): Locator {
    return this.page.getByTestId('tab-records-tab');
  }

  card(status: KpiStatus): Locator {
    return this.page.getByTestId(`records-kpi-card-${status}`);
  }

  /**
   * Entra no modo de uso "Lider de equipe" e abre a tela de Registros do time.
   *
   * O switch é via popover (`button.menu-target` → `a.new-item-aluno`), sem
   * assertir o rótulo do trigger (que aqui é "Lider de equipe", não "Aluno").
   * Em seguida navega à rota do modelo de página do time. Tolerante a 503
   * transitório do Stage e à hidratação tardia dos cards (mesmo padrão de
   * {@link RegistrosAdminPage.goto}).
   */
  async goto(): Promise<void> {
    // 1. Entrar no contexto do modo de uso do líder (popover → perfil).
    await this.page.locator('button.menu-target').first().click({ timeout: 10_000 }).catch(() => {});
    await this.page.locator('a.new-item-aluno').first().click({ timeout: 10_000 }).catch(() => {});
    await this.page.waitForLoadState('domcontentloaded');
    await dismissCommonModals(this.page);

    // 2. Abrir a tela de Registros do time, com retry para 503/hidratação.
    const maxAttempts = 3;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await safeGoto(this.page, this.url());
      const loaded = await this.tabRecords().isVisible({ timeout: 12_000 }).catch(() => false);
      if (loaded) {
        await expect(this.card('emitted')).toBeVisible({ timeout: 30_000 });
        return;
      }
      if (attempt < maxAttempts) await new Promise((r) => setTimeout(r, 3_000));
    }
    await expect(this.tabRecords()).toBeVisible({ timeout: 20_000 });
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
    return this.emptyIndicator().first().isVisible().catch(() => false);
  }

  // ---- Stats escopado ao time (team_scope) ----

  /**
   * Lê o `/records/stats` ESCOPADO aos liderados (`in_use_mode_layout=true` +
   * `team_scope=true`). É a fonte de verdade do KPI na visão do líder — distinta
   * do stats do Admin (org inteira) e do Colaborador (próprio).
   */
  async getTeamStats(): Promise<{ byStatus: Record<string, number>; totalGeneral: number; workloadSeconds: number }> {
    const res = await this.page.request.get(
      `/api/v1/o/${getOrgId()}/records/stats?in_use_mode_layout=true&team_scope=true`,
    );
    expect(res.ok(), `records/stats (team_scope) deveria responder 2xx (status=${res.status()})`).toBeTruthy();
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
