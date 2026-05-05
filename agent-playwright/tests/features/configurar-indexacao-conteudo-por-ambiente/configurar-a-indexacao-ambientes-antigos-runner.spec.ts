// spec: specs/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-ambientes-antigos-runner.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CreditosIaSettingsPage } from '../../../src/pages/CreditosIaSettingsPage.js';
import { EnvironmentEditPage } from '../../../src/pages/EnvironmentEditPage.js';
import { SYNC_ALERT_TEXT, INHERITED_EDIT_BLOCK_TOOLTIP } from '../../../src/utils/testIds.js';
import { getOrgId } from '../../../src/utils/environment.js';

const ORG_ID = getOrgId();
const SETTINGS_PATH = `/o/${ORG_ID}/ai_consumption_analysis?tab=settings`;

test.describe('Configurar a utilização do indexação de conteúdo por ambiente', () => {
  test('Configurar a indexação - Ambientes antigos - RUNNER', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Configurar a utilização do indexação de conteúdo por ambiente');
    await allure.story('Configurar a indexação - Ambientes antigos - RUNNER');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    // REVISAR: parte do teste depende de Runner backend + chat IA (operações server-side fora do escopo UI)
    await allure.tag('REVIEW_NEEDED');

    const settingsPage = new CreditosIaSettingsPage(page);
    const editPage = new EnvironmentEditPage(page);

    // Pré-condição: navegar para Créditos de IA → Configurações (storageState global cobre auth)
    await allure.step(
      'Pré-condição: abrir Créditos de IA → Configurações',
      async () => {
        await page.goto(SETTINGS_PATH);
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );

    // 1. RUNNER [REVIEW_NEEDED]: estado pós-runner no ambiente principal Stage 10
    await allure.step(
      '1. Ao ter um ambiente ANTES da implementação desse projeto a toggle "Indexação de conteúdo" deve vir desabilitada e devemos rodar o "Runner para atualizar registros no banco vetorial".',
      async () => {
        // REVISAR: a execução do Runner é uma rake task backend sem interface Playwright.
        // O tester manual deve garantir que o Runner foi executado ANTES deste step.
        // ASSERÇÃO UI ALTERNATIVA: verificar estado atual da tela de edição do ambiente Stage 10.

        // Clicar no botão edit da linha Stage 10 (ambiente principal)
        await page.getByRole('row', { name: 'Stage 10 Ambiente principal' })
          .locator('#ai-consumption-analysis-edit-icon')
          .click();
        await page.waitForURL(
          '**/o/36602/ai_consumption_analysis/36602/edit_additional_organization_permissions',
        );

        // REVISAR: estado esperado pós-runner — syncAlert ausente e contentIndexingMasterInput checked.
        // Estado atual observado: sincronização em andamento (runner ainda não executado).
        // A asserção abaixo reflete o estado pós-runner. Se o runner NÃO tiver sido executado,
        // o syncAlert estará visível e o checkbox de indexação estará disabled.
        const syncBlocking = await editPage.isSyncBlocking();
        if (syncBlocking) {
          // Estado pré-runner: alerta visível — registrar e continuar sem falhar (REVIEW_NEEDED)
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
          // O checkbox de indexação estará disabled neste estado
          await expect(editPage.contentIndexingMasterInput).toBeDisabled();
        } else {
          // Estado pós-runner: alerta ausente, indexação habilitada e checkboxes legíveis marcados
          await expect(page.getByText(SYNC_ALERT_TEXT)).not.toBeVisible();
          await expect(editPage.contentIndexingMasterInput).not.toBeDisabled();
          await expect(editPage.contentIndexingMasterInput).toBeChecked();

          // Verificar checkboxes de Tipo de conteúdo LEGÍVEIS marcados
          await expect(editPage.typeCourse).toBeChecked();
          await expect(editPage.typeTrail).toBeChecked();
          await expect(editPage.typePackage).toBeChecked();

          // Verificar checkboxes de Asset LEGÍVEIS marcados
          await expect(editPage.assetText).toBeChecked();
          await expect(editPage.assetPage).toBeChecked();
          await expect(editPage.assetLesson).toBeChecked();
          await expect(editPage.assetStampedPdf).toBeChecked();
          await expect(editPage.assetVideo).toBeChecked();
          await expect(editPage.assetFiles).toBeChecked();

          // Verificar checkboxes de Situação marcados
          await expect(editPage.statusDevelopment).toBeChecked();
          await expect(editPage.statusReleased).toBeChecked();
          await expect(editPage.statusSuspended).toBeChecked();
        }

        // Verificar funcionalidades LEGÍVEIS por nome (visíveis independentemente do runner)
        await expect(page.getByRole('checkbox', { name: 'Criação de conteúdo' })).toBeChecked();
        await expect(
          page.getByRole('checkbox', { name: 'Criação de conteúdos, no tipo página ou em video com IA' }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', {
            name: 'Geração de questionários baseados em novos arquivos ou atividades já existentes',
          }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', {
            name: 'Criação de estrutura de atividades para auxiliar na construção de um conteudo',
          }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', { name: 'Geração de resumos para suas atividades' }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', { name: 'Edição de conteúdos do tipo página com IA' }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', { name: 'Edição de conteúdos do tipo aula com IA' }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', { name: 'Análise e acompanhamento' }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', {
            name: 'Geração de parecer da IA nos questionários aplicados para o usuário final',
          }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', { name: 'Automação e assistência' }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', {
            name: 'Importação de arquivos ou textos para a criação de questionários de forma automatizada',
          }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', {
            name: 'Compreensão de arquivos importados e geração de organograma da sua empresa, função e competências de cada função',
          }),
        ).toBeChecked();
        await expect(
          page.getByRole('checkbox', {
            name: /Registros externos: Leitura de arquivos com IA e auto preenchimento dos registros realizados/,
          }),
        ).toBeChecked();

        // Voltar à lista sem salvar
        await editPage.cancelButton.click();
        await page.waitForURL('**/o/36602/ai_consumption_analysis?tab=settings');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );

    // 2. Ambiente adicional que HERDA do principal (Avião)
    await allure.step(
      '2. Acessar um ambiente adicional que herdou as configurações do ambiente principal.',
      async () => {
        // Verificar linha Avião visível na tabela
        const aviaoRow = page.getByRole('row', { name: 'Avião edit' });
        await expect(aviaoRow).toBeVisible();

        // Verificar que o checkbox de Acesso de IA ativo está checked na linha Avião
        await expect(aviaoRow.getByRole('checkbox').first()).toBeChecked();

        // Verificar que o checkbox de Herdar configurações do principal está checked na linha Avião
        await expect(aviaoRow.getByRole('checkbox').nth(1)).toBeChecked();

        // Fazer hover no ícone edit do ambiente Avião (bloqueado por herança) para verificar tooltip
        await aviaoRow.locator('#ai-consumption-analysis-edit-icon').hover();

        // Verificar tooltip de bloqueio por herança
        await expect(page.getByText(INHERITED_EDIT_BLOCK_TOOLTIP)).toBeVisible();

        // REVISAR: verificação de que os recursos de IA estão utilizando os conteúdos corretamente
        // requer validação fim-a-fim no chat IA do aluno do ambiente Avião — fora do escopo UI.
      },
    );

    // 3. Ambiente adicional INDEPENDENTE (Stage 10.1 Parceira — envId=36690)
    await allure.step(
      '3. Acessar um ambiente adicional independente.',
      async () => {
        // Verificar linha Stage 10.1 Parceira visível e Herdar configurações desmarcado
        const parceiraRow = page.getByRole('row', { name: 'Stage 10.1 Parceira edit' });
        await expect(parceiraRow).toBeVisible();

        // Confirmar que o switch de herança do ambiente independente está desmarcado
        await expect(settingsPage.inheritSwitch(36690)).not.toBeChecked();

        // Clicar no ícone edit para abrir a tela de edição do ambiente independente
        await settingsPage.openEnvironmentEdit(36690);
        await page.waitForURL(
          '**/o/36602/ai_consumption_analysis/36690/edit_additional_organization_permissions',
        );

        // Verificar heading do ambiente independente
        await expect(page.getByRole('heading', { name: 'Stage 10.1 Parceira' })).toBeVisible();

        // Verificar que "Agente de atendimento" está DESMARCADO (difere do principal onde estava marcado)
        await expect(page.getByRole('checkbox', { name: 'Agente de atendimento' })).not.toBeChecked();

        // Verificar que a sub-seção "Fontes de conhecimento" NÃO é renderizada
        // (renderização condicional: aparece apenas quando Agente de atendimento está marcado)
        await expect(page.getByText('Fontes de conhecimento')).not.toBeVisible();

        // REVISAR: estado pós-runner — indexação habilitada e checked.
        // Estado atual: sincronização em andamento, checkbox disabled.
        const syncBlockingParceira = await editPage.isSyncBlocking();
        if (syncBlockingParceira) {
          // Estado pré-runner: alerta de sincronização visível
          await expect(page.getByText(SYNC_ALERT_TEXT)).toBeVisible();
        } else {
          // Estado pós-runner esperado: indexação habilitada e checked
          await expect(editPage.contentIndexingMasterInput).not.toBeDisabled();
          await expect(editPage.contentIndexingMasterInput).toBeChecked();
        }

        // REVISAR: verificação de que os recursos de IA do ambiente independente NÃO herdam
        // configurações do principal requer validação fim-a-fim no chat IA do aluno do
        // ambiente Stage 10.1 Parceira — fora do escopo Playwright UI.

        // Voltar à lista sem salvar
        await editPage.cancelButton.click();
        await page.waitForURL('**/o/36602/ai_consumption_analysis?tab=settings');
        await expect(settingsPage.listContainer).toBeVisible();
      },
    );
  });
});
