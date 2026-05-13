// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Logs', () => {
  test('Log de edição de aba', async ({ step }) => {
    test.fixme(true, 'UI de admin de logs não mapeada. Ver _README.md.');

    await allure.epic('Twygo - Widgets');
    await allure.feature('Logs');
    await allure.story('Log de edição de aba');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Renomear aba → log "edição da aba" registrado', async () => {
      expect(true).toBe(true);
    });
  });
});
