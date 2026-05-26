// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Banco histórico', () => {
  test('Worker preserva registros de outras organizações', async ({ step }) => {
    test.fixme(
      true,
      'Out-of-scope para Playwright: isolamento por organization_id é teste de DB. Ver _README.md desta pasta.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Banco histórico');
    await allure.story('Worker preserva registros de outras organizações');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Outras orgs intactas após execução do worker', async () => {
      expect(true).toBe(true);
    });
  });
});
