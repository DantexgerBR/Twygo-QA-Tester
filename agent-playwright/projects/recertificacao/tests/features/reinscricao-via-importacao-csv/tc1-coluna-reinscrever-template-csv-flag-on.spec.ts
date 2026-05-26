import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CsvImportPage } from '../../../pages/CsvImportPage.js';
import { tc1Data } from './tc1-coluna-reinscrever-template-csv-flag-on.data.js';

test.describe('Reinscrição via Importação CSV', () => {
  // REVISAR: seed inválido — `tc1Data.eventId = 2` retorna HTTP 404 em
  // `/o/37007/events/2/import_participants` (não existe curso 2 na org de
  // staging-base-de-conhecimento). Adicionalmente, a rota `import_participants`
  // ainda está marcada `REVISAR-FIGMA` no MD — confirmar URL real do app via
  // chrome-devtools-mcp e atualizar `CsvImportPage.goToImport` + `.data.ts`
  // com eventId real de curso com `has_recertification = true`. Validado live
  // no env staging-base-de-conhecimento durante run 2026-05-26.
  test.fixme(true, 'seed inválido — eventId placeholder. Validar curso com import CSV habilitado no env staging-base-de-conhecimento.');
  test('TC1 — Coluna "Reinscrever" aparece no template CSV com flag ON', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição via Importação CSV');
    await allure.story('Coluna "Reinscrever" aparece no template CSV com flag ON');
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const csvImport = new CsvImportPage(page);

    await allure.step(
      '1. Acessar a página de importação de participants em "/o/{orgId}/events/{eventId}/import_participants"',
      async () => {
        // REVISAR-FIGMA: URL exata ainda não confirmada — ver CsvImportPage.goToImport.
        await csvImport.goToImport(tc1Data.eventId);
        await expect(page).toHaveURL(/import_participants/);
        await expect(csvImport.getDownloadTemplateLink()).toBeVisible();
      },
    );

    await allure.step('2. Clicar em "Baixar template CSV" → download inicia', async () => {
      const filePath = await csvImport.downloadTemplate();
      // Verificação prévia: o arquivo existe e é não-vazio.
      const { statSync } = await import('node:fs');
      expect(statSync(filePath).size).toBeGreaterThan(0);
      // Anexa o path no Allure para que a evidência fique no relatório.
      await allure.parameter('templateLocalPath', filePath);
      // Passa o path para o próximo step via fixture-less side channel:
      // re-baixa pra simplificar (download é determinístico — mesmo template).
      // Em vez de mutar shared state, o step 3 baixa de novo e valida o header.
    });

    await allure.step(
      '3. Abrir o arquivo template.csv → header contém a coluna "Reinscrever"',
      async () => {
        // Re-baixa o template e lê o header. Determinístico — mesmo arquivo.
        const filePath = await csvImport.downloadTemplate();
        await csvImport.expectColumnInTemplate(
          filePath,
          tc1Data.expectedColumnName,
          true,
        );
      },
    );
  });
});
