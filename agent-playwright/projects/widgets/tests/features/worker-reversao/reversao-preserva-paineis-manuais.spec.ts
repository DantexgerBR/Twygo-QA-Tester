// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Worker - Reversão', () => {
  test('Reversão preserva painéis criados manualmente', async ({ step }) => {
    test.fixme(
      true,
      'Out-of-scope para Playwright: validar preservação de painéis manuais é teste de DB. Ver _README.md desta pasta.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Worker - Reversão');
    await allure.story('Reversão preserva painéis criados manualmente');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Painel Manual A permanece após reversão', async () => {
      expect(true).toBe(true);
    });
  });
});
