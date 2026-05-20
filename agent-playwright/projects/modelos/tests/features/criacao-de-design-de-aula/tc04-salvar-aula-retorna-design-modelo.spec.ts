import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { DesignLessonEditPage } from '../../../pages/DesignLessonEditPage.js';

// FIXME (2026-05-20): bloqueado pelo mesmo problema do TC3 — aba Design da Aula
// pós-save Identificação renderiza vazia, sem botão Salvar próprio. Destinatário:
// PO/QA Lead — confirmar se editor de Aula (RN 41-43) está implementado ou
// pendente. Ao destravar TC3, este TC4 deveria voltar a funcionar.
test.describe.fixme('Criação de Design de Aula', () => {
  const designName = `Aula TC4 w${process.env.TEST_WORKER_INDEX ?? '0'}-${Date.now()}`;

  test('Salvar Aula retorna para aba Design do Modelo', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Aula');
    await allure.story('Salvar Aula retorna para aba Design do Modelo');
    await allure.severity('critical');

    const dl = new DesignLessonEditPage(page);

    await allure.step('1. Criar Aula até aba Design', async () => {
      await dl.gotoFromFirstModel();
      await dl.nameInput().fill(designName);
      await dl.selectTipo('Corpo');
      await dl.sequenceInput().fill('100');
      await dl.save();
      await page.waitForURL(/template_designs\/\d+/, { timeout: 15_000 });
      await page.waitForTimeout(2500);
    });

    await allure.step('2. Clicar Salvar (Aula) e validar retorno pra aba Design do Modelo', async () => {
      const saveBtn = page.locator('button').filter({ hasText: /^Salvar$/ }).last();
      await saveBtn.evaluate((el: HTMLButtonElement) => el.click());
      await page.waitForURL(/\/content_models\/\d+\/edit/, { timeout: 20_000 });
    });

    await allure.step('3. Validar listagem atualizada com a nova Aula', async () => {
      await expect(page.locator('[data-test-id="tab-design"]')).toHaveAttribute(
        'aria-selected',
        'true',
        { timeout: 10_000 },
      );
      await expect(page.getByText(designName, { exact: true }).first()).toBeVisible({ timeout: 10_000 });
    });
  });
});
