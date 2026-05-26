import type { Download, Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage.js';
import { getOrgId } from '../../../src/utils/environment.js';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object da tela de Importação de Participants via CSV.
 *
 * Rota canônica (RN 11 / Suite 04 do MD):
 *   `/o/{orgId}/events/{eventId}/import_participants`  (REVISAR-FIGMA — URL exata
 *   ainda não confirmada; rota é a candidata principal pela convenção REST do
 *   resource `events/:event_id/import_participants` já em uso no Twygo.)
 *
 * Fluxo coberto pela suite:
 *  1. Admin acessa a tela → vê link "Baixar template CSV" + input de upload.
 *  2. Baixa template → header contém coluna "Reinscrever" quando feature flag
 *     `:recertificacao` está ON.
 *  3. Faz upload de CSV preenchido → worker `CsvImportEventParticipantWorker`
 *     processa; tela mostra toast "Importação iniciada" + tela de resultado.
 *
 * Convenções aplicadas:
 *  - `safeGoto` em todas as navegações (regra dura meta-monorepo).
 *  - Upload via `setInputFiles({ name, mimeType, buffer })` — buffer in-memory,
 *    sem criar arquivo no disco (Anti-pattern: arquivos espalhados em /tmp
 *    poluem o workspace).
 *  - Selectors com `data-test-id` quando possível (atributo Twygo é `data-test-id`
 *    com hífen, já configurado em `playwright.config.ts`). Fallback semântico
 *    via `getByRole`/`getByText` quando o test-id não existe ainda.
 *
 * Status data-test-id: nenhum elemento desta tela tem `data-test-id` estável
 * confirmado. Fallbacks usam role + texto literal das labels esperadas.
 * Cada uso fica marcado com `// REVISAR: aguardando data-test-id`.
 */
export class CsvImportPage extends BasePage {
  readonly path = '';

  constructor(page: Page) {
    super(page);
  }

  // ─── Navegação ──────────────────────────────────────────────────────

  /**
   * Acessa a tela de importação de participants de um curso/evento.
   *
   * REVISAR-FIGMA: URL canônica ainda não confirmada — assumimos a rota
   * REST convencional `/o/{orgId}/events/{eventId}/import_participants`.
   * Se a tela não carregar, capturar a URL real via chrome-devtools-mcp e
   * ajustar este helper.
   */
  async goToImport(eventId: number | string): Promise<void> {
    await safeGoto(
      this.page,
      `/o/${getOrgId()}/events/${eventId}/import_participants`,
    );
  }

  // ─── Template CSV ───────────────────────────────────────────────────

  /**
   * Link/botão "Baixar template CSV" na tela de importação.
   *
   * REVISAR: aguardando data-test-id (`csv-import-template-download` sugerido).
   * Fallback usa role+name com regex para tolerar variações ("Baixar template",
   * "Baixar template CSV", "Download template").
   */
  getDownloadTemplateLink(): Locator {
    return this.page
      .getByRole('link', { name: /Baixar template( CSV)?|Download template/i })
      .first();
  }

  /**
   * Baixa o template CSV oferecido pela tela. Retorna o path local do
   * arquivo baixado (Playwright grava em `outputs/` ou tmpdir do contexto).
   *
   * Implementação: registra `waitForEvent('download')` ANTES do click — caso
   * contrário, o evento dispara antes do listener atachar (race condition
   * clássica em download via click).
   */
  async downloadTemplate(): Promise<string> {
    const downloadPromise = this.page.waitForEvent('download', {
      timeout: 15_000,
    });
    await this.getDownloadTemplateLink().click();
    const download: Download = await downloadPromise;
    // `path()` retorna o caminho local; o arquivo é mantido até o contexto
    // fechar. Suficiente para ler header dentro do mesmo teste.
    const filePath = await download.path();
    if (!filePath) {
      throw new Error(
        'Download do template CSV não retornou path local. ' +
          'REVISAR: verificar config `acceptDownloads: true` no playwright.config.ts.',
      );
    }
    return filePath;
  }

  /**
   * Lê o header (primeira linha) do CSV em `filePath` e assert se a coluna
   * `columnName` está (ou não) presente. Implementado in-line aqui para
   * evitar dependência circular com helpers de fs em utils/.
   *
   * Tolerância de parsing: split simples por vírgula. Se o template usa
   * separador `;` ou aspas envoltas, ajustar aqui — por hora não temos
   * confirmação do separador real.
   */
  async expectColumnInTemplate(
    filePath: string,
    columnName: string,
    present: boolean,
  ): Promise<void> {
    const { readFileSync } = await import('node:fs');
    const content = readFileSync(filePath, 'utf-8');
    const firstLine = (content.split(/\r?\n/)[0] ?? '').trim();
    const columns = firstLine
      .split(/[,;]/)
      .map((c) => c.trim().replace(/^"|"$/g, ''));
    const found = columns.some(
      (c) => c.toLowerCase() === columnName.toLowerCase(),
    );
    if (present) {
      expect(found, `Header do template CSV: ${firstLine}`).toBe(true);
    } else {
      expect(found, `Header do template CSV: ${firstLine}`).toBe(false);
    }
  }

  // ─── Upload CSV ─────────────────────────────────────────────────────

  /**
   * Input `<input type="file">` da tela. Pode estar oculto atrás de um botão
   * estilizado — `setInputFiles` funciona mesmo em inputs com `display: none`.
   *
   * REVISAR: aguardando data-test-id (`csv-import-file-input` sugerido).
   */
  getFileInput(): Locator {
    return this.page.locator('input[type="file"]').first();
  }

  /**
   * Upload de CSV in-memory (buffer). Não cria arquivo no disco.
   *
   * @param csvContent conteúdo bruto do CSV (header + linhas, separadas por \n)
   * @param fileName nome lógico do arquivo (default `participants.csv`)
   */
  async uploadCsv(csvContent: string, fileName = 'participants.csv'): Promise<void> {
    const input = this.getFileInput();
    await input.setInputFiles({
      name: fileName,
      mimeType: 'text/csv',
      buffer: Buffer.from(csvContent, 'utf-8'),
    });
  }

  /**
   * Botão de confirmação do upload. Twygo tipicamente usa "Importar" ou
   * "Enviar" / "Confirmar". Regex tolera as 3 variantes.
   *
   * REVISAR: aguardando data-test-id (`csv-import-submit` sugerido).
   */
  getConfirmUploadButton(): Locator {
    return this.page
      .getByRole('button', { name: /Importar|Enviar|Confirmar/i })
      .first();
  }

  /**
   * Confirma o upload (após `uploadCsv`). Idempotente: se o botão não estiver
   * visível (alguns fluxos auto-submetem ao escolher o arquivo), retorna sem
   * erro — o caller assert resultado via `expectImportSuccess`.
   */
  async confirmUpload(): Promise<void> {
    const button = this.getConfirmUploadButton();
    if (await button.isVisible().catch(() => false)) {
      await button.click();
    }
  }

  // ─── Resultado da importação ────────────────────────────────────────

  /**
   * Toast / mensagem de sucesso após disparo do worker.
   *
   * REVISAR-FIGMA: texto exato ainda não confirmado. Candidatos esperados:
   * "Importação iniciada", "Importação concluída com sucesso", "Importação
   * em andamento". Regex tolera as variações.
   */
  async expectImportSuccess(): Promise<void> {
    const toast = this.page
      .locator('.chakra-toast, [role="status"], [role="alert"]')
      .filter({ hasText: /Importação (iniciada|concluída|em andamento)|sucesso/i })
      .first();
    await expect(toast).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Linha de erro estruturado da tela de "Resultado da importação".
   * Cada linha problemática do CSV é renderizada como um item de lista
   * (ou linha de tabela) com índice + mensagem.
   *
   * REVISAR-FIGMA: estrutura exata da tela de resultado ainda não confirmada.
   * Hoje retornamos um locator genérico ancorado pela posição numérica do
   * texto "Linha N" — ajustar quando a UI for inspecionada via recon.
   */
  getRowError(rowNumber: number): Locator {
    // Ancora por texto "Linha N" (1-based, conforme convenção Twygo de
    // referenciar linhas do CSV pelo número humano).
    return this.page
      .locator('li, tr, [role="listitem"]')
      .filter({ hasText: new RegExp(`Linha\\s*${rowNumber}\\b`, 'i') })
      .first();
  }

  /**
   * Texto da mensagem de erro associada ao e-mail (linha do CSV).
   * Útil quando o resultado da importação lista por e-mail ao invés de
   * número da linha (convenção comum em UIs Twygo).
   *
   * Retorna `null` se nenhum erro for encontrado para o e-mail.
   */
  async getErrorMessageForRow(email: string): Promise<string | null> {
    const errorRow = this.page
      .locator('li, tr, [role="listitem"]')
      .filter({ hasText: email })
      .first();
    if (!(await errorRow.isVisible().catch(() => false))) return null;
    const text = (await errorRow.textContent().catch(() => null)) ?? null;
    return text ? text.trim() : null;
  }

  /**
   * Aguarda processamento assíncrono do worker `CsvImportEventParticipantWorker`.
   * Twygo não expõe estado de worker via UI determinística — heurística é
   * aguardar a tela de resultado renderizar (toast/área de erros) com
   * timeout configurável.
   *
   * @param timeoutMs default 30s conforme prosa do MD (TC3 passo 4).
   */
  async waitForImportProcessing(timeoutMs = 30_000): Promise<void> {
    // Espera por QUALQUER sinal de conclusão: toast, painel de resultado,
    // ou redirect para tela de listagem do worker.
    const successToast = this.page
      .locator('.chakra-toast, [role="status"]')
      .filter({ hasText: /Importação|sucesso|conclu/i })
      .first();
    const resultsPanel = this.page.locator(
      '[data-test-id*="import-result"], [data-testid*="import-result"], h1:has-text("Resultado")',
    ).first();
    await expect
      .poll(
        async () => {
          const a = await successToast.isVisible().catch(() => false);
          const b = await resultsPanel.isVisible().catch(() => false);
          return a || b;
        },
        { timeout: timeoutMs },
      )
      .toBe(true);
  }
}
