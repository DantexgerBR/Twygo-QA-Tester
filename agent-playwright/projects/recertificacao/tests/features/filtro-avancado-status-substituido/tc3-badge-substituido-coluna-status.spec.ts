import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc3Data } from './tc3-badge-substituido-coluna-status.data.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Seed REPLACED criada em 2026-05-28 no curso 807287 ("curso para
  // reinscriçao") — mesma seed do TC2. Richard Sebold recert_num=0
  // (id 44274543) tem certificate_situation=4 (REPLACED / Substituído)
  // pós-emit sucessivo dos certs em recert 0 e recert 1.
  // O passo 3 (tooltip do badge) ainda depende de definição de design —
  // marcado como REVISAR-FIGMA, não falha o test se ausente.

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
      ':recertificacao=ON (env staging-recertificacao 37048)',
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
          await learningStudents.openAdvancedFilterCriteria('Certificado');
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
            .locator('[data-test-id^="certificate-student-badge"]')
            .first();
          await expect(firstRowBadge).toBeVisible();
          await expect(firstRowBadge).toContainText(tc3Data.expectedBadgeLabel);
        }
      },
    );

    await allure.step(
      '3. Posicionar o cursor sobre o badge → Tooltip explicativo é exibido',
      async () => {
        // Validado live 2026-05-28 (chrome-devtools-mcp): o badge tem
        // tooltip nativo via atributo `title="Certificado substituído por
        // uma nova versão"`. Assertamos a presença e o conteúdo do title.
        const rows = learningStudents.getParticipantRows();
        const badge = rows
          .first()
          .locator('[data-test-id^="certificate-student-badge"]')
          .first();
        await expect(badge).toBeVisible();
        await expect(badge).toHaveAttribute('title', /Substitu[ií]d/i);
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
