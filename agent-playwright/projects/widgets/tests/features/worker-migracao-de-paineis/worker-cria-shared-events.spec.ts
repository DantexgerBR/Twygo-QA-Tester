// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Worker - Migração de painéis', () => {
  test('Worker cria shared events necessários', async ({ step }) => {
    test.fixme(
      true,
      'Out-of-scope para Playwright: testa criação de shared events pelo worker backend. Ver _README.md desta pasta.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Worker - Migração de painéis');
    await allure.story('Worker cria shared events necessários');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Worker cria shared events', async () => {
      expect(true).toBe(true);
    });
  });
});
