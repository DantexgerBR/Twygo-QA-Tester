// MD canônico §"Ambientes adicionais - Isolamento de repositórios" — TC3
// seed: tests/seed.spec.ts
//
// Cria 10 repositórios no env ADICIONAL (stage101parceira / orgId 36690),
// cada um com 1 Fonte de conhecimento (PDF/DOCX alternados) + 1 Recurso de
// mídia (JPG/PNG alternados) anexados. Valida que TODOS aparecem na listagem
// do adicional e NENHUM aparece no principal — isolamento de conteúdo rico.
//
// Skill: testar-ambientes-adicionais-twygo + testar-upload-de-arquivo-twygo.
// Cleanup obrigatório (§7.6 G) via DELETE API — cascade remove Fontes/Recursos.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ADITIONAL_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { bulkRepositoriosData as data } from './bulk-repositorios-com-conteudo-no-adicional.data.js';

const PRINCIPAL_STORAGE = resolve(process.cwd(), 'outputs/.auth/storage.json');
const aditional = getEnvByName('staging-base-de-conhecimento-aditional');
const aditionalOrgId = aditional.orgId!;

test.describe('Ambientes adicionais - Isolamento de repositórios', () => {
  const createdNames: string[] = [];

  test.afterAll(async ({ browser }) => {
    // afterAll hook default timeout é 30s — insuficiente pra 10+ DELETEs sequenciais.
    test.setTimeout(5 * 60_000);

    // Cleanup no ADICIONAL — todos os repos foram criados lá. Inclui:
    //  - os criados nesta run (createdNames)
    //  - qualquer órfão remanescente com prefix `data.prefix` (de runs interrompidas)
    // DELETE via API direta — cascade remove Fontes/Recursos anexados.
    const ctx = await browser.newContext({
      storageState: ADITIONAL_STORAGE_PATH,
      baseURL: aditional.baseUrl,
    });
    const page = await ctx.newPage();
    try {
      await page.goto(`/o/${aditionalOrgId}/knowledge_repositories`, {
        waitUntil: 'domcontentloaded',
        timeout: 30_000,
      });
      await page.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => null);

      const orphans = await page.evaluate((prefix: string) => {
        const rows = Array.from(document.querySelectorAll('[data-item-id][data-item-name]'));
        return rows
          .map((r) => ({
            id: r.getAttribute('data-item-id')!,
            name: r.getAttribute('data-item-name')!,
          }))
          .filter((r) => r.name.startsWith(prefix));
      }, data.prefix);

      for (const o of orphans) {
        await page
          .evaluate(
            async ({ orgId, id }: { orgId: string; id: string }) => {
              const csrf =
                document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') ?? '';
              const res = await fetch(`/api/v1/o/${orgId}/knowledge_repositories/${id}`, {
                method: 'DELETE',
                headers: { 'X-CSRF-Token': csrf, Accept: 'application/json' },
                credentials: 'include',
              });
              return res.status;
            },
            { orgId: aditionalOrgId, id: o.id },
          )
          .catch(() => null);
      }
    } finally {
      await ctx.close();
    }
  });

  test('TC3 — Bulk-create de 10 repositórios com Fonte+Recurso no adicional isola do principal', async ({
    browser,
  }, testInfo) => {
    // Bulk-create + uploads é caro: 10 repos × (create + 1 Fonte + 1 Recurso) ≈ 6-10 min em staging.
    test.setTimeout(20 * 60_000);

    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Ambientes adicionais - Isolamento de repositórios');
    await allure.story(
      'TC3 — Bulk-create de repositórios com conteúdo rico no adicional não vaza pro principal',
    );
    await allure.severity('critical');

    const prefix = `${data.prefix} w${testInfo.workerIndex}-${Date.now()}`;

    await allure.step(`1. Criar ${data.count} repositórios no ADICIONAL com Fonte+Recurso`, async () => {
      const ctx = await browser.newContext({
        storageState: ADITIONAL_STORAGE_PATH,
        baseURL: aditional.baseUrl,
      });
      const page = await ctx.newPage();
      try {
        const formPage = new KnowledgeRepositoryFormPage(page, aditionalOrgId);

        for (let i = 1; i <= data.count; i++) {
          const name = `${prefix} #${i}`;
          const source = data.sources[i % data.sources.length]!;
          const resource = data.resources[i % data.resources.length]!;

          // 1.a — Criar repositório (Identificação)
          await formPage.goToCreate();
          await formPage.fillName(name);
          await formPage.fillDescription(`${data.description} (#${i})`);
          await formPage.clickSalvar();
          await expect(page).toHaveURL(/knowledge_repositories\/\d+\/edit/, { timeout: 30_000 });
          createdNames.push(name);

          // 1.b — Anexar Fonte de conhecimento
          await formPage.openSourcesTab();
          await formPage.clickAdicionarFonte();
          await formPage.fillSourceName(`Fonte ${source.label} #${i}`);
          await formPage.attachFile(source.file);
          await formPage.clickSalvarSubForm();
          await page.waitForURL(/edit\?tab=sources/, { timeout: 30_000 });
          await expect(formPage.getSourceRow(`Fonte ${source.label} #${i}`)).toBeVisible({
            timeout: 15_000,
          });

          // 1.c — Anexar Recurso de mídia
          await formPage.openResourcesTab();
          await formPage.clickAdicionarRecurso();
          await formPage.fillResourceName(`Recurso ${resource.label} #${i}`);
          await formPage.attachFile(resource.file);
          await formPage.clickSalvarSubForm();
          await page.waitForURL(/edit\?tab=resources/, { timeout: 30_000 });
          await expect(formPage.getResourceRow(`Recurso ${resource.label} #${i}`)).toBeVisible({
            timeout: 15_000,
          });
        }
      } finally {
        await ctx.close();
      }
    });

    await allure.step(`2. Validar que os ${data.count} repositórios aparecem na listagem do ADICIONAL`, async () => {
      const ctx = await browser.newContext({
        storageState: ADITIONAL_STORAGE_PATH,
        baseURL: aditional.baseUrl,
      });
      const page = await ctx.newPage();
      try {
        const listPage = new KnowledgeRepositoryListPage(page, aditionalOrgId);
        await listPage.goToList();
        await listPage.searchByName(prefix);
        // Aguarda a tabela mostrar pelo menos `count` linhas — searchByName usa
        // debounce server-side, então pode haver delay até backend retornar.
        await expect.poll(() => listPage.getRowCount(), {
          timeout: 20_000,
          intervals: [500, 1000, 2000],
        }).toBeGreaterThanOrEqual(data.count);
      } finally {
        await ctx.close();
      }
    });

    await allure.step('3. Validar AUSÊNCIA dos repositórios na listagem do PRINCIPAL', async () => {
      const ctx = await browser.newContext({ storageState: PRINCIPAL_STORAGE });
      const page = await ctx.newPage();
      try {
        const listPage = new KnowledgeRepositoryListPage(page);
        await listPage.goToList();
        await listPage.searchByName(prefix);
        expect(await listPage.getRowCount()).toBe(0);
      } finally {
        await ctx.close();
      }
    });
  });
});
