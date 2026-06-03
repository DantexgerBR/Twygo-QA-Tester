import type { Locator, Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage.js';
import { safeGoto } from '../../../src/utils/modals.js';

/**
 * Page Object da área do Aluno ("Play") do Twygo — banner de curso com botão
 * de acesso/inscrição original + botão "Reinscreva-se" (RN 16, 16.1, 17).
 *
 * Rota canônica do MD (suite 06):
 *   `/play/event/{eventId}`
 *
 * Variação observada em prosa: `/play/{eventSlug}` quando o curso está
 * associado a um pacote — mantida como rota alternativa para resiliência.
 *
 * Convenções aplicadas:
 *  - `safeGoto` em todas as navegações (regra dura meta-monorepo: cobre
 *    NPS Sofia + outros modais oportunistas que travam o evento `load`).
 *  - Switch de perfil: o Play é área Aluno — specs devem rodar com
 *    perfil Aluno (ver skill `trocar-perfil-twygo`). Cleanup em
 *    `afterAll` reverte para Administrador para não contaminar próximos
 *    TCs admin (`ProfileSwitcher.revertToAdminSafe`).
 *
 * Status data-test-id: nenhum elemento do banner tem `data-test-id`
 * estável ainda. Fallbacks usam role+name e seletores por texto
 * ("Reinscreva-se", "Acessar"). Cada uso fica marcado com
 * `// REVISAR: aguardando data-test-id`.
 */
export class PlayPage extends BasePage {
  readonly path = '';

  constructor(page: Page) {
    super(page);
  }

  // ─── Navegação ──────────────────────────────────────────────────────

  /**
   * Acessa a página do curso/evento no Play.
   * Rota canônica: `/play/event/{eventId}`.
   */
  async goToPlay(eventId: number | string): Promise<void> {
    await safeGoto(this.page, `/play/event/${eventId}`);
  }

  // ─── Banner: botões ─────────────────────────────────────────────────

  /**
   * Botão "Reinscreva-se" do banner do Play. Aparece abaixo do botão
   * original (acesso/inscrição) quando o aluno é elegível (RN 16.1).
   *
   * Estado esperado (RN 16.2): NÃO renderizado quando aluno é inelegível
   * (não aparece como `disabled` — simplesmente sumido).
   *
   * REVISAR: aguardando data-test-id estável (sugerido
   * `play-banner-reinscreva-se-button`). Hoje fallback via role+name.
   */
  getReinscrevaSeButton(): Locator {
    return this.page.getByRole('button', { name: /Reinscreva-se/i }).first();
  }

  /**
   * Botão original do banner ("Acessar"/"Inscrever-se"/"Começar"). Usado
   * para validar coexistência com o botão "Reinscreva-se" (RN 16.1 — dois
   * botões empilhados) e para o TC2 — o original deve continuar visível
   * para aluno inelegível mesmo sem o "Reinscreva-se".
   *
   * REVISAR-FIGMA: o nome exato do botão original varia conforme estado
   * (curso pago vs gratuito, em andamento vs concluído). Regex amplo
   * cobre "Acessar"/"Inscrever-se"/"Continuar"/"Começar".
   */
  getBannerOriginalButton(): Locator {
    return this.page
      .getByRole('button', { name: /^(Acessar|Inscrever-se|Continuar|Come[çc]ar|Acesse|Inscreva-se)/i })
      .first();
  }

  // ─── Asserts ────────────────────────────────────────────────────────

  /**
   * Assert: botão "Reinscreva-se" está visível (ou não) no banner.
   * Usado por TC1 (aluno elegível ⇒ visível), TC2 (aluno inelegível ⇒
   * ausente) e TC4 (flag OFF ⇒ ausente mesmo para aluno elegível).
   */
  async expectReinscrevaSeVisible(visible: boolean): Promise<void> {
    const btn = this.getReinscrevaSeButton();
    if (visible) {
      await expect(btn).toBeVisible({ timeout: 15_000 });
    } else {
      // Confirma que NÃO aparece nem mesmo como `disabled` (RN 16.2).
      // `toHaveCount(0)` é mais estrito que `toBeHidden` — garante que
      // o elemento sequer existe no DOM.
      await expect(btn).toHaveCount(0, { timeout: 15_000 });
    }
  }

  /**
   * Click no botão "Reinscreva-se" do banner. Pré-condição: botão visível
   * (validar com `expectReinscrevaSeVisible(true)` antes).
   *
   * Side-effect (RN 17): dispara `POST /api/v1/play/.../subscribe` com
   * `recertification: true`. Validação da request fica a cargo do spec
   * (via `page.waitForResponse`).
   */
  async clickReinscrevaSe(): Promise<void> {
    const btn = this.getReinscrevaSeButton();
    await btn.waitFor({ state: 'visible', timeout: 15_000 });
    await btn.click();
  }

  /**
   * Assert visual de "novo participant criado" após click em
   * "Reinscreva-se" (RN 17). O banner do Play é atualizado refletindo
   * o novo estado:
   *  - `recertification_number` incrementa (N → N+1)
   *  - `progress_score = 0` (novo participant)
   *  - Botão "Reinscreva-se" tipicamente desaparece (aluno volta a estar
   *    "em andamento" — inelegível para reinscrever-se imediatamente)
   *
   * Asserção principal: pelo menos um dos sinais visuais de "novo curso/
   * inscrição" aparece — toast de sucesso, badge "Pendente", ou o botão
   * original muda para "Continuar/Acessar".
   *
   * REVISAR-FIGMA: texto exato do toast de sucesso e label do badge ainda
   * não confirmados — asserta presença de SINAL visual via poll.
   */
  async expectNewSubscriptionCreated(): Promise<void> {
    const toast = this.page
      .locator('.chakra-toast, [role="status"]')
      .filter({ hasText: /inscri[çc][ãa]o|sucesso|reinscri/i })
      .first();
    const btn = this.getReinscrevaSeButton();

    await expect
      .poll(
        async () => {
          const toastVisible = await toast.isVisible().catch(() => false);
          const btnGone = (await btn.count()) === 0;
          return toastVisible || btnGone;
        },
        { timeout: 15_000 },
      )
      .toBe(true);
  }
}
