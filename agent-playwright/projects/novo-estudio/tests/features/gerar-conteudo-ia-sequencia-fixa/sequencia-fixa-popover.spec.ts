import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './gerar-conteudo-ia-sequencia-fixa.shared.data.js';

// ============================================================================
// TC1 / TC2 — Sequência fixa de geração (DAG).
//
// A ordem fixa das etapas é asserível pelas LINHAS do popover de pendências
// (studio-pending-artifacts-row-*), SEM disparar geração real (decisão do
// usuário 2026-06-05: affordances + fixme nos longos). Ver
// inputs/recon-gerar-conteudo-ia.md.
//
// Seed worker-isolada por teste + cleanup no afterEach (curso compartilhado).
// ============================================================================

const CID = suiteData.contentId;
let createdTitle: string | null = null;

async function seed(
  page: import('@playwright/test').Page,
  type: string,
  tag: string,
  workerIndex: number,
): Promise<{ studio: StudioActivitiesPage; title: string }> {
  page.on('dialog', (d) => d.accept().catch(() => {})); // beforeunload do editor
  const studio = new StudioActivitiesPage(page);
  await studio.goto(CID);
  const title = `IA-${tag}-w${workerIndex}-${Date.now()}`;
  createdTitle = title;
  await studio.seedActivity(CID, type, title);
  return { studio, title };
}

/** Lê as etapas pendentes na ORDEM em que aparecem no popover aberto. */
async function popoverStageOrder(studio: StudioActivitiesPage): Promise<string[]> {
  return studio.pendingPopover
    .locator('[data-test-id^="studio-pending-artifacts-row-"]')
    .evaluateAll((els) =>
      els.map((e) => (e.getAttribute('data-test-id') ?? '').replace('studio-pending-artifacts-row-', '')),
    );
}

test.describe(suiteData.suiteName, () => {
  test.afterEach(async ({ page }) => {
    if (!createdTitle) return;
    const studio = new StudioActivitiesPage(page);
    await studio.goto(CID);
    await studio.closeCopilotIfOpen();
    await studio.deleteActivityByTitle_safe(createdTitle);
    createdTitle = null;
  });

  test('Validar sequência fixa de Lesson (Roteiro→Slides→Imagens→Áudios→Renderização)', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar sequência fixa de Lesson (Roteiro→Slides→Imagens→Áudios→Renderização)');
    await allure.severity('critical');

    const { studio, title } = await seed(page, 'lesson', 'TC1', info.workerIndex);
    const card = studio.cardByTitle(title).first();

    await allure.step('Abrir o popover de pendências da Lesson', async () => {
      await expect(studio.pendingBadge(card)).toContainText(/5 pendentes/i);
      await studio.openPendingPopover(card);
    });
    await allure.step('Validar a ordem fixa das 5 etapas', async () => {
      // Affordance da sequência fixa: a ordem das etapas pendentes é o DAG.
      // NÃO dispara geração (apenas inspeciona o popover).
      expect(await popoverStageOrder(studio)).toEqual([...suiteData.lessonStages]);
    });
  });

  test('Validar sequência fixa de Page (Roteiro→Conteúdo→Imagens)', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar sequência fixa de Page (Roteiro→Conteúdo→Imagens)');
    await allure.severity('critical');

    const { studio, title } = await seed(page, 'page', 'TC2', info.workerIndex);
    const card = studio.cardByTitle(title).first();

    await allure.step('Abrir o popover de pendências da Page', async () => {
      await expect(studio.pendingBadge(card)).toContainText(/3 pendentes/i);
      await studio.openPendingPopover(card);
    });
    await allure.step('Validar a ordem fixa das 3 etapas', async () => {
      expect(await popoverStageOrder(studio)).toEqual([...suiteData.pageStages]);
    });
  });
});
