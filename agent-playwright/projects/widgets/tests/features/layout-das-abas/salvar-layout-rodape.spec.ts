// spec: projects/widgets/specs/layout-das-abas-plan.md
// seed: projects/widgets/tests/features/adicionar-editar-aba/criar-painel-happy-path.spec.ts

// ⚠️ BUG SERVIDOR CONFIRMADO (2026-05-13): Save Layout NÃO persiste no backend.
// Trace de rede confirmou zero POST/PATCH ao clicar o botão 'Salvar Layout'
// (somente analytics de terceiros). A causa raiz está na lógica de submit
// do componente de Layouts — o handler não dispara a chamada de API.
// Este teste DEVE FALHAR VERMELHO enquanto o bug não for corrigido.
// Sinal vermelho: após reload, o grid retorna vazio (estado não persistiu).
// Destinatário: dev de produto. Ver feedback_panel_layout_save_no_persist.md.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { cleanupPanel } from '../../../utils/test-cleanup.js';
import { salvarLayoutRodapeData as data } from './salvar-layout-rodape.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Layout das abas', () => {
  test.afterAll(async ({ browser }) => {
    await cleanupPanel(browser, data.panelName);
  });

  test('Salvar layout pela barra de rodapé', async ({ page, step }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Layout das abas');
    await allure.story('Salvar layout pela barra de rodapé');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');

    const painelForm = new PainelFormPage(page);

    await step('1. Setup — painel com 1 widget adicionado, toast limpo', async () => {
      await painelForm.goToNew();
      const panelId = await painelForm.createPanel(data.panelName);
      await painelForm.goToEdit(panelId, 'layouts');
      const sairBtn = page.getByRole('button', { name: 'Sair sem salvar' });
      if (await sairBtn.isVisible().catch(() => false)) {
        await sairBtn.click();
      }

      await painelForm.openWidgetDrawer();
      await painelForm.addWidget(data.widget);
      await painelForm.waitForToastsToClear();

      await expect(painelForm.getGridItems()).toHaveCount(1);
      await expect(page.getByTestId('panel-layout-save-button')).toBeEnabled();
    });

    await step("2. Clicar 'Salvar Layout' (force:true por causa do iframe HubSpot)", async () => {
      // iframe HubSpot intercepta pointer events na posição do botão — usar force:true
      await page.getByTestId('panel-layout-save-button').click({ force: true });

      // URL permanece em /panels/{id}/edit?tab=layouts
      await expect(page).toHaveURL(/\/panels\/\d+\/edit\?tab=layouts/);
    });

    await step('3. Recarregar página e validar persistência do layout', async () => {
      await page.reload();

      // Garantir que estamos na aba Layouts após reload
      await expect(painelForm.getLayoutsTab()).toBeVisible();

      // BUG SERVIDOR: o grid deveria conter 1 widget após persistência,
      // mas retorna VAZIO. Esta asserção é o sinal vermelho do bug.
      // Quando o bug for corrigido, o widget persistirá e o teste passará.
      await expect(painelForm.getGridItems()).toHaveCount(1);
    });
  });
});
