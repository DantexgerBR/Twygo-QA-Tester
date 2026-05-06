// Testsuite: Listagem de painéis
// TC3 — STATUS: READY (2026-05-06). Re-explorado live: a UI renderiza tabela
// `<table>` Chakra com 4 columnheaders nomeados (Nome, Descrição, Data de
// criação, Ativo?) + um `<th>` vazio de Ações. Coluna "Provedora" do XML
// não existe na UI — removida das asserções. O modo Lista é o default no
// viewport 1920x1080; ainda assim o spec chama `setViewMode('lista')` para
// blindar contra mudanças de default em viewports menores.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

// 1920x1080 porque o default Lista/Cards depende do viewport.
test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Listagem de painéis', () => {
  test('Validar colunas exibidas na visualização em lista', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Listagem de painéis');
    await allure.story('Validar colunas exibidas na visualização em lista');
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step(
      "1. Acessar a listagem de Painéis em modo 'Lista'",
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        await expect(paineis.getColumnHeader('Nome')).toBeVisible();
      },
    );

    await allure.step('2. Verificar colunas obrigatórias', async () => {
      // Provedora removida do XML — coluna não existe na UI atual (2026-05-06).
      const colunas = ['Nome', 'Descrição', 'Data de criação', 'Ativo', 'Ações'];
      for (const col of colunas) {
        await expect(paineis.getColumnHeader(col)).toBeVisible();
      }
    });

    await allure.step(
      "3. Verificar checkbox 'Ativo' na primeira linha",
      async () => {
        // DOM real é `<input type="checkbox">`, não `role="switch"`.
        await expect(paineis.getRowActiveSwitch(0)).toBeVisible();
      },
    );

    await allure.step(
      '4. Verificar ícones de ação (editar/duplicar/excluir) na primeira linha',
      async () => {
        for (const action of ['editar', 'duplicar', 'excluir'] as const) {
          await expect(paineis.getRowActionIcon(0, action)).toBeVisible();
        }
      },
    );
  });
});
