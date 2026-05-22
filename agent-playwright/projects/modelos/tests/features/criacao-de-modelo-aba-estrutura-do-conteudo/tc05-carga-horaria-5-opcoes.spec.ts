import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Carga horária exibe 5 opções literais', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Carga horária exibe 5 opções literais');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Estrutura', async () => {
      await editPage.gotoFirstModelEditStructure();
    });

    await allure.step('2. Ler options de "Carga horária" e validar as 5 esperadas', async () => {
      const options = (await editPage.cargaHorariaOptionsLabels()).map((o) => o.trim()).filter(Boolean);
      expect(options).toEqual(expect.arrayContaining([...editPage.cargaHorariaOptions]));
    });
  });
});
