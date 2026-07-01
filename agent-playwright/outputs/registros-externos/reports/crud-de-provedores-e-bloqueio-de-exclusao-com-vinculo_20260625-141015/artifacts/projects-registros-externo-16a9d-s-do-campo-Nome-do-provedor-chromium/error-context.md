# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\registros-externos\tests\features\crud-de-provedores-bloqueio-exclusao-vinculo\tc3-validacoes-campo-nome.spec.ts >> CRUD de Provedores e bloqueio de exclusão com vínculo >> Validações do campo "Nome" do provedor
- Location: projects\registros-externos\tests\features\crud-de-provedores-bloqueio-exclusao-vinculo\tc3-validacoes-campo-nome.spec.ts:27:3

# Error details

```
Error: "Emoji" deveria ser aceito

expect(received).toMatch(expected)

Expected pattern: /tab=event-sources-tab/
Received string:  "https://registrosf2.stage.twygoead.com/o/37079/event_sources/new"
```

# Test source

```ts
  1  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  2  | import * as allure from 'allure-js-commons';
  3  | import { ProvedoresPage } from '../../../pages/ProvedoresPage.js';
  4  | import { getBaseUrl } from '../../../../../src/utils/environment.js';
  5  | import { deleteProvidersByNameSafe } from '../../../data/event-sources-api.js';
  6  | import { provedoresData as data, STORAGE_STATE } from './provedores.shared.data.js';
  7  | import { tc3NomeMatrix, tc3AllInputs } from './tc3-validacoes-campo-nome.data.js';
  8  | 
  9  | // BUG DE PRODUTO (achado 2026-06-25): o campo "Nome" do provedor NÃO é validado
  10 | // como obrigatório — API `POST /event_sources` aceita name "" e "   " (201) e o
  11 | // form navega de volta criando provedor sem nome. RN84 exige Nome obrigatório.
  12 | // Os cenários "Vazio" e "Só espaços" abaixo ficam VERMELHOS de propósito
  13 | // (Anti-pattern F: não mascarar bug de produto com fixme) — quando o dev validar
  14 | // o campo, eles passam sem alterar o spec.
  15 | test.describe(data.suiteName, () => {
  16 |   test.afterAll(async ({ browser }) => {
  17 |     const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
  18 |     const page = await ctx.newPage();
  19 |     try {
  20 |       // limpa todos os inputs — inclusive os vazios que o bug deixa criar.
  21 |       await deleteProvidersByNameSafe(page, [...tc3AllInputs]);
  22 |     } finally {
  23 |       await ctx.close();
  24 |     }
  25 |   });
  26 | 
  27 |   test('Validações do campo "Nome" do provedor', async ({ page }) => {
  28 |     test.setTimeout(240_000); // 7 cenários × (navegar + abrir form + salvar)
  29 |     await allure.epic(data.epic);
  30 |     await allure.feature(data.suiteName);
  31 |     await allure.story('Validações do campo "Nome" do provedor');
  32 |     await allure.severity('critical');
  33 | 
  34 |     // Categoria D: nenhum input deve executar script (XSS escapado).
  35 |     let alertFired = false;
  36 |     page.on('dialog', async (d) => {
  37 |       alertFired = true;
  38 |       await d.dismiss().catch(() => undefined);
  39 |     });
  40 | 
  41 |     const prov = new ProvedoresPage(page);
  42 |     await prov.gotoTab();
  43 | 
  44 |     for (const row of tc3NomeMatrix) {
  45 |       await allure.step(`Cenário "${row.cenario}" → ${row.accepted ? 'aceito' : 'bloqueado'}`, async () => {
  46 |         await prov.gotoTab();
  47 |         await prov.openAddForm();
  48 |         await prov.fillProviderForm({ name: row.input });
  49 |         await prov.trySave();
  50 | 
  51 |         // expect.soft: toda a matriz roda mesmo com os cenários de bug vermelhos.
  52 |         if (row.accepted) {
  53 |           // aceito = salvou e voltou à listagem (acentos/emoji/script/SQL todos
  54 |           // criam). O "salvo escapado" é coberto pelo check de alertFired no fim.
  55 |           await page.waitForURL(/tab=event-sources-tab/, { timeout: 15_000 }).catch(() => undefined);
> 56 |           expect.soft(page.url(), `"${row.cenario}" deveria ser aceito`).toMatch(/tab=event-sources-tab/);
     |                                                                          ^ Error: "Emoji" deveria ser aceito
  57 |         } else {
  58 |           // ESPERADO bloquear (RN84). BUG: o produto cria provedor de nome vazio
  59 |           // e navega de volta → este soft-expect fica vermelho documentando o bug.
  60 |           await page.waitForTimeout(1_000);
  61 |           expect
  62 |             .soft(page.url(), `BUG: Nome "${row.cenario}" deveria bloquear (RN84)`)
  63 |             .toMatch(/\/event_sources\/new/);
  64 |         }
  65 |       });
  66 |     }
  67 | 
  68 |     expect(alertFired, 'nenhum alert() deve disparar (XSS escapado)').toBe(false);
  69 |   });
  70 | });
  71 | 
```