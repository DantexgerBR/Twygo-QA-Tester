// spec: testsuite XML
// seed: tests/seed.spec.ts
//
// TC de transição flag ON → OFF com painéis APLICADOS na visão Aluno.
//
// Bloqueio atual: requer (a) painel + associação menu já criados na
// org `staging-widgets-disabled` (36989), (b) verificação na visão
// Aluno via ProfileSwitcher.switchToViaUrl('Aluno').
//
// O TOGGLE da flag em runtime já está destravado via skill
// `testar-feature-flag-twygo` (ensureFlipperActor) — falta apenas o
// SEED de dados (painel + menu) persistente nesse env.
//
// Caminho pra destravar:
//  1. QA Lead prepara seed: criar painel "Painel TC visão aluno" + menu
//     vinculado no useMode Aluno do staging-widgets-disabled (orgId 36989).
//  2. Trocar test.fixme por implementação:
//     - beforeAll: ensureFlipperActor enabled:true (flag ON)
//     - step 1: switchToViaUrl('Aluno') → expect menu Painéis visível
//     - step 2: revertFlag (flag OFF) → recarregar visão aluno
//                → expect menu Painéis ausente
//     - afterAll: revertFlag (restaura estado original)

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Feature flag', () => {
  test('Transição: flag habilitada -> desabilitada com painéis aplicados', async ({ step }) => {
    test.fixme(
      true,
      'seed ausente: requer painel + menu vinculado pré-criados na org 36989 (staging-widgets-disabled) E perfil Aluno via ProfileSwitcher. Toggle de flag em si já está destravado por testar-feature-flag-twygo — pendência é APENAS o seed de dados persistente.',
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
