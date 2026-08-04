// Fonte canônica: projects/jornadas/inputs/test-analysis.md — suíte "Identificação da Jornada Padrão".
// Valida TC7 (identificação válida), TC8 (matriz dos campos) e TC9 (recálculo/bloqueio de duração).
// Cleanup: os testes não salvam a jornada; nenhum registro persistente é criado e afterAll não é necessário.

import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { JourneyIdentificationPage } from '../../../pages/JourneyIdentificationPage.js';
import { ABAS, abrirAba, comJornada, semearCronograma } from '../../../utils/journey-lifecycle.js';
import { CASOS, CASOS_DURACAO, identificacaoDaJornadaData as data } from './identificacao-da-jornada-padrao.data.js';

test.describe('Identificação da Jornada Padrão', () => {
  test('TC7 — Cadastrar identificação válida', async ({ page }) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Identificação da Jornada Padrão');
    await allure.story('TC7 — Cadastrar identificação válida');
    await allure.severity('critical');

    const form = new JourneyIdentificationPage(page, data.ambiente);

    await allure.step('Abrir a identificação de uma nova Jornada Padrão', async () => {
      await form.goToCreate();
      await expect(form.getIdentificationTab()).toHaveAttribute('aria-selected', 'true');
    });

    await allure.step(`Preencher Nome com "${data.nomeValido}"`, async () => {
      await form.fillName(data.nomeValido);
      await expect(form.getNameInput()).toHaveValue(data.nomeValido);
    });

    // toContainText num <select> casa com o texto de TODAS as options — passaria sem nada ter sido
    // selecionado. Asserção real = a option marcada como :checked.
    await allure.step(`Selecionar Situação "${data.situacaoValida}"`, async () => {
      await form.selectStatus(data.situacaoValida);
      await expect(form.getStatusControl().locator('option:checked')).toHaveText(data.situacaoValida);
    });

    await allure.step(`Selecionar Quem pode ver "${data.visibilidadeValida}"`, async () => {
      await form.selectVisibility(data.visibilidadeValida);
      await expect(form.getVisibilityControl().locator('option:checked')).toHaveText(data.visibilidadeValida);
    });
  });

  test('TC8 — Validar Nome, Situação, Quem pode ver, Duração e Unidade', async ({ page }) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Identificação da Jornada Padrão');
    await allure.story('TC8 — Matriz de validação dos campos');
    await allure.severity('critical');

    const form = new JourneyIdentificationPage(page, data.ambiente);
    let alertExecutado = false;
    page.on('dialog', async (dialog) => {
      alertExecutado = true;
      await dialog.dismiss();
    });

    // UMA navegação pro teste inteiro. O rascunho recarregava o form a cada cenário (12 navegações
    // seguidas na mesma rota SPA) e isso morria de net::ERR_ABORTED ou deixava o form em branco —
    // `safeGoto` não faz retry de ERR_ABORTED. Cada cenário mexe num campo e asserta nele, então
    // reusar o form aberto é suficiente: basta reescrever o valor.
    await form.goToCreate();

    for (const c of CASOS.filter((x) => x.esperado !== 'invalido-bloqueia-submit')) {
      await allure.step(`[${c.categoria}] ${c.cenario}`, async () => {
        const control =
          c.campo === 'nome' ? form.getNameInput()
          : c.campo === 'situacao' ? form.getStatusControl()
          : c.campo === 'visibilidade' ? form.getVisibilityControl()
          : c.campo === 'duracao' ? form.getDurationInput()
          : form.getUnitControl();

        if (c.esperado === 'opcao-ausente') {
          const option = await form.expectOptionAbsent(control, c.input);
          await expect(option).toHaveCount(0);
          return;
        }

        if (c.campo === 'nome') {
          await form.fillName(c.input);
        } else if (c.campo === 'duracao') {
          await form.fillDuration(c.input);
        } else if (c.input === '') {
          await form.touchWithoutSelecting(control);
        }

        if (c.esperado === 'aceita-valor') {
          await expect(control).toHaveValue(c.input);
          return;
        }

        if (c.esperado === 'preserva-valor-sem-alerta') {
          await expect(control).toHaveValue(c.input);
          expect(alertExecutado).toBe(false);
          return;
        }

        if (c.esperado === 'sanitiza-valor') {
          // O campo sanitiza em vez de invalidar — mas o VALOR final depende do modo de edição
          // (`fill()` concatena por causa do sanitizador; select-all+digitar esvazia). Medições de
          // 03/08 divergiram, então não fixamos o valor: assertamos o invariante que vale nas duas —
          // a entrada inválida nunca permanece, e o que sobra é vazio ou inteiro positivo.
          // TODO(caracterizar): definir a regra exata de sanitização com o time e voltar a fixar valor.
          const v = await control.inputValue();
          expect(v, `Duração após digitar ${JSON.stringify(c.input)}`).not.toBe(c.input);
          expect(v === '' || /^[1-9]\d*$/.test(v), `valor sanitizado inesperado: ${JSON.stringify(v)}`).toBe(true);
          return;
        }

        // invalido-com-mensagem: "Duração" não usa aria-invalid, só mensagem de erro no formulário.
        await expect(form.getFieldError().filter({ hasText: c.mensagem! }).first()).toBeVisible();
      });
    }

    // Submit bloqueado fica por último: o clique em "Salvar" é a única ação com efeito colateral de
    // navegação, então nada depois dele precisa recarregar a página.
    const bloqueiam = CASOS.filter((c) => c.esperado === 'invalido-bloqueia-submit');
    {
      for (const c of bloqueiam) {
        await allure.step(`[${c.categoria}] ${c.cenario} — envio bloqueado no submit`, async () => {
          await form.fillName(c.input);
          await expect(form.getNameInput()).toHaveAttribute('aria-invalid', 'true');
          // "Salvar" segue HABILITADO de propósito: o Twygo valida no submit, não desabilitando o botão.
          await expect(form.getSaveButton()).toBeEnabled();
          await form.getSaveButton().click();
          await expect(form.getFieldError().first()).toBeVisible();
          // Continuar no formulário prova que nada foi criado (a URL não sai de /journeys/new).
          await expect(form.getIdentificationTab()).toBeVisible();
        });
      }
    }
  });

  // Cobertura pendente, deliberadamente VISÍVEL no report (⊘) em vez de removida: o campo "Duração" é
  // type="text" com sanitização, e 3 medições no stage (03/08) deram 3 resultados diferentes conforme o
  // modo de edição — ver CASOS_DURACAO no .data.ts. Asserção só depois de caracterizar a regra com o
  // time (é decisão de produto: 0 e "abc" devem ser corrigidos silenciosamente ou recusados?).
  test.fixme('TC8b — Duração: sanitização e obrigatoriedade (regra a caracterizar)', async ({ page }) => {
    const form = new JourneyIdentificationPage(page, data.ambiente);
    await form.goToCreate();
    for (const c of CASOS_DURACAO) {
      await allure.step(`[${c.categoria}] ${c.cenario} — observado: ${c.observado}`, async () => {
        await form.fillDuration(c.input);
        await expect(form.getDurationInput()).not.toHaveValue(c.input);
      });
    }
  });

  /**
   * O NÚCLEO do TC9 da AT: "Recalcular duração pelo período das tarefas". Separado do TC9 acima porque
   * exige massa (fase + tarefa) e porque a separação diz exatamente o que funciona e o que não:
   * o TC9 cobre a mecânica do switch, este cobre o recálculo em si.
   *
   * ⚠️ ESPERA-SE VERMELHO — e o vermelho é a detecção, não spec quebrado. Medido em 03/08 com fase e
   * tarefa do dia 1 ao dia 5, visíveis na timeline: o switch persiste e desabilita Duração/Unidade, mas
   * a Duração fica em "1" (não vira 5), inclusive após salvar e recarregar. Testado nas DUAS ordens
   * (switch antes e depois de criar a tarefa) — não é dependência de ordem. O cronograma renderiza 5
   * colunas de dia enquanto a Duração diz 1, o que é inconsistência interna.
   *
   * Aqui a AT está CERTA e o produto não cumpre — o inverso dos outros ajustes desta suíte. Módulo está
   * em BETA, então pode ser "ainda não implementado" em vez de regressão: quem decide é a triagem.
   */
  test('TC9b — Duração reflete a soma dos períodos das tarefas', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Identificação da Jornada Padrão');
    await allure.story('TC9b — Recálculo da duração pela soma dos períodos das tarefas');
    await allure.severity('critical');
    test.setTimeout(600_000);

    await comJornada(page, data.ambiente, 'TC9b', testInfo.workerIndex, async (ctx) => {
      // DUAS tarefas (5 + 3) de propósito: soma = 8, maior período = 5. Com uma tarefa só os dois
      // valores coincidem e o teste não distinguiria a regra real (soma) da que a AT documentou errado.
      const somaPeriodos = await semearCronograma(ctx, [5, 3], { fase: 'Fase TC9b', tarefa: 'Tarefa TC9b' });
      await expect(page.getByText('Tarefa TC9b 1')).toBeVisible({ timeout: 20_000 });
      await expect(page.getByText('Tarefa TC9b 2')).toBeVisible({ timeout: 20_000 });

      await abrirAba(page, ABAS.identificacao);
      await expect(ctx.identificacao.getDurationInput()).toBeVisible({ timeout: 30_000 });

      await ctx.identificacao.setExtendDuration(true);
      await expect(ctx.identificacao.getExtendDurationSwitch()).toHaveAttribute('data-checked', '', { timeout: 15_000 });
      // Campos travados = a UI afirma que a duração passou a ser derivada do cronograma.
      await expect(ctx.identificacao.getDurationInput()).toBeDisabled();
      await expect(ctx.identificacao.getUnitControl()).toBeDisabled();

      // especificacao.docx §4.1.2: "calculado automaticamente SOMANDO os períodos das tarefas
      // configuradas no cronograma". É esta linha que detecta o defeito.
      await expect(
        ctx.identificacao.getDurationInput(),
        `com tarefas de 5 e 3 dias, a duração derivada deveria ser ${somaPeriodos} (soma dos períodos, spec §4.1.2)`,
      ).toHaveValue(String(somaPeriodos), { timeout: 30_000 });
    });
  });

  test('TC9 — Recalcular duração pelo período das tarefas', async ({ page }) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Identificação da Jornada Padrão');
    await allure.story('TC9 — Recalcular duração pelo período das tarefas');
    await allure.severity('critical');

    const form = new JourneyIdentificationPage(page, data.ambiente);
    await form.goToCreate();
    await form.selectUnit(data.unidadeSlider);

    await allure.step('Ativar o prolongamento pelo período das tarefas', async () => {
      await form.setExtendDuration(true);
      // Estado do switch Chakra se lê no data-checked do label, não em toBeChecked() do input oculto.
      await expect(form.getExtendDurationSwitch()).toHaveAttribute('data-checked', '');
      await expect(form.getDurationInput()).toBeDisabled();
      await expect(form.getUnitControl()).toBeDisabled();
    });

    await allure.step('Validar consistência entre duração recalculada e slider', async () => {
      await expect(form.getDurationInput()).toBeVisible({ timeout: 60_000 });
      const duration = await form.getDurationInput().inputValue();
      expect(Number(duration)).toBeGreaterThanOrEqual(0);

      const slider = form.getQuickAdjustmentSlider();
      await expect(slider).toBeVisible({ timeout: 60_000 });
      // A unidade vem no nome acessível ("Ajuste rápido (Dias)"), não no texto do elemento.
      await expect(slider).toHaveAccessibleName(new RegExp(`\\(${data.unidadeSlider}\\)`, 'i'));

      // FIXME(recon): falta no recon uma tarefa com período conhecido para comparar o valor recalculado ao maior período configurado.
    });
  });
});
