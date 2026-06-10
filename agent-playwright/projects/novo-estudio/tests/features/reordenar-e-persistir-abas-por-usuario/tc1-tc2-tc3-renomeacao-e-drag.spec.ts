// Testsuite: Reordenar e persistir abas por usuário, renomear "Gerenciar" e "Editar" (QA 1.3)
// TC1 — Validar renomeação "Gerenciar curso" para "Editar curso"
// TC2 — Reordenar abas dentro de "Editar curso" via drag and drop
// TC3 — Validar ícone de drag visível ao passar mouse sobre título da aba
//
// Recon 2026-06-05 (org 37061 vs baseline 36675):
// - Kebab da listagem mostra "Editar" em AMBAS as orgs; breadcrumb "Editar curso"
//   também em ambas. Não há "Gerenciar curso" em lugar nenhum.
// - Abas são Chakra tabs SEM atributos de drag; hover não exibe ícone; drag
//   manual (mouse down/move/up com ativação) não reordena e não dispara request.
// Falhas aqui = funcionalidade da RN 3 ausente nesta entrega (ver laudo).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CourseEditTabsPage } from '../../../pages/CourseEditTabsPage.js';
import { abasData as data } from './abas-persistidas.shared.data.js';

test.describe('Reordenar e persistir abas por usuário, renomear "Gerenciar" e "Editar"', () => {
  test('TC1 — Validar renomeação "Gerenciar curso" para "Editar curso"', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Reordenar e persistir abas por usuário');
    await allure.story('TC1 — Validar renomeação "Gerenciar curso" para "Editar curso"');
    await allure.severity('critical');

    const edit = new CourseEditTabsPage(page);

    await allure.step('2. Listagem de Conteúdos é exibida', async () => {
      await edit.gotoListagem();
      await expect(edit.kebabDoCurso(data.courseId)).toBeVisible({ timeout: 20_000 });
    });

    await allure.step('3. Ação "Editar curso" no lugar do antigo "Gerenciar curso"', async () => {
      await edit.abrirKebab(data.courseId);
      const itens = await edit.itensVisiveisDoKebab();
      expect(itens.some((i) => /gerenciar/i.test(i)), 'não há mais "Gerenciar curso"').toBe(false);
      // Rótulo literal da AT: "Editar curso". Observado: "Editar" (idêntico ao
      // fluxo atual da org 36675) — soft pra registrar a diferença de literal.
      expect.soft(
        itens.some((i) => /editar curso/i.test(i)),
        `AT espera literal "Editar curso"; itens visíveis: ${JSON.stringify(itens.slice(0, 12))}`,
      ).toBe(true);
      expect(itens.some((i) => /editar/i.test(i)), 'ação de edição existe').toBe(true);
    });
  });

  test('TC2 — Reordenar abas dentro de "Editar curso" via drag and drop', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Reordenar e persistir abas por usuário');
    await allure.story('TC2 — Reordenar abas via drag and drop');
    await allure.severity('critical');

    const edit = new CourseEditTabsPage(page);
    const persistencia: string[] = [];
    page.on('request', (r) => {
      if (/POST|PATCH|PUT/.test(r.method()) && /prefer|tab_order|reorder/i.test(r.url() + (r.postData() || ''))) {
        persistencia.push(`${r.method()} ${r.url()}`);
      }
    });

    await allure.step('2. Tela "Editar curso" é exibida com as abas internas', async () => {
      await edit.gotoEdit(data.courseId, 'identification');
      await expect(edit.tab('modelo')).toBeVisible({ timeout: 20_000 });
    });

    await allure.step('3. Arrastar a aba "Modelo" para a posição da aba "Banner"', async () => {
      const antes = await edit.ordemDasAbas();
      await edit.arrastarAba('modelo', 'banner');
      const depois = await edit.ordemDasAbas();
      await allure.step('4. Ordem das abas reflete a alteração', async () => {
        expect(
          JSON.stringify(depois) !== JSON.stringify(antes),
          `ordem deveria mudar (antes=depois=${JSON.stringify(depois)}; requests de persistência: ${JSON.stringify(persistencia)})`,
        ).toBe(true);
      });
    });
  });

  test('TC3 — Validar ícone de drag visível ao passar mouse sobre título da aba', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Reordenar e persistir abas por usuário');
    await allure.story('TC3 — Ícone de drag no hover');
    await allure.severity('normal');

    const edit = new CourseEditTabsPage(page);
    await edit.gotoEdit(data.courseId, 'identification');
    await expect(edit.tab('modelo')).toBeVisible({ timeout: 20_000 });

    await allure.step('2. Hover sobre aba móvel ("Modelo") — ícone de drag é exibido', async () => {
      const icones = await edit.iconeDeDragNaAba('modelo');
      expect.soft(icones, 'ícone de drag na aba "Modelo" ao hover').toBeGreaterThan(0);
    });

    await allure.step('3. Hover sobre "Identificação" — ícone NÃO é exibido (travada)', async () => {
      const icones = await edit.iconeDeDragNaAba('identification');
      expect(icones, 'sem ícone de drag na aba travada').toBe(0);
    });
  });
});
