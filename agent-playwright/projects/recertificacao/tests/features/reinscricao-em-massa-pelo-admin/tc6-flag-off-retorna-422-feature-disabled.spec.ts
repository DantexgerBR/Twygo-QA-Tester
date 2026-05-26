import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição em Massa pelo Admin', () => {
  // Decisão locked do QA (Suite 03 TC6 — MD §536): regressão de flag
  // OFF. Hoje assumimos `:recertificacao=ON` em staging-base-de-conhecimento.
  // Toggle runtime da flag exige Flipper admin + revert idempotente
  // (skill `testar-feature-flag-twygo`) — ainda não automatizado para
  // este projeto. Além disso, é tipo `api` (MD §538): valida diretamente
  // o controller `Api::V1::LearningStudentsController#action_mass`, sem
  // UI no caminho.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "feature flag off num env
  // errado" + "API V2 sem token configurado"): destravar quando o
  // FlipperAdminPage + token de API estiverem disponíveis no projeto.
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422.',
  );

  test('TC6 — Disparo de reinscrição em massa com flag OFF retorna HTTP 422 `feature_disabled`', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição em Massa pelo Admin');
    await allure.story(
      'Disparo de reinscrição em massa com flag OFF retorna HTTP 422 feature_disabled',
    );
    await allure.severity('normal');
    await allure.tag('REGRESSION_FLAG_OFF');
    await allure.label('executionType', 'manual');

    await allure.step(
      '1. Desativar a feature flag `:recertificacao` para a organização → Flag fica desativada',
      async () => {
        // Validação manual via Flipper-UI:
        //   /admin/manage/features/recertificacao → Remove actor `Organization;<orgId>`
        // Skill `testar-feature-flag-twygo` documenta o padrão.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. POST /api/v1/learning_students/action_mass com action_type=mass_reenroll_participants → HTTP 422',
      async () => {
        // Validação manual (Postman/cURL):
        //   curl -X POST https://<host>/api/v1/learning_students/action_mass \
        //     -H "Authorization: Bearer <token>" \
        //     -H "Content-Type: application/json" \
        //     -d '{"action_type":"mass_reenroll_participants","participant_ids":[...]}'
        // Esperado: HTTP 422.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Inspecionar o corpo da resposta → chave `reenroll_participant.errors.feature_disabled`',
      async () => {
        // Validação manual: response body inclui chave I18n
        // `reenroll_participant.errors.feature_disabled`.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '4. Rails console: EventParticipant.where(id: participant_ids).count permanece igual',
      async () => {
        // Validação manual via Rails console.
        expect(true).toBe(true);
      },
    );
  });
});
