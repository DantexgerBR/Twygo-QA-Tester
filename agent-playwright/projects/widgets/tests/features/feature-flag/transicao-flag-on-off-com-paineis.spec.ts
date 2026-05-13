// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: transição requer mudança runtime da feature flag.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Feature flag', () => {
  test('Transição: flag habilitada -> desabilitada com painéis aplicados', async ({ step }) => {
    test.fixme(
      true,
      'seed ausente: requer (1) toggle runtime da feature flag em um env (não suportado pelos envs estáticos atuais — staging-widgets tem flag on, staging-widgets-disabled tem flag off; mas não há env para "transição"); (2) perfil aluno. Caminho: DevOps preparar env com flag mutável OU rodar via API/Super Admin.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Feature flag');
    await allure.story('Transição: flag habilitada -> desabilitada com painéis aplicados');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Estado inicial: flag on + painéis + menu visível', async () => {
      expect(true).toBe(true);
    });

    await step('2. Desabilitar flag → menu some na visão do aluno', async () => {
      expect(true).toBe(true);
    });
  });
});
