// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: requer perfil Aluno (ver dashboard-visao-do-aluno/_README.md).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.use({ viewport: { width: 412, height: 915 } });

test.describe('Mobile', () => {
  test('Visualização do aluno em viewport Mobile 412x915 (vertical)', async ({ page, step }) => {
    test.fixme(
      true,
      'seed ausente: requer credencial de perfil Aluno em staging-widgets (ver dashboard-visao-do-aluno/_README.md). Quando disponível, validar responsividade do /play em 412x915.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Mobile');
    await allure.story('Visualização do aluno em viewport Mobile 412x915 (vertical)');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Acessar /play no viewport 412x915', async () => {
      await page.goto('/play?menu_id=play');
    });

    await step('2. Validar scroll vertical e widgets reorganizados', async () => {
      // REVISAR: validar que widgets stackam verticalmente quando seed disponível
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
