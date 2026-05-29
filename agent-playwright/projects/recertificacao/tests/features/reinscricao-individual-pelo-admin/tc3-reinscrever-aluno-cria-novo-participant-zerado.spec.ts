import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { fixedSeed } from '../../../data/fixed-seed.data.js';
import { tc3Data } from './tc3-reinscrever-aluno-cria-novo-participant-zerado.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // FIXME: A AT (test-analysis.md §TC3 passo 2) inferiu modal de confirmação
  // "(REVISAR-FIGMA: header e body exatos)" que NÃO existe no produto.
  // Comportamento real observado live 2026-05-29: clicar em "Iniciar reinscrição"
  // dispara imediatamente POST /api/v1/o/{org}/contents/{id}/event_participants
  // sem modal intermediário — fluxo direto para toast de sucesso/erro.
  // Confirmado no snapshot do trace (menu open com item [active] mas sem dialog) e
  // documentado em LearningStudentsPage.ts linhas 533-536.
  // Destinatário: AT/QA Lead — revisar AT para remover o passo do modal e
  // substituir por assert do toast de sucesso diretamente após clickReinscrever.
  test('TC3 — Reinscrever aluno individualmente cria novo participant zerado', async ({
    page,
  }) => {
    test.fixme(
      true,
      'AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que não existe no produto: click em "Iniciar reinscrição" dispara POST imediato sem modal — ver LearningStudentsPage.ts:533-536',
    );

    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story('Reinscrever aluno individualmente cria novo participant zerado');
    await allure.severity('critical');
    await allure.parameter('seed_cursoId', String(fixedSeed.cursoComSubstituidoId));
    await allure.parameter('seed_alunoEmail', fixedSeed.alunoComReinscreverHabilitado_807287);

    const learning = new LearningStudentsPage(page);
    const cursoId = fixedSeed.cursoComSubstituidoId;
    const alunoEmail = fixedSeed.alunoComReinscreverHabilitado_807287;

    await allure.step(
      '1. Pré-condição: curso 807287 + aluno fixo richard.sebold@twygo.com (botão Reinscrever habilitado natural — recon 2026-05-28)',
      async () => {
        expect(alunoEmail).toBeTruthy();
      },
    );

    await allure.step(
      '2. Acessar lista de aprendizagem do curso',
      async () => {
        await learning.goToList(cursoId);
        await expect(
          page.locator('tbody tr').filter({ hasText: alunoEmail }).first(),
        ).toBeVisible({ timeout: 10_000 });
      },
    );

    await allure.step(
      '3. Clicar "Iniciar reinscrição" no menu kebab da linha mais recente → Modal "Confirmar reinscrição" exibido',
      async () => {
        await learning.clickReinscrever(alunoEmail);
        await expect(learning.getConfirmReinscreverModal()).toBeVisible({
          timeout: 10_000,
        });
      },
    );

    await allure.step(
      '4. Confirmar modal → toast de sucesso',
      async () => {
        await learning.confirmReinscreverModal();
        await learning.expectToastSuccess();
      },
    );

    await allure.step(
      '5. Nova linha (Pendente) NÃO exibe "Aprovado"/"Concluído"',
      async () => {
        await allure.tag('REVIEW_NEEDED');
        const rowPendente = page
          .locator('tbody tr')
          .filter({ hasText: alunoEmail })
          .first();
        const badge = learning.getStatusCertificadoBadge(alunoEmail);
        if (await badge.isVisible().catch(() => false)) {
          const badgeText = (await badge.textContent()) ?? '';
          expect(badgeText).toMatch(tc3Data.badgePosReinscricaoEsperado);
        }
        const aprovadoNaLinha = await rowPendente
          .getByText(/Aprovado|Concluído/i)
          .count();
        expect(aprovadoNaLinha).toBe(0);
      },
    );
  });
});
