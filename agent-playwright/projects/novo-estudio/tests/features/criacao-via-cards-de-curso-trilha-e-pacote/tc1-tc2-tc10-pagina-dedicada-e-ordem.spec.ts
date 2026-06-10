// Testsuite: Criação via cards de Curso, Trilha e Pacote
// TC1  — Validar abertura da página de seleção de tipo via "Adicionar"
// TC2  — Validar ordem fixa dos cards: Curso, Trilha, Pacote
// TC10 — Validar que a página de cards NÃO é modal nem drawer
//
// Pré-condição da suíte: feature flag "creation_studio" ON (validada em recon
// 2026-06-03 — página dos 3 cards renderiza na org). Suite read-only.
// Nota de rota: AT prevê "/events/new ou caminho equivalente"; rota real
// implementada é /o/{org}/studio (aceita pela regex do .data).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioCardsPage } from '../../../pages/StudioCardsPage.js';
import { cardsData as data } from './criacao-via-cards.shared.data.js';

test.describe('Criação via cards de Curso, Trilha e Pacote', () => {
  test('TC1 — Validar abertura da página de seleção de tipo via "Adicionar"', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Criação via cards de Curso, Trilha e Pacote');
    await allure.story('TC1 — Validar abertura da página de seleção de tipo via "Adicionar"');
    await allure.severity('critical');

    const cards = new StudioCardsPage(page);
    await allure.step('2. Acessar a URL "/o/{org}/events" — Listagem de Conteúdos é exibida', async () => {
      await cards.gotoConteudos();
      await expect(cards.botaoAdicionar()).toBeVisible({ timeout: 20_000 });
    });
    await allure.step('3. Clicar no botão "Adicionar" — página dedicada com 3 cards', async () => {
      await cards.clicarAdicionar();
      await expect(cards.headerPergunta()).toBeVisible({ timeout: 20_000 });
      for (const c of data.cards) {
        expect(await cards.tituloCardVisivel(c.titulo), `card "${c.titulo}" visível`).toBe(true);
      }
    });
    await allure.step('4. Validar URL da nova página dedicada', async () => {
      expect(page.url()).toMatch(data.rotaPaginaCards);
    });
  });

  test('TC2 — Validar ordem fixa dos cards: Curso, Trilha, Pacote', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Criação via cards de Curso, Trilha e Pacote');
    await allure.story('TC2 — Validar ordem fixa dos cards: Curso, Trilha, Pacote');
    await allure.severity('critical');

    const cards = new StudioCardsPage(page);
    await allure.step('2. Aguardar a página de seleção de tipo — 3 cards exibidos', async () => {
      await cards.gotoPaginaCards();
      await expect(cards.headerPergunta()).toBeVisible({ timeout: 20_000 });
    });
    await allure.step('3-4. Ordem esquerda→direita: 1º Curso, 2º Trilha, 3º Pacote (Pacote sempre último)', async () => {
      const posicoes: Array<{ titulo: string; x: number }> = [];
      for (const c of data.cards) {
        const box = await cards.boundingBoxTitulo(c.titulo);
        expect(box, `boundingBox do card "${c.titulo}"`).not.toBeNull();
        posicoes.push({ titulo: c.titulo, x: box!.x });
      }
      const [curso, trilha, pacote] = posicoes;
      expect(curso.x, 'Curso à esquerda de Trilha').toBeLessThan(trilha.x);
      expect(trilha.x, 'Trilha à esquerda de Pacote').toBeLessThan(pacote.x);
      const maisADireita = posicoes.reduce((a, b) => (a.x > b.x ? a : b));
      expect(maisADireita.titulo, 'Pacote é o último da ordem').toBe('Pacote');
    });
  });

  test('TC10 — Validar que a página de cards NÃO é modal nem drawer', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Criação via cards de Curso, Trilha e Pacote');
    await allure.story('TC10 — Validar que a página de cards NÃO é modal nem drawer');
    await allure.severity('minor');

    const cards = new StudioCardsPage(page);
    await allure.step('2. Clicar no botão "Adicionar" — página dedicada é aberta', async () => {
      await cards.gotoConteudos();
      await cards.clicarAdicionar();
      await expect(cards.headerPergunta()).toBeVisible({ timeout: 20_000 });
    });
    await allure.step('3. Sem sobreposição de modal ou drawer (nenhum overlay visível)', async () => {
      expect(await cards.overlaysVisiveis(), 'overlays/dialogs visíveis sobre a página').toBe(0);
    });
    await allure.step('4. URL mudou para a rota dedicada', async () => {
      expect(page.url()).toMatch(data.rotaPaginaCards);
    });
  });
});
