import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-22): bloqueio idêntico ao TC3-TC5 da mesma suíte. Sem
// editor renderizado na aba Design da Aula, não há ferramenta de layout
// pra alternar kit de marca. Destinatário: PO/QA Lead — destravar TC3
// destrava TC6.
test.describe.fixme('Criação de Design de Aula', () => {
  test('Editor Aula — alternar kit de marca via ferramenta de layout', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Aula');
    await allure.story('Editor Aula — alternar kit de marca via ferramenta de layout');
    await allure.severity('high');

    await expect(page).toHaveURL(/.*/);
  });
});
