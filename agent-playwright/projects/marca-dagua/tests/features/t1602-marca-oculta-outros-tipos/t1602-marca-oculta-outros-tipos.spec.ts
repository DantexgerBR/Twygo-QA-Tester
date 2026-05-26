// Testsuite: Marca d'água oculta em outros tipos de mídia (T-1602)
// Valida que a seção de configuração de marca d'água NÃO aparece no formulário
// de edição para tipos de mídia que não são "Vídeo Interno".
// E que ela SÍ aparece para media_type=video (sanity check).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminVideoPage } from '../../../pages/AdminVideoPage.js';
import { marcaDaguaSharedData as data } from '../marca-dagua.shared.data.js';

test.use({ viewport: { width: 1280, height: 720 } });

test.describe('T-1602 — Marca d\'água oculta em outros tipos de mídia', () => {
  test.describe('Tipos sem opção de marca d\'água', () => {
    for (const { valor, rotulo } of data.tiposSemMarcaDagua) {
      test(`Tipo "${rotulo}" não exibe seção de marca d'água`, async ({ page }) => {
        await allure.epic('Twygo - Marca d\'Água em Vídeo');
        await allure.feature('T-1602 — Marca d\'água oculta em outros tipos de mídia');
        await allure.story(`Tipo "${rotulo}" não exibe seção de marca d'água`);
        await allure.severity('normal');

        const adminVideo = new AdminVideoPage(page);

        await allure.step(`1. Acessar edição de atividade e selecionar tipo "${rotulo}"`, async () => {
          await adminVideo.abrirEdicao(data.eventoId, data.atividadeVideoId);
          await adminVideo.clicarRadioMediaType(valor);
        });

        await allure.step('2. Verificar que a seção de marca d\'água não está visível', async () => {
          await expect(adminVideo.isSecaoMarcaDaguaVisivelLocator()).not.toBeVisible({
            timeout: 3_000,
          });
        });
      });
    }
  });

  test('Tipo "Vídeo Interno" (video) exibe seção de marca d\'água', async ({ page }) => {
    await allure.epic('Twygo - Marca d\'Água em Vídeo');
    await allure.feature('T-1602 — Marca d\'água oculta em outros tipos de mídia');
    await allure.story('Tipo "Vídeo Interno" (video) exibe seção de marca d\'água');
    await allure.severity('critical');

    const adminVideo = new AdminVideoPage(page);

    await allure.step('1. Acessar edição de atividade de vídeo interno', async () => {
      await adminVideo.abrirEdicao(data.eventoId, data.atividadeVideoId);
      await adminVideo.clicarRadioMediaType('video');
    });

    await allure.step('2. Verificar que a seção de marca d\'água está visível', async () => {
      await expect(adminVideo.isSecaoMarcaDaguaVisivelLocator()).toBeVisible({ timeout: 5_000 });
    });
  });
});
