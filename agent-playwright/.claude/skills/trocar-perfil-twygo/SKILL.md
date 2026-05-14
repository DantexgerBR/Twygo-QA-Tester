---
name: trocar-perfil-twygo
description: Como alternar entre perfis Twygo (Administrador / Aluno / Colaborador / Instrutor / Gestor) em specs Playwright. O switch é uma navegação client-side via popover de perfil no canto superior direito — não exige credencial nova nem storageState secundário. Use sempre que um TC exigir validar visão Aluno (dashboard de aluno, widgets, listagem de cursos visíveis ao aluno) ou outra persona, e nunca marque `test.fixme` por "falta credencial do perfil X" sem antes verificar o switch UI.
version: 1.0.0
---

# trocar-perfil-twygo

## Quando usar

Sempre que o TC exigir interagir com o app numa persona ≠ Administrador (Aluno, Colaborador, Instrutor, Gestor). Twygo **não** usa credenciais separadas por persona — o mesmo usuário admin acessa todos os perfis via popover. Generator/healer que marcam `test.fixme(true, 'seed ausente: requer credencial Aluno')` estão errados: o caminho UI existe.

Caso real (2026-05-14): suite "Dashboard - Visão do aluno" (8 TCs) toda marcada fixme por "credencial aluno faltando". Investigação live revelou que o user padrão `claude@teste.com` no `staging-widgets` já chega logado em `/dashboard_students` com os widgets visíveis — switch via popover é o único passo necessário.

## Mecânica do switch

Recon live em `https://widgets.stage.twygoead.com/dashboard_students` (2026-05-14):

1. **Botão trigger** (canto superior direito):
   - `role="button"`, name = nome do perfil atual (`Aluno`/`Administrador`/`Colaborador`/`Instrutor`/`Gestor`)
   - Class CSS estável: `.menu-target` (sempre presente, independente do perfil)
   - Class adicional segue o perfil: `.btn-aluno.menu-target`, `.btn-admin.menu-target`
   - **Sem `data-test-id`**

> ⚠ **Atenção ao selector**: a classe `.menu-target` é usada também pelo link "Dashboard" do sidebar (`<a class="menu-target" id="dashboard-menu">`). Sempre qualificar com `button.menu-target` para isolar o trigger de perfil. `.menu-target` puro casa múltiplos elementos.

2. **Após click**, abre popover com heading `"Perfil — Alterar seu perfil"` contendo os perfis disponíveis como `<a>`:
   - `<a class="new-item-admin">manage_accounts Administrador</a>` → `href=/o/{orgId}/events?tab=events&profile=admin`
   - `<a class="new-item-aluno">school Aluno</a>` → `href=/`
   - (Colaborador / Instrutor / Gestor seguem padrão `.new-item-<persona>` quando habilitados na org)

3. **Após click no perfil alvo**:
   - Browser navega para o `href` do link.
   - Aluno → `/` redireciona para `/dashboard_students`.
   - Admin → `/o/{orgId}/events?tab=events&profile=admin`.
   - Trigger atualiza o name pro novo perfil.

## Atalho: navegação direta por URL

Pra specs que **não** estão testando o popover em si (a maioria), pode pular a UI e navegar direto:

```ts
// Switch para Aluno
await page.goto('/dashboard_students');
await expect(page.getByRole('button', { name: /^Aluno/ })).toBeVisible();

// Switch para Administrador
await page.goto(`/o/${getOrgId()}/events?tab=events&profile=admin`);
await expect(page.getByRole('button', { name: /^Administrador/ })).toBeVisible();
```

Sempre **assertar o trigger** depois pra garantir que o switch propagou (o app pode redirecionar pra outro caminho se o perfil estiver desabilitado).

## Helper canônico (POM)

Criar `src/pages/ProfileSwitcher.ts` com fluxo via UI (cobre o caso E2E do popover):

```ts
import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { dismissCommonModals } from '../utils/modals.js';
import { getOrgId } from '../utils/environment.js';

export type ProfileName = 'Administrador' | 'Aluno' | 'Colaborador' | 'Instrutor' | 'Gestor';

const PROFILE_CLASS: Record<ProfileName, string> = {
  Administrador: 'new-item-admin',
  Aluno: 'new-item-aluno',
  Colaborador: 'new-item-collaborator',
  Instrutor: 'new-item-instructor',
  Gestor: 'new-item-manager',
};

export class ProfileSwitcher {
  constructor(private readonly page: Page) {}

  private trigger(): Locator {
    return this.page.locator('button.menu-target');
  }

  /** Abre o popover de perfis. */
  async open(): Promise<void> {
    await this.trigger().click();
    await expect(this.page.getByRole('heading', { name: /Alterar seu perfil/i })).toBeVisible();
  }

  /** Retorna o nome do perfil ativo conforme label do trigger. */
  async getCurrentProfile(): Promise<ProfileName | string> {
    return (await this.trigger().innerText()).split(/\s/)[0]?.trim() ?? '';
  }

  /** Switch via UI (click no popover). Use quando o spec testa o popover em si. */
  async switchTo(profile: ProfileName): Promise<void> {
    if ((await this.getCurrentProfile()) === profile) return;
    await this.open();
    await this.page.locator(`.${PROFILE_CLASS[profile]}`).click();
    await this.page.waitForLoadState('domcontentloaded');
    await dismissCommonModals(this.page);
    await expect(this.trigger()).toHaveText(new RegExp(`^${profile}`));
  }

  /** Switch via URL (atalho — não passa pelo popover). */
  async switchToViaUrl(profile: ProfileName): Promise<void> {
    const url = profile === 'Aluno'
      ? '/dashboard_students'
      : `/o/${getOrgId()}/events?tab=events&profile=admin`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    await dismissCommonModals(this.page);
    await expect(this.trigger()).toHaveText(new RegExp(`^${profile}`));
  }
}
```

