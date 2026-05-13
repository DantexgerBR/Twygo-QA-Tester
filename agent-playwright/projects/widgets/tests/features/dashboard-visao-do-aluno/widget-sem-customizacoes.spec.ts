// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME aplicado (ver _README.md desta pasta).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { widgetSemCustomizacoesData as data } from './widget-sem-customizacoes.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Dashboard - Visão do aluno', () => {
  test('Renderização de widget configurado sem título e ícone customizados', async ({
    page,
    step,
  }) => {
    test.fixme(
      true,
      "seed ausente: requer credencial Aluno + painel com 'Resumo das atividades' SEM customização (sem 'Meu Resumo', sem ícone customizado). Ver _README.md desta pasta.",
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story('Renderização de widget configurado sem título e ícone customizados');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Acessar painel do aluno', async () => {
      await page.goto('/play?menu_id=play');
    });

    await step('2. Verificar widget sem título customizado nem ícone', async () => {
      await expect(page.getByText(data.customTitle)).toBeHidden();
      // Widget ainda existe, apenas sem customização
    });
  });
});
