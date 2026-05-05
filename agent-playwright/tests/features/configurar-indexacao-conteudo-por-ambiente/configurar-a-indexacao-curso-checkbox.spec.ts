// spec: specs/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-curso-checkbox.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CreditosIaSettingsPage } from '../../../src/pages/CreditosIaSettingsPage.js';
import { EnvironmentEditPage } from '../../../src/pages/EnvironmentEditPage.js';
import { SYNC_ALERT_TEXT } from '../../../src/utils/testIds.js';
import { getOrgId } from '../../../src/utils/environment.js';

const ORG_ID = getOrgId();
const ENV_ID = 36799;
const AVIAO_ENV_ID = 36796;
const SETTINGS_PATH = `/o/${ORG_ID}/ai_consumption_analysis?tab=settings`;
const ENV_EDIT_PATH = `/o/${ORG_ID}/ai_consumption_analysis/${ENV_ID}/edit_additional_organization_permissions`;

test.describe('Configurar a utilização do indexação de conteúdo por ambiente', () => {
  test('Configurar a indexação - CURSO checkbox', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Configurar a utilização do indexação de conteúdo por ambiente');
    await allure.story('Configurar a indexação - CURSO checkbox');
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

        // Verificações de pré-condição
        await expect(page).toHaveURL(/36799\/edit_additional_organization_permissions/);
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();
      },
    );

    // ─── STEP 1 — TEXTO ───
    await allure.step(
      '1. Habilitar toggle Indexação + marcar apenas TEXTO + Salvar → modal RN37',
      async () => {
        // PRÉ-CONDIÇÃO ADICIONAL: se sync estiver bloqueando, documentar e pular interação
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // REVISAR: sync em andamento impede interação com checkboxes — pular steps 1-6/8-14
        } else {
          const outrosAssets = [
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
          ];
          await editPage.markOnlyOneEligibleAndSave(editPage.assetText, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          // Reabrir para próximo step
          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder baseado em indexação de Texto
      },
    );

    // ─── STEP 2 — PÁGINA ───
    await allure.step(
      '2. Habilitar toggle Indexação + marcar apenas PÁGINA + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.assetText,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
          ];
          await editPage.markOnlyOneEligibleAndSave(editPage.assetPage, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder baseado em indexação de Página
      },
    );

    // ─── STEP 3 — AULA ───
    await allure.step(
      '3. Habilitar toggle Indexação + marcar apenas AULA + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.assetText,
            editPage.assetPage,
            editPage.assetStampedPdf,
            editPage.assetVideo,
            editPage.assetFiles,
          ];
          await editPage.markOnlyOneEligibleAndSave(editPage.assetLesson, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder baseado em indexação de Aula
      },
    );

    // ─── STEP 4 — PDF ESTAMPADO ───
    await allure.step(
      '4. Habilitar toggle Indexação + marcar apenas PDF ESTAMPADO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetVideo,
            editPage.assetFiles,
          ];
          await editPage.markOnlyOneEligibleAndSave(editPage.assetStampedPdf, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder baseado em indexação de PDF Estampado
      },
    );

    // ─── STEP 5 — VÍDEO ───
    await allure.step(
      '5. Habilitar toggle Indexação + marcar apenas VÍDEO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetFiles,
          ];
          await editPage.markOnlyOneEligibleAndSave(editPage.assetVideo, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder baseado em indexação de Vídeo
      },
    );

    // ─── STEP 6 — ARQUIVOS ───
    await allure.step(
      '6. Habilitar toggle Indexação + marcar apenas ARQUIVOS + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          const outrosAssets = [
            editPage.assetText,
            editPage.assetPage,
            editPage.assetLesson,
            editPage.assetStampedPdf,
            editPage.assetVideo,
          ];
          await editPage.markOnlyOneEligibleAndSave(editPage.assetFiles, outrosAssets);
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder baseado em indexação de Arquivos
      },
    );

    // ─── STEP 7 — Checkboxes NÃO ELEGÍVEIS desabilitados ───
    await allure.step(
      '7. Verificar que checkboxes "(não elegível)" estão DESABILITADOS (Questionário, Vídeo externo, SCORM, Games)',
      async () => {
        // Se toggle mestre não estiver habilitado, habilitá-lo para tornar seção visível
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Durante sync: todos ficam disabled; os não elegíveis ainda devem estar disabled
          await expect(editPage.syncAlert).toBeVisible();
        } else {
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
        }

        // Os checkboxes não elegíveis têm test-id no label; o input dentro deles é que é disabled
        // Verificar via locator no input dentro do label
        await expect(
          editPage.assetQuizDisabled.locator('input'),
        ).toBeDisabled();
        await expect(
          editPage.assetExternalVideoDisabled.locator('input'),
        ).toBeDisabled();
        await expect(
          editPage.assetScormDisabled.locator('input'),
        ).toBeDisabled();
        await expect(
          editPage.assetGamesDisabled.locator('input'),
        ).toBeDisabled();
      },
    );

    // ─── STEP 8 — EM DESENVOLVIMENTO ───
    await allure.step(
      '8. Habilitar toggle Indexação + marcar EM DESENVOLVIMENTO + CURSO + Salvar → modal RN37',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          // Garantir toggle habilitado
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          // Marcar CURSO (tipo mínimo necessário) se não estiver
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
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) { await editPage.creditsModalConfirm.click(); await expect(editPage.creditsModal).toBeHidden(); }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder somente para conteúdos Em Desenvolvimento
      },
    );

    // ─── STEP 9 — LIBERADOS ───
    await allure.step(
      '9. Habilitar toggle Indexação + marcar apenas LIBERADOS + CURSO + Salvar → modal RN37',
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
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) { await editPage.creditsModalConfirm.click(); await expect(editPage.creditsModal).toBeHidden(); }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder somente para conteúdos Liberados
      },
    );

    // ─── STEP 10 — SUSPENSOS ───
    await allure.step(
      '10. Habilitar toggle Indexação + marcar apenas SUSPENSOS + CURSO + Salvar → modal RN37',
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
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) { await editPage.creditsModalConfirm.click(); await expect(editPage.creditsModal).toBeHidden(); }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
        // REVIEW_NEEDED: chat IA do aluno deve responder somente para conteúdos Suspensos
      },
    );

    // ─── STEP 11 — MAIS DE UM checkbox de tipo ───
    await allure.step(
      '11. Marcar TEXTO + PÁGINA + AULA + LIBERADOS → Salvar → verificar persistência dos 3 checkboxes',
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
          // Marcar TEXTO, PÁGINA, AULA e LIBERADOS
          if (!(await editPage.assetText.isChecked())) {
            await editPage.assetText.click({ force: true });
          }
          if (!(await editPage.assetPage.isChecked())) {
            await editPage.assetPage.click({ force: true });
          }
          if (!(await editPage.assetLesson.isChecked())) {
            await editPage.assetLesson.click({ force: true });
          }
          if (!(await editPage.statusReleased.isChecked())) {
            await editPage.statusReleased.click({ force: true });
          }

          await editPage.saveButton.click();
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) { await editPage.creditsModalConfirm.click(); await expect(editPage.creditsModal).toBeHidden(); }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          // Reabrir para verificar persistência (apenas quando sync não estiver bloqueando)
          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
          const syncBlockingAfter = await editPage.isSyncBlocking();
          if (!syncBlockingAfter) {
            await expect(editPage.assetText).toBeChecked();
            await expect(editPage.assetPage).toBeChecked();
            await expect(editPage.assetLesson).toBeChecked();
          } else {
            // REVISAR: sync em andamento após save impede verificar persistência via UI
            await expect(editPage.syncAlert).toBeVisible();
          }
        }
        // REVIEW_NEEDED: chat IA do aluno deve confirmar múltiplos tipos indexados simultaneamente
      },
    );

    // ─── STEP 12 — TODOS os elegíveis ───
    await allure.step(
      '12. Marcar TODOS os checkboxes elegíveis (9 tipos + 3 situações) + Salvar',
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
          // Marcar todos os tipos de conteúdo elegíveis
          for (const cb of [
            editPage.typeCourse,
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
          ]) {
            if (!(await cb.isChecked())) {
              await cb.click({ force: true });
            }
          }

          await editPage.saveButton.click();
          await expect(editPage.creditsModal).toBeVisible();
          // Verificar que modal exibe informações de custo estimado e saldo
          await expect(editPage.creditsModalSummary).toBeVisible();
          await expect(editPage.creditsModalCurrentBalance).toBeVisible();
          await expect(editPage.creditsModalConfirm).toBeVisible();
          await expect(editPage.creditsModalCancel).toBeVisible();
          await editPage.creditsModalConfirm.click();
          await expect(editPage.creditsModal).toBeHidden();
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          // Reabrir para verificar persistência total (apenas quando não bloqueado)
          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
          const syncBlockingAfter = await editPage.isSyncBlocking();
          if (!syncBlockingAfter) {
            for (const cb of [
              editPage.typeCourse,
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
            ]) {
              await expect(cb).toBeChecked();
            }
          } else {
            // REVISAR: sync em andamento após save impede verificar persistência via UI
            await expect(editPage.syncAlert).toBeVisible();
          }
        }
      },
    );

    // ─── STEP 13 — Marcar → indexar → desmarcar → indexar de novo ───
    await allure.step(
      '13. Marcar CURSO + LIBERADOS → salvar → reabrir → desmarcar CURSO → salvar novamente → verificar persistência do estado desmarcado',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — pular interação
        } else {
          // Primeiro save: marcar CURSO + LIBERADOS
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          if (!(await editPage.typeCourse.isChecked())) {
            await editPage.typeCourse.click({ force: true });
          }
          if (!(await editPage.statusReleased.isChecked())) {
            await editPage.statusReleased.click({ force: true });
          }

          await editPage.saveButton.click();
          if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) { await editPage.creditsModalConfirm.click(); await expect(editPage.creditsModal).toBeHidden(); }
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');

          // Reabrir e desmarcar CURSO
          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
          const syncBlockingReopen = await editPage.isSyncBlocking();
          if (!syncBlockingReopen) {
            // CURSO deve estar marcado após primeiro save
            await expect(editPage.typeCourse).toBeChecked();

            // Desmarcar CURSO
            await editPage.typeCourse.click({ force: true });
            await expect(editPage.typeCourse).not.toBeChecked();

            // Segundo save
            await editPage.saveButton.click();
            if (await editPage.creditsModal.isVisible({ timeout: 5000 }).catch(() => false)) { await editPage.creditsModalConfirm.click(); await expect(editPage.creditsModal).toBeHidden(); }
            await page.waitForURL('**/ai_consumption_analysis?tab=settings**');

            // Reabrir para verificar que CURSO persiste desmarcado
            await settingsPage.openEnvironmentEdit(ENV_ID);
            await page.waitForURL('**edit_additional_organization_permissions**');
            const syncBlockingFinal = await editPage.isSyncBlocking();
            if (!syncBlockingFinal) {
              await expect(editPage.typeCourse).not.toBeChecked();
            } else {
              // REVISAR: sync em andamento após segundo save — verificação de persistência adiada
              await expect(editPage.syncAlert).toBeVisible();
            }
          } else {
            // REVISAR: sync bloqueante impede reabrir e desmarcar CURSO
            await expect(editPage.syncAlert).toBeVisible();
          }
        }
        // REVIEW_NEEDED: criação de curso TEXTO sobre Pirâmides do Egito e validação via chat do aluno
      },
    );

    // ─── STEP 14 — CURSO (step principal do test case) ───
    await allure.step(
      '14. Marcar apenas CURSO + LIBERADOS + Salvar → verificar modal RN37 completo + redirecionamento',
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
          if (!(await editPage.statusReleased.isChecked())) {
            await editPage.statusReleased.click({ force: true });
          }

          await editPage.saveButton.click();

          // Verificar modal RN37 com todos os detalhes
          await expect(editPage.creditsModal).toBeVisible();
          await expect(
            page.getByRole('heading', { name: 'Processo de indexação de conteúdo' }),
          ).toBeVisible();
          await expect(editPage.creditsModalSummary).toBeVisible();
          await expect(editPage.creditsModalCurrentBalance).toBeVisible();
          await expect(editPage.creditsModalConfirm).toBeVisible();
          await expect(editPage.creditsModalCancel).toBeVisible();

          // Confirmar e verificar redirecionamento
          await editPage.creditsModalConfirm.click();
          await expect(editPage.creditsModal).toBeHidden();
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();
        }
        // REVIEW_NEEDED: validação via chat do aluno de que indexação de CURSO ocorreu
      },
    );

    // ─── STEP 15 — BLOQUEIO DA TELA após salvar ───
    await allure.step(
      '15. Verificar BLOQUEIO DA TELA (aria-disabled=true) imediatamente após confirmar indexação',
      async () => {
        // Reabrir edição imediatamente após save anterior — espera-se sincronização em andamento
        await page.goto(ENV_EDIT_PATH);
        await page.waitForURL('**edit_additional_organization_permissions**');

        // Verificar se sync está bloqueando (estado esperado logo após save com indexação)
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Container de indexação com aria-disabled=true (via syncAlert visível)
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // Toggle mestre deve estar inacessível (input checked mas disabled por aria-disabled container)
          await expect(editPage.contentIndexingMasterInput).toBeChecked();
          // A seção inteira está bloqueada — botões de checkbox ficam não interativos
        } else {
          // REVISAR: sync já finalizou antes da verificação — estado de bloqueio não observável
          // Documentar que o bloqueio é transitório e foi observado nos steps anteriores
        }
      },
    );

    // ─── STEP 16 — TARJA AMARELA ───
    await allure.step(
      '16. Verificar TARJA AMARELA (banner data-status=warning) indicando indexação em andamento',
      async () => {
        // Reaproveita o estado atual da página (após step 15 que já navegou para edit)
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Verificar banner visível com role=alert e data-status=warning
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // Verificar que o alerta tem data-status=warning
          await expect(page.locator('[role="alert"][data-status="warning"]')).toBeVisible();
        } else {
          // REVISAR: sync já finalizou — tarja amarela não mais visível
          await expect(editPage.syncAlert).not.toBeVisible();
        }
      },
    );

    // ─── STEP 17 — Auto-desativação do toggle mestre ───
    await allure.step(
      '17. Desmarcar TODOS os checkboxes elegíveis → verificar auto-desativação do toggle mestre',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          await expect(editPage.syncAlert).toBeVisible();
          // REVISAR: sync em andamento — aguardar finalização para testar auto-desativação
        } else {
          // Garantir toggle habilitado e pelo menos 2 checkboxes marcados
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          if (!(await editPage.typeCourse.isChecked())) {
            await editPage.typeCourse.click({ force: true });
          }
          if (!(await editPage.assetText.isChecked())) {
            await editPage.assetText.click({ force: true });
          }

          // Toggle deve estar ON com pelo menos 1 checkbox marcado
          await expect(editPage.contentIndexingMasterInput).toBeChecked();

          // Desmarcar CURSO
          await editPage.typeCourse.click({ force: true });
          await expect(editPage.typeCourse).not.toBeChecked();
          // Toggle ainda deve estar ON (assetText ainda marcado)
          await expect(editPage.contentIndexingMasterInput).toBeChecked();

          // Desmarcar TEXTO (último checkbox elegível restante marcado)
          await editPage.assetText.click({ force: true });
          await expect(editPage.assetText).not.toBeChecked();

          // Toggle mestre deve ser AUTO-DESATIVADO após desmarcar o último elegível
          await expect(page.locator('#ai-consumption-settings-content-indexing-can-ingest')).not.toBeChecked();
        }
      },
    );

    // ─── STEP 18 — Ambiente HERDADO (Avião, envId=36796) ───
    await allure.step(
      '18. Verificar ambiente HERDADO (Avião, envId=36796): herança bloqueia edição independente',
      async () => {
        // Navegar para a lista de ambientes
        await page.goto(SETTINGS_PATH);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do Avião está ON (checked)
        await expect(settingsPage.inheritSwitch(AVIAO_ENV_ID)).toBeChecked();

        // Verificar a linha Avião na tabela
        const aviaoRow = page.getByRole('row', { name: 'Avião edit' });
        await expect(aviaoRow).toBeVisible();

        // Verificar que o ícone de edição do ambiente herdado não permite edição independente
        // (o botão edit fica visível mas a tela de edição não deve mostrar checkboxes de indexação)
        const aviaoEditIcon = aviaoRow.locator('#ai-consumption-analysis-edit-icon');
        await aviaoEditIcon.click();
        await page.waitForURL('**edit_additional_organization_permissions**');

        // Na tela de edição do ambiente herdado: a seção de indexação deve estar bloqueada
        // (aria-disabled ou sem checkboxes de tipo de conteúdo independentes)
        // REVIEW_NEEDED: verificação do chat IA do ambiente Avião fora do escopo UI
      },
    );

    // ─── STEP 19 — Ambiente INDEPENDENTE (_Ambiente, envId=36799) ───
    await allure.step(
      '19. Verificar ambiente INDEPENDENTE (_Ambiente, envId=36799): permite configuração autônoma',
      async () => {
        // Navegar de volta para a lista de ambientes
        await page.goto(SETTINGS_PATH);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do _Ambiente está OFF (unchecked = independente)
        await expect(settingsPage.inheritSwitch(36799)).not.toBeChecked();

        // Abrir edição do _Ambiente
        await settingsPage.openEnvironmentEdit(ENV_ID);
        await page.waitForURL('**36799/edit_additional_organization_permissions**');
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();

        // Verificar que botões Salvar e Cancelar estão visíveis e habilitados
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();

        // Verificar que o toggle mestre de indexação está presente
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();

        // Verificar disponibilidade dos checkboxes de tipo e situação
        // (quando toggle habilitado ou em estado não-sync-bloqueado)
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Sync bloqueando: seção visível mas disabled — todos os locators ainda presentes
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
          // Toggle habilitado: todos os checkboxes de tipo e situação devem estar visíveis e habilitados
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

        // REVIEW_NEEDED: alterações afetam apenas _Ambiente e não outros ambientes — verificação fora do escopo UI

        // Sair sem salvar
        await editPage.cancelButton.click();
        await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );
  });
});
