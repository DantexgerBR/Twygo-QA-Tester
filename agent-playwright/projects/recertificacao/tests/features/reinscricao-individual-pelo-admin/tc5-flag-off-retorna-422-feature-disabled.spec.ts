import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Decisão locked do QA (Suite 02 TC5): este TC é regressivo da flag OFF
  // e exige toggle runtime da feature flag `:recertificacao` no env
  // `staging-base-de-conhecimento` — flag está assumida como ON na
  // execução desta suite. Validar manualmente a resposta HTTP 422 com
  // chave de erro `reenroll_participant.errors.feature_disabled`.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora").
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422 feature_disabled.',
  );

  test('TC5 — Reinscrição com flag OFF retorna HTTP 422 feature_disabled', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story('Reinscrição com flag OFF retorna HTTP 422 feature_disabled');
    await allure.severity('normal');
    await allure.tag('REGRESSION_FLAG_OFF');
    await allure.tag('FEATURE_FLAG_TOGGLE');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=OFF (toggle não automatizado nesta suite)',
    );

    // Plano de implementação quando o toggle runtime estiver automatizado:
    //
    // 1. `ensureFlipperActor(page, ':recertificacao', { enabled: false })`
    //    com revert no `afterAll`.
    // 2. Construir request via APIRequestContext do Playwright:
    //      const api = await request.newContext({ baseURL: getBaseUrl() });
    //      const resp = await api.post(
    //        `/api/v1/contents/${cursoId}/event_participants`,
    //        { data: { user_id: alunoId, recertification: true } },
    //      );
    // 3. Assert: resp.status() === 422.
    // 4. Assert: body inclui chave `reenroll_participant.errors.feature_disabled`.
    // 5. Validar contagem no banco — fora do escopo Playwright; encaminhar
    //    para `agent-db` quando a stack do validador secundário estiver pronta.
  });
});
