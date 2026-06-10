import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

// ============================================================================
// Lote 3 — badges de etapa / pendências. RE-BASELINADO ao NOVO modelo.
//
// Decisão do PO (2026-06-05): NÃO há mais badges de etapa por letra nem cores
// diferenciadas — o card indica apenas pendente/pronto via badge CONSOLIDADO
// "N pendentes" + POPOVER de detalhamento. RN 14.1/14.2/14.4/14.6 do Discovery
// ficam SUPERSEDED; RN 14.7 re-baselinada (badge → popover → item → copiloto).
// Ver TCS-FALHAS-reproducao-manual.md.
//
// Logo TC2/3/4/5/6/7/9/10 validam o modelo consolidado e PASSAM. Resta TC30
// reprovado por lacuna de acessibilidade (itens do popover sem aria-label) —
// bug de produto independente da mudança de RN.
//
// Seeds: cada teste cria sua atividade pendente e limpa no afterEach (sem serial).
// ============================================================================

const CID = suiteData.contentId;
const LETTER_BADGE = '[data-test-id^="studio-stage-letter-badge"]';

let createdTitle: string | null = null;

async function seed(page: import('@playwright/test').Page, type: string, tag: string, workerIndex: number): Promise<{ studio: StudioActivitiesPage; title: string }> {
  page.on('dialog', (d) => d.accept().catch(() => {})); // beforeunload do editor
  const studio = new StudioActivitiesPage(page);
  await studio.goto(CID);
  const title = `BADGE-${tag}-w${workerIndex}-${Date.now()}`;
  createdTitle = title;
  await studio.seedActivity(CID, type, title);
  return { studio, title };
}

