// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — out-of-scope Playwright (teste de API).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Trial', () => {
  test('Criação de trial via API com painéis pré-definidos', async ({ step }) => {
    test.fixme(
      true,
      'Out-of-scope para Playwright: validação via API direta pertence a uma API test suite ou contract test. Ver _README.md.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Criação de trial via API com painéis pré-definidos');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Trial criado via API → painéis aparecem no ambiente', async () => {
      expect(true).toBe(true);
    });
  });
});
