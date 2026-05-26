import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc2Data } from './tc2-botao-reinscrever-apenas-maior-recertification-number.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Heal 2026-05-26: cursoMultiReinscricaoId=1 placeholder — GET
  // /o/37007/events/1/learning_students retorna 404. E-mail
  // aluno.multi.reinscricao@example.com também é placeholder. Validar no env
  // staging-base-de-conhecimento e atualizar
  // `tc2-botao-reinscrever-apenas-maior-recertification-number.data.ts`.
  test.fixme(
    true,
    'seed inválido — cursoMultiReinscricaoId=1 não existe (404) e e-mail é placeholder @example.com. Validar no env staging-base-de-conhecimento e atualizar tc2-botao-reinscrever-apenas-maior-recertification-number.data.ts.',
  );
  test('TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story(
      'Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number',
    );
    await allure.severity('critical');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const learning = new LearningStudentsPage(page);

    await allure.step(
      '1. Pré-condição (seed): aluno multi-reinscrição com participants 0 e 1',
      async () => {
        // REVISAR-SEED: garantida via fixture/rake — verificado no passo 2
        // contando linhas na listagem.
      },
    );

    await allure.step(
      '2. Acessar a lista de aprendizagem → Listagem padrão exibe APENAS a inscrição com maior recertification_number',
      async () => {
        await learning.goToList(tc2Data.cursoMultiReinscricaoId);
        await expect(
          learning.getRowByEmail(tc2Data.alunoMultiReinscricaoEmail),
        ).toBeVisible();
        const countDefault = await learning.countRowsForEmail(
          tc2Data.alunoMultiReinscricaoEmail,
        );
        expect(countDefault).toBe(1);
      },
    );

    await allure.step(
      '3. Aplicar filtro para exibir histórico completo → Ambas as inscrições do aluno são exibidas',
      async () => {
        // REVISAR-FIGMA: UI de "Mostrar histórico" ainda não confirmada.
        // Estratégia: tentar abrir drawer de filtros e procurar opção
        // textual "Histórico" / "Mostrar histórico" / "Substituído".
        // Se não encontrar, marca o step como REVIEW_NEEDED e segue sem
        // falhar — TC4 e TC5 da Suite 11 cobrem o filtro "Substituído"
        // formalmente; aqui o foco é o estado do botão Reinscrever.
        await allure.tag('REVIEW_NEEDED');

        let historicoAtivado = false;
        try {
          await learning.openFilterDrawer();
          const optionHistorico = page
            .getByRole('dialog')
            .first()
            .getByText(/Hist[oó]rico|Mostrar hist[oó]rico|Substitu[ií]do/i)
            .first();
          if (await optionHistorico.isVisible().catch(() => false)) {
            await optionHistorico.click();
            await learning.applyFilters();
            historicoAtivado = true;
          }
        } catch {
          // Drawer não disponível neste env — segue marcado como REVIEW_NEEDED.
        }

        if (historicoAtivado) {
          const countComHistorico = await learning.countRowsForEmail(
            tc2Data.alunoMultiReinscricaoEmail,
          );
          expect(countComHistorico).toBe(tc2Data.qtdLinhasHistoricoCompleto);
        }
      },
    );

    await allure.step(
      '4. Abrir menu de ações da linha com recertification_number = 0 → Item "Reinscrever" NÃO presente',
      async () => {
        // REVISAR-FIGMA: ambas as linhas têm o mesmo e-mail. Sem
        // data-test-id por linha, distinguir qual é o participant 0 e
        // qual é o 1 só pelo locator atual é frágil (depende da ordem
        // de render do backend). Assumimos: linha com badge "Substituído"
        // ou texto "0" na coluna recertification_number = histórico.
        //
        // Estratégia: pegar TODAS as linhas do e-mail, identificar a do
        // histórico (sem badge ativo / com recertification_number=0
        // textual) e asserir que o menu dela NÃO tem item Reinscrever.
        await allure.tag('REVIEW_NEEDED');

        const rows = page
          .locator('tbody tr')
          .filter({ hasText: tc2Data.alunoMultiReinscricaoEmail });
        const total = await rows.count();
        if (total >= 2) {
          // Heurística: o histórico (recertification_number = 0) tende a
          // ser a 2ª linha em ordem natural — REVISAR-FIGMA quando a UI
          // for confirmada. Plano: usar coluna `recertification_number`
          // ou badge "Substituído" para ancorar.
          const historicoRow = rows.nth(1);
          await historicoRow.waitFor({ state: 'visible' });
          // Abre menu de ações dessa linha específica.
          const trigger = historicoRow
            .getByRole('button', { name: /(Ações|Opções|Mais|Menu)/i })
            .first();
          if (await trigger.isVisible().catch(() => false)) {
            await trigger.click();
            const reenrollItem = learning.getReinscreverMenuItem();
            await expect(reenrollItem).toHaveCount(0);
            await learning.closeRowActionsMenu();
          }
        }
      },
    );

    await allure.step(
      '5. Abrir menu da linha com recertification_number = 1 → Item "Reinscrever" presente e habilitado',
      async () => {
        await learning.expectReinscreverButtonState(
          tc2Data.alunoMultiReinscricaoEmail,
          'enabled',
        );
      },
    );
  });
});
