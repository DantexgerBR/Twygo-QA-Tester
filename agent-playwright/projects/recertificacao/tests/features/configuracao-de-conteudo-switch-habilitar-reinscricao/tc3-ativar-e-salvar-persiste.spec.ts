import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { resolve } from 'node:path';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';
import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  // Bloqueio confirmado live 2026-05-26 — ver memo
  // [[project-recertificacao-seed-blocker]]. createCurso via UI retorna
  // 422 mesmo com perfil Admin via popover. Detalhe em TC1 deste mesmo
  // describe (mesma raiz).
  test.fixme(
    true,
    'createCurso via UI bloqueado por HTTP 422 no env staging-base-de-conhecimento (memo project-recertificacao-seed-blocker). Validar manualmente permissão do user ou usar bypass via API REST.',
  );
  // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed`):
  // beforeAll cria curso com `has_recertification = false` (pré-condição
  // do MD); afterAll deleta o curso inteiro — revert de toggle é
  // desnecessário porque o registro deixa de existir.
  let cursoId: number;
  let cursoName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    cursoName = `Curso Recertificação TC3 w${testInfo.workerIndex}-${Date.now()}`;
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    try {
      const seed = new SeedAdminPage(page);
      cursoId = await seed.createCurso({
        name: cursoName,
        hasRecertification: false,
      });
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

  test('TC3 — Ativar e salvar o switch persiste `has_recertification = true`', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
    await allure.story('Ativar e salvar o switch persiste `has_recertification = true`');
    await allure.severity('critical');

    const contentEdit = new ContentEditPage(page);

    await allure.step(
      '1. Acessar a edição de um curso com `has_recertification = false`',
      async () => {
        await contentEdit.openEditById(cursoId);
        await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
        // Pré-condição: switch desligado (criado assim no beforeAll).
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);
      },
    );

    await allure.step(
      '2. Clicar no switch "Habilitar reinscrição" → estado ON',
      async () => {
        await contentEdit.setHabilitarReinscricao(true);
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(true);
      },
    );

    await allure.step('3. Clicar no botão "Salvar" → toast de sucesso', async () => {
      // REVISAR-FIGMA: texto exato do toast de sucesso ainda não confirmado.
      await contentEdit.save();
      await contentEdit.expectSaveSuccess();
    });

    await allure.step(
      '4. Recarregar a edição → switch permanece ligado (has_recertification = true persistido)',
      async () => {
        await contentEdit.openEditById(cursoId);
        await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(true);
      },
    );
  });
});
