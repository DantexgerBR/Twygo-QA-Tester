import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Imagem', () => {
  test('Default "Sem imagens, somente textos"', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Imagem');
    await allure.story('Default "Sem imagens, somente textos"');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Imagem em modelo seedado', async () => {
      await editPage.gotoFirstModelEditImage();
    });

    await allure.step('2. Validar radio-0 ("Sem imagens, somente textos") marcado por padrão', async () => {
      expect(await editPage.imageOptionRadio(0).isChecked()).toBe(true);
      // Outros 3 radios desmarcados
      expect(await editPage.imageOptionRadio(1).isChecked()).toBe(false);
      expect(await editPage.imageOptionRadio(2).isChecked()).toBe(false);
      expect(await editPage.imageOptionRadio(3).isChecked()).toBe(false);
    });
  });
});
