// spec: specs/visualizar-historico-de-consumo-da-indexacao-e-do-agente-de-atendimento/historico-de-indexacao-de-conteudo.plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Visualizar histórico de consumo da indexação e do agente de atendimento', () => {
  test('Histórico de indexação de conteúdo', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Visualizar histórico de consumo da indexação e do agente de atendimento');
    await allure.story('Histórico de indexação de conteúdo');
    await allure.severity('critical');
    await allure.label('executionType', 'manual');
    await allure.tag('REVIEW_NEEDED');

    // Pré-condição: navegar à aba Extrato
    await allure.step('Pré-condição: navegar à aba Extrato', async () => {
      await page.goto('/o/36602/ai_consumption_analysis?tab=consumption');
      await expect(page.getByTestId('ai-consumption-analysis-extract-tab')).toBeVisible();
    });

    // Step 1: Verificar elementos principais da aba Extrato após navegação
    await allure.step('1. Verificar presença e visibilidade dos elementos principais da aba Extrato', async () => {
      await expect(page).toHaveURL(/\?tab=consumption/);
      await expect(page.getByTestId('ai-consumption-statement-title')).toBeVisible();
      await expect(page.getByTestId('credit-package-summary-container').first()).toBeVisible();
      await expect(page.getByTestId('credit-package-summary-row-initial-balance').first()).toBeVisible();
      await expect(page.getByTestId('credit-package-summary-row-monthly-renewal').first()).toBeVisible();
      await expect(page.getByTestId('credit-package-summary-row-credits-used').first()).toBeVisible();
      await expect(page.getByTestId('credit-package-summary-row-final-balance').first()).toBeVisible();
      await expect(page.getByTestId('ai-consumption-total-final-balance-card')).toBeVisible();
    });

    // Step 2: Verificar presença e ordem das colunas do cabeçalho da tabela de histórico
    await allure.step('2. Verificar presença e ordem das colunas do cabeçalho da tabela de histórico', async () => {
      const tableContainer = page.getByTestId('ai-consumption-analysis-extract-table-container');
      await expect(tableContainer).toBeVisible();

      const expectedColumns = ['Data', 'Ação realizada', 'Usuário', 'Créditos de IA', 'Operação', 'Fonte', 'Expiração'];
      const headers = tableContainer.locator('th');

      for (let i = 0; i < expectedColumns.length; i++) {
        await expect(headers.nth(i)).toHaveText(expectedColumns[i]);
      }
    });

    // Step 3: Verificar registro de 'Indexação de conteúdo' na tabela
    // REVISAR: este step pressupõe que já existem registros de indexação no ambiente de stage.
    // Caso a tabela esteja vazia ou sem registros de indexação, executar somente após disparar uma indexação.
    await allure.step('3. Verificar existência de ao menos um registro de Indexação de conteúdo na tabela', async () => {
      // REVISAR: requer fixture de dados — depende de registros pré-existentes no stage
      const tableContainer = page.getByTestId('ai-consumption-analysis-extract-table-container');
      const indexacaoRow = tableContainer.getByRole('row').filter({ hasText: 'Indexação de conteúdo' }).first();
      await expect(indexacaoRow).toBeVisible();

      // Verificar que a coluna Data exibe data e hora no formato PT-BR
      const dateCell = indexacaoRow.locator('td').nth(0);
      await expect(dateCell).toHaveText(/\d{2}\/\d{2}\/\d{4}/);

      // Verificar que demais colunas não estão vazias
      const userCell = indexacaoRow.locator('td').nth(2);
      const creditsCell = indexacaoRow.locator('td').nth(3);
      const opCell = indexacaoRow.locator('td').nth(4);
      await expect(userCell).not.toBeEmpty();
      await expect(creditsCell).not.toBeEmpty();
      await expect(opCell).not.toBeEmpty();
    });

    // Step 4: Clicar no cabeçalho 'Ação realizada' para ordenar ascendente (A→Z)
    await allure.step('4. Clicar no cabeçalho Ação realizada para ordenar ascendente (A→Z)', async () => {
      const tableContainer = page.getByTestId('ai-consumption-analysis-extract-table-container');
      const acaoRealizadaHeader = tableContainer.getByRole('columnheader', { name: 'Ação realizada' });
      await acaoRealizadaHeader.click();

      // Verificar indicador visual de ordenação crescente — ícone chevron-up (path ascendente)
      // O ícone com id 'ai_consumptions-order-by-origin' muda de path ao ordenar
      const sortIcon = page.locator('#ai_consumptions-order-by-origin');
      await expect(sortIcon).toBeVisible();
      // Após clique ascendente, o path do SVG contém "M7.646 4.646" (chevron-up)
      await expect(sortIcon).toHaveAttribute('viewBox', '0 0 16 16');
      const sortIconPath = sortIcon.locator('path');
      await expect(sortIconPath).toHaveAttribute('d', /M7\.646 4\.646/);
    });

    // Step 5: Clicar novamente no cabeçalho 'Ação realizada' para ordenar descendente (Z→A)
    await allure.step('5. Clicar novamente no cabeçalho Ação realizada para ordenar descendente (Z→A)', async () => {
      const tableContainer = page.getByTestId('ai-consumption-analysis-extract-table-container');
      const acaoRealizadaHeader = tableContainer.getByRole('columnheader', { name: 'Ação realizada' });
      await acaoRealizadaHeader.click();

      // Verificar indicador visual de ordenação decrescente — ícone chevron-down (path descendente)
      // Após segundo clique, o path do SVG contém "M1.646 4.646" (chevron-down)
      const sortIcon = page.locator('#ai_consumptions-order-by-origin');
      await expect(sortIcon).toBeVisible();
      const sortIconPath = sortIcon.locator('path');
      await expect(sortIconPath).toHaveAttribute('d', /M1\.646 4\.646/);
    });

    // Step 6: Verificar registros de ambiente herdado no extrato do principal
    // REVISAR: requer (a) ambiente configurado como herdado, (b) indexação disparada no sub-ambiente,
    // (c) verificar que o registro aparece na tabela do ambiente principal (org 36602).
    // Dependência: dados de teste pré-existentes no stage ou fixture de setup dedicada.
    await allure.step('6. [REVIEW_NEEDED] Verificar registros de ambiente herdado no extrato do principal', async () => {
      // REVISAR: requer fixture de dados — ambiente herdado (ex.: envId 36799) com indexação disparada
      // Implementação: confirmar toggle "Herdar configurações do principal" ativo, disparar indexação,
      // verificar que o registro aparece no extrato do org 36602 com campo Fonte/Usuário identificando sub-ambiente.
      test.skip(true, 'REVISAR: requer dados de ambiente herdado pré-existentes no stage (envId 36799 ou similar)');
    });

    // Step 7: Verificar registros de ambiente independente aparecem apenas no próprio extrato
    // REVISAR: requer (a) ambiente independente configurado, (b) indexação disparada nele,
    // (c) verificar que o registro aparece somente no extrato do sub-ambiente, não no principal.
    // Dependência: dados de teste pré-existentes no stage ou fixture de setup dedicada.
    await allure.step('7. [REVIEW_NEEDED] Verificar registros de ambiente independente aparecem somente no próprio extrato', async () => {
      // REVISAR: requer fixture de dados — ambiente independente com indexação disparada
      // Implementação: confirmar toggle "Herdar configurações do principal" inativo, disparar indexação,
      // navegar para extrato do sub-ambiente e verificar registro; confirmar ausência no org 36602.
      test.skip(true, 'REVISAR: requer dados de ambiente independente pré-existentes no stage');
    });
  });
});
