import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';

test.describe('Comportamento da Feature Flag :recertificacao', () => {
  // Decisão locked do QA (Suite 12 inteira): toggle runtime da flag
  // `:recertificacao` via Flipper Admin não está automatizado. A flag é
  // assumida ON em `staging-base-de-conhecimento` — testar a transição ON→OFF
  // (rollback) exige `ensureFlipperActor(enabled: false)` + revert no afterAll.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora").
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.',
  );

  test('TC2 — Desabilitar flag oculta switch e desativa fluxos (cenário de rollback)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Comportamento da Feature Flag :recertificacao');
    await allure.story(
      'Desabilitar flag oculta switch e desativa fluxos (cenário de rollback)',
    );
    await allure.severity('critical');
    await allure.tag('FEATURE_FLAG_TOGGLE');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON→OFF (toggle não automatizado nesta suite)',
    );

    const contentEdit = new ContentEditPage(page);

    await allure.step(
      '1. Pré-condição: organização com flag ON, curso com `has_recertification = true` e ao menos 1 aluno reinscrito (`recertification_number > 0`)',
      async () => {
        // REVISAR-SEED: estado composto (curso com has_recertification=true +
        // participant reinscrito) precisa ser preparado em
        // `staging-base-de-conhecimento` antes da execução manual. Validar via
        // SQL: `SELECT id FROM events WHERE has_recertification=true LIMIT 1;`
        // e `SELECT event_id FROM event_participant_infos WHERE recertification_number>0 LIMIT 1;`.
      },
    );

    await allure.step(
      '2. Acessar Flipper Admin e remover a organização do actor da flag (Remove actor "Organization;{orgId}") → Actor removido da lista',
      async () => {
        // REVISAR: caminho canônico seria `ensureFlipperActor(browser, { ..., enabled: false })`
        // com revert no afterAll. Bloqueado por falta de user com flag elevada
        // no env atual (ver skill `testar-feature-flag-twygo`).
      },
    );

    await allure.step(
      '3. Acessar a edição do mesmo curso em "/e/{eventId}/edit" → Switch "Habilitar reinscrição" NÃO está visível no formulário',
      async () => {
        await safeGoto(page, `/o/${getOrgId()}/events`);
        const editarLink = page.getByRole('link', { name: /Editar/i }).first();
        await editarLink.click();
        await expect(page).toHaveURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);

        const switchCb = contentEdit.getHabilitarReinscricaoSwitch();
        await expect(switchCb).toBeHidden();
      },
    );

    await allure.step(
      '4. Acessar "/learning_students?event_id={eventId}" → Lista SEM filtro "Substituído", SEM item "Reinscrever" no menu, SEM ação "Reinscrição em massa" no drawer',
      async () => {
        // REVISAR-SEED: eventId real do curso preparado no passo 1 precisa
        // vir do estado seed do env. Por ora, asserts ficam ancorados em
        // ausência de elementos quando a flag estiver OFF.
        // Plano: navegar `/learning_students?event_id={eventSeedId}` e validar:
        //   - getByText(/Substituído/i) toHaveCount(0)
        //   - getByRole('menuitem', { name: /Reinscrever/i }) toHaveCount(0)
        //   - getByRole('button', { name: /Reinscrição em massa/i }) toHaveCount(0)
      },
    );

    await allure.step(
      '5. Disparar POST /api/v1/contents/{eventId}/event_participants com `recertification: true` autenticado → HTTP 422 com `reenroll_participant.errors.feature_disabled`',
      async () => {
        // REVISAR: validação HTTP pura — fora do escopo Playwright canônico.
        // Caminho viável: `page.request.post(...)` reusando o storageState do TC.
        // Bloqueado pela mesma dependência (flag OFF runtime não automatizada).
      },
    );
  });
});
