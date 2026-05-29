import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { fixedSeed } from '../../../data/fixed-seed.data.js';
import { tc3Data } from './tc3-reinscrever-aluno-cria-novo-participant-zerado.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Validação live 2026-05-29 (4 iterações de heal):
  // - Bug Chakra multi-menu FIXADO: getOpenChakraMenu via
  //   filter({visible: true}) escopa ao popper correto. Click no item
  //   "Iniciar reinscrição" agora atinge o menuitem visível (validado
  //   via screenshot do trace).
  // - PORÉM: modal "Confirmar reinscrição" descrito pela AT (passo 2
  //   com tag REVISAR-FIGMA) NÃO aparece após o click. Diagnóstico:
  //   produto NÃO tem modal intermediário — click dispara POST direto
  //   sem confirmação (consistente com `LearningStudentsPage.ts:530-535`).
  //   AT precisa ser corrigida pra remover passo do modal e validar via
  //   toast de sucesso direto.
  //
  // Destinatário do fix: AT/QA Lead.
  // Fixme legítimo §7.6 F categoria "AT-inferiu-comportamento-inexistente".
  test.fixme(
    true,
    'AT inferiu modal "Confirmar reinscrição" (REVISAR-FIGMA) que NÃO existe no produto. Validado live 2026-05-29 com bug Chakra menu já corrigido: click "Iniciar reinscrição" dispara POST imediato sem modal. AT/QA Lead deve revisar a AT pra remover step do modal e substituir por assert de toast.',
  );
  test('TC3 — Reinscrever aluno individualmente cria novo participant zerado', async ({
    page,
  }) => {

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
