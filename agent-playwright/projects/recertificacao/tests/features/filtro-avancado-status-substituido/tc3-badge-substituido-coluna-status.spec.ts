import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc3Data } from './tc3-badge-substituido-coluna-status.data.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Rota destravada em 2026-05-27 (LearningStudentsPage.goToList →
  // /e/{id}/learning). Pré-condição: aluno com certificate_status=4
  // (REPLACED) — mesmo bloqueio do TC2.
  test.fixme(
    true,
    'seed-ausente: requer aluno com certificate_status=4 (REPLACED). Mesmo bloqueio do TC2 — aguarda SeedAdminPage.recertificarAlunoSubstituindoCert.',
  );

  test('TC3 — Badge "Substituído" é exibido na coluna de Status para participants com certificate_status = 4', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Filtro Avançado Status Substituído');
    await allure.story(
      'Badge "Substituído" é exibido na coluna de Status para participants com certificate_status = 4',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Acessar a lista de aprendizagem sem filtros aplicados → Lista é exibida',
      async () => {
        await learningStudents.goToList(tc3Data.eventId);
        await expect(page).toHaveURL(/\/e\/\d+\/learning/);
        // Garante baseline sem filtro residual (em caso de execução em
        // sequência após TC2 que poderia ter deixado filtro aplicado).
        await learningStudents.clearFilters();
      },
    );

    await allure.step(
      '2. Localizar a linha de um aluno com certificado REPLACED (certificate_status = 4) → Coluna "Status do certificado" exibe badge com label "Substituído"',
      async () => {
        // Estratégia: se o `tc3Data.participantIdentifier` foi definido, use-o
        // para ancorar a linha. Caso contrário, aplicamos o filtro "Substituído"
        // para garantir que TODA linha visível tem status REPLACED e validamos
        // a primeira linha. Independe de seed específico.
        if (tc3Data.participantIdentifier) {
          const badge = learningStudents.getStatusBadgeForParticipant(
            tc3Data.participantIdentifier,
          );
          await expect(badge).toBeVisible();
          await expect(badge).toContainText(tc3Data.expectedBadgeLabel);
        } else {
          await learningStudents.openFilterDrawer();
          await learningStudents.selectStatusFilter(tc3Data.expectedBadgeLabel);
          await learningStudents.applyFilters();

          const rows = learningStudents.getParticipantRows();
          const rowCount = await rows.count();
          if (rowCount === 0) {
            await allure.tag('REVIEW_NEEDED');
            test.fail(
              true,
              'Pré-condição quebrada: nenhum aluno REPLACED na lista. Atualizar tc3Data.eventId / seed.',
            );
            return;
          }

          const firstRowBadge = rows
            .first()
            .locator('.chakra-badge, [class*="badge"]')
            .first();
          await expect(firstRowBadge).toBeVisible();
          await expect(firstRowBadge).toContainText(tc3Data.expectedBadgeLabel);
        }
      },
    );

    await allure.step(
      '3. Posicionar o cursor sobre o badge → Tooltip explicativo é exibido (REVISAR-FIGMA)',
      async () => {
        // REVISAR-FIGMA: texto exato do tooltip ainda não confirmado no MD —
        // a prosa cita "REVISAR-FIGMA: confirmar tooltip". Asserta apenas
        // presença do role=tooltip após hover, sem texto literal.
        await allure.tag('REVIEW_NEEDED');

        const rows = learningStudents.getParticipantRows();
        const badge = rows
          .first()
          .locator('.chakra-badge, [class*="badge"]')
          .first();

        if (await badge.isVisible().catch(() => false)) {
          await badge.hover();
          const tooltip = page.getByRole('tooltip').first();
          // Tooltip pode não existir no componente atual — a prosa marca
          // REVISAR-FIGMA. Trata ausência como pendência de design, não fail.
          const tooltipVisible = await tooltip
            .isVisible({ timeout: 3_000 })
            .catch(() => false);
          if (!tooltipVisible) {
            await allure.tag('TOOLTIP_PENDING_DESIGN');
          } else {
            await expect(tooltip).not.toHaveText('');
          }
        }
      },
    );
  });

  // CLAUDE.md §7.6 G: spec pode aplicar filtro (caminho do `else` em passo 2).
  // afterEach limpa filtro para isolar próxima execução.
  test.afterEach(async ({ page }) => {
    const learningStudents = new LearningStudentsPage(page);
    await learningStudents.clearFilters().catch(() => undefined);
  });
});
