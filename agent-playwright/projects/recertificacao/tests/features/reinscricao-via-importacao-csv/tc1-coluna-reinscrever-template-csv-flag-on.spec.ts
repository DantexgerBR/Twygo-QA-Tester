import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { CsvImportPage } from '../../../pages/CsvImportPage.js';
import { tc1Data } from './tc1-coluna-reinscrever-template-csv-flag-on.data.js';

test.describe('Reinscrição via Importação CSV', () => {
  // Refatoração 2026-06-01 (Pacote C #6) tentada via fixture
  // `cursoComRecertificacaoSeed` (skill `provisionar-seed`). REVERTIDA
  // porque `SeedAdminPage.setHasRecertification` (chamado pela fixture)
  // hoje falha em `openEditReactAccessById` — timeout 20s no `waitFor`
  // da tab Acesso. Tabs aparecem no snapshot pós-erro mas state lento
  // (3 toasts "Identificação salva" durante setup → re-render do React).
  // Modal beta-end NÃO é a causa (dismiss adicional não resolveu).
  // Próximo: investigar load state do facelift via trace.zip, OU
  // refatorar `setHasRecertification` pra esperar toast desaparecer
  // antes do próximo step.
  test.fixme(true, 'seed-roadmap-bloqueio-canonical: refactor pra fixture cursoComRecertificacaoSeed (válida em si) bloqueado por bug state-dependent em SeedAdminPage.setHasRecertification → openEditReactAccessById (tab Acesso não fica visible em 20s após save com toast pendente). Reverte ao fixme até bug canonical do helper ser corrigido.');
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
