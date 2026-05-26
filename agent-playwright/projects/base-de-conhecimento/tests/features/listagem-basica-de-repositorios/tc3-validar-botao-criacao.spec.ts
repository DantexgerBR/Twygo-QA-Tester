// spec: projects/base-de-conhecimento/specs/listagem-basica-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { tc3Data as data } from './tc3-validar-botao-criacao.data.js';

test.describe('Listagem básica de repositórios', () => {
  test('TC3 — Validar botão de criação na listagem', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Listagem básica de repositórios');
    await allure.story('TC3 — Validar botão de criação na listagem');
    // TC3 é "high" no AT — mapeado como 'critical' (importance 3) em Allure
    await allure.severity('critical');

    const listPage = new KnowledgeRepositoryListPage(page);

    // 1. Navegar para a listagem de repositórios
    await allure.step('1. Navegar para /o/{orgId}/knowledge_repositories e verificar listagem', async () => {
      await listPage.goToList();
      await expect(listPage.getListContainer()).toBeVisible();
    });

    // 2. Verificar presença do botão "Adicionar" e clicar nele
    await allure.step('2. Verificar que o botão "Adicionar" está visível e clicar nele', async () => {
      // Texto real confirmado no recon: role=button, name="Adicionar" (sem "+")
      const addButton = listPage.getAddButton();
      await expect(addButton).toBeVisible();
      await addButton.click();
    });

    // 3. Aguardar redirect para tela de criação e verificar aba ativa
    await allure.step('3. Verificar redirect para tela de criação e aba "Identificação" ativa', async () => {
      await expect(page).toHaveURL(data.urlCriacaoPattern);
      // REVISAR: URL exata de criação e seletor da aba — o recon não navegou até
      // a tela de criação. Se a URL for diferente (ex: `/new/step/1`), atualizar
      // `tc3Data.urlCriacaoPattern`. Se a aba usar outro atributo que não
      // `aria-selected`, inspecionar ao vivo e corrigir abaixo.
      await expect(
        page.getByRole('tab', { name: data.abaAtivaCriacao }),
      ).toHaveAttribute('aria-selected', 'true');
    });
  });
});
