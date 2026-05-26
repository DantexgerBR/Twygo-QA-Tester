import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';

export class ListagemAtividadesPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async abrirListagem(eventoId: number): Promise<void> {
    await safeGoto(this.page, `/e/${eventoId}/contents`);
  }

  getLinhaAtividade(atividadeId: number): Locator {
    return this.page.locator(`li.dd-item[data-id="${atividadeId}"]`);
  }

  async clonarAtividade(atividadeId: number): Promise<void> {
    const linha = this.getLinhaAtividade(atividadeId);
    await expect(linha).toBeVisible();

    const botaoCopiar = linha.locator('[data-action*="copy"], [title*="opiar"], [aria-label*="opiar"]').first();
    await botaoCopiar.click();
    await expect(this.page.getByText(/copiado|duplicado|criado/i).first()).toBeVisible({
      timeout: 15_000,
    });
  }

  async obterIdUltimaAtividadeCriada(eventoId: number, nomeBase: string): Promise<number> {
    await this.abrirListagem(eventoId);
    const items = await this.page
      .locator('li.dd-item[data-id]')
      .filter({ hasText: nomeBase })
      .all();

    if (items.length === 0) throw new Error(`Nenhuma atividade com nome "${nomeBase}" encontrada`);

    const ids = await Promise.all(
      items.map((item) => item.getAttribute('data-id').then((v) => parseInt(v ?? '0', 10))),
    );
    return Math.max(...ids);
  }
}
