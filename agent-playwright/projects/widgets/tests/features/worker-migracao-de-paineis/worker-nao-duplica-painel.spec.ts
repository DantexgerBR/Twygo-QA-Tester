// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Worker - Migração de painéis', () => {
  test('Worker não duplica painel quando organização já possui painel padrão', async ({ step }) => {
    test.fixme(
      true,
      'Out-of-scope para Playwright: testa idempotência de worker backend. Ver _README.md desta pasta.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Worker - Migração de painéis');
    await allure.story('Worker não duplica painel quando organização já possui painel padrão');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Execução repetida do worker mantém painel original', async () => {
      expect(true).toBe(true);
    });
  });
});
