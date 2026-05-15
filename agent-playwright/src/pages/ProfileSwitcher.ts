import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { getOrgId } from '../utils/environment.js';
import { dismissCommonModals } from '../utils/modals.js';

export type ProfileName = 'Administrador' | 'Aluno' | 'Colaborador' | 'Instrutor' | 'Gestor';

const PROFILE_LINK_CLASS: Record<ProfileName, string> = {
  Administrador: 'new-item-admin',
  Aluno: 'new-item-aluno',
  Colaborador: 'new-item-collaborator',
  Instrutor: 'new-item-instructor',
  Gestor: 'new-item-manager',
};

/**
 * Alterna entre perfis Twygo (Administrador / Aluno / Colaborador / Instrutor / Gestor)
 * via popover do canto superior direito.
 *
 * O switch é client-side: mesmo usuário admin alterna entre perfis sem credencial nova
 * nem storageState secundário. Ver skill `.claude/skills/trocar-perfil-twygo/SKILL.md`.
 */
export class ProfileSwitcher {
  /**
   * `orgIdOverride`: orgId pra montar paths `/o/<X>/...` em vez do
   * `getOrgId()` global (env principal do project.config). Use em specs
   * que rodam em env secundário (ex `staging-widgets-disabled` com
   * orgId 36989) — sem override, switchToViaUrl('Administrador') vai
   * pra orgId do principal, cai em 404/redirect cross-tenant.
   */
  constructor(
    private readonly page: Page,
    private readonly orgIdOverride?: string,
  ) {}

  private getOrg(): string {
    return this.orgIdOverride ?? getOrgId();
  }

  private trigger(): Locator {
    return this.page.locator('button.menu-target');
  }

  async open(): Promise<void> {
    await this.trigger().click();
    await expect(
      this.page.getByRole('heading', { name: /Alterar seu perfil/i }),
    ).toBeVisible();
  }

  async getCurrentProfile(): Promise<string> {
    const text = (await this.trigger().innerText()).trim();
    const first = text.split(/\s+/)[0] ?? '';
    return first.replace(/[^A-Za-zÀ-ÿ]/g, '');
  }

  /**
   * Cleanup teardown: reverte para Administrador se necessário.
   * No-op quando o teste foi skipped (page nunca navegou) — evita timeout
   * tentando ler o trigger numa página `about:blank`.
   */
  async revertToAdminSafe(): Promise<void> {
    if (this.page.url() === 'about:blank') return;
    const triggerVisible = await this.trigger().isVisible().catch(() => false);
    if (!triggerVisible) return;
    if ((await this.getCurrentProfile()) === 'Administrador') return;
    await this.switchToViaUrl('Administrador');
  }

  /**
   * Switch via UI (click no popover). Use quando o spec testa o popover.
   * Para todos os outros casos, prefira `switchToViaUrl` (mais rápido e robusto).
   */
  async switchTo(profile: ProfileName): Promise<void> {
    if ((await this.getCurrentProfile()) === profile) return;
    await this.open();
    await this.page.locator(`.${PROFILE_LINK_CLASS[profile]}`).click();
    await this.page.waitForLoadState('domcontentloaded');
    await dismissCommonModals(this.page);
    await expect(this.trigger()).toContainText(profile);
  }

  /**
   * Switch via URL (atalho — não passa pelo popover).
   *
   * - Aluno → `/dashboard_students` (default landing pro perfil Aluno).
   * - Administrador → `/o/{orgId}/events?tab=events&profile=admin`.
   * - Demais perfis caem no popover (rota direta não documentada).
   */
  async switchToViaUrl(profile: ProfileName): Promise<void> {
    if (profile === 'Aluno') {
      await this.page.goto('/dashboard_students', { waitUntil: 'domcontentloaded' });
    } else if (profile === 'Administrador') {
      await this.page.goto(`/o/${this.getOrg()}/events?tab=events&profile=admin`, {
        waitUntil: 'domcontentloaded',
      });
    } else {
      await this.switchTo(profile);
      return;
    }
    await dismissCommonModals(this.page);
    await expect(this.trigger()).toContainText(profile);
  }
}
