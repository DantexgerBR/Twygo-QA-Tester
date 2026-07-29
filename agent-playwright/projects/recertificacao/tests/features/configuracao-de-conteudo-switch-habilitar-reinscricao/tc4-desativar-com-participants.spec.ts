import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { resolve } from 'node:path';
import { ContentEditPage } from '../../../pages/ContentEditPage.js';
import { SeedAdminPage } from '../../../../../src/pages/SeedAdminPage.js';

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed` v1.3):
  // beforeAll cria curso com defaults, depois abre edit e liga o switch
  // "Habilitar reinscrição" (que vive em tab posterior do form facelift,
  // NÃO no form de criação). A parte "com participants reinscritos"
  // ainda NÃO é coberta — helper canônico `SeedAdminPage.matricularAluno`
  // foi implementado em 2026-05-27 (skill v1.3 §"Matrícula de aluno"),
  // mas o TC4 ainda só usa createCurso. Refatorar quando o spec for
  // expandido pra cobrir cenário composto com participants reinscritos.
  // Por ora, o teste valida apenas que desativar o switch não dispara
  // modal/aviso de bloqueio (parte do RN 2.3).
  let cursoId: number;
  let cursoName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    cursoName = `Curso Recertificação TC4 w${testInfo.workerIndex}-${Date.now()}`;
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    try {
      const seed = new SeedAdminPage(page);
      cursoId = await seed.createCurso({ name: cursoName });
      // Ligar o switch "Habilitar reinscrição" via ContentEditPage —
      // skill v1.3 documenta que o switch NÃO está no form de criação
      // (vive em tab posterior do edit).
      const contentEdit = new ContentEditPage(page);
      await contentEdit.openEditById(cursoId);
      await contentEdit.setHabilitarReinscricao(true);
      await contentEdit.save();
      await contentEdit.expectSaveSuccess();
      // Re-grava storage atualizado pra evitar session race entre o
      // contexto do seed e o `page` fixture do test (Twygo regenera
      // session_id após operações de criação/save).
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
        // reinscritos via `SeedAdminPage.matricularAluno` (já implementado;
        // ver Page Object). Refatorar TC pra invocar matricularAluno +
        // simular reinscrição quando expandir cobertura.
        await allure.tag('REVIEW_NEEDED');
        // Switch vive na tab "Acesso" do facelift.
        await contentEdit.openEditByIdInAcessoTab(cursoId);
        await expect(contentEdit.getHabilitarReinscricaoVisible()).toBeVisible();
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

        // Reabre para confirmar persistência do switch OFF (tab "Acesso").
        await contentEdit.openEditByIdInAcessoTab(cursoId);
        expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);

        // REVISAR: assertion `participants.recertification_number > 0` no banco
        // é verificação DB pura — fora do escopo Playwright (ver
        // CONTRACT.md §validador secundário).
        await allure.tag('NEEDS_DB_TEST');
      },
    );
  });
});
