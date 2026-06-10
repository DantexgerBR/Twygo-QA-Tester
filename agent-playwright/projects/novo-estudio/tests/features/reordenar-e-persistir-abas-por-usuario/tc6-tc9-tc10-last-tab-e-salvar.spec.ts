// Testsuite: Reordenar e persistir abas por usuário, renomear "Gerenciar" e "Editar" (QA 1.3)
// TC6  — Validar restauração da última aba aberta por usuário x curso
// TC9  — Validar salvamento independente por aba
// TC10 — Validar confirmação ao trocar de aba com alterações não salvas
//
// TC4/TC5/TC7/TC8/TC11 estão BLOQUEADOS pela ausência da reordenação via drag
// (ver tc1-tc2-tc3 + laudo); TC12 é validação manual em banco (executor db).
// TC9 altera o nome do curso e RESTAURA no mesmo teste (cleanup pareado).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CourseEditTabsPage } from '../../../pages/CourseEditTabsPage.js';
import { abasData as data } from './abas-persistidas.shared.data.js';

test.describe('Reordenar e persistir abas por usuário, renomear "Gerenciar" e "Editar"', () => {
  test('TC6 — Validar restauração da última aba aberta por usuário x curso', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Reordenar e persistir abas por usuário');
    await allure.story('TC6 — Restauração da última aba aberta');
    await allure.severity('critical');

    const edit = new CourseEditTabsPage(page);

    await allure.step('2. Curso abre na aba "Identificação" (default)', async () => {
      await edit.gotoEdit(data.courseId);
      await expect(edit.tab('identification')).toBeVisible({ timeout: 20_000 });
      expect(await edit.abaAtiva()).toBe('tab-identification');
    });

    await allure.step('3. Clicar na aba "Banner" — aba exibida', async () => {
      await edit.tab('banner').click();
      // a partir do estado sem ?tab a URL nem sempre é atualizada — o sinal
      // confiável é o aria-selected da própria aba
      await expect.poll(() => edit.abaAtiva(), { timeout: 15_000 }).toBe('tab-banner');
    });

    await allure.step('4. Sair e retornar — curso abre direto na aba "Banner"', async () => {
      await edit.gotoListagem();
      await edit.gotoEdit(data.courseId); // sem ?tab — deveria restaurar last_tab
      await expect(edit.tab('identification')).toBeVisible({ timeout: 20_000 });
      expect(await edit.abaAtiva(), 'última aba usada ("Banner") restaurada').toBe('tab-banner');
    });
  });

  test('TC9 — Validar salvamento independente por aba', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Reordenar e persistir abas por usuário');
    await allure.story('TC9 — Salvamento independente por aba');
    await allure.severity('normal');

    const edit = new CourseEditTabsPage(page);
    const sufixo = ' [QA13]';

    await allure.step('2. Aba "Identificação" exibe botão "Salvar" próprio', async () => {
      await edit.gotoEdit(data.courseId, 'identification');
      await expect(edit.campoNome()).toBeVisible({ timeout: 20_000 });
      await expect(edit.botaoSalvar()).toBeVisible();
    });

    await allure.step('3-4. Editar "Nome", Salvar — toast de sucesso', async () => {
      // "Tipo de experiência" obrigatório vem vazio no seed — sem preencher,
      // a validação barra o submit silenciosamente (Network probe 2026-06-05)
      await edit.garantirTipoDeExperiencia();
      await edit.campoNome().fill(data.courseName + sufixo);
      await edit.botaoSalvar().click();
      await expect(edit.mensagemDeValidacao(), 'sem erro de validação bloqueando').toBeHidden({ timeout: 5_000 });
      await expect.soft(edit.toastDeSucesso(), 'toast de alterações salvas (AT: "ou texto equivalente")').toBeVisible({ timeout: 10_000 });
      // persistência é o critério duro: reload e conferir o valor salvo
      await edit.gotoEdit(data.courseId, 'identification');
      await expect(edit.campoNome()).toHaveValue(data.courseName + sufixo, { timeout: 20_000 });
    });

    await allure.step('cleanup — restaurar o nome original do curso', async () => {
      await edit.campoNome().fill(data.courseName);
      await edit.botaoSalvar().click();
      await page.waitForTimeout(3000);
      await edit.gotoEdit(data.courseId, 'identification');
      await expect(edit.campoNome()).toHaveValue(data.courseName, { timeout: 20_000 });
    });
  });

  test('TC10 — Validar confirmação ao trocar de aba com alterações não salvas', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Reordenar e persistir abas por usuário');
    await allure.story('TC10 — Confirmação ao trocar de aba com alterações não salvas');
    await allure.severity('normal');

    const edit = new CourseEditTabsPage(page);

    await allure.step('2-3. Editar campo "Nome" sem salvar', async () => {
      await edit.gotoEdit(data.courseId, 'identification');
      await expect(edit.campoNome()).toBeVisible({ timeout: 20_000 });
      await edit.campoNome().fill(data.courseName + ' [DIRTY]');
    });

    await allure.step('4. Clicar na aba "Banner" — modal de confirmação OU descarte', async () => {
      await edit.tab('banner').click();
      await page.waitForTimeout(2500);
      const modalVisivel = await edit.modalDeConfirmacao().isVisible().catch(() => false);
      if (modalVisivel) {
        expect(modalVisivel, 'modal de confirmação exibido').toBe(true);
        return; // política = confirmar; não prossegue pra não salvar lixo
      }
      // sem modal → política deveria ser DESCARTE: voltar e conferir o campo
      await edit.tab('identification').click();
      await expect(edit.campoNome()).toBeVisible({ timeout: 15_000 });
      const valor = await edit.campoNome().inputValue();
      expect(
        valor,
        'sem modal, alterações deveriam ser descartadas ao trocar de aba',
      ).toBe(data.courseName);
    });
  });
});
