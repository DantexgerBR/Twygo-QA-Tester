import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';
import { fixedSeed } from '../../../data/fixed-seed.data.js';

/**
 * Smoke spec — valida o fluxo canônico SeedAdminPage.matricularAluno +
 * desmatricularAlunoSafe (skill provisionar-seed v1.3 §"Matrícula de aluno").
 *
 * Roda contra o curso permanente do env (fixedSeed.emptyCursoId = 806852,
 * nome "Validação seed via menu real"). Aluno worker-isolated criado +
 * desmatriculado na mesma execução — não polui o env.
 *
 * Pré-condição: storageState do Administrador + Tipo de experiência "Suite
 * Everton CSV" cadastrado (já existe em staging-recertificacao).
 *
 * Smoke = sem assertions explícitas; o teste passa se nenhum helper throw.
 */
test.describe('Smoke: matricularAluno', () => {
  test('matricula + desmatricula aluno via drawer Inscrição', async ({
    page,
  }, testInfo) => {
    const seed = new SeedAdminPage(page);
    const cursoName = 'Validação seed via menu real';
    const email = `smoke-matricula-w${testInfo.workerIndex}-${Date.now()}@example.com`;
    try {
      await seed.matricularAluno({
        contentName: cursoName,
        alunoEmail: email,
        alunoFirstName: 'Smoke',
        alunoLastName: `W${testInfo.workerIndex}`,
      });
    } finally {
      // Cleanup independente do resultado.
      await seed.desmatricularAlunoSafe({
        contentName: cursoName,
        alunoEmail: email,
      });
    }
    // Garante uso do fixedSeed (evita lint unused).
    void fixedSeed.emptyCursoId;
  });
});
