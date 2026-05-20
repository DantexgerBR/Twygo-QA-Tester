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
}
