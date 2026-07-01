import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { resolve } from 'node:path';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';
import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

// XML desatualizado: a tela HAML legada `/e/{id}/edit` não renderiza
// mais o checkbox "Habilitar reinscrição" no env staging-recertificacao
// (validado live 2026-05-27). Form foi migrado para o facelift React
// `/contents/{id}/edit?tab=access`. Paridade HAML/React não é mais
// observável — TC perde sentido até o XML ser atualizado pela AT/QA Lead.
// Categoria 'XML desatualizado' (CLAUDE.md §7.6 anti-pattern F).
test.describe.fixme('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed` v1.3):
  // beforeAll cria curso com defaults (has_recertification=false por
  // omissão). O TC toggla o switch entre as 2 telas (HAML legado `/e/{id}/edit`
  // e React facelift `/contents/{id}/edit`) e valida paridade do
  // atributo `events.has_recertification`. afterAll deleta o curso.
  let cursoId: number;
  let cursoName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    cursoName = `Curso Recertificação TC5 w${testInfo.workerIndex}-${Date.now()}`;
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    try {
      const seed = new SeedAdminPage(page);
      cursoId = await seed.createCurso({
        name: cursoName,
        hasRecertification: false,
      });
      // Re-grava storage atualizado pra evitar session race entre o
      // contexto do seed e o `page` fixture do test.
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

  test('TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
    await allure.story(
      'Paridade do switch entre formulário HAML e formulário React (facelift)',
    );
    await allure.severity('normal');

    const contentEdit = new ContentEditPage(page);

    await allure.step(
      '1. Editar o curso na tela HAML, ativar o switch e salvar → has_recertification = true',
      async () => {
        await contentEdit.openEditHamlById(cursoId);
        await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
        await contentEdit.setHabilitarReinscricao(true);
        await contentEdit.save();
        await contentEdit.expectSaveSuccess();
      },
    );

    await allure.step(
      '2. Acessar o MESMO curso pela tela React → switch carrega ligado (tab "Acesso")',
      async () => {
        await contentEdit.openEditReactById(cursoId);
        // Switch vive na tab "Acesso" do facelift (não na "Identificação").
        await contentEdit.goToAcessoTab();
        await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(true);
      },
    );

    await allure.step('3. Desativar o switch na tela React e salvar', async () => {
      await contentEdit.setHabilitarReinscricao(false);
      await contentEdit.save();
      await contentEdit.expectSaveSuccess();
    });

    await allure.step(
      '4. Recarregar a edição na tela HAML → switch aparece desligado (mesma coluna gravada)',
      async () => {
        await contentEdit.openEditHamlById(cursoId);
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);
      },
    );
  });
});
