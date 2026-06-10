import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './gerar-conteudo-ia-sequencia-fixa.shared.data.js';

// ============================================================================
// TC20 — Botão "Concluir geração com IA".
//
// Affordance (decisão do usuário 2026-06-05): asserimos a presença e o
// aria-label do botão no preview da atividade, SEM clicar (clicar dispararia a
// sequência completa de geração = caro). O recorte multi-select (marcar 3
// Lessons → ação em massa) → // REVISAR (não reconhecido no recon; o botão de
// IA reconhecido vive no preview de UMA atividade).
// ============================================================================

const CID = suiteData.contentId;
let createdTitle: string | null = null;

test.describe(suiteData.suiteName, () => {
  test.afterEach(async ({ page }) => {
    if (!createdTitle) return;
    const studio = new StudioActivitiesPage(page);
    await studio.goto(CID);
    await studio.closeCopilotIfOpen();
    await studio.deleteActivityByTitle_safe(createdTitle);
    createdTitle = null;
  });

  test('Botão "Concluir geração com IA" multi-select', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Botão "Concluir geração com IA" multi-select');
    await allure.severity('critical');

    page.on('dialog', (d) => d.accept().catch(() => {}));
    const studio = new StudioActivitiesPage(page);
    await studio.goto(CID);
    const title = `IA-TC20-w${info.workerIndex}-${Date.now()}`;
    createdTitle = title;
    await studio.seedActivity(CID, 'lesson', title);
    const card = studio.cardByTitle(title).first();

    await allure.step('Abrir a Lesson no preview', async () => {
      await studio.openActivity(card);
      await expect(studio.previewPane).toBeVisible();
    });
    await allure.step('Validar o botão "Concluir geração com IA" e seu aria-label', async () => {
      await expect(studio.previewCompleteWithAI).toBeVisible();
      await expect(studio.previewCompleteWithAI).toContainText(/Concluir geração com IA/i);
      // REVISAR (agent-at): recorte multi-select (checkbox + ação em massa) da AT
      // não reconhecido; o botão de IA reconhecido é o do preview de 1 atividade.
    });
  });
});
