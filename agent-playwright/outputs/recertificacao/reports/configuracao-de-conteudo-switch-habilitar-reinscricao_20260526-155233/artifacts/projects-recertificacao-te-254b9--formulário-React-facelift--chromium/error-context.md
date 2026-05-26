# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc5-paridade-haml-react.spec.ts >> Configuração de Conteúdo (Switch "Habilitar reinscrição") >> TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)
- Location: projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc5-paridade-haml-react.spec.ts:45:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('checkbox', { name: /Habilitar reinscrição/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 10000ms
  - waiting for getByRole('checkbox', { name: /Habilitar reinscrição/i })

```

# Page snapshot

```yaml
- heading "We're sorry, but something went wrong." [level=1] [ref=e3]
```

# Test source

```ts
  1  | import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
  2  | import * as allure from 'allure-js-commons';
  3  | import { resolve } from 'node:path';
  4  | import { ContentEditPage } from '../../../pages/ContentEditPage.js';
  5  | import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';
  6  | 
  7  | const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
  8  | 
  9  | test.describe('Configuração de Conteúdo (Switch "Habilitar reinscrição")', () => {
  10 |   // Seed auto-suficiente via SeedAdminPage (skill `provisionar-seed` v1.3):
  11 |   // beforeAll cria curso com defaults (has_recertification=false por
  12 |   // omissão). O TC toggla o switch entre as 2 telas (HAML legado `/e/{id}/edit`
  13 |   // e React facelift `/contents/{id}/edit`) e valida paridade do
  14 |   // atributo `events.has_recertification`. afterAll deleta o curso.
  15 |   let cursoId: number;
  16 |   let cursoName: string;
  17 | 
  18 |   test.beforeAll(async ({ browser }, testInfo) => {
  19 |     cursoName = `Curso Recertificação TC5 w${testInfo.workerIndex}-${Date.now()}`;
  20 |     const context = await browser.newContext({ storageState: STORAGE_PATH });
  21 |     const page = await context.newPage();
  22 |     try {
  23 |       const seed = new SeedAdminPage(page);
  24 |       cursoId = await seed.createCurso({
  25 |         name: cursoName,
  26 |         hasRecertification: false,
  27 |       });
  28 |     } finally {
  29 |       await context.close();
  30 |     }
  31 |   });
  32 | 
  33 |   test.afterAll(async ({ browser }) => {
  34 |     if (!cursoId) return;
  35 |     const context = await browser.newContext({ storageState: STORAGE_PATH });
  36 |     const page = await context.newPage();
  37 |     try {
  38 |       const seed = new SeedAdminPage(page);
  39 |       await seed.deleteCursoByIdSafe(cursoId);
  40 |     } finally {
  41 |       await context.close();
  42 |     }
  43 |   });
  44 | 
  45 |   test('TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)', async ({
  46 |     page,
  47 |   }) => {
  48 |     await allure.epic('Twygo - Recertificação');
  49 |     await allure.feature('Configuração de Conteúdo (Switch "Habilitar reinscrição")');
  50 |     await allure.story(
  51 |       'Paridade do switch entre formulário HAML e formulário React (facelift)',
  52 |     );
  53 |     await allure.severity('normal');
  54 | 
  55 |     const contentEdit = new ContentEditPage(page);
  56 | 
  57 |     await allure.step(
  58 |       '1. Editar o curso na tela HAML, ativar o switch e salvar → has_recertification = true',
  59 |       async () => {
  60 |         await contentEdit.openEditHamlById(cursoId);
> 61 |         await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
     |                                                                   ^ Error: expect(locator).toBeVisible() failed
  62 |         await contentEdit.setHabilitarReinscricao(true);
  63 |         await contentEdit.save();
  64 |         await contentEdit.expectSaveSuccess();
  65 |       },
  66 |     );
  67 | 
  68 |     await allure.step(
  69 |       '2. Acessar o MESMO curso pela tela React → switch carrega ligado',
  70 |       async () => {
  71 |         await contentEdit.openEditReactById(cursoId);
  72 |         await expect(contentEdit.getHabilitarReinscricaoSwitch()).toBeVisible();
  73 |         expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(true);
  74 |       },
  75 |     );
  76 | 
  77 |     await allure.step('3. Desativar o switch na tela React e salvar', async () => {
  78 |       await contentEdit.setHabilitarReinscricao(false);
  79 |       await contentEdit.save();
  80 |       await contentEdit.expectSaveSuccess();
  81 |     });
  82 | 
  83 |     await allure.step(
  84 |       '4. Recarregar a edição na tela HAML → switch aparece desligado (mesma coluna gravada)',
  85 |       async () => {
  86 |         await contentEdit.openEditHamlById(cursoId);
  87 |         expect(await contentEdit.isHabilitarReinscricaoOn()).toBe(false);
  88 |       },
  89 |     );
  90 |   });
  91 | });
  92 | 
```