// Testsuite: Estúdio de Criação com tela única em três colunas (QA 1.2)
// TC3 — Validar que Estúdio substitui a aba "Atividades" antiga
// TC4 — Validar coexistência das demais abas (Identificação, Modelo, Banner, Certificado)
//
// Nota de recon (2026-06-05): a aba do Estúdio mantém o RÓTULO "Atividades"
// (test-id "tab-studio") e renderiza o shell de 3 colunas — o builder antigo
// não aparece mais. Aba "Certificado" NÃO existe nem no fluxo legado (org
// 36675) nem aqui — possível desatualização da AT (registrado como soft).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioPage } from '../../../pages/StudioPage.js';
import { estudioData as data } from './estudio-tres-colunas.shared.data.js';

test.describe('Estúdio de Criação com tela única em três colunas', () => {
  test('TC3 — Validar que Estúdio substitui a aba "Atividades" antiga', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Estúdio de Criação com tela única em três colunas');
    await allure.story('TC3 — Validar que Estúdio substitui a aba "Atividades" antiga');
    await allure.severity('critical');

    const studio = new StudioPage(page);

    await allure.step('2. Estúdio é exibido no lugar da aba "Atividades" antiga', async () => {
      await studio.gotoEdit(data.courseId);
      await studio.tab('studio').click();
      await expect(studio.shell(), 'aba renderiza o Estúdio (shell 3 colunas)').toBeVisible({ timeout: 30_000 });
    });

    await allure.step('3. Não há aba "Atividades" separada — o Estúdio ocupa essa posição', async () => {
      const rotulos = await studio.rotulosDasAbas();
      const atividades = rotulos.filter((r) => /^atividades$/i.test(r));
      expect(atividades.length, 'apenas 1 aba "Atividades" (a do Estúdio, test-id tab-studio)').toBe(1);
      // O builder legado de atividades não renderiza (sem iframe/listagem antiga)
      await expect(studio.listaAtividades()).toBeVisible();
    });
  });

  test('TC4 — Validar coexistência das demais abas (Identificação, Modelo, Banner, Certificado)', async ({ page }) => {
    await allure.epic('Twygo - Novo Estúdio de Criação');
    await allure.feature('Estúdio de Criação com tela única em três colunas');
    await allure.story('TC4 — Validar coexistência das demais abas');
    await allure.severity('critical');

    const studio = new StudioPage(page);

    await allure.step('2. Estúdio é exibido', async () => {
      await studio.gotoEstudio(data.courseId);
      await expect(studio.shell()).toBeVisible({ timeout: 30_000 });
    });

    await allure.step('3. Abas irmãs do Estúdio no menu de edição', async () => {
      await expect(studio.tab('identification'), 'aba Identificação').toBeVisible();
      await expect(studio.tab('modelo'), 'aba Modelo').toBeVisible();
      await expect(studio.tab('banner'), 'aba Banner').toBeVisible();
      // AT lista "Certificado" como aba irmã, mas ela não existe nem no fluxo
      // legado (recon org 36675, 2026-06-05) — soft pra registrar a divergência.
      const rotulos = await studio.rotulosDasAbas();
      expect.soft(rotulos, 'AT: aba "Certificado" como irmã do Estúdio').toContain('Certificado');
    });

    await allure.step('4. Clicar na aba "Identificação" — campos exibidos', async () => {
      await studio.tab('identification').click();
      await page.waitForURL(/tab=identification/, { timeout: 15_000 });
      // Recon: a seção da Identificação no edit React chama-se "Dados básicos".
      await expect(
        page.getByText(/^Dados( básicos)?$/).first(),
        'seção de dados da Identificação',
      ).toBeVisible({ timeout: 15_000 });
    });
  });
});
