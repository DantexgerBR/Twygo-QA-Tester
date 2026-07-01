import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { extracaoData as data } from './extracao-dados-evidencias.shared.data.js';

// CAUSA-RAIZ (bug de produto — recon 2026-06-23, BETA): o disparo de extração de
// Dados não emite toast "Extração iniciada" (botão inerte — ver TC4), então a
// porta de entrada da entrega assíncrona (RN 79) já falha no feedback imediato.
// A notificação no sino e o e-mail são etapas assíncronas/manuais (worker +
// caixa de e-mail) — automatizamos a parte determinística (toast imediato no
// disparo) e deixamos a verificação de sino/e-mail como passos manuais
// anotados. Quando o frontend conectar o feedback de disparo, a parte
// automatizada passa. Ver recon-extracao-...md § "Comportamento real".

test.describe(data.suiteName, () => {
  test('Validar entrega assíncrona: e-mail e notificação no sino', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar entrega assíncrona: e-mail e notificação no sino');
    await allure.severity('critical');

    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1. Disparar uma extração de Dados CSV → toast "Extração iniciada"', async () => {
      await extracao.goto();
      await extracao.open();
      await extracao.dadosExtractButton().click();
      await expect(extracao.toast(data.toast.dadosCsv)).toBeVisible({ timeout: 15_000 });
    });

    // 2-4. ETAPAS MANUAIS/ASSÍNCRONAS (não determinísticas em CI):
    //   - aguardar o worker concluir o processamento;
    //   - conferir a notificação no sino da TopBar com acesso ao download;
    //   - abrir a caixa de e-mail do Admin e validar o link/anexo.
    // Documentadas no relatório; não automatizadas porque dependem de tempo de
    // worker e de caixa de e-mail externa.
  });
});
