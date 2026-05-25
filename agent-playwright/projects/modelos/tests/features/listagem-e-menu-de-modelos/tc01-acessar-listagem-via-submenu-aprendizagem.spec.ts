// spec: projects/modelos/specs/listagem-e-menu-de-modelos.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelsListPage } from '../../../pages/ContentModelsListPage.js';

test.describe('Listagem e Menu de Modelos', () => {
  test('Acessar listagem via submenu Aprendizagem', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Listagem e Menu de Modelos');
    await allure.story('Acessar listagem via submenu Aprendizagem');
    await allure.severity('critical');

    const modelos = new ContentModelsListPage(page);

    await allure.step('1. Navegar para dashboard admin e aguardar carregado', async () => {
      await modelos.gotoPlay();
      await expect(page).toHaveURL(/dashboard/, { timeout: 60_000 });
    });

    await allure.step('2. Clicar em "Aprendizagem" e aguardar submenu expandido', async () => {
      await modelos.openAprendizagemMenu();
      await expect(
        page.locator('#menu a#content_models'),
      ).toBeVisible({ timeout: 10_000 });
    });

    await allure.step('3. Clicar em "Modelos de conteúdo" e verificar listagem carregada', async () => {
      await modelos.goToModelosFromMenu();
      await expect(page).toHaveURL(/content_models/, { timeout: 60_000 });
      await modelos.expectListingLoaded();
    });
  });
});
