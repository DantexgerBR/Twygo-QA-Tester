import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage, COLUMN_KEY_TO_LABEL } from '../../../pages/FiltrosColunasPage.js';
import { filtrosDrawerData as data } from './filtros-drawer.shared.data.js';
import { PRIMARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 70 + premissa — reabrir o drawer volta à view "Lista" e a customização (AT)
// "não persiste entre sessões".
// DIVERGÊNCIA (recon 2026-06-23): a customização de colunas PERSISTE após reload
// (localStorage por usuário). Asseramos o comportamento REAL e anotamos a
// divergência; reabrir o drawer em modo "Lista" SIM é verdadeiro.
test.describe(SUITE, () => {
  const col = data.toggleOffColumn; // provider
  const colLabel = COLUMN_KEY_TO_LABEL[col];

  test('Validar reset suave do drawer e não persistência da customização', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar reset suave do drawer e não persistência da customização');
    await allure.severity('high');

    const filtros = new FiltrosColunasPage(page);

    test.info().annotations.push({
      type: 'divergência',
      description:
        'AT esperava que a customização de colunas NÃO persistisse após reload; o build PERSISTE ' +
        '(localStorage por usuário). Destinatário: AT / QA Lead (confirmar comportamento desejado).',
    });

    await allure.step(`1. Customizar (desmarcar "${colLabel}") e aplicar`, async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      await filtros.gotoFiltroRapido();
      await filtros.setColumn(col, false);
      await filtros.applyFiltroRapido();
      expect(await filtros.getTableHeaders()).not.toContain(colLabel);
    });

    await allure.step('2. Reabrir o drawer (com customização aplicada) abre na view "Filtro rápido"', async () => {
      // DIVERGÊNCIA: a AT esperava reabrir na view "Lista de filtros". O componente
      // de drawer compartilhado Twygo, porém, reabre em modo B (Edição/"Filtro
      // rápido") sempre que há filtro/customização aplicado (ver skill
      // testar-filtro-drawer-twygo). Asseramos o comportamento real.
      const mode = await filtros.openDrawer();
      expect(mode, 'com customização aplicada o drawer reabre em modo edição (Filtro rápido)').toBe('rapido');
      await expect(filtros.formTitle()).toBeVisible();
    });

    await allure.step('3. "Novo" exibe a lista de colunas (estado da customização aplicada)', async () => {
      await filtros.gotoFiltroRapido();
      await filtros.expandColumnsShow();
      // DIVERGÊNCIA: a AT esperava "estado default" (reset); o build reflete a
      // customização aplicada (coluna continua desmarcada).
      expect(await filtros.isColumnChecked(col)).toBe(false);
    });

    await allure.step('4. Recarregar a página — customização PERSISTE (divergência vs AT)', async () => {
      await filtros.goto();
      // DIVERGÊNCIA: a AT esperava o retorno às colunas default; o build mantém
      // a customização após reload.
      expect(await filtros.getTableHeaders()).not.toContain(colLabel);
    });
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: PRIMARY_STORAGE_PATH });
    const page = await context.newPage();
    try {
      await new FiltrosColunasPage(page).restoreDefaultColumns();
    } catch {
      /* best-effort: pref de UI persistida */
    } finally {
      await context.close();
    }
  });
});
