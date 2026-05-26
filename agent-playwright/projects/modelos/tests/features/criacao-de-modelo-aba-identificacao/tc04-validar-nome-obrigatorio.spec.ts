import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';
import { MATRIX_PREFIX, tc04NomeMatrixData } from './tc04-validar-nome-obrigatorio.data.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  // Cleanup obrigatório: matrix cria ~4 modelos por execução com prefix MATRIX_PREFIX.
  // Sem cleanup, regressão acumula 4+ modelos por run e contamina TCs subsequentes
  // (suite 9 Audit identificou esse padrão na rodada 2026-05-22).
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: 'outputs/.auth/storage.json' });
    const page = await ctx.newPage();
    const ep = new ContentModelEditPage(page);
    await ep.deleteAllByNamePrefix(MATRIX_PREFIX);
    await ctx.close();
  });

  test('Validações negativas do campo Nome (matriz A-D)', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Validações negativas do campo Nome (matriz A-D)');
    await allure.severity('critical');

    const editPage = new ContentModelEditPage(page);

    for (const row of tc04NomeMatrixData.matrix) {
      await allure.step(`[${row.categoria}] "${row.descricaoEntrada}"`, async () => {
        await editPage.gotoNew();
        await editPage.nameInput().fill(row.entrada);
        await editPage.selectKitDeMarca();
        await editPage.save();
        await page.waitForTimeout(2500);

        if (row.esperaBloqueio) {
          await expect(page, `[${row.categoria}] esperava bloqueio (URL em /new)`).toHaveURL(
            /\/content_models\/new/,
            { timeout: 5_000 },
          );
        } else {
          await expect(page, `[${row.categoria}] esperava save bem-sucedido`).not.toHaveURL(
            /\/content_models\/new$/,
            { timeout: 5_000 },
          );
        }
      });
    }
  });
});
