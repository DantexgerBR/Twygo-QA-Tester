import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage.js';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object do link público de inscrição em pacote ("course_registrations"
 * do Play) — fluxo de auto-inscrição/auto-reinscrição via URL pública
 * sem autenticação prévia (RN 15).
 *
 * Rota canônica do MD (suite 06):
 *   `/play/{packageSlug}/course_registrations?recertification=true`
 *
 * Comportamentos esperados (RN 15):
 *  - Flag ON + aluno elegível ⇒ HTTP 201, participant criado com
 *    `recertification_number = N+1`.
 *  - Flag ON + aluno inelegível ⇒ HTTP 422 com mensagem de erro do
 *    `CheckReenrollmentEligibilityUseCase`; nenhum participant criado.
 *  - Flag OFF ⇒ HTTP 404 com body `{}`; nenhum participant criado.
 *
 * Convenções aplicadas:
 *  - Acessamos o link público via BROWSER (não via APIRequestContext).
 *    A página renderiza um formulário de auto-inscrição que faz o POST
 *    para a mesma rota; isso evita configurar auth de API e cobre o
 *    fluxo end-to-end real do aluno externo.
 *  - `safeGoto` em todas as navegações (regra dura meta-monorepo).
 *  - Form pode ter campos obrigatórios (e-mail, nome, CPF) — preenchemos
 *    via helper `subscribeWithRecertification`.
 *
 * Status data-test-id: nenhum elemento do form de inscrição pública tem
 * `data-test-id` estável. Fallbacks usam `getByLabel`/`getByRole`.
 * REVISAR-SEED: rota pública pode estar gateada por captcha/recaptcha
 * em ambientes não-staging — validar via recon live antes da primeira run.
 */
export class PublicLinkPage extends BasePage {
  readonly path = '';

  constructor(page: Page) {
    super(page);
  }

  // ─── Navegação ──────────────────────────────────────────────────────

  /**
   * Navega para o link público de inscrição de pacote. Aceita URL completa
   * (`/play/{slug}/course_registrations?recertification=true`) ou apenas o
   * slug do pacote (helper monta a URL canônica).
   */
  async goToPublicLink(url: string): Promise<void> {
    // Se a string já parece URL completa (começa com `/` ou `http`), usa direto.
    // Caso contrário, assume que é só o slug do pacote e monta a rota canônica.
    const target =
      url.startsWith('/') || url.startsWith('http')
        ? url
        : `/play/${url}/course_registrations?recertification=true`;
    await safeGoto(this.page, target);
  }

  /**
   * Preenche o form de inscrição com os dados do aluno e submete.
   *
   * Pré-condição: já navegou para `/play/{slug}/course_registrations?recertification=true`.
   *
   * Comportamento esperado (RN 15, flag ON + aluno elegível):
   *  - Form aceita os dados, faz POST com `recertification=true`,
   *    backend retorna 201 e a UI mostra confirmação de inscrição.
   *
   * REVISAR-FIGMA: nomes exatos dos labels podem variar (e-mail vs Email,
   * Nome vs Nome completo). Regex amplo cobre as variações conhecidas.
   * Se o form usar campo de CPF, preenche; se não tiver, ignora silenciosamente.
   */
  async subscribeWithRecertification(student: {
    email: string;
    name: string;
    cpf?: string;
  }): Promise<void> {
    // Aguarda form renderizar — campo de e-mail é o âncora mais estável.
    const emailField = this.page
      .getByLabel(/e-?mail/i)
      .first();
    await emailField.waitFor({ state: 'visible', timeout: 15_000 });
    await emailField.fill(student.email);

    const nameField = this.page.getByLabel(/^Nome( completo)?$/i).first();
    if (await nameField.isVisible().catch(() => false)) {
      await nameField.fill(student.name);
    }

    if (student.cpf) {
      const cpfField = this.page.getByLabel(/CPF/i).first();
      if (await cpfField.isVisible().catch(() => false)) {
        await cpfField.fill(student.cpf);
      }
    }

    // Botão de submit — texto canônico "Inscrever-se" / "Cadastrar" /
    // "Confirmar inscrição". Usa regex amplo + first() para evitar bater
    // em botões de outras seções (footer, etc).
    await this.page
      .getByRole('button', { name: /Inscrever-se|Cadastrar|Confirmar inscri[çc][ãa]o|Enviar/i })
      .first()
      .click();
  }

  // ─── Asserts ────────────────────────────────────────────────────────

  /**
   * Assert: mensagem de erro aparece no form (RN 15 — aluno inelegível
   * ou flag OFF). Aceita `text` como string exata ou substring.
   *
   * Padrões esperados:
   *  - Aluno inelegível: "não está elegível", "em andamento", "sem expiração"
   *    ou similar do `CheckReenrollmentEligibilityUseCase`.
   *  - Flag OFF: a página pode retornar 404 (não renderiza form) — usar
   *    `expectErrorMessage('não encontrad')` ou validar URL/status no spec.
   */
  async expectErrorMessage(text: string | RegExp): Promise<void> {
    const errorRe = typeof text === 'string' ? new RegExp(text, 'i') : text;
    // Mensagem de erro pode vir como alert, toast Chakra ou texto inline.
    const errorBlock = this.page
      .locator('[role="alert"], .chakra-toast, .chakra-form__error-message, [data-status="error"]')
      .filter({ hasText: errorRe })
      .first();
    await expect(errorBlock).toBeVisible({ timeout: 15_000 });
  }

  /**
   * Assert: inscrição bem-sucedida via link público (RN 15 — aluno
   * elegível com flag ON). Sinais visuais:
   *  - Toast Chakra de sucesso
   *  - Redirect para `/play/event/...` ou tela de confirmação
   *  - Texto "Inscrição realizada"/"Confirmação" na página
   *
   * Polls múltiplos sinais — qualquer um confirma sucesso.
   */
  async expectSubscribeSuccess(): Promise<void> {
    const toast = this.page
      .locator('.chakra-toast, [role="status"]')
      .filter({ hasText: /sucesso|inscri[çc][ãa]o|confirmad/i })
      .first();
    const confirmationText = this.page
      .getByText(/inscri[çc][ãa]o realizada|confirmad[oa]|bem-vindo/i)
      .first();
    await expect
      .poll(
        async () => {
          const toastVisible = await toast.isVisible().catch(() => false);
          const textVisible = await confirmationText.isVisible().catch(() => false);
          const onPlay = /\/play\/event\/\d+/.test(this.page.url());
          return toastVisible || textVisible || onPlay;
        },
        { timeout: 15_000 },
      )
      .toBe(true);
  }
}
