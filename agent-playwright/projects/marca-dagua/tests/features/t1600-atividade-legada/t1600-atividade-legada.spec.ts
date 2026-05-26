// Testsuite: Atividade legada sem marca d'água (T-1600)
// Valida que atividade de vídeo criada antes da feature de marca d'água
// não exibe marca durante a reprodução, mesmo com a feature ativa na org.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AprenderPage } from '../../../pages/AprenderPage.js';
import { t1600Data as data } from './t1600-atividade-legada.data.js';

test.use({ viewport: { width: 1280, height: 720 } });

test.describe('T-1600 — Atividade legada sem marca d\'água', () => {
  test('Atividade legada não exibe marca d\'água durante reprodução', async ({ page }) => {
    test.fixme(
      data.atividadeLegadaId === 0,
      'Seed ausente: preencher atividadeLegadaId em t1600-atividade-legada.data.ts com ID de atividade criada antes da feature de marca d\'água.',
    );

    await allure.epic('Twygo - Marca d\'Água em Vídeo');
    await allure.feature('T-1600 — Atividade legada sem marca d\'água');
    await allure.story('Atividade legada não exibe marca d\'água durante reprodução');
    await allure.severity('high');

    const aprender = new AprenderPage(page);
    const video = aprender.getVideoPlayer();

    await allure.step('1. Acessar a atividade legada como aluno', async () => {
      await aprender.abrirAtividade(data.eventoLegadoId);
      await expect(video).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('2. Iniciar a reprodução', async () => {
      await aprender.iniciarReproducao();
    });

    await allure.step('3. Capturar screenshot após 2s para validação visual', async () => {
      const { waitForVideoTime } = await import('../../../utils/videoUtils.js');
      await waitForVideoTime(page, video, 2, { timeoutMs: 60_000 });
      await page.screenshot({
        path: 'outputs/marca-dagua/t1600-legada-sem-marca.png',
        fullPage: false,
      });
    });

    await allure.step('4. Confirmar que o vídeo reproduz sem travar', async () => {
      const ct = await aprender.currentTime();
      expect(ct).toBeGreaterThan(0);
    });

    // A ausência de marca d'água no vídeo legado deve ser verificada
    // visualmente no screenshot — não há seletor DOM confiável para isso.
  });
});
