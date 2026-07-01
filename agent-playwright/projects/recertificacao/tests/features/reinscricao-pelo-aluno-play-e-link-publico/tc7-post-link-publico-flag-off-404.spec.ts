import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição pelo Aluno (Play e Link Público)', () => {
  // Decisão locked do QA (Suite 06): a flag `:recertificacao` está assumida
  // ON em `staging-base-de-conhecimento` (orgId 37007). Validar HTTP 404
  // do link público com flag OFF exige toggle runtime via Flipper Admin —
  // fora do escopo automatizado desta suite (ver skill
  // `testar-feature-flag-twygo` para o plano).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário; validar manualmente HTTP 404 via cURL/Postman.
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao OFF. Validar manualmente HTTP 404.',
  );

  test('TC7 — POST em link público com flag OFF retorna HTTP 404 com payload vazio (regressão)', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição pelo Aluno (Play e Link Público)');
    await allure.story(
      'POST em link público com flag OFF retorna HTTP 404 com payload vazio (regressão)',
    );
    await allure.severity('high');
    await allure.tag('REGRESSION_FLAG_OFF');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=OFF (não automatizado nesta suite)',
    );

    await allure.step(
      '1. Desativar a feature flag `:recertificacao` para a organização do pacote → flag OFF',
      async () => {
        // REVISAR: toggle runtime via Flipper Admin não automatizado.
        // Plano: skill `testar-feature-flag-twygo` cobre `FlipperAdminPage`.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Disparar `POST /play/{packageSlug}/course_registrations?recertification=true` → HTTP 404 com body `{}`',
      async () => {
        // Validação manual (cURL/Postman):
        //   curl -X POST 'https://<host>/play/<slug>/course_registrations?recertification=true' \
        //     -H 'Content-Type: application/json' \
        //     -d '{"email":"...","name":"...","cpf":"..."}'
        // Esperado: HTTP 404 com body `{}`.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Consultar `event_participants` via Rails console → contagem permanece a anterior',
      async () => {
        // Validação manual via DB:
        //   EventParticipant.where(user_id: X, event_id: Y).count
        // Esperado: count_before == count_after (nenhum participant criado).
        expect(true).toBe(true);
      },
    );
  });
});
