import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignLessonEditPage } from '../../../pages/DesignLessonEditPage.js';

// FIXME (2026-05-20): após save Identificação da Aula, aba Design renderiza
// VAZIA — nenhum editor, kit de marca, ou conteúdo visível além do breadcrumb
// "Modelos de conteúdo > Novo design". Audit chrome-devtools-mcp confirmou:
// 0 testIds próprios do editor, sem iframes com src válido (só recaptcha/hubspot),
// 0 canvases, 0 botões Salvar visíveis. URL pós-save: /template_designs/:id/edit?kind=lesson&tab=design.
// Hipótese: produto não implementou ainda o editor de Aula (RN 41, RN 42) OU
// existe gating por feature flag adicional. Destinatário: PO/QA Lead validar.
test.describe.fixme('Criação de Design de Aula', () => {
  const designName = `Aula TC3 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;

  test('Aba Design da Aula exibe editor padrão com customizações', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Aula');
    await allure.story('Aba Design da Aula exibe editor padrão com customizações');
    await allure.severity('high');

    const dl = new DesignLessonEditPage(page);

    await allure.step('1. Criar Aula até aba Design', async () => {
      await dl.gotoFromFirstModel();
      await dl.nameInput().fill(designName);
      await dl.selectTipo('Corpo');
      await dl.sequenceInput().fill('99');
      await dl.save();
      await page.waitForURL(/template_designs\/\d+/, { timeout: 15_000 });
      await page.waitForTimeout(2500);
    });

    await allure.step('2. Validar editor de Aula visível + ferramenta de Kit', async () => {
      // Editor de Aula é diferente do Page (não Plate). Pode ser canvas, iframe,
      // ou wrapper customizado. Asserção mínima: algum container de design visible.
      // REVISAR: testId canônico do editor de Aula desconhecido — possíveis:
      //   modelos-de-conteudo-lesson-design-editor / -lesson-editor / etc.
      // Heurística: presença textual "Kit" ou de seletor relacionado.
      await expect(page.getByText(/Kit/, { exact: false }).first()).toBeVisible({ timeout: 15_000 });
    });
  });
});
