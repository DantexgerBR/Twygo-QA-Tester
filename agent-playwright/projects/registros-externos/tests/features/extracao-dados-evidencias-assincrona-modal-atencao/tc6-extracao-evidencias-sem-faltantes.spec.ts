import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

// CAUSA-RAIZ (bug de produto — recon 2026-06-23, BETA): a extração de Evidências
// dispara `201 POST /subscription_attachments_exports` e fecha o drawer, mas NÃO
// exibe o toast "Extração iniciada" (RN 78/80). A parte "nenhum modal de Atenção"
// é satisfeita (o modal não está implementado), mas o feedback de sucesso
// (toast direto) está ausente. Quando o frontend conectar o toast, este teste
// passa. Nota de precondição: o env não garante um filtro em que TODOS os
// registros tenham evidência; validamos o observável central (extração sem modal
// + toast direto). Ver recon-extracao-...md § "Comportamento real" (item 2).

test.describe(data.suiteName, () => {
  test('Validar extração de evidências sem faltantes (modal não aparece)', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar extração de evidências sem faltantes (modal não aparece)');
    await allure.severity('normal');

    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1-2. Disparar Evidências (Filtro atual) → sem modal + toast direto', async () => {
      await extracao.goto();
      await extracao.open();
      await extracao.selectType('Evidências');
      await extracao.triggerEvidExtract('filtro_atual');

      // toast de "Extração iniciada" deve aparecer diretamente, sem modal de Atenção
      await expect(extracao.toast(data.toast.evidenciasGenerico)).toBeVisible({ timeout: 15_000 });
      await expect(extracao.atencaoModal()).toHaveCount(0);
    });
  });
});
