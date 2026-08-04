import { expect, type Locator, type Page } from '@playwright/test';
import { getBaseUrl, getEnvByName, getOrgId } from '../../../src/utils/environment.js';
import { safeGoto } from '../../../src/utils/modals.js';
import { fecharAvisosTwygo } from '../utils/journey-lifecycle.js';

export class JourneyIdentificationPage {
  constructor(
    private readonly page: Page,
    private readonly environmentName: string,
  ) {}

  /** Aviso de novidades da Twygo intercepta pointer events — dispensar antes de qualquer interação. */
  async fecharAvisos(): Promise<void> {
    await fecharAvisosTwygo(this.page);
  }

  async goToCreate(): Promise<void> {
    const environment = getEnvByName(this.environmentName);
    const orgId = environment.orgId ?? getOrgId();
    const baseUrl = environment.baseUrl || getBaseUrl();
    // Entrar pela VISÃO DE ADM antes do path da jornada. O storageState não carrega esse estado: cada
    // test roda em contexto novo e, indo direto em `/o/<id>/journeys/new`, a app responde "Você não tem
    // permissão para acessar esta página." A própria página de erro aponta o caminho — o link "Voltar"
    // vai pra `/o/<id>/events?tab=events`, que é o landing do Administrador (`?profile=admin`, ver
    // .claude/skills/trocar-perfil-twygo). Medido 04/08/2026: sem esta navegação, 4/4 vermelho no
    // waitFor do tab-identification, mesmo com login novo e mesmo passando pela raiz limpa antes.
    await safeGoto(this.page, new URL(`/o/${orgId}/events?tab=events&profile=admin`, baseUrl).toString());
    await safeGoto(this.page, new URL(`/o/${orgId}/journeys/new`, baseUrl).toString());
    await this.getIdentificationTab().waitFor({ state: 'visible', timeout: 60_000 });
    await fecharAvisosTwygo(this.page);
  }

  getIdentificationTab(): Locator {
    return this.page.getByTestId('tab-identification');
  }

