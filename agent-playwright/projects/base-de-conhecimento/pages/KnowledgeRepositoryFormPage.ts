import { type Locator, type Page } from '@playwright/test';
import { getOrgId } from '../../../src/utils/environment.js';
import { safeGoto, safeReload } from '../../../src/utils/modals.js';

/**
 * Page Object do form de criação/edição de Repositórios de Conhecimento.
 *
 * URL canônica de criação: `/o/{orgId}/knowledge_repositories/new`
 * URL canônica de edição:  `/o/{orgId}/knowledge_repositories/{id}/edit`
 *
 * Observações de recon (2026-05-19, env staging — orgId 36602):
 * - data-test-id="knowledge-repositories-form-identification" (container aba Identificação)
 * - data-test-id="knowledge-repositories-form-tabs-container" (tabs Chakra)
 * - data-test-id="tab-identification" (tab Identificação — aria-selected=true default)
 * - data-test-id="tab-sources" (tab Fontes de conhecimento)
 * - data-test-id="tab-resources" (tab Recursos de mídia)
 * - data-test-id="knowledge-repositories-form-save-button" (botão Salvar)
 * - data-test-id="knowledge-repositories-form-cancel-button" (botão Cancelar)
 * - Campo Nome: placeholder "Digite o nome do repositório", label "Nome*"
 * - Campo Descrição: placeholder "Descreva o conteúdo deste repositório", label "Descrição*"
 * - Categoria e Classificação: react-select (ID volátil — usar label/role)
 * - Modal aberto detectado no recon — safeGoto obrigatório em goToCreate().
 *
 * `orgIdOverride` (opcional) força o orgId nos paths — usado por specs
 * cross-env (suite ambientes-adicionais-isolamento). Sem override, fallback
 * é `getOrgId()`. Construtor 1-arg permanece backward-compat. Ver skill
 * testar-ambientes-adicionais-twygo.
 */
export class KnowledgeRepositoryFormPage {
  constructor(
    private readonly page: Page,
    private readonly orgIdOverride?: string,
  ) {}

  private get orgId(): string {
    return this.orgIdOverride ?? getOrgId();
  }

  // ---------- Navegação ----------

