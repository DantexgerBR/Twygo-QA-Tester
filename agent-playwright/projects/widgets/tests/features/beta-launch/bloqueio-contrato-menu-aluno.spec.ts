// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: requer org sem 'Gestão de Painéis' + perfil aluno.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Beta / Launch', () => {
  test('Bloqueio de contrato no menu do aluno', async ({ page, step }) => {
    test.fixme(
      true,
      "seed duplo ausente: (1) org sem 'Gestão de Painéis' no contrato; (2) credencial de perfil Aluno (ver dashboard-visao-do-aluno/_README.md). Spec valida que menu Painéis não aparece pro aluno quando contrato bloqueia.",
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Beta / Launch');
    await allure.story('Bloqueio de contrato no menu do aluno');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Aluno acessa /play → menu Painéis não disponível', async () => {
      expect(true).toBe(true);
    });
  });
});
