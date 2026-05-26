import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

export class ContentModelsListPage {
  constructor(private readonly page: Page) {}

  // CLAUDE.md §7.5: /play vai pra aluno; admin context exige /o/{orgId}/dashboard.
  async gotoPlay(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/dashboard`);
  }

  async goToList(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
  }

  // Aprendizagem é <a id="learning"> sem href — dispatchEvent contorna actionability.
  // Sidebar duplica items (mobile+desktop), escopar com #menu.
  async openAprendizagemMenu(): Promise<void> {
    await this.page.locator('#menu a#learning').dispatchEvent('click');
  }

  async goToModelosFromMenu(): Promise<void> {
    await this.page.locator('#menu a#content_models').click();
  }

  async expectListingLoaded(): Promise<void> {
    await expect(this.page.getByTestId('content-models-page')).toBeVisible({
      timeout: 60_000,
    });
    await expect(
      this.page.getByRole('heading', { name: 'Modelos de conteúdo' }),
    ).toBeVisible({ timeout: 60_000 });
  }

  // Botão Adicionar (#content-models-add-button) — redireciona pra /content_models/new
  addButton(): Locator {
    return this.page.locator('#content-models-add-button');
  }

  async clickAdd(): Promise<void> {
    await this.addButton().click();
  }

  // Input de busca por nome (placeholder "Pesquise aqui pelo nome do modelo")
  searchInput(): Locator {
    return this.page.locator('#play-interest-search');
  }

  async searchByName(name: string): Promise<void> {
    await this.searchInput().fill(name);
    // SPA debounce — espera resultado estabilizar
    await this.page.waitForTimeout(800);
  }

  async clearSearch(): Promise<void> {
    await this.searchInput().fill('');
    await this.page.waitForTimeout(800);
  }

  // Toggles de visualização — spans com IDs (não buttons).
  // Quando ativo, classe muda (#grid-view-icon = css-g7ay74 ativo, css-15de166 inativo).
  gridViewIcon(): Locator {
    return this.page.locator('#grid-view-icon');
  }

  listViewIcon(): Locator {
    return this.page.locator('#list-icon');
  }

  async switchToListView(): Promise<void> {
    // Click via dispatchEvent — span clicável sem role=button
    await this.listViewIcon().dispatchEvent('click');
    await this.page.waitForTimeout(800);
  }

  async switchToCardsView(): Promise<void> {
    await this.gridViewIcon().dispatchEvent('click');
    await this.page.waitForTimeout(800);
  }

  // Cards individuais: cada card tem <p class="chakra-text css-1mjnzuf">{nome}</p>
  // No estado atual, ID interno é #content_models-{id}-... — usar nome como ancora.
  cardByName(name: string): Locator {
    // Container do card é o ancestor mais próximo que tem o p.css-1mjnzuf com o nome
    return this.page
      .locator('[data-test-id="content-models-page"] p.css-1mjnzuf')
      .filter({ hasText: name })
      .locator('xpath=ancestor::div[contains(@class, "css-fuvrtk")][1]');
  }

  // Todos cards visíveis (heurística: container de card = .css-fuvrtk dentro do listing)
  allCards(): Locator {
    return this.page.locator('[data-test-id="content-models-page"] .css-fuvrtk');
  }

  // Asserção genérica: pelo menos N cards renderizados (invariante por count exato)
  async expectAtLeastNCards(n: number): Promise<void> {
    const count = await this.allCards().count();
    expect(count, `esperava ao menos ${n} cards, encontrei ${count}`).toBeGreaterThanOrEqual(n);
  }

  // Visão Lista — column headers reais da UI (AT documentou "Nome do provedor"
  // mas a coluna real é "Provedor"; coluna Ações não tem header textual).
  expectedListColumns = [
    'Nome',
    'Descrição',
    'Provedor',
    'Designs',
    'Aplicação',
    'Situação',
    'Atualizado em',
  ];

  async expectListColumnsVisible(): Promise<void> {
    for (const col of this.expectedListColumns) {
      await expect(
        this.page.getByRole('columnheader', { name: col }),
      ).toBeVisible({ timeout: 10_000 });
    }
  }

  // Drawer de filtros — segue padrão canônico documentado em
  // .claude/skills/testar-filtro-drawer-twygo. IDs do componente são
  // compartilhados entre listagens Twygo.
  filterButton(): Locator {
    return this.page.locator('#open-filter');
  }

  clearFilterButton(): Locator {
    return this.page.locator('#clear-filter');
  }

  async openFilterDrawer(): Promise<void> {
    // dispatchEvent contorna overlay invisível do chat widget HubSpot (bottom-right).
    await this.filterButton().dispatchEvent('click');
    await expect(
      this.page.locator('[role="dialog"].chakra-modal__content, .chakra-slide'),
    ).toBeVisible({ timeout: 10_000 });
  }

  // Idempotente: só clica se #clear-filter visível. Aguarda listagem reidratar
  // (spinner some + cards OU empty state aparece) — sem isso, próximo assert
  // pode rodar com listagem em loading.
  async clearFilter(): Promise<void> {
    const btn = this.clearFilterButton();
    if (await btn.isVisible().catch(() => false)) {
      await btn.dispatchEvent('click');
      await expect(btn).toHaveCount(0, { timeout: 5_000 });
      await this.waitForListReady();
    }
  }

  // Aguarda listagem terminar reidratação após mudança de filtro/busca.
  // Spinner Chakra é <div class="chakra-spinner">; some quando dados chegam.
  async waitForListReady(): Promise<void> {
    await this.page.locator('.chakra-spinner').waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => undefined);
    // Listagem renderizada: ou tem card OU empty state "Não há dados"
    await Promise.race([
      this.allCards().first().waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined),
      this.page.getByText('Não há dados para exibir').waitFor({ state: 'visible', timeout: 10_000 }).catch(() => undefined),
    ]);
  }

  // 4 filtros padrão de Modelos descobertos no recon ao vivo.
  // Confirma seleção via radio na ordem default-filters-{0,1,2,3}.
  defaultFilters = {
    'Modelos ativos': '#default-filters-0',
    'Modelos inativos': '#default-filters-1',
    'Modelos próprios': '#default-filters-2',
    'Modelos de terceiros': '#default-filters-3',
  } as const;

  async applyDefaultFilter(name: keyof typeof this.defaultFilters): Promise<void> {
    // Reabre drawer apenas se não estiver aberto (TC pode chamar openFilterDrawer antes)
    const drawerOpen = await this.page
      .locator('[role="dialog"].chakra-modal__content')
      .isVisible()
      .catch(() => false);
    if (!drawerOpen) await this.openFilterDrawer();
    const radioId = this.defaultFilters[name];
    await this.page.locator(`label.chakra-radio:has(${radioId})`).click();
    await this.page.locator('#list-filter-apply').dispatchEvent('click');
    await expect(this.clearFilterButton()).toBeVisible({ timeout: 10_000 });
  }

  // Asserção: drawer modo A (Lista de filtros) com os 4 filtros padrão de Modelos.
  async expectDefaultFiltersVisible(): Promise<void> {
    for (const label of Object.keys(this.defaultFilters)) {
      await expect(
        this.page.locator('.chakra-modal__content').getByText(label, { exact: true }),
      ).toBeVisible({ timeout: 5_000 });
    }
  }
}
