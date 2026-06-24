import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { FiltrosColunasPage, COLUMN_KEY_TO_LABEL } from '../../../pages/FiltrosColunasPage.js';
import { filtrosDrawerData as data } from './filtros-drawer.shared.data.js';
import { PRIMARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';

const SUITE = 'Filtros via drawer e personalização de colunas (DnD)';

// RN 68/70 — marcar/desmarcar colunas e aplicar atualiza a tabela, com checkbox
// de seleção fixo na 1ª coluna e ações na última.
// ADAPTAÇÃO (recon): a AT manda "marcar Website", mas Website já é default-ON.
// Desmarcamos "Provedor" (ON) e marcamos "Progresso" (OFF) para exercer ambos os
// sentidos do toggle.
test.describe(SUITE, () => {
  const offCol = data.toggleOffColumn;
  const onCol = data.toggleOnColumn;
  const offLabel = COLUMN_KEY_TO_LABEL[offCol];
  const onLabel = COLUMN_KEY_TO_LABEL[onCol];

  test('Validar ligar/desligar colunas e refletir na tabela', async ({ page }) => {
    await allure.epic('Twygo - Registros de Aprendizagem');
    await allure.feature(SUITE);
    await allure.story('Validar ligar/desligar colunas e refletir na tabela');
    await allure.severity('critical');

    const filtros = new FiltrosColunasPage(page);

    await allure.step('1. Abrir a view "Filtro rápido"', async () => {
      await filtros.goto();
      await filtros.clearFilter();
      await filtros.openDrawer();
      await filtros.gotoFiltroRapido();
      await filtros.expandColumnsShow();
    });

    await allure.step(`2. Desmarcar a coluna "${offLabel}"`, async () => {
      await filtros.setColumn(offCol, false);
      expect(await filtros.isColumnChecked(offCol)).toBe(false);
    });

    await allure.step(`3. Marcar a coluna "${onLabel}"`, async () => {
      await filtros.setColumn(onCol, true);
      expect(await filtros.isColumnChecked(onCol)).toBe(true);
    });

    await allure.step('4. Aplicar → tabela reflete as mudanças; seleção/ações fixas nas pontas', async () => {
      await filtros.applyFiltroRapido();
      const headers = await filtros.getTableHeaders();
      expect(headers, `"${offLabel}" deve sumir`).not.toContain(offLabel);
      expect(headers, `"${onLabel}" deve aparecer`).toContain(onLabel);

      // 1ª <th> = seleção (vazia), última <th> = ações (vazia) — fixas nas pontas.
      const { first, last, count } = await filtros.getFirstAndLastHeaderRaw();
      expect(first).toBe('');
      expect(last).toBe('');
      expect(count).toBeGreaterThan(headers.length); // há as 2 colunas fixas além das de dados
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
