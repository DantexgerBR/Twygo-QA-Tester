// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Banco histórico', () => {
  test('Worker HistoricBaseCron exclui registros de panel_tabs e panel_widgets da organização', async ({
    step,
  }) => {
    test.fixme(
      true,
      'Out-of-scope para Playwright: worker backend HistoricBaseCron — validar via agent-db ou backend test suite. Ver _README.md desta pasta.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Banco histórico');
    await allure.story(
      'Worker HistoricBaseCron exclui registros de panel_tabs e panel_widgets da organização',
    );
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Worker exclui registros', async () => {
      expect(true).toBe(true);
    });
  });
});
