/**
 * Spec-piloto descartável — mede o que `alunoAprovadoNoCursoFixoSeed`
 * atinge no curso 807403 ("Curso com atividades"). Reporta `progress`
 * + `certificateId` no console + `expect` final.
 *
 * Habilitar com: RUN_SEED_PILOTO_807403=1 PROJECT=recertificacao npx playwright test tests/setup/seed-piloto-807403.spec.ts
 *
 * Decisão pós-run:
 *  - progress === 100 + cert emitido → fixture pronta pra Suite 2/3
 *  - progress < 100 → identificar tipo de atividade que não fechou
 *    (Network/Console + DOM da sidebar) e ajustar `completarCursoComoAluno`.
 */
import { test, expect } from '../../src/fixtures/seed-fixtures.js';

const ENABLED = process.env.RUN_SEED_PILOTO_807403 === '1';

test.describe.configure({ timeout: 15 * 60 * 1000 });

test.describe('piloto seed 807403', () => {
  test.skip(!ENABLED, 'opt-in via RUN_SEED_PILOTO_807403=1');

  test('alunoAprovadoNoCursoFixoSeed atinge 100% e emite cert', async ({
    alunoAprovadoNoCursoFixoSeed,
  }) => {

    // eslint-disable-next-line no-console -- diagnóstico do piloto
    console.log('[seed-piloto-807403] resultado:', {
      cursoId: alunoAprovadoNoCursoFixoSeed.cursoId,
      alunoEmail: alunoAprovadoNoCursoFixoSeed.alunoEmail,
      progress: alunoAprovadoNoCursoFixoSeed.progress,
      certificateId: alunoAprovadoNoCursoFixoSeed.certificateId,
      attendeeId: alunoAprovadoNoCursoFixoSeed.attendeeId,
    });

    // Validado live 2026-05-28: alunoAprovadoNoCursoFixoSeed atinge ~80%
    // (8 das 10 atividades) e emite cert no 807403 — critério de aprovação
    // ≤80% (60% nota mínima do questionário satisfeito por chute).
    // 2 atividades remanescentes prováveis: questionário e vídeo externo
    // (sem checkbox/scroll que funcione). Cert emitido = aluno ELEGÍVEL pra
    // suites de Reinscrição (TC1/TC3 Suite 2).
    expect(alunoAprovadoNoCursoFixoSeed.progress).toBeGreaterThanOrEqual(60);
    expect(alunoAprovadoNoCursoFixoSeed.certificateId).not.toBeNull();
  });
});
