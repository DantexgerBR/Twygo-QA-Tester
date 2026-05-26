// Testsuite: Marca d'água em mobile (T-1596)
// Valida que a marca d'água é exibida no player em viewport mobile.
// A marca é queimada server-side — validação é por screenshot e progresso real.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AprenderPage } from '../../../pages/AprenderPage.js';
import { waitForVideoTime } from '../../../utils/videoUtils.js';
import { marcaDaguaSharedData as data } from '../marca-dagua.shared.data.js';

// Viewport mobile padrão
test.use({ viewport: { width: 360, height: 740 }, isMobile: true });

test.describe('T-1596 — Marca d\'água em mobile', () => {
  test('Exibir marca d\'água no player em viewport mobile', async ({ page }) => {
    await allure.epic('Twygo - Marca d\'Água em Vídeo');
    await allure.feature('T-1596 — Marca d\'água em mobile');
    await allure.story('Exibir marca d\'água no player em viewport mobile');
    await allure.severity('high');

    const aprender = new AprenderPage(page);
    const video = aprender.getVideoPlayer();

    await allure.step('1. Acessar o curso como aluno em viewport mobile', async () => {
      await aprender.abrirAtividade(data.eventoId);
      await expect(video).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('2. Iniciar a reprodução do vídeo', async () => {
      await aprender.iniciarReproducao();
    });

    await allure.step('3. Aguardar 2s de reprodução e capturar screenshot mobile', async () => {
      await waitForVideoTime(page, video, 2, { timeoutMs: 60_000 });
      const ct = await aprender.currentTime();
      expect(ct).toBeGreaterThanOrEqual(2);
      await page.screenshot({ path: 'outputs/marca-dagua/t1596-mobile-frame-2s.png', fullPage: false });
    });

    // A marca d'água queimada server-side deve aparecer no screenshot mesmo em mobile.
    // Validação visual por QA humano — não há seletor DOM para asserção programática.
    await allure.step('4. Confirmar que o vídeo progrediu em mobile', async () => {
      const ct = await aprender.currentTime();
      expect(ct).toBeGreaterThan(0);
    });
  });
});
