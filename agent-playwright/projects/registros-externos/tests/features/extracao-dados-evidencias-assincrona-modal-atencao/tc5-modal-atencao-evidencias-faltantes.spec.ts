import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

// CAUSA-RAIZ (bug de produto — recon 2026-06-23, BETA): ao disparar a extração de
// Evidências com escopo "Filtro atual" (361 registros, muitos sem evidência — o
// anexo é opcional), o frontend posta `201 POST /subscription_attachments_exports`
// e fecha o drawer, mas NÃO exibe o modal "Atenção" (RN 78) nem o toast de
// "Extração iniciada". O ratio de registros sem evidência não é apresentado ao
// usuário antes de confirmar. Quando o dev implementar o modal de confirmação,
// este teste passa. Ver recon-extracao-...md § "Comportamento real" (item 2).

test.describe(data.suiteName, () => {
  test('Validar modal de Atenção para evidências faltantes', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar modal de Atenção para evidências faltantes');
    await allure.severity('critical');

    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1-2. Disparar extração de Evidências (Filtro atual) → modal "Atenção"', async () => {
      await extracao.goto();
      await extracao.open();
      await extracao.selectType('Evidências');
      await extracao.triggerEvidExtract('filtro_atual');
      await expect(extracao.atencaoModal()).toBeVisible({ timeout: 10_000 });
      await expect(extracao.atencaoModal()).toContainText(data.modalAtencaoBody);
    });

    await allure.step('3. "Cancelar" do modal → modal fecha e drawer permanece', async () => {
      await extracao.atencaoCancelButton().click();
      await expect(extracao.atencaoModal()).toBeHidden({ timeout: 10_000 });
      await expect(extracao.drawer()).toBeVisible();
    });

    await allure.step('4. Reextrair + "Continuar" → toast de evidências', async () => {
      await extracao.triggerEvidExtract('filtro_atual');
      await expect(extracao.atencaoContinueButton()).toBeVisible({ timeout: 10_000 });
      await extracao.atencaoContinueButton().click();
      await expect(extracao.toast(data.toast.evidencias)).toBeVisible({ timeout: 15_000 });
    });
  });
});
