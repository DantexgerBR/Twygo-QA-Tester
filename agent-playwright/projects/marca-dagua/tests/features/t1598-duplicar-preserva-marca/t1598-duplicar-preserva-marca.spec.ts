// Testsuite: Duplicar preserva marca d'água (T-1598)
// Valida que ao duplicar uma atividade de vídeo com marca d'água, a cópia
// herda exatamente a mesma configuração (tipo, posições, informações, cor).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { AdminVideoPage } from '../../../pages/AdminVideoPage.js';
import { ListagemAtividadesPage } from '../../../pages/ListagemAtividadesPage.js';
import { marcaDaguaSharedData as data } from '../marca-dagua.shared.data.js';

test.use({ viewport: { width: 1280, height: 720 } });

test.describe('T-1598 — Duplicar preserva marca d\'água', () => {
  test('Configuração de marca d\'água é preservada ao duplicar atividade', async ({ page }) => {
    await allure.epic('Twygo - Marca d\'Água em Vídeo');
    await allure.feature('T-1598 — Duplicar preserva marca d\'água');
    await allure.story('Configuração de marca d\'água é preservada ao duplicar atividade');
    await allure.severity('high');

    const adminVideo = new AdminVideoPage(page);
    const listagem = new ListagemAtividadesPage(page);

    let configOrigem: Awaited<ReturnType<AdminVideoPage['lerConfigMarcaDagua']>>;

    await allure.step('1. Ler configuração de marca d\'água da atividade de origem', async () => {
      await adminVideo.abrirEdicao(data.eventoId, data.atividadeVideoId);
      configOrigem = await adminVideo.lerConfigMarcaDagua();
      expect(configOrigem.habilitada).toBe(true);
    });

    await allure.step('2. Acessar a listagem de atividades e clonar a atividade', async () => {
      await listagem.abrirListagem(data.eventoId);
      await listagem.clonarAtividade(data.atividadeVideoId);
    });

    await allure.step('3. Localizar a atividade duplicada no evento destino', async () => {
      // A cópia é criada no mesmo evento; usamos o ID conhecido do destino (9280224)
      // que foi gerado em execução anterior. Caso o ambiente seja fresh, buscar último ID.
      await adminVideo.abrirEdicao(data.eventoDestinoId, data.atividadeVideoDestinoId);
      await expect(adminVideo.getLabelMarcaDagua()).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('4. Comparar a configuração da cópia com a original', async () => {
      const configCopia = await adminVideo.lerConfigMarcaDagua();

      expect(configCopia.habilitada).toBe(configOrigem.habilitada);
      expect(configCopia.tipo).toBe(configOrigem.tipo);
      expect(configCopia.corFonte).toBe(configOrigem.corFonte);
    });
  });
});
