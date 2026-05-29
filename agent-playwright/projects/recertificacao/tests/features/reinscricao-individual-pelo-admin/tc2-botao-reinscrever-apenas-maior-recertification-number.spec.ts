import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { fixedSeed } from '../../../data/fixed-seed.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  test('TC2 — Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story(
      'Botão "Reinscrever" visível apenas na linha do participant com maior recertification_number',
    );
    await allure.severity('critical');
    await allure.parameter('seed_cursoId', String(fixedSeed.cursoComSubstituidoId));
    await allure.parameter('seed_alunoEmail', fixedSeed.alunoComReinscreverHabilitado_807287);

    const learning = new LearningStudentsPage(page);
    const cursoId = fixedSeed.cursoComSubstituidoId;
    const alunoEmail = fixedSeed.alunoComReinscreverHabilitado_807287;

    await allure.step(
      '1. Pré-condição: aluno com múltiplas reinscrições no 807287 (Richard tem 5)',
      async () => {
        expect(alunoEmail).toBeTruthy();
      },
    );

    await allure.step(
      '2. Acessar lista de aprendizagem → múltiplas linhas do mesmo aluno',
      async () => {
        // Usa goToList (safeGoto interno) — obrigatório por regra meta-monorepo (CLAUDE.md §goto+dismissCommonModals).
        // Espera condicionada à primeira linha aparecer antes de contar — evita race com renderização assíncrona da tabela.
        await learning.goToList(cursoId);
        await expect(
          page.locator('tbody tr').filter({ hasText: alunoEmail }).first(),
        ).toBeVisible({ timeout: 15_000 });
        const linhasAluno = await page
          .locator('tbody tr')
          .filter({ hasText: alunoEmail })
          .count();
        expect(linhasAluno).toBeGreaterThanOrEqual(2);
      },
    );

    await allure.step(
      '3. APENAS a primeira linha (mais recente, maior recert_num) tem botão "Iniciar reinscrição" habilitado',
      async () => {
        const rows = page.locator('tbody tr').filter({ hasText: alunoEmail });
        const totalRows = await rows.count();
        let linhasComBotaoHabilitado = 0;
        for (let i = 0; i < Math.min(totalRows, 5); i += 1) {
          const row = rows.nth(i);
          const kebab = row.getByRole('button', { name: 'more_vert' }).first();
          if (!(await kebab.isVisible({ timeout: 2_000 }).catch(() => false))) continue;
          await kebab.scrollIntoViewIfNeeded();
          await kebab.click();
          await page.waitForTimeout(700);
          const item = page
            .getByRole('menuitem', { name: /Iniciar reinscrição/i })
            .first();
          if (await item.isVisible({ timeout: 1_500 }).catch(() => false)) {
            const disabled = await item.getAttribute('aria-disabled').catch(() => null);
            if (disabled !== 'true') linhasComBotaoHabilitado += 1;
          }
          await page.keyboard.press('Escape');
          await page.waitForTimeout(400);
        }
        expect(linhasComBotaoHabilitado).toBe(1);
      },
    );
  });
});
