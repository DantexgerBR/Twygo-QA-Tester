import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './gerar-conteudo-ia-sequencia-fixa.shared.data.js';

// ============================================================================
// TC4 / TC5 — Etapa "Imagens" como opcional (Lesson e Page).
//
// ⚠️ Modelo de badge SUPERSEDED (PO 2026-06-05): não há mais "badge cinza-claro
// opcional" nem cores por etapa. A etapa "imagem" aparece como uma linha do
// popover de pendências como as demais. A *opcionalidade* (poder aprovar sem
// gerar imagens) é comportamento de aprovação que depende de geração real →
// fora do escopo affordance (ver fixmes-geracao-ia.spec.ts, ligado a TC19).
// Aqui validamos o modelo NOVO: sem badge de letra; "imagem" presente no popover.
// ============================================================================

const CID = suiteData.contentId;
const LETTER_BADGE = '[data-test-id^="studio-stage-letter-badge"]';
let createdTitle: string | null = null;

async function seed(
  page: import('@playwright/test').Page,
  type: string,
  tag: string,
  workerIndex: number,
): Promise<{ studio: StudioActivitiesPage; title: string }> {
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const studio = new StudioActivitiesPage(page);
  await studio.goto(CID);
  const title = `IA-${tag}-w${workerIndex}-${Date.now()}`;
  createdTitle = title;
  await studio.seedActivity(CID, type, title);
  return { studio, title };
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

  test('Validar etapa Imagens como opcional em Lesson', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar etapa Imagens como opcional em Lesson');
    await allure.severity('critical');

    const { studio, title } = await seed(page, 'lesson', 'TC4', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    // REVISAR (agent-at): RN 14.4/36.4 superseded — sem badge cinza-claro
    // "opcional". Validamos o modelo consolidado: sem badge de letra; a etapa
    // "imagem" existe no popover.
    await expect(card.locator(LETTER_BADGE)).toHaveCount(0);
    await studio.openPendingPopover(card);
    await expect(studio.pendingRow('imagem')).toBeVisible();
  });

  test('Validar etapa Imagens como opcional em Page', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar etapa Imagens como opcional em Page');
    await allure.severity('critical');

    const { studio, title } = await seed(page, 'page', 'TC5', info.workerIndex);
    const card = studio.cardByTitle(title).first();
    // REVISAR (agent-at): mesma supersedência do badge "opcional".
    await expect(card.locator(LETTER_BADGE)).toHaveCount(0);
    await studio.openPendingPopover(card);
    await expect(studio.pendingRow('imagem')).toBeVisible();
  });
});