  /**
   * Cria a jornada com o mínimo válido e devolve o id. Necessário porque as tabs do form são
   * PROGRESSIVAS: `Acesso`, `Banner`, `Cronograma` etc. nascem `disabled` e só liberam depois do save
   * (skill testar-tabs-progressivas-twygo). Qualquer suíte além de Identificação começa por aqui —
   * e por isso tem que pagar o `JourneyListPage.excluirPorNome_safe` no fim.
   */
  async criar(nome: string): Promise<string> {
    await this.goToCreate();
    await this.fillName(nome);
    await fecharAvisosTwygo(this.page);
    await this.getSaveButton().click();
    await expect(this.page).toHaveURL(/\/journeys\/\d+\/edit/, { timeout: 60_000 });
    return this.page.url().match(/\/journeys\/(\d+)\//)?.[1] ?? '';
  }

  getNameInput(): Locator {
    return this.page.getByPlaceholder('Digite o nome da jornada');
  }

  getSaveButton(): Locator {
    return this.page.getByTestId('identification-save-button');
  }

  /** Mensagem de erro de campo do Chakra (ex.: "O nome da jornada é obrigatório"), exibida no submit. */
  getFieldError(): Locator {
    return this.page.locator('.chakra-form__error-message');
  }

  // O nome acessível tem ESPAÇO antes do asterisco ("Duração *") — verificado no snapshot do run de 03/08.
  getDurationInput(): Locator {
    return this.page.getByRole('spinbutton', { name: /^Duração\s*\*?$/ });
  }

  // Os 4 dropdowns da identificação são <select> NATIVOS, e os <label> não estão associados a eles
  // (getByLabel não resolve — foi o que derrubou TC7/TC9 em 03/08). Não há data-test-id no recon, então
  // ancoramos cada select numa opção sua: é o identificador mais estável disponível, e os textos das
  // opções são literais que a própria AT documenta.
  private selectByOption(optionText: string): Locator {
    return this.page.locator(`select:has(option:text-is("${optionText}"))`);
  }

  getStatusControl(): Locator {
    return this.selectByOption('Em desenvolvimento');
  }

  getVisibilityControl(): Locator {
    return this.selectByOption('Inscritos');
  }

  getUnitControl(): Locator {
    return this.selectByOption('Dias');
  }

  // Switch Chakra: o <input> é oculto e o <label> intercepta o pointer event, então click no
  // role=checkbox não alterna nem com force:true ("Clicking the checkbox did not change its state",
  // run de 03/08). Padrão da casa = clicar no <label class="chakra-switch"> — skill
  // interagir-switch-chakra-twygo. Este switch não tem data-test-id, então ancoramos pelo input filho.
  getExtendDurationSwitch(): Locator {
    return this.page
      .locator('label.chakra-switch')
      .filter({ has: this.page.locator('input#settings\\.prolong_by_tasks') });
  }

  /**
   * Idempotente: só clica se o estado atual não bate. `data-checked` no label = ON (ausente = OFF).
   *
   * ⚠️ Este switch NÃO alterna com clique real. Sonda no harness em 03/08, 1 tentativa por teste
   * (contexto limpo, sem carona de scroll entre tentativas) — `track.click()`, `track.click({force})`,
   * `scrollIntoViewIfNeeded+click`, `thumb.click()` e `label.click()` **todos** deixaram o input em
   * `checked=false`, sem erro nenhum. Só `dispatchEvent('click')` alterna (e aí `data-checked=""` e
   * Duração/Unidade ficam disabled).
   *
   * Mesma família do menuitem de popper Chakra: o handler do React não reage ao evento confiável do
   * Playwright. A skill `interagir-switch-chakra-twygo` (clicar no label com `force`) descreve os
   * switches COM `data-test-id` no label, dos widgets — não vale aqui.
   */
  async setExtendDuration(on: boolean): Promise<void> {
    const isOn = (await this.getExtendDurationSwitch().getAttribute('data-checked')) !== null;
    if (isOn !== on) {
      await this.page.locator('input#settings\\.prolong_by_tasks').dispatchEvent('click');
    }
  }

  // O `data-test-id` journey-quick-adjust-slider-input está numa <div> SEM texto — asserção de texto
  // nele sempre falha. A unidade aparece no NOME ACESSÍVEL do slider ("Ajuste rápido (Dias)"), que é
  // o que a AT documenta ("Ajuste rápido (semanas)", "Ajuste rápido (dias)"...).
  getQuickAdjustmentSlider(): Locator {
    return this.page.getByRole('slider', { name: /Ajuste rápido/i });
  }

  async fillName(value: string): Promise<void> {
    await this.getNameInput().fill(value);
    await this.getNameInput().blur();
  }

  /**
   * "Duração" é type="text" com sanitização de entrada, e `fill()` não serve: o clear interno do fill
   * dispara o sanitizador, que repõe um valor, e o texto digitado acaba CONCATENADO ("1" + "0" = "10").
   * Medido em 03/08. Aqui replicamos edição de usuário: selecionar tudo → apagar → digitar.
   */
  async fillDuration(value: string): Promise<void> {
    const el = this.getDurationInput();
    await el.click();
    await el.press('ControlOrMeta+a');
    await el.press('Delete');
    if (value) await el.pressSequentially(value);
    await el.blur();
  }

  async selectStatus(value: string): Promise<void> {
    await this.selectLabeledOption(this.getStatusControl(), value);
  }

  async selectVisibility(value: string): Promise<void> {
    await this.selectLabeledOption(this.getVisibilityControl(), value);
  }

  async selectUnit(value: string): Promise<void> {
    await this.selectLabeledOption(this.getUnitControl(), value);
  }

  // Em <select> nativo as <option> já estão no DOM — não precisa (nem pode) abrir o dropdown pra conferir
  // ausência de opção, e clicar abriria o popup nativo do SO, que o Playwright não fecha.
  expectOptionAbsent(control: Locator, option: string): Locator {
    return control.locator(`option:text-is("${option}")`);
  }

  // "Tocar sem selecionar" num <select> nativo = focar e sair, sem abrir popup do SO.
  async touchWithoutSelecting(control: Locator): Promise<void> {
    await control.focus();
    await control.blur();
  }

  private async selectLabeledOption(control: Locator, value: string): Promise<void> {
    await control.selectOption({ label: value });
  }
}
