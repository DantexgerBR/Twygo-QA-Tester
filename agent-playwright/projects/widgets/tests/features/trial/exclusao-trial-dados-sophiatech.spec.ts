// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Trial', () => {
  test('Exclusão de trial: dados pré-definidos da SophiaTech removidos', async ({ step }) => {
    test.fixme(
      true,
      'Exclusão de trial muda estado Super Admin global. Setup de isolamento pendente. Ver _README.md.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Exclusão de trial: dados pré-definidos da SophiaTech removidos');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Trial excluído → painéis e dados SophiaTech removidos', async () => {
      expect(true).toBe(true);
    });
  });
});
