// spec: cobertura completa de uploads — Base de Conhecimento
//
// Itera por TODOS os arquivos disponíveis em `test-assets/uploads/`,
// criando um test() independente por arquivo dentro do mesmo describe
// canônico ("Fontes de Conhecimento - Upload de documentos") para que
// o twygo-report-generator agrupe os casos sob a testsuite correta.
//
// Cada test:
//   1. Cria um repositório dedicado (Identificação)
//   2. Faz upload no tab Fontes ou Recursos conforme o accept
//   3. Valida que a linha aparece na tabela do tab
//   4. Edita o nome do repositório (passo "edição após cada upload")
//
// Os 4 cenários de formato inválido são test()s separados que validam
// a mensagem inline de rejeição na dropzone.
//
// Decisão técnica: 1 test() por arquivo isola flakes do env de staging
// — se 1 falha, os outros continuam. Pattern espelha TC1/TC2 (que rodam
// estáveis). Limitação descoberta live 2026-05-21: `page.goto` direto
// para `/edit?tab=*` quebra hidração da SPA, Fonte termina órfã (POST
// 2xx mas linha não aparece). Usar `openSourcesTab` (click na tab
// Chakra) é determinístico.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { fontesSharedData as shared } from './fontes.shared.data.js';
import { uploadCoberturaData as data } from './upload-cobertura-completa.data.js';

