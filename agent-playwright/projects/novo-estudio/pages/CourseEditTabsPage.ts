import type { Page, Locator } from '@playwright/test';
import { safeGoto, dismissCommonModals } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Abas da tela "Editar curso" — QA 1.3 (Artia 19707, RN 3: reordenar/persistir
 * abas por usuário, renomear "Gerenciar"/"Editar").
 *
 * Recon 2026-06-05 (org 37061): abas são Chakra tabs SEM atributos de drag
 * (draggable/aria-roledescription nulos); kebab da listagem mostra "Editar".
 */
export class CourseEditTabsPage {
  constructor(private readonly page: Page) {}

  async gotoListagem(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events`);
    await dismissCommonModals(this.page);
  }

  async gotoEdit(courseId: number | string, tab?: string): Promise<void> {
    const sufixo = tab ? `?tab=${tab}` : '';
    await safeGoto(this.page, `/o/${getOrgId()}/contents/${courseId}/edit${sufixo}`);
    await dismissCommonModals(this.page);
  }

  // --- listagem -------------------------------------------------------------
  kebabDoCurso(courseId: number | string): Locator {
    return this.page.getByTestId(`events-${courseId}-actions-kebab`);
  }

  async abrirKebab(courseId: number | string): Promise<void> {
    await this.kebabDoCurso(courseId).click();
    await this.page.waitForTimeout(800);
  }

  /** Itens VISÍVEIS do kebab aberto (o DOM duplica menus ocultos por linha). */
  async itensVisiveisDoKebab(): Promise<string[]> {
    return this.page.evaluate(() =>
      Array.from(document.querySelectorAll('[role="menuitem"], .chakra-menu__menuitem'))
        .filter((el) => {
          const r = el.getBoundingClientRect();
          const cs = getComputedStyle(el);
          return r.width > 0 && cs.visibility !== 'hidden';
        })
        .map((el) => (el.textContent || '').trim()));
  }

  // --- abas ------------------------------------------------------------------
  tab(testId: string): Locator {
    // :visible — o DOM duplica as abas (desktop/mobile); .first() cru pega a oculta
    return this.page.locator(`[data-test-id="tab-${testId}"]:visible`).first();
  }

  async ordemDasAbas(): Promise<string[]> {
    return this.page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-test-id^="tab-"]'))
        .filter((el) => el.getBoundingClientRect().width > 5)
        .map((el) => el.getAttribute('data-test-id') as string));
  }

  async abaAtiva(): Promise<string | null> {
    return this.page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('[data-test-id^="tab-"]'))
        .find((t) => t.getAttribute('aria-selected') === 'true');
      return el ? el.getAttribute('data-test-id') : null;
    });
  }

  /** Ícone de drag dentro da aba (esperado pela AT no hover). */
  async iconeDeDragNaAba(testId: string): Promise<number> {
    await this.tab(testId).hover();
    await this.page.waitForTimeout(700);
    return this.tab(testId).evaluate((el) =>
      el.querySelectorAll('svg, [class*="drag"], [data-icon]').length);
  }

  /**
   * Drag manual com ativação de sensor dnd (pequeno movimento antes do alvo).
   * `dragTo` do Playwright costuma no-op em libs de sortable — daí o mouse cru.
   */
  async arrastarAba(fromTid: string, toTid: string): Promise<void> {
    const a = await this.tab(fromTid).boundingBox();
    const b = await this.tab(toTid).boundingBox();
    if (!a || !b) throw new Error(`boundingBox nulo no drag ${fromTid}→${toTid}`);
    const sx = a.x + a.width / 2;
    const sy = a.y + a.height / 2;
    await this.page.mouse.move(sx, sy);
    await this.page.mouse.down();
    await this.page.mouse.move(sx + 8, sy, { steps: 3 });
    await this.page.waitForTimeout(300);
    await this.page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 15 });
    await this.page.waitForTimeout(300);
    await this.page.mouse.up();
    await this.page.waitForTimeout(2000);
  }

  // --- aba Identificação (TC9/TC10) ------------------------------------------
  campoNome(): Locator {
    // form da Identificação no edit React (input duplicado oculto → :visible)
    return this.page.locator('input[name="name"]:visible').first();
  }

  botaoSalvar(): Locator {
    return this.page.locator('button:visible').filter({ hasText: /^Salvar$/ }).first();
  }

  /**
   * "Tipo de experiência" é obrigatório e vem VAZIO no curso seed da org —
   * sem preencher, o Salvar é barrado por validação client-side (sem request,
   * sem toast). Descoberto via Network probe 2026-06-05.
   */
  async garantirTipoDeExperiencia(): Promise<void> {
    // react-select: container #learningExperience + input[role=combobox]
    const container = this.page.locator('#learningExperience:visible').first();
    if (!(await container.count())) return;
    // se já tem valor selecionado, o placeholder some
    const temPlaceholder = await container
      .locator('[id$="-placeholder"]')
      .isVisible()
      .catch(() => false);
    if (!temPlaceholder) return;
    const combo = container.locator('input[role="combobox"]').first();
    await combo.click();
    await combo.fill('Curso');
    await this.page.waitForTimeout(1000);
    const opcao = this.page.locator('[role="option"]:visible').filter({ hasText: /Curso/ }).first();
    if (await opcao.count()) {
      await opcao.click();
    } else {
      await this.page.keyboard.press('Enter');
    }
    await this.page.waitForTimeout(500);
  }

  mensagemDeValidacao(): Locator {
    return this.page.getByText(/é obrigatório/i).first();
  }

  toastDeSucesso(): Locator {
    return this.page.locator('[role="status"], .chakra-toast, [role="alert"]')
      .filter({ hasText: /salv|sucesso/i }).first();
  }

  modalDeConfirmacao(): Locator {
    return this.page.locator('[role="dialog"], [role="alertdialog"]')
      .filter({ hasText: /não salvas|descartar|alterações|sair/i }).first();
  }

  // --- QA 1.4: seções e campos para IA na Identificação -----------------------
  /** Cabeçalhos de seção visíveis do form da Identificação. */
  async cabecalhosDeSecao(): Promise<string[]> {
    return this.page.evaluate(() =>
      Array.from(document.querySelectorAll('h2, h3, h4'))
        .filter((el) => el.getBoundingClientRect().width > 5)
        .map((el) => (el.textContent || '').trim())
        .filter(Boolean));
  }

  /** Campos da seção "Público" usados pela IA (inputs livres, maxlength 250). */
  campoIa(nome: 'target_audience' | 'age' | 'difficulty' | 'tone_of_voice'): Locator {
    const ids = {
      target_audience: 'identification-publico-target-audience-input',
      age: 'identification-publico-age-input',
      difficulty: 'identification-publico-difficulty-input',
      tone_of_voice: 'identification-publico-tone-of-voice-input',
    } as const;
    return this.page.locator(`#${ids[nome]}:visible`).first();
  }
}
