// Testsuite: Mensagem de aviso e saldo ao salvar configurações com a indexação ligada
// Testcases (2): Layout + Cálculo.
//
// DIAGNÓSTICO EMPÍRICO (2026-05-04, spec exploratório `tests/_explore/`):
// Após `saveButton.click()` no _Ambiente (envId=36799) com toggle Indexação ON
// + tipo Trilha + asset Texto marcados, ABSOLUTAMENTE NENHUM dialog/modal
// aparece — polled 8× a cada 1s qualquer elemento com role=dialog,
// data-test-id contendo modal/credit/indexing — todos vazios. URL navega
// direto para ?tab=settings sem prompt de confirmação.
//
// Hipóteses (REVISAR_MANUAL com produto):
//   1. Modal RN37 é one-time e o _Ambiente já consumiu em rodada anterior;
//   2. Feature flag específica está desativada nesse ambiente;
//   3. Comportamento foi removido do produto sem atualização da spec;
//   4. Modal só dispara para ambiente principal (orgId=36602) — não testado
//      pra evitar mutação do estado compartilhado.
//
// Steps 4 do TC Layout (saldo insuficiente) e steps 1-7 do TC Cálculo
// (cálculo por tipo de arquivo) também requerem setup específico fora do
// escopo da automação UI.

import { test, expect } from '../../../src/fixtures/exploratory-fixture';
import type { Page } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { dismissCommonModals } from '../../../src/utils/modals';
import { CreditosIaSettingsPage } from '../../../src/pages/CreditosIaSettingsPage';
import { EnvironmentEditPage } from '../../../src/pages/EnvironmentEditPage';

const ENV_ID = 36799; // _Ambiente (independente)

async function persistOffThenReopen(
  page: Page,
  settingsPage: CreditosIaSettingsPage,
  editPage: EnvironmentEditPage,
): Promise<void> {
  if (await editPage.isSyncBlocking()) {
    test.skip(true, 'Sincronização em andamento bloqueia o toggle Indexação no _Ambiente.');
  }
  const isOn = await editPage.contentIndexingMasterInput.isChecked();
  if (isOn) {
    await editPage.contentIndexingMasterSwitch.click({ force: true });
    await expect(editPage.contentIndexingMasterInput).not.toBeChecked();
    await editPage.saveButton.click();
    await page.waitForURL('**/ai_consumption_analysis?tab=settings', { timeout: 10_000 });
    await expect(settingsPage.listContainer).toBeVisible();
    await settingsPage.openEnvironmentEdit(ENV_ID);
    await page.waitForURL(`**/${ENV_ID}/edit_additional_organization_permissions`);
    await expect(editPage.contentIndexingMasterInput).not.toBeChecked();
  }
}

