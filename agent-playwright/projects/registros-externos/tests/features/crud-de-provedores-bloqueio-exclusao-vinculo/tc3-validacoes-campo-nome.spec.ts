import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
import { getBaseUrl } from '../../../../../src/utils/environment.js';
import { deleteProvidersByNameSafe } from '../../../data/event-sources-api.js';
import { provedoresData as data, STORAGE_STATE } from './provedores.shared.data.js';
import { tc3NomeMatrix, tc3AllInputs } from './tc3-validacoes-campo-nome.data.js';

// BUG DE PRODUTO (achado 2026-06-25): o campo "Nome" do provedor NÃO é validado
// como obrigatório — API `POST /event_sources` aceita name "" e "   " (201) e o
// form navega de volta criando provedor sem nome. RN84 exige Nome obrigatório.
// Os cenários "Vazio" e "Só espaços" abaixo ficam VERMELHOS de propósito
// (Anti-pattern F: não mascarar bug de produto com fixme) — quando o dev validar
// o campo, eles passam sem alterar o spec.
test.describe(data.suiteName, () => {
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
    const page = await ctx.newPage();
    try {
      // limpa todos os inputs — inclusive os vazios que o bug deixa criar.
      await deleteProvidersByNameSafe(page, [...tc3AllInputs]);
    } finally {
      await ctx.close();
    }
  });

  test('Validações do campo "Nome" do provedor', async ({ page }) => {
    test.setTimeout(240_000); // 7 cenários × (navegar + abrir form + salvar)
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validações do campo "Nome" do provedor');
    await allure.severity('critical');

    // Categoria D: nenhum input deve executar script (XSS escapado).
    let alertFired = false;
    page.on('dialog', async (d) => {
      alertFired = true;
      await d.dismiss().catch(() => undefined);
    });

    const prov = new ProvedoresPage(page);
    await prov.gotoTab();

    for (const row of tc3NomeMatrix) {
      await allure.step(`Cenário "${row.cenario}" → ${row.accepted ? 'aceito' : 'bloqueado'}`, async () => {
        await prov.gotoTab();
        await prov.openAddForm();
        await prov.fillProviderForm({ name: row.input });
        await prov.trySave();

        // expect.soft: toda a matriz roda mesmo com os cenários de bug vermelhos.
        if (row.accepted) {
          // aceito = salvou e voltou à listagem (acentos/emoji/script/SQL todos
          // criam). O "salvo escapado" é coberto pelo check de alertFired no fim.
          await page.waitForURL(/tab=event-sources-tab/, { timeout: 15_000 }).catch(() => undefined);
          expect.soft(page.url(), `"${row.cenario}" deveria ser aceito`).toMatch(/tab=event-sources-tab/);
        } else {
          // ESPERADO bloquear (RN84). BUG: o produto cria provedor de nome vazio
          // e navega de volta → este soft-expect fica vermelho documentando o bug.
          await page.waitForTimeout(1_000);
          expect
            .soft(page.url(), `BUG: Nome "${row.cenario}" deveria bloquear (RN84)`)
            .toMatch(/\/event_sources\/new/);
        }
      });
    }

    expect(alertFired, 'nenhum alert() deve disparar (XSS escapado)').toBe(false);
  });
});
