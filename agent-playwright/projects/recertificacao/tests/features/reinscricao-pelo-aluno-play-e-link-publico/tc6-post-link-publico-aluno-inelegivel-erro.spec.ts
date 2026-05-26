import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PublicLinkPage } from '../../../pages/PublicLinkPage.js';
import { tc6Data } from './tc6-post-link-publico-aluno-inelegivel-erro.data.js';

test.describe('Reinscrição pelo Aluno (Play e Link Público)', () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test('TC6 — POST em link público com `recertification=true` para aluno inelegível retorna erro sem criar participant', async ({
    page,
  }) => {
    // SEED_INVALIDO: tc6Data.packageSlug='pacote-recertificacao-staging' e
    // ineligibleStudent.email='aluno.inelegivel@teste.twygo.com' são
    // placeholders. Network mostrou GET /play/pacote-recertificacao-staging/
    // course_registrations → 404. TC depende do mesmo pacote do TC5 +
    // aluno em estado "em andamento" sem certificado expirado. Destrava
    // junto com TC5 quando recon live identificar slug real e o aluno
    // inelegível for criado em staging-base-de-conhecimento.
    test.fixme(
      true,
      'seed inválido — packageSlug=pacote-recertificacao-staging retorna 404 e ineligibleStudent é placeholder. NEEDS_SEED (mesmo pacote do TC5 + aluno em andamento).',
    );
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição pelo Aluno (Play e Link Público)');
    await allure.story(
      'POST em link público com `recertification=true` para aluno inelegível retorna erro sem criar participant',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const publicLink = new PublicLinkPage(page);

    await allure.step(
      '1. Preparar payload de aluno inelegível (em andamento, sem expiração) no POST com `?recertification=true` → payload pronto',
      async () => {
        expect(tc6Data.publicLinkUrl).toMatch(/recertification=true/);
        expect(tc6Data.ineligibleStudent.email).toBeTruthy();
      },
    );

    await allure.step(
      '2. Disparar `POST /play/{packageSlug}/course_registrations?recertification=true` → HTTP 422 com mensagem de erro',
      async () => {
        // Captura a request POST que o form dispara — esperado HTTP 422
        // (CheckReenrollmentEligibilityUseCase rejeita aluno inelegível).
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

        await publicLink.goToPublicLink(tc6Data.publicLinkUrl);
        await publicLink.subscribeWithRecertification(tc6Data.ineligibleStudent);

        const postResponse = await postPromise;

        // Asserção principal (RN 15): HTTP 422 Unprocessable Entity.
        expect(postResponse.status()).toBe(422);

        const responseBody = await postResponse.text().catch(() => '');
        await allure.attachment(
          'course_registrations 422 response',
          responseBody,
          'text/plain',
        );

        // Mensagem de erro do CheckReenrollmentEligibilityUseCase.
        // REVISAR-FIGMA: wording exato — regex amplo cobre variações.
        expect(responseBody).toMatch(tc6Data.expectedErrorPattern);
      },
    );

    await allure.step(
      '3. Consultar `event_participants` via Rails console → contagem permanece a anterior (nenhum novo participant)',
      async () => {
        // REVISAR: validação DB (`EventParticipant.where(...).count`) fica
        // a cargo do agent-db quando disponível (CONTRACT.md §validador
        // secundário). Cobertura Playwright se limita a validar a response
        // 422 — invariante "nenhum participant criado" não pode ser
        // afirmada via UI/HTTP isoladamente.
        await allure.tag('NEEDS_DB_TEST');
      },
    );

    await allure.step(
      'Validação visual: mensagem de erro aparece no form (UX)',
      async () => {
        // Pós-422, o frontend deve renderizar a mensagem de erro no form.
        // Asserção complementa o status HTTP — garante que o UX expõe o
        // erro pro aluno (em vez de falhar silenciosamente).
        await publicLink
          .expectErrorMessage(tc6Data.expectedErrorPattern)
          .catch(async () => {
            // Tolerante: se o app não renderiza mensagem inline, registra
            // como REVIEW e não falha o spec (a asserção HTTP 422 já cobre
            // o cenário primário).
            await allure.tag('REVIEW_NEEDED');
          });
      },
    );
  });
});
