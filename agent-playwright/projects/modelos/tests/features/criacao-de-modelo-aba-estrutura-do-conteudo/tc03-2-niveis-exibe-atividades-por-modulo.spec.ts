import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Estrutura do Conteúdo', () => {
  test('Selecionar "2 níveis" exibe campo de atividades por módulo', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Estrutura do Conteúdo');
    await allure.story('Selecionar "2 níveis" exibe campo de atividades por módulo');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir aba Estrutura', async () => {
      await editPage.gotoFirstModelEditStructure();
    });

    await allure.step('2. Selecionar "2 níveis"', async () => {
      await editPage.selectTipoEstrutura('Atividades agrupadas por módulos (2 níveis)');
    });

    await allure.step('3. Validar campo "Nº de atividades" aparece', async () => {
      await expect(editPage.atividadesPorModuloInput()).toBeVisible({ timeout: 5_000 });
    });

    await allure.step('cleanup: voltar para "1 nível"', async () => {
      await editPage.selectTipoEstrutura('Atividades sequenciais (1 nível)');
    });
  });
});
