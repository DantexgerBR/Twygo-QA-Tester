import { test, expect, chromium, type Browser } from '@playwright/test';
import { resolve } from 'node:path';
import { EventsApiClient, type AttendeesCreateResponseBody } from '../../api/EventsApiClient.js';
import { fixedSeed } from '../../data/fixed-seed.data.js';
import { reinscricaoV2Data as data } from './reinscricao-via-api-v2.data.js';
import { getApiAuthHeaders } from '../../../../src/utils/api-auth.js';
import { ensureFlipperActor } from '../../../../src/utils/flipperFlag.js';
import { validateAgainstSchema } from '../../../../src/utils/schema.js';
import attendeesResponseSchema from '../../schemas/attendees-create-response.schema.json' with { type: 'json' };
import type { AttendeesCreatePayload } from '../../api/EventsApiClient.js';

/**
 * Gera email único por run para TCs idempotentes (TC1, TC3, TC4) — pattern
 * `rec-v2-tc<N>-w<workerIndex>-<timestamp>@example.com`. TC2 mantém estático
 * porque testa exatamente o cenário "user inscrito mas não aprovado" (precisa
 * de user persistente entre runs — criado em curl seed ou TC1 anterior).
 */
function withUniqueEmail(payload: AttendeesCreatePayload, workerIndex: number): AttendeesCreatePayload {
  const ts = Date.now();
  return {
    ...payload,
    participants: payload.participants.map(p => ({
      ...p,
      email: p.email.replace('@', `-w${workerIndex}-${ts}@`),
    })),
  };
}

/**
 * Suite "Reinscrição via API V2" — primeira suite 100% API do monorepo.
 *
 * **Histórico**:
 * - AT original previa endpoint `POST /api/v2/users/mass` com body
 *   `{participants: [{email, event_id, recertification}]}` — ERRADO.
 * - Validação live em 2026-05-28 contra recertificacao-testeqa.stage.twygoead.com
 *   confirmou: endpoint real é `POST /api/v2/attendees`, body `{participants,
 *   content_ids}`, campo `recertification` aceito silenciosamente (feature
 *   ainda não publicada pelos devs).
 * - Spec atualizado para endpoint correto.
 *
 * **Pré-condições do env staging-recertificacao** (manuais hoje — TODO popular
 * `fixed-seed.data.ts`):
 * - `fixedSeed.cursoComRecertificacaoEventId` ≠ 0 — curso elegível para
 *   reinscrição. Hoje qualquer curso da org serve (806755 / 806756 / 806757),
 *   porque `has_recertification` ainda não é setável até feature shipped.
 * - `fixedSeed.cursoSemRecertificacaoEventId` ≠ 0 — pode ser o mesmo do TC1
 *   temporariamente (até diferenciação faça sentido)
 * - Token V2 configurado em `.env` como `API_TOKEN` (modo `fixed_token`)
 * - Feature flag `:recertificacao` ON na org 37048 (default — para TC4
 *   inverter temporariamente)
 *
 * **Skills relevantes**:
 * - testar-api-twygo (skill principal)
 * - provisionar-token-api-twygo (auth headers)
 * - validar-schema-api-twygo (Ajv + schemas/)
 * - testar-feature-flag-twygo (TC4 toggle)
 * - limpar-dados-de-teste-twygo (afterAll cleanup — TODO)
 */

