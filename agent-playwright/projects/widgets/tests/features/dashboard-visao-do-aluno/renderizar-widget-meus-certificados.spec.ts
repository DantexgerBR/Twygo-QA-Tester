// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME aplicado (ver _README.md desta pasta).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { renderizarWidgetMeusCertificadosData as data } from './renderizar-widget-meus-certificados.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Dashboard - Visão do aluno', () => {
  test("Renderizar widget 'Meus certificados' para o aluno", async ({ page, step }) => {
    test.fixme(
      true,
      "seed ausente: requer credencial Aluno + painel com widget 'Meus certificados' exibindo certificados do aluno. Ver _README.md desta pasta.",
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story("Renderizar widget 'Meus certificados' para o aluno");
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    await step('1. Acessar o painel do aluno via /play', async () => {
      await page.goto('/play?menu_id=play');
    });

    await step("2. Verificar widget 'Meus certificados' com lista", async () => {
      await expect(page.getByText(data.widgetTitle)).toBeVisible();
    });
  });
});
