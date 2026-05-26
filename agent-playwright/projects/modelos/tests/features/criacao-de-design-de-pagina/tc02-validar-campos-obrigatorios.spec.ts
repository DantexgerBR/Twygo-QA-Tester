import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignPageEditPage } from '../../../pages/DesignPageEditPage.js';

test.describe('Criação de Design de Página', () => {
  test('Validações negativas dos campos obrigatórios — Página (matriz A)', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Página');
    await allure.story('Validações negativas dos campos obrigatórios — Página (matriz A)');
    await allure.severity('critical');

    const dp = new DesignPageEditPage(page);

    const matrix = [
      { campo: 'Nome', preencher: { sequencia: '1' } },
      { campo: 'Sequência', preencher: { nome: `Design TC2 ${Date.now()}` } },
      { campo: 'Tudo vazio', preencher: {} },
    ];

    for (const row of matrix) {
      await allure.step(`[A] Faltando ${row.campo} → save bloqueado`, async () => {
        await dp.gotoFromFirstModel();
        if ('nome' in row.preencher && row.preencher.nome) {
          await dp.nameInput().fill(row.preencher.nome);
        }
        if ('sequencia' in row.preencher && row.preencher.sequencia) {
          await dp.sequenceInput().fill(row.preencher.sequencia);
        }
        await dp.save();
        await page.waitForTimeout(2000);
        // Invariante: URL permanece em /new (validação bloqueou)
        await expect(page, `[A] Faltando ${row.campo}: esperava URL permanecer em /new`).toHaveURL(
          /template_designs\/new/,
          { timeout: 5_000 },
        );
      });
    }
  });
});
