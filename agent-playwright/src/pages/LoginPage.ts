import type { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage.js';

export class LoginPage extends BasePage {
  readonly path = '/login';

  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorAlert: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel(/e-?mail/i);
    this.passwordInput = page.getByLabel(/senha|password/i);
    this.loginButton = page.getByRole('button', { name: /entrar|login/i });
    this.errorAlert = page.getByRole('alert');
  }

  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async getErrorMessage(): Promise<string> {
    return (await this.errorAlert.textContent())?.trim() ?? '';
  }
}
