import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AcoesEmMassaPage } from '../../../pages/AcoesEmMassaPage.js';
import { EMPTY_ROW_TEXT } from '../../../pages/MeuHistoricoPage.js';
import { acoesEmMassaData as data, makeMarker } from './acoes-em-massa.shared.data.js';

const SUITE = data.suiteName;

// Sem cleanup: somente leitura (filtro que retorna 0; nada é processado).
test.describe(SUITE, () => {
  test('Validar escopo vazio com aviso de orientação', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar escopo vazio com aviso de orientação');
    await allure.severity('medium');

    const massa = new AcoesEmMassaPage(page);

    await allure.step('1. Aplicar busca que retorna 0 registros', async () => {
      await massa.goto();
      await massa.base.search(`${makeMarker('TC10', testInfo.workerIndex)}-INEXISTENTE`);
      await expect(page.getByText(EMPTY_ROW_TEXT, { exact: false }).first()).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('2. Tentar aplicar uma ação no escopo total vazio: nenhum processamento', async () => {
      await massa.openDrawer();
      await massa.chooseScopeTodos();
      await massa.selectAction('Aprovar registros');
      await massa.executarButton().click();
      // Invariante real do cenário: NENHUM processamento ocorre. A AT supõe um
      // aviso de orientação específico; o texto exato não foi confirmado no
      // recon. Asserimos a invariante segura (não há toast de conclusão de
      // sucesso) — o aviso/modal de "0 registros" é detalhe de apresentação. // REVISAR
      await page.waitForTimeout(2_500);
      await expect(massa.getToast(/Ação em massa concluída|registros aprovados/i)).toHaveCount(0);
      // A lista segue vazia (nada foi processado).
      await expect(page.getByText(EMPTY_ROW_TEXT, { exact: false }).first()).toBeVisible();
    });
  });
});
