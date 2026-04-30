import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';
import { TEST_IDS } from '../utils/testIds.js';

/**
 * Página da aba "Configurações" do módulo Créditos de IA (Super Admin).
 * URL: /o/{orgId}/ai_consumption_analysis?tab=settings
 *
 * Contém a tabela de ambientes com as colunas:
 * - Ambiente
 * - Acesso de IA ativo
 * - Herdar configurações do principal
 * - Ações (ícone edit)
 */
export class CreditosIaSettingsPage extends BasePage {
  readonly path = '/o/36602/ai_consumption_analysis?tab=settings';

  readonly listContainer: Locator;

  constructor(page: Page) {
    super(page);
    this.listContainer = page.getByTestId(
      TEST_IDS.aiConsumptionSettings.list.container,
    );
  }

  inheritSwitch(envId: string | number): Locator {
    return this.page.getByTestId(
      TEST_IDS.aiConsumptionSettings.list.inheritFromPrimarySwitch(envId),
    );
  }

  aiAccessSwitch(envId: string | number): Locator {
    return this.page.getByTestId(
      TEST_IDS.aiConsumptionSettings.list.aiAccessSwitch(envId),
    );
  }

  /**
   * O edit-button não tem envId no test-id — há um por linha. Usamos o switch
   * de herança como âncora para localizar a linha e dali o botão de edição.
   */
  editButtonForEnv(envId: string | number): Locator {
    const inheritSwitch = this.inheritSwitch(envId);
    return inheritSwitch
      .locator('xpath=ancestor::tr | ancestor::*[self::div][@role="row"]')
      .first()
      .getByTestId(TEST_IDS.aiConsumptionSettings.list.editButton);
  }

  async openEnvironmentEdit(envId: string | number): Promise<void> {
    await this.editButtonForEnv(envId).click();
  }
}
