import { test, expect } from '../../src/fixtures/custom-fixtures.js';
import { users, expectedMessages } from '../../src/fixtures/test-data.js';

test.describe('Autenticação', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.waitForReady();
  });

  test('login com credenciais válidas', async ({ loginPage, page }) => {
    await loginPage.login(users.validUser.email, users.validUser.password);

    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('button', { name: /perfil/i })).toBeVisible();
    await expect(page.getByText(expectedMessages.welcome)).toBeVisible();
  });

  test('login com credenciais inválidas', async ({ loginPage }) => {
    await loginPage.login(users.invalidUser.email, users.invalidUser.password);

    await expect(loginPage.errorAlert).toBeVisible();
    const message = await loginPage.getErrorMessage();
    expect(message).toContain(expectedMessages.invalidCredentials);
  });
});
