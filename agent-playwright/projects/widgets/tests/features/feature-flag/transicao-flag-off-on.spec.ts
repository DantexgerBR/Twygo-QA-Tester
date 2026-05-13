// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: transição requer toggle runtime da feature flag.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Feature flag', () => {
  test('Transição: flag desabilitada -> habilitada', async ({ step }) => {
    test.fixme(
      true,
      'seed ausente: requer toggle runtime da flag (igual transicao-flag-on-off). Caminho: DevOps preparar env mutável OU teste via Super Admin/API.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story('Transição: flag desabilitada -> habilitada');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Estado inicial: flag off, módulo oculto', async () => {
      expect(true).toBe(true);
    });

    await step('2. Habilitar flag → módulo reativado', async () => {
      expect(true).toBe(true);
    });
  });
});
