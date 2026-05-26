import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';

test.describe('Comportamento da Feature Flag :recertificacao', () => {
  // Decisão locked do QA (Suite 12 inteira): toggle runtime da flag
  // `:recertificacao` via Flipper Admin (`/admin/manage/features/recertificacao`)
  // está fora do escopo desta execução automatizada. A flag é assumida ON em
  // `staging-base-de-conhecimento`. Cobertura manual cobre o cenário descrito.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // ver skill `testar-feature-flag-twygo` para o plano de automação futura
  // (POM `FlipperAdminPage` + helper `ensureFlipperActor`).
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.',
  );

  test('TC1 — Habilitar flag exibe switch "Habilitar reinscrição" em conteúdos', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Comportamento da Feature Flag :recertificacao');
    await allure.story(
      'Habilitar flag exibe switch "Habilitar reinscrição" em conteúdos',
    );
    await allure.severity('critical');
    await allure.tag('FEATURE_FLAG_TOGGLE');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (toggle não automatizado nesta suite)',
    );

    const contentEdit = new ContentEditPage(page);

    await allure.step(
      '1. Acessar Flipper Admin em "/admin/manage/features/recertificacao" → Página da feature `recertificacao` é exibida',
      async () => {
        // REVISAR: passo de Flipper Admin não automatizado nesta suite.
        // Plano: usar `FlipperAdminPage.gotoFeature("recertificacao")` em contexto
        // dedicado (skill `testar-feature-flag-twygo`).
      },
    );

    await allure.step(
      '2. Adicionar a organização atual ao actor da flag via "Add" → tipo "Organization" → "Organization;{orgId}" → Actor aparece com flag ON',
      async () => {
        // REVISAR: `ensureFlipperActor(browser, { flag: "recertificacao", actor: "Organization;${getOrgId()}", enabled: true })`
        // é o caminho canônico — bloqueado por falta de user com flag elevada
        // no env atual (ver skill `testar-feature-flag-twygo`, seção "Pré-condição").
      },
    );

    await allure.step(
      '3. Acessar a edição de um curso em "/e/{eventId}/edit" → Switch "Habilitar reinscrição" está visível no formulário (validado em detalhe na Suite 01)',
      async () => {
        await safeGoto(page, `/o/${getOrgId()}/events`);
        const editarLink = page.getByRole('link', { name: /Editar/i }).first();
        await expect(editarLink).toBeVisible();
        await editarLink.click();
        await expect(page).toHaveURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);

        const switchCb = contentEdit.getHabilitarReinscricaoSwitch();
        await expect(switchCb).toBeVisible();
      },
    );
  });
});
