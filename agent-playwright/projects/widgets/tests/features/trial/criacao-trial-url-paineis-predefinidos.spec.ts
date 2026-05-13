// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Trial', () => {
  test('Criação de trial via URL com painéis pré-definidos', async ({ step }) => {
    test.fixme(
      true,
      'Criação de trial requer setup Super Admin com impacto em estado global. Estratégia de revert/isolamento pendente. Ver _README.md.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Criação de trial via URL com painéis pré-definidos');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Super Admin cria trial via URL → painéis pré-definidos aparecem', async () => {
      expect(true).toBe(true);
    });
  });
});
