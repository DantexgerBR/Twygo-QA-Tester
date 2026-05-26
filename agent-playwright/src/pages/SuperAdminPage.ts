import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

/**
 * SuperAdmin (Twygo) — área administrativa global em `/admin`.
 *
 * Pré-requisito: usuário precisa estar logado E em perfil "Administrador" na
 * organização (storageState do globalSetup já cobre, contanto que o user do
 * `environment.json` tenha esse acesso). A navegação /admin não exige troca
 * de UI — basta acessar a rota direto.
 *
 * Caminhos canônicos (validados em 2026-05-05 com o usuário):
 * - `/admin` — entrada do Super Admin
 * - `/admin/subscription_plans` — Manutenção da tabela de preços
 *   (na lista, identifique a tabela com coluna "Ativo" = sim e clique em
 *   "Editar" — só pode haver UMA tabela ativa por vez)
 * - `/admin/edit_sys_subscription_settings/{orgId}` — edição direta do
 *   contrato vigente da organização. orgId em environment.json
 *   (`staging.orgId = 36602`, `staging-without-credits.orgId = 36912`).
 *
 * Use sempre os helpers de URL desta classe — não invente caminhos.
 */
export class SuperAdminPage extends BasePage {
  readonly path = '/admin';

  readonly subscriptionMenu: Locator;
  readonly maintainPriceTablesLink: Locator;
  readonly maintainSubscriptionsLink: Locator;
  readonly orgSearchInput: Locator;

  constructor(page: Page) {
    super(page);
    this.subscriptionMenu = page.getByRole('link', { name: /assinaturas?/i });
    this.maintainPriceTablesLink = page.getByRole('link', {
      name: /manuten[çc][ãa]o\s+da\s+tabela\s+de\s+pre[çc]os/i,
    });
    this.maintainSubscriptionsLink = page.getByRole('link', {
      name: /manuten[çc][ãa]o\s+de\s+assinaturas?/i,
    });
    this.orgSearchInput = page.getByPlaceholder(/pesquisa|buscar|nome.*organiza/i);
  }

  /**
   * Acessa /admin direto via URL. Se sessão for válida (storageState global +
   * perfil Administrador), o app carrega o layout do Super Admin imediatamente.
   */
  async openSuperAdmin(): Promise<void> {
    await this.page.goto('/admin');
    await this.waitForReady();
  }

  /**
   * Navega direto para a edição da tabela de preços ativa. Hoje (2026-05-05)
   * o caminho documentado é via UI (Assinaturas > Manutenção da tabela de
   * preços > coluna Ativo > botão Editar), mas o atalho `/admin/subscription_plans`
   * já abre a listagem; cada teste decide se quer iterar pela tabela ativa
   * ou ir direto via deep-link conhecido.
   */
  async openSubscriptionPlans(): Promise<void> {
    await this.page.goto('/admin/subscription_plans');
    await this.waitForReady();
  }

  /**
   * Edita o contrato vigente de uma organização específica via URL direta.
   * O orgId vem de `environment.json[env].orgId` ou
   * `environment.json[env].superAdmin.editContractPath`.
   */
  async openEditContract(orgId: string | number): Promise<void> {
    await this.page.goto(`/admin/edit_sys_subscription_settings/${orgId}`);
    await this.waitForReady();
  }

