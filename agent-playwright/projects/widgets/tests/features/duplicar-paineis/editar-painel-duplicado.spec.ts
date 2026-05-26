// spec: projects/widgets/specs/duplicar-paineis-plan.md
// seed: projects/widgets/tests/features/ativar-inativar-painel/ativar-painel-inativo.spec.ts
// Testsuite: Duplicar painéis — TC1.4
// STATUS: READY (auto-seed via beforeAll/afterAll). Cria painel original,
// duplica no beforeAll, e valida que a cópia pode ser editada, que a
// edição persiste e que o original permanece inalterado.

import { resolve } from 'node:path';
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';
import { PainelFormPage } from '../../../pages/PainelFormPage.js';
import { editarPainelDuplicadoData as data } from './editar-painel-duplicado.data.js';

test.use({ viewport: { width: 1920, height: 1080 } });

const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

test.describe('Duplicar painéis', () => {
  // panelName e copyName gerados worker-isolated em runtime para evitar
  // colisão paralela. editedName vem do .data.ts — é o valor fixo do TC.
  let panelName: string;
  let copyName: string;

  test.beforeAll(async ({ browser }, testInfo) => {
    panelName = `${data.panelNamePrefix} w${testInfo.workerIndex}-${Date.now()}`;
    copyName = `${panelName} (cópia)`;

    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);

      // Cria o painel original — nasce ATIVO por default.
      await paineis.createPanel({ name: panelName });

      // Navega à listagem para duplicar.
      await paineis.goToList();
      await paineis.setViewMode('lista');

      // Duplica via ícone content_copy da linha do painel original.
      await paineis.getRowByName(panelName).locator('[data-icon="content_copy"]').click();

      // Aguarda toast de confirmação e a linha da cópia na listagem.
      await expect(
        page.locator('.chakra-toast').filter({ hasText: 'Painel duplicado com sucesso' }).first(),
      ).toBeVisible();
      await expect(paineis.getRowByName(copyName)).toBeVisible();
    } finally {
      await ctx.close();
    }
  });

  test.afterAll(async ({ browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_STATE });
    const page = await ctx.newPage();
    try {
      const paineis = new PaineisListPage(page);
      await paineis.goToList();
      // A cópia foi renomeada para data.editedName — deletar pelo nome editado.
      await paineis.deletePanelByNameSafe(data.editedName);
      await paineis.deletePanelByNameSafe(panelName);
    } finally {
      await ctx.close();
    }
  });

  test('Editar painel duplicado', async ({ page }) => {
    await allure.epic('Twygo - Widgets');
    await allure.feature('Duplicar painéis');
    await allure.story('Editar painel duplicado');
    await allure.severity('normal');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);
    const painelForm = new PainelFormPage(page);

    // 1. Acessar a listagem e verificar que painel original e cópia estão visíveis
    await allure.step(
      '1. Acessar a listagem de Painéis e verificar que painel original e cópia estão presentes',
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');
        await expect(paineis.getRowByName(panelName)).toBeVisible();
        await expect(paineis.getRowByName(copyName)).toBeVisible();
      },
    );

    // 2. Clicar no ícone Editar da cópia e verificar que o form abre com o nome da cópia
    await allure.step(
      `2. Clicar no ícone 'Editar' da linha "${copyName}" e verificar que o form exibe o nome da cópia`,
      async () => {
        await paineis.getRowByName(copyName).locator('[data-icon="edit"]').click();
        await page.waitForURL(/\/panels\/\d+\/edit/);
        await expect(painelForm.getNomeInput()).toHaveValue(copyName);
      },
    );

    // 3. Preencher novo nome e salvar — URL não redireciona; campo reflete o novo valor
    await allure.step(
      `3. Alterar o nome para "${data.editedName}" e salvar`,
      async () => {
        await painelForm.getNomeInput().fill(data.editedName);
        await painelForm.getSaveButton().click();
        // Pós-save: URL permanece em /panels/{copyId}/edit (não volta à listagem).
        // Verificamos que o campo Nome reflete o novo valor salvo.
        await expect(painelForm.getNomeInput()).toHaveValue(data.editedName);
      },
    );

    // 4. Voltar à listagem e verificar estado final dos três nomes
    await allure.step(
      '4. Navegar à listagem e verificar que o nome editado aparece, o nome antigo da cópia sumiu e o original permanece',
      async () => {
        await paineis.goToList();
        await paineis.setViewMode('lista');

        // Linha com nome editado deve estar visível.
        await expect(paineis.getRowByName(data.editedName)).toBeVisible();

        // Linha com o nome antigo da cópia NÃO deve mais existir (foi renomeada).
        await expect(paineis.getRowByName(copyName)).toHaveCount(0);

        // Original permanece inalterado — a edição da cópia não afeta o original.
        await expect(paineis.getRowByName(panelName)).toBeVisible();
      },
    );
  });
});
