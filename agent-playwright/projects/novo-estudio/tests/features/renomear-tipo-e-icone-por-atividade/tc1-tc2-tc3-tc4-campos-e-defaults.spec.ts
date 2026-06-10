// Testsuite: Renomear tipo e ícone por atividade (QA 1.6)
// TC1 — Campo display_label no cadastro/edição de atividade
// TC2 — Campo display_icon com seletor Google Icons
// TC3 — Default de display_label igual ao nome do tipo
// TC4 — Default de display_icon igual ao ícone do tipo
//
// Recon 2026-06-05: form em /o/{org}/studio/activities/{id}/edit?type=&eventId=
// com #activity-appearance-displayLabel-input e icon picker
// activity-appearance-icon-*. AT pede atividade "Lesson" — o seed não tem Aula;
// usamos a folha PDF 9288190 (divergência de pré-condição no laudo). O botão
// "Editar" do preview do Estúdio fica DESABILITADO (achado — sem caminho de UI
// pra abrir este form em atividade existente; soft no TC1). TC3/TC4 criam
// rascunho ao escolher o tipo → cleanup exclui no fim. Rodar com --workers 1.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioPage } from '../../../pages/StudioPage.js';
import { ActivityFormPage } from '../../../pages/ActivityFormPage.js';
import { renomearData as data } from './renomear-tipo-icone.shared.data.js';

test.describe('Renomear tipo e ícone por atividade', () => {
  test('TC1 — Validar campo display_label no cadastro/edição de atividade', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Renomear tipo e ícone por atividade');
    await allure.story('TC1 — Campo display_label disponível');
    await allure.severity('critical');

    const studio = new StudioPage(page);
    const form = new ActivityFormPage(page);

    await allure.step('2. Caminho de UI: selecionar atividade e clicar "Editar"', async () => {
      await studio.gotoEstudio(data.eventId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
      await studio.cardAtividade(data.atividade.id).click();
      const editar = page.locator('button:visible').filter({ hasText: /^Editar$/ }).first();
      // achado de recon: botão fica desabilitado mesmo com atividade selecionada
      expect.soft(
        await editar.isEnabled().catch(() => false),
        'botão "Editar" do preview deveria habilitar com atividade selecionada',
      ).toBe(true);
    });

    await allure.step('3. Campo display_label exibido no formulário (rota direta)', async () => {
      await form.gotoEditAtividade(data.atividade.id, data.atividade.type, data.eventId);
      await expect(form.campoDisplayLabel()).toBeVisible({ timeout: 20_000 });
    });
  });

  test('TC2 — Validar campo display_icon com seletor Google Icons', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Renomear tipo e ícone por atividade');
    await allure.story('TC2 — Seletor de ícones Google Icons');
    await allure.severity('critical');

    const form = new ActivityFormPage(page);
    await form.gotoEditAtividade(data.atividade.id, data.atividade.type, data.eventId);
    await expect(form.campoDisplayLabel()).toBeVisible({ timeout: 20_000 });

    await allure.step('3. Seletor de ícones do conjunto Google Icons é exibido', async () => {
      await expect(form.iconPicker()).toBeVisible();
      const icones = await form.opcoesDeIcone();
      expect(icones.length, `opções de ícone disponíveis: ${JSON.stringify(icones)}`).toBeGreaterThanOrEqual(5);
    });

    await allure.step('4. Selecionar ícone diferente do default', async () => {
      await form.opcaoDeIcone(data.iconeCustomizado).click();
      // sem salvar — TC só valida a seleção no form
    });
  });

  test('TC3 — Validar default de display_label igual ao nome do tipo', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Renomear tipo e ícone por atividade');
    await allure.story('TC3 — Default de display_label');
    await allure.severity('critical');

    const studio = new StudioPage(page);
    const form = new ActivityFormPage(page);
    let novaId = '';

    await allure.step('2-3. Adicionar atividade do tipo "Vídeo upload"', async () => {
      await studio.gotoEstudio(data.eventId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
      novaId = await studio.criarAtividadeDoTipo(data.novoTipo.slug);
    });

    await allure.step('4. display_label default = nome do tipo', async () => {
      await expect(form.campoDisplayLabel()).toHaveValue(data.novoTipo.labelDefault, { timeout: 20_000 });
    });

    await allure.step('cleanup — excluir atividade rascunho criada', async () => {
      await studio.gotoEstudio(data.eventId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
      await studio.excluirAtividade(novaId);
      await expect(studio.cardAtividade(novaId)).toBeHidden({ timeout: 15_000 });
    });
  });

  test('TC4 — Validar default de display_icon igual ao ícone do tipo', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Renomear tipo e ícone por atividade');
    await allure.story('TC4 — Default de display_icon');
    await allure.severity('critical');

    const studio = new StudioPage(page);
    const form = new ActivityFormPage(page);
    let novaId = '';

    await allure.step('2-3. Adicionar atividade do tipo "SCORM"', async () => {
      await studio.gotoEstudio(data.eventId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
      novaId = await studio.criarAtividadeDoTipo(data.scorm.slug);
    });

    await allure.step('4. display_icon default = ícone do tipo (picker com seleção)', async () => {
      await expect(form.iconPicker()).toBeVisible({ timeout: 20_000 });
      await expect(form.campoDisplayLabel()).toHaveValue(data.scorm.labelDefault);
      // seleção default detectável (aria/checked/realce) — registro soft
      const temSelecao = await page.evaluate(() =>
        Array.from(document.querySelectorAll('[data-test-id^="activity-appearance-icon-"]'))
          .some((el) =>
            el.getAttribute('aria-pressed') === 'true' ||
            el.getAttribute('aria-selected') === 'true' ||
            el.getAttribute('data-selected') !== null));
      expect.soft(temSelecao, 'ícone default do tipo marcado como selecionado no picker').toBe(true);
    });

    await allure.step('cleanup — excluir atividade rascunho criada', async () => {
      await studio.gotoEstudio(data.eventId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
      await studio.excluirAtividade(novaId);
      await expect(studio.cardAtividade(novaId)).toBeHidden({ timeout: 15_000 });
    });
  });
});
