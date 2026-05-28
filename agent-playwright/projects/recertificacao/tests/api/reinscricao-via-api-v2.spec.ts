import { test, expect, chromium, type Browser } from '@playwright/test';
import { resolve } from 'node:path';
import { EventsApiClient, type MassEnrollmentResponseBody } from '../../api/EventsApiClient.js';
import { fixedSeed } from '../../data/fixed-seed.data.js';
import { reinscricaoV2Data as data } from './reinscricao-via-api-v2.data.js';
import { getApiAuthHeaders } from '../../../../src/utils/api-auth.js';
import { ensureFlipperActor } from '../../../../src/utils/flipperFlag.js';
import { validateAgainstSchema } from '../../../../src/utils/schema.js';
import massEnrollmentSchema from '../../schemas/mass-enrollment-response.schema.json' with { type: 'json' };

/**
 * Suite "Reinscrição via API V2" — primeira suite 100% API do monorepo.
 *
 * Valida o pipeline de testes de API consolidado no agent-playwright
 * (CONTRACT.md §16, v1.2). TCs 1-4 são `Tipo: api` no MD canônico
 * (`test-analysis.md:712-801`). TCs 5-7 (UI complementares) ficam em
 * `tests/features/` — fora do escopo deste spec.
 *
 * Pré-condições do env staging-recertificacao (manuais hoje — TODO popular):
 * - `fixedSeed.cursoComRecertificacaoEventId` ≠ 0
 * - `fixedSeed.cursoSemRecertificacaoEventId` ≠ 0
 * - Alunos cadastrados nos emails listados em `fixedSeed.aluno*Email`
 * - Feature flag `:recertificacao` ON na org (37048) por default — TC4
 *   inverte temporariamente
 *
 * Skills relevantes:
 * - testar-api-twygo (skill principal)
 * - provisionar-token-api-twygo (auth headers)
 * - validar-schema-api-twygo (Ajv + schemas/)
 * - testar-feature-flag-twygo (TC4 toggle)
 * - limpar-dados-de-teste-twygo (afterAll cleanup — TODO)
 */

test.describe('Reinscrição via API V2', () => {
  let client: EventsApiClient;
  let authHeaders: Record<string, string>;

  test.beforeAll(async ({ request }) => {
    // Sentinel — falha cedo com mensagem clara se seed não foi populado
    if (fixedSeed.cursoComRecertificacaoEventId === 0 || fixedSeed.cursoSemRecertificacaoEventId === 0) {
      throw new Error(
        '[Reinscrição via API V2] Seed não populado em fixed-seed.data.ts. ' +
          'Ver TODOs nos campos cursoComRecertificacaoEventId e cursoSemRecertificacaoEventId. ' +
          'Skill: provisionar-seed.',
      );
    }
    client = new EventsApiClient(request);
    authHeaders = await getApiAuthHeaders();
  });

  test('TC1 — POST /api/v2/users/mass com recertification=true cria participants reinscritos', async () => {
    const response = await client.createMassEnrollment(data.payloadTC1, authHeaders);

    expect([200, 207]).toContain(response.status());

    const body = await response.json();
    validateAgainstSchema<MassEnrollmentResponseBody>(body, massEnrollmentSchema, 'POST /api/v2/users/mass (TC1)');

    expect(body.data.results).toHaveLength(1);
    const item = body.data.results[0];
    expect(item.email).toBe(fixedSeed.alunoReinscricaoEmail);
    expect(item.status).toBe('success');
    expect(item.participant_id).toBeGreaterThan(0);
    expect(item.error).toBeUndefined();
  });

  test('TC2 — Item recertification=true em curso has_recertification=false retorna erro por item (HTTP 207)', async () => {
    const response = await client.createMassEnrollment(data.payloadTC2_misto, authHeaders);

    expect(response.status()).toBe(207);

    const body = await response.json();
    validateAgainstSchema<MassEnrollmentResponseBody>(body, massEnrollmentSchema, 'POST /api/v2/users/mass (TC2 multi-status)');

    expect(body.data.results).toHaveLength(2);

    const itemA = body.data.results.find((r: { email: string }) => r.email === fixedSeed.alunoReinscricaoEmail);
    const itemB = body.data.results.find((r: { email: string }) => r.email === fixedSeed.alunoLegadoEmail);

    expect(itemA?.status).toBe('success');
    expect(itemB?.status).toBe('error');

    // I18n key esperada conforme AT (test-analysis.md:764):
    // `reenroll_participant.errors.recertification_disabled_for_event`
    const errorBlob = JSON.stringify(itemB?.error ?? {});
    expect(errorBlob).toContain(data.expectedRecertificationDisabledI18nKey);
  });

  test('TC3 — Payload sem recertification segue fluxo legado — regressão', async () => {
    const response = await client.createMassEnrollment(data.payloadTC3_legado, authHeaders);

    expect(response.status()).toBe(200);

    const body = await response.json();
    validateAgainstSchema<MassEnrollmentResponseBody>(body, massEnrollmentSchema, 'POST /api/v2/users/mass (TC3 legado)');

    expect(body.data.results).toHaveLength(1);
    const item = body.data.results[0];
    expect(item.email).toBe(fixedSeed.alunoLegadoEmail);
    expect(item.status).toBe('success');
    expect(item.error).toBeUndefined();
  });

  /**
   * TC4 — cenário "flag OFF" requer toggle Flipper antes do request. Setup
   * UI no `beforeAll` (chromium.launch manual) seguindo padrão da skill
   * `testar-api-twygo`. Revert idempotente via `ensureFlipperActor`.
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

    test('payload com recertification:true é processado como inscrição normal', async () => {
      const response = await client.createMassEnrollment(data.payloadTC4_flagOff, authHeaders);

      expect(response.status()).toBe(200);

      const body = await response.json();
      validateAgainstSchema<MassEnrollmentResponseBody>(body, massEnrollmentSchema, 'POST /api/v2/users/mass (TC4 flag OFF)');

      expect(body.data.results).toHaveLength(1);
      const item = body.data.results[0];
      expect(item.email).toBe(fixedSeed.alunoFlagOffEmail);
      expect(item.status).toBe('success');

      // Garantia: nenhum item com erro referenciando feature flag.
      const errorBlob = JSON.stringify(item.error ?? {});
      expect(errorBlob.toLowerCase()).not.toContain('feature_flag');
      expect(errorBlob.toLowerCase()).not.toContain('recertificacao_disabled');
    });
  });
});
