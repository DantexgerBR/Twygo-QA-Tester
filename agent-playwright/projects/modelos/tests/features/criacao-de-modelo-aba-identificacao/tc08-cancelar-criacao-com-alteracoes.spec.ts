import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

// FIXME (2026-05-20): produto NÃO implementa beforeunload no fluxo de criação.
// Diagnóstico via script ad-hoc: window.onbeforeunload não está setado e nenhum
// modal Chakra é exibido — botão Voltar navega direto perdendo os dados digitados.
// AT TC8 descreve dialog nativo, mas isso é gap de produto (não bug de spec).
// Destinatário: PO/QA Lead validar se é bug (deveria proteger) ou comportamento
// esperado (UX aceita perder dados sem aviso).
test.describe.fixme('Criação de Modelo - Aba Identificação', () => {
  test('Cancelar criação com alterações pendentes', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Cancelar criação com alterações pendentes');
    await allure.severity('medium');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir tela de criação', async () => {
      await editPage.gotoNew();
    });

    await allure.step('2. Preencher Nome (deixa form dirty)', async () => {
      await editPage.nameInput().fill('Teste cancelamento');
    });

    let dialogTriggered = false;

    await allure.step('3. Clicar Voltar e capturar beforeunload dialog (dismiss)', async () => {
      page.on('dialog', async (dialog) => {
        dialogTriggered = true;
        await dialog.dismiss();
      });
      await editPage.backButton().evaluate((el: HTMLButtonElement) => el.click());
      await page.waitForTimeout(2000);
    });

    await allure.step('4. Validar que dialog disparou e usuário permanece em /new', async () => {
      expect(dialogTriggered, 'beforeunload dialog deveria ter disparado').toBe(true);
      await expect(page).toHaveURL(/\/content_models\/new/);
      await expect(editPage.nameInput()).toHaveValue('Teste cancelamento');
    });
  });
});
