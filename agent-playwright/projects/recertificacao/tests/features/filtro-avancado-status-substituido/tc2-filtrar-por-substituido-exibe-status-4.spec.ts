import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc2Data } from './tc2-filtrar-por-substituido-exibe-status-4.data.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Rota destravada em 2026-05-27 (LearningStudentsPage.goToList →
  // /e/{id}/learning). Pré-condição: aluno com certificate_status=4
  // (REPLACED) — exige fluxo de recertificação que SUBSTITUIU o cert
  // anterior. fixme legítimo categoria "seed-ausente": seed atual
  // (curso 806852, aluno Pendente) não cobre REPLACED. Aguarda
  // implementação de helper recertificar-aluno em SeedAdminPage.
  test.fixme(
    true,
    'seed-ausente: requer aluno com certificate_status=4 (REPLACED). Implementar SeedAdminPage.recertificarAlunoSubstituindoCert antes de habilitar este TC.',
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
        await expect(page).toHaveURL(/\/e\/\d+\/learning/);
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
