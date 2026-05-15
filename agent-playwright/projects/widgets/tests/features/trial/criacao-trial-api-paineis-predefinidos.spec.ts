// spec: testsuite XML "Trial" → testcase "Criação de trial via API com painéis pré-definidos"
// seed: tests/seed.spec.ts
//
// Decisão 2026-05-15: NÃO testamos criação via API. Cobertura via wizard
// `/new/register/steps` (mesmo fluxo do TC1), invocado pelo playbook
// `provisionar-trial-projeto-twygo` (manual+Claude). Override consciente
// do XML — o time decidiu que API endpoint `external_onboarding` é
// out-of-scope até existir suite de API dedicada.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Trial', () => {
  test('Criação de trial via API com painéis pré-definidos', async ({ step }) => {
    test.fixme(
      true,
      'Override do XML: criação de trial via API substituída por wizard ' +
        '`/new/register/steps` (TC1) executado pelo playbook ' +
        '`provisionar-trial-projeto-twygo`. Decisão time QA Twygo 2026-05-15: ' +
        'API endpoint `external_onboarding` fica fora do escopo Playwright ' +
        'até existir API test suite dedicada (sem prazo).',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Criação de trial via API com painéis pré-definidos');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');
    await allure.label('coveredBy', 'provisionar-trial-projeto-twygo');

    await step('1. Override do XML — cobertura via wizard (TC1 + playbook)', async () => {
      expect(true).toBe(true);
    });
  });
});
