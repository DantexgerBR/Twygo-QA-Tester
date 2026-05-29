import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { tc3Data } from './tc3-reinscrever-aluno-cria-novo-participant-zerado.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Skill provisionar-seed v1.7.1 (2026-05-28): refator pra
  // `alunoAprovadoNoCursoFixoSeed` + `getRowByEmail({certState: 'Emitido'})`
  // foi tentado mas falhou — diagnóstico real é mais profundo:
  // o backend Twygo, ao completar engajamento em curso com
  // has_recertification=true, AUTO-RECERTIFICA o aluno criando
  // participant "Pendente" (recert_num+1). Isso significa que após o
  // pipeline da fixture, o aluno JÁ ESTÁ reinscrito — click "Iniciar
  // reinscrição" no Emitido é rejeitado silenciosamente pelo backend
  // (modal "Confirmar reinscrição" não aparece) porque o aluno NÃO PODE
  // ser reinscrito de novo (já tem pending).
  //
  // Pra TC3 funcionar precisaríamos de aluno aprovado SEM auto-recertification
  // pendente. Caminhos:
  //   (a) curso com has_recertification=false na fase de cert, depois
  //       ligar a flag → mas critério de aprovação pode quebrar
  //   (b) cancelar/deletar o participant Pendente antes do test (endpoint
  //       admin DELETE não mapeado)
  //   (c) seed-roadmap-tc3-auto-recert-cancel: helper que cancele a
  //       reinscrição automática gerada pelo backend
  //
  // Fixme legítimo §7.6 F categoria "estado-do-seed-vs-tc-conflict".
  test.fixme(
    true,
    'seed-roadmap-tc3-auto-recert-cancel: refator alunoAprovadoNoCursoFixoSeed validado live 2026-05-28 — backend auto-recertifica aluno após cert (participant Pendente criado), bloqueando click Iniciar reinscrição (modal não aparece). Precisa helper que cancele a reinscrição automática OU outra estratégia de seed.',
  );
  test('TC3 — Reinscrever aluno individualmente cria novo participant zerado', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story('Reinscrever aluno individualmente cria novo participant zerado');
    await allure.severity('critical');
    expect(tc3Data.badgePosReinscricaoEsperado).toBeDefined();
  });
});
