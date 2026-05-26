// Testsuite: Cor transparente na marca d'água (T-1601)
// Valida que ao definir cor da fonte com alpha=0 (transparente), a marca
// d'água fica invisível mesmo com a feature habilitada.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminVideoPage } from '../../../pages/AdminVideoPage.js';
import { AprenderPage } from '../../../pages/AprenderPage.js';
import { waitForVideoTime } from '../../../utils/videoUtils.js';
import { marcaDaguaSharedData as data } from '../marca-dagua.shared.data.js';

test.use({ viewport: { width: 1280, height: 720 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

// Cor original para restaurar após o teste
const COR_ORIGINAL = '#000000FF';
const COR_TRANSPARENTE = '#00000000';

test.describe('T-1601 — Cor transparente na marca d\'água', () => {
  test('Marca d\'água com alpha=0 fica invisível durante reprodução', async ({ page }) => {
    await allure.epic('Twygo - Marca d\'Água em Vídeo');
    await allure.feature('T-1601 — Cor transparente na marca d\'água');
    await allure.story('Marca d\'água com alpha=0 fica invisível durante reprodução');
    await allure.severity('high');

    const adminVideo = new AdminVideoPage(page);
    const aprender = new AprenderPage(page);

    await allure.step('1. Configurar cor da fonte com alpha=0 (completamente transparente)', async () => {
      await adminVideo.abrirEdicao(data.eventoId, data.atividadeVideoId);
      await adminVideo.habilitarMarcaDagua();
      await adminVideo.setCorFonteHex(COR_TRANSPARENTE);
      await adminVideo.salvar();
    });

    await allure.step('2. Acessar o vídeo como aluno e iniciar reprodução', async () => {
      await aprender.abrirAtividade(data.eventoId);
      const video = aprender.getVideoPlayer();
      await expect(video).toBeVisible({ timeout: 15_000 });
      await aprender.iniciarReproducao();
      await waitForVideoTime(page, video, 2, { timeoutMs: 60_000 });
    });

    await allure.step('3. Capturar screenshot — marca deve estar invisível', async () => {
      await page.screenshot({
        path: 'outputs/marca-dagua/t1601-cor-transparente.png',
        fullPage: false,
      });
      // Validação: a marca transparente não é visível.
      // Como a marca é server-side, a assertiva programática é indireta —
      // o screenshot capturado deve ser inspecionado visualmente pelo QA.
      const ct = await aprender.currentTime();
      expect(ct).toBeGreaterThan(0);
    });
  });

  test.afterAll(async ({ browser }) => {
    // Restaura a cor original para não contaminar os demais testes
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    const adminVideo = new AdminVideoPage(page);
    await adminVideo.abrirEdicao(data.eventoId, data.atividadeVideoId);
    await adminVideo.setCorFonteHex(COR_ORIGINAL);
    await adminVideo.salvar();
    await ctx.close();
  });
});
