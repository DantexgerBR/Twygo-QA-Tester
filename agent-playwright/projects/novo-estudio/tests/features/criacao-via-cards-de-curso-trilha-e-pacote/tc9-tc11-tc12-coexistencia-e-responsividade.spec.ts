// Testsuite: Criação via cards de Curso, Trilha e Pacote
// TC9  — Validar coexistência com "Criar curso com IA" (assistente 4 passos)
// TC11 — Validar exibição dos 3 cards em viewport Tablet (768x1024)
// TC12 — Validar exibição dos 3 cards em viewport Mobile (360x740)

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioCardsPage } from '../../../pages/StudioCardsPage.js';
import { cardsData as data } from './criacao-via-cards.shared.data.js';

test.describe('Criação via cards de Curso, Trilha e Pacote', () => {
  test('TC9 — Validar coexistência com "Criar curso com IA" (assistente 4 passos)', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Criação via cards de Curso, Trilha e Pacote');
    await allure.story('TC9 — Validar coexistência com "Criar curso com IA" (assistente 4 passos)');
    await allure.severity('normal');

    const cards = new StudioCardsPage(page);
    await allure.step('2. Acessar a listagem de Conteúdos', async () => {
      await cards.gotoConteudos();
      await expect(cards.botaoAdicionar()).toBeVisible({ timeout: 20_000 });
    });
    let chamada = page.getByText(data.chamadaIa, { exact: false }).first();
    await allure.step('3. Chamada "Criar curso com IA" é exibida', async () => {
      // a chamada pode morar na listagem OU dentro da página de cards
      if (!(await chamada.isVisible().catch(() => false))) {
        await cards.clicarAdicionar();
        chamada = page.getByText(data.chamadaIa, { exact: false }).first();
      }
      await expect(chamada, 'ação "Criar curso com IA" disponível').toBeVisible({ timeout: 15_000 });
    });
    await allure.step('4. Clicar em "Criar curso com IA" — assistente de 4 passos abre', async () => {
      const urlAntes = page.url();
      await chamada.click();
      await page.waitForTimeout(5000);
      const overlays = await cards.overlaysVisiveis();
      const mudouUrl = page.url() !== urlAntes;
      expect(overlays > 0 || mudouUrl, 'assistente abriu (modal visível ou navegação)').toBe(true);
    });
  });

  for (const [tcNum, nomeVp, vp] of [
    ['TC11', 'Tablet (768x1024)', data.viewports.tablet],
    ['TC12', 'Mobile (360x740)', data.viewports.mobile],
  ] as const) {
    test.describe(`${tcNum} — viewport ${nomeVp}`, () => {
      test.use({ viewport: { width: vp.width, height: vp.height } });
      test(`${tcNum} — Validar exibição dos 3 cards em viewport ${nomeVp}`, async ({ page }) => {
        await allure.epic('Twygo - Novo Estúdio de Criação');
        await allure.feature('Criação via cards de Curso, Trilha e Pacote');
        await allure.story(`${tcNum} — Validar exibição dos 3 cards em viewport ${nomeVp}`);
        await allure.severity('minor');

        const cards = new StudioCardsPage(page);
        await allure.step('2. Abrir página dedicada com 3 cards', async () => {
          await cards.gotoPaginaCards();
          await expect(cards.headerPergunta()).toBeVisible({ timeout: 20_000 });
        });
        await allure.step(`3. Cards adaptados à largura ${vp.width}px sem cortes`, async () => {
          for (const c of data.cards) {
            expect(await cards.tituloCardVisivel(c.titulo), `card "${c.titulo}" visível em ${vp.width}px`).toBe(true);
          }
          expect(await cards.temOverflowHorizontal(), 'sem overflow horizontal (cards sem corte)').toBe(false);
        });
      });
    });
  }
});
