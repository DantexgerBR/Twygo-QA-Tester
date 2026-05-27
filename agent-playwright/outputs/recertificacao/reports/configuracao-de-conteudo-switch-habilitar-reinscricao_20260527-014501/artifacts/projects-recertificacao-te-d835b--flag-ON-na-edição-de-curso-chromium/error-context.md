# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc1-switch-aparece-com-flag-on.spec.ts:52:3

# Error details

```
TimeoutError: locator.innerText: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button.menu-target')

```

# Test source

```ts
  1   | import type { Locator, Page } from '@playwright/test';
  2   | import { expect } from '@playwright/test';
  3   | import { getOrgId } from '../utils/environment.js';
  4   | import { dismissCommonModals } from '../utils/modals.js';
  5   | 
  6   | export type ProfileName = 'Administrador' | 'Aluno' | 'Colaborador' | 'Instrutor' | 'Gestor';
  7   | 
  8   | const PROFILE_LINK_CLASS: Record<ProfileName, string> = {
  9   |   Administrador: 'new-item-admin',
  10  |   Aluno: 'new-item-aluno',
  11  |   Colaborador: 'new-item-collaborator',
  12  |   Instrutor: 'new-item-instructor',
  13  |   Gestor: 'new-item-manager',
  14  | };
  15  | 
  16  | /**
  17  |  * Alterna entre perfis Twygo (Administrador / Aluno / Colaborador / Instrutor / Gestor)
  18  |  * via popover do canto superior direito.
  19  |  *
  20  |  * O switch é client-side: mesmo usuário admin alterna entre perfis sem credencial nova
  21  |  * nem storageState secundário. Ver skill `.claude/skills/trocar-perfil-twygo/SKILL.md`.
  22  |  */
  23  | export class ProfileSwitcher {
  24  |   /**
  25  |    * `orgIdOverride`: orgId pra montar paths `/o/<X>/...` em vez do
  26  |    * `getOrgId()` global (env principal do project.config). Use em specs
  27  |    * que rodam em env secundário (ex `staging-widgets-disabled` com
  28  |    * orgId 36989) — sem override, switchToViaUrl('Administrador') vai
  29  |    * pra orgId do principal, cai em 404/redirect cross-tenant.
  30  |    */
  31  |   constructor(
  32  |     private readonly page: Page,
  33  |     private readonly orgIdOverride?: string,
  34  |   ) {}
  35  | 
  36  |   private getOrg(): string {
  37  |     return this.orgIdOverride ?? getOrgId();
  38  |   }
  39  | 
  40  |   private trigger(): Locator {
  41  |     return this.page.locator('button.menu-target');
  42  |   }
  43  | 
  44  |   async open(): Promise<void> {
  45  |     await this.trigger().click();
  46  |     await expect(
  47  |       this.page.getByRole('heading', { name: /Alterar seu perfil/i }),
  48  |     ).toBeVisible();
  49  |   }
  50  | 
  51  |   async getCurrentProfile(): Promise<string> {
> 52  |     const text = (await this.trigger().innerText()).trim();
      |                                        ^ TimeoutError: locator.innerText: Timeout 30000ms exceeded.
  53  |     const first = text.split(/\s+/)[0] ?? '';
  54  |     return first.replace(/[^A-Za-zÀ-ÿ]/g, '');
  55  |   }
  56  | 
  57  |   /**
  58  |    * Cleanup teardown: reverte para Administrador se necessário.
  59  |    * No-op quando o teste foi skipped (page nunca navegou) — evita timeout
  60  |    * tentando ler o trigger numa página `about:blank`.
  61  |    */
  62  |   async revertToAdminSafe(): Promise<void> {
  63  |     if (this.page.url() === 'about:blank') return;
  64  |     const triggerVisible = await this.trigger().isVisible().catch(() => false);
  65  |     if (!triggerVisible) return;
  66  |     if ((await this.getCurrentProfile()) === 'Administrador') return;
  67  |     await this.switchToViaUrl('Administrador');
  68  |   }
  69  | 
  70  |   /**
  71  |    * Switch via UI (click no popover). Use quando o spec testa o popover.
  72  |    * Para todos os outros casos, prefira `switchToViaUrl` (mais rápido e robusto).
  73  |    */
  74  |   async switchTo(profile: ProfileName): Promise<void> {
  75  |     if ((await this.getCurrentProfile()) === profile) return;
  76  |     await this.open();
  77  |     await this.page.locator(`.${PROFILE_LINK_CLASS[profile]}`).click();
  78  |     await this.page.waitForLoadState('domcontentloaded');
  79  |     await dismissCommonModals(this.page);
  80  |     await expect(this.trigger()).toContainText(profile);
  81  |   }
  82  | 
  83  |   /**
  84  |    * Switch via URL (atalho — não passa pelo popover).
  85  |    *
  86  |    * - Aluno → `/dashboard_students` (default landing pro perfil Aluno).
  87  |    * - Administrador → `/o/{orgId}/events?tab=events&profile=admin`.
  88  |    * - Demais perfis caem no popover (rota direta não documentada).
  89  |    */
  90  |   async switchToViaUrl(profile: ProfileName): Promise<void> {
  91  |     if (profile === 'Aluno') {
  92  |       await this.page.goto('/dashboard_students', { waitUntil: 'domcontentloaded' });
  93  |     } else if (profile === 'Administrador') {
  94  |       await this.page.goto(`/o/${this.getOrg()}/events?tab=events&profile=admin`, {
  95  |         waitUntil: 'domcontentloaded',
  96  |       });
  97  |     } else {
  98  |       await this.switchTo(profile);
  99  |       return;
  100 |     }
  101 |     await dismissCommonModals(this.page);
  102 |     await expect(this.trigger()).toContainText(profile);
  103 |   }
  104 | }
  105 | 
```