// spec: projects/base-de-conhecimento/specs/criacao-de-repositorio-aba-identificacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { tc2Data as data } from './validar-campo-nome-obrigatorio.data.js';

test.describe('Criação de repositório - Aba Identificação', () => {
  test('TC2 — Validar campo Nome obrigatório', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Criação de repositório - Aba Identificação');
    await allure.story('TC2 — Validar campo Nome obrigatório');
    await allure.severity('critical');

    // TC read-only quanto ao estado: form não é salvo — sem afterAll de cleanup.

    const formPage = new KnowledgeRepositoryFormPage(page);

    // 1. Acessar a tela de criação diretamente
    await allure.step('1. Acessar a tela de criação de repositório', async () => {
      await formPage.goToCreate();
      await expect(formPage.getIdentificationContainer()).toBeVisible();
      await expect(formPage.getNameInput()).toHaveValue('');
    });

    // 2. Preencher o campo "Descrição" (Nome deixado vazio intencionalmente)
    await allure.step('2. Preencher o campo "Descrição" com "Teste sem nome"', async () => {
      await formPage.fillDescription(data.descricao);
      await expect(formPage.getDescriptionInput()).toHaveValue(data.descricao);
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

    // 5. Clicar em "Salvar" sem preencher Nome e verificar mensagem de validação
    // REVISAR-FIGMA: texto exato da mensagem de validação do campo Nome
    await allure.step('5. Clicar em "Salvar" sem Nome e verificar mensagem de validação', async () => {
      await formPage.clickSalvar();
      await expect(formPage.getNameValidationMessage()).toBeVisible();
      // Repositório NÃO deve ser criado — URL permanece em /new
      await expect(page).toHaveURL(/knowledge_repositories\/new/);
    });
  });
});
