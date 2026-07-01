import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { AiAutofillPage } from '../../../pages/AiAutofillPage.js';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';

const SUITE = data.suiteName;

/**
 * ⚠️ ESTE TESTE CONSOME 1 CRÉDITO REAL DE IA. Aciona o `POST /records/ai_fill`
 * de verdade (sem mock), EXATAMENTE 1×, sem retry — `retries: 0` abaixo.
 *
 * Escopo deliberadamente limitado ao CONTRATO determinístico (recon 2026-06-29):
 * upload habilita o botão → click dispara `POST /records/ai_fill` → back aceita
 * com 2xx (observado 204 — assíncrono). O PREENCHIMENTO VISUAL dos campos +
 * toast verde NÃO é asserido aqui: a IA na stage processa de forma assíncrona e
 * lenta (>70s ainda em loading no recon), tornando o resultado não-determinístico
 * em tempo de teste. Asserir isso geraria flakiness (viola "confiança por minuto"
 * do CLAUDE.md §2.1). O outcome visual fica no fixme abaixo (addressee dev/infra).
 */
test.describe(SUITE, () => {
  test.describe.configure({ retries: 0 });

  test('Validar estado habilitada + com crédito (form aceita o preenchimento por IA)', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar estado habilitada + com crédito (form aceita o preenchimento por IA)');
    await allure.severity('critical');

    const ai = new AiAutofillPage(page, getOrgId());

    await allure.step('1. Acessar form "Adicionar registro" como Admin → botão exibido desabilitado', async () => {
      await ai.goto();
      await expect(ai.cardTitle()).toBeVisible();
      await expect(ai.autofillButton()).toBeDisabled();
    });

    await allure.step('2. Upload de "certificado_ia.pdf" → botão "Preencher com IA" habilita', async () => {
      await ai.uploadEvidence(data.evidencePdfPath);
      await expect(ai.autofillButton()).toBeEnabled();
    });

    await allure.step('3. Clicar "Preencher com IA" → back aceita o request (POST ai_fill 2xx)', async () => {
      const fill = page.waitForResponse(
        (r) => r.url().includes('/records/ai_fill') && r.request().method() === 'POST',
        { timeout: 60_000 },
      );
      await ai.clickAutofill();
      const res = await fill;
      expect(res.status(), 'ai_fill deve ser aceito (2xx)').toBeLessThan(300);
    });
  });

  // fixme: outcome VISUAL do sucesso (Tipo+Categorias preenchidos + toast verde
  // "Campos preenchidos pela IA"). Bloqueado por latência não-determinística da
  // IA na stage: ai_fill responde 204 e processa assíncrono; recon observou >70s
  // ainda em loading, sem preenchimento. Destinatário: dev/infra (latência/
  // confiabilidade da IA em stage). Matriz F do CLAUDE.md §7.6.
  test.fixme('Validar preenchimento visual de Tipo/Categorias + toast verde (IA stage lenta)', async () => {
    // bloqueado por latência: IA stage não retorna preenchimento em tempo de teste.
  });
});
