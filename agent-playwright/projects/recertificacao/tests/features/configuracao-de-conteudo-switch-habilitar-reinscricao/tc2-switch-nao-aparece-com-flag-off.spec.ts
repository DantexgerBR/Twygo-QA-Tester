import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';

test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  // Decisão locked do QA (Suite 01): a flag `:recertificacao` está assumida
  // ON em `staging-base-de-conhecimento` (orgId 37007). Validar o cenário
  // OFF exige toggle runtime via Flipper Admin — fora do escopo desta suite
  // automatizada (ver skill `testar-feature-flag-twygo` para o plano).
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio temporário de cobertura automatizada; validar manualmente.
  test.fixme(
    true,
    'requer toggle runtime da flag :recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente OFF.',
  );

  test('TC2 — Switch "Habilitar reinscrição" NÃO aparece com flag OFF (regressão)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
    await allure.story(
      'Switch "Habilitar reinscrição" NÃO aparece com flag OFF (regressão)',
    );
    await allure.severity('critical');
    await allure.tag('REVIEW_NEEDED');
    await allure.parameter('feature_flag', ':recertificacao=OFF (não automatizado nesta suite)');

    const contentEdit = new ContentEditPage(page);

    await allure.step(
      '1. Desativar a feature flag `:recertificacao` para a organização via Flipper Admin',
      async () => {
        // REVISAR: passo de toggle runtime de flag não automatizado nesta suite.
        // Quando habilitarmos, usar `FlipperAdminPage.ensureFlipperActor` (skill).
      },
    );

    await allure.step(
      '2. Acessar a tela de edição de um curso existente em "/e/{eventId}/edit"',
      async () => {
        await safeGoto(page, `/o/${getOrgId()}/events`);
        const editarLink = page.getByRole('link', { name: /Editar/i }).first();
        await editarLink.click();
        await expect(page).toHaveURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
      },
    );

    await allure.step(
      '3. Inspecionar o formulário em busca do label "Habilitar reinscrição"',
      async () => {
        const switchCb = contentEdit.getHabilitarReinscricaoSwitch();
        await expect(switchCb).toBeHidden();
      },
    );

    await allure.step(
      '4. Salvar o curso sem alterações → has_recertification permanece false',
      async () => {
        await contentEdit.save();
        await contentEdit.expectSaveSuccess();
        // REVISAR: assertion `has_recertification=false` no banco é
        // verificação DB pura — fora do escopo Playwright (ver
        // CONTRACT.md §validador secundário).
      },
    );
  });
});
