// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: requer perfil aluno (ver dashboard-visao-do-aluno/_README.md).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Feature flag', () => {
  test('Feature flag habilitada com painéis criados - menu do aluno acessível', async ({
    step,
  }) => {
    test.fixme(true, 'seed ausente: requer credencial de perfil Aluno. Ver dashboard-visao-do-aluno/_README.md.');

    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story('Feature flag habilitada com painéis criados - menu do aluno acessível');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Aluno acessa /play com flag on + painéis criados → menu acessível', async () => {
      expect(true).toBe(true);
    });
  });
});
