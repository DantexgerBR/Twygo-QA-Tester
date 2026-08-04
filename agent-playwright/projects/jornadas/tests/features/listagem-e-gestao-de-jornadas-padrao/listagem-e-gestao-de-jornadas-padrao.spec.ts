// Fonte canônica: projects/jornadas/inputs/test-analysis.md — suíte "Listagem e gestão de Jornadas Padrão".
// TC4 (dashboards, tabela e ações), TC5 (busca), TC6 (duplicar).
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { comJornada } from '../../../utils/journey-lifecycle.js';
import { JourneyListPage } from '../../../pages/JourneyListPage.js';
import { acessoData as data } from '../acesso-e-regras-de-inscricao/acesso-e-regras-de-inscricao.data.js';

/**
 * Colunas medidas ao vivo em 03/08. ⚠️ A AT dizia "Progresso médio"; a coluna real é **"Progresso"**.
 * A última vem vazia de propósito: "Ações não têm cabeçalho visível" é regra do próprio design system
 * Twygo, citada na AT.
 */
const COLUNAS_ESPERADAS = ['Nome da jornada', 'Inscrições', 'Progresso', 'Situação', 'Tipo de experiência', 'Classificação', ''];

test.describe('Listagem e gestão de Jornadas Padrão', () => {
  test('TC4 — Exibir dashboards, tabela e ações da listagem', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Listagem e gestão de Jornadas Padrão');
    await allure.story('TC4 — Dashboards, tabela e ações');
    await allure.severity('critical');
    test.setTimeout(420_000);

    // Precisa de ao menos 1 jornada pra tabela ter linha — a org fica vazia entre runs.
    await comJornada(page, data.ambiente, 'TC4', testInfo.workerIndex, async (ctx) => {
      await ctx.listagem.goto();
      await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 30_000 });

      await allure.step('Os quatro dashboards são exibidos', async () => {
        for (const t of ['Situação das Jornadas', 'Distribuição dos Inscritos', 'Tipo de Experiência', 'Classificação']) {
          await expect(ctx.listagem.getDashboard(t), `dashboard "${t}"`).toBeVisible({ timeout: 20_000 });
        }
      });

      await allure.step('A tabela exibe exatamente as colunas previstas, sem coluna "teste"', async () => {
        const cols = await ctx.listagem.colunas();
        expect(cols).toEqual(COLUNAS_ESPERADAS);
        expect(cols.some((c) => /^teste$/i.test(c)), 'coluna "teste" não deve existir').toBe(false);
      });

      await allure.step('A linha oferece editar, duplicar e excluir', async () => {
        for (const acao of ['edit', 'content_copy', 'delete'] as const) {
          await expect(ctx.listagem.getAcaoLinha(ctx.nome, acao), `ação ${acao}`).toBeVisible();
        }
      });
    });
  });

  test('TC5 — Buscar jornada pelo nome', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Listagem e gestão de Jornadas Padrão');
    await allure.story('TC5 — Busca da listagem');
    await allure.severity('critical');
    test.setTimeout(600_000);

    // Duas jornadas: sem a segunda, "filtrou" e "não filtrou" dão o mesmo resultado e o teste não prova nada.
    await comJornada(page, data.ambiente, 'TC5a', testInfo.workerIndex, async (a) => {
      await comJornada(page, data.ambiente, 'TC5b', testInfo.workerIndex, async (b) => {
        await b.listagem.goto();
        await expect(page.getByText(a.nome, { exact: true })).toBeVisible({ timeout: 30_000 });
        await expect(page.getByText(b.nome, { exact: true })).toBeVisible();

        await allure.step(`Buscar por "${b.nome}" deixa somente ela na listagem`, async () => {
          await b.listagem.buscar(b.nome);
          await expect(page.getByText(b.nome, { exact: true })).toBeVisible();
          await expect(page.getByText(a.nome, { exact: true })).toHaveCount(0);
        });

        await allure.step('Limpar a busca traz as duas de volta', async () => {
          await b.listagem.buscar('');
          await expect(page.getByText(a.nome, { exact: true })).toBeVisible({ timeout: 20_000 });
          await expect(page.getByText(b.nome, { exact: true })).toBeVisible();
        });
      });
    });
  });

  test('TC6 — Duplicar jornada', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Listagem e gestão de Jornadas Padrão');
    await allure.story('TC6 — Duplicar');
    await allure.severity('critical');
    test.setTimeout(600_000);

    await comJornada(page, data.ambiente, 'TC6', testInfo.workerIndex, async (ctx) => {
      const listagem = new JourneyListPage(page, data.ambiente);
      await listagem.goto();
      await expect(page.getByText(ctx.nome, { exact: true })).toBeVisible({ timeout: 30_000 });

      const nomeCopia = `${ctx.nome} (cópia)`;
      try {
        await allure.step('Duplicar cria linha com "(cópia)" e 0 inscrições', async () => {
          await listagem.getAcaoLinha(ctx.nome, 'content_copy').click();
          // Pode haver confirmação; se houver, o botão afirmativo é o que não é cancelar.
          const modal = page.locator('.chakra-modal__content').first();
          if (await modal.isVisible({ timeout: 5_000 }).catch(() => false)) {
            const botoes = modal.getByRole('button');
            for (let i = 0; i < (await botoes.count()); i++) {
              const t = ((await botoes.nth(i).innerText().catch(() => '')) || '').trim();
              if (t && !/cancelar|fechar|voltar|não/i.test(t)) { await botoes.nth(i).click(); break; }
            }
          }
          await listagem.goto();
          await expect(page.getByText(nomeCopia, { exact: true })).toBeVisible({ timeout: 30_000 });
          expect(await listagem.inscricoesDe(nomeCopia)).toContain('0');
        });
      } finally {
        // A cópia é registro novo: cleanup próprio, senão vira órfã (a do original é do comJornada).
        await listagem.excluirPorNome_safe(nomeCopia);
      }
    });
  });

  /**
   * Partes do TC5/TC6 da AT que não são executáveis hoje, visíveis como ⊘ em vez de sumirem:
   *
   * - **Filtros combinatórios** (Situação + Tipo de experiência + busca): os filtros vivem atrás do botão
   *   "Filtros" (drawer), e a AT tem pré-condição "Tipos de experiência, classificações e categorias
   *   previamente cadastrados" — a org 36675 não tem essa massa, então o filtro por tipo não tem valor
   *   pra selecionar. Precisa de seed de tipo de experiência (admin da org).
   * - **Proteção de exclusão por engajamento**: exige jornada com inscrito, ou seja, usuário aluno
   *   matriculado. É a onda de seed (`seed-fixtures.ts` tem `criarUsuarioAluno`/`matricularAluno`).
   * - **"Extrair dados"**: a AT/docs citam extração CSV e PDF, e não existe botão com esse nome na
   *   listagem (medido: 0 ocorrências). Confirmar se entra nesta fase.
   */
  test.fixme('TC5b/TC6b — Filtros combinatórios, exclusão com engajamento e extração (dependem de massa)', async () => {
    // Sem implementação de propósito: o bloqueio é massa/escopo, não código de teste.
  });
});
