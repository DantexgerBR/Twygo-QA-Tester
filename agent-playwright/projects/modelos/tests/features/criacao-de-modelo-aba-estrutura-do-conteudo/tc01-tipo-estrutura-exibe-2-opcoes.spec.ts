import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Tipo de estrutura exibe 2 opções', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Tipo de estrutura exibe 2 opções');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir modelo seedado na aba Estrutura', async () => {
      await editPage.gotoFirstModelEditStructure();
    });

    await allure.step('2. Ler options do <select> nativo "Tipo de estrutura"', async () => {
      const options = await editPage.tipoEstruturaOptions();
      // Filtra placeholder ("" ou "Selecione...") e mantém só os literais esperados
      const labels = options.map((o) => o.trim()).filter(Boolean);
      expect(labels).toEqual(
        expect.arrayContaining([
          'Atividades sequenciais (1 nível)',
          'Atividades agrupadas por módulos (2 níveis)',
        ]),
      );
    });
  });
});
