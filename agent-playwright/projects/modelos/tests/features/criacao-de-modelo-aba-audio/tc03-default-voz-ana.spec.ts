import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Áudio', () => {
  test('Default voz "Ana"', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Áudio');
    await allure.story('Default voz "Ana"');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Áudio em modelo seedado', async () => {
      await editPage.gotoFirstModelEditAudio();
    });

    await allure.step('2. Validar radio "Ana" marcado por padrão', async () => {
      expect(await editPage.audioRadioByValue('Ana').isChecked()).toBe(true);
      expect(await editPage.audioRadioByValue('Cris').isChecked()).toBe(false);
      expect(await editPage.audioRadioByValue('Carlos').isChecked()).toBe(false);
      expect(await editPage.audioRadioByValue('Morgan').isChecked()).toBe(false);
    });
  });
});
