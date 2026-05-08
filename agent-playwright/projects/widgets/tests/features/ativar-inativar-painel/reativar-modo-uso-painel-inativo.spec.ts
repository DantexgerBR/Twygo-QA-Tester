// Testsuite: Ativar / Inativar painel
// TC4 — STATUS: BLOCKED-BY-SEED. Cenário composto: requer (1) "Painel QA Teste"
// inativo + (2) menu de modo de uso vinculado a esse painel via campo
// "Modelo de página" e também inativo. Sem isso o trigger do modal não roda.
// Re-exploração live em 2026-05-06: a aba list-tab dos modos de uso lista
// apenas Colaborador e Aluno, sem switch de ativação POR LINHA — os switches
// de menu vivem em /use_modes/{id}/edit?tab=items (`#menu-enabled-{menuId}`).

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { PaineisListPage } from '../../../pages/PaineisListPage.js';

test.use({ viewport: { width: 1920, height: 1080 } });

test.describe('Ativar / Inativar painel', () => {
  test('Tentar reativar menu de modo de uso vinculado a painel inativo exibe modal', async ({
    page,
  }) => {
    test.fixme(
      true,
      'requer (1) "Painel QA Teste" inativo + (2) menu de modo de uso vinculado a esse painel (campo "Modelo de página") e inativo. Cenário não reproduzível no seed atual (sem Painel QA Teste; menus seedados não têm vínculo conhecido com painéis inativos). Selectors do modal e da row do menu específico a confirmar live quando seed existir.',
    );

    await allure.epic('Twygo - Widgets');
    await allure.feature('Ativar / Inativar painel');
    await allure.story(
      'Tentar reativar menu de modo de uso vinculado a painel inativo exibe modal',
    );
    await allure.severity('critical');
    await allure.label('executionType', 'automated');

    const paineis = new PaineisListPage(page);

    await allure.step(
      '1. Acessar Menu > Modos de uso (aba list-tab)',
      async () => {
        await paineis.goToModosDeUso();
      },
    );

    await allure.step(
      '2. Tentar ativar o menu vinculado a "Painel QA Teste" e verificar modal',
      async () => {
        // REVISAR: o XML descreve "switch de ativação do menu" mas a UI atual
        // não tem switch por linha de modo de uso na aba list-tab — os
        // switches de menu vivem dentro do editor (use_modes/{id}/edit?tab=items)
        // como #menu-enabled-{menuId}. Caller futuro deve abrir o editor do
        // modo de uso vinculado, navegar para tab Menu, e clicar no switch
        // do menu específico (texto a definir quando o seed existir).
        // Mantemos o spec como skeleton para preservar a intenção do XML.
        await expect(paineis.getBlockedModal()).toBeVisible();
        await expect(paineis.getBlockedModalTitle()).toContainText(
          /painel.*inativo|n[aã]o pode ser reativado/i,
        );
      },
    );

    await allure.step(
      '3. Fechar o modal e verificar que o menu permanece inativo',
      async () => {
        await paineis.closeBlockedModal();
        // Asserção de que o menu permanece inativo será pluggada quando
        // soubermos qual menu específico é o vinculado (via seed).
      },
    );
  });
});
