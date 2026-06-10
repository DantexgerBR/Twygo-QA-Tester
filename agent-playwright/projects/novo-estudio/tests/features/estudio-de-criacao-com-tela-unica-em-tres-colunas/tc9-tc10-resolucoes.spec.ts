// Testsuite: Estúdio de Criação com tela única em três colunas (QA 1.2)
// TC9  — Validar que o layout-base NÃO quebra em 1366x720
// TC10 — Validar comportamento em resolução menor que 1366x720 (mobile/tablet)

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioPage } from '../../../pages/StudioPage.js';
import { estudioData as data } from './estudio-tres-colunas.shared.data.js';

test.describe('Estúdio de Criação com tela única em três colunas', () => {
  test.describe('TC9 — resolução otimizada', () => {
    test.use({ viewport: { ...data.viewports.otimizada } });

    test('TC9 — Validar que o layout-base NÃO quebra em 1366x720', async ({ page }) => {
      await allure.epic('Twygo - Novo Estúdio de Criação');
      await allure.feature('Estúdio de Criação com tela única em três colunas');
      await allure.story('TC9 — Validar que o layout-base NÃO quebra em 1366x720');
      await allure.severity('critical');

      const studio = new StudioPage(page);

      await allure.step('2. Estúdio carrega sem scrolls horizontais', async () => {
        await studio.gotoEstudio(data.courseId);
        await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
        expect(await studio.temOverflowHorizontal(), 'sem scroll horizontal em 1366x720').toBe(false);
      });

      await allure.step('3. Lista, preview e copiloto cabem na resolução sem quebras', async () => {
        await expect(studio.listaAtividades()).toBeVisible();
        await expect(studio.preview()).toBeVisible();
        await expect(studio.copilotToggle()).toBeVisible();
        await studio.abrirCopiloto();
        const drawer = await studio.copilotDrawer().boundingBox();
        expect(drawer!.x + drawer!.width, 'drawer dentro da viewport').toBeLessThanOrEqual(1366 + 4);
        expect(await studio.temOverflowHorizontal(), 'sem scroll horizontal com drawer aberto').toBe(false);
      });
    });
  });

  test.describe('TC10 — resolução menor', () => {
    test.use({ viewport: { ...data.viewports.menor } });

    test('TC10 — Validar comportamento em resolução menor que 1366x720', async ({ page }) => {
      await allure.epic('Twygo - Novo Estúdio de Criação');
      await allure.feature('Estúdio de Criação com tela única em três colunas');
      await allure.story('TC10 — Validar comportamento em resolução menor que 1366x720');
      await allure.severity('minor');

      const studio = new StudioPage(page);

      await allure.step('2. Estúdio aplica layout mobile/tablet (3 tabs no rodapé)', async () => {
        await studio.gotoEstudio(data.courseId);
        await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
        // AT: em <1366 o Estúdio cai pra layout mobile com 3 tabs no rodapé.
        // Procura controles de navegação no terço inferior da viewport.
        const tabsRodape = await page.evaluate(() => {
          const vh = window.innerHeight;
          return Array.from(document.querySelectorAll('[role="tab"], button'))
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.width > 5 && r.y > vh * 0.75 && /lista|atividades|preview|copiloto|conteúdo/i.test(el.textContent || el.getAttribute('aria-label') || '');
            })
            .map((el) => (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 30));
        });
        expect.soft(tabsRodape.length, `AT: 3 tabs no rodapé em 1024x600 (achadas: ${JSON.stringify(tabsRodape)})`).toBeGreaterThanOrEqual(3);
        expect(await studio.temOverflowHorizontal(), 'sem scroll horizontal em 1024x600').toBe(false);
      });
    });
  });
});
