// spec: testsuite XML "Trial" → testcase "Criação de trial via URL com painéis pré-definidos"
// seed: tests/seed.spec.ts
//
// Coberto pelo playbook `provisionar-trial-projeto-twygo` (manual+Claude).
// Ver _README.md desta pasta e a skill em `.claude/skills/provisionar-trial-projeto-twygo/`.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Trial', () => {
  test('Criação de trial via URL com painéis pré-definidos', async ({ step }) => {
    test.fixme(
      true,
      'Coberto pelo playbook `provisionar-trial-projeto-twygo` (manual+Claude via /new/register/steps). ' +
        'O playbook (passos 1-8) é o equivalente automatizado-assistido deste TC: ' +
        '(1) DB update em organization_icps.icp5, (3) wizard de criação via URL, ' +
        '(5) executor confirma URL pós-unlock, (6-7) flags+contrato, ' +
        '(8) gravação em data/trial-env.json. As asserções deste TC ' +
        '("Trial criado com sucesso", "painéis pré-definidos aparecem na lista", ' +
        '"menu acessível como aluno") são validadas como side-effects do playbook.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Trial');
    await allure.story('Criação de trial via URL com painéis pré-definidos');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    await allure.label('coveredBy', 'provisionar-trial-projeto-twygo');

    await step('1. Coberto pelo playbook — ver provisionar-trial-projeto-twygo', async () => {
      expect(true).toBe(true);
    });
  });
});
