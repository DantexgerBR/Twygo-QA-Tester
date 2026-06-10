// Testsuite: Estúdio de Criação com tela única em três colunas (QA 1.2)
// TC5 — Validar menu lateral principal colapsável para ícones
// TC6 — Validar menu lateral principal ocultar inteiramente
//
// Recon 2026-06-05: NENHUM controle de colapsar/ocultar o menu lateral principal
// foi encontrado no Estúdio (varredura de botões com x<260 + aria-labels).
// Se estes TCs falharem em "controle não encontrado", a funcionalidade da AT
// está ausente nesta entrega — confirmar com o solicitante se faz parte da RN 2.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioPage } from '../../../pages/StudioPage.js';
import { estudioData as data } from './estudio-tres-colunas.shared.data.js';

test.describe('Estúdio de Criação com tela única em três colunas', () => {
  test('TC5 — Validar menu lateral principal colapsável para ícones', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Estúdio de Criação com tela única em três colunas');
    await allure.story('TC5 — Validar menu lateral principal colapsável para ícones');
    await allure.severity('normal');

    const studio = new StudioPage(page);
    await studio.gotoEstudio(data.courseId);
    await expect(studio.shell()).toBeVisible({ timeout: 30_000 });

    await allure.step('2. Clicar no botão de colapsar menu lateral — menu recolhe para ícones', async () => {
      const btn = studio.botaoColapsarMenu().first();
      await expect(btn, 'botão de colapsar o menu lateral principal existe').toBeVisible({ timeout: 10_000 });
      const listaAntes = await studio.listaAtividades().boundingBox();
      await btn.click();
      await page.waitForTimeout(1500);
      const listaDepois = await studio.listaAtividades().boundingBox();
      await allure.step('3. Coluna esquerda do Estúdio ganha espaço horizontal', async () => {
        expect(
          listaDepois!.x < listaAntes!.x || listaDepois!.width > listaAntes!.width,
          'Estúdio ganhou espaço horizontal após colapsar o menu',
        ).toBe(true);
      });
    });
  });

  test('TC6 — Validar menu lateral principal ocultar inteiramente', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Estúdio de Criação com tela única em três colunas');
    await allure.story('TC6 — Validar menu lateral principal ocultar inteiramente');
    await allure.severity('normal');

    const studio = new StudioPage(page);
    await studio.gotoEstudio(data.courseId);
    await expect(studio.shell()).toBeVisible({ timeout: 30_000 });

    await allure.step('2. Clicar no botão de ocultar menu lateral inteiramente', async () => {
      const btn = studio.botaoOcultarMenu().first();
      await expect(btn, 'botão de ocultar o menu lateral principal existe').toBeVisible({ timeout: 10_000 });
      await btn.click();
      await page.waitForTimeout(1500);
    });

    await allure.step('3. Estúdio ocupa toda a largura disponível', async () => {
      const shell = await studio.shell().boundingBox();
      const vw = page.viewportSize()!.width;
      expect(shell!.width, 'shell ocupa ~toda a largura da tela').toBeGreaterThan(vw * 0.92);
    });
  });
});
