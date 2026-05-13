// spec: testsuite XML
// seed: tests/seed.spec.ts
// FIXME aplicado (ver _README.md desta pasta).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { alunoPainelSemWidgetsData as data } from './aluno-painel-sem-widgets.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Dashboard - Visão do aluno', () => {
  test('Aluno acessa painel sem widgets configurados', async ({ page, step }) => {
    test.fixme(
      true,
      'seed ausente: requer credencial Aluno + painel vazio configurado. Ver _README.md desta pasta.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Dashboard - Visão do aluno');
    await allure.story('Aluno acessa painel sem widgets configurados');
    await allure.severity('normal');
    await allure.label('executionType', 'manual');

    await step('1. Acessar painel do aluno', async () => {
      await page.goto('/play?menu_id=play');
    });

    await step('2. Verificar conteúdo da aba — vazio sem empty-state de admin', async () => {
      // Aluno NÃO vê o empty state que o admin vê
      await expect(page.getByText(data.adminEmptyStateText)).toBeHidden();
    });
  });
});
