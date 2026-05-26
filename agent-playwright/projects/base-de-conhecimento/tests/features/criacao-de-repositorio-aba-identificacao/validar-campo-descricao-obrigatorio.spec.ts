// spec: projects/base-de-conhecimento/specs/criacao-de-repositorio-aba-identificacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { tc3Data as data } from './validar-campo-descricao-obrigatorio.data.js';

test.describe('Criação de repositório - Aba Identificação', () => {
  test('TC3 — Validar campo Descrição obrigatório', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Criação de repositório - Aba Identificação');
    await allure.story('TC3 — Validar campo Descrição obrigatório');
    await allure.severity('high');

    // TC read-only quanto ao estado: form não é salvo com sucesso — sem afterAll de cleanup.

    const formPage = new KnowledgeRepositoryFormPage(page);

    // 1. Acessar a tela de criação diretamente
    await allure.step('1. Acessar a tela de criação de repositório', async () => {
      await formPage.goToCreate();
      await expect(formPage.getIdentificationContainer()).toBeVisible();
      await expect(formPage.getDescriptionInput()).toHaveValue('');
    });

    // 2. Preencher o campo "Nome" (Descrição deixada vazia intencionalmente)
    await allure.step('2. Preencher o campo "Nome" com "Repositório sem descrição"', async () => {
      await formPage.fillName(data.nomeRepo);
      await expect(formPage.getNameInput()).toHaveValue(data.nomeRepo);
    });

    // 3. Selecionar "Geral" no dropdown "Categoria"
    // REVISAR: confirmar tipo de Categoria (react-select ou select nativo) ao vivo
    await allure.step('3. Selecionar "Geral" no dropdown "Categoria"', async () => {
      await formPage.selectCategory(data.categoria);
    });

    // 4. Selecionar "Interno" no dropdown "Classificação"
    // REVISAR: confirmar tipo de Classificação ao vivo
    await allure.step('4. Selecionar "Interno" no dropdown "Classificação"', async () => {
      await formPage.selectClassification(data.classificacao);
    });

    // 5. Clicar em "Salvar" sem preencher Descrição e verificar mensagem de validação
    // REVISAR-FIGMA: texto exato da mensagem — "Descrição é obrigatória" ou "Descrição é obrigatório"
    await allure.step('5. Clicar em "Salvar" sem Descrição e verificar mensagem de validação', async () => {
      await formPage.clickSalvar();
      await expect(formPage.getDescriptionValidationMessage()).toBeVisible();
      // Repositório NÃO deve ser criado — URL permanece em /new
      await expect(page).toHaveURL(/knowledge_repositories\/new/);
    });
  });
});
