import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Imagem', () => {
  test('Aba Imagem exibe título e subtítulo literais', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Imagem');
    await allure.story('Aba Imagem exibe título e subtítulo literais');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir modelo seedado na aba Imagem', async () => {
      await editPage.gotoFirstModelEditImage();
    });

    await allure.step('2. Validar título e subtítulo literais', async () => {
      await expect(editPage.imageTitle()).toHaveText('Escolha o padrão de imagens para o modelo');
      await expect(editPage.imageDescription()).toContainText(
        'Selecione como as imagens serão incluídas nos cursos gerados com este modelo',
      );
    });
  });
});
