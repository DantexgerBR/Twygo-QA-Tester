import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

export class ContentModelEditPage {
  constructor(private readonly page: Page) {}

  async gotoNew(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/content_models/new`);
    await this.expectIdentificationTabActive();
  }

  async gotoEdit(id: number | string): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/content_models/${id}/edit`);
    await this.expectIdentificationTabActive();
  }

  async expectIdentificationTabActive(): Promise<void> {
    const tab = this.page.locator('[data-test-id="tab-identification"]');
    await expect(tab).toBeVisible({ timeout: 30_000 });
    await expect(tab).toHaveAttribute('aria-selected', 'true');
  }

  // Inputs da aba Identificação
  nameInput(): Locator {
    return this.page.locator('#content-models-name-input');
  }

  descriptionTextarea(): Locator {
    return this.page.locator('#content-models-description-textarea');
  }

  kitDeMarcaInput(): Locator {
    // react-select; id estável do input interno
    return this.page.locator('#react-select-2-input');
  }

  // Switches (Chakra renderiza input hidden — interagir via label)
  usarComoPadraoLabel(): Locator {
    return this.page.locator('label[for="is_default"]');
  }

  usarDesignsSugeridosLabel(): Locator {
    return this.page.locator('label[for="use_suggested_designs"]');
  }

  ativoLabel(): Locator {
    return this.page.locator('label[for="situation"]');
  }

  usarComoPadraoChecked(): Promise<boolean> {
    return this.page.locator('#is_default').isChecked();
  }

  usarDesignsSugeridosChecked(): Promise<boolean> {
    return this.page.locator('#use_suggested_designs').isChecked();
  }

  ativoChecked(): Promise<boolean> {
    return this.page.locator('#situation').isChecked();
  }

  // Botões
  saveButton(): Locator {
    return this.page.locator('[data-test-id="content-models-identification-submit-button"]');
  }

  backButton(): Locator {
    return this.page.locator('#content-models-form-back-button');
  }

  // Salvar via JS click (botão fica no canto inferior direito, coberto pelo chat widget HubSpot).
  async save(): Promise<void> {
    const btn = this.saveButton();
    await btn.scrollIntoViewIfNeeded();
    await btn.evaluate((el: HTMLButtonElement) => el.click());
  }

  // Preenchimento Kit de marca via keyboard (dropdown react-select)
  async selectKitDeMarca(option?: string): Promise<void> {
    const input = this.kitDeMarcaInput();
    await input.focus();
    if (option) {
      await input.fill(option);
      await this.page.waitForTimeout(300);
    }
    await this.page.keyboard.press('ArrowDown');
    await this.page.waitForTimeout(200);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(300);
  }

  // Fluxo completo de criação (TC1 happy path)
  async fillIdentificationAndSave(opts: {
    nome: string;
    descricao?: string;
    kitDeMarca?: string;
  }): Promise<void> {
    await this.nameInput().fill(opts.nome);
    if (opts.descricao) {
      await this.descriptionTextarea().fill(opts.descricao);
    }
    await this.selectKitDeMarca(opts.kitDeMarca);
    await this.save();
  }

  // Badge "Dica" (só renderiza na criação — RN 9)
  dicaBadge(): Locator {
    return this.page.locator('[data-test-id="content-models-duplicate-tip-alert"]');
  }

  // Toast Chakra (sucesso/erro)
  toastSuccess(): Locator {
    return this.page.locator('.chakra-toast').filter({ hasText: /sucesso/i }).first();
  }

  // ─── Aba Estilo ───
  async gotoEditStyleTab(id: number | string): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/content_models/${id}/edit?tab=style`);
    await expect(this.page.locator('[data-test-id="tab-style"]')).toHaveAttribute(
      'aria-selected',
      'true',
      { timeout: 15_000 },
    );
  }

  // Abre edição do 1º modelo da listagem e troca pra aba style.
  // Mais robusto que hardcodar ID (que muda entre envs).
  async gotoFirstModelEditStyle(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
    await this.page.waitForTimeout(1500);
    const editIcon = this.page
      .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
      .first();
    await editIcon.evaluate((el: HTMLElement) => el.click());
    await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
    // Click tab style
    await this.page.locator('[data-test-id="tab-style"]').click();
    await expect(this.page.locator('[data-test-id="tab-style"]')).toHaveAttribute(
      'aria-selected',
      'true',
      { timeout: 10_000 },
    );
  }

  styleAddMoreDataButton(): Locator {
    return this.page.locator('[data-test-id="content-models-style-add-more-data-button"]');
  }

  styleAddOptionByTestId = {
    'Idade': 'content-models-style-add-style-age-range',
    'Dificuldade': 'content-models-style-add-style-difficulty',
    'Tom de voz': 'content-models-style-add-style-voice-tone',
    'Perfil do público': 'content-models-style-add-style-audience-profile',
    'Idioma': 'content-models-style-add-style-language',
    'Informações adicionais': 'content-models-style-add-style-additional-info',
  } as const;

  async openStyleAddMenu(): Promise<void> {
    // Botão fica próximo ao centro/topo da aba — não precisa de força
    await this.styleAddMoreDataButton().click();
    // Espera ao menos 1 menuitem aparecer
    await expect(
      this.page.locator('[data-test-id="content-models-style-add-style-age-range"]'),
    ).toBeVisible({ timeout: 5_000 });
  }

  async clickStyleAddOption(option: keyof typeof this.styleAddOptionByTestId): Promise<void> {
    const tid = this.styleAddOptionByTestId[option];
    await this.page.locator(`[data-test-id="${tid}"]`).click();
  }

  // ─── Aba Estrutura ───
  async gotoFirstModelEditStructure(): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
    await this.page.waitForTimeout(1500);
    const editIcon = this.page
      .locator('[data-test-id="content-models-page"] [id*="-edit-element-"]')
      .first();
    await editIcon.evaluate((el: HTMLElement) => el.click());
    await expect(this.page).toHaveURL(/\/content_models\/\d+\/edit/, { timeout: 15_000 });
    await this.page.locator('[data-test-id="tab-structure"]').click();
    await expect(this.page.locator('[data-test-id="tab-structure"]')).toHaveAttribute(
      'aria-selected',
      'true',
      { timeout: 10_000 },
    );
  }

  // Tipo de estrutura: <select id="structure_type"> nativo.
  // (htmlFor do label aponta pra "content-models-structure-type-select" que não
  // existe no DOM — divergência AT vs UI; o select real usa id snake_case.)
  tipoEstruturaSelect(): Locator {
    return this.page.locator('#structure_type');
  }

  async selectTipoEstrutura(label: 'Atividades sequenciais (1 nível)' | 'Atividades agrupadas por módulos (2 níveis)'): Promise<void> {
    await this.tipoEstruturaSelect().selectOption({ label });
    await this.page.waitForTimeout(500);
  }

  async tipoEstruturaOptions(): Promise<string[]> {
    return this.tipoEstruturaSelect().locator('option').allTextContents();
  }

  // Carga horária: <select id="structure_workload"> nativo. UI mostra labels CURTOS
  // ("Micro", "Curto", etc) — AT documentou completos ("Micro (30s a 5min)") por
  // engano. AT canônico será atualizado pra refletir UI real.
  cargaHorariaSelect(): Locator {
    return this.page.locator('#structure_workload');
  }

  async cargaHorariaOptionsLabels(): Promise<string[]> {
    return this.cargaHorariaSelect().locator('option').allTextContents();
  }

  cargaHorariaOptions = ['Micro', 'Curto', 'Médio', 'Estendido', 'Longo'] as const;

  // Switches da aba Estrutura
  incluirQuestionariosSwitch(): Locator {
    return this.page.locator('label[for="structure_include_quiz"]');
  }
  incluirQuestionariosChecked(): Promise<boolean> {
    return this.page.locator('#structure_include_quiz').isChecked();
  }

  incluirProvaFinalSwitch(): Locator {
    return this.page.locator('label[for="structure_include_final_exam"]');
  }
  incluirProvaFinalChecked(): Promise<boolean> {
    return this.page.locator('#structure_include_final_exam').isChecked();
  }

  atividadesPorModuloInput(): Locator {
    return this.page.locator('#structure_activities_count');
  }

  structureSaveButton(): Locator {
    return this.page.locator('[data-test-id="content-models-structure-submit-button"]');
  }

  async structureSave(): Promise<void> {
    const btn = this.structureSaveButton();
    await btn.scrollIntoViewIfNeeded();
    await btn.evaluate((el: HTMLButtonElement) => el.click());
  }

  // Cleanup helper: deletar modelo pelo nome via UI listagem.
  // Idempotente — usa try/catch + se modal de confirmação aparecer, confirma.
  async deleteByNameSafe(nome: string): Promise<void> {
    try {
      await safeGoto(this.page, `/o/${getOrgId()}/content_models`);
      await this.page.waitForTimeout(1500);
      await this.page.locator('#play-interest-search').fill(nome);
      await this.page.waitForTimeout(800);
      // Card delete icon — content_models-{id}-destroy-element-*-button-3
      const deleteIcon = this.page
        .locator('[data-test-id="content-models-page"] [id*="-destroy-element-"]')
        .first();
      if (!(await deleteIcon.isVisible().catch(() => false))) return;
      await deleteIcon.evaluate((el: HTMLElement) => el.click());
      await this.page.waitForTimeout(500);
      // Modal de confirmação Chakra — botão "Excluir" ou "Confirmar"
      for (const label of ['Excluir', 'Confirmar', 'Sim']) {
        const btn = this.page.getByRole('button', { name: label, exact: true }).first();
        if (await btn.isVisible({ timeout: 1500 }).catch(() => false)) {
          await btn.evaluate((el: HTMLElement) => el.click());
          await this.page.waitForTimeout(1000);
          break;
        }
      }
    } catch {
      // best-effort — cleanup não bloqueia próximo TC
    }
  }
}
