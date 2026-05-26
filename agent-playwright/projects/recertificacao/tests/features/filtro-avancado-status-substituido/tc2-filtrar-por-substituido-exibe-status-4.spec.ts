import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc2Data } from './tc2-filtrar-por-substituido-exibe-status-4.data.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Categoria: seed-invalido (heal 2026-05-26).
  // GET /o/37007/events/1/learning_students retornou 404 — `tc2Data.eventId = 1`
  // é placeholder. Pré-condição requer evento com ≥1 participant em
  // certificate_status=4 (REPLACED). Validar manualmente no env
  // staging-base-de-conhecimento (orgId 37007) e atualizar
  // `tc2-filtrar-por-substituido-exibe-status-4.data.ts`.
  test.fixme(
    true,
    'seed inválido — eventId placeholder em tc2-filtrar-por-substituido-exibe-status-4.data.ts. Validar manualmente no env staging-base-de-conhecimento e atualizar o .data.ts.',
  );

  test('TC2 — Filtrar por "Substituído" exibe apenas alunos com certificate_status = 4', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Filtro Avançado Status Substituído');
    await allure.story(
      'Filtrar por "Substituído" exibe apenas alunos com certificate_status = 4',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido em staging-base-de-conhecimento)',
    );

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Acessar a lista de aprendizagem em "/learning_students" → Lista exibe todos os alunos',
      async () => {
        await learningStudents.goToList(tc2Data.eventId);
        await expect(page).toHaveURL(
          /\/o\/\d+\/events\/\d+\/learning_students/,
        );
      },
    );

    await allure.step(
      '2. Abrir o filtro avançado de "Status do certificado", marcar APENAS a opção "Substituído" e aplicar → Drawer fecha, listagem refilra',
      async () => {
        await learningStudents.openFilterDrawer();
        await learningStudents.selectStatusFilter(tc2Data.optionLabel);
        await learningStudents.applyFilters();
        // Pós-condição: drawer fechou (dialog não está mais visível) e
        // `#clear-filter` aparece (asserido em `applyFilters` internamente).
        await expect(page.getByRole('dialog').first()).toBeHidden();
      },
    );

    await allure.step(
      '3. Inspecionar as linhas listadas → Apenas alunos com certificate_status = 4 aparecem; demais (VALID, EXPIRED, PENDING) ficam ocultos',
      async () => {
        const rows = learningStudents.getParticipantRows();
        const rowCount = await rows.count();

        if (rowCount === 0) {
          // Empty state após filtro — fora da pré-condição (MD exige ao menos
          // 1 aluno REPLACED). Sinaliza seed inadequado, não bug.
          await allure.tag('REVIEW_NEEDED');
          // REVISAR-SEED: env não tem aluno REPLACED para o eventId
          // configurado em tc2Data — ajustar seed e re-rodar.
          test.fail(
            true,
            'Pré-condição quebrada: nenhum aluno REPLACED na lista após filtro. Atualizar tc2Data.eventId / seed.',
          );
          return;
        }

        const statuses = await learningStudents.getAllVisibleStatusTexts();
        // Invariante de query (RN 23.1): toda linha restante após filtrar por
        // "Substituído" deve exibir o badge "Substituído" — qualquer outro
        // status indica vazamento do filtro server-side.
        for (const status of statuses) {
          expect(status).toContain(tc2Data.expectedBadgeLabel);
        }
      },
    );
  });

  // CLAUDE.md §7.6 G: spec aplica filtro (estado persistente client-side via
  // querystring). `afterEach` limpa o filtro para a próxima execução iniciar
  // em estado conhecido. Idempotente — não falha se nada está aplicado.
  test.afterEach(async ({ page }) => {
    const learningStudents = new LearningStudentsPage(page);
    await learningStudents.clearFilters().catch(() => undefined);
  });
});
