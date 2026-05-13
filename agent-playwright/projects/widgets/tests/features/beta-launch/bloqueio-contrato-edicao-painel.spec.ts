// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME: requer org com contrato sem funcionalidade 'Gestão de Painéis' habilitada.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Beta / Launch', () => {
  test('Bloqueio de contrato na tela de edição de painel sem funcionalidade habilitada', async ({
    page,
    step,
  }) => {
    test.fixme(
      true,
      "seed ausente: requer organização com contrato sem 'Gestão de Painéis' habilitada. Caminhos possíveis: (a) Super Admin desabilita a funcionalidade do contrato vigente (tabela compartilhada — revert obrigatório); (b) novo env staging-widgets-no-feature criado por DevOps. Atualmente apenas staging-widgets (com flag) e staging-widgets-disabled (com módulo off) disponíveis — mas o último é diferente: feature flag desligada, não funcionalidade ausente do contrato.",
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Beta / Launch');
    await allure.story('Bloqueio de contrato na tela de edição de painel sem funcionalidade habilitada');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Acessar edição de painel com contrato bloqueado → tela de bloqueio padrão', async () => {
      expect(true).toBe(true);
    });
  });
});
