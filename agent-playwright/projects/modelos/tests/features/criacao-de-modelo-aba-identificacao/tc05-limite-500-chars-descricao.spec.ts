import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  test('Validações negativas do campo Descrição (matriz B-D)', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Validações negativas do campo Descrição (matriz B-D)');
    await allure.severity('medium');

    const editPage = new ContentModelEditPage(page);
    const long500 = 'A'.repeat(500);
    const long501 = 'A'.repeat(501);

    const matrix = [
      {
        categoria: 'B',
        descricao: '500 caracteres (limite máximo)',
        entrada: long500,
        esperaTruncamento: false,
      },
      {
        categoria: 'B',
        descricao: '501 caracteres — input deve truncar em 500',
        entrada: long501,
        esperaTruncamento: true,
      },
      {
        categoria: 'C',
        descricao: 'acentos + especiais',
        entrada: 'Descrição @çãõ#$% ' + Date.now(),
        esperaTruncamento: false,
      },
      {
        categoria: 'C',
        descricao: 'quebras de linha preservadas',
        entrada: `linha 1\nlinha 2\nlinha 3 ${Date.now()}`,
        esperaTruncamento: false,
      },
      {
        categoria: 'D',
        descricao: 'XSS img onerror',
        entrada: `<img src=x onerror=alert(1)> ${Date.now()}`,
        esperaTruncamento: false,
      },
    ];

    for (const row of matrix) {
      await allure.step(`[${row.categoria}] ${row.descricao}`, async () => {
        await editPage.gotoNew();
        await editPage.descriptionTextarea().fill(row.entrada);
        const valor = await editPage.descriptionTextarea().inputValue();
        if (row.esperaTruncamento) {
          // Trunca em 500
          expect(valor.length, `[${row.categoria}] esperava trunc em 500`).toBeLessThanOrEqual(500);
        } else {
          // Preserva valor
          expect(valor.length, `[${row.categoria}] esperava preservar input`).toBe(row.entrada.length);
        }
      });
    }
  });
});
