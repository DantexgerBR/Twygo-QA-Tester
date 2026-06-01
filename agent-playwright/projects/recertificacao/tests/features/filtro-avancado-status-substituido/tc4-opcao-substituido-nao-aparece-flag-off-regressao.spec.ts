import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { fixedSeed } from '../../../data/fixed-seed.data.js';
import { ensureFlipperActor } from '../../../../../src/utils/flipperFlag.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import path from 'node:path';

const STORAGE_PATH = path.resolve('outputs/.auth/storage.json');

test.describe('Filtro Avançado Status Substituído', () => {
  // ATENÇÃO — ESTADO COMPARTILHADO (CLAUDE.md §7.6 G):
  // O beforeAll desliga e o afterAll re-liga a flag `:recertificacao` na
  // org 37048. Durante a janela do test (≈10-30s), outras specs/suites
  // que assumem a flag ON podem falhar se executarem em paralelo.
  //
  // Como rodar com segurança:
  //   - Localmente: --workers=1 + isolando esta suite (--grep)
  //   - NUNCA em regressivo paralelo enquanto não houver env dedicado
  //     `staging-recertificacao-disabled` ou tag exclusiva no CI.
  //
  // O revert é idempotente (helper `ensureFlipperActor` retorna no-op se
  // o estado já era o desejado).

  let revertFlag: () => Promise<void> = async () => {};

  test.beforeAll(async ({ browser }) => {
    revertFlag = await ensureFlipperActor(browser, {
      envName: 'staging-recertificacao',
      storageStatePath: STORAGE_PATH,
      flag: 'recertificacao',
      actor: `Organization;${getOrgId()}`,
      enabled: false,
    });
  });

  test.afterAll(async () => {
    await revertFlag();
  });

  test('TC4 — Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Filtro Avançado Status Substituído');
    await allure.story(
      'Opção "Substituído" NÃO aparece no filtro com flag OFF (regressão)',
    );
    await allure.severity('normal');
    await allure.tag('REGRESSION_FLAG_OFF');
    await allure.tag('FEATURE_FLAG_TOGGLE');
    await allure.parameter(
      'feature_flag',
      `:recertificacao=OFF (Organization;${getOrgId()} removido via Flipper no beforeAll)`,
    );

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Desativar a feature flag `:recertificacao` → Flag OFF',
      async () => {
        // Feito no beforeAll via ensureFlipperActor(enabled: false).
      },
    );

    await allure.step(
      '2. Acessar a lista de aprendizagem e abrir o filtro avançado de Status do certificado → Drawer de filtro é exibido',
      async () => {
        await learningStudents.goToList(fixedSeed.emptyCursoId);
        await expect(page).toHaveURL(/\/e\/\d+\/learning/);
        await learningStudents.openFilterDrawer();
        await expect(page.getByRole('dialog').first()).toBeVisible();
        await learningStudents.openAdvancedFilterCriteria('Certificado');
      },
    );

    await allure.step(
      '3. Inspecionar as opções → Lista contém apenas: Emitido, Pendente, Expirado, Aguardando assinatura. Opção "Substituído" NÃO está presente',
      async () => {
        // Asserção principal de regressão (RN 23): "Substituído" ausente com
        // flag OFF — opções legadas permanecem visíveis.
        await learningStudents.expectFilterOptionVisible('Substituído', false);

        for (const baseline of [
          'Emitido',
          'Pendente',
          'Expirado',
          'Aguardando assinatura',
        ]) {
          await learningStudents.expectFilterOptionVisible(baseline, true);
        }
      },
    );
  });
});
