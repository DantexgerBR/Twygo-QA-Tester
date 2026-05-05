// Testsuite: Alterar a fontes de conhecimento no modo de uso do agente de atendimento
// Testcases (5): Remoções, Inclusões, Desabilitado em contrato, Indexação desabilitada, Ambas habilitadas.
//
// DIAGNÓSTICO EMPÍRICO (2026-05-04):
// - URL alvo: `/o/36602/use_modes`. Carrega mas não expõe lista de modos via
//   selector simples — conteúdo é renderizado dinamicamente. Nenhum link
//   `/use_modes/.../edit` foi encontrado num spec exploratório, só a sidebar.
// - Sem POMs do submenu "Modo de uso > Menu > Modelo de página".
//
// Para automatizar (REVISAR_MANUAL):
//   1. Criar `UseModeListPage`/`UseModeEditPage`/`MenuEditPage` POMs.
//   2. Garantir um "modo de uso" seed em stage10 que tenha um Menu apontando
//      pra "Agente de atendimento" — ou implementar sub-fluxo de criação no
//      próprio teste (exige test-ids da etapa).
//   3. TC3, TC4 e TC5 step 2/3 dependem de combinações de estado que não são
//      reprodutíveis sem hooks backend (contrato sem feature, indexação OFF
//      em ambiente com agente, indexação em curso). Permanecem como casos
//      de QA manual.

import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

const FIXME_REASON = 'Requer navegação profunda Modo de uso > Menu > Modelo de página + criação de objetos — REVISAR_MANUAL';

test.describe('Alterar a fontes de conhecimento no modo de uso do agente de atendimento', () => {
  test('Modo de uso do agente de atendimento - Remoções de campos', async () => {
    test.fixme(true, FIXME_REASON);
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Alterar a fontes de conhecimento no modo de uso do agente de atendimento');
    await allure.story('Modo de uso do agente de atendimento - Remoções de campos');
    await allure.severity('critical');
  });

  test('Modo de uso do agente de atendimento - Inclusões de campos', async () => {
    test.fixme(true, FIXME_REASON);
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Alterar a fontes de conhecimento no modo de uso do agente de atendimento');
    await allure.story('Modo de uso do agente de atendimento - Inclusões de campos');
    await allure.severity('critical');
  });

  test('Modo de uso do agente de atendimento - Desabilitado em contrato pelo ambiente', async () => {
    test.fixme(true, FIXME_REASON);
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Alterar a fontes de conhecimento no modo de uso do agente de atendimento');
    await allure.story('Modo de uso do agente de atendimento - Desabilitado em contrato pelo ambiente');
    await allure.severity('critical');
  });

  test('Modo de uso do agente de atendimento - Indexação desabilitada', async () => {
    test.fixme(true, FIXME_REASON);
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Alterar a fontes de conhecimento no modo de uso do agente de atendimento');
    await allure.story('Modo de uso do agente de atendimento - Indexação desabilitada');
    await allure.severity('critical');
  });

  test('Modo de uso do agente de atendimento - Indexação e agente de atendimento habilitadas', async () => {
    test.fixme(true, FIXME_REASON);
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Alterar a fontes de conhecimento no modo de uso do agente de atendimento');
    await allure.story('Modo de uso do agente de atendimento - Indexação e agente de atendimento habilitadas');
    await allure.severity('critical');
  });
});
