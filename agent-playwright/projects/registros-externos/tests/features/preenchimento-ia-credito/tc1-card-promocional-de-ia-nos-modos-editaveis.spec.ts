import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { AiAutofillPage } from '../../../pages/AiAutofillPage.js';
import { findRecordIdByOrigin } from '../../../data/records-api.js';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';

const SUITE = data.suiteName;

test.describe(SUITE, () => {
  test('Validar presença do card promocional de IA nos modos editáveis (Admin: adicionar e editar)', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar presença do card promocional de IA nos modos editáveis (Admin: adicionar e editar)');
    await allure.severity('critical');

    const ai = new AiAutofillPage(page, getOrgId());

    await allure.step('1. Form "Adicionar registro" como Admin → card de IA com título, botão e disclaimer', async () => {
      await ai.goto();
      await expect(ai.cardTitle()).toBeVisible();
      await expect(ai.autofillButton()).toBeVisible();
      await expect(ai.cardDisclaimer()).toBeVisible();
    });

    await allure.step('3. Form de EDIÇÃO de um registro Externo (Admin) → card de IA exibido', async () => {
      // Usa um registro Externo REAL já existente (sem criar seed) — origem
      // "external". Read-only: abre o /edit e confere o card; não salva.
      const externoId = await findRecordIdByOrigin(page, 'extern');
      test.skip(externoId === null, 'seed ausente: nenhum registro Externo na org para abrir em edição');
      await ai.gotoEdit(externoId as number);
      await expect(ai.cardTitle()).toBeVisible();
      await expect(ai.autofillButton()).toBeVisible();
    });
  });

  // fixme: o usuário de teste da org 37093 NÃO possui o perfil "Aluno" no
  // popover (recon 2026-06-29: só Administrador + Lider de equipe). A visão
  // Aluno do card (TC1 passo 1) exige credencial/perfil Aluno na org.
  // Destinatário: QA Lead (seed/credencial). Matriz F do CLAUDE.md §7.6.
  test.fixme('Validar card de IA no form de adição como Aluno (perfil Aluno ausente)', async () => {
    // seed/credencial ausente: org 37093 não expõe perfil Aluno para o user de teste.
  });

  // fixme: passos 4/5 — ausência do card em "Visualizar" e "Avaliar". Modos
  // difíceis de tornar determinísticos: "Visualizar" abre o certificado
  // standalone em nova aba (sem form), e "Avaliar" depende de um registro
  // Pendente estável (há só 1 na org, consumível por outras suítes). Cobrir
  // exigiria seed dedicado de Pendente. Destinatário: QA Lead. Matriz F §7.6.
  test.fixme('Validar ausência do card de IA em Visualizar e Avaliar (passos 4-5)', async () => {
    // seed ausente: Pendente estável p/ Avaliar; Visualizar abre cert em nova aba.
  });
});
