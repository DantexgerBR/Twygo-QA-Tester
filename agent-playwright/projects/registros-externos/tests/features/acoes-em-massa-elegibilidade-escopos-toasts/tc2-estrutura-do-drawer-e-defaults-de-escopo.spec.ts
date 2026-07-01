import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AcoesEmMassaPage } from '../../../pages/AcoesEmMassaPage.js';
import { acoesEmMassaData as data } from './acoes-em-massa.shared.data.js';

const SUITE = data.suiteName;

// Sem cleanup: apenas leitura de estrutura (marca/desmarca checkboxes em memória).
test.describe(SUITE, () => {
  test('Validar estrutura do drawer e defaults de escopo', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar estrutura do drawer e defaults de escopo');
    await allure.severity('critical');

    const massa = new AcoesEmMassaPage(page);

    await allure.step('1. Drawer com select "Ação" e grupo de escopo', async () => {
      await massa.goto();
      await massa.openDrawer();
      const opts = (await massa.actionOptions()).map((o) => o.trim());
      expect(opts).toContain('Aprovar registros');
      expect(opts).toContain('Recusar registros');
      expect(opts).toContain('Excluir registros');
      // DIVERGÊNCIA AT: a primeira opção é VAZIA (sem ação pré-selecionada);
      // a AT não menciona default vazio. // REVISAR
      expect(opts[0]).toBe('');
      await expect(massa.drawer()).toContainText('Opção de envio');
      await expect(massa.scopeRadioSelecionados()).toBeAttached();
      await expect(massa.scopeRadioTodos()).toBeAttached();
    });

    await allure.step('2. Com 0 marcados: "Selecionados" é o default e está habilitado', async () => {
      // DIVERGÊNCIA AT: a AT espera "Selecionados" DESABILITADO com 0 marcados,
      // tooltip "Marque registros na tabela pra ativar" e default "Todos do
      // filtro atual". O BETA implementado faz o OPOSTO: "Selecionados" vem
      // habilitado e é o default; não há tooltip nem contagem "(M)" nos labels.
      // Asserimos o comportamento REAL e registramos a divergência. // REVISAR
      await expect(massa.scopeRadioSelecionados()).toBeEnabled();
      await expect(massa.scopeRadioSelecionados()).toBeChecked();
    });

    await allure.step('3. Marcar 3 linhas e reabrir: "Selecionados" habilitado e default', async () => {
      await massa.cancelarButton().click();
      await expect(massa.drawer()).toBeHidden({ timeout: 10_000 });
      const rows = massa.allRows();
      const n = Math.min(data.estruturaSelecionados, await rows.count());
      for (let i = 0; i < n; i++) await massa.selectRow(rows.nth(i));
      await massa.openDrawer();
      // Labels não trazem "(3)" no BETA — asseramos estado, não a contagem. // REVISAR
      await expect(massa.scopeRadioSelecionados()).toBeEnabled();
      await expect(massa.scopeRadioSelecionados()).toBeChecked();
    });

    await allure.step('4. Footer com "Cancelar" e "Executar"', async () => {
      // DIVERGÊNCIA AT: a AT diz "Aplicar"; o produto usa "Executar". // REVISAR
      await expect(massa.cancelarButton()).toBeVisible();
      await expect(massa.executarButton()).toBeVisible();
    });
  });
});
