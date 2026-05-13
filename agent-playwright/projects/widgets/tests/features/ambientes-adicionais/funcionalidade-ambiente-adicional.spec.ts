// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Ambientes adicionais', () => {
  test('Funcionalidade de Painéis em ambiente adicional', async ({ step }) => {
    test.fixme(true, 'Infraestrutura de ambiente adicional não configurada. Ver _README.md.');

    await allure.epic('Twygo - Widgets');
    await allure.feature('Ambientes adicionais');
    await allure.story('Funcionalidade de Painéis em ambiente adicional');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Acessar Painéis em ambiente adicional → tab disponível', async () => {
      expect(true).toBe(true);
    });
  });
});