test.describe('Reinscrição via API V2', () => {
  // authHeaders pode ser cached no describe (é só Record<string,string>, sem
  // estado de Playwright fixture). client precisa ser criado por test —
  // `request` fixture de `beforeAll` tem escopo diferente de `test()`.
  let authHeaders: Record<string, string>;

  test.beforeAll(async () => {
    // Sentinel — falha cedo com mensagem clara se seed não foi populado
    if (fixedSeed.cursoComRecertificacaoEventId === 0 || fixedSeed.cursoSemRecertificacaoEventId === 0) {
      throw new Error(
        '[Reinscrição via API V2] Seed não populado em fixed-seed.data.ts. ' +
          'Ver TODOs nos campos cursoComRecertificacaoEventId e cursoSemRecertificacaoEventId. ' +
          'Para validar o pipeline contra o env real, usar IDs reais do staging-recertificacao ' +
          '(ex: 806755, 806756, 806757 — qualquer curso serve até feature recertification shippar). ' +
          'Skill: provisionar-seed.',
      );
    }
    authHeaders = await getApiAuthHeaders();
  });

  test('TC1 — POST /api/v2/attendees com recertification=true responde 200 e cria attendee', async ({ request }, testInfo) => {
    const client = new EventsApiClient(request);
    const payload = withUniqueEmail(data.payloadTC1, testInfo.workerIndex);
    const response = await client.createAttendees(payload, authHeaders);

    expect(response.status()).toBe(200);

    const body = await response.json();
    validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC1)');

    // Validação base: participant inscrito com sucesso no content_id alvo
    const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
    const successList = body.participants.success?.[contentIdKey] ?? [];
    expect(successList).toHaveLength(1);
    expect(successList[0].email).toBe(payload.participants[0].email);

    // TODO: quando backend publicar feature `recertification`, adicionar
    // asserção que confirme que o participant foi criado como REINSCRITO
    // (ex: GET /api/v2/attendees?user_id=... e verificar recertification_number).
  });

  test('TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva', async ({ request }) => {
    test.fixme(true, 'dep-externa: backend API V2 Beta aceita recertification:true silenciosamente — retorna 422 mas sem populate de participants.error[content_id] e sem a mensagem "Aluno já inscrito mas não aprovado — recertificação não criada". Aguarda backend publicar feature recertification por item. Destinatário: dev de backend.');
    const client = new EventsApiClient(request);
    const response = await client.createAttendees(data.payloadTC2_misto, authHeaders);

    // Regra de negócio (validada live 2026-05-28): backend retorna 422 quando
    // payload pede `recertification: true` para user que NÃO está aprovado na
    // inscrição anterior. Mensagem exata: "Aluno já inscrito mas não aprovado
    // — recertificação não criada".
    expect(response.status()).toBe(422);

    const body = await response.json();
    validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC2 mix)');

    // Espera array de erros por content_id com a mensagem específica
    const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
    const errorList = body.participants.error?.[contentIdKey] ?? [];
    expect(errorList.length).toBeGreaterThan(0);
    const allErrorMessages = errorList.flatMap(e => e.error ?? []).join(' ');
    expect(allErrorMessages.toLowerCase()).toContain('não aprovado');
    expect(allErrorMessages.toLowerCase()).toContain('recertificação não criada');
  });

  test('TC3 — Payload sem recertification segue fluxo legado (regressão)', async ({ request }, testInfo) => {
    const client = new EventsApiClient(request);
    const payload = withUniqueEmail(data.payloadTC3_legado, testInfo.workerIndex);
    const response = await client.createAttendees(payload, authHeaders);

    expect(response.status()).toBe(200);

    const body = await response.json();
    validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC3 legado)');

    const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
    const successList = body.participants.success?.[contentIdKey] ?? [];
    expect(successList).toHaveLength(1);
    expect(successList[0].email).toBe(payload.participants[0].email);
  });

  /**
   * TC4 — cenário "flag OFF". Setup UI no `beforeAll` (chromium.launch manual)
   * seguindo padrão da skill `testar-api-twygo`. Revert idempotente via
   * `ensureFlipperActor`.
   */
  test.describe('TC4 — Com flag OFF, parâmetro recertification é ignorado silenciosamente', () => {
    let browser: Browser;
    let revertFlipper: () => Promise<void>;

    test.beforeAll(async () => {
      browser = await chromium.launch();
      revertFlipper = await ensureFlipperActor(browser, {
        envName: 'staging-recertificacao',
        storageStatePath: resolve(process.cwd(), 'outputs/.auth/storage.json'),
        flag: 'recertificacao',
        actor: `Organization;${fixedSeed.principalOrgId}`,
        enabled: false,
      });
    });

    test.afterAll(async () => {
      await revertFlipper();
      await browser.close();
    });

    test('payload com recertification:true é processado como inscrição normal', async ({ request }, testInfo) => {
      const client = new EventsApiClient(request);
      const payload = withUniqueEmail(data.payloadTC4_flagOff, testInfo.workerIndex);
      const response = await client.createAttendees(payload, authHeaders);

      expect(response.status()).toBe(200);

      const body = await response.json();
      validateAgainstSchema<AttendeesCreateResponseBody>(body, attendeesResponseSchema, 'POST /api/v2/attendees (TC4 flag OFF)');

      const contentIdKey = String(fixedSeed.cursoComRecertificacaoEventId);
      const successList = body.participants.success?.[contentIdKey] ?? [];
      expect(successList).toHaveLength(1);
      expect(successList[0].email).toBe(payload.participants[0].email);

      // Garantia: sem erro referenciando feature flag em `errors` (string ou array)
      const errorsBlob = typeof body.errors === 'string'
        ? body.errors
        : JSON.stringify(body.errors);
      expect(errorsBlob.toLowerCase()).not.toContain('feature_flag');
      expect(errorsBlob.toLowerCase()).not.toContain('recertificacao_disabled');
    });
  });
});
