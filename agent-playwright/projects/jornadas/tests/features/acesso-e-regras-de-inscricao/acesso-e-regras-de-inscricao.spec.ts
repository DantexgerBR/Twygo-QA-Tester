// Fonte canônica: projects/jornadas/inputs/test-analysis.md — suíte "Acesso e regras de inscrição".
// TC10 (contato e vigência válidos), TC11 (matriz do e-mail), TC12 (restrição de horário — parcial).
//
// Cada teste CRIA a própria jornada e a apaga no fim: a aba "Acesso" só existe em jornada salva
// (tabs progressivas). O ciclo vive em `comJornada()` — cleanup em `finally`, então falha de
// asserção não deixa órfão na org (skill limpar-dados-de-teste-twygo).
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { JourneyIdentificationPage } from '../../../pages/JourneyIdentificationPage.js';
import { JourneyAccessPage } from '../../../pages/JourneyAccessPage.js';
import { JourneyListPage } from '../../../pages/JourneyListPage.js';
import { acessoData as data, CASOS_EMAIL } from './acesso-e-regras-de-inscricao.data.js';

/** Nome único por teste/worker — a org é compartilhada e runs concorrem. */
const nomeJornada = (tc: string, workerIndex: number) => `Jornada ${tc} w${workerIndex}-${Date.now()}`;

async function comJornada(
  page: import('@playwright/test').Page,
  workerIndex: number,
  tc: string,
  corpo: (acesso: JourneyAccessPage) => Promise<void>,
): Promise<void> {
  const identificacao = new JourneyIdentificationPage(page, data.ambiente);
  const listagem = new JourneyListPage(page, data.ambiente);
  const nome = nomeJornada(tc, workerIndex);
  await allure.step(`Criar jornada "${nome}" (a aba Acesso exige jornada salva)`, async () => {
    await identificacao.criar(nome);
  });
  try {
    const acesso = new JourneyAccessPage(page);
    await allure.step('Abrir a aba "Acesso"', async () => {
      await acesso.abrir();
    });
    await corpo(acesso);
  } finally {
    await listagem.excluirPorNome_safe(nome);
  }
}

test.describe('Acesso e regras de inscrição', () => {
  test('TC10 — Configurar contato e vigência válidos', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Acesso e regras de inscrição');
    await allure.story('TC10 — Configurar contato e vigência válidos');
    await allure.severity('critical');
    // Corpo (criar jornada + interagir + apagar) mais o teardown do exploratory-fixture, que roda os
    // probes ativos na página final. 180s estourava no TEARDOWN — o timeout do Playwright cobre
    // fixtures, não só o corpo. Medido em 03/08: 2 testes morreram em 'Tearing down context'.
    test.setTimeout(420_000);

    await comJornada(page, testInfo.workerIndex, 'TC10', async (acesso) => {
      // Passo 1 — a aba exibe contato, inscrição, confirmação, vigência, restrição de horário e anexos.
      await allure.step('Conferir as seções e controles da aba', async () => {
        for (const secao of data.secoes) {
          await expect(acesso.getSectionHeading(secao), `seção "${secao}"`).toBeVisible();
        }
        await expect(acesso.getEmailInput()).toBeVisible();
        await expect(acesso.getExpirationDaysInput()).toBeVisible();
        await expect(acesso.getConfirmationCheckbox()).toBeAttached();
        await expect(acesso.getRestrictOffHoursCheckbox()).toBeAttached();
        await expect(acesso.getAttachmentsCheckbox()).toBeAttached();
      });

      // Passo 2 — e-mail válido não fica inválido.
      await allure.step(`Preencher "E-mail de contato" com "${data.emailValido}"`, async () => {
        await acesso.fillEmail(data.emailValido);
        await expect(acesso.getEmailInput()).toHaveValue(data.emailValido);
        await expect(acesso.getEmailInput()).not.toHaveAttribute('aria-invalid', 'true');
        await expect(acesso.getEmailError()).toHaveCount(0);
      });
    });
  });

  test('TC11 — Validar o campo "E-mail de contato"', async ({ page }, testInfo) => {
    await allure.epic('Twygo - Jornadas');
    await allure.feature('Acesso e regras de inscrição');
    await allure.story('TC11 — Matriz de validação do e-mail de contato');
    await allure.severity('critical');
    // Corpo (criar jornada + interagir + apagar) mais o teardown do exploratory-fixture, que roda os
    // probes ativos na página final. 180s estourava no TEARDOWN — o timeout do Playwright cobre
    // fixtures, não só o corpo. Medido em 03/08: 2 testes morreram em 'Tearing down context'.
    test.setTimeout(420_000);

    let alertExecutado = false;
    page.on('dialog', async (d) => { alertExecutado = true; await d.dismiss(); });

    await comJornada(page, testInfo.workerIndex, 'TC11', async (acesso) => {
      for (const c of CASOS_EMAIL) {
        await allure.step(`[${c.categoria}] ${c.cenario} — ${JSON.stringify(c.input)}`, async () => {
          await acesso.fillEmail(c.input);
          // Valor sempre preservado como digitado: o campo não sanitiza (≠ "Duração" da Identificação).
          await expect(acesso.getEmailInput()).toHaveValue(c.input);

          if (c.esperado === 'aceita') {
            await expect(acesso.getEmailInput()).not.toHaveAttribute('aria-invalid', 'true');
            await expect(acesso.getEmailError()).toHaveCount(0);
            return;
          }
          // Validação no BLUR — não precisa acionar Salvar (e não acionamos: salvar aqui gravaria estado).
          await expect(acesso.getEmailInput()).toHaveAttribute('aria-invalid', 'true');
          await expect(acesso.getEmailError().first()).toBeVisible();
        });
      }
      // Categoria D: o `<script>` foi tratado como texto, sem execução.
      expect(alertExecutado, 'nenhum alert() disparado pelo payload de script').toBe(false);
    });
  });

  // PARCIAL, deliberadamente visível como ⊘ em vez de meia-verdade verde:
  //  - Passo 1 (ativar a restrição) é fazível: o checkbox `journey-access-restrict-offhours-checkbox`
  //    alterna tanto por clique real quanto por dispatchEvent (medido 03/08).
  //  - Passo 1 exige também "controles de período permitido ficam habilitados" — NÃO localizei esses
  //    controles ao ativar o checkbox (nenhum `input[type=time]`/`name*=period` apareceu). Falta medir.
  //  - Passo 2 ("botão Inscreva-se não é exibido fora do período") exige jornada PUBLICADA + visão do
  //    aluno no Play: é seed/massa, a Fase 2 do PLAN. Fora do alcance deste spec.
  test.fixme('TC12 — Restringir inscrição fora do horário permitido', async ({ page }, testInfo) => {
    await comJornada(page, testInfo.workerIndex, 'TC12', async (acesso) => {
      const chk = acesso.getRestrictOffHoursCheckbox();
      await chk.locator('xpath=ancestor::label[1]').click();
      await expect(chk).toBeChecked();
      // TODO(medir): localizar os controles de período e asseverar que ficam habilitados.
    });
  });
});
