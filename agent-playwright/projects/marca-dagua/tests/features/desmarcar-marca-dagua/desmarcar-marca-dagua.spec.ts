// Testsuite: Desmarcar marca d'água
// TC — Desabilitar marca d'água em vídeo e verificar persistência.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminVideoPage } from '../../../pages/AdminVideoPage.js';
import { marcaDaguaSharedData as data } from '../marca-dagua.shared.data.js';

test.use({ viewport: { width: 1280, height: 720 } });

test.describe('Desmarcar marca d\'água', () => {
  test('Desabilitar marca d\'água em atividade de vídeo', async ({ page }) => {
    await allure.epic('Twygo - Marca d\'Água em Vídeo');
    await allure.feature('Desmarcar marca d\'água');
    await allure.story('Desabilitar marca d\'água em atividade de vídeo');
    await allure.severity('critical');

    const adminVideo = new AdminVideoPage(page);

    await allure.step('1. Acessar o formulário de edição da atividade de vídeo', async () => {
      await adminVideo.abrirEdicao(data.eventoId, data.atividadeVideoId);
      await expect(adminVideo.getLabelMarcaDagua()).toBeVisible();
    });

    await allure.step('2. Desabilitar a marca d\'água se estiver habilitada', async () => {
      await adminVideo.desabilitarMarcaDagua();
      await expect(adminVideo.getCheckboxMarcaDagua()).not.toBeChecked();
    });

    await allure.step('3. Salvar o formulário', async () => {
      await adminVideo.salvar();
      await page.waitForURL(/\/e\/\d+\/contents\/\d+\/edit/, { timeout: 10_000 }).catch(() => null);
    });

    await allure.step('4. Reabrir a edição e confirmar que a marca d\'água continua desabilitada', async () => {
      await adminVideo.abrirEdicao(data.eventoId, data.atividadeVideoId);
      await expect(adminVideo.getCheckboxMarcaDagua()).not.toBeChecked();
    });

    // Teardown: reabilitar para não contaminar os outros testes da suíte
    await allure.step('5. (Teardown) Reabilitar marca d\'água para restaurar estado', async () => {
      await adminVideo.habilitarMarcaDagua();
      await adminVideo.salvar();
    });
  });
});
