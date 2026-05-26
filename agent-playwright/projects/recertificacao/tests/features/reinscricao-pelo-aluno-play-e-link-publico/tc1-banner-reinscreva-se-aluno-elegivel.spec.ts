import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { PlayPage } from '../../../pages/PlayPage.js';
import { tc1Data } from './tc1-banner-reinscreva-se-aluno-elegivel.data.js';

test.describe('Reinscrição pelo Aluno (Play e Link Público)', () => {
  // Reverte para perfil Administrador no teardown — skill `trocar-perfil-twygo`.
  // Sem isso, próximos TCs admin (cleanup, super admin) quebram herdando
  // perfil Aluno.
  test.afterEach(async ({ page }) => {
    const switcher = new ProfileSwitcher(page);
    await switcher.revertToAdminSafe();
  });

  test('TC1 — Botão "Reinscreva-se" aparece no banner do Play para aluno elegível', async ({
    page,
  }) => {
    // SEED_INVALIDO: tc1Data.eventIdCursoElegivel=1 é placeholder. Network
    // mostrou GET /play/event/1 → 404 (curso não existe na org 37007).
    // Pré-condição exige curso com has_recertification=true + participant
    // do user admin com progresso 100% ou certificado expirado. Destrava
    // após recon live identificar eventId real em staging-base-de-conhecimento
    // e atualizar tc1Data.eventIdCursoElegivel.
    test.fixme(
      true,
      'seed inválido — eventIdCursoElegivel=1 retorna 404. NEEDS_SEED (curso com has_recertification=true + participant elegível).',
    );
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição pelo Aluno (Play e Link Público)');
    await allure.story(
      'Botão "Reinscreva-se" aparece no banner do Play para aluno elegível',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const switcher = new ProfileSwitcher(page);
    const playPage = new PlayPage(page);

    await allure.step(
      '1. Login com o aluno "Aluno Play Reinscrição w{workerIndex}" → autenticado e redirecionado ao Play',
      async () => {
        // storageState do globalSetup já está logado como admin.
        // Switch para perfil Aluno via UI (skill `trocar-perfil-twygo`).
        await switcher.switchToViaUrl('Aluno');
        await expect(page).toHaveURL(/\/dashboard_students/);
      },
    );

    await allure.step(
      '2. Acessar a página do curso elegível no Play em "/play/event/{eventId}" → banner contém botão original',
      async () => {
        await playPage.goToPlay(tc1Data.eventIdCursoElegivel);
        await expect(page).toHaveURL(/\/play\/event\/\d+/);
        // Botão original do banner deve estar presente.
        await expect(playPage.getBannerOriginalButton()).toBeVisible({
          timeout: 15_000,
        });
      },
    );

    await allure.step(
      '3. Inspecionar o banner → DOIS botões empilhados: original em cima + "Reinscreva-se" abaixo',
      async () => {
        // Asserção principal (RN 16, 16.1): botão "Reinscreva-se" visível
        // para aluno elegível com flag ON.
        await playPage.expectReinscrevaSeVisible(true);

        // Reafirma coexistência com o botão original (banner com dois
        // botões empilhados — RN 16.1).
        await expect(playPage.getBannerOriginalButton()).toBeVisible();
      },
    );
  });
});
