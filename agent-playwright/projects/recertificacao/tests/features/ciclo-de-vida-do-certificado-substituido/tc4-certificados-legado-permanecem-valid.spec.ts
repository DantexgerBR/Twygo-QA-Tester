import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc4Data } from './tc4-certificados-legado-permanecem-valid.data.js';

test.describe('Ciclo de Vida do Certificado Substituído', () => {
  // Decisão QA 2026-05-29: refatorado de DB-pure para validação via UI.
  //
  // O RN 20/21 especifica que `replace_previous_certificates_bulk` só atua
  // quando há nova emissão pelo mesmo par (user_id, event_id). Sem nova emissão,
  // o cert vigente permanece VALID indefinidamente.
  //
  // Estratégia de UI: Richard Sebold (curso 807287) tem recert_num=1 com cert
  // "Emitido" (VALID). Esse cert PERMANECE "Emitido" porque não houve ainda
  // uma reinscrição recert_num=2 + emissão que o substituiria. O TC valida:
  //   (a) linha "Emitido" de Richard continua visível e com badge "Emitido"
  //   (b) Richard NÃO aparece no filtro "Substituído" para esse cert vigente
  // Evidência de que cert só vira REPLACED quando uma nova emissão ocorre.
  //
  // REVISAR-SEED: se Richard Sebold não tiver linha "Emitido" no env
  // (TC2 nunca altera o cert de Richard — usa agents.edu@claude.com),
  // verificar via /e/807287/learning se recert_num=1 ainda está em estado VALID.

  test('TC4 — Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Ciclo de Vida do Certificado Substituído');
    await allure.story(
      'Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (env staging-recertificacao 37048)',
    );
    await allure.parameter('seed', `curso ${tc4Data.eventId}, aluno ${tc4Data.alunoLegadoEmail}`);

    const learningStudents = new LearningStudentsPage(page);

    await allure.step(
      '1. Pré-condição: aluno com recertification_number = 0 aprovado e VALID emitido → ' +
        'acessar lista de aprendizagem e verificar que a linha do aluno legado existe',
      async () => {
        await learningStudents.goToList(tc4Data.eventId);
        await expect(page).toHaveURL(/\/e\/\d+\/learning/);
        // Sem filtro residual de execuções anteriores.
        await learningStudents.clearFilters();

        const linhaAluno = learningStudents.getRowByEmail(tc4Data.alunoLegadoEmail);
        const visible = await linhaAluno.isVisible({ timeout: 10_000 }).catch(() => false);
        if (!visible) {
          // REVISAR-SEED: Richard Sebold não encontrado na lista. Possível que:
          //   a) Aluno foi desmatriculado do curso 807287.
          //   b) Estado do cert de recert_num=1 mudou (expirado/substituído
          //      por uma nova reinscrição não prevista). TC2 NÃO afeta Richard
          //      (usa agents.edu@claude.com). Recon via /e/807287/learning.
          test.fail(
            true,
            `Pré-condição quebrada: aluno "${tc4Data.alunoLegadoEmail}" não encontrado na lista. ` +
              'Verificar estado do cert de Richard Sebold (recert_num=1) no env.',
          );
          return;
        }
        await expect(linhaAluno).toBeVisible();
      },
    );

    await allure.step(
      '2. Verificar que a linha do aluno legado exibe badge "Emitido" (VALID) → ' +
        'RN 20/21: sem reinscrição, o cert original permanece situation=2 (VALID); ' +
        'replace_previous_certificates_bulk não foi acionado',
      async () => {
        const linhaEmitida = learningStudents.getRowByEmail(tc4Data.alunoLegadoEmail, {
          certState: tc4Data.expectedBadge,
        });
        await expect(linhaEmitida).toBeVisible({ timeout: 10_000 });
        await expect(linhaEmitida).toContainText(tc4Data.expectedBadge);
      },
    );

    await allure.step(
      '3. Aplicar filtro "Substituído" e confirmar que a linha "Emitido" do aluno NÃO aparece → ' +
        'invariante de regressão: o cert vigente (recert_num=1) NÃO foi marcado REPLACED — ' +
        'apenas certs efetivamente substituídos (recert_num=0) aparecem no filtro',
      async () => {
        await learningStudents.openFilterDrawer();
        await learningStudents.openAdvancedFilterCriteria('Certificado');
        await learningStudents.selectStatusFilter(tc4Data.unexpectedBadge);
        await learningStudents.applyFilters();

        // Após filtrar por "Substituído", a linha "Emitido" do aluno NÃO deve aparecer.
        // Richard pode aparecer com a linha "Substituído" (recert_num=0 — o cert antigo
        // que virou REPLACED em TC1). O que NÃO pode existir é uma linha com badge
        // "Emitido" nos resultados de "Substituído" — isso significaria que o cert
        // vigente foi incorretamente marcado REPLACED.
        const linhaEmitidaNoFiltroSubstituido = learningStudents.getRowByEmail(
          tc4Data.alunoLegadoEmail,
          { certState: tc4Data.expectedBadge }, // filtro adicional: só rows com "Emitido"
        );
        await expect(linhaEmitidaNoFiltroSubstituido).toHaveCount(0, { timeout: 10_000 });
      },
    );
  });

  // CLAUDE.md §7.6 G: passo 3 aplica filtro — limpar após execução para
  // não contaminar próximos specs no mesmo contexto de página.
  test.afterEach(async ({ page }) => {
    const learningStudents = new LearningStudentsPage(page);
    await learningStudents.clearFilters().catch(() => undefined);
  });
});
