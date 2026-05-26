import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { PlayPage } from '../../../pages/PlayPage.js';
import { tc2Data } from './tc2-banner-nao-aparece-aluno-inelegivel.data.js';

test.describe('Reinscrição pelo Aluno (Play e Link Público)', () => {
  test.afterEach(async ({ page }) => {
    const switcher = new ProfileSwitcher(page);
    await switcher.revertToAdminSafe();
  });

  test('TC2 — Botão "Reinscreva-se" NÃO aparece para aluno inelegível (sem disabled visível)', async ({
    page,
  }) => {
    // SEED_INVALIDO: tc2Data.eventIdCursoInelegivel=1 é placeholder. Network
    // mostrou GET /play/event/1 → 404. TC depende de curso com participant
    // em estado "em andamento" (progress_score<100, sem expiração) — não
    // basta criar curso, precisa do participant no estado certo. Destrava
    // após recon live identificar eventId real + validar estado do
    // participant em staging-base-de-conhecimento.
    test.fixme(
      true,
      'seed inválido — eventIdCursoInelegivel=1 retorna 404. NEEDS_SEED (curso + participant em andamento sem expiração).',
    );
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição pelo Aluno (Play e Link Público)');
    await allure.story(
      'Botão "Reinscreva-se" NÃO aparece para aluno inelegível (sem disabled visível)',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const switcher = new ProfileSwitcher(page);
    const playPage = new PlayPage(page);

    await allure.step(
      '1. Login com o aluno "Aluno Play Inelegível w{workerIndex}" → autenticado',
      async () => {
        // REVISAR-SEED: Twygo não tem credenciais separadas por persona —
        // o mesmo user admin acessa como aluno via switch (skill
        // `trocar-perfil-twygo`). O estado "inelegível" depende do estado
        // do participant no env (curso em andamento, sem expiração).
        // Pré-condição garantida pelo seed, não pelo login.
        await switcher.switchToViaUrl('Aluno');
        await expect(page).toHaveURL(/\/dashboard_students/);
      },
    );

    await allure.step(
      '2. Acessar a página do curso no Play em "/play/event/{eventId}" → página é exibida',
      async () => {
        await playPage.goToPlay(tc2Data.eventIdCursoInelegivel);
        await expect(page).toHaveURL(/\/play\/event\/\d+/);
      },
    );

    await allure.step(
      '3. Inspecionar o banner → apenas botão original; "Reinscreva-se" NÃO presente nem como disabled',
      async () => {
        // Botão original ainda deve estar visível.
        await expect(playPage.getBannerOriginalButton()).toBeVisible({
          timeout: 15_000,
        });

        // Asserção principal (RN 16.2): "Reinscreva-se" NÃO está no DOM
        // (toHaveCount(0) é mais estrito que toBeHidden — confirma ausência).
        await playPage.expectReinscrevaSeVisible(false);
      },
    );
  });
});
