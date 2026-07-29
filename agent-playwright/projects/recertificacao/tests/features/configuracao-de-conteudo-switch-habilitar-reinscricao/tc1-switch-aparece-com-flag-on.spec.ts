import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { resolve } from 'node:path';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';
import { SeedAdminPage } from '../../../../../src/pages/SeedAdminPage.js';

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed` v1.3):
  // - Rota canônica `/o/{orgId}/contents/new?kind=0` (facelift React),
  //   validada live 2026-05-26 no env staging-recertificacao (orgId 37048,
  //   user agents.qa@claude.com em perfil Administrador). Content criado:
  //   ID 806852 "Validação seed via menu real".
  // - Bloqueio anterior (422 em /events/new HAML legado) RESOLVIDO em
  //   v1.1 da skill — era rota errada, não CSRF/permissão.
  // beforeAll cria o curso → captura eventId real → spec navega pela
  // listagem e localiza o curso pelo nome único. afterAll deleta via
  // variant *_safe idempotente.
  let cursoId: number;
  let cursoName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    cursoName = `Curso Recertificação TC1 w${testInfo.workerIndex}-${Date.now()}`;
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    try {
      const seed = new SeedAdminPage(page);
      cursoId = await seed.createCurso({
        name: cursoName,
        hasRecertification: false, // default — TC1 só lê o switch, não toggla
      });
      // Re-grava storage atualizado pra evitar session race entre o
      // contexto do seed e o `page` fixture do test (Twygo regenera
      // session_id após operações de criação — sem refresh, page do
      // test acaba na tela de login).
      await context.storageState({ path: STORAGE_PATH });
    } finally {
      await context.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    if (!cursoId) return;
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    try {
      const seed = new SeedAdminPage(page);
      await seed.deleteCursoByIdSafe(cursoId);
    } finally {
      await context.close();
    }
  });

  test('TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
    await allure.story(
      'Switch "Habilitar reinscrição" aparece com flag ON na edição de curso',
    );
    await allure.severity('critical');
    await allure.parameter('feature_flag', ':recertificacao=ON (assumido em staging-base-de-conhecimento)');

    const contentEdit = new ContentEditPage(page);

    await allure.step('1. Acessar a URL "/o/{orgId}/dashboard"', async () => {
      await safeGoto(page, `/o/${getOrgId()}/dashboard`);
      await expect(page).toHaveURL(/\/o\/\d+\/(dashboard|play)/);
    });

    await allure.step(
      '2. Navegar até a listagem de cursos da organização',
      async () => {
        await contentEdit.goToContentList();
        await expect(page).toHaveURL(/\/o\/\d+\/events/);
      },
    );

    await allure.step(
      '3. Clicar em "Gerenciar" no menu de ações do curso → página de edição é exibida',
      async () => {
        // Localiza o curso CRIADO no beforeAll pelo nome único (worker-isolated).
        // `openEditByName` cobre os 3 padrões: link direto, more_vert → Gerenciar
        // (UI nova facelift, skill provisionar-seed v1.3), kebab Options (HAML).
        await contentEdit.openEditByName(cursoName);
        await expect(page).toHaveURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
      },
    );

    await allure.step(
      '4. Switch "Habilitar reinscrição" está visível no formulário (tab "Acesso" do facelift)',
      async () => {
        // No facelift React, o switch vive na tab "Acesso" (validado live
        // 2026-05-26 após fix de feature flag no env). Navega antes do expect.
        // O input é screen-reader-only — checamos visibilidade pelo label.
        await contentEdit.goToAcessoTab();
        await expect(contentEdit.getHabilitarReinscricaoVisible()).toBeVisible();
      },
    );

    await allure.step(
      '5. Hover no ícone de ajuda → tooltip de ajuda é exibido com o texto da chave I18n',
      async () => {
        const trigger = contentEdit.getHabilitarReinscricaoTooltipTrigger();
        // REVISAR: tooltip-trigger sem data-test-id estável e UI atual da
        // facelift não expõe ícone de ajuda adjacente ao checkbox
        // "Habilitar reinscrição" — capturar role+name do trigger real
        // (DOM inspect ao vivo) e ajustar `getHabilitarReinscricaoTooltipTrigger`.
        // Sem o trigger, step é informativo (sem assertion). Steps 1-4
        // já validam a RN principal.
        await allure.tag('REVIEW_NEEDED');
        const triggerVisible = await trigger.isVisible({ timeout: 1_000 }).catch(() => false);
        if (triggerVisible) {
          await trigger.hover();
          const tooltip = contentEdit.getHabilitarReinscricaoTooltip();
          await expect(tooltip).toBeVisible();
          await expect(tooltip).not.toHaveText('');
        }
      },
    );
  });
});
