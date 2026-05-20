import { test, expect } from '@playwright/test';
import * as allure from 'allure-js-commons';
import { ContentModelEditPage } from '../../../pages/ContentModelEditPage.js';

test.describe('Criação de Modelo - Aba Identificação', () => {
  test('Defaults dos switches na criação', async ({ page }) => {
    await allure.epic('Twygo - Modelos de conteúdo');
    await allure.feature('Criação de Modelo - Aba Identificação');
    await allure.story('Defaults dos switches na criação');
    await allure.severity('high');

    const editPage = new ContentModelEditPage(page);

    await allure.step('1. Abrir tela de criação', async () => {
      await editPage.gotoNew();
    });

    await allure.step('2. Validar defaults: padrão=OFF, designs=ON, ativo=ON', async () => {
      expect(await editPage.usarComoPadraoChecked(), 'Usar como modelo padrão deve estar OFF').toBe(false);
      expect(await editPage.usarDesignsSugeridosChecked(), 'Usar designs sugeridos deve estar ON').toBe(true);
      expect(await editPage.ativoChecked(), 'Ativo deve estar ON').toBe(true);
    });
  });
});
