import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Reinscrição pelo Aluno (Play e Link Público)', () => {
  // Decisão locked do QA (Suite 06): a flag `:recertificacao` está assumida
  // ON em `staging-base-de-conhecimento` (orgId 37007). Validar o cenário
  // regressivo OFF exige toggle runtime via Flipper Admin — fora do escopo
  // automatizado desta suite (ver skill `testar-feature-flag-twygo` para
  // o plano de habilitar quando tivermos seed/env dedicado).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente.
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente.',
  );

  test('TC4 — Flag OFF na org: banner do Play NÃO exibe "Reinscreva-se" (regressão)', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição pelo Aluno (Play e Link Público)');
    await allure.story(
      'Flag OFF na org: banner do Play NÃO exibe "Reinscreva-se" (regressão)',
    );
    await allure.severity('high');
    await allure.tag('REGRESSION_FLAG_OFF');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter('feature_flag', ':recertificacao=OFF (não automatizado nesta suite)');

    await allure.step(
      '1. Desativar a feature flag `:recertificacao` para a organização → flag OFF',
      async () => {
        // REVISAR: toggle runtime via Flipper Admin não automatizado
        // nesta suite. Quando habilitarmos, usar `FlipperAdminPage`
        // (skill `testar-feature-flag-twygo`).
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '2. Login com "Aluno Play Reinscrição w{workerIndex}" e acessar a página do curso → página é exibida',
      async () => {
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Inspecionar o banner → apenas botão original; "Reinscreva-se" NÃO aparece',
      async () => {
        // Validação manual: banner do Play deve renderizar APENAS o botão
        // original (Acessar/Inscrever-se/Continuar). Botão "Reinscreva-se"
        // ausente do DOM, sem render como disabled.
        expect(true).toBe(true);
      },
    );
  });
});
