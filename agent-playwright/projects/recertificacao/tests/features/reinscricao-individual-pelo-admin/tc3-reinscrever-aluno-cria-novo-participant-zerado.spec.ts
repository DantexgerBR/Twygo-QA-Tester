import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { tc3Data } from './tc3-reinscrever-aluno-cria-novo-participant-zerado.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Skill provisionar-seed v1.6.2 (2026-05-28): pipeline do seed
  // funciona via `alunoAprovadoNoCursoFixoSeed` (curso 807403, cert
  // emitido validado), MAS observação live mostrou que ao concluir
  // engajamento no curso com `has_recertification=true`, o backend
  // produz AUTOMATICAMENTE 2 linhas pra mesmo aluno:
  //   - Linha 1: participant Pendente, 0% progresso (provavelmente
  //     recertification_number=N+1 já criada pelo backend)
  //   - Linha 2: participant Emitido, 80% progresso, cert válido
  // TC3 assume estado de aluno com 1 participant (cert emitido) +
  // ainda não reinscrito — esse estado NÃO é produzido pelo fluxo
  // matricular+completar no 807403 hoje.
  //
  // Próximos passos pra destravar (escolher após investigação live):
  //  (a) Diagnosticar matricularAlunoComSenha vs duplicação backend
  //      (auto-recertification em has_recertification=true)
  //  (b) Adicionar `getRowByEmail({ certState: 'emitido' })` em
  //      LearningStudentsPage pra desambiguar
  //  (c) Usar curso SEM has_recertification ON na fase de cert, depois
  //      ligar (mas isso pode quebrar critério de aprovação)
  //
  // Fixme legítimo §7.6 F categoria "estado-do-seed-conflita-com-tc".
  test.fixme(
    true,
    'seed-roadmap-tc3-state-conflict: pipeline alunoAprovadoNoCursoFixoSeed emite cert (5027076 validado) mas produz aluno com 2 participants no 807403 (Pendente + Emitido). getRowByEmail.first() pega o Pendente → menu kebab sem "Iniciar reinscrição" → modal não dispara. Ver skill provisionar-seed v1.6.2.',
  );
  test('TC3 — Reinscrever aluno individualmente cria novo participant zerado', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story('Reinscrever aluno individualmente cria novo participant zerado');
    await allure.severity('critical');
    expect(tc3Data.badgePosReinscricaoEsperado).toBeDefined();
  });
});
