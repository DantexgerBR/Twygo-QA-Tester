import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc2Data } from './tc2-filtrar-por-substituido-exibe-status-4.data.js';

test.describe('Filtro Avançado Status Substituído', () => {
  // Seed REPLACED criada em 2026-05-28 no curso 807287 ("curso para
  // reinscriçao") via UI admin (chrome-devtools-mcp + agents.richard@claude.com):
  //   1. Chamada criada com Richard marcado presente nas 5 inscrições
  //      (Frequência → 100%, critério do curso).
  //   2. PATCH .../event_students/44274543/approve + .../44274544/approve
  //      (toggle Aprovação na UI admin).
  //   3. UI "Emitir certificado" em recert_num=0 → cert 5027059 emitido
  //      (certificate_situation=2).
  //   4. UI "Emitir certificado" em recert_num=1 → cert 5027060 emitido
  //      e recert_num=0 flipou automaticamente para
  //      certificate_situation=4 (REPLACED / Substituído).
  //
  // Confirmado via API /e/807287/learning_students:
  //   - id 44274543 (recert 0) → cert_situation=4 (Substituído) ✓
  //   - id 44274544 (recert 1) → cert_situation=2 (Emitido)
  //
  // Independente do bug 422 da reinscrição (que continua aberto no
  // /api/v1/o/37048/contents/{id}/event_participants — ver Isolamento TC1):
  // este TC usa as inscrições pré-existentes (recert_num 0..4 já criadas
  // antes do bug 422), não cria novas.

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
      ':recertificacao=ON (env staging-recertificacao 37048)',
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
        await learningStudents.openAdvancedFilterCriteria('Certificado');
        await learningStudents.selectStatusFilter(tc2Data.optionLabel);
        await learningStudents.applyFilters();
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
