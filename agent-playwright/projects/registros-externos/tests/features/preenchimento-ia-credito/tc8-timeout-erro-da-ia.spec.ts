import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { AiAutofillPage } from '../../../pages/AiAutofillPage.js';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';

const SUITE = data.suiteName;

/**
 * Simula a IA indisponível interceptando o `ai_fill` com 500 (sem custo de
 * crédito — a request real nunca chega ao back). Valida o toast de erro
 * genérico e que os campos não são alterados.
 */
test.describe(SUITE, () => {
  test('Validar tratamento de timeout/erro da IA', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar tratamento de timeout/erro da IA');
    await allure.severity('critical');

    const ai = new AiAutofillPage(page, getOrgId());

    await allure.step('Pré: mockar /records/ai_fill com 500', async () => {
      await page.route('**/records/ai_fill', (route) =>
        route.fulfill({ status: 500, contentType: 'application/json', body: '{}' }),
      );
    });

    await allure.step('1. Acessar form "Adicionar registro" como Admin → card visível', async () => {
      await ai.goto();
      await expect(ai.cardTitle()).toBeVisible();
    });

    await allure.step('2. Upload + acionar "Preencher com IA" → toast de erro, campos inalterados', async () => {
      await ai.uploadEvidence(data.evidencePdfPath);
      await ai.clickAutofill();

      await expect(ai.toast(data.text.errorToastTitle)).toBeVisible({ timeout: 15_000 });
      // Campos não alterados: Tipo de experiência e Categorias seguem vazios.
      expect(await ai.readCreatableValue('Tipo de experiência')).toBe('');
      expect(await ai.readCreatableValue('Categorias')).toBe('');
    });
  });
});
