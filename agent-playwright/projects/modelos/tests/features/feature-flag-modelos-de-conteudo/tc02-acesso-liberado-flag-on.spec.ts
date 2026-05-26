import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-21): mesmo problema do TC1 — sem FLIPPER_ACCESS no env.
// Spec implementaria: ensureFlipperActor(enabled=true) → navegar dashboard →
// validar submenu "Modelos de conteúdo" visível + click redireciona pra /content_models.
// Destinatário: QA Lead (elevar user OU dedicar user com flag elevada).
test.describe.fixme('Feature flag modelos_de_conteudo', () => {
  test('Acesso liberado com flag habilitada', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Feature flag modelos_de_conteudo');
    await allure.story('Acesso liberado com flag habilitada');
    await allure.severity('critical');

    await expect(page).toHaveURL(/dashboard/);
  });
});
