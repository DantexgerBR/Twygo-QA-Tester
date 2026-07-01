import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

// CAUSA-RAIZ (bug de produto — recon 2026-06-23, BETA): o botão "Extrair" do
// branch Dados (`#drawer-data-export-export`, type=submit) é INERTE. O click é
// rastreado (HubSpot vê `drawer-data-export-export`) mas NENHUMA chamada
// `/api/v1/...` dispara, NENHUM toast aparece e o drawer permanece aberto — não
// há flash "Sua extração está sendo processada.". Handler de submit não conectado
// no frontend (um worker quebrado ainda POSTaria). RN 79/80 não implementadas.
// Quando o dev conectar o submit (toast + flash + POST de extração de dados), este
// teste passa sem alteração. Ver recon-extracao-...md § "Comportamento real".

test.describe(data.suiteName, () => {
  test('Validar extração de dados CSV com toast de variação', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar extração de dados CSV com toast de variação');
    await allure.severity('critical');

    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1-2. Abrir o drawer na tela Admin Registros', async () => {
      await extracao.goto();
      await extracao.open();
    });

    await allure.step('3. Manter Dados+CSV+Filtro atual e clicar "Extrair" → drawer fecha + toast', async () => {
      // defaults já são csv / filtro_atual / filtro_atual (recon)
      await extracao.dadosExtractButton().click();
      await expect(extracao.drawer()).toBeHidden({ timeout: 10_000 });
      await expect(extracao.toast(data.toast.dadosCsv)).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('4. Flash "Sua extração está sendo processada..."', async () => {
      await expect(extracao.flashMessage(data.flashProcessando)).toBeVisible({ timeout: 15_000 });
    });
  });
});
