// spec: specs/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-curso-periodo.plan.md
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

test.describe('Configurar a utilização do indexação de conteúdo por ambiente', () => {
  test('Configurar a indexação - CURSO Período', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Configurar a utilização do indexação de conteúdo por ambiente');
    await allure.story('Configurar a indexação - CURSO Período');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    // REVISAR: validações via chat IA do aluno e comportamento de backend são fora do escopo desta suite UI
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

        await expect(page).toHaveURL(/36799\/edit_additional_organization_permissions/);
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();
      },
    );

    // ─── STEP 1: Habilitar toggle Indexação — verificar Período DESABILITADO por padrão ───
    await allure.step(
      '1. Verificar toggle Indexação de conteúdo visível e sub-toggle Período DESABILITADO (unchecked) por padrão',
      async () => {
        // Verificar toggle mestre visível
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();

        // Verificar sub-toggle Período visível e não marcado por padrão
        await expect(editPage.periodSwitch).toBeVisible();

        // O input de período tem id conhecido: ai-consumption-settings-content-indexing-specific-period
        // e a Page Object usa getByTestId — fallback: localizar pelo aria-label via role
        await expect(
          page.getByRole('checkbox', { name: 'Indexar período específico' }),
        ).toBeVisible();

        // Verificar estado do sync
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // BLOQUEIO: sync em andamento — seção de indexação aria-disabled
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // Toggle mestre está habilitado (checked) mas bloqueado pelo sync
          await expect(editPage.contentIndexingMasterInput).toBeChecked();
        } else {
          // Sem sync: verificar que master input está acessível
          await expect(editPage.contentIndexingMasterSwitch).toBeVisible();
        }

        // Período DESABILITADO por padrão (unchecked) — verificação via input id
        await expect(
          page.locator('#ai-consumption-settings-content-indexing-specific-period'),
        ).not.toBeChecked();
      },
    );

    // ─── STEP 2: Habilitar Período → verificar campos Data inicial e Data final ───
    await allure.step(
      '2. Habilitar sub-toggle Período → verificar que campos Data inicial e Data final ficam visíveis',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // REVISAR: sync em andamento bloqueia clique no toggle — sub-toggle e campos de data inacessíveis
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
        } else {
          // Garantir toggle mestre habilitado
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            if (await editPage.creditsModal.isVisible()) {
              await editPage.creditsModalConfirm.click();
              await expect(editPage.creditsModal).toBeHidden();
            }
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }

          // Habilitar sub-toggle Período
          await editPage.periodSwitch.click({ force: true });
          await expect(
            page.locator('#ai-consumption-settings-content-indexing-specific-period'),
          ).toBeChecked();

          // Campos de data devem aparecer após habilitar o período
          await expect(editPage.periodStartDate).toBeVisible();
          await expect(editPage.periodEndDate).toBeVisible();
        }
      },
    );

    // ─── STEP 3: Preencher SOMENTE Data inicial → periodLimitedAlert NÃO aparece ───
    await allure.step(
      '3. Com período habilitado: preencher SOMENTE Data inicial (sem Data final) → periodLimitedAlert NÃO deve aparecer',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // REVISAR: sync em andamento — interação com campos de data impossível
          await expect(editPage.syncAlert).toBeVisible();
        } else {
          // Garantir que período está habilitado e campos de data visíveis
          const periodChecked = await page
            .locator('#ai-consumption-settings-content-indexing-specific-period')
            .isChecked();
          if (!periodChecked) {
            await editPage.periodSwitch.click({ force: true });
            await expect(editPage.periodStartDate).toBeVisible();
          }

          // Preencher SOMENTE Data inicial
          await editPage.periodStartDate.fill('2026-01-01');

          // Garantir Data final vazia
          await editPage.periodEndDate.fill('');

          // periodLimitedAlert NÃO deve aparecer (sem data final = período aberto)
          await expect(editPage.periodLimitedAlert).not.toBeVisible();

          // periodConfirmation pode aparecer mostrando a data inicial informada
          await expect(editPage.periodConfirmation).toBeVisible();
        }
        // REVIEW_NEEDED: validação backend — indexação considera apenas conteúdos a partir da data inicial
      },
    );

    // ─── STEP 4: Preencher AMBAS as datas → periodLimitedAlert aparece + Salvar ───
    await allure.step(
      '4. Com período habilitado: preencher AMBAS as datas (start=2026-01-01, end=2026-12-31) → periodLimitedAlert visível + Salvar + confirmar modal',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // REVISAR: sync em andamento — interação com campos de data impossível
          await expect(editPage.syncAlert).toBeVisible();
        } else {
          // Garantir que período está habilitado e campos visíveis
          const periodChecked = await page
            .locator('#ai-consumption-settings-content-indexing-specific-period')
            .isChecked();
          if (!periodChecked) {
            await editPage.periodSwitch.click({ force: true });
            await expect(editPage.periodStartDate).toBeVisible();
          }

          // Preencher AMBAS as datas
          await editPage.periodStartDate.fill('2026-01-01');
          await editPage.periodEndDate.fill('2026-12-31');

          // periodLimitedAlert DEVE aparecer quando ambas as datas estão preenchidas (período fechado)
          await expect(editPage.periodLimitedAlert).toBeVisible();
          await expect(page.getByText('Atenção ao período limitado')).toBeVisible();

          // periodConfirmation deve estar visível exibindo o período com início e fim
          await expect(editPage.periodConfirmation).toBeVisible();

          // Salvar configurações
          await editPage.saveButton.click();

          // Modal RN37 deve aparecer para confirmar indexação
          await expect(editPage.creditsModal).toBeVisible();
          await editPage.creditsModalConfirm.click();
          await expect(editPage.creditsModal).toBeHidden();

          // Após save: redireciona para lista de ambientes
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          // Reabrir para próximos steps
          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
        }
      },
    );

    // ─── STEP 5: Alterar filtros/critérios — desmarcar Curso + Salvar + verificar persistência ───
    await allure.step(
      '5. Alterar filtros de tipo de conteúdo (desmarcar Curso) → Salvar → verificar persistência via reload',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // REVISAR: sync em andamento — checkboxes inacessíveis
          await expect(editPage.syncAlert).toBeVisible();
        } else {
          // Garantir toggle mestre habilitado
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            if (await editPage.creditsModal.isVisible()) {
              await editPage.creditsModalConfirm.click();
              await expect(editPage.creditsModal).toBeHidden();
            }
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }

          // Desmarcar CURSO se estiver marcado
          if (await editPage.typeCourse.isChecked()) {
            await editPage.typeCourse.click({ force: true });
            await expect(editPage.typeCourse).not.toBeChecked();
          }

          // Salvar
          await editPage.saveButton.click();
          await expect(editPage.creditsModal).toBeVisible();
          await editPage.creditsModalConfirm.click();
          await expect(editPage.creditsModal).toBeHidden();
          await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
          await expect(settingsPage.listContainer).toBeVisible();

          // ASSERÇÃO UI ALTERNATIVA: recarregar edição e verificar persistência
          await settingsPage.openEnvironmentEdit(ENV_ID);
          await page.waitForURL('**edit_additional_organization_permissions**');
          const syncBlockingAfter = await editPage.isSyncBlocking();
          if (!syncBlockingAfter) {
            // CURSO deve continuar desmarcado após save
            await expect(editPage.typeCourse).not.toBeChecked();
          } else {
            // REVISAR: sync em andamento após save impede verificar persistência via UI
            await expect(editPage.syncAlert).toBeVisible();
          }
        }
        // REVIEW_NEEDED: conteúdos que saem do escopo são INATIVADOS; ao retornar são REATIVADOS sem nova cobrança
        // — verificação não realizável 100% via UI sem acesso ao estado de indexação backend
      },
    );

    // ─── STEP 6: Ambiente HERDADO — verificar tooltip de bloqueio de edição ───
    await allure.step(
      '6. Navegar para lista de ambientes → verificar ambiente herdado (Avião, envId=36796) → asserir tooltip de bloqueio na edição',
      async () => {
        // Navegar para lista de configurações
        await page.goto(SETTINGS_PATH);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do Avião está ON (checked = herdado)
        // Avião aparece na linha "Avião edit" — inherit switch é o 3º checkbox da linha
        const aviaoRow = page.getByRole('row', { name: 'Avião edit' });
        await expect(aviaoRow).toBeVisible();

        // O switch de herança do Avião deve estar marcado (inherited)
        // Localização via CSS estrutural (fallback justificado: test-id não presente no DOM)
        await expect(
          page.locator('#td-inherit_from_primary-3 > .chakra-switch > .chakra-switch__input'),
        ).toBeChecked();

        // Hovering sobre o ícone de edição do Avião deve exibir tooltip de bloqueio
        await aviaoRow.locator('#ai-consumption-analysis-edit-icon').hover();
        await expect(
          page.getByRole('tooltip', { name: INHERITED_EDIT_BLOCK_TOOLTIP }),
        ).toBeVisible();

        // REVIEW_NEEDED: verificar via painel de IA ou API que o Avião usa conteúdos do ambiente principal
      },
    );

    // ─── STEP 7: Ambiente INDEPENDENTE — verificar abertura completa da edição ───
    await allure.step(
      '7. Navegar para lista → confirmar _Ambiente (envId=36799) independente (inheritSwitch unchecked) → abrir edição → verificar controles completos disponíveis',
      async () => {
        // Navegar de volta para lista de configurações
        await page.goto(SETTINGS_PATH);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do _Ambiente está OFF (unchecked = independente)
        await expect(settingsPage.inheritSwitch(36799)).not.toBeChecked();

        // Abrir edição do _Ambiente
        await settingsPage.openEnvironmentEdit(ENV_ID);
        await page.waitForURL('**36799/edit_additional_organization_permissions**');

        // Título deve exibir '_Ambiente'
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();

        // Botões Salvar e Cancelar devem estar visíveis
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();

        // Toggle mestre de indexação deve estar presente
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();

        // Sub-toggle Período deve estar presente
        await expect(editPage.periodSwitch).toBeVisible();

        // Verificar disponibilidade dos checkboxes de tipo e situação
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Sync bloqueando: seção visível mas aria-disabled — locators ainda presentes
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
          // Toggle habilitado: todos os checkboxes de tipo e situação devem ser visíveis e acessíveis
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

        // REVIEW_NEEDED: verificar que a IA do _Ambiente usa apenas conteúdos próprios indexados,
        // não os do ambiente principal — validação fora do escopo UI

        // Sair sem salvar
        await editPage.cancelButton.click();
        await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );
  });
});
