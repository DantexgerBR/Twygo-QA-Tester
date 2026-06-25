# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc2-form-modo-avaliacao.spec.ts >> Avaliar registro externo pendente (Aprovar/Recusar com justificativa) >> Validar form em modo avaliação (banner, campos e rodapé)
- Location: projects\registros-externos\tests\features\avaliar-registro-externo-pendente\tc2-form-modo-avaliacao.spec.ts:21:3

# Error details

```
Error: RN51: banner "Avaliação pendente" ausente

expect(locator).toBeVisible() failed

Locator: getByText(/Avaliação pendente/i).first()
Expected: visible
Timeout: 8000ms
Error: element(s) not found

Call log:
  - RN51: banner "Avaliação pendente" ausente with timeout 8000ms
  - waiting for getByText(/Avaliação pendente/i).first()

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
  21 |   test('Validar form em modo avaliação (banner, campos e rodapé)', async ({ page }, testInfo) => {
  22 |     await allure.epic(data.epic);
  23 |     await allure.feature(data.suiteName);
  24 |     await allure.story('Validar form em modo avaliação (banner, campos e rodapé)');
  25 |     await allure.severity('critical');
  26 | 
  27 |     const av = new AvaliarRegistroPage(page);
  28 |     marker = makeMarker('TC2', testInfo.workerIndex);
  29 | 
  30 |     await allure.step('Pré: criar Externo Pendente e abrir "Avaliar"', async () => {
  31 |       await createPendingRecord(page, marker);
  32 |       await av.goto();
  33 |       await av.search(marker);
  34 |       await av.openEvaluate(marker);
  35 |     });
  36 | 
  37 |     // DIVERGÊNCIA RN51 (achado 2026-06-25): o modo "Avaliar" abre um form com
  38 |     // cabeçalho "Registros > Editar", campos editáveis (Website/Evidência/Pessoas)
  39 |     // e SEM o banner "Avaliação pendente". soft-asserts documentam cada ponto.
  40 |     await allure.step('2. Banner amarelo "Avaliação pendente"', async () => {
> 41 |       await expect.soft(av.bannerPendente(), 'RN51: banner "Avaliação pendente" ausente').toBeVisible({ timeout: 8_000 });
     |                                                                                           ^ Error: RN51: banner "Avaliação pendente" ausente
  42 |     });
  43 | 
  44 |     await allure.step('3. Demais campos desabilitados (ex.: Carga horária)', async () => {
  45 |       expect.soft(await av.isInputDisabledByName('workload_seconds'), 'RN51: Carga horária deveria estar desabilitada').toBe(true);
  46 |     });
  47 | 
  48 |     await allure.step('5. Rodapé com Aprovar, Recusar e Cancelar', async () => {
  49 |       await expect.soft(av.aprovarButton()).toBeVisible();
  50 |       await expect.soft(av.recusarButton()).toBeVisible();
  51 |       await expect.soft(av.cancelarButton()).toBeVisible();
  52 |     });
  53 |   });
  54 | });
  55 | 
```