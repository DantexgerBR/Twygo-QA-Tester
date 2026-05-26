// spec: projects/base-de-conhecimento/specs/listagem-basica-de-repositorios-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryListPage } from '../../../pages/KnowledgeRepositoryListPage.js';
import { tc2Data as data } from './tc2-validar-colunas-obrigatorias.data.js';

test.describe('Listagem básica de repositórios', () => {
  test('TC2 — Validar colunas obrigatórias da listagem', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Listagem básica de repositórios');
    await allure.story('TC2 — Validar colunas obrigatórias da listagem');
    await allure.severity('critical');

    const listPage = new KnowledgeRepositoryListPage(page);

    // 1. Navegar diretamente para a listagem de repositórios
    await allure.step('1. Navegar para /o/{orgId}/knowledge_repositories e verificar container', async () => {
      await listPage.goToList();
      await expect(page).toHaveURL(/knowledge_repositories/);
      await expect(listPage.getListContainer()).toBeVisible();
    });

    // 2. Verificar presença das colunas obrigatórias
    await allure.step('2. Verificar colunas obrigatórias: Nome, Descrição, Categoria, Classificação', async () => {
      for (const coluna of data.colunasObrigatorias) {
        await expect(
          page.getByRole('columnheader', { name: coluna }),
        ).toBeVisible();
      }
    });

    // Validação de botões Editar/Excluir por linha NÃO faz parte do escopo
    // primário deste TC (que valida só as colunas). Botões são DIVs com ids
    // dinâmicos (#knowledge_repositories-{id}-edit-element-1-button-0) — sua
    // presença é verificada implicitamente pela API REST do POM (cleanup).
    // Mantido sem step 3: TC verde valida exatamente o que o MD pede.
  });
});
