import type { Page, Locator } from '@playwright/test';
import { safeGoto, dismissCommonModals } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

/**
 * Form de cadastro/edição de atividade do Estúdio — QA 1.6 (Artia 19710, RN 6:
 * renomear tipo e ícone por atividade).
 *
 * Recon 2026-06-05: rota /o/{org}/studio/activities/{id}/edit?type={t}&eventId={e}.
 * Campos: #creation-studio-activity-form-title (title), seção "Aparência" com
 * #activity-appearance-displayLabel-input (displayLabel, default = nome do tipo)
 * e icon picker [data-test-id="activity-appearance-icon-picker"] com opções
 * activity-appearance-icon-<google-icon>. Escolher um tipo no type-selector já
 * CRIA a atividade (rascunho) — specs precisam de cleanup.
 */
export class ActivityFormPage {
  constructor(private readonly page: Page) {}

  async gotoEditAtividade(activityId: number | string, type: string, eventId: number | string): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/studio/activities/${activityId}/edit?type=${type}&eventId=${eventId}`);
    await dismissCommonModals(this.page);
  }

  campoTitle(): Locator {
    return this.page.locator('#creation-studio-activity-form-title:visible').first();
  }

  campoDisplayLabel(): Locator {
    return this.page.locator('#activity-appearance-displayLabel-input:visible').first();
  }

  iconPicker(): Locator {
    return this.page.locator('[data-test-id="activity-appearance-icon-picker"]:visible').first();
  }

  opcaoDeIcone(nome: string): Locator {
    return this.page.locator(`[data-test-id="activity-appearance-icon-${nome}"]:visible`).first();
  }

  async opcoesDeIcone(): Promise<string[]> {
    return this.page.evaluate(() =>
      Array.from(document.querySelectorAll('[data-test-id^="activity-appearance-icon-"]'))
        .filter((el) => el.getBoundingClientRect().width > 0)
        .map((el) => (el.getAttribute('data-test-id') || '').replace('activity-appearance-icon-', ''))
        .filter((t) => t !== 'picker'));
  }

  botaoSalvar(): Locator {
    return this.page.locator('button:visible').filter({ hasText: /^Salvar$/ }).first();
  }

  toastDeSucesso(): Locator {
    return this.page.locator('[role="status"], .chakra-toast, [role="alert"]')
      .filter({ hasText: /salv|sucesso/i }).first();
  }

  mensagemObrigatorio(): Locator {
    return this.page.getByText(/obrigatóri/i).first();
  }
}
