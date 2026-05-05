// Testsuite: Runner para migrar o modo de uso agente de atendimento antigo e sincronizar
// REVISAR_MANUAL: o testcase valida execução de Runner backend (script de
// migração) — não tem UI direta. Precisa endpoint/comando administrativo + DB
// query pra confirmar migração.

import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Runner para migrar o modo de uso agente de atendimento antigo e sincronizar', () => {
  test('Runner para migrar o modo de uso agente de atendimento antigo e sincronização já ativada', async () => {
    test.fixme(true, 'Validação de Runner backend requer endpoint admin + DB query — REVISAR_MANUAL');
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Runner para migrar o modo de uso agente de atendimento antigo e sincronizar');
    await allure.story('Runner para migrar o modo de uso agente de atendimento antigo e sincronização já ativada');
    await allure.severity('critical');
  });
});
