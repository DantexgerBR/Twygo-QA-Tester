// Testsuite: Estúdio de Criação com tela única em três colunas (QA 1.2)
// TC7 — Validar drawer do copiloto expansível até ~50%
// TC8 — Validar fechamento do drawer do copiloto
//
// Recon 2026-06-05 (1366x720): drawer FECHADO por padrão (FAB "Abrir copiloto",
// test-id copilot-drawer-toggle); ao abrir, ocupa ~66% da viewport em overlay;
// botão "Expandir" NÃO existe. TC7 usa asserts soft pra coletar as 3
// divergências (default visível / largura ~30% / botão Expandir) num run só.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioPage } from '../../../pages/StudioPage.js';
import { estudioData as data } from './estudio-tres-colunas.shared.data.js';

test.describe('Estúdio de Criação com tela única em três colunas', () => {
  test('TC7 — Validar drawer do copiloto expansível até ~50%', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Estúdio de Criação com tela única em três colunas');
    await allure.story('TC7 — Validar drawer do copiloto expansível até ~50%');
    await allure.severity('critical');

    const studio = new StudioPage(page);
    await studio.gotoEstudio(data.courseId);
    await expect(studio.shell()).toBeVisible({ timeout: 30_000 });

    await allure.step('2. Drawer do copiloto exibido — ocupa ~30% da largura por padrão', async () => {
      await expect.soft(
        studio.copilotDrawer(),
        'AT: drawer visível por padrão (implementação abre via FAB)',
      ).toBeVisible({ timeout: 5_000 });
      await studio.abrirCopiloto();
      const pct = await studio.larguraPct(studio.copilotDrawer());
      const { padraoPct, toleranciaPct } = data.larguraDrawer;
      expect.soft(pct, `largura padrão ~${padraoPct}% (±${toleranciaPct})`).toBeGreaterThan(padraoPct - toleranciaPct);
      expect.soft(pct, `largura padrão ~${padraoPct}% (±${toleranciaPct})`).toBeLessThan(padraoPct + toleranciaPct);
    });

    await allure.step('3. Botão "Expandir" — drawer expande até ~50% da largura', async () => {
      const expandir = studio.copilotExpandir().first();
      await expect.soft(expandir, 'AT: botão "Expandir" do drawer existe').toBeVisible({ timeout: 5_000 });
      if (await expandir.isVisible().catch(() => false)) {
        await expandir.click();
        await page.waitForTimeout(1500);
        const pct = await studio.larguraPct(studio.copilotDrawer());
        const { expandidoPct, toleranciaPct } = data.larguraDrawer;
        expect.soft(pct, `largura expandida ~${expandidoPct}% (±${toleranciaPct})`).toBeGreaterThan(expandidoPct - toleranciaPct);
        expect.soft(pct, `largura expandida ~${expandidoPct}% (±${toleranciaPct})`).toBeLessThan(expandidoPct + toleranciaPct);
      }
    });

    await allure.step('4. Coluna central reduz proporcionalmente sem quebrar', async () => {
      expect(await studio.temOverflowHorizontal(), 'sem scroll horizontal com drawer aberto').toBe(false);
    });
  });

  test('TC8 — Validar fechamento do drawer do copiloto', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Estúdio de Criação com tela única em três colunas');
    await allure.story('TC8 — Validar fechamento do drawer do copiloto');
    await allure.severity('normal');

    const studio = new StudioPage(page);
    await studio.gotoEstudio(data.courseId);
    await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
    await studio.abrirCopiloto();

    await allure.step('2. Clicar no botão "X" do drawer — drawer é fechado', async () => {
      await studio.fecharCopiloto();
      await expect(studio.copilotDrawer()).toBeHidden({ timeout: 10_000 });
    });

    await allure.step('3. Coluna central de preview expande para ocupar o espaço liberado', async () => {
      await expect(studio.preview(), 'preview visível após fechar o drawer').toBeVisible();
      await expect(studio.listaAtividades()).toBeVisible();
      expect(await studio.temOverflowHorizontal(), 'layout sem quebra após fechar').toBe(false);
    });
  });
});