  /**
   * Em `/admin/subscription_plans`, clica em "Editar" da tabela de preços
   * marcada como "Ativo = Sim". Pode haver apenas UMA tabela ativa por banco.
   * Após o click, navega para o form da tabela ativa (rota interna admin).
   */
  async openActivePriceTable(): Promise<void> {
    await this.openSubscriptionPlans();
    // A row ativa é a única que contém o texto " Sim " (com word boundary).
    // Ignora a header (sem 'Sim') e as inativas (que têm 'Não').
    const activeRow = this.page.getByRole('row', { name: /\bSim\b/ }).first();
    await activeRow.waitFor({ state: 'visible', timeout: 15_000 });
    // Botão "Editar" é um <div role="generic"> (não link/button). getByText
    // com exact captura só "Editar" sem casar com header/coluna.
    await activeRow.getByText('Editar', { exact: true }).first().click();
    // Confirmação obrigatória: dialog "Atenção - Ao editar uma tabela de
    // preços as alterações serão aplicadas a todos as organizações...".
    // O dialog não tem accessible-name padrão. Esperamos o texto "Atenção"
    // ficar visível e clicamos o botão Sim adjacente.
    await this.page.getByText(/aten[çc][ãa]o/i).first().waitFor({ state: 'visible', timeout: 10_000 });
    // Botão Sim do dialog de confirmação. Tem múltiplos botões "Sim" possíveis
    // na página (menus laterais não, mas safety). Limita ao container do dialog
    // (Bootstrap usa `.modal`/`[role=dialog]`). Como o getByRole('button')
    // não resolve o accessible name aqui, usa CSS+text direto.
    const dialogYes = this.page.locator(
      '[role="dialog"] button:has-text("Sim"), .modal button:has-text("Sim"), .modal-dialog button:has-text("Sim")',
    ).first();
    await dialogYes.click({ force: true });
    // Após confirmar, a navegação leva ao form da tabela ativa. Aguarda
    // o texto "Atenção" sumir antes de prosseguir.
    await this.page.getByText(/aten[çc][ãa]o/i).first().waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => null);
    await this.waitForReady();
  }

  /**
   * Navega via UI: Assinaturas > Manutenção de assinaturas > Pesquisar por
   * nome/ID > Editar/Visualizar > Aba "Contratos" > Editar contrato vigente.
   * Use quando o teste precisa validar a UI de busca; caso contrário prefira
   * `openEditContract(orgId)`.
   */
  async navigateToOrgSubscriptions(orgIdOrName: string | number): Promise<void> {
    await this.openSuperAdmin();
    await this.subscriptionMenu.click();
    await this.maintainSubscriptionsLink.click();
    await this.waitForReady();
    await this.orgSearchInput.fill(String(orgIdOrName));
    await this.page.keyboard.press('Enter');
  }

  /**
   * Ativa/desativa uma funcionalidade no contrato Vigente da org.
   *
   * Fluxo:
   *  1. Abre `/admin/edit_sys_subscription_settings/<orgId>`
   *  2. Click na aba/seção "Contratos"
   *  3. Localiza row do contrato Vigente + click "Editar"
   *     (`button#edit-contract-<contractId>`)
   *  4. Toggle do `<input id="<featureName>">` (idempotente — no-op se
   *     já está no estado desejado)
   *  5. Chama `window.ContractOrganization.toogleFunctionality(featureName)`
   *     manualmente (handler global Twygo) — sem isso, save submete payload
   *     incompleto e estado não persiste
   *  6. Click `button.save-form-button` visível
   *  7. Aguarda reload e confirma persistência re-abrindo edit
   *
   * Retorna `true` se mudou estado, `false` se já estava no estado desejado.
   *
   * Ver skill `alterar-funcionalidade-contrato-twygo` para detalhes.
   */
  async setContractFunctionality(
    orgId: string | number,
    featureName: string,
    enabled: boolean,
  ): Promise<{ changed: boolean; wasEnabled: boolean }> {
    await this.openEditContract(orgId);

    // Aba Contratos é um <a id="org_contracts" class="tab_selector"> sem
    // href. Página tem ID duplicado (`<a>` clicável + `<div>` painel da
    // tab, ambos `id="org_contracts"`) — qualificar com tag pra evitar
    // strict-mode violation. Validado live 2026-05-15.
    await this.page.locator('a#org_contracts.tab_selector').click();

    // Row do contrato Vigente — texto "Vigente" identifica. Pega button#edit-contract-X.
    const vigenteEditBtn = this.page
      .locator('tr')
      .filter({ hasText: 'Vigente' })
      .locator('button[id^="edit-contract-"].edit-contract-button')
      .first();
    await vigenteEditBtn.waitFor({ state: 'visible', timeout: 10_000 });
    await vigenteEditBtn.click();

    // Aguarda o form Editar renderizar o checkbox (attached é OK — o
    // multiselect colapsa o componente, mas o input fica no DOM).
    await this.page
      .locator(`input#${featureName}`)
      .waitFor({ state: 'attached', timeout: 15_000 });

    // Form inline carrega. Checkbox da feature fica DENTRO de um multiselect
    // custom (`.functionality-checkboxes`) colapsado por default — não é
    // visível ao Playwright. Mas o handler global do Twygo aceita toggle
    // via JS direto. Consolidamos toggle+handler+save em UM evaluate.
    //
    // Validado: form.submit() programático NÃO persiste (anti-pattern A).
    // Precisamos do click() no `button.save-form-button` real (dentro do
    // form de contrato), que dispara validação JS + monta payload completo.
    const result = await this.page.evaluate(
      ({ name, desired }) => {
        const cb = document.getElementById(name) as HTMLInputElement | null;
        if (!cb) return { ok: false as const, error: `checkbox #${name} not found` };
        if (cb.disabled) {
          return { ok: false as const, error: `checkbox #${name} disabled (fixed by plan template)` };
        }
        const wasChecked = cb.checked;
        if (wasChecked === desired) {
          return { ok: true as const, changed: false, wasChecked };
        }
        cb.click();
        const w = window as unknown as { ContractOrganization?: { toogleFunctionality: (n: string) => void } };
        w.ContractOrganization?.toogleFunctionality(name);
        // Save button DENTRO do form de contrato. Há múltiplos no DOM —
        // pegar pelo form ancestor garante.
        const form = document.getElementById('organization-contract-form') as HTMLFormElement | null;
        if (!form) return { ok: false as const, error: 'organization-contract-form not found' };
        const saveBtn = form.querySelector<HTMLButtonElement>('button.save-form-button');
        if (!saveBtn) return { ok: false as const, error: 'save button not found in contract form' };
        saveBtn.click();
        return { ok: true as const, changed: true, wasChecked };
      },
      { name: featureName, desired: enabled },
    );

    if (!result.ok) {
      throw new Error(`setContractFunctionality: ${result.error}`);
    }
    if (!result.changed) {
      return { changed: false, wasEnabled: result.wasChecked };
    }

    await this.page.waitForLoadState('load', { timeout: 15_000 });
    return { changed: true, wasEnabled: result.wasChecked };
  }
}
