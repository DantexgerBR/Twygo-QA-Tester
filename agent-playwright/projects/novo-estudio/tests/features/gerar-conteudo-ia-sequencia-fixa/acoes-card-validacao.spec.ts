import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './gerar-conteudo-ia-sequencia-fixa.shared.data.js';

// ============================================================================
// TC9 / TC10 / TC11 — Ações do card de validação (Aprovar / Regerar / Rejeitar).
//
// Affordance (decisão do usuário 2026-06-05): os 3 botões só existem no card de
// validação, que aparece APÓS o disparo da geração. Disparamos a etapa BARATA
// (roteiro = texto) e asserimos que cada botão aparece, SEM aprovar (aprovar
// cascateia para slides/imagem/áudio). TC11 clica em Rejeitar (cancela a etapa).
//
// ⚠️ Estes testes disparam geração REAL de roteiro no backend (uma task de texto
// por teste). Curso compartilhado → cleanup obrigatório + workers=1.
// ============================================================================

const CID = suiteData.contentId;
let createdTitle: string | null = null;

async function seedAndTriggerRoteiro(
  page: import('@playwright/test').Page,
  tag: string,
  workerIndex: number,
): Promise<{ studio: StudioActivitiesPage; title: string }> {
  page.on('dialog', (d) => d.accept().catch(() => {}));
  const studio = new StudioActivitiesPage(page);
  await studio.goto(CID);
  const title = `IA-${tag}-w${workerIndex}-${Date.now()}`;
  createdTitle = title;
  await studio.seedActivity(CID, 'lesson', title);
  const card = studio.cardByTitle(title).first();
  await studio.triggerStageGeneration(card, 'roteiro'); // EFEITO REAL: enfileira roteiro
  return { studio, title };
}

test.describe(suiteData.suiteName, () => {
  test.describe.configure({ mode: 'serial' });

  test.afterEach(async ({ page }) => {
    if (!createdTitle) return;
    const studio = new StudioActivitiesPage(page);
    await studio.goto(CID);
    await studio.closeCopilotIfOpen();
    await studio.deleteActivityByTitle_safe(createdTitle);
    createdTitle = null;
  });

  test('Validar botão "Aprovar" segue para próxima etapa', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar botão "Aprovar" segue para próxima etapa');
    await allure.severity('critical');
    const { studio } = await seedAndTriggerRoteiro(page, 'TC9', info.workerIndex);
    // Affordance: o botão Aprovar existe no card de validação. NÃO clicamos
    // (aprovar avançaria para Slides, disparando geração cara).
    await expect(studio.validationApprove).toBeVisible();
  });

  test('Validar botão "Regerar" dispara nova geração', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar botão "Regerar" dispara nova geração');
    await allure.severity('critical');
    const { studio } = await seedAndTriggerRoteiro(page, 'TC10', info.workerIndex);
    // Affordance: o botão Regerar existe. Não clicamos (dispararia nova geração).
    await expect(studio.validationRegenerate).toBeVisible();
  });

  test('Validar botão "Rejeitar e descartar" cancela a etapa', async ({ page }, info) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar botão "Rejeitar e descartar" cancela a etapa');
    await allure.severity('critical');
    const { studio } = await seedAndTriggerRoteiro(page, 'TC11', info.workerIndex);
    // O thread acumula cards; fixa o wrapper do card que acabamos de disparar
    // para asserir o efeito do reject SOBRE ELE (e não sobre cards históricos).
    const wrapperId = await studio.latestValidationMessage.getAttribute('data-test-id');
    const wrapper = page.locator(`[data-test-id="${wrapperId}"]`);
    await expect(wrapper.getByTestId('studio-copilot-validation-reject')).toBeVisible();
    // Rejeitar é a ação "limpa" — cancela a etapa disparada; as ações do card
    // somem (o card deixa de aguardar aprovação).
    await wrapper.getByTestId('studio-copilot-validation-reject').click();
    await expect(wrapper.getByTestId('studio-copilot-validation-reject')).toBeHidden({ timeout: 15_000 });
  });
});
