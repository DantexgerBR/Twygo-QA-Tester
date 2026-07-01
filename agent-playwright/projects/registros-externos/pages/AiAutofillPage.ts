import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object do **card promocional de IA** ("Facilite seu trabalho com nossa IA")
 * presente no form "Adicionar registro de aprendizagem" (`/o/{orgId}/records/new`)
 * — suíte QA 1.15 "Preenchimento com IA e crédito de IA".
 *
 * Recebe `orgId` explícito (mesmo padrão de `NovoRegistroExternoPage`) para não
 * acoplar a um env específico.
 *
 * **Gotchas confirmados em recon ao vivo (2026-06-29, org 37093)**:
 * - Botão "Preencher com IA" = `records-form-ai-autofill-button`, nasce **disabled**.
 *   Habilita SÓ após upload de evidência.
 * - O upload é uma dropzone — `filechooser` NÃO dispara no click. Há 2
 *   `input[type=file]` na página: o 1º é o chat (`message_attachments`); o
 *   **último** é a evidência. Por isso `input[type=file]).last().setInputFiles(...)`.
 * - Endpoints (contrato real): upload → `POST /api/v1/o/{org}/records/store_archive`;
 *   preenchimento → `POST /api/v1/o/{org}/records/ai_fill` body
 *   `{"archive_ids":[<id>],"website":<url|null>}`.
 */
export class AiAutofillPage {
  constructor(
    private readonly page: Page,
    private readonly orgId: string | number,
  ) {}

  /** Path da rota do endpoint de preenchimento por IA (usado em route mock e request direto). */
  aiFillPath(): string {
    return `/api/v1/o/${this.orgId}/records/ai_fill`;
  }

  async goto(): Promise<void> {
    await safeGoto(this.page, `/o/${this.orgId}/records/new`);
    await this.page.getByRole('heading', { name: 'Novo conteúdo externo' }).waitFor({ state: 'visible' });
  }

  /** Abre o form de EDIÇÃO de um registro existente. Espera o form hidratar. */
  async gotoEdit(recordId: number | string): Promise<void> {
    await safeGoto(this.page, `/o/${this.orgId}/records/${recordId}/edit`);
    // O heading do edit difere do "Novo conteúdo externo"; o botão de autofill é
    // o marcador estável presente nos dois modos editáveis (recon 2026-06-29).
    await this.autofillButton().waitFor({ state: 'attached', timeout: 30_000 });
  }

  // ---------- Card de IA ----------

  // exact:false — o título não é um nó de texto isolado (o card é um bloco
  // único título+corpo+disclaimer+botão); exact:true não casa nada (recon 2026-06-29).
  cardTitle(): Locator {
    return this.page.getByText('Facilite seu trabalho com nossa IA', { exact: false });
  }

  cardDisclaimer(): Locator {
    return this.page.getByText('A IA pode cometer erros, verifique as informações', { exact: false });
  }

  autofillButton(): Locator {
    return this.page.getByTestId('records-form-ai-autofill-button');
  }

  /** O card de IA está presente na tela. */
  async isCardVisible(): Promise<boolean> {
    return this.cardTitle().isVisible().catch(() => false);
  }

  // ---------- Upload de evidência ----------

  /**
   * Faz upload de um arquivo no input de evidência. O input do chat
   * (`message_attachments`) é o 1º `input[type=file]`; o de evidência é o
   * **último** — daí o `.last()`. Após o upload o botão de autofill habilita.
   */
  async uploadEvidence(absolutePath: string): Promise<void> {
    await this.page.locator('input[type=file]').last().setInputFiles(absolutePath);
    // O botão habilita de forma assíncrona após o store_archive completar.
    await expect(this.autofillButton()).toBeEnabled({ timeout: 30_000 });
  }

  /** Aciona o preenchimento por IA (botão precisa estar habilitado). */
  async clickAutofill(): Promise<void> {
    await this.autofillButton().click();
  }

  // ---------- Comboboxes preenchidos pela IA (leitura do valor) ----------

  /**
   * Valor exibido (chip do react-select) de um combobox creatable, localizado
   * pelo `role=group` + label EXATO (mesmo padrão de `NovoRegistroExternoPage`).
   * Retorna '' quando vazio.
   */
  async readCreatableValue(label: string): Promise<string> {
    const group = this.page
      .getByRole('group')
      .filter({ has: this.page.getByText(label, { exact: true }) });
    const chip = group.locator('.creatable-select-field__multi-value__label, .creatable-select-field__single-value').first();
    if (await chip.isVisible().catch(() => false)) {
      return (await chip.innerText()).trim();
    }
    return '';
  }

  // ---------- Toasts ----------

  /** Toast Chakra filtrado por texto (`.first()` evita strict-mode — skill testar-toast-chakra). */
  toast(text: string | RegExp): Locator {
    return this.page.locator('.chakra-toast').filter({ hasText: text }).first();
  }

  // ---------- Modal "Limite de créditos atingido" (TC3/TC4) ----------

  creditLimitModal(): Locator {
    return this.page.getByRole('dialog').filter({ hasText: 'Limite de créditos atingido' });
  }
}
