// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Banco histórico', () => {
  test('Worker registra log de tabelas processadas', async ({ step }) => {
    test.fixme(
      true,
      'Out-of-scope para Playwright: logs de auditoria de worker pertencem ao agent-db. Ver _README.md desta pasta.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Banco histórico');
    await allure.story('Worker registra log de tabelas processadas');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Log de auditoria contém tabelas processadas', async () => {
      expect(true).toBe(true);
    });
  });
});
