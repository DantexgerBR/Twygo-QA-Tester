// spec: testsuite XML
// seed: tests/seed.spec.ts

// Acesso Super Admin (/admin) para validar que a funcionalidade
// 'Gestão de Painéis' está disponível na tabela de preços/contrato.
// Não modifica configuração — apenas valida presença (leitura).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { SuperAdminPage } from '../../../../../src/pages/SuperAdminPage.js';
import { funcionalidadeTabelaPrecosContratoData as data } from './funcionalidade-tabela-precos-contrato.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Beta / Launch', () => {
  test('Funcionalidade na tabela de preços e contrato', async ({ page, step }) => {
    test.fixme(
      true,
      "REVISAR: assert exato depende do nome da funcionalidade na tabela ativa do env staging-widgets — confirmar com QA Lead se 'Gestão de Painéis' é o label correto antes de remover este fixme. Spec preparado pra validar presença na lista de funcionalidades do plano ativo.",
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Beta / Launch');
    await allure.story('Funcionalidade na tabela de preços e contrato');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const superAdmin = new SuperAdminPage(page);

    await step('1. Abrir Super Admin', async () => {
      await superAdmin.openSuperAdmin();
    });

    await step("2. Abrir Subscription Plans e localizar plano ativo", async () => {
      await superAdmin.openSubscriptionPlans();
      // REVISAR: localizar plano ativo via coluna 'Ativo' = Sim e validar
      // que 'Gestão de Painéis' aparece como funcionalidade do plano.
      await expect(page.getByText(data.funcionalidade)).toBeVisible();
    });
  });
});
