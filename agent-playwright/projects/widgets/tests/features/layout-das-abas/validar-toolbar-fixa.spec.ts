// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

// SELETORES LIVE (2026-05-13):
// - widgets-grid-container engloba tabs-nav + actions + viewport
// - widgets-grid-actions tem add-button + view-selector + reorganize-switch
// - Rodapé position:fixed (classe css-1bvxcno) com Cancelar + Salvar Layout

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { validarToolbarFixaData as data } from './validar-toolbar-fixa.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test('Validar barra de ferramentas fixa no topo da área de layout', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Validar barra de ferramentas fixa no topo da área de layout');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    // 1. Pré-condição: criar painel + abrir aba Layouts; validar componentes da toolbar
    await step('1. Criar painel, abrir Layouts e validar componentes da toolbar', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      // Container principal e área de ações
      await expect(page.getByTestId('widgets-grid-container')).toBeVisible();
      await expect(page.getByTestId('widgets-grid-actions')).toBeVisible();

      // Toolbar header: Adicionar widget + view selector + switch reorganizar
      await expect(page.getByTestId('widgets-grid-add-button')).toBeVisible();
      await expect(page.getByTestId('widgets-grid-view-selector')).toBeVisible();
      await expect(page.getByTestId('widgets-grid-reorganize-switch')).toBeVisible();

      // Três botões de visualização
      await expect(page.getByRole('button', { name: 'Visualização: Desktop' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Visualização: Tablet' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Visualização: Mobile' })).toBeVisible();

      // Navegação de abas com "Nova aba" padrão e Adicionar aba
      await expect(page.getByTestId('tabs-navigation')).toBeVisible();
      await expect(page.getByTestId('tabs-navigation-add-button')).toBeVisible();
    });

    // 2. Verificar rodapé fixed com Cancelar e Salvar Layout habilitados
    await step('2. Verificar rodapé position:fixed com botões Cancelar e Salvar Layout habilitados', async () => {
      const saveButton = page.getByTestId('panel-layout-save-button');
      const cancelButton = page.getByTestId('panel-layout-cancel-button');

      await expect(saveButton).toBeVisible();
      await expect(saveButton).toBeEnabled();
      await expect(cancelButton).toBeVisible();
      await expect(cancelButton).toBeEnabled();

      // Confirmar position:fixed do container pai do botão Salvar Layout
      const footerPosition = await saveButton.evaluate((el) => {
        const parent = el.closest('div[class*="css-"]') as HTMLElement | null;
        return parent ? window.getComputedStyle(parent).position : '';
      });
      // Pode estar dentro de wrapper aninhado — verificar até encontrar 'fixed'
      const anyFixed = await saveButton.evaluate((el) => {
        let cur: HTMLElement | null = el as HTMLElement;
        while (cur) {
          if (window.getComputedStyle(cur).position === 'fixed') return true;
          cur = cur.parentElement;
        }
        return false;
      });
      expect(anyFixed || footerPosition === 'fixed').toBe(true);
    });
  });
});
