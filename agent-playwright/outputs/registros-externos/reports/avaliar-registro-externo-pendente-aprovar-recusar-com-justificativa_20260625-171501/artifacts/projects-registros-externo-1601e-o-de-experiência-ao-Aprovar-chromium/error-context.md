# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc3-obrigatoriedade-tipo-ao-aprovar.spec.ts >> Avaliar registro externo pendente (Aprovar/Recusar com justificativa) >> Validar obrigatoriedade do Tipo de experiência ao Aprovar
- Location: projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc3-obrigatoriedade-tipo-ao-aprovar.spec.ts:24:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.chakra-form-control').filter({ has: locator('label').filter({ hasText: /^Tipo de experiência/ }) }).first().getByText(/Campo obrigatório/i).first()
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 8000ms
  - waiting for locator('.chakra-form-control').filter({ has: locator('label').filter({ hasText: /^Tipo de experiência/ }) }).first().getByText(/Campo obrigatório/i).first()
    - waiting for" https://registrosf2.stage.twygoead.com/o/37079/records" navigation to finish...
    - navigated to "https://registrosf2.stage.twygoead.com/o/37079/records"

```

# Test source

```ts
  1  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  2  | import * as allure from 'allure-js-commons';
  3  | import { AvaliarRegistroPage } from '../../../pages/AvaliarRegistroPage.js';
  4  | import { getBaseUrl } from '../../../../../src/utils/environment.js';
  5  | import { createPendingRecord, deleteRecordsByMarker } from '../../../data/records-api.js';
  6  | import { avaliarData as data, makeMarker, STORAGE_STATE } from './avaliar.shared.data.js';
  7  | 
  8  | // Nota: o laudo QA 1.9 (card 19896) já apontou que aprovar sem "Tipo de
  9  | // experiência" NÃO exibe validação (redireciona à lista). Se o bug persistir,
  10 | // este TC fica VERMELHO documentando-o (Anti-pattern F, sem fixme).
  11 | test.describe(data.suiteName, () => {
  12 |   let marker: string;
  13 | 
  14 |   test.afterAll(async ({ browser }) => {
  15 |     const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
  16 |     const page = await ctx.newPage();
  17 |     try {
  18 |       if (marker) await deleteRecordsByMarker(page, marker);
  19 |     } finally {
  20 |       await ctx.close();
  21 |     }
  22 |   });
  23 | 
  24 |   test('Validar obrigatoriedade do Tipo de experiência ao Aprovar', async ({ page }, testInfo) => {
  25 |     await allure.epic(data.epic);
  26 |     await allure.feature(data.suiteName);
  27 |     await allure.story('Validar obrigatoriedade do Tipo de experiência ao Aprovar');
  28 |     await allure.severity('critical');
  29 | 
  30 |     const av = new AvaliarRegistroPage(page);
  31 |     marker = makeMarker('TC3', testInfo.workerIndex);
  32 | 
  33 |     await allure.step('Pré: criar Externo Pendente e abrir "Avaliar"', async () => {
  34 |       await createPendingRecord(page, marker);
  35 |       await av.goto();
  36 |       await av.search(marker);
  37 |       await av.openEvaluate(marker);
  38 |     });
  39 | 
  40 |     await allure.step('2. Aprovar com Tipo vazio → "Campo obrigatório", não aprova', async () => {
  41 |       await av.clickAprovar();
> 42 |       await expect(av.tipoError()).toBeVisible({ timeout: 8_000 });
     |                                    ^ Error: expect(locator).toBeVisible() failed
  43 |       expect(page.url(), 'não deve sair do form de avaliação').toMatch(/admin-avaliar/);
  44 |     });
  45 | 
  46 |     await allure.step('3-4. Selecionar "Curso" e aprovar → prossegue', async () => {
  47 |       await av.selectTipo('Curso');
  48 |       await av.approve();
  49 |       await expect(av.getToast(/Registro aprovado/i)).toBeVisible({ timeout: 15_000 });
  50 |     });
  51 |   });
  52 | });
  53 | 
```