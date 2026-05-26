// spec: projects/base-de-conhecimento/specs/criacao-de-repositorio-aba-identificacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { tc5Data as data } from './cancelar-criacao-com-alteracoes-pendentes-dispara-beforeunload.data.js';

test.describe('Criação de repositório - Aba Identificação', () => {
  // fixme: produto NÃO implementa proteção beforeunload no form de criação.
  // Confirmado 2026-05-19 via chrome-devtools-mcp: window.onbeforeunload=false,
  // click em Cancelar com form dirty navega direto pra listagem sem warning.
  // MD descreve comportamento que não existe. QA decidir:
  //   (a) bug-produto — implementar proteção contra perda de dados
  //   (b) AT desatualizado — remover TC5
  test.fixme('TC5 — Cancelar criação com alterações pendentes dispara beforeunload', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Criação de repositório - Aba Identificação');
    await allure.story('TC5 — Cancelar criação com alterações pendentes dispara beforeunload');
    await allure.severity('normal');

    // TC read-only quanto ao estado: form não é salvo — sem afterAll de cleanup.

    const formPage = new KnowledgeRepositoryFormPage(page);
    let dialogTriggered = false;

    // 1. Acessar a tela de criação diretamente
    await allure.step('1. Acessar a tela de criação de repositório', async () => {
      await formPage.goToCreate();
      await expect(formPage.getIdentificationContainer()).toBeVisible();
    });

    // 2. Preencher o campo "Nome" para deixar o form "sujo"
    await allure.step('2. Preencher o campo "Nome" para deixar o form dirty', async () => {
      await formPage.fillName(data.nomeSujo);
      await expect(formPage.getNameInput()).toHaveValue(data.nomeSujo);
    });

    // 3. Registrar handler de dialog ANTES do click e clicar em "Cancelar"
    // Padrão canônico para beforeunload: handler registrado ANTES do click,
    // dismiss chamado DENTRO do callback. O click() retorna após o dialog ser resolvido.
    // Se o handler fosse registrado APÓS o click, o evento poderia disparar
    // antes do listener estar ativo — race condition clássica de beforeunload.
    await allure.step('3. Registrar handler beforeunload e clicar em "Cancelar"', async () => {
      page.on('dialog', async (dialog) => {
        dialogTriggered = true;
        // dismiss = manter na página (o usuário escolhe não sair)
        await dialog.dismiss();
      });
      await formPage.clickCancelar();
    });

    // 4. Verificar que o diálogo foi disparado e o usuário permaneceu na página
    await allure.step('4. Verificar que beforeunload foi disparado e form permanece intacto', async () => {
      expect(dialogTriggered).toBe(true);
      // dismiss não navega — URL deve permanecer em /new
      await expect(page).toHaveURL(/knowledge_repositories\/new/);
      // Dados preenchidos antes do cancelamento devem estar preservados
      await expect(formPage.getNameInput()).toHaveValue(data.nomeSujo);
    });
  });
});
