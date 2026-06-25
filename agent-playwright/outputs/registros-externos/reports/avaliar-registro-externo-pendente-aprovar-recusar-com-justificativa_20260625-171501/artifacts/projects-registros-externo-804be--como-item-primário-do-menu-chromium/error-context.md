# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc1-disponibilidade-avaliar-no-menu.spec.ts >> Avaliar registro externo pendente (Aprovar/Recusar com justificativa) >> Validar disponibilidade do "Avaliar" como item primário do menu
- Location: projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc1-disponibilidade-avaliar-no-menu.spec.ts:21:3

# Error details

```
Error: RN50: Externo Pendente não deve ter Editar/Excluir (achou: edit
Editar, delete
Excluir)

expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 6

- Array []
+ Array [
+   "edit
+ Editar",
+   "delete
+ Excluir",
+ ]
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
  8  | test.describe(data.suiteName, () => {
  9  |   let marker: string;
  10 | 
  11 |   test.afterAll(async ({ browser }) => {
  12 |     const ctx = await browser.newContext({ storageState: STORAGE_STATE, baseURL: getBaseUrl() });
  13 |     const page = await ctx.newPage();
  14 |     try {
  15 |       if (marker) await deleteRecordsByMarker(page, marker);
  16 |     } finally {
  17 |       await ctx.close();
  18 |     }
  19 |   });
  20 | 
  21 |   test('Validar disponibilidade do "Avaliar" como item primário do menu', async ({ page }, testInfo) => {
  22 |     await allure.epic(data.epic);
  23 |     await allure.feature(data.suiteName);
  24 |     await allure.story('Validar disponibilidade do "Avaliar" como item primário do menu');
  25 |     await allure.severity('critical');
  26 | 
  27 |     const av = new AvaliarRegistroPage(page);
  28 |     marker = makeMarker('TC1', testInfo.workerIndex);
  29 | 
  30 |     await allure.step('Pré: criar registro Externo Pendente', async () => {
  31 |       await createPendingRecord(page, marker);
  32 |       await av.goto();
  33 |       await av.search(marker);
  34 |     });
  35 | 
  36 |     await allure.step('1. Menu do Externo Pendente: "Avaliar" primário, sem Editar/Excluir (RN50)', async () => {
  37 |       const items = await av.menuItemTexts(marker);
  38 |       expect(items[0], '"Avaliar" deve ser o 1º item').toMatch(/Avaliar/i);
  39 |       // RN50: Editar/Excluir NÃO devem aparecer em Externo+Pendente.
  40 |       // BUG (laudo qa19): "Editar"/"Excluir" aparecem indevidamente → vermelho.
  41 |       const proibidos = items.filter((t) => /\bEditar\b|\bExcluir\b/i.test(t));
> 42 |       expect(proibidos, `RN50: Externo Pendente não deve ter Editar/Excluir (achou: ${proibidos.join(', ')})`).toEqual([]);
     |                                                                                                                ^ Error: RN50: Externo Pendente não deve ter Editar/Excluir (achou: edit
  43 |     });
  44 | 
  45 |     // Sub-checks dependentes de seed inexistente neste env (Externo Emitido tem
  46 |     // marker desconhecido; não há Interno Pendente) — cobertos por TC4/outras
  47 |     // suítes. Aqui validamos o núcleo da RN50 no Externo+Pendente.
  48 |   });
  49 | });
  50 | 
```