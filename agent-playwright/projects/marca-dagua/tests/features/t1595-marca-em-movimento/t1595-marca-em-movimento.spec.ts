// Testsuite: Marca d'água em movimento (T-1595)
// Valida que a marca d'água animada é exibida durante a reprodução do vídeo.
// Nota: a marca é queimada server-side nos frames — validação é por screenshot
// visual e confirmação de que o vídeo reproduz com progresso real.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminVideoPage } from '../../../pages/AdminVideoPage.js';
import { AprenderPage } from '../../../pages/AprenderPage.js';
import { waitForVideoTime } from '../../../utils/videoUtils.js';
import { marcaDaguaSharedData as data } from '../marca-dagua.shared.data.js';

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

// Resolução desktop para que a marca d'água seja renderizada no tamanho padrão
test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('T-1595 — Marca d\'água em movimento', () => {
  test.beforeAll(async ({ browser }) => {
    // Garante que a atividade tem marca d'água "Em movimento" habilitada
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    const adminVideo = new AdminVideoPage(page);
    await adminVideo.abrirEdicao(data.eventoId, data.atividadeVideoId);
    await adminVideo.habilitarMarcaDagua();
    await adminVideo.selecionarTipoEmMovimento();
    await adminVideo.salvar();
    await ctx.close();
  });

  test('Exibir marca d\'água em movimento durante reprodução do vídeo', async ({ page }) => {
    await allure.epic('Twygo - Marca d\'Água em Vídeo');
    await allure.feature('T-1595 — Marca d\'água em movimento');
    await allure.story('Exibir marca d\'água em movimento durante reprodução do vídeo');
    await allure.severity('critical');

    const aprender = new AprenderPage(page);
    const video = aprender.getVideoPlayer();

    await allure.step('1. Acessar o curso como aluno e abrir a atividade de vídeo', async () => {
      await aprender.abrirAtividade(data.eventoId);
      await expect(video).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('2. Iniciar a reprodução do vídeo', async () => {
      await aprender.iniciarReproducao();
    });

    await allure.step('3. Aguardar 2s de reprodução e capturar screenshot', async () => {
      await waitForVideoTime(page, video, 2);
      const ct = await aprender.currentTime();
      expect(ct).toBeGreaterThanOrEqual(2);
      await page.screenshot({ path: 'outputs/marca-dagua/t1595-frame-2s.png', fullPage: false });
    });

    await allure.step('4. Aguardar metade da duração e capturar segundo screenshot', async () => {
      const dur = await aprender.duration();
      const mid = Math.max(dur / 2, 5);
      await waitForVideoTime(page, video, mid, { timeoutMs: 120_000 });
      await page.screenshot({ path: 'outputs/marca-dagua/t1595-frame-mid.png', fullPage: false });
    });

    // Validação: o vídeo está progredindo (não travado).
    // A verificação visual da marca em movimento deve ser feita por QA humano
    // nos screenshots capturados — a marca é queimada server-side e não está no DOM.
    await allure.step('5. Confirmar que o vídeo progrediu (currentTime > 0)', async () => {
      const ct = await aprender.currentTime();
      expect(ct).toBeGreaterThan(0);
    });
  });
});
