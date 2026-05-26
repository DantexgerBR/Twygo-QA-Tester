import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-21): bloqueio idêntico ao TC1 — sem env adicional pareado.
// Spec implementaria isolamento bidirecional: criar no adicional, validar
// que principal não vê. Destinatário: DevOps provisionar tenant pareado
// + QA Lead orquestrar.
test.describe.fixme('Ambientes adicionais - Modelos', () => {
  test('Modelos criados no adicional não aparecem no principal', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Ambientes adicionais - Modelos');
    await allure.story('Modelos criados no adicional não aparecem no principal');
    await allure.severity('high');

    await expect(page).toHaveURL(/.*/);
  });
});
