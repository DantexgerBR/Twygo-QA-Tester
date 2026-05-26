# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: projects\modelos\tests\features\listagem-e-menu-de-modelos\tc01-acessar-listagem-via-submenu-aprendizagem.spec.ts >> Listagem e Menu de Modelos >> Acessar listagem via submenu Aprendizagem
- Location: projects\modelos\tests\features\listagem-e-menu-de-modelos\tc01-acessar-listagem-via-submenu-aprendizagem.spec.ts:9:3

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /dashboard/
Received string:  "https://basedeconhecimento.stage.twygoead.com/users/login"
Timeout: 60000ms

Call log:
  - Expect "toHaveURL" with timeout 60000ms
    63 × unexpected value "https://basedeconhecimento.stage.twygoead.com/users/login"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic: U
  - generic [ref=e2]:
    - generic [ref=e3]:
      - generic "Logo - Base de conhecimento" [ref=e4]:
        - img "Logo - Base de conhecimento" [ref=e5]
        - generic:
          - img
      - img "Fechar menu" [ref=e7]
    - link "Logar" [ref=e10] [cursor=pointer]:
      - /url: /users/login
  - text: "0"
  - generic [ref=e13]:
    - generic "Logo - Base de conhecimento" [ref=e15]
    - link "Entrar" [ref=e20] [cursor=pointer]:
      - /url: /users/login
    - text: M * M * *
  - generic [ref=e26]:
    - generic "Logo - Base de conhecimento" [ref=e27]:
      - img "Logo - Base de conhecimento" [ref=e28]
    - generic [ref=e29]:
      - textbox "Login" [ref=e31]
      - textbox "Senha" [ref=e33]
      - button "Entrar" [ref=e35] [cursor=pointer]
      - link "Esqueci minha senha" [ref=e36] [cursor=pointer]:
        - /url: /users/password/new
      - link "Reenviar e-mail de confirmação" [ref=e37] [cursor=pointer]:
        - /url: /users/confirmation/new
  - generic:
    - region "Notifications-top"
    - region "Notifications-top-left"
    - region "Notifications-top-right"
    - region "Notifications-bottom-left"
    - region "Notifications-bottom"
    - region "Notifications-bottom-right"
```

# Test source

```ts
  1  | // spec: projects/modelos/specs/listagem-e-menu-de-modelos.md
  2  | // seed: tests/seed.spec.ts
  3  | 
  4  | import { test, expect } from '@playwright/test';
  5  | import * as allure from 'allure-js-commons';
  6  | import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';
  7  | 
  8  | test.describe('Listagem e Menu de Modelos', () => {
  9  |   test('Acessar listagem via submenu Aprendizagem', async ({ page }) => {
  10 |     await allure.epic('Twygo - Modelos de conteúdo');
  11 |     await allure.feature('Listagem e Menu de Modelos');
  12 |     await allure.story('Acessar listagem via submenu Aprendizagem');
  13 |     await allure.severity('critical');
  14 | 
  15 |     const modelos = new ContentModelsListPage(page);
  16 | 
  17 |     await allure.step('1. Navegar para dashboard admin e aguardar carregado', async () => {
  18 |       await modelos.gotoPlay();
> 19 |       await expect(page).toHaveURL(/dashboard/, { timeout: 60_000 });
     |                          ^ Error: expect(page).toHaveURL(expected) failed
  20 |     });
  21 | 
  22 |     await allure.step('2. Clicar em "Aprendizagem" e aguardar submenu expandido', async () => {
  23 |       await modelos.openAprendizagemMenu();
  24 |       await expect(
  25 |         page.locator('#menu a#content_models'),
  26 |       ).toBeVisible({ timeout: 10_000 });
  27 |     });
  28 | 
  29 |     await allure.step('3. Clicar em "Modelos de conteúdo" e verificar listagem carregada', async () => {
  30 |       await modelos.goToModelosFromMenu();
  31 |       await expect(page).toHaveURL(/content_models/, { timeout: 60_000 });
  32 |       await modelos.expectListingLoaded();
  33 |     });
  34 |   });
  35 | });
  36 | 
```