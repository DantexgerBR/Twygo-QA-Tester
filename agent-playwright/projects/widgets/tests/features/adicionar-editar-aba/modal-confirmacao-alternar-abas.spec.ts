// Testsuite: Adicionar/editar aba
// TC16 — Modal padrão de confirmação ao alternar abas com alterações não salvas.
// Pré-condição: painel salvo + alterações pendentes em uma das tabs (Identificação
// ou Layouts). O modal "Tem certeza que deseja sair?" dispara ao trocar entre
// as tabs principais (Identificação ↔ Layouts) sem salvar — NÃO ao alternar
// entre abas internas do Layouts (Aba A/B), que mantêm dirty preservado.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Adicionar/editar aba', () => {
  test('Modal padrão de confirmação ao alternar abas com alterações não salvas', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Adicionar/editar aba');
    await allure.story('Modal padrão de confirmação ao alternar abas com alterações não salvas');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const painelForm = new PainelFormPage(page);

    await allure.step('Pré-condição: criar painel salvo + entrar na tela de edição', async () => {
      await painelForm.goToNew();
      // createPanel já redireciona pra /panels/{id}/edit (Identificação ativa).
      await painelForm.createPanel(`Painel TC16 ${Date.now()}`);
    });

    await allure.step('Pré-condição: criar alteração não salva no Nome (estado dirty)', async () => {
      // Modificar o Nome sem clicar Salvar — marca o form como dirty.
      await painelForm.getNomeInput().fill(`Painel TC16 MODIFICADO ${Date.now()}`);
    });

    await allure.step("1. Clicar na tab 'Layouts' (sem salvar a alteração na Identificação)", async () => {
      await painelForm.getLayoutsTab().click();
    });

    await allure.step("2. Verificar que o modal 'Tem certeza que deseja sair?' é exibido", async () => {
      const modal = page.getByRole('dialog').filter({ hasText: /Tem certeza que deseja sair/i });
      await expect(modal).toBeVisible({ timeout: 5_000 });
      // Validar os 3 botões esperados (observados no screenshot 2026-05-12):
      // "Cancelar", "Sair sem salvar", "Sair e salvar".
      await expect(modal.getByRole('button', { name: 'Cancelar' })).toBeVisible();
      await expect(modal.getByRole('button', { name: 'Sair sem salvar' })).toBeVisible();
      await expect(modal.getByRole('button', { name: 'Sair e salvar' })).toBeVisible();
    });

    await allure.step("3. Clicar em 'Cancelar' — permanece na tab Identificação", async () => {
      const modal = page.getByRole('dialog').filter({ hasText: /Tem certeza que deseja sair/i });
      await modal.getByRole('button', { name: 'Cancelar' }).click();
      await expect(modal).not.toBeVisible({ timeout: 5_000 });
      await expect(painelForm.getIdentificacaoTab()).toHaveAttribute('aria-selected', 'true');
    });
  });
});
