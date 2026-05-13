// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME aplicado (ver _README.md desta pasta).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { exibirWidgetPorAbaData as data } from './exibir-widget-por-aba.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Dashboard - Visão do aluno', () => {
  test('Exibição de um widget por aba', async ({ page, step }) => {
    test.fixme(
      true,
      'seed ausente: requer credencial Aluno + painel com 5 abas, cada uma com 1 widget configurado. Ver _README.md desta pasta.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story('Exibição de um widget por aba');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Acessar painel do aluno e validar 5 abas', async () => {
      await page.goto('/play?menu_id=play');
      const tabs = page.getByRole('tab');
      await expect(tabs).toHaveCount(data.expectedTabsCount);
    });

    await step('2. Navegar entre as abas e verificar o widget de cada uma', async () => {
      // REVISAR: implementar quando seed disponível (cada aba tem 1 widget específico)
    });
  });
});
