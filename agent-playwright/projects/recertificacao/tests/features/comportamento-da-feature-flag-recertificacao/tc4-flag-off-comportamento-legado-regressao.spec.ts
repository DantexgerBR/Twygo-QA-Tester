import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';

test.describe('Comportamento da Feature Flag :recertificacao', () => {
  // Decisão locked do QA (Suite 12 inteira): este TC valida que com a flag
  // OFF, todos os fluxos legados (inscrição original, listagem, edição) seguem
  // funcionando — smoke regressivo geral. Exige toggle runtime da flag para OFF
  // no env, fora do escopo desta execução automatizada.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora").
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.',
  );

  test('TC4 — Flag OFF: comportamento legado completo de inscrição/listagem mantido (regressão geral)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Comportamento da Feature Flag :recertificacao');
    await allure.story(
      'Flag OFF: comportamento legado completo de inscrição/listagem mantido (regressão geral)',
    );
    await allure.severity('critical');
    await allure.tag('FEATURE_FLAG_TOGGLE');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=OFF (toggle não automatizado nesta suite)',
    );

    const contentEdit = new ContentEditPage(page);

    await allure.step(
      '1. Garantir que a flag `:recertificacao` está OFF para a organização → Flag desativada',
      async () => {
        // REVISAR: pré-condição runtime — `ensureFlipperActor(enabled: false)`
        // com revert no afterAll. Bloqueado por falta de user com flag elevada
        // no env atual.
      },
    );

    await allure.step(
      '2. Criar curso novo, vincular aluno via inscrição original (sem `recertification`) → Aluno aparece com `recertification_number = 0` na lista de aprendizagem',
      async () => {
        // REVISAR-SEED: fluxo de criação de curso + inscrição original não
        // automatizado nesta suite (caminho coberto pelas suites de inscrição
        // original do produto base). Plano: usar `POST /api/v1/contents` e
        // `POST /api/v1/contents/:id/event_participants` SEM `recertification: true`,
        // depois validar `recertification_number = 0` na listagem.
      },
    );

    await allure.step(
      '3. Editar o curso e salvar sem alterações → Curso salvo. `events.has_recertification` permanece `false` (default)',
      async () => {
        await safeGoto(page, `/o/${getOrgId()}/events`);
        const editarLink = page.getByRole('link', { name: /Editar/i }).first();
        await expect(editarLink).toBeVisible();
        await editarLink.click();
        await expect(page).toHaveURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);

        // Switch não deve aparecer (regressão UI com flag OFF).
        const switchCb = contentEdit.getHabilitarReinscricaoSwitch();
        await expect(switchCb).toBeHidden();

        await contentEdit.save();
        await contentEdit.expectSaveSuccess();
        // REVISAR: assert `events.has_recertification = false` no banco é
        // verificação DB pura (CONTRACT.md §validador secundário).
      },
    );

    await allure.step(
      '4. Acessar "/learning_students?event_id={eventId}" → Aluno listado normalmente. Sem badge "Substituído", sem filtro adicional, sem item "Reinscrever"',
      async () => {
        // REVISAR-SEED: eventId real do curso criado no passo 2 precisa vir
        // do estado seed do env. Plano de assert quando habilitarmos:
        //   - page.getByText(/Substituído/i) toHaveCount(0)
        //   - filtro de coluna "Substituído" ausente
        //   - menu de ação por aluno sem item "Reinscrever"
        await safeGoto(page, `/o/${getOrgId()}/learning_students`);
        await expect(page).toHaveURL(/learning_students/);
      },
    );
  });
});
