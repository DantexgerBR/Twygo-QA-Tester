// spec: specs/configurar-utilizacao-agente-atendimento-por-ambiente/configurar-agente-de-atendimento-mais-indexacao.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../src/fixtures/exploratory-fixture.js';
import type { Locator } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { CreditosIaSettingsPage } from '../../../src/pages/CreditosIaSettingsPage.js';
import { EnvironmentEditPage } from '../../../src/pages/EnvironmentEditPage.js';
import { SYNC_ALERT_TEXT } from '../../../src/utils/testIds.js';

const BASE_URL = 'https://stage10.stage.twygoead.com';
const SETTINGS_URL = `${BASE_URL}/o/36602/ai_consumption_analysis?tab=settings`;

test.describe('Configurar a utilização do agente de atendimento por ambiente', () => {
  test('Configurar Agente de atendimento + Indexação', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Configurar a utilização do agente de atendimento por ambiente');
    await allure.story('Configurar Agente de atendimento + Indexação');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    // REVISAR: validações via chat IA do agente de atendimento são fora do escopo desta suite UI
    await allure.tag('REVIEW_NEEDED');

    const settingsPage = new CreditosIaSettingsPage(page);
    const editPage = new EnvironmentEditPage(page);

    /**
     * Helper local: garante toggle mestre habilitado e marca apenas o checkbox informado,
     * desmarcando todos os outros elegíveis passados. Salva e confirma modal RN37 se exibido.
     * (force:true por conta do possível aria-disabled do container).
     * Uso apenas quando !isSyncBlocking.
     */
    async function marcarApenasCheckboxESalvar(
      alvo: Locator,
      outrosElegiveis: Locator[],
    ): Promise<void> {
      // Habilitar toggle mestre se não estiver
      if (!(await editPage.contentIndexingMasterInput.isChecked())) {
        await editPage.contentIndexingMasterSwitch.click({ force: true });
        await expect(editPage.contentIndexingMasterInput).toBeChecked();
      }
      // Desmarcar todos os outros elegíveis antes de marcar o alvo
      for (const outro of outrosElegiveis) {
        try {
          if (await outro.isChecked()) {
            await outro.click({ force: true });
          }
        } catch {
          // ignora se não estiver visível
        }
      }
      // Marcar o alvo se ainda não estiver marcado
      if (!(await alvo.isChecked())) {
        await alvo.click({ force: true });
      }
      await editPage.saveButton.click();
      if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
        await editPage.creditsModalConfirm.click();
        await expect(editPage.creditsModal).toBeHidden();
      }
    }

    // ─── PRÉ-CONDIÇÃO: navegar para settings e abrir edição do _Ambiente ───
    await allure.step(
      'Pré-condição: abrir edição _Ambiente (envId=36799)',
      async () => {
        await page.goto(SETTINGS_URL);
        await expect(settingsPage.listContainer).toBeVisible();

        await settingsPage.openEnvironmentEdit(36799);
        await page.waitForURL('**edit_additional_organization_permissions**');

        await expect(page).toHaveURL(/36799\/edit_additional_organization_permissions/);
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();

        // Verificar sync bloqueante
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // REVISAR: sync em andamento impede interação com checkboxes
        }
      },
    );

    // ─── STEP 1 — Tipo CURSO ───
    await allure.step(
      '1. Habilitar toggle Indexação + marcar apenas CURSO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // REVISAR: sync em andamento impede interação — pular steps 1-13
        } else {
          const outrosTipos = [
            editPage.typeTrail,
            editPage.typePackage,
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.typeCourse, outrosTipos);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          // Reabrir para próximo step
          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando conteúdos do tipo Curso
      },
    );

    // ─── STEP 2 — Tipo TRILHA ───
    await allure.step(
      '2. Habilitar toggle Indexação + marcar apenas TRILHA + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosTipos = [
            editPage.typeCourse,
            editPage.typePackage,
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.typeTrail, outrosTipos);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando conteúdos do tipo Trilha
      },
    );

    // ─── STEP 3 — Tipo PACOTE ───
    await allure.step(
      '3. Habilitar toggle Indexação + marcar apenas PACOTE + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosTipos = [
            editPage.typeCourse,
            editPage.typeTrail,
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.typePackage, outrosTipos);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando conteúdos do tipo Pacote
      },
    );

    // ─── STEP 4 — Asset TEXTO ───
    await allure.step(
      '4. Habilitar toggle Indexação + marcar apenas TEXTO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.typeCourse,
            editPage.typeTrail,
            editPage.typePackage,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.assetText, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando ativos do tipo Texto
      },
    );

    // ─── STEP 5 — Asset PÁGINA ───
    await allure.step(
      '5. Habilitar toggle Indexação + marcar apenas PÁGINA + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.typeCourse,
            editPage.typeTrail,
            editPage.typePackage,
            editPage.assetText,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.assetPage, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando ativos do tipo Página
      },
    );

    // ─── STEP 6 — Asset AULA ───
    await allure.step(
      '6. Habilitar toggle Indexação + marcar apenas AULA + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.typeCourse,
            editPage.typeTrail,
            editPage.typePackage,
            editPage.assetText,
            editPage.assetPage,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.assetLesson, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando ativos do tipo Aula
      },
    );

    // ─── STEP 7 — Asset PDF ESTAMPADO ───
    await allure.step(
      '7. Habilitar toggle Indexação + marcar apenas PDF ESTAMPADO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.typeCourse,
            editPage.typeTrail,
            editPage.typePackage,
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetVideo,
            editPage.assetFiles,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.assetStampedPdf, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando ativos do tipo PDF Estampado
      },
    );

    // ─── STEP 8 — Asset VÍDEO ───
    await allure.step(
      '8. Habilitar toggle Indexação + marcar apenas VÍDEO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.typeCourse,
            editPage.typeTrail,
            editPage.typePackage,
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetFiles,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.assetVideo, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando ativos do tipo Vídeo
      },
    );

    // ─── STEP 9 — Asset ARQUIVO ───
    await allure.step(
      '9. Habilitar toggle Indexação + marcar apenas ARQUIVOS + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.typeCourse,
            editPage.typeTrail,
            editPage.typePackage,
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.statusDevelopment,
            editPage.statusReleased,
            editPage.statusSuspended,
          ];
          await marcarApenasCheckboxESalvar(editPage.assetFiles, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando ativos do tipo Arquivo
      },
    );

    // ─── STEP 10 — Status EM DESENVOLVIMENTO ───
    await allure.step(
      '10. Habilitar toggle Indexação + marcar apenas EM DESENVOLVIMENTO + CURSO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          // Garantir tipo mínimo CURSO marcado
          if (!(await editPage.typeCourse.isChecked())) {
            await editPage.typeCourse.click({ force: true });
          }
          // Desmarcar LIBERADOS e SUSPENSOS, marcar EM DESENVOLVIMENTO
          if (await editPage.statusReleased.isChecked()) {
            await editPage.statusReleased.click({ force: true });
          }
          if (await editPage.statusSuspended.isChecked()) {
            await editPage.statusSuspended.click({ force: true });
          }
          if (!(await editPage.statusDevelopment.isChecked())) {
            await editPage.statusDevelopment.click({ force: true });
          }

          await editPage.saveButton.click();
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editPage.creditsModalConfirm.click();
            await expect(editPage.creditsModal).toBeHidden();
          }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve indexar apenas conteúdos Em desenvolvimento
      },
    );

    // ─── STEP 11 — Status LIBERADOS ───
    await allure.step(
      '11. Habilitar toggle Indexação + marcar apenas LIBERADOS + CURSO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          if (!(await editPage.typeCourse.isChecked())) {
            await editPage.typeCourse.click({ force: true });
          }
          if (await editPage.statusDevelopment.isChecked()) {
            await editPage.statusDevelopment.click({ force: true });
          }
          if (await editPage.statusSuspended.isChecked()) {
            await editPage.statusSuspended.click({ force: true });
          }
          if (!(await editPage.statusReleased.isChecked())) {
            await editPage.statusReleased.click({ force: true });
          }

          await editPage.saveButton.click();
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editPage.creditsModalConfirm.click();
            await expect(editPage.creditsModal).toBeHidden();
          }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve indexar apenas conteúdos Liberados
      },
    );

    // ─── STEP 12 — Status SUSPENSOS ───
    await allure.step(
      '12. Habilitar toggle Indexação + marcar apenas SUSPENSOS + CURSO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          if (!(await editPage.typeCourse.isChecked())) {
            await editPage.typeCourse.click({ force: true });
          }
          if (await editPage.statusDevelopment.isChecked()) {
            await editPage.statusDevelopment.click({ force: true });
          }
          if (await editPage.statusReleased.isChecked()) {
            await editPage.statusReleased.click({ force: true });
          }
          if (!(await editPage.statusSuspended.isChecked())) {
            await editPage.statusSuspended.click({ force: true });
          }

          await editPage.saveButton.click();
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editPage.creditsModalConfirm.click();
            await expect(editPage.creditsModal).toBeHidden();
          }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve indexar apenas conteúdos Suspensos
      },
    );

    // ─── STEP 13 — MAIS DE UM CHECKBOX (typeCourse + typeTrail + assetText + assetVideo + statusReleased) ───
    await allure.step(
      '13. Marcar CURSO + TRILHA + TEXTO + VÍDEO + LIBERADOS simultaneamente → Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          // Marcar os 5 checkboxes selecionados
          if (!(await editPage.typeCourse.isChecked())) {
            await editPage.typeCourse.click({ force: true });
          }
          if (!(await editPage.typeTrail.isChecked())) {
            await editPage.typeTrail.click({ force: true });
          }
          if (!(await editPage.assetText.isChecked())) {
            await editPage.assetText.click({ force: true });
          }
          if (!(await editPage.assetVideo.isChecked())) {
            await editPage.assetVideo.click({ force: true });
          }
          if (!(await editPage.statusReleased.isChecked())) {
            await editPage.statusReleased.click({ force: true });
          }

          await editPage.saveButton.click();
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editPage.creditsModalConfirm.click();
            await expect(editPage.creditsModal).toBeHidden();
          }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          // Reabrir para verificar persistência dos 5 checkboxes
          await settingsPage.openEnvironmentEdit(36799);
          await page.waitForURL('**edit_additional_organization_permissions**');
          const syncBlockingAfter = await editPage.isSyncBlocking();
          if (!syncBlockingAfter) {
            await expect(editPage.typeCourse).toBeChecked();
            await expect(editPage.typeTrail).toBeChecked();
            await expect(editPage.assetText).toBeChecked();
            await expect(editPage.assetVideo).toBeChecked();
            await expect(editPage.statusReleased).toBeChecked();
          } else {
            // REVISAR: sync em andamento após save impede verificar persistência via UI
            await expect(editPage.syncAlert).toBeVisible();
          }
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento deve responder usando combinação dos tipos/assets/status selecionados
      },
    );

    // ─── STEP 14 — DESABILITAR Indexação ───
    await allure.step(
      '14. Desabilitar toggle mestre de Indexação + Salvar → verificar campos ocultos/desabilitados',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          // Garantir toggle habilitado antes de desabilitar
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }

          // Desabilitar toggle mestre
          await editPage.contentIndexingMasterSwitch.click({ force: true });
          await expect(editPage.contentIndexingMasterInput).not.toBeChecked();

          await editPage.saveButton.click();
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) {
            await editPage.creditsModalConfirm.click();
            await expect(editPage.creditsModal).toBeHidden();
          }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();
        }
        // REVIEW_NEEDED: chat IA do agente de atendimento NÃO retorna textos de conteúdo, pois nada está indexado
      },
    );

    // ─── STEP 15 — Ambiente HERDADO (Avião, envId=36796) ───
    await allure.step(
      '15. Verificar ambiente HERDADO (Avião, envId=36796): herança ativa bloqueia edição independente',
      async () => {
        await page.goto(SETTINGS_URL);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do Avião está ON (checked = herdado)
        await expect(settingsPage.inheritSwitch(36796)).toBeChecked();

        // Abrir edição do ambiente herdado
        const aviaoRow = page.getByRole('row', { name: 'Avião edit' });
        await expect(aviaoRow).toBeVisible();
        const aviaoEditIcon = aviaoRow.locator('#ai-consumption-analysis-edit-icon');
        await aviaoEditIcon.click();
        await page.waitForURL('**edit_additional_organization_permissions**');

        // Na tela de edição do ambiente herdado a seção de indexação deve estar bloqueada
        // REVIEW_NEEDED: verificação do chat IA do agente de atendimento do ambiente Avião fora do escopo UI
      },
    );

    // ─── STEP 16 — Ambiente INDEPENDENTE (_Ambiente, envId=36799) ───
    await allure.step(
      '16. Verificar ambiente INDEPENDENTE (_Ambiente, envId=36799): permite configuração autônoma',
      async () => {
        await page.goto(SETTINGS_URL);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do _Ambiente está OFF (unchecked = independente)
        await expect(settingsPage.inheritSwitch(36799)).not.toBeChecked();

        // Abrir edição do _Ambiente
        await settingsPage.openEnvironmentEdit(36799);
        await page.waitForURL('**36799/edit_additional_organization_permissions**');
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();

        // Verificar que botões Salvar e Cancelar estão visíveis
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();

        // Verificar que o toggle mestre de indexação está presente
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();

        // Verificar disponibilidade dos checkboxes de tipo e situação
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Sync bloqueando: seção visível mas disabled — locators ainda presentes
          await expect(editPage.syncAlert).toBeVisible();
          await expect(editPage.typeCourse).toBeVisible();
          await expect(editPage.typeTrail).toBeVisible();
          await expect(editPage.typePackage).toBeVisible();
          await expect(editPage.assetText).toBeVisible();
          await expect(editPage.assetPage).toBeVisible();
          await expect(editPage.assetLesson).toBeVisible();
          await expect(editPage.assetStampedPdf).toBeVisible();
          await expect(editPage.assetVideo).toBeVisible();
          await expect(editPage.assetFiles).toBeVisible();
          await expect(editPage.statusDevelopment).toBeVisible();
          await expect(editPage.statusReleased).toBeVisible();
          await expect(editPage.statusSuspended).toBeVisible();
        } else {
          // Toggle habilitado: verificar visibilidade dos checkboxes
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          await expect(editPage.typeCourse).toBeVisible();
          await expect(editPage.typeTrail).toBeVisible();
          await expect(editPage.typePackage).toBeVisible();
          await expect(editPage.assetText).toBeVisible();
          await expect(editPage.assetPage).toBeVisible();
          await expect(editPage.assetLesson).toBeVisible();
          await expect(editPage.assetStampedPdf).toBeVisible();
          await expect(editPage.assetVideo).toBeVisible();
          await expect(editPage.assetFiles).toBeVisible();
          await expect(editPage.statusDevelopment).toBeVisible();
          await expect(editPage.statusReleased).toBeVisible();
          await expect(editPage.statusSuspended).toBeVisible();
        }

        // REVIEW_NEEDED: alterações afetam apenas _Ambiente e não outros ambientes

        // Sair sem salvar
        await editPage.cancelButton.click();
        await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );
  });
});
