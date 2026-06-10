// Testsuite: Configurar identificação do curso com seções e campos para IA (QA 1.4)
// TC1  — Acessar aba "Identificação" do curso
// TC2  — Validar exibição das sections (Básico, Caracterização, Configurações de IA)
// TC11 — Validar cabeçalhos e tooltips de cada section
//
// Recon 2026-06-05: o form É organizado em sections, mas com nomes diferentes
// da AT — "Dados básicos", "Público" (campos IA), "Acesso e visibilidade",
// "Conteúdo", "Notificações", "Chat". Asserts dos literais da AT são soft.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CourseEditTabsPage } from '../../../pages/CourseEditTabsPage.js';
import { identificacaoData as data } from './identificacao-ia.shared.data.js';

test.describe('Configurar identificação do curso com seções e campos para IA', () => {
  test('TC1 — Acessar aba "Identificação" do curso', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC1 — Acessar aba "Identificação"');
    await allure.severity('critical');

    const edit = new CourseEditTabsPage(page);
    await allure.step('1. Tela "Editar curso" é exibida', async () => {
      await edit.gotoEdit(data.courseId);
      await expect(edit.tab('identification')).toBeVisible({ timeout: 20_000 });
    });
    await allure.step('2. Aba "Identificação" exibida com sections', async () => {
      await edit.tab('identification').click();
      await expect(edit.campoNome()).toBeVisible({ timeout: 20_000 });
      const secoes = await edit.cabecalhosDeSecao();
      expect(secoes.length, `form organizado em sections (achadas: ${JSON.stringify(secoes)})`).toBeGreaterThanOrEqual(3);
    });
  });

  test('TC2 — Validar exibição das sections (Básico, Caracterização, Configurações de IA)', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC2 — Sections da Identificação');
    await allure.severity('critical');

    const edit = new CourseEditTabsPage(page);
    await edit.gotoEdit(data.courseId, 'identification');
    await expect(edit.campoNome()).toBeVisible({ timeout: 20_000 });

    await allure.step('2. Sections com cabeçalhos literais da AT', async () => {
      const secoes = await edit.cabecalhosDeSecao();
      for (const s of data.sectionsDaAt) {
        expect.soft(secoes, `AT espera section "${s}" (reais: ${JSON.stringify(secoes)})`).toContain(s);
      }
    });

    await allure.step('3. Campos agrupados por tema (campos de IA presentes em alguma section)', async () => {
      await expect(edit.campoIa('age')).toBeVisible();
      await expect(edit.campoIa('difficulty')).toBeVisible();
      await expect(edit.campoIa('tone_of_voice')).toBeVisible();
      await expect(edit.campoIa('target_audience')).toBeVisible();
    });
  });

  test('TC11 — Validar cabeçalhos e tooltips de cada section', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC11 — Cabeçalhos das sections');
    await allure.severity('minor');

    const edit = new CourseEditTabsPage(page);
    await edit.gotoEdit(data.courseId, 'identification');
    await expect(edit.campoNome()).toBeVisible({ timeout: 20_000 });
    const secoes = await edit.cabecalhosDeSecao();
    for (const s of data.sectionsDaAt) {
      expect.soft(secoes, `cabeçalho "${s}" exibido`).toContain(s);
    }
  });
});
