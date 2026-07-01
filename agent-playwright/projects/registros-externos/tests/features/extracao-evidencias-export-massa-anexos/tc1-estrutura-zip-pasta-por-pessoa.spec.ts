import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { ExtracaoDrawerPage } from '../../../pages/ExtracaoDrawerPage.js';
import { exportMassaData as data } from './extracao-evidencias-export-massa.shared.data.js';

// ESCOPO AUTOMATIZÁVEL (RN79): o ponto da TC1 — "ZIP organiza arquivos por
// pessoa" — só é verificável baixando e descompactando o pacote gerado pelo job
// assíncrono (passo 2 marcado "(etapa manual)" no test-analysis). Playwright UI
// não baixa a notificação/e-mail nem inspeciona a árvore do ZIP. O que É
// observável e é a PRECONDIÇÃO de toda a suíte: disparar a extração de
// Evidências cria o job de export (201 POST subscription_attachments_exports) e
// fecha o drawer. Se este dispatch quebra, nenhum ZIP existe e nenhuma das
// verificações manuais é possível — por isso ele é o sinal verde/vermelho da
// suíte. O escopo "filtro atual" (toda a org, 361 registros) abrange registros
// de >2 pessoas, satisfazendo a precondição "2 pessoas diferentes".
//
// Nota: o toast "Extração iniciada" NÃO aparece no BETA (gap de feedback já
// reportado pela suíte irmã, TC6). Não reabrimos o mesmo vermelho aqui — esta
// TC valida o dispatch backend, não o feedback de UI.

test.describe(data.suiteName, () => {
  test('Validar estrutura interna do pacote ZIP de evidências', async ({ page }) => {
    await allure.epic(data.epic);
    await allure.feature(data.suiteName);
    await allure.story('Validar estrutura interna do pacote ZIP de evidências');
    await allure.severity('critical');

    const extracao = new ExtracaoDrawerPage(page);

    await allure.step('1. Disparar extração de Evidências sobre escopo de várias pessoas → job criado (201)', async () => {
      await extracao.goto();
      await extracao.open();
      await extracao.selectType('Evidências');

      const exportResponse = page.waitForResponse(
        (r) => data.exportEndpoint.test(r.url()) && r.request().method() === 'POST',
        { timeout: 20_000 },
      );
      await extracao.triggerEvidExtract('filtro_atual');
      const response = await exportResponse;

      expect(response.status(), 'job de export de anexos deve ser criado (201)').toBe(201);
      await expect(extracao.drawer(), 'drawer fecha após disparar o export').toBeHidden({ timeout: 10_000 });
    });

    await allure.step('2. [MANUAL] Baixar o ZIP via notificação do sino e verificar pasta por pessoa', async () => {
      // Verificação manual (não automatizável por Playwright UI): baixar o
      // pacote gerado e confirmar que contém uma pasta por participante
      // (ex: "joao_silva/", "maria_santos/") com os anexos dentro de cada uma.
      test.info().annotations.push({
        type: 'manual',
        description:
          'Baixar o ZIP (sino/e-mail) e confirmar estrutura de pasta por pessoa com os anexos dentro.',
      });
    });
  });
});
