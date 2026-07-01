import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { NovoRegistroExternoPage } from '../../../pages/NovoRegistroExternoPage.js';
import { preenchimentoIaData as data } from './preenchimento-ia-credito.shared.data.js';
import { tc7Data } from './tc7-uso-manual-nao-consome-credito.data.js';

const SUITE = data.suiteName;

/**
 * Prova que o fluxo de preenchimento MANUAL (sem clicar "Preencher com IA")
 * não dispara nenhum `POST /records/ai_fill`.
 *
 * NÃO PERSISTE o registro de propósito. Recon 2026-06-29 descobriu um BUG DE
 * PRODUTO: um registro externo criado manualmente por Admin nesta org
 * auto-aprova (`situation: "approved"`) e fica **indeletável** — `can_delete`
 * vem `true`, mas `DELETE /records/{id}` responde 500 "Erro ao excluir registro"
 * E o menu kebab desses registros NÃO oferece "Excluir" (só Editar/Visualizar/
 * Evidências/Histórico). Persistir aqui deixaria órfão sem cleanup possível
 * (viola Anti-pattern G). Por isso interceptamos o POST de criação e abortamos:
 * o form é preenchido e o "Salvar" é acionado, mas nada é gravado.
 *
 * Sub-caso "persistência + toast de sucesso" fica em fixme (depende do produto
 * corrigir a exclusão de registros aprovados). Destinatário: dev (bug) + QA Lead.
 */
test.describe(SUITE, () => {
  test('Validar que uso manual não consome crédito de IA', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(SUITE);
    await allure.story('Validar que uso manual não consome crédito de IA');
    await allure.severity('normal');

    // Espia toda request: se qualquer `ai_fill` sair, o teste falha.
    let aiFillFired = false;
    page.on('request', (req) => {
      if (req.url().includes('/records/ai_fill')) aiFillFired = true;
    });
    // Aborta a criação real (POST .../records exato — NÃO o /records/ai_fill, que
    // tem path mais longo e não casa este glob) pra não deixar registro órfão
    // indeletável (bug de produto — ver cabeçalho).
    await page.route('**/api/v1/o/*/records', async (route) => {
      if (route.request().method() === 'POST') return route.abort();
      return route.continue();
    });

    const form = new NovoRegistroExternoPage(page, getOrgId());

    await allure.step('1. Acessar form "Adicionar registro" → card de IA visível', async () => {
      await form.goto();
    });

    await allure.step('2. Preencher manualmente e acionar "Salvar" → nenhuma chamada de IA é disparada', async () => {
      await form.linkFirstPerson();
      await form.setProvider(tc7Data.provider);
      await form.setContent(tc7Data.content);
      await form.setExperience(tc7Data.experience);
      await form.setCategory(tc7Data.category);
      await form.setWorkload(tc7Data.workload);
      await form.setEndDate(tc7Data.endDate);
      // Aciona o Salvar (POST de criação é abortado pelo route acima → não persiste).
      await form.getSaveButton().dispatchEvent('click');
      await page.waitForTimeout(2000);
      expect(aiFillFired, 'nenhum POST /records/ai_fill deve ter sido disparado no fluxo manual').toBe(false);
    });
  });

  // fixme: validar a PERSISTÊNCIA do registro manual + toast de sucesso.
  // Bloqueado por bug de produto: registro externo criado manualmente por Admin
  // auto-aprova e fica indeletável (DELETE → 500 "Erro ao excluir registro";
  // can_delete=true porém; kebab sem "Excluir"). Persistir sem cleanup viável
  // viola Anti-pattern G. Destinatário: dev (corrigir exclusão de aprovados) + QA Lead.
  test.fixme('Validar persistência do registro manual + toast de sucesso (bug: registro indeletável)', async () => {
    // bloqueado: registro manual auto-aprovado é indeletável (DELETE 500 / sem Excluir no kebab).
  });
});
