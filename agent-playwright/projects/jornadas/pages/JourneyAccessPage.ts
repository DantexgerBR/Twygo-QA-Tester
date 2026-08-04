import { type Locator, type Page } from '@playwright/test';
import { ABAS, abrirAba } from '../utils/journey-lifecycle.js';

/**
 * Aba "Acesso" do form de Jornada Padrão. Só existe em jornada JÁ SALVA — a tab nasce
 * `disabled` (tabs progressivas). Locators medidos ao vivo em 03/08, não deduzidos do recon.
 */
export class JourneyAccessPage {
  constructor(private readonly page: Page) {}

  /** A tab fica `disabled` durante save→redirect→re-render; o helper espera ficar enabled. */
  async abrir(): Promise<void> {
    await abrirAba(this.page, ABAS.acesso);
  }

  /**
   * ⚠️ `#email` e NÃO `input[name*="email"]`: a aba tem um `external_user_email` **invisível** (form
   * Rails legado, `class="form-control"`) que casa primeiro num seletor por atributo e faz o teste
   * esperar 30s por um campo que nunca fica visível. Medido em 03/08.
   */
  getEmailInput(): Locator {
    return this.page.locator('#email');
  }

  /** Cada aba tem o seu botão de salvar — este NÃO é o `identification-save-button`. */
  getSaveButton(): Locator {
    return this.page.getByTestId('journey-access-save-button');
  }

  /**
   * Erro do campo de e-mail, escopado pelo TEXTO de propósito. Asserção em
   * `.chakra-form__error-message` genérico passaria por engano: a aba mantém um erro não relacionado
   * ("Os dias de acesso devem ser no mínimo 1") visível o tempo todo depois do 1º submit.
   */
  getEmailError(): Locator {
    return this.page.getByText('E-mail inválido', { exact: true });
  }

  /** Checkbox Chakra (não switch): responde a clique real E a dispatchEvent — medido em 03/08. */
  getRestrictOffHoursCheckbox(): Locator {
    return this.page.locator('#journey-access-restrict-offhours-checkbox');
  }

  getExpirationDaysInput(): Locator {
    return this.page.locator('#days_to_expire');
  }

  getConfirmationCheckbox(): Locator {
    return this.page.locator('#require_subscription_confirmation');
  }

  getAttachmentsCheckbox(): Locator {
    return this.page.locator('#allow_attachments');
  }

  /** Título de seção da aba ("Contato", "Inscrição", "Acesso", "Anexos"). */
  getSectionHeading(nome: string): Locator {
    return this.page.getByRole('heading', { name: nome, exact: true });
  }

  /** Substitui o conteúdo como um usuário faria (select-all → Delete → digitar). */
  async fillEmail(valor: string): Promise<void> {
    const el = this.getEmailInput();
    await el.click();
    await el.press('ControlOrMeta+a');
    await el.press('Delete');
    if (valor) await el.pressSequentially(valor);
    await el.blur();
  }
}
