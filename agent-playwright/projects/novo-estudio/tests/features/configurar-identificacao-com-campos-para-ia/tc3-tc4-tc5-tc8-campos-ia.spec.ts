// Testsuite: Configurar identificação do curso com seções e campos para IA (QA 1.4)
// TC3 — Preencher campo "Idade" · TC4 — "Dificuldade" · TC5 — "Tom de voz"
// TC8 — Salvar e recarregar: persistência dos novos campos
//
// Recon 2026-06-05: campos de IA são inputs LIVRES (maxlength 250) na section
// "Público" — "Dificuldade" NÃO é dropdown como a AT descreve (soft no TC4).
// Curso seed tem "Tipo de experiência" (obrigatório) vazio → garantir antes de
// salvar. Campos IA eram vazios no seed → cleanup zera no fim do TC8.
// Mesmo form compartilhado — rodar com --workers 1 (sem serial: serial pula a
// cadeia inteira quando um TC falha, escondendo resultado dos demais).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CourseEditTabsPage } from '../../../pages/CourseEditTabsPage.js';
import { identificacaoData as data } from './identificacao-ia.shared.data.js';

test.describe('Configurar identificação do curso com seções e campos para IA', () => {
  async function abrir(page: import('@playwright/test').Page): Promise<CourseEditTabsPage> {
    const edit = new CourseEditTabsPage(page);
    await edit.gotoEdit(data.courseId, 'identification');
    await expect(edit.campoNome()).toBeVisible({ timeout: 20_000 });
    await edit.garantirTipoDeExperiencia();
    return edit;
  }

  test('TC3 — Preencher campo "Idade" (faixa etária do público-alvo)', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC3 — Campo "Idade"');
    await allure.severity('critical');

    const edit = await abrir(page);
    await allure.step('2. Preencher "Idade" — campo aceita o texto', async () => {
      await edit.campoIa('age').fill(data.valores.idade);
      await expect(edit.campoIa('age')).toHaveValue(data.valores.idade);
    });
    await allure.step('3. Salvar — toast de sucesso', async () => {
      await edit.botaoSalvar().click();
      await expect(edit.toastDeSucesso()).toBeVisible({ timeout: 15_000 });
    });
  });

  test('TC4 — Preencher campo "Dificuldade" (nível esperado)', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC4 — Campo "Dificuldade"');
    await allure.severity('critical');

    const edit = await abrir(page);
    await allure.step('2. Selecionar "Intermediário" em "Dificuldade"', async () => {
      // AT descreve dropdown; implementação é input de texto livre com placeholder
      // de exemplos. Soft documenta a divergência; o preenchimento usa o input.
      const ehCombobox = await edit.campoIa('difficulty').getAttribute('role');
      expect.soft(ehCombobox, 'AT espera dropdown (role=combobox); campo é input livre').toBe('combobox');
      await edit.campoIa('difficulty').fill(data.valores.dificuldade);
      await expect(edit.campoIa('difficulty')).toHaveValue(data.valores.dificuldade);
    });
    await allure.step('3. Salvar — toast de sucesso', async () => {
      await edit.botaoSalvar().click();
      await expect(edit.toastDeSucesso()).toBeVisible({ timeout: 15_000 });
    });
  });

  test('TC5 — Preencher campo "Tom de voz"', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC5 — Campo "Tom de voz"');
    await allure.severity('critical');

    const edit = await abrir(page);
    await allure.step('2. Preencher "Tom de voz" — campo aceita o texto', async () => {
      await edit.campoIa('tone_of_voice').fill(data.valores.tomDeVoz);
      await expect(edit.campoIa('tone_of_voice')).toHaveValue(data.valores.tomDeVoz);
    });
    await allure.step('3. Salvar — toast de sucesso', async () => {
      await edit.botaoSalvar().click();
      await expect(edit.toastDeSucesso()).toBeVisible({ timeout: 15_000 });
    });
  });

  test('TC8 — Salvar e recarregar - persistência dos novos campos', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC8 — Persistência dos novos campos');
    await allure.severity('critical');

    const edit = await abrir(page);
    const v = data.valores.persistencia;

    await allure.step('2-4. Preencher Idade, Dificuldade e Tom de voz', async () => {
      await edit.campoIa('age').fill(v.idade);
      await edit.campoIa('difficulty').fill(v.dificuldade);
      await edit.campoIa('tone_of_voice').fill(v.tomDeVoz);
    });

    await allure.step('5. Salvar — toast de sucesso', async () => {
      await edit.botaoSalvar().click();
      await expect(edit.toastDeSucesso()).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('6. Recarregar — campos mantêm os valores', async () => {
      await page.reload({ waitUntil: 'domcontentloaded' });
      await expect(edit.campoIa('age')).toHaveValue(v.idade, { timeout: 20_000 });
      await expect(edit.campoIa('difficulty')).toHaveValue(v.dificuldade);
      await expect(edit.campoIa('tone_of_voice')).toHaveValue(v.tomDeVoz);
    });

    await allure.step('cleanup — zerar campos IA (estado original do seed)', async () => {
      await edit.campoIa('age').fill('');
      await edit.campoIa('difficulty').fill('');
      await edit.campoIa('tone_of_voice').fill('');
      await edit.botaoSalvar().click();
      await expect(edit.toastDeSucesso()).toBeVisible({ timeout: 15_000 });
    });
  });
});
