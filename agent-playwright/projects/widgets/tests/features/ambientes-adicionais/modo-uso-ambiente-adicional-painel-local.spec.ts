// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Ambientes adicionais', () => {
  test('Modo de uso configurado em ambiente adicional usa painel local', async ({ step }) => {
    test.fixme(true, 'Infraestrutura de ambiente adicional não configurada. Ver _README.md.');

    await allure.epic('Twygo - Widgets');
    await allure.feature('Ambientes adicionais');
    await allure.story('Modo de uso configurado em ambiente adicional usa painel local');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Configuração isolada por ambiente', async () => {
      expect(true).toBe(true);
    });
  });
});
