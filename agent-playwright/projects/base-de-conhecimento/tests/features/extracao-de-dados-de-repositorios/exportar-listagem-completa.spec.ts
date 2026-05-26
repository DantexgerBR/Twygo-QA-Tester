// spec: projects/base-de-conhecimento/specs/extracao-de-dados-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { tc1Data as data } from './exportar-listagem-completa.data.js';

test.describe('Extração de dados de repositórios', () => {
  test('TC1 — Exportar listagem completa', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Extração de dados de repositórios');
    await allure.story('TC1 — Exportar listagem completa');
    await allure.severity('normal');
    // AT descreve fluxo síncrono, produto entrega assíncrono. Sinaliza
    // gap pra QA Lead atualizar test-analysis.md §306-321.
    await allure.label('tag', 'AT_OUTDATED_ASYNC_EXPORT');

    const listPage = new KnowledgeRepositoryListPage(page);

    await allure.step('1. Navegar para a listagem de repositórios', async () => {
      await listPage.goToList();
      await expect(listPage.getListContainer()).toBeVisible();
    });

    await allure.step('2. Verificar pré-condição: listagem tem ≥1 repositório', async () => {
      const rowCount = await listPage.getRowCount();
      expect(
        rowCount,
        'Pré-condição falhou: seed do env precisa ter ≥1 repositório para validar export.',
      ).toBeGreaterThanOrEqual(1);
    });

    await allure.step('3. Abrir modal "Configurações da extração"', async () => {
      await listPage.openExtractDataModal();
      await expect(listPage.getExtractDataModal()).toBeVisible();
    });

    await allure.step('4. Marcar Formato=CSV, Dados=Todos, Colunas=Todas', async () => {
      await listPage.configureExtraction(data.extractOptions);
    });

    await allure.step('5. Click "Extrair" e aguardar toast de progresso', async () => {
      await listPage.confirmExtraction();
      await expect(listPage.getExtractionInProgressToast()).toBeVisible();
    });

    // Validação do arquivo gerado (filename, conteúdo) é out-of-scope pro
    // Playwright — extração é assíncrona via notificação minutos depois.
    // Requer agent-db ou agent-api pra consultar a tabela de exports.
    await allure.label('tag', 'NEEDS_CONTENT_VALIDATION');
  });
});
