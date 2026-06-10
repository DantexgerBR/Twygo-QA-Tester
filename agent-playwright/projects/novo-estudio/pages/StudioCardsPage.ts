import type { Page, Locator } from '@playwright/test';
import { safeGoto, dismissCommonModals } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Página de seleção de tipo de conteúdo ("O que você quer criar?") do Novo
 * Estúdio de Criação — aberta pelo botão "Adicionar" da listagem de Conteúdos.
 * Rota observada em recon (2026-06-03): /o/{org}/studio
 */
export class StudioCardsPage {
  constructor(private readonly page: Page) {}

  async gotoConteudos(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events`);
    await dismissCommonModals(this.page);
  }

  /** Botão "+ Adicionar" da listagem (texto contém "Adicionar"). */
  botaoAdicionar(): Locator {
    return this.page.locator('button, a').filter({ hasText: 'Adicionar' }).first();
  }

  async clicarAdicionar(): Promise<void> {
    await this.botaoAdicionar().click();
    await this.page.waitForURL(/\/studio|\/events\/new/, { timeout: 20_000, waitUntil: 'domcontentloaded' });
    await dismissCommonModals(this.page);
  }

  async gotoPaginaCards(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/studio`);
    await dismissCommonModals(this.page);
  }

  headerPergunta(): Locator {
    return this.page.getByText('O que você quer criar?');
  }

  /** Primeiro match VISÍVEL de um texto exato (página pode duplicar nós ocultos). */
  private async matchVisivel(texto: string): Promise<Locator | null> {
    const candidatos = this.page.getByText(texto, { exact: true });
    const n = await candidatos.count();
    for (let i = 0; i < n; i++) {
      if (await candidatos.nth(i).isVisible().catch(() => false)) return candidatos.nth(i);
    }
    return null;
  }

  async tituloCardVisivel(titulo: string): Promise<boolean> {
    return (await this.matchVisivel(titulo)) !== null;
  }

  async boundingBoxTitulo(titulo: string): Promise<{ x: number; y: number } | null> {
    const el = await this.matchVisivel(titulo);
    if (!el) return null;
    const box = await el.boundingBox();
    return box ? { x: box.x, y: box.y } : null;
  }

  async clicarCard(titulo: string): Promise<void> {
    const el = await this.matchVisivel(titulo);
    if (!el) throw new Error(`Card "${titulo}" não está visível na página de seleção`);
    await el.click();
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('domcontentloaded').catch(() => null);
  }

  /**
   * Inspeção estrutural do card: localiza a descrição literal, sobe ao
   * container do card e verifica título + presença de ícone dentro dele.
   * Feita via DOM pra não depender de classes css-hash do Chakra.
   */
  async inspecionarCard(titulo: string, descricaoTrecho: string): Promise<{
    achouDescricao: boolean; tituloNoCard: boolean; temIcone: boolean;
  }> {
    return this.page.evaluate(
      ([tit, desc]) => {
        const all = Array.from(document.querySelectorAll('p, span, div'));
        const descEl = all.find((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (el.textContent || '').includes(desc) &&
            !(el.children.length > 3); // nó folha-ish, não um container gigante
        });
        if (!descEl) return { achouDescricao: false, tituloNoCard: false, temIcone: false };
        // sobe até o container que tem o título mas NÃO os outros títulos de card
        const outros = ['Curso', 'Trilha', 'Pacote'].filter((t) => t !== tit);
        let card: Element | null = descEl;
        for (let i = 0; i < 8 && card; i++) {
          const txt = card.textContent || '';
          if (txt.includes(tit) && !outros.some((o) => new RegExp(`(^|[^A-Za-zÀ-ú])${o}([^A-Za-zÀ-ú]|$)`).test(txt))) break;
          card = card.parentElement;
        }
        if (!card) return { achouDescricao: true, tituloNoCard: false, temIcone: false };
        const temIcone = !!card.querySelector('[data-icon], svg, img, [class*="material-symbols"]');
        return { achouDescricao: true, tituloNoCard: true, temIcone };
      },
      [titulo, descricaoTrecho] as const,
    );
  }

  /**
   * Conta dialogs/drawers realmente VISÍVEIS e RELEVANTES.
   * Exclui: nós ocultos, o widget de chat (HubSpot/Sophia, que carrega um
   * role=dialog pequeno no canto) e elementos minúsculos — um modal/drawer
   * de verdade ocupa área significativa da viewport.
   */
  async overlaysVisiveis(): Promise<number> {
    return this.page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="dialog"], [role="alertdialog"], .chakra-modal__content, .chakra-drawer__content'))
        .filter((el) => {
          // Popover (sininho de notificações etc.) NÃO é modal/drawer — fora do
          // escopo do TC10; Chakra também o mantém no DOM com visibility:hidden.
          if (el.classList.contains('chakra-popover__content')) return false;
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || cs.display === 'none' || Number(cs.opacity) === 0) return false;
          const r = el.getBoundingClientRect();
          if (r.width < 240 || r.height < 160) return false; // widget de chat/badges não são modal
          const idCls = `${el.id} ${el.className}`;
          if (/hubspot|sophia|chat/i.test(idCls)) return false;
          return true;
        }).length);
  }

  /** Overflow horizontal da página (pra asserções de responsividade). */
  async temOverflowHorizontal(): Promise<boolean> {
    return this.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 4);
  }
}
