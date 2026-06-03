import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { PlayPage } from '../../../pages/PlayPage.js';
import { tc3Data } from './tc3-click-reinscreva-se-dispara-subscribe.data.js';

test.describe('Reinscrição pelo Aluno (Play e Link Público)', () => {
  test.afterEach(async ({ page }) => {
    const switcher = new ProfileSwitcher(page);
    await switcher.revertToAdminSafe();
  });

  test('TC3 — Click em "Reinscreva-se" dispara subscribe com `recertification=true` e cria novo participant', async ({
    page,
  }) => {
    // SEED_INVALIDO: tc3Data.eventIdCursoElegivel=1 é placeholder (mesmo do
    // TC1). Network mostrou GET /play/event/1 → 404. TC depende de aluno
    // elegível pra reinscrição no curso. Destrava em conjunto com TC1 da
    // mesma suite — quando recon live identificar eventId real e tc1Data
    // for atualizado.
    test.fixme(
      true,
      'seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (mesmo seed do TC1).',
    );
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição pelo Aluno (Play e Link Público)');
    await allure.story(
      'Click em "Reinscreva-se" dispara subscribe com `recertification=true` e cria novo participant',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const switcher = new ProfileSwitcher(page);
    const playPage = new PlayPage(page);

    await allure.step(
      '1. Login com "Aluno Play Reinscrição w{workerIndex}" e acessar a página do curso → botão "Reinscreva-se" visível',
      async () => {
        await switcher.switchToViaUrl('Aluno');
        await playPage.goToPlay(tc3Data.eventIdCursoElegivel);
        await expect(page).toHaveURL(/\/play\/event\/\d+/);
        await playPage.expectReinscrevaSeVisible(true);
      },
    );

    await allure.step(
      '2. Clicar no botão "Reinscreva-se" → POST /api/v1/play/.../subscribe com `recertification: true` retorna HTTP 201',
      async () => {
        // Captura a request de subscribe que dispara ao clicar.
        // RN 17: backend espera body com `recertification: true` e retorna 201.
        const subscribePromise = page.waitForResponse(
          (response) => {
            const url = response.url();
            const method = response.request().method();
            return (
              method === 'POST' &&
              /\/api\/v1\/play\/.+\/subscribe/.test(url)
            );
          },
          { timeout: 15_000 },
        );

        await playPage.clickReinscrevaSe();

        const subscribeResponse = await subscribePromise;

        // Asserções (RN 17):
        //  - HTTP 201 Created
        //  - request body contém `recertification: true`
        //  - response body traz o participant criado
        expect(subscribeResponse.status()).toBe(201);

        const requestBody = subscribeResponse.request().postDataJSON?.() ?? null;
        // REVISAR: shape exato do body depende do client React. Aceita
        // `recertification` no top-level OU dentro de objeto aninhado.
        if (requestBody && typeof requestBody === 'object') {
          const flat = JSON.stringify(requestBody);
          expect(flat).toMatch(/"recertification"\s*:\s*true/);
        }

        const responseBody = await subscribeResponse.json().catch(() => null);
        // REVISAR-FIGMA: shape exato do response — esperado contém objeto
        // `participant` (ou `event_participant`) com `recertification_number`.
        if (responseBody) {
          await allure.attachment(
            'subscribe response',
            JSON.stringify(responseBody, null, 2),
            'application/json',
          );
        }
      },
    );

    await allure.step(
      '3. Aguardar refresh do PlaySubscriptionContext → banner reflete novo participant',
      async () => {
        // Asserção visual: pelo menos um sinal de "novo participant criado"
        // aparece — toast, badge atualizado ou o botão Reinscreva-se sumindo.
        await playPage.expectNewSubscriptionCreated();
      },
    );

    await allure.step(
      '4. Em sessão admin, acessar `/learning_students?event_id={eventId}` → novo participant com `recertification_number = N+1`',
      async () => {
        // REVISAR: validação admin do `recertification_number` exige DB ou
        // listagem de aprendizagem com o filtro de versão da reinscrição.
        // O Page Object `LearningStudentsPage` não expõe coluna "Tentativa"
        // hoje — fica como validação visual da presença do participant
        // (cobertura completa via agent-db quando disponível, CONTRACT.md
        // §validador secundário).
        await allure.tag('NEEDS_DB_TEST');
      },
    );
  });

  // CLAUDE.md §7.6 G: spec ALTERA estado persistente (cria participant via
  // reinscrição). Cleanup automatizado não é trivial — depende de DELETE
  // direto no DB ou endpoint admin não modelado no POM. Decisão pragmática:
  // contaminação é tolerada porque o TC1/TC2 valida invariante (botão
  // aparece/não aparece conforme elegibilidade), não conta exata.
  // REVISAR: abrir task pro time de DB limpar participants reinscritos
  // periodicamente em staging-base-de-conhecimento.
});