  /**
   * Abre a tela de criação de repositório.
   * Obrigatório usar safeGoto — modal detectado no recon (NPS Sofia / "Continuar mesmo assim").
   *
   * Retry idempotente (paridade com goToList): staging tem flakiness onde o
   * SPA hidrata mas o container do form não fica visível dentro do timeout.
   * Reload após 1ª falha frequentemente resolve.
   */
  async goToCreate(): Promise<void> {
    // 3 tentativas com timeout de 30s cada — audit live 2026-05-21 mostrou que
    // o staging às vezes leva >20s para renderizar o form-identification em
    // runs com paralelismo/saturação. 1ª navegação + 2 reloads dão margem
    // suficiente sem aumentar o tempo total do teste a ponto de mascarar
    // problema real do produto. safeReload com blockTrackers nas tentativas 2/3
    // aborta Sophia/Intercom/etc que seguram `load` (skill safe-reload-twygo).
    const maxAttempts = 3;
    const containerTimeout = 30_000;
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt === 1) {
          await safeGoto(this.page, `/o/${this.orgId}/knowledge_repositories/new`);
        } else {
          await safeReload(this.page, { blockTrackers: true });
        }
        await this.page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => null);
        await this.getIdentificationContainer().waitFor({ state: 'visible', timeout: containerTimeout });
        return;
      } catch (err) {
        lastErr = err;
         
        console.warn(`[goToCreate] tentativa ${attempt}/${maxAttempts} falhou: ${(err as Error).message}`);
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('goToCreate falhou após retries');
  }

  /**
   * Abre a tela de edição de um repositório pelo id.
   * Usado por TC4 (editar repo no adicional) e por testes que precisam
   * navegar diretamente ao edit sem passar pela listagem.
   *
   * Retry idempotente igual a goToCreate — staging Twygo às vezes navega
   * com URL correta mas SPA não hidrata o form em 30s. Reload resolve.
   */
  async goToEdit(id: string): Promise<void> {
    const maxAttempts = 3;
    // /edit é mais pesado que /new em staging — espera o input Nome ficar visível
    // (sinal de form hidratado) em vez do container só. 60s/attempt cobre cold-start.
    // safeReload com blockTrackers nas tentativas 2/3 evita Sophia/Intercom segurando `load`.
    const formReadyTimeout = 60_000;
    let lastErr: unknown = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        if (attempt === 1) {
          await safeGoto(this.page, `/o/${this.orgId}/knowledge_repositories/${id}/edit`);
        } else {
          await safeReload(this.page, { blockTrackers: true });
        }
        await this.page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => null);
        // Espera o input Nome — sinal mais robusto de form hidratado que o container,
        // porque o container Chakra pode aparecer antes do React renderizar os campos.
        await this.getNameInput().waitFor({ state: 'visible', timeout: formReadyTimeout });
        return;
      } catch (err) {
        lastErr = err;
         
        console.warn(`[goToEdit] tentativa ${attempt}/${maxAttempts} falhou: ${(err as Error).message}`);
      }
    }
    throw lastErr instanceof Error ? lastErr : new Error('goToEdit falhou após retries');
  }

  /**
   * Lê o id do repositório a partir do URL atual `/knowledge_repositories/{id}/edit`.
   * Retorna null se o URL não bate (ex: ainda em /new ou erro de validação).
   * Usado pós-clickSalvar() para capturar o id criado.
   */
  getCurrentRepoId(): string | null {
    const match = this.page.url().match(/knowledge_repositories\/(\d+)\/edit/);
    return match?.[1] ?? null;
  }

  // ---------- Containers e tabs ----------

  getTabsContainer(): Locator {
    return this.page.getByTestId('knowledge-repositories-form-tabs-container');
  }

  // Tabs Chakra NÃO têm `data-test-id` (validado live 2026-05-20: IDs são
  // voláteis tipo `tabs-:r17:--tab-1`). Usamos `getByRole` por nome — estável.
  getTabIdentification(): Locator {
    return this.page.getByRole('tab', { name: 'Identificação' });
  }

  getTabSources(): Locator {
    return this.page.getByRole('tab', { name: 'Fontes de conhecimento' });
  }

  getTabResources(): Locator {
    return this.page.getByRole('tab', { name: 'Recursos de mídia' });
  }

  getIdentificationContainer(): Locator {
    return this.page.getByTestId('knowledge-repositories-form-identification');
  }

  // ---------- Campos da aba Identificação ----------

  getNameInput(): Locator {
    return this.page.getByPlaceholder('Digite o nome do repositório');
  }

  getDescriptionInput(): Locator {
    return this.page.getByPlaceholder('Descreva o conteúdo deste repositório');
  }

  /**
   * Categoria (react-select com ID volátil).
   * Usa getByLabel como anchor estável; se ambíguo, filtrar pelo container.
   * REVISAR: confirmar tipo do componente (react-select vs select nativo) ao vivo.
   */
  getCategoryContainer(): Locator {
    return this.getIdentificationContainer()
      .locator('div', { hasText: /^Categoria$/ })
      .locator('..')
      .first();
  }

  /**
   * Classificação (react-select com ID volátil).
   * REVISAR: confirmar tipo do componente ao vivo.
   */
  getClassificationContainer(): Locator {
    return this.getIdentificationContainer()
      .locator('div', { hasText: /^Classificação$/ })
      .locator('..')
      .first();
  }

  // ---------- Botões do form ----------

  getSaveButton(): Locator {
    return this.page.getByTestId('knowledge-repositories-form-save-button');
  }

  getCancelButton(): Locator {
    return this.page.getByTestId('knowledge-repositories-form-cancel-button');
  }

  getBackButton(): Locator {
    return this.page.getByRole('button', { name: 'Voltar' });
  }

  // ---------- Ações de negócio ----------

  async fillName(name: string): Promise<void> {
    await this.getNameInput().fill(name);
  }

  async fillDescription(description: string): Promise<void> {
    await this.getDescriptionInput().fill(description);
  }

  // react-select creatable (placeholder "Selecione ou digite uma categoria"):
  // org nova sem opções pré-existentes → digitar valor + Enter cria a categoria.
  // Confirmado live 2026-05-19: sem opções no menu por default.
  private async _fillCreatableSelect(label: 'Categoria' | 'Classificação', value: string): Promise<void> {
    const identContainer = this.getIdentificationContainer();
    const inputs = identContainer.locator('input[id^="react-select"]');
    const idx = label === 'Categoria' ? 0 : 1;
    const input = inputs.nth(idx);
    await input.click();
    await input.pressSequentially(value, { delay: 30 });
    // pressSequentially garante que cada keypress dispare o handler do react-select,
    // permitindo a opção "Criar 'value'" renderizar antes do Enter.
    await input.press('Enter');
  }

  async selectCategory(value: string): Promise<void> {
    await this._fillCreatableSelect('Categoria', value);
  }

  async selectClassification(value: string): Promise<void> {
    await this._fillCreatableSelect('Classificação', value);
  }

  async clickSalvar(): Promise<void> {
    await this.getSaveButton().click();
  }

  async clickCancelar(): Promise<void> {
    await this.getCancelButton().click();
  }

  // ---------- Feedback / toast ----------

  /**
   * Retorna o locator do toast Chakra com o texto especificado.
   * REVISAR-FIGMA: texto exato do toast de sucesso (criação e edição).
   */
  getToast(text: string): Locator {
    return this.page.locator('[role="status"]').filter({ hasText: text });
  }

  // ---------- Mensagens de validação ----------

  /**
   * Retorna o locator da mensagem de validação do campo Nome.
   * REVISAR-FIGMA: texto exato da mensagem.
   */
  getNameValidationMessage(): Locator {
    return this.page.getByText('Nome é obrigatório');
  }

  /**
   * Retorna o locator da mensagem de validação do campo Descrição.
   * REVISAR-FIGMA: texto exato da mensagem ("é obrigatória" ou "é obrigatório").
   */
  getDescriptionValidationMessage(): Locator {
    return this.page.getByText('Descrição é obrigatória');
  }

  // ---------- Sub-form: Fonte de conhecimento ----------
  //
  // Validado live 2026-05-20 via chrome-devtools-mcp em stage10/orgId 36602:
  // - URL: /o/{orgId}/knowledge_repositories/{repoId}/knowledge_sources/new
  // - Form: Nome* (250 chars), Descrição (1000), Instruções (1000), Arquivo (dropzone).
  // - Input file hidden: id="drop-zone-upload-input" (setInputFiles bypassa display:none).
  // - Accept: .pdf, .doc, .docx, .ppt, .pptx, .mp4, .mp3. Max 50 MB.
  // - Pós-Salvar: redirect pra /edit?tab=sources com nova linha na tabela.

  async openSourcesTab(): Promise<void> {
    await this.getTabSources().click();
    await this.page.waitForURL(/edit\?tab=sources/, { timeout: 10_000 });
  }

  async openResourcesTab(): Promise<void> {
    await this.getTabResources().click();
    await this.page.waitForURL(/edit\?tab=resources/, { timeout: 10_000 });
  }

  /**
   * Abre a aba Identificação. Idempotente: se já estamos na identificação
   * (URL sem `?tab=` ou com `?tab=identification`), retorna sem clicar —
   * o click no tab ativo NÃO altera o URL, então `waitForURL` daria timeout.
   */
  async openIdentificationTab(): Promise<void> {
    const url = this.page.url();
    if (!url.includes('?tab=') || url.includes('?tab=identification')) {
      // Já estamos na Identificação (default da página de edit).
      return;
    }
    await this.getTabIdentification().click();
    await this.page.waitForURL(/edit\?tab=identification/, { timeout: 10_000 });
  }

  /** Clica "Adicionar" na aba Fontes e aguarda navegação ao sub-form. */
  async clickAdicionarFonte(): Promise<void> {
    await this.page.getByRole('button', { name: 'Adicionar' }).click();
    await this.page.waitForURL(/knowledge_sources\/new/, { timeout: 15_000 });
  }

  /** Clica "Adicionar" na aba Recursos de mídia e aguarda navegação ao sub-form. */
  async clickAdicionarRecurso(): Promise<void> {
    await this.page.getByRole('button', { name: 'Adicionar' }).click();
    await this.page.waitForURL(/knowledge_resources\/new/, { timeout: 15_000 });
  }

  async fillSourceName(value: string): Promise<void> {
    await this.page.getByPlaceholder('Digite o nome da fonte de conhecimento').fill(value);
  }

  async fillResourceName(value: string): Promise<void> {
    await this.page.getByPlaceholder('Digite o nome do recurso de mídia').fill(value);
  }

  /**
   * Anexa arquivo no dropzone do sub-form (Fontes ou Recursos).
   * Input é hidden — setInputFiles bypassa dialog do SO sem clique no botão.
   * Funciona pros dois sub-forms porque o id do input é o mesmo.
   */
  async attachFile(filePath: string): Promise<void> {
    await this.page.locator('#drop-zone-upload-input').setInputFiles(filePath);
  }

  /** Clica Salvar do sub-form (Fonte ou Recurso). */
  async clickSalvarSubForm(): Promise<void> {
    await this.page.getByRole('button', { name: 'Salvar' }).click();
  }

  /**
   * Clica Cancelar no sub-form (Fonte ou Recurso).
   *
   * Os data-test-id dos botões do sub-form são distintos do form principal
   * (validado live 2026-05-21 via chrome-devtools-mcp em /knowledge_sources/new
   * e /knowledge_resources/new):
   *   - Sub-form Fontes:   knowledge-repositories-sources-form-cancel-button
   *   - Sub-form Recursos: knowledge-repositories-resources-form-cancel-button
   *   - Form principal:    knowledge-repositories-form-cancel-button
   *
   * Usar `clickCancelar` no sub-form falha por timeout (testId não bate).
   * Esse método usa `getByRole + name 'Cancelar'` que resolve sem ambiguidade.
   */
  async clickCancelarSubForm(): Promise<void> {
    await this.page.getByRole('button', { name: 'Cancelar' }).click();
  }

  /**
   * Retorna locator da linha na tabela de Fontes pelo nome.
   * Pós-criação: redirect pra ?tab=sources renderiza linha com Nome + Situação.
   */
  getSourceRow(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name });
  }

  getResourceRow(name: string): Locator {
    return this.page.getByRole('row').filter({ hasText: name });
  }
}
