import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Áudio', () => {
  test('Opções de voz disponíveis', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Áudio');
    await allure.story('Opções de voz disponíveis');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Áudio', async () => {
      await editPage.gotoFirstModelEditAudio();
    });

    await allure.step('2. Validar 4 cards de voz visíveis (Ana, Cris, Carlos, Morgan)', async () => {
      for (const voice of ['ana', 'cris', 'carlos', 'morgan'] as const) {
        await expect(editPage.audioVoiceCard(voice)).toBeVisible({ timeout: 5_000 });
      }
    });
  });
});
