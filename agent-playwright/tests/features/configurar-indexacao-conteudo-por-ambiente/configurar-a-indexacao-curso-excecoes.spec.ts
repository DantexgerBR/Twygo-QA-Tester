// spec: specs/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-curso-excecoes.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CreditosIaSettingsPage } from '../../../src/pages/CreditosIaSettingsPage.js';
import { EnvironmentEditPage } from '../../../src/pages/EnvironmentEditPage.js';
import { LoginPage } from '../../../src/pages/LoginPage.js';
import { INHERITED_EDIT_BLOCK_TOOLTIP, SYNC_ALERT_TEXT } from '../../../src/utils/testIds.js';

const BASE_URL = 'https://stage10.stage.twygoead.com';
const SETTINGS_URL = `${BASE_URL}/o/36602/ai_consumption_analysis?tab=settings`;

// Texto do tooltip do campo Exceções confirmado via React fiber em 2026-04
const EXCEPTIONS_TOOLTIP_TEXT =
  'Escolha conteúdos que serão ignorados na indexação. Os conteúdos selecionados não serão indexados, mesmo que se enquadrem em algum dos critérios acima.';

test.describe('Configurar a utilização do indexação de conteúdo por ambiente', () => {
  test('Configurar a indexação - CURSO Exceções', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Configurar a utilização do indexação de conteúdo por ambiente');
    await allure.story('Configurar a indexação - CURSO Exceções');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    // REVISAR: validações via chat IA do Agente de Atendimento e comportamento de backend fora do escopo UI
    await allure.tag('REVIEW_NEEDED');

    const loginPage = new LoginPage(page);
    const settingsPage = new CreditosIaSettingsPage(page);
    const editPage = new EnvironmentEditPage(page);

    // ─── PRÉ-CONDIÇÃO: Login SuperAdmin + perfil Administrador + abrir edição do _Ambiente ───
    await allure.step(
      'Pré-condição: Login SuperAdmin + perfil Administrador + abrir edição do _Ambiente (envId=36799)',
      async () => {
        // Navegar para a tela de login
        await page.goto(`${BASE_URL}/users/login`);

        // Preencher credenciais e submeter
        await loginPage.login('evertongambeta@gmail.com', '123456');

        // Navegar para a aba Configurações de Créditos de IA
        await page.goto(SETTINGS_URL);
        await expect(settingsPage.listContainer).toBeVisible();

        // Abrir edição do _Ambiente (envId=36799)
        await settingsPage.openEnvironmentEdit(36799);
        await page.waitForURL('**36799/edit_additional_organization_permissions**');

        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();
      },
    );

    // ─── STEP 1: Verificar presença e estado do campo Exceções ───
    await allure.step(
      '1. Verificar presença e estado do campo Exceções — toggle master visível, rótulo, placeholder e tooltip',
      async () => {
        // Toggle master de indexação deve estar visível
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();

        // Rótulo do campo Exceções deve estar visível
        await expect(page.getByText('Conteúdos que não serão indexados')).toBeVisible();

        // Placeholder do multiselect (visível mesmo com sync blocking pois o campo existe no DOM)
        await expect(page.getByText('Pesquise por nome ou ID do conteúdo')).toBeVisible();

        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // BLOQUEIO: sync em andamento — seção aria-disabled
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // O campo Exceções ainda existe no DOM mas desabilitado
          await expect(editPage.exceptionsMultiselect).toBeVisible();
        } else {
          // Sem sync: campo Exceções totalmente acessível
          await expect(editPage.exceptionsMultiselect).toBeVisible();
          // Multiselect é combobox com aria-haspopup
          await expect(
            editPage.exceptionsMultiselect.locator('input[role="combobox"]'),
          ).toBeVisible();
        }

        // Verificar tooltip do campo Exceções via hover no ícone .tooltip-icon adjacente ao "Exceções"
        // CSS fallback: p.chakra-text com texto "Exceções" + .tooltip-icon (sibling) — Chakra UI não expõe data-testid aqui
        const excTooltipIcon = page.locator(
          'p.chakra-text:text-is("Exceções") + .tooltip-icon',
        );
        await expect(excTooltipIcon).toBeVisible();
        await excTooltipIcon.hover();
        // Chakra tooltip aparece em role="tooltip" após hover
        await expect(
          page.getByRole('tooltip', { name: EXCEPTIONS_TOOLTIP_TEXT }),
        ).toBeVisible();
      },
    );

    // ─── STEP 2: Interação com multiselect e seleção múltipla de exceções ───
    await allure.step(
      '2. Interação com multiselect: abrir dropdown → selecionar 2 itens → remover 1 → salvar → verificar persistência',
      async () => {
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // REVISAR: sync em andamento — multiselect desabilitado, interação impossível
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // Campo ainda visível no DOM como combobox desabilitado
          await expect(editPage.exceptionsMultiselect).toBeVisible();
        } else {
          // Garantir toggle master habilitado
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            if (await editPage.creditsModal.isVisible()) {
              await editPage.creditsModalConfirm.click();
              await expect(editPage.creditsModal).toBeHidden();
            }
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }

          // Abrir dropdown clicando no container do multiselect
          await editPage.exceptionsMultiselect.click();

          // Digitar para filtrar — usar "curso" para buscar conteúdos do tipo CURSO
          const combobox = editPage.exceptionsMultiselect.locator('input[role="combobox"]');
          await combobox.fill('curso');

          // Dropdown deve mostrar opções filtradas
          const dropdown = page.locator('[class*="menu"]').first();
          await expect(dropdown).toBeVisible();

          // Selecionar o primeiro resultado (seleção 1)
          await dropdown.locator('[class*="option"]').first().click();
          // A tag (chip) deve aparecer dentro do multiselect
          const tags = editPage.exceptionsMultiselect.locator('[class*="multi-value"]');
          await expect(tags.first()).toBeVisible();

          // Buscar e selecionar segundo conteúdo (seleção 2)
          await combobox.fill('curso');
          await expect(dropdown).toBeVisible();
          const options = dropdown.locator('[class*="option"]');
          // Selecionar a segunda opção disponível (primeira já foi selecionada)
          await options.first().click();

          // Dois chips devem estar presentes
          await expect(tags).toHaveCount(2);

          // Remover o primeiro chip clicando no botão X
          const firstTag = tags.first();
          await firstTag.locator('[class*="multi-value__remove"]').click();

          // Agora deve restar apenas 1 chip
          await expect(tags).toHaveCount(1);

          // Salvar configurações
          await editPage.saveButton.click();

          // Modal RN37 pode aparecer — confirmar se presente
          if (await editPage.creditsModal.isVisible()) {
            await editPage.creditsModalConfirm.click();
            await expect(editPage.creditsModal).toBeHidden();
          }

          // Após salvar: retornar à lista ou permanecer na página
          // Aguardar URL de settings ou manter na edit page
          await page.waitForURL(/ai_consumption_analysis/);

          // Reabrir para verificar persistência
          if (!page.url().includes('edit_additional_organization_permissions')) {
            await expect(settingsPage.listContainer).toBeVisible();
            await settingsPage.openEnvironmentEdit(36799);
            await page.waitForURL('**36799/edit_additional_organization_permissions**');
          }

          const syncAfterSave = await editPage.isSyncBlocking();
          if (syncAfterSave) {
            // REVISAR: sync em andamento após save — verificar persistência impossível via UI
            await expect(editPage.syncAlert).toBeVisible();
          } else {
            // A exceção salva deve estar pré-populada no campo
            await expect(editPage.exceptionsMultiselect).toBeVisible();
            await expect(
              editPage.exceptionsMultiselect.locator('[class*="multi-value"]'),
            ).toHaveCount(1);
          }
        }
        // REVIEW_NEEDED: Validação fim-a-fim — verificar via chat do Agente de Atendimento que
        // conteúdos listados como exceção são excluídos da indexação durante sincronização.
        // REVIEW_NEEDED: Validar que ao remover exceção e sincronizar, conteúdo volta a ser indexado.
      },
    );

    // ─── STEP 3: Ambiente HERDADO — verificar tooltip de bloqueio e controles ausentes ───
    await allure.step(
      '3. Navegar para lista → verificar ambiente herdado (Avião, envId=36796) → asserir tooltip de bloqueio → abrir edição → verificar ausência de controles detalhados (modo herdado)',
      async () => {
        // Navegar para lista de configurações
        await page.goto(SETTINGS_URL);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do Avião está ON (checked = herdado)
        const aviaoRow = page.getByRole('row', { name: 'Avião edit' });
        await expect(aviaoRow).toBeVisible();
        await expect(aviaoRow.locator('input[type="checkbox"]').nth(1)).toBeChecked();

        // Hover no ícone de edição do Avião deve exibir tooltip de bloqueio
        await aviaoRow.locator('#ai-consumption-analysis-edit-icon').hover();
        await expect(
          page.getByRole('tooltip', { name: INHERITED_EDIT_BLOCK_TOOLTIP }),
        ).toBeVisible();

        // Abrir edição do ambiente Avião (36796) via URL direta
        await page.goto(
          `${BASE_URL}/o/36602/ai_consumption_analysis/36796/edit_additional_organization_permissions`,
        );
        await page.waitForURL('**36796/edit_additional_organization_permissions**');

        // Título deve exibir 'Avião'
        await expect(page.getByRole('heading', { name: 'Avião' })).toBeVisible();

        // Toggle master de indexação deve estar visível
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();

        // Em modo herdado: controles detalhados (Período, Tipo, Situação, Exceções) NÃO devem aparecer
        await expect(editPage.exceptionsMultiselect).not.toBeVisible();
        await expect(editPage.periodSwitch).not.toBeVisible();
        await expect(editPage.typeCourse).not.toBeVisible();
        await expect(editPage.statusReleased).not.toBeVisible();

        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Sync em andamento — alerta visível
          await expect(editPage.syncAlert).toBeVisible();
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
        }

        // REVIEW_NEEDED: Verificar que a IA do Agente de Atendimento do ambiente herdado
        // utiliza os mesmos conteúdos indexados do ambiente principal (incluindo mesmas exceções).
        // Validação requer inspeção manual no chat de IA do ambiente Avião.
      },
    );

    // ─── STEP 4: Ambiente INDEPENDENTE — verificar que NÃO herda e exibe controles completos ───
    await allure.step(
      '4. Navegar para lista → confirmar _Ambiente (envId=36799) independente (inheritSwitch unchecked) → abrir edição → verificar controles completos incluindo campo Exceções',
      async () => {
        // Navegar para lista de configurações
        await page.goto(SETTINGS_URL);
        await expect(settingsPage.listContainer).toBeVisible();

        // Verificar que o switch de herança do _Ambiente está OFF (unchecked = independente)
        const ambienteRow = page.getByRole('row', { name: '_Ambiente edit' });
        await expect(ambienteRow).toBeVisible();
        await expect(ambienteRow.locator('input[type="checkbox"]').nth(1)).not.toBeChecked();

        // Abrir edição do _Ambiente (envId=36799)
        await settingsPage.openEnvironmentEdit(36799);
        await page.waitForURL('**36799/edit_additional_organization_permissions**');

        // Título deve exibir '_Ambiente'
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();

        // Botões Salvar e Cancelar devem estar visíveis
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();

        // Toggle master de indexação deve estar presente
        await expect(editPage.contentIndexingMasterSwitch).toBeVisible();

        // Sub-toggle Período deve estar presente (controle independente)
        await expect(editPage.periodSwitch).toBeVisible();

        // Campo Exceções deve estar presente e visível (independente do principal)
        await expect(editPage.exceptionsMultiselect).toBeVisible();

        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Sync em andamento: seção visível mas aria-disabled — locators ainda presentes
          await expect(editPage.syncAlert).toBeVisible();
          await expect(editPage.typeCourse).toBeVisible();
          await expect(editPage.typeTrail).toBeVisible();
          await expect(editPage.typePackage).toBeVisible();
          await expect(editPage.statusDevelopment).toBeVisible();
          await expect(editPage.statusReleased).toBeVisible();
          await expect(editPage.statusSuspended).toBeVisible();
        } else {
          // Toggle habilitado: todos os checkboxes devem ser acessíveis
          if (!(await editPage.contentIndexingMasterInput.isChecked())) {
            await editPage.contentIndexingMasterSwitch.click({ force: true });
            await expect(editPage.contentIndexingMasterInput).toBeChecked();
          }
          await expect(editPage.typeCourse).toBeVisible();
          await expect(editPage.typeTrail).toBeVisible();
          await expect(editPage.typePackage).toBeVisible();
          await expect(editPage.statusDevelopment).toBeVisible();
          await expect(editPage.statusReleased).toBeVisible();
          await expect(editPage.statusSuspended).toBeVisible();
        }

        // REVIEW_NEEDED: Verificar via chat do Agente de Atendimento que o _Ambiente
        // utiliza sua própria configuração de indexação (incluindo suas exceções próprias)
        // sem herdar do ambiente principal.

        // Sair sem salvar
        await editPage.cancelButton.click();
        await page.waitForURL('**/ai_consumption_analysis?tab=settings**');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );
  });
});
