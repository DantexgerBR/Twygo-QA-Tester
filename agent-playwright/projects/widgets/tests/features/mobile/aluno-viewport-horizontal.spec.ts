// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: requer perfil Aluno (ver dashboard-visao-do-aluno/_README.md).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

// Viewport horizontal Mobile típico (rotacionado): 915x412
test.use({ viewport: { width: 915, height: 412 } });

test.describe('Mobile', () => {
  test('Visualização do aluno em viewport Mobile horizontal', async ({ page, step }) => {
    test.fixme(
      true,
      'seed ausente: requer credencial de perfil Aluno (ver dashboard-visao-do-aluno/_README.md).',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Mobile');
    await allure.story('Visualização do aluno em viewport Mobile horizontal');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Acessar /play no viewport Mobile horizontal (915x412)', async () => {
      await page.goto('/play?menu_id=play');
      await expect(page.locator('body')).toBeVisible();
    });
  });
});