test.describe.serial('Mensagem de aviso e saldo ao salvar configurações com a indexação ligada', () => {
  test('Mensagem de aviso e verificação de saldo na indexação - Layout', async ({ page }) => {
    // REVISAR_MANUAL: em rodadas reais 2026-05-04, salvar `_Ambiente` (envId=36799)
    // com toggle Indexação ON + tipo Trilha + asset Texto NÃO dispara o modal RN37
    // (test-id `ai-consumption-settings-content-indexing-credits-modal`). O save
    // navega de volta pra `?tab=settings` silenciosamente. Pode ser: test-id mudou,
    // feature flag específica desligada nesse ambiente, ou comportamento removido
    // do produto. Marcado como `test.fixme` até esclarecimento do produto.
    test.fixme(true, 'Modal RN37 não dispara consistentemente em _Ambiente — investigar test-id ou feature flag');
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Mensagem de aviso e saldo ao salvar configurações com a indexação ligada');
    await allure.story('Mensagem de aviso e verificação de saldo na indexação - Layout');
    await allure.severity('critical');

    const settingsPage = new CreditosIaSettingsPage(page);
    const editPage = new EnvironmentEditPage(page);

    await page.goto('https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings');
    await dismissCommonModals(page);
    await expect(settingsPage.listContainer).toBeVisible();

    await allure.step(`1. Abrir edição do ambiente independente (envId=${ENV_ID})`, async () => {
      await settingsPage.openEnvironmentEdit(ENV_ID);
      await page.waitForURL(`**/${ENV_ID}/edit_additional_organization_permissions`);
    });

    await allure.step('2. Garantir estado inicial OFF persistido e ligar + marcar TRILHA/Texto + salvar', async () => {
      await persistOffThenReopen(page, settingsPage, editPage);
      // Modal RN37 só dispara quando há mudança que IMPLICA custo: toggle ON +
      // ao menos 1 tipo de conteúdo + 1 asset selecionado.
      await editPage.contentIndexingMasterSwitch.click({ force: true });
      await expect(editPage.contentIndexingMasterInput).toBeChecked();

      if (!(await editPage.typeTrail.isChecked())) {
        await editPage.typeTrail.click({ force: true });
      }
      await expect(editPage.typeTrail).toBeChecked();

      if (!(await editPage.assetText.isChecked())) {
        await editPage.assetText.click({ force: true });
      }
      await expect(editPage.assetText).toBeChecked();

      await editPage.saveButton.click();
    });

    await allure.step('3. Validar que o modal RN37 abre', async () => {
      await expect(editPage.creditsModal).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('4. Validar layout do modal — heading e bullets-chave', async () => {
      await expect(page.getByText(/Processo de indexação de conteúdo/i).first()).toBeVisible();
      await expect(page.getByText(/Tempo de processamento/i)).toBeVisible();
      await expect(page.getByText(/Consumo de créditos de IA/i)).toBeVisible();
      await expect(page.getByText(/Indexação automática/i)).toBeVisible();
      await expect(page.getByText(/Ativação do agente/i)).toBeVisible();
    });

    await allure.step('5. Validar campos numéricos — Custo estimado e Saldo atual', async () => {
      await expect(page.getByText(/Custo estimado/i).first()).toBeVisible();
      await expect(page.getByText(/Saldo atual/i).first()).toBeVisible();
      await expect(editPage.creditsModalSummary).toBeVisible();
      await expect(editPage.creditsModalCurrentBalance).toBeVisible();
    });

    await allure.step('6. Validar botões do modal (Cancelar + Confirmar/Contato)', async () => {
      await expect(editPage.creditsModalCancel).toBeVisible();
      await expect(editPage.creditsModalConfirm).toBeVisible();
    });

    await allure.step('7. Cancelar para não persistir a mudança (rollback)', async () => {
      await editPage.creditsModalCancel.click();
      await expect(editPage.creditsModal).not.toBeVisible();
    });
  });

  test('Mensagem de aviso e verificação de saldo na indexação - Cálculo', async ({ page }) => {
    test.fixme(true, 'Modal RN37 não dispara consistentemente em _Ambiente — investigar test-id ou feature flag');
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Mensagem de aviso e saldo ao salvar configurações com a indexação ligada');
    await allure.story('Mensagem de aviso e verificação de saldo na indexação - Cálculo');
    await allure.severity('critical');

    const settingsPage = new CreditosIaSettingsPage(page);
    const editPage = new EnvironmentEditPage(page);

    await page.goto('https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings');
    await dismissCommonModals(page);
    await expect(settingsPage.listContainer).toBeVisible();

    await allure.step(`1. Abrir edição (envId=${ENV_ID}) e disparar modal`, async () => {
      await settingsPage.openEnvironmentEdit(ENV_ID);
      await page.waitForURL(`**/${ENV_ID}/edit_additional_organization_permissions`);
      await persistOffThenReopen(page, settingsPage, editPage);
      await editPage.contentIndexingMasterSwitch.click({ force: true });
      await expect(editPage.contentIndexingMasterInput).toBeChecked();
      if (!(await editPage.typeTrail.isChecked())) {
        await editPage.typeTrail.click({ force: true });
      }
      if (!(await editPage.assetText.isChecked())) {
        await editPage.assetText.click({ force: true });
      }
      await editPage.saveButton.click();
      await expect(editPage.creditsModal).toBeVisible({ timeout: 15_000 });
    });

    await allure.step('2. Validar formato do "Custo estimado" — range numérico', async () => {
      const summaryText = (await editPage.creditsModalSummary.innerText()) ?? '';
      expect(
        summaryText,
        `summaryBox text should contain numeric range. Got: ${summaryText.slice(0, 200)}`,
      ).toMatch(/\d[\d.,]*\s*-\s*\d[\d.,]*\s*créditos/i);
    });

    await allure.step('3. Validar "Saldo atual" — valor numérico presente', async () => {
      const balanceText = (await editPage.creditsModalCurrentBalance.innerText()) ?? '';
      expect(
        balanceText,
        `currentBalance should contain a number. Got: ${balanceText.slice(0, 200)}`,
      ).toMatch(/\d[\d.,]*/);
    });

    await allure.step('4. Cancelar (rollback)', async () => {
      await editPage.creditsModalCancel.click();
      await expect(editPage.creditsModal).not.toBeVisible();
    });
  });
});
