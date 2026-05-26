// MD canônico §"Trial - Cópia e exclusão de base de conhecimento" — TC2
// seed: tests/seed.spec.ts

import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Trial - Cópia e exclusão de base de conhecimento', () => {
  // fixme: pré-condição ausente — Trial dedicada do projeto NÃO provisionada
  // (mesma causa raiz do TC1). Skills relacionadas:
  //   - provisionar-trial-projeto-twygo (playbook de provisionamento)
  //   - testar-exclusao-dados-trial-twygo (fluxo Sophia widget → Excluir info)
  // QA: rodar playbook → remover fixme.
  test.fixme('TC2 — Exclusão total via Sophia remove dados de base de conhecimento', async () => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Trial - Cópia e exclusão de base de conhecimento');
    await allure.story('TC2 — Exclusão total via Sophia remove dados de base de conhecimento');
    await allure.severity('normal');
  });
});
