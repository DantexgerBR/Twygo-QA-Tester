import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-22): mesma situação do TC9 — seletor canônico do botão
// "Inserir logo" no toolbar do Plate Editor não confirmado via audit MCP.
// Após inserir, validação requer expectImageLoaded sobre o logo renderizado
// (helper já criado em src/utils/visualAsserts.ts).
test.describe.fixme('Criação de Design de Página', () => {
  test('Plate Editor — inserir logo via toolbar', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Plate Editor — inserir logo via toolbar');
    await allure.severity('high');

    // Esperado: criar Página + abrir Design + botão Logo no toolbar +
    // selecionar logo padrão + expectImageLoaded(logoInsertido).
    await expect(page).toHaveURL(/.*/);
  });
});
