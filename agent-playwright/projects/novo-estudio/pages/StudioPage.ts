import type { Page, Locator } from '@playwright/test';
import { safeGoto, dismissCommonModals } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Estúdio de Criação (tela única em três colunas) — QA 1.2 (Artia 19706, RN 2).
 *
 * Rota real observada em recon (2026-06-05): /o/{org}/contents/{id}/edit?tab=studio
 * (a AT prevê "/o/{org}/events/:id/edit/studio", que retorna 404 — divergência
 * registrada no laudo). A aba tem test-id "tab-studio" com rótulo "Atividades".
 */
export class StudioPage {
  constructor(private readonly page: Page) {}

  /** Rota literal da AT — usada só pra registrar a divergência (404). */
  rotaAt(courseId: number | string): string {
    return `/o/${getOrgId()}/events/${courseId}/edit/studio`;
  }

  async gotoEstudio(courseId: number | string): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/contents/${courseId}/edit?tab=studio`);
    await dismissCommonModals(this.page);
  }

  async gotoEdit(courseId: number | string): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/contents/${courseId}/edit`);
    await dismissCommonModals(this.page);
  }

  // --- estrutura das 3 colunas -------------------------------------------
  shell(): Locator {
    return this.page.getByTestId('creation-studio-three-column-shell');
  }

  listaAtividades(): Locator {
    return this.page.getByTestId('creation-studio-activities-list');
  }

  tituloListaAtividades(): Locator {
    return this.page.getByTestId('creation-studio-activities-list-title');
  }

  /** Qualquer elemento da região de preview (prefixo creation-studio-preview). */
  preview(): Locator {
    return this.page.locator('[data-test-id^="creation-studio-preview"]').first();
  }

  // --- copiloto ------------------------------------------------------------
  copilotToggle(): Locator {
    return this.page.getByTestId('copilot-drawer-toggle');
  }

  copilotDrawer(): Locator {
    return this.page.getByTestId('copilot-drawer');
  }

  copilotClose(): Locator {
    return this.page.getByTestId('copilot-drawer-close');
  }

  /** Botão "Expandir" do drawer previsto na AT (não encontrado em recon). */
  copilotExpandir(): Locator {
    return this.page.getByRole('button', { name: /expandir/i });
  }

  async abrirCopiloto(): Promise<void> {
    if (await this.copilotDrawer().isVisible().catch(() => false)) return;
    await this.copilotToggle().click();
    await this.copilotDrawer().waitFor({ state: 'visible', timeout: 15_000 });
    // Espera o fim da animação de slide-in: boundingBox estável entre 2 leituras.
    // Sem isso, medições de largura/posição pegam o drawer no meio do caminho.
    let prevX = Number.NaN;
    for (let i = 0; i < 16; i++) {
      const box = await this.copilotDrawer().boundingBox();
      if (box && Math.abs(box.x - prevX) < 1) return;
      prevX = box?.x ?? Number.NaN;
      await this.page.waitForTimeout(250);
    }
  }

  async fecharCopiloto(): Promise<void> {
    await this.copilotClose().click();
    await this.copilotDrawer().waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => null);
  }

  /** Largura do locator como % da viewport (0-100). */
  async larguraPct(loc: Locator): Promise<number | null> {
    const box = await loc.boundingBox();
    const vw = this.page.viewportSize()?.width;
    if (!box || !vw) return null;
    return (box.width / vw) * 100;
  }

  // --- abas da edição de curso ----------------------------------------------
  tab(testId: string): Locator {
    return this.page.getByTestId(`tab-${testId}`);
  }

  /** Abas visíveis (rótulo textual) na página de edição. */
  async rotulosDasAbas(): Promise<string[]> {
    return this.page
      .locator('[data-test-id^="tab-"]')
      .evaluateAll((els) =>
        els
          .filter((el) => el.getBoundingClientRect().width > 5)
          .map((el) => (el.textContent || '').trim()),
      );
  }

  // --- menu lateral principal -----------------------------------------------
  /** Botão de colapsar o menu lateral principal pra ícones (AT TC5). */
  botaoColapsarMenu(): Locator {
    return this.page
      .locator('button[aria-label], [role="button"][aria-label]')
      .filter({ hasNot: this.page.locator('[data-test-id^="creation-studio"]') })
      .and(this.page.locator('[aria-label*="ecolher menu" i], [aria-label*="olapsar" i], [aria-label*="collapse" i]'));
  }

  /** Botão de ocultar o menu lateral inteiramente (AT TC6). */
  botaoOcultarMenu(): Locator {
    return this.page.locator(
      '[aria-label*="cultar menu" i], [aria-label*="sconder menu" i], [aria-label*="hide menu" i], [data-test-id*="sidebar-hide"], [data-test-id*="menu-hide"]',
    );
  }

  /** Overflow horizontal da página (asserções de resolução). */
  async temOverflowHorizontal(): Promise<boolean> {
    return this.page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 4,
    );
  }

  // --- QA 1.6: atividades (type-selector, edição, exclusão) -------------------
  botaoAdicionarAtividade(): Locator {
    return this.page.locator('[data-test-id="creation-studio-activity-add-button"]:visible').first();
  }

  /** Abre o type-selector e escolhe o tipo; retorna o id da atividade criada. */
  async criarAtividadeDoTipo(slugTipo: string): Promise<string> {
    await this.botaoAdicionarAtividade().click();
    await this.page.locator('[data-test-id="creation-studio-type-selector-drawer"]')
      .waitFor({ state: 'visible', timeout: 15_000 });
    await this.page.locator(`[data-test-id="creation-studio-type-selector-${slugTipo}"]:visible`).first().click();
    await this.page.waitForURL(/\/studio\/activities\/\d+\/edit/, { timeout: 20_000 });
    const m = this.page.url().match(/\/studio\/activities\/(\d+)\/edit/);
    if (!m) throw new Error(`não capturei o id da atividade criada (url: ${this.page.url()})`);
    return m[1];
  }

  cardAtividade(id: number | string): Locator {
    return this.page.locator(`[data-test-id="creation-studio-activity-card-${id}"]:visible`).first();
  }

  /** Tipo exibido no card da atividade (usa display_label quando customizado). */
  tipoNoCard(id: number | string): Locator {
    return this.cardAtividade(id).locator('[data-test-id="creation-studio-activity-card-type"]');
  }

  /** Seleciona o card e exclui a atividade (cleanup de rascunhos criados). */
  async excluirAtividade(id: number | string): Promise<void> {
    await this.cardAtividade(id).click();
    await this.page.waitForTimeout(1500);
    const excluir = this.page.locator('button[aria-label="Excluir"]:visible').first();
    await excluir.click();
    const confirmar = this.page
      .locator('[role="dialog"] button, [role="alertdialog"] button')
      .filter({ hasText: /excluir|confirmar|sim/i })
      .locator('visible=true')
      .first();
    await confirmar.click({ timeout: 10_000 }).catch(() => null);
    await this.cardAtividade(id).waitFor({ state: 'hidden', timeout: 15_000 }).catch(() => null);
  }
}
