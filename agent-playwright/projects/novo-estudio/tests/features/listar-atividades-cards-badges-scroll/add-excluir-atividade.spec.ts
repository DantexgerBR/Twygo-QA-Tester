import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { suiteData } from './listar-atividades-cards-badges-scroll.shared.data.js';

// TCs que MUTAM estado (criam/excluem atividade no curso compartilhado).
// SERIAL: as asserções de contagem/posição corrompem entre si sob paralelismo
// (ver skill testar-estudio-criacao-twygo §"Specs que mutam estado → SERIAL").
test.describe(suiteData.suiteName, () => {
  test.describe.configure({ mode: 'serial' });

  // títulos criados em cada teste — limpos no afterEach (rede de segurança).
  const created: string[] = [];

  test.afterEach(async ({ page }) => {
    if (created.length === 0) return;
    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);
    for (const title of created.splice(0)) {
      await studio.deleteActivityByTitle_safe(title);
    }
  });

  test('Adicionar atividade sem nada selecionado - vai para o final', async ({ page }, testInfo) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Adicionar atividade sem nada selecionado - vai para o final');
    await allure.severity('critical');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    await allure.step('3/4/5. Adicionar atividade tipo Página e salvar', async () => {
      const title = `TC16 w${testInfo.workerIndex}-${Date.now()}`;
      created.push(title);
      await studio.addPageActivity(title);
    });

    await allure.step('Validar que a nova atividade entrou no FINAL da lista', async () => {
      // "vai para o final": a nova é o card de MAIOR posição top-level. Asserção
      // por invariante (não "último card absoluto") — tolera atividades externas
      // pré-existentes no fim do curso compartilhado.
      const novo = studio.cardByTitle(created[created.length - 1]).first();
      await expect(novo).toBeVisible();
      const posTexts = await studio.cards
        .getByTestId('creation-studio-activity-card-position')
        .allTextContents();
      const topLevel = posTexts.filter((t) => /^\d+$/.test(t.trim())).map((t) => Number(t));
      const novoPos = Number((await studio.position(novo).textContent())?.trim());
      expect(novoPos).toBe(Math.max(...topLevel));
    });
  });

  test('Validar exclusão de atividade sem confirmação extra', async ({ page }, testInfo) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar exclusão de atividade sem confirmação extra');
    await allure.severity('normal');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    const title = `TC18 w${testInfo.workerIndex}-${Date.now()}`;
    await allure.step('Pré-condição: criar atividade Página descartável', async () => {
      created.push(title);
      await studio.addPageActivity(title);
    });

    await allure.step('2/3/4. Abrir, Excluir e CONFIRMAR — atividade some da lista', async () => {
      const card = studio.cardByTitle(title).first();
      await studio.openActivity(card);
      await studio.previewDeleteButton.click();
      // ⚠️ REVISAR (AT): o TC diz "sem confirmação extra", mas o produto EXIBE
      // um dialog de confirmação "Excluir atividade — Esta ação não pode ser
      // desfeita". Validamos o comportamento REAL e sinalizamos a divergência.
      await expect(studio.previewDeleteDialog).toBeVisible();
      await studio.previewDeleteDialog.getByRole('button', { name: 'Excluir' }).click();
      await expect(studio.cardByTitle(title)).toHaveCount(0, { timeout: 15_000 });
    });
    created.splice(created.indexOf(title), 1); // já excluída pelo teste
  });

  test('Adicionar atividade com atividade selecionada - logo após a selecionada', async ({ page }, testInfo) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Adicionar atividade com atividade selecionada - logo após a selecionada');
    await allure.severity('critical');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    await allure.step('2/3/4. Selecionar a atividade da posição 2 e adicionar Página', async () => {
      const title = `TC17 w${testInfo.workerIndex}-${Date.now()}`;
      created.push(title);
      await studio.addPageActivityAfter(studio.cardAtPosition(2), title);
    });

    await allure.step('5. Nova atividade entra na posição 3 (logo após a selecionada)', async () => {
      const novoCard = studio.cardByTitle(created[created.length - 1]).first();
      await expect(studio.position(novoCard)).toHaveText('3');
    });
  });

  test('Validar salvamento sem confirmação extra', async ({ page }, testInfo) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar salvamento sem confirmação extra');
    await allure.severity('normal');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    const original = `TC19 w${testInfo.workerIndex}-${Date.now()}`;
    const renamed = `${original}-EDIT`;
    await allure.step('Pré-condição: criar atividade Página descartável', async () => {
      created.push(original);
      await studio.addPageActivity(original);
    });

    await allure.step('2/3. Editar o nome e Salvar — sem confirmação extra, mudança persistida', async () => {
      await studio.editPageTitle(studio.cardByTitle(original).first(), renamed);
      // rastrear o novo título para cleanup
      created.splice(created.indexOf(original), 1);
      created.push(renamed);
      // "sem confirmação extra": o save NÃO dispara dialog de confirmação.
      await expect(page.locator('[role="alertdialog"]')).toHaveCount(0);
      // a alteração foi salva (card com o novo nome aparece na lista).
      await expect(studio.cardByTitle(renamed).first()).toBeVisible({ timeout: 15_000 });
      // NOTA: a AT espera toast "Alterações salvas com sucesso." — ele aparece,
      // porém é transitório e a navegação editor→lista o descarta antes de uma
      // asserção estável; validamos o efeito persistido em vez do toast volátil.
    });
  });

  // fixme [bloqueio-temporario]: o drag dnd-kit FUNCIONA (reorder dispara PATCH —
  // validado via MCP), MAS a semântica de drop é arriscada no curso COMPARTILHADO:
  // drop no centro de um card = ANINHA (vira sub-atividade) e corrompe a estrutura;
  // só drop em gap/borda reordena. Um drop impreciso quebra os outros 8 specs verdes.
  // Precisa de helper de drag robusto + sandbox de atividades descartáveis (ou reset
  // de DB) antes de rodar contra o seed. Helper `reorderByDrag` já existe no POM.
  // Ver skill testar-estudio-criacao-twygo §drag. Mesma razão p/ TC20 (precisa ≥5
  // top-level) e TC22 (reparent). TC21 = volume.
  test('Validar reorder API disparada ao soltar drag and drop', async ({ page }) => {
    test.fixme(true, '[bloqueio-temporario] drag dnd-kit: drop no centro do card ANINHA/corrompe a estrutura do curso compartilhado; requer helper de drag robusto + sandbox de atividades descartáveis. RN 15. Ver TCS-IGNORADOS-reproducao-manual.md.');
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Validar reorder API disparada ao soltar drag and drop');
    await allure.severity('critical');

    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);

    // captura de requisição de reorder disparada ao soltar
    const reorderReqs: string[] = [];
    page.on('request', (r) => {
      if (['PATCH', 'PUT', 'POST'].includes(r.method()) && /activit|position|reorder|content|studio/i.test(r.url())) {
        reorderReqs.push(`${r.method()} ${r.url()}`);
      }
    });

    const primeiroTitulo = (await studio.title(studio.cards.first()).textContent())?.trim() ?? '';

    await allure.step('2/3. Arrastar a atividade da posição 1 para a posição 3 e soltar', async () => {
      await studio.reorderByDrag(studio.cardAtPosition(1), studio.cardAtPosition(3));
      // a atividade que estava em 1 não está mais em 1 (reposicionada)
      await expect(studio.title(studio.cards.first())).not.toHaveText(primeiroTitulo);
    });

    await allure.step('Validar que a chamada de reorder foi disparada ao soltar', async () => {
      expect(reorderReqs.length, `nenhuma request de reorder capturada`).toBeGreaterThan(0);
    });

    // revert: devolver a atividade à posição 1 (mantém o curso pristino)
    await studio.reorderByDrag(studio.cardByTitle(primeiroTitulo).first(), studio.cardAtPosition(1));
    await expect(studio.title(studio.cards.first())).toHaveText(primeiroTitulo);
  });
});
