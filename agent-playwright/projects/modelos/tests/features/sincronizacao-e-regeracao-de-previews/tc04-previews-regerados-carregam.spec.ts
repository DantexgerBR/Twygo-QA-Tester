import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';

// FIXME (2026-05-22): bloqueio idêntico ao TC1/TC2/TC3 da mesma suíte —
// fluxo encadeado de alterar Kit + Regerar todos. Audit anterior (sessão
// 2026-05-20) confirmou:
//   - Toast "regeração dos designs foi iniciada" não aparece em 4s.
//   - Notificação assíncrona "Regerações concluídas" não auditada (depende
//     do toggle real funcionar).
//   - Sem TC1 estável, TC4 fica bloqueado pra validar broken-img pós-regeração.
// Destinatário: PO/QA Lead — destravar TC1 destrava TC4.
test.describe.fixme('Sincronização e Regeração de Previews', () => {
  test('Previews regerados carregam visualmente após processo assíncrono', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Sincronização e Regeração de Previews');
    await allure.story('Previews regerados carregam visualmente após processo assíncrono');
    await allure.severity('high');

    // Implementação real ficará pendente até TC1/TC2/TC3 destravarem:
    //   1. Trocar Kit + Salvar
    //   2. Aba Design → click Regerar todos → toast iniciado
    //   3. Aguardar notificação "Regerações concluídas" (longo timeout)
    //   4. Abrir Preview do modelo
    //   5. Para cada thumb do carrossel, validar expectImageLoaded
    await expect(page).toHaveURL(/.*/);
  });
});
