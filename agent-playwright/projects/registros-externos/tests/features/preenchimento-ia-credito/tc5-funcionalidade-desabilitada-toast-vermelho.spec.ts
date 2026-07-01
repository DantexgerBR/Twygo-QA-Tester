import { PRIMARY_STORAGE_PATH as STORAGE_STATE } from '../../../../../tests/setup/global-setup.js';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { AiAutofillPage } from '../../../pages/AiAutofillPage.js';
import { AiSettingsPage } from '../../../pages/AiSettingsPage.js';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';

const SUITE = data.suiteName;

/**
 * Desliga o "Acesso de IA" da org (estado persistente compartilhado) e valida
 * a resposta com IA desabilitada. SEMPRE reverte o switch pra ON no afterAll
 * via contexto fresco (anti-pattern G + skill limpar-dados-de-teste-twygo).
 */
test.describe(SUITE, () => {
  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const settings = new AiSettingsPage(page, getOrgId());
      await settings.goto();
      await settings.setAccess(true); // idempotente — religa a IA da org
    } finally {
      await ctx.close();
    }
  });

  test('Validar estado funcionalidade desabilitada (card de IA não é renderizado)', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar estado funcionalidade desabilitada (card de IA não é renderizado)');
    await allure.severity('critical');

    const settings = new AiSettingsPage(page, getOrgId());
    const ai = new AiAutofillPage(page, getOrgId());

    await allure.step('Pré: desligar "Acesso de IA" da organização', async () => {
      await settings.goto();
      await settings.setAccess(false);
    });

    await allure.step('1. Form "Adicionar registro" como Admin com IA OFF → card de IA AUSENTE', async () => {
      // Comportamento REAL (recon 2026-06-29): com IA desligada o card
      // "Facilite seu trabalho com nossa IA" é GATED OFF — não renderiza (o form
      // carrega normalmente, só sem o card). A AT modelava "card visível + botão
      // desabilitado + toast"; a realidade é a ausência total do card. Esta é a
      // asserção determinística do estado desabilitado.
      await ai.goto();
      await expect(ai.cardTitle()).toHaveCount(0);
      await expect(ai.autofillButton()).toHaveCount(0);
    });
  });

  // fixme: a AT modela o estado "IA desabilitada" como (a) botão clicável que
  // dispara toast vermelho e (b) back respondendo 403. NENHUM dos dois se
  // confirma neste build (recon 2026-06-29): o botão fica desabilitado (logo o
  // click do usuário não dispara toast) e o `ai_fill` responde 204 assíncrono,
  // não 403 síncrono. Reconciliar AT × produto antes de automatizar o gating.
  // Destinatário: QA Lead/produto + dev (contrato do ai_fill). Matriz F §7.6.
  test.fixme('Validar toast vermelho / 403 de funcionalidade desabilitada (modelo não exposto)', async () => {
    // model mismatch: botão desabilitado não dispara toast; ai_fill é 204 assíncrono, não 403.
  });
});
