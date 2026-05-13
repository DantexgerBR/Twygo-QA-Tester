// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: requer org com contrato sem 'Gestão de Painéis'.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Beta / Launch', () => {
  test("Bloqueio de contrato no modelo 'Painéis do usuário' do modo de uso", async ({
    page,
    step,
  }) => {
    test.fixme(
      true,
      "seed ausente: requer org com contrato sem 'Gestão de Painéis'. No form de Modo de uso, o modelo 'Painéis do usuário' deve aparecer bloqueado/oculto. Ver _README.md (a ser criado se necessário).",
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Beta / Launch');
    await allure.story("Bloqueio de contrato no modelo 'Painéis do usuário' do modo de uso");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Acessar modo de uso → modelo "Painéis do usuário" bloqueado', async () => {
      expect(true).toBe(true);
    });
  });
});
