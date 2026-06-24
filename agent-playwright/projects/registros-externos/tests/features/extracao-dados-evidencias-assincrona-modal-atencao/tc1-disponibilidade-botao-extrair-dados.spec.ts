import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { MeuHistoricoPage } from '../../../pages/MeuHistoricoPage.js';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

// Persona: a tela do Aluno é o layout embarcado `?in_use_mode_layout=true`
// ("Meu histórico"), que NÃO tem a toolbar Admin — então o gating do botão
// (RN 76.1) é validável navegando às duas views com a mesma sessão Admin, sem
// depender do switch de perfil (ver tc1 da suíte tempo-real, mesma decisão).

test.describe(data.suiteName, () => {
  test('Validar disponibilidade do botão "Extrair dados"', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar disponibilidade do botão "Extrair dados" (Admin sim / Aluno não)');
    await allure.severity('critical');

    const aluno = new MeuHistoricoPage(page);
    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1. Acessar "Meu histórico" (layout Aluno) → botão NÃO exibido', async () => {
      await aluno.goto();
      await expect(page.getByTestId('records-extraction-button')).toHaveCount(0);
    });

    await allure.step('2. Acessar "Aprendizagem > Registros" (Admin) → botão exibido', async () => {
      await extracao.goto();
      await expect(extracao.extractButton()).toBeVisible();
    });
  });
});
