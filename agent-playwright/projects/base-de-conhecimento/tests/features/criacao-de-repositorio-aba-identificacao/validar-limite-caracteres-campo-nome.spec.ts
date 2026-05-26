// spec: projects/base-de-conhecimento/specs/criacao-de-repositorio-aba-identificacao-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { KnowledgeRepositoryFormPage } from '../../../pages/KnowledgeRepositoryFormPage.js';
import { tc4Data as data } from './validar-limite-caracteres-campo-nome.data.js';

test.describe('Criação de repositório - Aba Identificação', () => {
  // Audit chrome-devtools-mcp 2026-05-21: frontend tem validação client-side
  // (Yup/Zod) que mostra inline error "O nome deve ter no máximo 255 caracteres"
  // + aria-invalid="true" quando o input excede 255 chars. Form NÃO submete
  // (Save fica no-op). Spec destravado validando o feedback visual ao usuário.
  //
  // TC read-only quanto a estado: form não submete — sem afterAll de cleanup.
  test('TC4 — Validar limite de caracteres do campo Nome', async ({ page }) => {
    await allure.epic('Twygo - Base de Conhecimento');
    await allure.feature('Criação de repositório - Aba Identificação');
    await allure.story('TC4 — Validar limite de caracteres do campo Nome');
    await allure.severity('normal');

    const formPage = new KnowledgeRepositoryFormPage(page);

    // 1. Acessar a tela de criação diretamente
    await allure.step('1. Acessar a tela de criação de repositório', async () => {
      await formPage.goToCreate();
      await expect(formPage.getIdentificationContainer()).toBeVisible();
      await expect(formPage.getNameInput()).toHaveValue('');
    });

    // 2. Preencher Nome com 256 chars (1 acima do limite)
    await allure.step('2. Preencher Nome com 256 chars e Descrição válida', async () => {
      await formPage.fillName(data.nomeAcimaDoLimite);
      await formPage.fillDescription(data.descricaoValida);
      // Frontend não trunca o input (maxlength ausente — confirmado pelo audit).
      await expect(formPage.getNameInput()).toHaveValue(data.nomeAcimaDoLimite);
    });

    // 3. Asserir feedback de validação inline (mensagem + aria-invalid)
    await allure.step(
      `3. Asserir mensagem inline "${data.mensagemErroInline}" e aria-invalid="true"`,
      async () => {
        // Validação Yup/Zod do React-Hook-Form dispara onBlur/onChange — basta
        // o input ter recebido o valor pra mensagem renderizar.
        const errorMsg = page.getByText(data.mensagemErroInline, { exact: false });
        await expect(errorMsg.first()).toBeVisible({ timeout: 5_000 });
        await expect(formPage.getNameInput()).toHaveAttribute('aria-invalid', 'true');
      },
    );

    // 4. Clicar Salvar e confirmar que o form NÃO submete (URL permanece em /new)
    await allure.step('4. Clicar Salvar e confirmar que o form NÃO submete', async () => {
      await formPage.clickSalvar();
      // 1.5s é suficiente pra observar que NÃO houve navegação nem toast.
      // Se o form submetesse com sucesso, a URL viraria /knowledge_repositories/{id}/edit.
      await page.waitForTimeout(1500);
      expect(page.url()).toContain('/knowledge_repositories/new');
      // Mensagem de erro continua visível (forma de feedback ao usuário).
      const errorMsg = page.getByText(data.mensagemErroInline, { exact: false });
      await expect(errorMsg.first()).toBeVisible();
    });
  });
});
