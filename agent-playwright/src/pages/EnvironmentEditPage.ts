import type { Page, Locator } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { TEST_IDS } from '../utils/testIds.js';

const E = TEST_IDS.aiConsumptionSettings.edit;
const I = E.contentIndexing;

/**
 * Tela de edição de configuração de IA de um ambiente.
 * URL: /o/{orgId}/ai_consumption_analysis/{envId}/edit_additional_organization_permissions
 *
 * Sub-campos da seção "Indexação de conteúdo" (Período, datas, checkboxes Tipo,
 * Situação, Exceções) são renderizados condicionalmente apenas quando o toggle
 * mestre está habilitado. Quando há sincronização em andamento, o container fica
 * `aria-disabled="true"` e clicks normais são bloqueados visualmente — usar
 * `.click({ force: true })` nestes casos.
 */
export class EnvironmentEditPage extends BasePage {
  readonly path = '';

  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly syncAlert: Locator;

  // Indexação de conteúdo
  readonly contentIndexingMasterSwitch: Locator;
  readonly contentIndexingMasterInput: Locator;
  readonly periodSwitch: Locator;
  readonly periodStartDate: Locator;
  readonly periodEndDate: Locator;
  readonly periodConfirmation: Locator;
  readonly periodLimitedAlert: Locator;
  readonly exceptionsMultiselect: Locator;

  // Tipo de conteúdo (elegíveis)
  readonly typeCourse: Locator;
  readonly typeTrail: Locator;
  readonly typePackage: Locator;
  readonly assetText: Locator;
  readonly assetPage: Locator;
  readonly assetLesson: Locator;
  readonly assetStampedPdf: Locator;
  readonly assetVideo: Locator;
  readonly assetFiles: Locator;

  // Tipo de conteúdo (não elegíveis — disabled)
  readonly assetQuizDisabled: Locator;
  readonly assetExternalVideoDisabled: Locator;
  readonly assetScormDisabled: Locator;
  readonly assetGamesDisabled: Locator;

  // Situação
  readonly statusDevelopment: Locator;
  readonly statusReleased: Locator;
  readonly statusSuspended: Locator;

  // Modal RN37
  readonly creditsModal: Locator;
  readonly creditsModalConfirm: Locator;
  readonly creditsModalCancel: Locator;
  readonly creditsModalClose: Locator;
  readonly creditsModalSummary: Locator;
  readonly creditsModalCurrentBalance: Locator;

  constructor(page: Page) {
    super(page);
    this.saveButton = page.getByTestId(E.saveButton);
    this.cancelButton = page.getByTestId(E.cancelButton);
    this.syncAlert = page.locator('[role="alert"][data-status="warning"]');

    this.contentIndexingMasterSwitch = page.getByTestId(I.masterSwitch);
    this.contentIndexingMasterInput = page.locator(`#${I.masterSwitchInputId}`);
    this.periodSwitch = page.getByTestId(I.specificPeriodSwitch);
    this.periodStartDate = page.getByTestId(I.periodStartDateInput);
    this.periodEndDate = page.getByTestId(I.periodEndDateInput);
    this.periodConfirmation = page.getByTestId(I.periodConfirmation);
    this.periodLimitedAlert = page.getByTestId(I.periodLimitedAlert);
    this.exceptionsMultiselect = page.getByTestId(I.exceptionsMultiselect);

    this.typeCourse = page.getByTestId(I.type.course);
    this.typeTrail = page.getByTestId(I.type.trail);
    this.typePackage = page.getByTestId(I.type.package);
    this.assetText = page.getByTestId(I.asset.text);
    this.assetPage = page.getByTestId(I.asset.page);
    this.assetLesson = page.getByTestId(I.asset.lesson);
    this.assetStampedPdf = page.getByTestId(I.asset.stampedPdf);
    this.assetVideo = page.getByTestId(I.asset.video);
    this.assetFiles = page.getByTestId(I.asset.files);

    this.assetQuizDisabled = page.getByTestId(I.assetIneligible.quiz);
    this.assetExternalVideoDisabled = page.getByTestId(
      I.assetIneligible.externalVideo,
    );
    this.assetScormDisabled = page.getByTestId(I.assetIneligible.scorm);
    this.assetGamesDisabled = page.getByTestId(I.assetIneligible.games);

    this.statusDevelopment = page.getByTestId(I.status.development);
    this.statusReleased = page.getByTestId(I.status.released);
    this.statusSuspended = page.getByTestId(I.status.suspended);

    this.creditsModal = page.getByTestId(I.creditsModal.container);
    this.creditsModalConfirm = page.getByTestId(I.creditsModal.confirmButton);
    this.creditsModalCancel = page.getByTestId(I.creditsModal.cancelButton);
    this.creditsModalClose = page.getByTestId(I.creditsModal.closeButton);
    this.creditsModalSummary = page.getByTestId(I.creditsModal.summaryBox);
    this.creditsModalCurrentBalance = page.getByTestId(
      I.creditsModal.currentBalanceText,
    );
  }

  /**
   * Quando há sync em andamento, o container fica aria-disabled. Use isso
   * para condicionar steps que dependem de toggle habilitado.
   */
  async isSyncBlocking(): Promise<boolean> {
    return await this.syncAlert.isVisible().catch(() => false);
  }

  /**
   * Marca exclusivamente o checkbox `target`, desmarca os `others` que estiverem
   * checados, salva e confirma o modal RN37 se aparecer. Garante toggle mestre
   * habilitado antes. `force:true` é necessário porque o container pode ficar
   * `aria-disabled` quando o sync alert está visível — só chame quando
   * `!isSyncBlocking()`.
   */
  async markOnlyOneEligibleAndSave(target: Locator, others: Locator[]): Promise<void> {
    if (!(await this.contentIndexingMasterInput.isChecked())) {
      await this.contentIndexingMasterSwitch.click({ force: true });
      await expect(this.contentIndexingMasterInput).toBeChecked();
    }
    for (const other of others) {
      try {
        if (await other.isChecked()) {
          await other.click({ force: true });
        }
      } catch {
        // Outro pode não estar visível em ambientes herdados; segue.
      }
    }
    if (!(await target.isChecked())) {
      await target.click({ force: true });
    }
    await this.saveButton.click();
    if (await this.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
      await this.creditsModalConfirm.click();
      await expect(this.creditsModal).toBeHidden();
    }
  }
}
