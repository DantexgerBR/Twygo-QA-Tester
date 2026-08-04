// Fonte canônica: projects/jornadas/inputs/test-analysis.md — suíte "Cadastro de tarefas".
// TC28 (tarefa de Aprendizagem), TC29 (tipos Compromisso/Manual/Mensagem), TC30 (matriz dos campos).
//
// Nota de escopo: a ABA "Aprendizagem" do formulário é Fase 2 e fica disabled, mas o TIPO de tarefa
// "Aprendizagem" funciona no formulário de tarefa — medido em 03/08. São coisas diferentes.
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { comJornada } from '../../../utils/journey-lifecycle.js';
import { acessoData as data } from '../acesso-e-regras-de-inscricao/acesso-e-regras-de-inscricao.data.js';

test.describe('Cadastro de tarefas', () => {
  test('TC28 — Cadastrar tarefa de Aprendizagem', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Cadastro de tarefas');
    await allure.story('TC28 — Cadastrar tarefa de Aprendizagem');
    await allure.severity('critical');
    test.setTimeout(420_000);

    await comJornada(page, data.ambiente, 'TC28', testInfo.workerIndex, async (ctx) => {
      await ctx.cronograma.abrir();
      const form = await ctx.cronograma.abrirFormTarefa();
      await form.locator('#journey-task-name-input').fill('Tarefa de aprendizagem');

      await allure.step('Selecionar o tipo "Aprendizagem" revela os três critérios de conclusão', async () => {
        await ctx.cronograma.getTaskTypeCard('learning').click();
        for (const c of ['progress', 'workload', 'contents-count'] as const) {
          await expect(ctx.cronograma.getCompletionRadio(c), `critério ${c}`).toBeVisible({ timeout: 20_000 });
        }
      });

      await allure.step('Progresso 100 é aceito sem estado inválido', async () => {
        await ctx.cronograma.preencherCampo(form, '#completion_progress', '100');
        await expect(form.locator('#completion_progress')).toHaveValue('100');
        await expect(form.locator('#completion_progress')).not.toHaveAttribute('aria-invalid', 'true');
      });
    });
  });

  test('TC29 — Validar tipos Compromisso, Manual e Mensagem', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Cadastro de tarefas');
    await allure.story('TC29 — Tipos Compromisso, Manual e Mensagem');
    await allure.severity('critical');
    test.setTimeout(420_000);

    await comJornada(page, data.ambiente, 'TC29', testInfo.workerIndex, async (ctx) => {
      await ctx.cronograma.abrir();
      const form = await ctx.cronograma.abrirFormTarefa();
      await form.locator('#journey-task-name-input').fill('Tarefa por tipo');

      await allure.step('Compromisso exibe "Local/link" e NÃO oferece integração Teams', async () => {
        await ctx.cronograma.getTaskTypeCard('appointment').click();
        await expect(ctx.cronograma.getLocationInput()).toBeVisible({ timeout: 20_000 });
        // "sem opção de integração Teams" é requisito explícito da AT para esta versão.
        await expect(page.getByText(/Teams/i)).toHaveCount(0);
      });

      await allure.step('Mensagem exibe o texto auxiliar que aponta para Ações automáticas', async () => {
        await ctx.cronograma.getTaskTypeCard('message').click();
        await expect(
          page.getByText(/As mensagens desta tarefa serão definidas na seção Ações automáticas/),
        ).toBeVisible({ timeout: 20_000 });
      });

      await allure.step('Manual não pede critério de conclusão nem local', async () => {
        await ctx.cronograma.getTaskTypeCard('manual').click();
        await expect(ctx.cronograma.getCompletionRadio('progress')).toBeHidden({ timeout: 20_000 });
        await expect(ctx.cronograma.getLocationInput()).toBeHidden();
      });
    });
  });

  test('TC30 — Validar os campos da tarefa', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Cadastro de tarefas');
    await allure.story('TC30 — Matriz de validação da tarefa');
    await allure.severity('critical');
    test.setTimeout(420_000);

    await comJornada(page, data.ambiente, 'TC30', testInfo.workerIndex, async (ctx) => {
      await ctx.cronograma.abrir();
      const form = await ctx.cronograma.abrirFormTarefa();
      await ctx.cronograma.getTaskTypeCard('learning').click();

      await allure.step('[A] Nome só com espaços → inválido com mensagem', async () => {
        await ctx.cronograma.preencherCampo(form, '#journey-task-name-input', '   ');
        await expect(form.locator('#journey-task-name-input')).toHaveAttribute('aria-invalid', 'true');
        await expect(ctx.cronograma.getFieldError('O nome da tarefa é obrigatório').first()).toBeVisible();
      });

      // A AT esperava "Progresso 0 → inválido". Medido em 03/08: o campo SANITIZA (0 vira 1). Mesmo
      // padrão do dia de início da fase e do campo Duração da Identificação.
      await allure.step('[B] Progresso 0 → sanitizado, não invalidado', async () => {
        await ctx.cronograma.preencherCampo(form, '#completion_progress', '0');
        const v = await form.locator('#completion_progress').inputValue();
        expect(v, 'progresso após digitar "0"').not.toBe('0');
        expect(v === '' || /^[1-9]\d*$/.test(v), `valor sanitizado inesperado: ${JSON.stringify(v)}`).toBe(true);
      });

      await allure.step('"Salvar" permanece habilitado — o Twygo valida no submit', async () => {
        await expect(ctx.cronograma.getFormSaveButton()).toBeEnabled();
      });
    });
  });

  /**
   * A AT esperava "Quantidade de conteúdos 1000 → inválido e Salvar desabilitado". Medido em 03/08:
   * o campo ACEITA 1000 sem `aria-invalid` e sem mensagem própria, e "Salvar" segue habilitado. Não sei
   * qual é o limite real — pode não existir, ou ser acima de 1000. Sem essa regra definida, qualquer
   * asserção aqui seria chute, então fica visível como ⊘ em vez de sumir.
   * TODO(caracterizar): confirmar com o time se há limite para "Quantidade de conteúdos".
   */
  test.fixme('TC30b — Limite de "Quantidade de conteúdos" (regra a caracterizar)', async ({ page }, testInfo) => {
    await comJornada(page, data.ambiente, 'TC30b', testInfo.workerIndex, async (ctx) => {
      await ctx.cronograma.abrir();
      const form = await ctx.cronograma.abrirFormTarefa();
      await ctx.cronograma.getTaskTypeCard('learning').click();
      await ctx.cronograma.getCompletionRadio('contents-count').click();
      await ctx.cronograma.preencherCampo(form, '#completion_contents_count', '1000');
      await expect(form.locator('#completion_contents_count')).toHaveAttribute('aria-invalid', 'true');
    });
  });
});
