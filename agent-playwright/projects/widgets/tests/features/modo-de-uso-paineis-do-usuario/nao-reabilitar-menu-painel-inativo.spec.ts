// spec: projects/widgets/specs/modo-de-uso-paineis-do-usuario-plan.md
// seed: tests/seed.spec.ts

// FIXME documentado: o seed do TC3 exige inativar painel com menu vinculado.
// Em sessão automatizada (user "Claude Agents"), GET /panels/{id}/linked_menus
// retorna 500 (NoMethodError em title_for) — impede PATCH /change_status → 422.
// Fluxo manual passa (Jam 2026-05-12). Ver bug_title_for_linked_menus.md.
// Destinatário: dev de produto/backend. Quando o bug for fixado, descomentar
// o paineis.ensureInactive() abaixo e remover o test.fixme.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { dismissCommonModals } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { cleanupPanelWithMenuItem } from '../../../utils/test-cleanup.js';
import { naoReabilitarMenuPainelInativoData as data } from './nao-reabilitar-menu-painel-inativo.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Modo de uso - Painéis do usuário', () => {
  let createdPanelName: string | undefined;
  let createdItemName: string | undefined;

  // Cleanup de respaldo — roda mesmo se test crash antes do bloco final
  // de revert do step 4. Quando fixme estiver ativo, panelName fica
  // undefined e o helper vira no-op silencioso.
  test.afterAll(async ({ browser }) => {
    await cleanupPanelWithMenuItem(
      browser,
      createdPanelName,
      data.useModeId,
      createdItemName,
    );
  });

  test(
    "Não permitir reabilitar menu inativado quando 'Espaço' do 'Painel do usuário' inativo",
    async ({ page, step }) => {
      test.fixme(
        true,
        "seed ausente: TC depende de painel inativo COM menu vinculado, mas o backend dispara 500 (title_for#NoMethodError em GET /panels/{id}/linked_menus) impedindo PATCH /change_status. Bug bloqueia ensureInactive() apenas em sessão automatizada (user 'Claude Agents'); manual passa. Ver bug_title_for_linked_menus.md.",
      );

      await allure.epic('Twygo - Widgets');
      await allure.feature('Modo de uso - Painéis do usuário');
      await allure.story(
        "Não permitir reabilitar menu inativado quando 'Espaço' do 'Painel do usuário' inativo",
      );
      await allure.severity('critical');
      await allure.label('executionType', 'manual');

      const paineis = new PaineisListPage(page);
      createdPanelName = `Painel ReabTc3 ${Date.now()}`;
      createdItemName = `Item ${createdPanelName}`.slice(0, 25);
      const panelName = createdPanelName;
      const itemName = createdItemName;

      // Pré-condição (seed via UI — espelha TC4 da suite Ativar/Inativar)
      await step('1. Seed — criar painel + associar a menu + inativar menu + inativar painel', async () => {
        await paineis.createPanel({ name: panelName });
        await paineis.associatePanelToMenu(panelName, data.useModeId);
        await paineis.ensureMenuItemInactive(data.useModeId, itemName);
        await paineis.ensureInactive(panelName); // BLOQUEADO pelo bug title_for
      });

      await step('2. Acessar edição do modo de uso e localizar row do item', async () => {
        await page.goto(`/o/${getOrgId()}/use_modes/${data.useModeId}/edit?tab=items`);
        await dismissCommonModals(page);

        const row = paineis.getMenuItemRowByName(itemName);
        await expect(row).toBeVisible();
        await expect(paineis.getMenuItemActiveSwitchInput(itemName)).not.toBeChecked();
      });

      await step('3. Tentar reabilitar o menu → toast de bloqueio aparece', async () => {
        await paineis.getMenuItemActiveSwitchLabel(itemName).click();

        const toast = paineis.getPanelInactiveToast();
        await expect(toast).toBeVisible();
        await expect(toast).toContainText(data.toastMessage);

        // Switch permanece desmarcado
        await expect(paineis.getMenuItemActiveSwitchInput(itemName)).not.toBeChecked();
      });

      await step('4. Aguardar dismiss do toast e validar estado final', async () => {
        await paineis.getPanelInactiveToast().waitFor({ state: 'hidden' });
        await expect(paineis.getMenuItemActiveSwitchInput(itemName)).not.toBeChecked();
      });

      // Cleanup: ensureActive antes de disassociate pra evitar disparar o mesmo toast
      await paineis.ensureActive(panelName);
      await paineis.disassociatePanelFromMenu_safe(panelName, data.useModeId, itemName);
      await paineis.deletePanelByNameSafe(panelName);
    },
  );
});
