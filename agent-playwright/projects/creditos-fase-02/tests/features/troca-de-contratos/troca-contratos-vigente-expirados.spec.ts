// Testsuite: Troca de Contratos
// REVISAR_MANUAL: 4 steps com dependência de DATA (contrato vigente até hoje,
// novo contrato a partir de amanhã) — time-travel não é automatizável só via UI.
// Steps 3-4 também envolvem ambiente herdado/independente.

import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Troca de Contratos', () => {
  test('Troca de Contrato: Vigente x Expirados', async () => {
    test.fixme(true, 'Requer simulação de data (contratos com vigência hoje/amanhã) — REVISAR_MANUAL');
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Troca de Contratos');
    await allure.story('Troca de Contrato: Vigente x Expirados');
    await allure.severity('critical');
  });
});
