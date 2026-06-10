// Testsuite: Criação via cards de Curso, Trilha e Pacote
// TC3 — Validar conteúdo do card "Curso"   (título + descrição literal + ícone)
// TC4 — Validar conteúdo do card "Trilha"
// TC5 — Validar conteúdo do card "Pacote"

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioCardsPage } from '../../../pages/StudioCardsPage.js';
import { cardsData as data } from './criacao-via-cards.shared.data.js';

test.describe('Criação via cards de Curso, Trilha e Pacote', () => {
  for (const card of data.cards) {
    const tcNum = { Curso: 'TC3', Trilha: 'TC4', Pacote: 'TC5' }[card.titulo];
    test(`${tcNum} — Validar conteúdo do card "${card.titulo}"`, async ({ page }) => {
      await allure.epic('Twygo - Novo Estúdio de Criação');
      await allure.feature('Criação via cards de Curso, Trilha e Pacote');
      await allure.story(`${tcNum} — Validar conteúdo do card "${card.titulo}"`);
      await allure.severity('normal');

      const cards = new StudioCardsPage(page);
      await allure.step('2. Aguardar a página de seleção de tipo ser exibida', async () => {
        await cards.gotoPaginaCards();
        await expect(cards.headerPergunta()).toBeVisible({ timeout: 20_000 });
      });
      await allure.step(`3. Título do card: "${card.titulo}"`, async () => {
        expect(await cards.tituloCardVisivel(card.titulo)).toBe(true);
      });
      await allure.step('4-5. Parágrafo descritivo literal + ícone dentro do card', async () => {
        const info = await cards.inspecionarCard(card.titulo, card.descricao);
        expect(info.achouDescricao, `descrição literal "${card.descricao}" exibida`).toBe(true);
        expect(info.tituloNoCard, 'título pertence ao mesmo card da descrição').toBe(true);
        expect(info.temIcone, `ícone do card "${card.titulo}" exibido`).toBe(true);
      });
    });
  }
});