test.describe(suiteData.suiteName, () => {
  test.afterEach(async ({ page }) => {
    if (!createdTitle) return;
    const studio = new StudioActivitiesPage(page);
    await studio.goto(CID);
    await studio.deleteActivityByTitle_safe(createdTitle);
    createdTitle = null;
  });

  // ---- TC31: popover de pendências da Lesson ----
  test('Validar popover de pendências para atividade Lesson (Aula)', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar popover de pendências para atividade Lesson (Aula)');
    await allure.severity('critical');
    const { studio, title } = await seed(page, 'lesson', 'TC31', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    await expect(studio.pendingBadge(card)).toContainText(/5 pendentes/i);
    await studio.openPendingPopover(card);
    await expect(studio.pendingPopover).toContainText(/Clique em um item pendente para gerar com o copiloto/i);
    for (const key of ['roteiro', 'slides', 'imagem', 'audio', 'render']) {
      await expect(studio.pendingRow(key)).toBeVisible();
    }
  });

  // ---- TC32: click em item do popover abre o copiloto ----
  test('Validar click em item pendente do popover abre copiloto contextualizado', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar click em item pendente do popover abre copiloto contextualizado');
    await allure.severity('critical');
    const { studio, title } = await seed(page, 'page', 'TC32', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    await studio.openPendingPopover(card);
    await studio.pendingRow('roteiro').click();
    await expect(studio.copilotDrawer).toBeVisible();
    await expect(page.getByTestId('studio-copilot-validation-body-roteiro').first()).toBeVisible();
  });

  // ---- TC2: Lesson — modelo consolidado "5 pendentes" + popover (RN 14.1 superseded) ----
  test('Validar 5 badges em atividade do tipo Lesson', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar 5 badges em atividade do tipo Lesson');
    await allure.severity('critical');
    const { studio, title } = await seed(page, 'lesson', 'TC2', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    // Novo modelo (PO 06-05): sem badges de letra; badge consolidado + popover.
    await expect(card.locator(LETTER_BADGE)).toHaveCount(0);
    await expect(studio.pendingBadge(card)).toContainText(/5 pendentes/i);
    await studio.openPendingPopover(card);
    for (const key of ['roteiro', 'slides', 'imagem', 'audio', 'render']) {
      await expect(studio.pendingRow(key)).toBeVisible();
    }
  });

  // ---- TC3: Page — modelo consolidado "3 pendentes" + popover (RN 14.2 superseded) ----
  test('Validar 3 badges em atividade do tipo Page', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar 3 badges em atividade do tipo Page');
    await allure.severity('critical');
    const { studio, title } = await seed(page, 'page', 'TC3', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    await expect(card.locator(LETTER_BADGE)).toHaveCount(0);
    await expect(studio.pendingBadge(card)).toContainText(/3 pendentes/i);
    await studio.openPendingPopover(card);
    for (const key of ['roteiro', 'conteudo_pagina', 'imagem']) {
      await expect(studio.pendingRow(key)).toBeVisible();
    }
  });

  // ---- TC4: tipo sem subdivisão → pendente/pronto unificado (RN 14.3, agora p/ todos) ----
  test('Validar badge "Pendente"/"Pronto" nos tipos sem subdivisão', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar badge "Pendente"/"Pronto" nos tipos sem subdivisão');
    await allure.severity('critical');
    // Usa atividade single-stage EXISTENTE (Questionário "Avaliação do curso",
    // já concluída) — não seeda. Novo modelo: sem badges de letra; estado
    // pendente/pronto (concluída → "Liberada").
    const studio = new StudioActivitiesPage(page);
    await studio.goto(CID);
    const card = studio.cardByTitle('Avaliação do curso').first();
    await card.scrollIntoViewIfNeeded();
    await expect(card.locator(LETTER_BADGE)).toHaveCount(0);
    await expect(studio.statusReleased(card)).toBeVisible();
  });

  // ---- TC5/6/7: estado de etapa SEM cor de badge de letra (RN 14.4 superseded) ----
  for (const tc of [
    { story: 'Validar cor verde para etapa concluída', rn: 'RN 14.4' },
    { story: 'Validar cor cinza/laranja para etapa pendente', rn: 'RN 14.4' },
    { story: 'Validar cor cinza-claro para etapa opcional (Imagens)', rn: 'RN 14.4 + 36.4' },
  ]) {
    test(tc.story, async ({ page }, info) => {
      await allure.epic(suiteData.projectEpic);
      await allure.feature(suiteData.suiteName);
      await allure.story(tc.story);
      await allure.severity('critical');
      const { studio, title } = await seed(page, 'lesson', 'TC567', info.workerIndex);
      const card = studio.cardByTitle(title).first();
      // RN 14.4 superseded (sem cores por etapa). Novo modelo: card não usa
      // badges de letra/cor; o estado das etapas é exposto no popover.
      await expect(card.locator(LETTER_BADGE)).toHaveCount(0);
      await studio.openPendingPopover(card);
      await expect(studio.pendingRow('roteiro')).toBeVisible();
    });
  }

  // ---- TC9: detalhe da etapa via popover (RN 14.6 superseded — sem tooltip por letra) ----
  test('Validar tooltip ao passar mouse sobre badge', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar tooltip ao passar mouse sobre badge');
    await allure.severity('normal');
    const { studio, title } = await seed(page, 'lesson', 'TC9', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    // RN 14.6 superseded: o detalhe da etapa não é tooltip por badge de letra,
    // e sim o popover de pendências.
    await expect(card.locator(LETTER_BADGE)).toHaveCount(0);
    await studio.openPendingPopover(card);
    await expect(studio.pendingPopover).toContainText(/pendente/i);
  });

  // ---- TC10: click na badge consolidada abre o POPOVER (RN 14.7 re-baselinada) ----
  test('Validar click em badge abre copiloto contextualizado', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar click em badge abre copiloto contextualizado');
    await allure.severity('critical');
    const { studio, title } = await seed(page, 'lesson', 'TC10', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    // RN 14.7 re-baselinada: click na badge abre o popover (não o copiloto
    // direto); o copiloto abre ao clicar num item do popover (TC32).
    await studio.pendingBadge(card).scrollIntoViewIfNeeded();
    await studio.pendingBadge(card).click();
    await expect(studio.pendingPopover).toBeVisible();
  });

  // ---- TC30: popover do Page — REPROVADO: itens sem aria-label (acessibilidade) ----
  test('Validar popover de detalhamento de pendências (badge clicável)', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar popover de detalhamento de pendências (badge clicável)');
    await allure.severity('critical');
    const { studio, title } = await seed(page, 'page', 'TC30', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    await expect(studio.pendingBadge(card)).toContainText(/3 pendentes/i);
    await studio.openPendingPopover(card);
    for (const key of ['roteiro', 'conteudo_pagina', 'imagem']) {
      await expect(studio.pendingRow(key)).toBeVisible();
    }
    // BUG DE PRODUTO (acessibilidade): a AT exige aria-label nos itens do popover
    // ("<etapa>, pendente. Clique para gerar com o copiloto."), mas os botões NÃO
    // o definem (recon 2026-06-05). Reprova até o produto adicionar o aria-label.
    const aria = await studio.pendingRow('roteiro').getAttribute('aria-label');
    expect(aria, 'BUG: itens do popover sem aria-label exigido pela AT (acessibilidade)').toMatch(/roteiro.*pendente.*copiloto/i);
  });
});
