import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './suportar-mobile.shared.data.js';

// ============================================================================
// Suíte #R14 — "Suportar mobile" (QA 1.14). Recon 2026-06-09 (org 37061, curso
// 807533) confirmou: o Estúdio É responsivo — em <768px colapsa para coluna
// única (lista; preview via drill-down ao tocar a atividade) e em >=768px
// mostra 2 colunas (lista + preview). O copiloto é um FAB (`copilot-drawer-
// toggle`). PORÉM a RN 54.2 (Discovery) especifica "lista/preview/copiloto
// como 3 TABS no rodapé" — isso NÃO existe (o produto faz drill-down + FAB).
// Como #R14 é P3 "mobile minimamente", a divergência fica para alinhar com
// João (decisão consciente vs gap), não cravada como bug. Detalhe e evidência
// em inputs/recon-suportar-mobile.md. Tracking: card 19718.
// ============================================================================

test.describe(suiteData.suiteName, () => {
  // Preview pane direto por testId — o POM compartilhado não expõe getter e
  // não convém alterá-lo só para esta suíte (consumido por várias outras).
  const previewPane = (page: import('@playwright/test').Page) =>
    page.getByTestId('creation-studio-preview-pane');

  test('Acessar Estúdio em viewport Mobile (360x740)', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Acessar Estúdio em viewport Mobile (360x740)');
    await allure.severity('minor');

    await page.setViewportSize(suiteData.viewports.mobile);
    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    await expect(studio.threeColumnShell).toBeVisible();
    await expect(studio.list).toBeVisible();
    // <768px: layout mobile (coluna única). O preview não ocupa coluna — só
    // aparece via drill-down ao tocar uma atividade (RN 54 reorganização).
    await expect(previewPane(page)).toBeHidden();
  });

  test('Drawer do copiloto vira tela cheia em mobile', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Drawer do copiloto vira tela cheia em mobile');
    await allure.severity('minor');

    await page.setViewportSize(suiteData.viewports.mobile);
    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    // FAB do copiloto (catalogado no recon: aria "Abrir copiloto").
    await page.getByTestId('copilot-drawer-toggle').click();
    const drawer = page.getByTestId('copilot-drawer');
    await expect(drawer).toBeVisible();
    // RN 54.1: em mobile o drawer ocupa a tela cheia (largura ~ viewport).
    const box = await drawer.boundingBox();
    expect(box).not.toBeNull();
    expect(box!.width).toBeGreaterThanOrEqual(suiteData.viewports.mobile.width - 12);
  });

  test('Lista, preview e copiloto viram 3 tabs no rodapé', async () => {
    test.fixme(
      true,
      `[divergencia-spec] RN 54.2 especifica lista/preview/copiloto como 3 TABS no rodapé; o produto faz drill-down (tocar atividade → preview substitui a lista) + copiloto via FAB "copilot-drawer-toggle", sem tab-bar no rodapé (recon ${suiteData.reconDate}). Alinhar com João: "mobile minimamente" (#R14 P3) aceito assim, ou gap? Card ${suiteData.trackingCard}.`,
    );
  });

  test('Alternar entre tabs no rodapé', async () => {
    test.fixme(
      true,
      '[divergencia-spec] depende da tab-bar da RN 54.2, que não existe na UI — a navegação mobile é drill-down (lista ↔ preview), não troca por tabs. Alinhar com João.',
    );
  });

  test('Drag and drop touch com handle ampliado', async () => {
    test.fixme(
      true,
      '[touch-dnd] reorder por touch (dnd-kit PointerSensor, RN 54.3) no curso compartilhado 807533 tem risco de aninhar/corromper a estrutura para outras suítes; o handle existe, mas teste confiável exige sandbox de atividades descartáveis. Ver gotcha de drag em testar-estudio-criacao-twygo.',
    );
  });

  test('Operações de IA disponíveis em mobile (latência maior aceita)', async () => {
    test.fixme(
      true,
      '[geracao-longa] disparar geração de IA em mobile (RN 55) cascateia geração real (cara/não-determinística). A disponibilidade do copiloto em mobile é coberta indiretamente por "Drawer do copiloto vira tela cheia".',
    );
  });

  test('Edição inline acessível em mobile (UX não otimizada)', async () => {
    test.fixme(
      true,
      '[editor-nao-reconhecido] requer abrir o editor Plate.js/Fabric.js em mobile (RN 56 — UX não otimizada por premissa); editor fora do recon. Skill testar-plate-editor-twygo.',
    );
  });

  test('Viewport < 768px aplica layout mobile', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Viewport < 768px aplica layout mobile');
    await allure.severity('minor');

    await page.setViewportSize(suiteData.viewports.breakpoint); // 767px
    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    await expect(studio.list).toBeVisible();
    // 767px ainda é < 768 → layout mobile (coluna única, preview colapsado).
    await expect(previewPane(page)).toBeHidden();
  });

  test('Viewport Tablet (768x1024) com comportamento intermediário', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Viewport Tablet (768x1024) com comportamento intermediário');
    await allure.severity('minor');

    await page.setViewportSize(suiteData.viewports.tablet); // 768px
    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    // >=768px: layout intermediário — lista E preview ocupam colunas.
    await expect(studio.list).toBeVisible();
    await expect(previewPane(page)).toBeVisible();
  });
});
