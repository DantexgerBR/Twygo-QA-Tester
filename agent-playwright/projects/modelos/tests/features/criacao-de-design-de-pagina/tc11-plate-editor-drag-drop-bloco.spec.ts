import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-22): drag and drop de blocos Plate requer 2+ blocos
// pré-existentes E seletor de drag handle do bloco — ambos pendentes de
// audit MCP. Implementação canônica usaria locator.dragTo() entre handles
// dos blocos, mas o seletor real do handle (data-slate-block? css específico?)
// precisa ser descoberto live.
// Destinatário: planner+generator em sessão livre OU audit MCP dedicado.
test.describe.fixme('Criação de Design de Página', () => {
  test('Plate Editor — drag and drop de bloco para reordenar', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Plate Editor — drag and drop de bloco para reordenar');
    await allure.severity('high');

    await expect(page).toHaveURL(/.*/);
  });
});
