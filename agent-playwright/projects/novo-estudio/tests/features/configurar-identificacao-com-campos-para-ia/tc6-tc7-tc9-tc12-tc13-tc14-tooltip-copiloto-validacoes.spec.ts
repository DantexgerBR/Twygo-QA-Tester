// Testsuite: Configurar identificação do curso com seções e campos para IA (QA 1.4)
// TC6  — Tooltip da section "Configurações de IA"
// TC7  — Campos existentes preservados (Nome, Descrição, Idioma)
// TC9  — Copiloto isolado na aba Identificação
// TC12 — Limites de caracteres dos novos campos
// TC13 — Salvar com obrigatórios vazios (validação)
// TC14 — Toast de sucesso ao salvar
//
// TC10 (copiar sugestão do copiloto) está BLOQUEADO: o FAB do copiloto não
// existe na aba Identificação (recon 2026-06-05) e os créditos de IA estão
// desligados na org 37061 (QA 1.1 TC9). Mesmo form — rodar com --workers 1.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CourseEditTabsPage } from '../../../pages/CourseEditTabsPage.js';
import { identificacaoData as data } from './identificacao-ia.shared.data.js';

test.describe('Configurar identificação do curso com seções e campos para IA', () => {
  async function abrir(page: import('@playwright/test').Page): Promise<CourseEditTabsPage> {
    const edit = new CourseEditTabsPage(page);
    await edit.gotoEdit(data.courseId, 'identification');
    await expect(edit.campoNome()).toBeVisible({ timeout: 20_000 });
    return edit;
  }

  test('TC6 — Validar tooltip da section "Configurações de IA"', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC6 — Tooltip da section de IA');
    await allure.severity('normal');

    const edit = await abrir(page);
    await allure.step('2. Hover no ícone de info da section de IA — tooltip literal', async () => {
      // section literal "Configurações de IA" não existe (campos IA estão em
      // "Público"); procura ícone de info junto ao heading "Público" como
      // equivalente — se nada, registra ausência.
      const secoes = await edit.cabecalhosDeSecao();
      expect.soft(secoes, 'AT: section "Configurações de IA"').toContain('Configurações de IA');
      const info = page.locator('h2:has-text("Público") ~ * svg, h2:has-text("Público") svg, [data-test-id*="publico"] svg').first();
      const temIcone = await info.isVisible().catch(() => false);
      if (temIcone) {
        await info.hover();
        await expect.soft(page.getByText(data.tooltipIa).first(), 'tooltip literal da AT').toBeVisible({ timeout: 5_000 });
      } else {
        expect.soft(temIcone, 'ícone de info da section de IA existe').toBe(true);
      }
    });
  });

  test('TC7 — Validar campos existentes preservados', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC7 — Campos existentes preservados');
    await allure.severity('critical');

    const edit = await abrir(page);
    await edit.garantirTipoDeExperiencia();

    await allure.step('2. Campos "Nome", "Descrição", "Idioma" exibidos', async () => {
      await expect(edit.campoNome(), 'campo Nome').toBeVisible();
      await expect(page.getByText('Descrição', { exact: false }).first(), 'campo Descrição').toBeVisible();
      // recon: campo "Idioma" não existe no form atual — soft documenta
      const temIdioma = await page.getByText(/^Idioma/).first().isVisible().catch(() => false);
      expect.soft(temIdioma, 'AT: campo "Idioma" exibido (não encontrado no form)').toBe(true);
    });

    await allure.step('3-4. Editar "Nome" e Salvar — toast', async () => {
      await edit.campoNome().fill('Curso de Teste Automatizado');
      await edit.botaoSalvar().click();
      await expect(edit.toastDeSucesso()).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('cleanup — restaurar nome original', async () => {
      await edit.gotoEdit(data.courseId, 'identification');
      await edit.campoNome().fill(data.courseName);
      await edit.botaoSalvar().click();
      await expect(edit.toastDeSucesso()).toBeVisible({ timeout: 15_000 });
    });
  });

  test('TC9 — Validar copiloto isolado na aba Identificação', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC9 — Copiloto isolado na Identificação');
    await allure.severity('critical');

    await abrir(page);
    await allure.step('2. Clicar no ícone do copiloto — drawer exibido', async () => {
      // recon 2026-06-05: FAB copilot-drawer-toggle NÃO renderiza na aba
      // Identificação (só na aba do Estúdio) — funcionalidade ausente aqui.
      await expect(
        page.locator('[data-test-id="copilot-drawer-toggle"]:visible').first(),
        'ícone do copiloto disponível na aba Identificação',
      ).toBeVisible({ timeout: 10_000 });
    });
  });

  test('TC12 — Validar limites de caracteres dos novos campos', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC12 — Limites de caracteres');
    await allure.severity('normal');

    const edit = await abrir(page);
    const texto = 'x'.repeat(data.maxlength + 30);

    await allure.step('2. "Idade" não aceita além do limite (maxlength 250)', async () => {
      await edit.campoIa('age').fill(texto);
      const valor = await edit.campoIa('age').inputValue();
      expect(valor.length, 'Idade limitada ao maxlength').toBeLessThanOrEqual(data.maxlength);
      await edit.campoIa('age').fill('');
    });

    await allure.step('3. "Tom de voz" não aceita além do limite (maxlength 250)', async () => {
      await edit.campoIa('tone_of_voice').fill(texto);
      const valor = await edit.campoIa('tone_of_voice').inputValue();
      expect(valor.length, 'Tom de voz limitado ao maxlength').toBeLessThanOrEqual(data.maxlength);
      await edit.campoIa('tone_of_voice').fill('');
    });
  });

  test('TC13 — Tentar salvar a Identificação com campos obrigatórios vazios', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC13 — Validação de obrigatórios');
    await allure.severity('normal');

    const edit = await abrir(page);
    await allure.step('2-3. Limpar "Nome", Salvar — mensagem "Nome é obrigatório"', async () => {
      await edit.campoNome().fill('');
      await edit.botaoSalvar().click();
      await expect(page.getByText(/Nome é obrigatório/i).first()).toBeVisible({ timeout: 10_000 });
    });
    // sem cleanup persistente: o save foi barrado pela validação (nada salvo)
  });

  test('TC14 — Validar toast de sucesso ao salvar a Identificação', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Configurar identificação com campos para IA');
    await allure.story('TC14 — Toast de sucesso');
    await allure.severity('critical');

    const edit = await abrir(page);
    await edit.garantirTipoDeExperiencia();
    await allure.step('2-3. Obrigatórios válidos + Salvar — toast de sucesso', async () => {
      await edit.campoNome().fill(data.courseName);
      await edit.botaoSalvar().click();
      await expect(edit.toastDeSucesso()).toBeVisible({ timeout: 15_000 });
    });
  });
});
