import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AvaliarRegistroPage } from '../../../pages/AvaliarRegistroPage.js';
import { getBaseUrl } from '../../../../../src/utils/environment.js';
import { createPendingRecord, deleteRecordsByMarker } from '../../../data/records-api.js';
import { avaliarData as data, makeMarker, STORAGE_STATE } from './avaliar.shared.data.js';

// Nota: o laudo QA 1.9 (card 19896) já apontou que aprovar sem "Tipo de
// experiência" NÃO exibe validação (redireciona à lista). Se o bug persistir,
// este TC fica VERMELHO documentando-o (Anti-pattern F, sem fixme).
test.describe(data.suiteName, () => {
  let marker: string;

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
    const page = await ctx.newPage();
    try {
      if (marker) await deleteRecordsByMarker(page, marker);
    } finally {
      await ctx.close();
    }
  });

  test('Validar obrigatoriedade do Tipo de experiência ao Aprovar', async ({ page }, testInfo) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar obrigatoriedade do Tipo de experiência ao Aprovar');
    await allure.severity('critical');

    const av = new AvaliarRegistroPage(page);
    marker = makeMarker('TC3', testInfo.workerIndex);

    await allure.step('Pré: criar Externo Pendente e abrir "Avaliar"', async () => {
      await createPendingRecord(page, marker);
      await av.goto();
      await av.search(marker);
      await av.openEvaluate(marker);
    });

    await allure.step('2. Aprovar com Tipo vazio → "Campo obrigatório", não aprova', async () => {
      await av.clickAprovar();
      await expect(av.tipoError()).toBeVisible({ timeout: 8_000 });
      expect(page.url(), 'não deve sair do form de avaliação').toMatch(/admin-avaliar/);
    });

    await allure.step('3-4. Selecionar "Curso" e aprovar → prossegue', async () => {
      await av.selectTipo('Curso');
      await av.approve();
      await expect(av.getToast(/Registro aprovado/i)).toBeVisible({ timeout: 15_000 });
    });
  });
});
