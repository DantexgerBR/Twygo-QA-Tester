import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-21): bloqueado pelo mesmo motivo do TC1/TC2 — sem FLIPPER_ACCESS.
// Spec implementaria: iniciar com flag OFF + sessão aberta → ensureFlipperActor(on)
// em paralelo → reload página → validar que submenu "Modelos de conteúdo"
// aparece pós-cache propagation (skill testar-feature-flag-twygo: usar
// expect.toPass com reload em intervalos de 2-5s pra cobrir delay de cache).
// Destinatário: QA Lead (mesma elevação requerida do TC1/TC2).
test.describe.fixme('Feature flag modelos_de_conteudo', () => {
  test('Transição off → on durante a sessão', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Feature flag modelos_de_conteudo');
    await allure.story('Transição off → on durante a sessão');
    await allure.severity('medium');

    await expect(page).toHaveURL(/dashboard/);
  });
});
