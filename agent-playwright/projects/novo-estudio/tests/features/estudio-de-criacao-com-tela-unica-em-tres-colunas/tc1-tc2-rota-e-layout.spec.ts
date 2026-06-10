// Testsuite: Estúdio de Criação com tela única em três colunas (QA 1.2)
// TC1 — Acessar o Estúdio via rota nova
// TC2 — Validar layout em 3 colunas (lista, preview, copiloto)
//
// Divergência de rota (registrada no laudo): AT prevê "/o/{org}/events/:id/edit/studio",
// que retorna 404 no stage (recon 2026-06-05). Rota real implementada:
// /o/{org}/contents/{id}/edit?tab=studio (aba test-id "tab-studio"). Os TCs
// validam a INTENÇÃO (rota nova abre o Estúdio) na rota real.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioPage } from '../../../pages/StudioPage.js';
import { estudioData as data } from './estudio-tres-colunas.shared.data.js';

test.describe('Estúdio de Criação com tela única em três colunas', () => {
  test('TC1 — Acessar o Estúdio via rota nova', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Estúdio de Criação com tela única em três colunas');
    await allure.story('TC1 — Acessar o Estúdio via rota nova');
    await allure.severity('critical');

    const studio = new StudioPage(page);

    await allure.step('1. Rota literal da AT (/events/:id/edit/studio) — registrar status', async () => {
      const res = await page.goto(studio.rotaAt(data.courseId), { waitUntil: 'domcontentloaded' });
      // Divergência AT × implementação: soft pra não abortar o TC — a rota real
      // é validada no passo seguinte; o laudo registra o 404 da rota da AT.
      expect.soft(res?.status(), 'rota literal da AT deveria abrir o Estúdio (retorna 404)').toBe(200);
    });

    await allure.step('1b. Rota real abre o Estúdio de Criação', async () => {
      await studio.gotoEstudio(data.courseId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
      expect(page.url()).toMatch(data.rotaRealRegex);
    });

    await allure.step('2. Título da aba do navegador reflete o nome do curso', async () => {
      // Recon 2026-06-05: título atual é "Domínio padrão" — se falhar aqui, é a
      // divergência de <title> (não reflete curso/contexto de edição).
      await expect.soft(page, 'tag <title> deveria refletir o nome do curso').toHaveTitle(
        new RegExp(data.courseName.split(' ')[0], 'i'),
        { timeout: 10_000 },
      );
    });
  });

  test('TC2 — Validar layout em 3 colunas (lista, preview, copiloto)', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Estúdio de Criação com tela única em três colunas');
    await allure.story('TC2 — Validar layout em 3 colunas (lista, preview, copiloto)');
    await allure.severity('critical');

    const studio = new StudioPage(page);

    await allure.step('2. Aguardar o Estúdio ser carregado — layout em 3 colunas', async () => {
      await studio.gotoEstudio(data.courseId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
    });

    await allure.step('3. Coluna esquerda exibe a lista de atividades', async () => {
      await expect(studio.listaAtividades()).toBeVisible();
      await expect(studio.tituloListaAtividades()).toContainText('Atividades');
      const lista = await studio.listaAtividades().boundingBox();
      const shell = await studio.shell().boundingBox();
      expect(lista!.x, 'lista ancorada à esquerda do shell').toBeLessThanOrEqual(shell!.x + 8);
    });

    await allure.step('4. Coluna central exibe área de preview da atividade', async () => {
      await expect(studio.preview()).toBeVisible();
      const prev = await studio.preview().boundingBox();
      const lista = await studio.listaAtividades().boundingBox();
      expect(prev!.x, 'preview à direita da lista').toBeGreaterThan(lista!.x + lista!.width - 8);
    });

    await allure.step('5. Coluna direita exibe o drawer do copiloto IA', async () => {
      // AT espera o drawer visível como coluna; implementação abre via FAB
      // "Abrir copiloto" (fechado por padrão — divergência soft no laudo).
      await expect.soft(
        studio.copilotDrawer(),
        'AT: drawer do copiloto exibido por padrão como coluna direita',
      ).toBeVisible({ timeout: 5_000 });
      await expect(studio.copilotToggle(), 'controle do copiloto disponível').toBeVisible();
      await studio.abrirCopiloto();
      const drawer = await studio.copilotDrawer().boundingBox();
      const vw = page.viewportSize()!.width;
      expect(drawer!.x + drawer!.width, 'drawer ancorado à direita da tela').toBeGreaterThan(vw * 0.9);
    });
  });
});
