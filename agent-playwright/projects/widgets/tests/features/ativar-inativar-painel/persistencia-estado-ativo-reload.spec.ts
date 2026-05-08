// Testsuite: Ativar / Inativar painel
// TC5 — STATUS: READY. Usa "Painel 30" do seed (30 painéis numéricos seedados
// em 2026-05-06). Painel 30 escolhido para minimizar conflito com TC1/TC2 que
// tocam em "Painel QA Teste" (outro nome) e com suítes anteriores que tendem
// a operar em Painel 1..N. Cleanup em afterEach restaura o estado original.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Ativar / Inativar painel', () => {
  // "Painel 30" é desassociado (validado live em 2026-05-06: toggle imediato
  // sem modal). Se virar associado no futuro, este TC quebra com modal —
  // healer deve trocar para outro painel desassociado e atualizar o nome.
  const PAINEL = 'Painel 30';
  let estadoInicial: boolean;

  test.afterEach(async ({ page }) => {
    // Cleanup: restaura ao estado capturado no início. Sem isso o TC5 deixa
    // o painel toggled para o oposto, contaminando suítes seguintes.
    if (test.info().status === 'skipped') return;
    if (estadoInicial === undefined) return;
    const paineis = new PaineisListPage(page);
    await paineis.goToList();
    if (estadoInicial) {
      await paineis.ensureActive(PAINEL);
    } else {
      await paineis.ensureInactive(PAINEL);
    }
  });

  test('Verificar persistência do estado Ativo após reload', async ({
    page,
  }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story('Persistência do estado Ativo do painel após reload');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step('1. Acessar a aba "Painéis" e capturar estado inicial', async () => {
      await paineis.goToList();
      await expect(paineis.getRowByName(PAINEL)).toBeVisible();
      estadoInicial = await paineis.getActiveStateByName(PAINEL);
    });

    await allure.step(
      `2. Alternar o switch "Ativo" de "${PAINEL}" para o estado oposto`,
      async () => {
        await paineis.toggleActiveByName(PAINEL);
        await expect(paineis.getRowActiveSwitchByName(PAINEL)).toBeChecked({
          checked: !estadoInicial,
        });
      },
    );

    await allure.step(
      '3. Recarregar a página e verificar que o novo estado persiste',
      async () => {
        await page.reload();
        await expect(paineis.getRowActiveSwitchByName(PAINEL)).toBeChecked({
          checked: !estadoInicial,
        });
      },
    );
  });
});
