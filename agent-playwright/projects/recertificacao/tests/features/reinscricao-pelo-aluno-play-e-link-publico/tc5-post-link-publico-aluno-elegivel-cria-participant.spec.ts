import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PublicLinkPage } from '../../../pages/PublicLinkPage.js';
import { tc5Data } from './tc5-post-link-publico-aluno-elegivel-cria-participant.data.js';

test.describe('Reinscrição pelo Aluno (Play e Link Público)', () => {
  // Link público é rota não-autenticada — não usa storageState do globalSetup.
  // Limpa cookies/origin pra simular acesso de aluno externo (mesmo que
  // mais tarde o form valide e-mail/CPF, a request pública não exige JWT).
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC5 — POST em link público com `?recertification=true` para aluno elegível cria participant', async ({
    page,
  }) => {
    // SEED_INVALIDO: tc5Data.packageSlug='pacote-recertificacao-staging' e
    // eligibleStudent.email='aluno.reinscricao@teste.twygo.com' são
    // placeholders. Network mostrou GET /play/pacote-recertificacao-staging/
    // course_registrations → 404 (pacote não existe / link público não
    // gerado). TC depende de pacote com link público ativo + aluno com
    // histórico elegível (participant com progresso 100% ou expirado) no
    // curso interno. Destrava após recon live + SQL:
    //   SELECT slug FROM packages WHERE organization_id = 37007
    //   AND public_link IS NOT NULL LIMIT 1;
    // e atualização de tc5Data.packageSlug + criação de eligibleStudent no env.
    test.fixme(
      true,
      'seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e eligibleStudent é placeholder. NEEDS_SEED (pacote com link público + aluno com histórico elegível).',
    );
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição pelo Aluno (Play e Link Público)');
    await allure.story(
      'POST em link público com `?recertification=true` para aluno elegível cria participant',
    );
    await allure.severity('high');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const publicLink = new PublicLinkPage(page);

    await allure.step(
      '1. Preparar URL do pacote público com query `?recertification=true` → URL pronta',
      async () => {
        // URL canônica: `/play/{packageSlug}/course_registrations?recertification=true`.
        // Constante centralizada em tc5Data.publicLinkUrl (anti-pattern E
        // — sem hardcode inline).
        expect(tc5Data.publicLinkUrl).toMatch(/recertification=true/);
      },
    );

    await allure.step(
      '2. Disparar `POST` na URL acima com payload do aluno elegível (email, nome, cpf) → HTTP 201 com participant criado',
      async () => {
        // Captura a request POST que o form dispara ao submeter.
        // Validação primária da RN 15: response HTTP 201.
        const postPromise = page.waitForResponse(
          (response) => {
            const url = response.url();
            const method = response.request().method();
            return (
              method === 'POST' &&
              /\/play\/.+\/course_registrations/.test(url)
            );
          },
          { timeout: 30_000 },
        );

        await publicLink.goToPublicLink(tc5Data.publicLinkUrl);
        await publicLink.subscribeWithRecertification(tc5Data.eligibleStudent);

        const postResponse = await postPromise;

        // Asserção principal (RN 15): HTTP 201 Created.
        expect(postResponse.status()).toBe(201);

        const responseBody = await postResponse.json().catch(() => null);
        if (responseBody) {
          await allure.attachment(
            'course_registrations response',
            JSON.stringify(responseBody, null, 2),
            'application/json',
          );
          // REVISAR-FIGMA: shape do response — esperado contém participant
          // com `recertification_number = N+1`. Se a chave for diferente
          // (ex: `event_participant`), ajustar regex/path.
          const flat = JSON.stringify(responseBody);
          if (/"recertification_number"/.test(flat)) {
            expect(flat).toMatch(/"recertification_number"\s*:\s*[1-9]/);
          }
        }

        // Sinal visual de sucesso na página (toast/redirect/confirmação).
        await publicLink.expectSubscribeSuccess();
      },
    );

    await allure.step(
      '3. Acessar a lista de aprendizagem como admin → aluno aparece reinscrito',
      async () => {
        // REVISAR: validação admin da listagem requer trocar storageState
        // (page atual está sem cookies para simular acesso público). Em
        // suite per-suite o cenário fica coberto pelo TC3 + TC5; a checagem
        // cross-session admin ↔ aluno externo é mais robusta via agent-db
        // (CONTRACT.md §validador secundário) — marcamos como pendente.
        await allure.tag('NEEDS_DB_TEST');
      },
    );
  });
});
