// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Logs', () => {
  test('Log de criação de painel', async ({ step }) => {
    test.fixme(
      true,
      'UI de admin de logs não mapeada. Confirmar com QA Lead se existe rota OU se validação vai pro agent-db. Ver _README.md.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Logs');
    await allure.story('Log de criação de painel');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Criar painel via UI → log persistido com user_id, org_id, IP, timestamp', async () => {
      expect(true).toBe(true);
    });
  });
});
