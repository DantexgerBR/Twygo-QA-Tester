import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage.js';
import { DashboardPage } from '../../src/pages/DashboardPage.js';

test.describe("Autenticação de Usuários", () => {
  test("Login com credenciais válidas", async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    await loginPage.goto();
    await loginPage.emailInput.fill("user@example.com");
    await loginPage.passwordInput.fill("SecurePassword123");
    await loginPage.loginButton.click();
    await page.waitForURL(/.*/);
    await expect(page).toHaveURL(new RegExp("/dashboard"));
    await expect(dashboardPage.userProfileMenu).toBeVisible();
    await expect(dashboardPage.welcomeMessage).toContainText("Bem-vindo");
  });

  test("Login com credenciais inválidas", async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.emailInput.fill("user@example.com");
    await loginPage.passwordInput.fill("WrongPassword");
    await loginPage.loginButton.click();
    await expect(loginPage.errorAlert).toBeVisible();
    await expect(loginPage.errorAlert).toContainText("Credenciais inválidas");
    await expect(page).toHaveURL(new RegExp("/login"));
  });
});
