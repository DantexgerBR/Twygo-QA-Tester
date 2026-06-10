// Testsuite: Criação via cards de Curso, Trilha e Pacote
// TC6 — Selecionar card "Curso" direciona para o Estúdio de Criação
// TC7 — Selecionar card "Trilha" mantém fluxo atual
// TC8 — Selecionar card "Pacote" mantém fluxo atual
//
// ⚠ DIVERGÊNCIA OBSERVADA EM RECON (2026-06-03, org 37061):
//   - Card "Curso"  → /o/{org}/contents/new?kind=course (form "Novo curso",
//     aba Identificação) — AT espera redirect ao Estúdio com URL /edit/studio.
//   - Cards "Trilha"/"Pacote" → /contents/new?kind=learning_path|package,
//     porém a página renderiza o MESMO form "Novo curso" (breadcrumb
//     "Conteúdos > Adicionar curso") — AT espera o fluxo atual de criação de
//     Trilha/Pacote.
//   Asserções abaixo seguem a AT (fonte de verdade); reds documentam a
//   divergência para triagem com o dev (AT desatualizada × produto incompleto).
//   Sonda confirmou que o clique NÃO cria registro — suite read-only.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioCardsPage } from '../../../pages/StudioCardsPage.js';
import { cardsData as data } from './criacao-via-cards.shared.data.js';

test.describe('Criação via cards de Curso, Trilha e Pacote', () => {
  test('TC6 — Selecionar card "Curso" direciona para o Estúdio de Criação', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Criação via cards de Curso, Trilha e Pacote');
    await allure.story('TC6 — Selecionar card "Curso" direciona para o Estúdio de Criação');
    await allure.severity('critical');

    const cards = new StudioCardsPage(page);
    await allure.step('1. Página de seleção de tipo aberta', async () => {
      await cards.gotoPaginaCards();
      await expect(cards.headerPergunta()).toBeVisible({ timeout: 20_000 });
    });
    await allure.step('2. Clicar no card "Curso" — redireciona para o Estúdio de Criação', async () => {
      await cards.clicarCard('Curso');
      await page.waitForTimeout(4000);
    });
    await allure.step('3. URL contém "/edit/studio"', async () => {
      expect(page.url(), 'AT: URL do Estúdio de Criação contém /edit/studio').toMatch(data.rotaEstudioCriacao);
    });
    await allure.step('4. Curso aberto está vazio (sem atividades cadastradas)', async () => {
      // Só alcançável se o passo 3 passou (estúdio aberto): lista de atividades vazia.
      const itensAtividade = await page.locator('[data-test-id*="activity"], [class*="activity-list"] li').count();
      expect(itensAtividade, 'lista de atividades do curso novo deve estar vazia').toBe(0);
    });
  });

  test('TC7 — Selecionar card "Trilha" mantém fluxo atual', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Criação via cards de Curso, Trilha e Pacote');
    await allure.story('TC7 — Selecionar card "Trilha" mantém fluxo atual');
    await allure.severity('normal');

    const cards = new StudioCardsPage(page);
    await cards.gotoPaginaCards();
    await expect(cards.headerPergunta()).toBeVisible({ timeout: 20_000 });
    await allure.step('2. Clicar no card "Trilha" — segue fluxo atual de criação de Trilha', async () => {
      await cards.clicarCard('Trilha');
      await page.waitForTimeout(4000);
      // Fluxo atual de criação de Trilha = form da Trilha (não o do Curso).
      // Heading/breadcrumb deve referenciar Trilha.
      const corpo = (await page.locator('h1, h2, h3, [class*="breadcrumb"]').allTextContents()).join(' | ');
      expect(corpo, `cabeçalhos da página pós-clique deveriam referenciar Trilha. Encontrado: ${corpo.slice(0, 200)}`)
        .toMatch(/trilha/i);
    });
  });

  test('TC8 — Selecionar card "Pacote" mantém fluxo atual', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Criação via cards de Curso, Trilha e Pacote');
    await allure.story('TC8 — Selecionar card "Pacote" mantém fluxo atual');
    await allure.severity('normal');

    const cards = new StudioCardsPage(page);
    await cards.gotoPaginaCards();
    await expect(cards.headerPergunta()).toBeVisible({ timeout: 20_000 });
    await allure.step('2. Clicar no card "Pacote" — segue fluxo atual de criação de Pacote', async () => {
      await cards.clicarCard('Pacote');
      await page.waitForTimeout(4000);
      const corpo = (await page.locator('h1, h2, h3, [class*="breadcrumb"]').allTextContents()).join(' | ');
      expect(corpo, `cabeçalhos da página pós-clique deveriam referenciar Pacote. Encontrado: ${corpo.slice(0, 200)}`)
        .toMatch(/pacote/i);
    });
  });
});
