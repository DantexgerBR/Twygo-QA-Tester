import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage, COLUMN_KEY_TO_LABEL } from '../../../pages/FiltrosColunasPage.js';
import { filtrosDrawerData as data } from './filtros-drawer.shared.data.js';
import { PRIMARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 69/70 — reordenar colunas pelo drag handle (react-beautiful-dnd) e a tabela
// reflete a nova ordem. DnD por teclado (focar handle → Space → ArrowUp → Space).
test.describe(SUITE, () => {
  const source = data.dndSourceColumn; // workload_seconds — Carga horária
  const target = data.dndTargetColumn; // origin — Origem
  const sourceLabel = COLUMN_KEY_TO_LABEL[source];
  const targetLabel = COLUMN_KEY_TO_LABEL[target];

  test('Validar reordenação de colunas via drag and drop', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar reordenação de colunas via drag and drop');
    await allure.severity('high');

    const filtros = new FiltrosColunasPage(page);

    await allure.step('1. Abrir a view "Filtro rápido" com a lista de colunas', async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      await filtros.gotoFiltroRapido();
      await filtros.expandColumnsShow();
    });

    await allure.step(`2. Drag handle de "${sourceLabel}" é arrastável`, async () => {
      await expect(filtros.dragHandle(source)).toHaveAttribute('draggable', 'true');
    });

    await allure.step(`3. Arrastar "${sourceLabel}" para antes de "${targetLabel}"`, async () => {
      await filtros.moveColumnBefore(source, target);
      const order = await filtros.getColumnOrder();
      expect(order.indexOf(source)).toBeLessThan(order.indexOf(target));
    });

    await allure.step(`4. Aplicar → tabela mostra "${sourceLabel}" antes de "${targetLabel}"`, async () => {
      await filtros.applyFiltroRapido();
      const headers = await filtros.getTableHeaders();
      const si = headers.indexOf(sourceLabel);
      const ti = headers.indexOf(targetLabel);
      expect(si, `"${sourceLabel}" presente`).toBeGreaterThanOrEqual(0);
      expect(ti, `"${targetLabel}" presente`).toBeGreaterThanOrEqual(0);
      expect(si, `"${sourceLabel}" antes de "${targetLabel}"`).toBeLessThan(ti);
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
