# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\listagem-e-menu-de-modelos\tc05-botao-adicionar-redireciona-criacao.spec.ts >> Listagem e Menu de Modelos >> Botão Adicionar redireciona para criação
- Location: projects\modelos\tests\features\listagem-e-menu-de-modelos\tc05-botao-adicionar-redireciona-criacao.spec.ts:6:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#content-models-add-button')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 60000ms
  - waiting for locator('#content-models-add-button')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - heading "503 Service Temporarily Unavailable" [level=1] [ref=e3]
  - separator [ref=e4]
  - generic [ref=e5]: nginx
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import * as allure from 'allure-js-commons';
  3  | import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';
  4  | 
  5  | test.describe('Listagem e Menu de Modelos', () => {
  6  |   test('Botão Adicionar redireciona para criação', async ({ page }) => {
  7  |     await allure.epic('Twygo - Modelos de conteúdo');
  8  |     await allure.feature('Listagem e Menu de Modelos');
  9  |     await allure.story('Botão Adicionar redireciona para criação');
  10 |     await allure.severity('critical');
  11 | 
  12 |     const modelos = new ContentModelsListPage(page);
  13 | 
  14 |     await allure.step('1. Acessar listagem e validar botão Adicionar visível', async () => {
  15 |       await modelos.goToList();
> 16 |       await expect(modelos.addButton()).toBeVisible({ timeout: 60_000 });
     |                                         ^ Error: expect(locator).toBeVisible() failed
  17 |     });
  18 | 
  19 |     await allure.step('2. Clicar Adicionar e validar redirect para tela de criação', async () => {
  20 |       await modelos.clickAdd();
  21 |       await expect(page).toHaveURL(/\/content_models\/new/, { timeout: 30_000 });
  22 |     });
  23 | 
  24 |     await allure.step('3. Validar aba Identificação ativa por default no form', async () => {
  25 |       const identTab = page.getByRole('tab', { name: 'Identificação', exact: true });
  26 |       await expect(identTab).toBeVisible({ timeout: 10_000 });
  27 |       await expect(identTab).toHaveAttribute('aria-selected', 'true');
  28 |     });
  29 |   });
  30 | });
  31 | 
```