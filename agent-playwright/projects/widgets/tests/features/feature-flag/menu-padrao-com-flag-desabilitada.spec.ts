// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: requer setup de menu "Padrão" + flag off em runtime.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Feature flag', () => {
  test("Menu marcado como 'Padrão' com flag desabilitada", async ({ step }) => {
    test.fixme(
      true,
      "seed ausente: requer menu marcado como 'Padrão' + transição flag on→off no mesmo env. Mesmo bloqueio de transicao-flag-on-off-com-paineis.spec.ts.",
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story("Menu marcado como 'Padrão' com flag desabilitada");
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Menu Padrão definido + flag off → comportamento esperado', async () => {
      expect(true).toBe(true);
    });
  });
});
