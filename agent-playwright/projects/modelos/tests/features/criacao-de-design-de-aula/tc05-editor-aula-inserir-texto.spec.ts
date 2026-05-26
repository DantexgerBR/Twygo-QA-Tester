import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-22): bloqueio idêntico ao TC3+TC4 da mesma suíte (auditado
// na sessão 2026-05-20 via chrome-devtools-mcp duas vezes):
//   - Aba Design da Aula renderiza VAZIA pós-save Identificação.
//   - 0 tabpanels, 0 contenteditable, 0 [data-slate-editor], 0 iframes válidos.
//   - Editor de Aula (RN 41-43) não está implementado neste env OR atrás de
//     feature flag adicional.
// Sem editor renderizado, não há como testar "inserir texto via teclado".
// Destinatário: PO/QA Lead — destravar TC3 destrava TC5.
test.describe.fixme('Criação de Design de Aula', () => {
  test('Editor Aula — inserir texto via teclado', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Design de Aula');
    await allure.story('Editor Aula — inserir texto via teclado');
    await allure.severity('high');

    await expect(page).toHaveURL(/.*/);
  });
});
