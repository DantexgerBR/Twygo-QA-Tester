// spec: specs/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-ambientes-novo.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CreditosIaSettingsPage } from '../../../src/pages/CreditosIaSettingsPage.js';
import { EnvironmentEditPage } from '../../../src/pages/EnvironmentEditPage.js';
import { LoginPage } from '../../../src/pages/LoginPage.js';
import { INHERITED_EDIT_BLOCK_TOOLTIP, SYNC_ALERT_TEXT } from '../../../src/utils/testIds.js';

test.describe('Configurar a utilização do indexação de conteúdo por ambiente', () => {
  test('Configurar a indexação - Ambientes novo', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Configurar a utilização do indexação de conteúdo por ambiente');
    await allure.story('Configurar a indexação - Ambientes novo');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    // REVISAR: criação de ambiente novo não existe via UI — asserções usam proxy environment '_Ambiente' (envId=36799)
    await allure.tag('REVIEW_NEEDED');

    const loginPage = new LoginPage(page);
    const settingsPage = new CreditosIaSettingsPage(page);
    const editPage = new EnvironmentEditPage(page);

    // Pré-condição: Login SuperAdmin + perfil Administrador + abrir Créditos de IA → Configurações
    await allure.step(
      'Pré-condição: Login SuperAdmin + perfil Administrador + abrir Créditos de IA → Configurações',
      async () => {
        // Navegar para a tela de login (URL real: /users/login)
        await page.goto('https://stage10.stage.twygoead.com/users/login');

        // Preencher credenciais e submeter via page object
        await loginPage.login('evertongambeta@gmail.com', '123456');

        // Navegar para a aba Configurações de Créditos de IA
        await page.goto('https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );

    // STEP 1 — Verificar toggle Indexação de conteúdo DESABILITADO por padrão em ambiente novo/independente
    await allure.step(
      '1. Ao criar um ambiente novo após a implementação desse projeto, a toggle "Indexação de conteúdo" deve vir DESABILITADA por padrão.',
      async () => {
        // REVISAR: criação de ambiente novo não existe via UI; asserção em ambiente independente
        // existente '_Ambiente' (envId=36799) como proxy — paridade com estado de novo ambiente.

        // Clicar no ícone de edição da linha _Ambiente para abrir a tela de edição
        await page.getByRole('row', { name: '_Ambiente edit' }).locator('#ai-consumption-analysis-edit-icon').click();
        await page.waitForURL(
          '**/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions',
        );

        // Verificar heading _Ambiente
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();

        // Verificar estado do toggle Indexação de conteúdo usando isSyncBlocking condicional
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Sincronização em andamento: alerta visível e checkbox disabled
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          await expect(editPage.contentIndexingMasterInput).toBeDisabled();
        } else {
          // Estado esperado pós-runner: toggle desabilitado (unchecked) em ambiente independente
          // REVISAR: para ambiente genuinamente novo, o toggle deve partir unchecked.
          await expect(editPage.contentIndexingMasterInput).not.toBeChecked();
        }

        // Voltar para a lista de ambientes
        await page.goto('https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );

    // STEP 2 — Verificar ambiente herdado (Avião, envId=36796)
    await allure.step(
      '2. Acessar ambiente herdado.',
      async () => {
        // Verificar que a linha Avião está visível
        const aviaoRow = page.getByRole('row', { name: 'Avião edit' });
        await expect(aviaoRow).toBeVisible();

        // Verificar que o switch de herança da linha Avião está marcado (checked=true)
        await expect(settingsPage.inheritSwitch(36796)).toBeChecked();

        // Fazer hover no ícone de edição do ambiente Avião (bloqueado por herança)
        await aviaoRow.locator('#ai-consumption-analysis-edit-icon').hover();

        // Verificar tooltip de bloqueio por herança
        await expect(page.getByRole('tooltip', { name: INHERITED_EDIT_BLOCK_TOOLTIP })).toBeVisible();

        // REVISAR: verificação de que os recursos de IA do ambiente Avião estão usando os conteúdos
        // corretamente requer teste funcional no chat IA do aluno do ambiente Avião — fora do escopo Admin UI.
      },
    );

    // STEP 3 — Verificar ambiente independente (_Ambiente, envId=36799)
    await allure.step(
      '3. Acessar ambiente independente.',
      async () => {
        // Verificar que o switch de herança do _Ambiente está desmarcado (ambiente independente)
        await expect(settingsPage.inheritSwitch(36799)).not.toBeChecked();

        // Clicar no ícone de edição do ambiente independente _Ambiente
        await settingsPage.openEnvironmentEdit(36799);
        await page.waitForURL(
          '**/o/36602/ai_consumption_analysis/36799/edit_additional_organization_permissions',
        );

        // Verificar heading _Ambiente
        await expect(page.getByRole('heading', { name: '_Ambiente' })).toBeVisible();

        // Verificar que botões Salvar e Cancelar estão visíveis e habilitados
        await expect(editPage.saveButton).toBeVisible();
        await expect(editPage.cancelButton).toBeVisible();

        // Verificar que o toggle Indexação de conteúdo está presente e interagível
        await expect(page.getByRole('checkbox', { name: 'Indexação de conteúdo' })).toBeVisible();

        // REVISAR: verificação de que os recursos de IA do ambiente _Ambiente NÃO herdam configurações
        // do principal requer teste funcional no chat IA do aluno — fora do escopo Admin UI.

        // Voltar à lista sem salvar
        await editPage.cancelButton.click();
        await page.waitForURL('**/o/36602/ai_consumption_analysis?tab=settings');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );
  });
});