test.describe('Fontes de Conhecimento - Upload de documentos', () => {
  // Nomes do repo criado pelo test atual; preenchidos no início de cada test()
  // e consumidos pelo afterEach compartilhado abaixo. Reset no afterEach evita
  // contaminação entre tests sequenciais.
  let cleanupNames: string[] = [];

  test.afterEach(async ({ browser }) => {
    if (cleanupNames.length === 0) return;
    const ctx = await browser.newContext({ storageState: shared.storageState });
    const page = await ctx.newPage();
    try {
      const listPage = new KnowledgeRepositoryListPage(page);
      for (const name of cleanupNames) {
        if (name) await listPage.deleteRepositoryByNameSafe(name);
      }
    } finally {
      cleanupNames = [];
      await ctx.close();
    }
  });

  // ===================== Fontes válidas =====================
  for (const fixture of data.fontesValidas) {
    test(`TC6 Fontes — upload e edição — ${fixture.label}`, async ({ page }, testInfo) => {
      test.setTimeout(3 * 60_000);
      await allure.epic('Twygo - Base de Conhecimento');
      await allure.feature('Fontes de Conhecimento - Upload de documentos');
      await allure.story(`TC6 Fontes — ${fixture.label}`);
      await allure.severity('critical');

      const stamp = `w${testInfo.workerIndex}-${Date.now()}`;
      const repoName = `Repo Fonte ${fixture.label} ${stamp}`.slice(0, 70);
      const repoNameEdited = `${repoName} EDIT`.slice(0, 80);
      const sourceName = `Fonte ${stamp}`;
      cleanupNames = [repoNameEdited, repoName];
      const formPage = new KnowledgeRepositoryFormPage(page);

      await allure.step('1. Criar repositório', async () => {
        await formPage.goToCreate();
        await formPage.fillName(repoName);
        await formPage.fillDescription(`Upload — ${fixture.label}`);
        await formPage.clickSalvar();
        await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
      });

      await allure.step(`2. Fontes — upload ${fixture.label}`, async () => {
        await formPage.openSourcesTab();
        await formPage.clickAdicionarFonte();
        await formPage.fillSourceName(sourceName);
        await formPage.attachFile(fixture.path);
        await formPage.clickSalvarSubForm();
        await expect(page).toHaveURL(/edit\?tab=sources/);
        await expect(formPage.getSourceRow(sourceName)).toBeVisible({ timeout: 30_000 });
      });

      await allure.step('3. Editar nome do repositório', async () => {
        await formPage.openIdentificationTab();
        await formPage.fillName(repoNameEdited);
        await formPage.clickSalvar();
        await expect(formPage.getNameInput()).toHaveValue(repoNameEdited);
      });
    });
  }

  // ===================== Recursos válidos =====================
  for (const fixture of data.recursosValidos) {
    test(`TC6 Recursos — upload e edição — ${fixture.label}`, async ({ page }, testInfo) => {
      test.setTimeout(3 * 60_000);
      await allure.epic('Twygo - Base de Conhecimento');
      await allure.feature('Fontes de Conhecimento - Upload de documentos');
      await allure.story(`TC6 Recursos — ${fixture.label}`);
      await allure.severity('critical');

      const stamp = `w${testInfo.workerIndex}-${Date.now()}`;
      const repoName = `Repo Recurso ${fixture.label} ${stamp}`.slice(0, 70);
      const repoNameEdited = `${repoName} EDIT`.slice(0, 80);
      const resourceName = `Recurso ${stamp}`;
      cleanupNames = [repoNameEdited, repoName];
      const formPage = new KnowledgeRepositoryFormPage(page);

      await allure.step('1. Criar repositório', async () => {
        await formPage.goToCreate();
        await formPage.fillName(repoName);
        await formPage.fillDescription(`Upload — ${fixture.label}`);
        await formPage.clickSalvar();
        await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
      });

      await allure.step(`2. Recursos — upload ${fixture.label}`, async () => {
        await formPage.openResourcesTab();
        await formPage.clickAdicionarRecurso();
        await formPage.fillResourceName(resourceName);
        await formPage.attachFile(fixture.path);
        await formPage.clickSalvarSubForm();
        await expect(page).toHaveURL(/edit\?tab=resources/);
        await expect(formPage.getResourceRow(resourceName)).toBeVisible({ timeout: 30_000 });
      });

      await allure.step('3. Editar nome do repositório', async () => {
        await formPage.openIdentificationTab();
        await formPage.fillName(repoNameEdited);
        await formPage.clickSalvar();
        await expect(formPage.getNameInput()).toHaveValue(repoNameEdited);
      });
    });
  }

  // ===================== Formatos inválidos =====================
  for (const fixture of data.formatosInvalidos) {
    test(`TC6 Rejeição — formato inválido — ${fixture.label}`, async ({ page }, testInfo) => {
      test.setTimeout(3 * 60_000);
      await allure.epic('Twygo - Base de Conhecimento');
      await allure.feature('Fontes de Conhecimento - Upload de documentos');
      await allure.story(`TC6 Rejeição — ${fixture.label}`);
      await allure.severity('normal');

      const stamp = `w${testInfo.workerIndex}-${Date.now()}`;
      const repoName = `Repo Inválido ${fixture.label} ${stamp}`.slice(0, 70);
      const sourceName = `Inválida ${stamp}`;
      cleanupNames = [repoName];
      const formPage = new KnowledgeRepositoryFormPage(page);

      await allure.step('1. Criar repositório', async () => {
        await formPage.goToCreate();
        await formPage.fillName(repoName);
        await formPage.fillDescription(`Cenário inválido — ${fixture.label}`);
        await formPage.clickSalvar();
        await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/);
      });

      await allure.step(`2. Fontes — tentar upload ${fixture.label}`, async () => {
        await formPage.openSourcesTab();
        await formPage.clickAdicionarFonte();
        await formPage.fillSourceName(sourceName);
        await formPage.attachFile(fixture.path);
        await expect(page.getByText(data.erroFormatoInvalido).first()).toBeVisible({
          timeout: 15_000,
        });
      });

      await allure.step('3. Confirmar que a Fonte NÃO foi criada', async () => {
        // Sub-form usa testId distinto (`knowledge-repositories-sources-form-cancel-button`)
        // do form principal — `clickCancelar()` faria timeout. Validado live
        // 2026-05-21 via chrome-devtools-mcp (audit dos 4/4 inválidos red).
        await formPage.clickCancelarSubForm();
        await page.waitForURL(/edit\?tab=sources/, { timeout: 15_000 });
        await expect(formPage.getSourceRow(sourceName)).toHaveCount(0);
      });
    });
  }
});
