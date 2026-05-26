// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME — ver _README.md desta pasta.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Logs', () => {
  test('Log de adição/remoção de widget', async ({ step }) => {
    test.fixme(true, 'UI de admin de logs não mapeada. Ver _README.md.');

    await allure.epic('Twygo - Widgets');
    await allure.feature('Logs');
    await allure.story('Log de adição/remoção de widget');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Adicionar/remover widget + reposicionar → logs "criação", "exclusão", "atualização"', async () => {
      expect(true).toBe(true);
    });
  });
});
