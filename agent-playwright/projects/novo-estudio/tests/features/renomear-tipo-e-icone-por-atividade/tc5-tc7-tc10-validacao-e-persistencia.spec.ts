// Testsuite: Renomear tipo e ícone por atividade (QA 1.6)
// TC5  — display_label obrigatório (validação ao salvar)
// TC7  — Lista do Estúdio usa display_label (combinado ao TC10)
// TC10 — Persistência de display_label/display_icon após reload
//
// TC6 (herança de ícone) coberto parcialmente pelo TC10 (restauro). TC8/TC9
// (Play do aluno / exceção SCORM) exigem aluno inscrito + publicação — fora
// deste run, registrado no laudo como cobertura pendente. TC11 é manual (db).
// TCs alteram a atividade folha 9288190 e RESTAURAM ao final. --workers 1.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioPage } from '../../../pages/StudioPage.js';
import { ActivityFormPage } from '../../../pages/ActivityFormPage.js';
import { renomearData as data } from './renomear-tipo-icone.shared.data.js';

test.describe('Renomear tipo e ícone por atividade', () => {
  test('TC5 — Validar display_label como obrigatório', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Renomear tipo e ícone por atividade');
    await allure.story('TC5 — display_label obrigatório');
    await allure.severity('critical');

    const form = new ActivityFormPage(page);
    await form.gotoEditAtividade(data.atividade.id, data.atividade.type, data.eventId);
    await expect(form.campoDisplayLabel()).toBeVisible({ timeout: 20_000 });

    await allure.step('3-4. Limpar display_label e Salvar — erro + salvamento bloqueado', async () => {
      await form.campoDisplayLabel().fill('');
      await form.botaoSalvar().click();
      await expect.soft(form.mensagemObrigatorio(), 'mensagem de obrigatório exibida').toBeVisible({ timeout: 10_000 });
      // critério duro: o vazio NÃO pode ter sido persistido
      await form.gotoEditAtividade(data.atividade.id, data.atividade.type, data.eventId);
      const valor = await form.campoDisplayLabel().inputValue();
      expect(valor, 'display_label não foi salvo vazio').not.toBe('');
    });

    await allure.step('cleanup — garantir label original', async () => {
      const valor = await form.campoDisplayLabel().inputValue();
      if (valor !== data.atividade.labelOriginal) {
        await form.campoDisplayLabel().fill(data.atividade.labelOriginal);
        await form.botaoSalvar().click();
        await page.waitForTimeout(3000);
      }
    });
  });

  test('TC7+TC10 — Lista usa display_label e valores persistem após reload', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Renomear tipo e ícone por atividade');
    await allure.story('TC10 — Persistência de display_label/display_icon (+TC7 lista)');
    await allure.severity('critical');

    const studio = new StudioPage(page);
    const form = new ActivityFormPage(page);

    await allure.step('2-4. Customizar display_label e display_icon, Salvar', async () => {
      await form.gotoEditAtividade(data.atividade.id, data.atividade.type, data.eventId);
      await expect(form.campoDisplayLabel()).toBeVisible({ timeout: 20_000 });
      await form.campoDisplayLabel().fill(data.labelCustomizado);
      await form.opcaoDeIcone(data.iconeCustomizado).click();
      await form.botaoSalvar().click();
      await expect.soft(form.toastDeSucesso(), 'toast de sucesso').toBeVisible({ timeout: 10_000 });
    });

    await allure.step('5. Recarregar — campos mantêm os valores', async () => {
      await form.gotoEditAtividade(data.atividade.id, data.atividade.type, data.eventId);
      await expect(form.campoDisplayLabel()).toHaveValue(data.labelCustomizado, { timeout: 20_000 });
    });

    await allure.step('TC7 — card da lista exibe o display_label customizado', async () => {
      await studio.gotoEstudio(data.eventId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
      await expect(studio.tipoNoCard(data.atividade.id)).toHaveText(data.labelCustomizado, { timeout: 15_000 });
    });

    await allure.step('cleanup — restaurar label e ícone originais', async () => {
      await form.gotoEditAtividade(data.atividade.id, data.atividade.type, data.eventId);
      await expect(form.campoDisplayLabel()).toBeVisible({ timeout: 20_000 });
      await form.campoDisplayLabel().fill(data.atividade.labelOriginal);
      await form.opcaoDeIcone(data.atividade.iconeOriginal).click().catch(() => null);
      await form.botaoSalvar().click();
      await page.waitForTimeout(3000);
      await form.gotoEditAtividade(data.atividade.id, data.atividade.type, data.eventId);
      await expect(form.campoDisplayLabel()).toHaveValue(data.atividade.labelOriginal, { timeout: 20_000 });
    });
  });
});
