import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { resolve } from 'node:path';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';
import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  // Bloqueio confirmado live 2026-05-26 — ver memo
  // [[project-recertificacao-seed-blocker]]. createCurso via UI retorna
  // 422 mesmo com perfil Admin via popover.
  test.fixme(
    true,
    'createCurso via UI bloqueado por HTTP 422 no env staging-base-de-conhecimento (memo project-recertificacao-seed-blocker). Validar manualmente permissão do user ou usar bypass via API REST.',
  );
  // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed`):
  // beforeAll cria curso com `has_recertification = true`. A parte "com
  // participants reinscritos" ainda NÃO é coberta porque
  // `SeedAdminPage.criarAlunoMatriculado` está marcado not-implemented
  // (requer recon live do fluxo "Adicionar aluno" — ver Page Object).
  // Quando o helper estiver disponível, estender o beforeAll para criar
  // participant + setar recertification_number > 0 (validação cross-suite
  // com Suite 02). Por ora, o teste valida apenas que desativar o switch
  // não dispara modal/aviso de bloqueio (parte do RN 2.3).
  let cursoId: number;
  let cursoName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    cursoName = `Curso Recertificação TC4 w${testInfo.workerIndex}-${Date.now()}`;
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    try {
      const seed = new SeedAdminPage(page);
      cursoId = await seed.createCurso({
        name: cursoName,
        hasRecertification: true,
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

  test('TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
    await allure.story(
      'Desativar o switch em curso com participants reinscritos é permitido sem aviso',
    );
    await allure.severity('critical');

    const contentEdit = new ContentEditPage(page);

    await allure.step(
      '1. Pré-condição: curso com `has_recertification = true` (criado no beforeAll)',
      async () => {
        // REVISAR: validação cross-suite com Suite 02 — testar com participants
        // reinscritos quando `SeedAdminPage.criarAlunoMatriculado` estiver
        // implementado (helper hoje lança not-implemented; ver Page Object).
        await allure.tag('REVIEW_NEEDED');
        await contentEdit.openEditById(cursoId);
        await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(true);
      },
    );

    await allure.step(
      '2. Acessar a edição deste curso → página é exibida com switch ligado',
      async () => {
        // Estado já validado no passo 1; aqui apenas reafirma URL/visibilidade
        // para registrar o passo separadamente no relatório Allure.
        await expect(page).toHaveURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
      },
    );

    await allure.step(
      '3. Clicar no switch para desligar → nenhum modal de confirmação aparece',
      async () => {
        await contentEdit.setHabilitarReinscricao(false);
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);
        // RN 2.3 — não deve haver modal/aviso bloqueante.
        await expect(page.getByRole('dialog')).toBeHidden();
      },
    );

    await allure.step(
      '4. Clicar em "Salvar" → curso é salvo; histórico (recertification_number) preservado',
      async () => {
        await contentEdit.save();
        await contentEdit.expectSaveSuccess();

        // Reabre para confirmar persistência do switch OFF.
        await contentEdit.openEditById(cursoId);
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);

        // REVISAR: assertion `participants.recertification_number > 0` no banco
        // é verificação DB pura — fora do escopo Playwright (ver
        // CONTRACT.md §validador secundário).
        await allure.tag('NEEDS_DB_TEST');
      },
    );
  });
});
