// Testsuite: Ajustar nomenclatura do agente de atendimento no super admin
//
// Steps do XML:
// 1. Acessar tabela de preços do super admin > Assinatura > Manutenção da
//    tabela de preços. Verificar que "Agente de atendimento" aparece no campo
//    "Funcionalidades" (substituiu "Agente de IA").
// 2. Acessar Manutenção de assinaturas > editar contrato. Verificar que
//    "Agente de atendimento" aparece no campo "Funcionalidades" do contrato.
//
// Caminho documentado em CLAUDE.md §7.5 (Super Admin) e prose-patterns §3.5.
// orgId vem de environment.json (staging.orgId = 36602).

import { test, expect } from '../../../src/fixtures/exploratory-fixture';
import * as allure from 'allure-js-commons';
import { SuperAdminPage } from '../../../src/pages/SuperAdminPage';
import { dismissCommonModals } from '../../../src/utils/modals';
import { getOrgId } from '../../../src/utils/environment.js';

const ORG_ID = getOrgId();

test.describe('Ajustar nomenclatura do agente de atendimento no super admin', () => {
  test('Ajustar nomenclatura do agente de atendimento no super admin', async ({ page }) => {
    await allure.epic('Twygo - Gestão de Créditos de IA - Fase 2');
    await allure.feature('Ajustar nomenclatura do agente de atendimento no super admin');
    await allure.story('Ajustar nomenclatura do agente de atendimento no super admin');
    await allure.severity('critical');

    const superAdmin = new SuperAdminPage(page);
    const targetLabel = /agente\s+de\s+atendimento/i;
    const oldLabel = /agente\s+de\s+ia/i;

    await allure.step('1. Editar a tabela de preços ativa (Super Admin > Assinaturas) e validar nomenclatura no campo Funcionalidades', async () => {
      // /admin/subscription_plans só lista as tabelas; o campo "Funcionalidades"
      // só aparece dentro do form de edição da tabela ativa (Ativo = Sim).
      await superAdmin.openActivePriceTable();
      await dismissCommonModals(page);
      // O form tem várias linhas de planos; a coluna "Funcionalidades" usa
      // <select> nativos cujos <option>s carregam o nome a verificar.
      // Esperamos a tabela do form aparecer (textbox "Versão" indica que o
      // form foi carregado) e enumeramos texts de todas as <option>.
      await expect(page.getByText(/Plano por limite de usu[áa]rios ativos contratados/i).first()).toBeVisible({ timeout: 15_000 });
      const allOptionTexts = await page.locator('select option').allTextContents();
      const normalized = allOptionTexts.map((t) => t.trim()).filter(Boolean);
      expect.soft(
        normalized.some((t) => targetLabel.test(t)),
        `Esperava "Agente de atendimento" entre as options de selects da tabela. Total options: ${normalized.length}. Amostra: ${normalized.slice(0, 30).join(' | ')}`,
      ).toBe(true);
      expect.soft(
        normalized.some((t) => oldLabel.test(t)),
        `"Agente de IA" ainda aparece nas options — nomenclatura antiga não removida.`,
      ).toBe(false);
    });

    await allure.step(`2. Editar contrato vigente da org ${ORG_ID} e validar nomenclatura no campo Funcionalidades`, async () => {
      await superAdmin.openEditContract(ORG_ID);
      await dismissCommonModals(page);
      // O form abre na aba "Dados da organização"; precisamos clicar na aba
      // "Contratos" para acessar o campo "Funcionalidades" do contrato vigente.
      await expect(page.getByText(/edi[çc][ãa]o de assinatura/i).first()).toBeVisible({ timeout: 15_000 });
      await page.getByText('Contratos', { exact: true }).first().click();
      await page.waitForLoadState('networkidle').catch(() => null);
      // Inspeciona DOM completo: textos visíveis E options de select.
      const allTexts = await page.locator('body').allTextContents();
      const allOptions = await page.locator('select option').allTextContents();
      const corpus = [...allTexts, ...allOptions].join(' ').toLowerCase();
      expect.soft(
        targetLabel.test(corpus),
        '"Agente de atendimento" não foi encontrado na aba Contratos do form de assinatura.',
      ).toBe(true);
      expect.soft(
        oldLabel.test(corpus),
        '"Agente de IA" ainda aparece na aba Contratos — nomenclatura antiga não removida.',
      ).toBe(false);
    });
  });
});
