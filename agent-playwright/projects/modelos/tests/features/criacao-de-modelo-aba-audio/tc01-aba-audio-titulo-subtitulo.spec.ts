import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Áudio', () => {
  test('Aba Áudio exibe título e subtítulo literais', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Áudio');
    await allure.story('Aba Áudio exibe título e subtítulo literais');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir modelo seedado na aba Áudio', async () => {
      await editPage.gotoFirstModelEditAudio();
    });

    await allure.step('2. Validar título e subtítulo literais', async () => {
      await expect(editPage.audioTitle()).toHaveText('Escolha a voz padrão para narrar as aulas');
      await expect(editPage.audioDescription()).toContainText(
        'Selecione a voz que melhor se adequa ao tom deste modelo',
      );
    });
  });
});
