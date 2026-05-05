// spec: specs/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-pacote.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CreditosIaSettingsPage } from '../../../src/pages/CreditosIaSettingsPage.js';
import { EnvironmentEditPage } from '../../../src/pages/EnvironmentEditPage.js';
import { INHERITED_EDIT_BLOCK_TOOLTIP, SYNC_ALERT_TEXT } from '../../../src/utils/testIds.js';
import { getOrgId } from '../../../src/utils/environment.js';

const ORG_ID = getOrgId();
const ENV_ID = 36799;
const SETTINGS_PATH = `/o/${ORG_ID}/ai_consumption_analysis?tab=settings`;
const ENV_EDIT_PATH = `/o/${ORG_ID}/ai_consumption_analysis/${ENV_ID}/edit_additional_organization_permissions`;

test.describe('Configurar a utilização do indexação de conteúdo por ambiente', () => {
  test('Configurar a indexação - PACOTE', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Configurar a utilização do indexação de conteúdo por ambiente');
    await allure.story('Configurar a indexação - PACOTE');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    // REVISAR: validações via chat IA do aluno são fora do escopo desta suite UI
    await allure.tag('REVIEW_NEEDED');

    const settingsPage = new CreditosIaSettingsPage(page);
    const editPage = new EnvironmentEditPage(page);

    // ─── PRÉ-CONDIÇÃO: navegar para edit page (storageState global cobre auth) ───
    await allure.step(
      'Pré-condição: abrir edição do _Ambiente (envId=36799)',
      async () => {
        await page.goto(SETTINGS_PATH);
        await expect(settingsPage.listContainer).toBeVisible();

        await settingsPage.openEnvironmentEdit(ENV_ID);
        await page.waitForURL('**edit_additional_organization_permissions**');

        // Verificar pré-condições
        await expect(page).toHaveURL(/36799\/edit_additional_organization_permissions/);
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();
      },
    );

    // ─── STEP 1: Habilitar toggle Indexação + marcar PACOTE + Salvar + verificar persistência ───
    await allure.step(
      '1. Habilitar toggle Indexação + marcar checkbox PACOTE + Salvar → modal RN37 + verificar persistência',
      async () => {
        // Verificar se sync está bloqueando interação
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // REVISAR: sync em andamento bloqueia interação — typePackage disabled, não é possível marcar
        } else {
          // Habilitar toggle mestre se não estiver checked
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }

          // Marcar checkbox Pacote se ainda não estiver marcado
          if (!(await editPage.typePackage.isChecked())) {
            await editPage.typePackage.click({ force: true });
          }
          await expect(editPage.typePackage).toBeChecked();

          // Verificar que NÃO existe sub-multiselect específico de pacotes individuais
          // Confirmado pelo planner: único multiselect disponível é o de Exceções
          // REVISAR: se futura sprint adicionar sub-multiselect de pacotes com data-test-id próprio, mapear em testIds.ts
          await expect(editPage.exceptionsMultiselect).toBeVisible();

          // Clicar no botão Salvar
          await editPage.saveButton.click();

          // Modal RN37 só aparece se houve mudança efetiva (estado pre-teste vs pós).
          // Se Pacote já estava marcado, save não dispara modal — apenas navega.
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editPage.creditsModalConfirm.click();
            await expect(editPage.creditsModal).toBeHidden();
          }

          // Verificar persistência: recarregar a página e confirmar que Pacote ainda está checked
          await page.goto(ENV_EDIT_PATH);
          await page.waitForURL('**edit_additional_organization_permissions**');

          const syncBlockingAfter = await editPage.isSyncBlocking();
          if (syncBlockingAfter) {
            // REVISAR: sync em andamento após save impede verificar persistência via UI
            await expect(editPage.syncAlert).toBeVisible();
          } else {
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
            await expect(editPage.typePackage).toBeChecked();
          }
        }
        // REVIEW_NEEDED: validação semântica "considera todos os pacotes e conteúdos vinculados
        // (cursos/trilhas dentro)" requer validação de IA fim-a-fim e não pode ser automatizada
        // somente via UI
      },
    );

    // ─── STEP 2: Ambiente herdado (Avião, envId=36796) ───
    await allure.step(
      '2. Acessar ambiente herdado (Avião, envId=36796): herança bloqueia edição independente + tooltip visível',
      async () => {
        // Navegar para a lista de ambientes
        await page.goto(SETTINGS_PATH);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do Avião está ON (checked)
        await expect(settingsPage.inheritSwitch(36796)).toBeChecked();

        // Fazer hover no ícone de edição do ambiente herdado (Avião)
        await page.getByRole('row', { name: 'Avião edit' }).locator('#ai-consumption-analysis-edit-icon').hover();

        // Verificar tooltip de bloqueio por herança
        await expect(
          page.getByRole('tooltip', { name: INHERITED_EDIT_BLOCK_TOOLTIP }),
        ).toBeVisible();

        // REVIEW_NEEDED: verificação de que os recursos de IA do ambiente Avião estão usando
        // os conteúdos (pacotes) corretamente requer teste funcional no chat IA do aluno —
        // fora do escopo Admin UI.
      },
    );

    // ─── STEP 3: Ambiente independente (_Ambiente, envId=36799) ───
    await allure.step(
      '3. Acessar ambiente independente (_Ambiente, envId=36799): permite edição e navega para edit page',
      async () => {
        // Verificar que o switch de herança do _Ambiente está unchecked (ambiente independente)
        await expect(settingsPage.inheritSwitch(36799)).not.toBeChecked();

        // Clicar no botão de edição do _Ambiente — verificar que navega corretamente
        await settingsPage.openEnvironmentEdit(ENV_ID);
        await page.waitForURL(
          '**/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions',
        );

        // Verificar heading e controles da página de edição
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();

        // REVIEW_NEEDED: verificação de que os recursos de IA do ambiente _Ambiente NÃO herdam
        // configurações do principal (especialmente em relação a Pacotes) requer teste funcional
        // no chat IA do aluno — fora do escopo Admin UI.
      },
    );
  });
});
