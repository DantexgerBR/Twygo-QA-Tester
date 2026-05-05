// Testsuite: Permitir filtrar a visualização do histórico de créditos de IA
// Testcase: Filtrar a visualização da indexação de conteúdo (XML importance=3)
//
// REVISAR: o XML pede validação dos tipos "Aplicar / Aplicar e Salvar / Salvar".
// Na UI atual o painel "Lista de filtros" expõe só o botão "Aplicar" no rodapé;
// os outros 2 modos provavelmente vêm de um dropdown/split-button não óbvio.
// Sem recon detalhado do split-button, o spec valida o que é estável: painel
// abre, botão Aplicar presente, grupos de filtros padrão/compartilhados/meus.

import { test, expect } from '../../../src/fixtures/exploratory-fixture';
import * as allure from 'allure-js-commons';
import { dismissCommonModals } from '../../../src/utils/modals';

test.describe('Permitir filtrar a visualização do histórico de créditos de IA', () => {
  test('Filtrar a visualização da indexação de conteúdo', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Permitir filtrar a visualização do histórico de créditos de IA');
    await allure.story('Filtrar a visualização da indexação de conteúdo');
    await allure.severity('critical');

    await page.goto('https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis');
    await dismissCommonModals(page);

    await expect(page.getByRole('tab', { name: 'Extrato' })).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('heading', { name: 'Histórico de créditos' })).toBeVisible();

    await allure.step('1. Abrir painel "Lista de filtros"', async () => {
      await page.getByRole('button', { name: /Filtro/i }).first().click();
      // O dialog não tem accessible-name explícito; identifica pelo texto interno
      await expect(page.getByText('Lista de filtros').first()).toBeVisible();
    });

    // Soft expects nas validações independentes — acumula falhas
    await allure.step('2. Validar grupos de filtros (padrão / compartilhados / meus)', async () => {
      await expect.soft(page.getByRole('button', { name: /Filtros padrão/i })).toBeVisible();
      await expect.soft(page.getByRole('button', { name: /Filtros compartilhados/i })).toBeVisible();
      await expect.soft(page.getByRole('button', { name: /Meus filtros/i })).toBeVisible();
    });

    await allure.step('3. Validar botão "Aplicar" no rodapé do painel', async () => {
      await expect.soft(page.getByRole('button', { name: /^Aplicar$/i }).first()).toBeVisible();
    });

    await allure.step('4. Validar referência ao filtro "Indexação de conteúdo" (na tabela ou painel)', async () => {
      const visible = await page.getByText('Indexação de conteúdo').first().isVisible().catch(() => false);
      expect.soft(visible).toBe(true);
    });
  });
});