## Template de spec

```ts
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';

test.describe('Dashboard - Visão do aluno', () => {
  test.afterEach(async ({ page }) => {
    const switcher = new ProfileSwitcher(page);
    if ((await switcher.getCurrentProfile()) !== 'Administrador') {
      await switcher.switchToViaUrl('Administrador');
    }
  });

  test('Renderizar widget Ranking para o aluno', async ({ page }) => {
    const switcher = new ProfileSwitcher(page);
    await switcher.switchToViaUrl('Aluno');

    await expect(page.getByRole('heading', { name: 'Ranking' })).toBeVisible();
    // ... demais asserções
  });
});
```

## Anti-patterns

❌ **`test.fixme(true, 'seed ausente: requer credencial Aluno')`** — falta credencial NÃO é justificativa quando o switch UI existe. Cai em Anti-pattern F do `CLAUDE.md §7.6`.

❌ **storageState secundário pra Aluno** (`outputs/.auth/storage-aluno.json`) — não existe e não faz sentido; mesmo user, perfis diferentes via popover.

❌ **`page.click('button:has-text("Aluno")')`** sem qualificar — match em qualquer botão com texto Aluno. Use `.menu-target` ou `getByRole('button', { name: /^Aluno/ })`.

❌ **Esquecer reverter pra Admin no `afterEach`/`afterAll`** — próximo TC herda perfil Aluno e quebra cleanup admin (`deletePanelByNameSafe` etc.). Sempre reverter via `switchToViaUrl('Administrador')` no teardown.

❌ **Hardcode `https://widgets.stage.twygoead.com/dashboard_students`** no spec. Use `page.goto('/dashboard_students')` — `baseURL` resolve.

## Gotchas

1. **Perfil é runtime, não storageState** — `storage.json` salva cookies + JWT, mas o perfil ativo é estado de URL/query. Cada `goto('/')` pode resetar pro default da org (usualmente Aluno se a conta não tem `/o/...` no caminho).

2. **Default landing depende da org** — `staging-widgets` (claude@teste.com) loga e cai em `/dashboard_students` (Aluno). Outras orgs podem cair em `/o/{orgId}/events` (Admin). Não assumir; sempre validar o trigger.

3. **Modais oportunistas continuam aparecendo** — NPS Sofia, banner sessão etc. Chamar `dismissCommonModals(page)` depois do switch (já incluso no helper).

4. **Botão trigger só aparece em viewport ≥ ~1024px** — em viewport mobile/narrow, o app esconde a barra superior. `playwright.config.ts` já roda em 1440x900 por padrão, mas specs com `test.use({ viewport: ... })` custom podem perder o trigger. Se precisar, force `await page.setViewportSize({ width: 1440, height: 900 })`.

5. **Perfil Colaborador/Instrutor/Gestor** — só aparece no popover quando habilitado no contrato/feature flag. Em orgs Trial pode estar ausente. Não assumir disponibilidade — `switchTo('Instrutor')` falha silencioso se o link `.new-item-instructor` não existir. Validar via `page.locator('.new-item-instructor').isVisible()` antes.

6. **Cleanup admin operations** — listagem de painéis, super admin, edição de contrato, criação de menu só funcionam em perfil Administrador. `beforeAll` que cria/seed → faz em Admin → spec entra em Aluno → `afterAll` reverte pra Admin → cleanup.

## Skills relacionadas

- [[fechar-modais-twygo]] — `dismissCommonModals` chamado depois do switch.
- [[limpar-dados-de-teste-twygo]] — cleanup admin pós-spec em Aluno.
- [[criar-spec-resiliente-twygo]] — asserções por invariante após switch.

## Quando criar um Page Object dedicado por persona

Se um spec faz **fluxos completos** numa persona (ex: aluno navega entre cursos, assiste vídeo, faz quiz), separe num `StudentDashboardPage.ts` para encapsular seletores de Aluno. `ProfileSwitcher` só cobre o ato de alternar — a interação dentro da persona vive em POM próprio.
