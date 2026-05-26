import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';

test.describe('Comportamento da Feature Flag :recertificacao', () => {
  // Decisão locked do QA (Suite 12 inteira): toggle runtime da flag
  // `:recertificacao` via Flipper Admin não está automatizado. O TC3 valida
  // idempotência ON→OFF→ON com preservação de dados — depende do TC2 ter
  // deixado o env com flag OFF + participant com `recertification_number > 0`.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora").
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao via /admin/manage/features/recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente o cenário OFF/ON descrito.',
  );

  test('TC3 — Re-habilitar flag restaura todos os fluxos (sem perda de dados)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Comportamento da Feature Flag :recertificacao');
    await allure.story(
      'Re-habilitar flag restaura todos os fluxos (sem perda de dados)',
    );
    await allure.severity('normal');
    await allure.tag('FEATURE_FLAG_TOGGLE');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=OFF→ON (toggle não automatizado nesta suite)',
    );

    await allure.step(
      '1. Pré-condição: organização com flag OFF após o TC2, mantendo 1 participant com `recertification_number > 0` no banco',
      async () => {
        // REVISAR-SEED: estado dependente da execução prévia do TC2. Validar
        // via SQL: `SELECT id, recertification_number FROM event_participant_infos
        // WHERE recertification_number > 0 LIMIT 1;` antes de rodar.
      },
    );

    await allure.step(
      '2. Acessar Flipper Admin e adicionar a organização novamente como actor da flag → Actor "Organization;{orgId}" volta a aparecer com ON',
      async () => {
        // REVISAR: caminho canônico seria `ensureFlipperActor(browser, { ..., enabled: true })`.
        // Cache propagation 2-30s pode exigir `expect.toPass` com reload
        // (ver skill `testar-feature-flag-twygo`, gotcha #2).
      },
    );

    await allure.step(
      '3. Acessar a lista de aprendizagem → Filtro "Substituído", item "Reinscrever" e ação "Reinscrição em massa" voltam a aparecer',
      async () => {
        // REVISAR-SEED: eventId real do seed deve ser usado. Por ora apenas
        // navega a base e valida estado pós-flag (estrutura pronta para
        // automação futura).
        await safeGoto(page, `/o/${getOrgId()}/learning_students`);
        await expect(page).toHaveURL(/learning_students/);

        // Asserts planejados (descomentar quando habilitarmos automação Flipper):
        //   await expect(page.getByText(/Substituído/i).first()).toBeVisible();
        //   await expect(page.getByRole('menuitem', { name: /Reinscrever/i })).toBeVisible();
        //   await expect(page.getByRole('button', { name: /Reinscrição em massa/i })).toBeVisible();
      },
    );

    await allure.step(
      '4. Inspecionar o participant reinscrito pré-existente → Aluno aparece com `recertification_number > 0` intacto (dado preservado durante OFF)',
      async () => {
        // REVISAR: assertion `recertification_number > 0` é verificação DB pura
        // (CONTRACT.md §validador secundário). Caminho UI alternativo:
        // capturar badge "Substituído" ou contador na linha do aluno. Ambos
        // bloqueados pela dependência runtime da flag.
      },
    );
  });
});
