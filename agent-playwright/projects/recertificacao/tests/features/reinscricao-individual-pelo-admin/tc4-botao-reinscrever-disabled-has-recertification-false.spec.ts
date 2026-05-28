import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { tc4Data } from './tc4-botao-reinscrever-disabled-has-recertification-false.data.js';

test.describe('Reinscrição Individual pelo Admin', () => {
  // Skill provisionar-seed v1.6.1 (2026-05-28): TC4 exige aluno ELEGÍVEL
  // por progresso 100% num curso SEM `has_recertification`. Refator
  // 2026-05-28 pra `alunoMatriculadoSeed` foi reverted após validação live —
  // aluno recém-matriculado tem progresso 0%, e o botão "Reinscrever" só
  // aparece DISABLED na linha de aluno elegível (i.e. com progresso 100%
  // ou cert). Pré-condição "aluno elegível" depende de
  // `seed-roadmap-atividade-aula-1` (criar atividade via UI admin, ainda
  // não implementado).
  //
  // Descoberta importante: TODA a Suite 2 (TC1-TC4 UI) depende deste
  // mesmo helper — alunoMatriculadoSeed não cobre nenhum TC porque o
  // requisito é aluno aprovado, não apenas matriculado.
  //
  // Fixme legítimo §7.6 F categoria "seed-roadmap-*".
  test.fixme(
    true,
    'seed-roadmap-atividade-aula-1: pré-condição "aluno elegível por progresso 100%" exige curso com atividades pra completar — helper de criação de atividades ainda não implementado. cursoSeed default (has_recertification=false) cobre o curso mas alunoMatriculadoSeed cru não cobre o aluno. Ver skill provisionar-seed v1.6.1.',
  );
  test('TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false', async () => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Reinscrição Individual pelo Admin');
    await allure.story(
      'Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false',
    );
    await allure.severity('normal');
    await allure.parameter(
      'feature_flag',
      ':recertificacao=ON (assumido no env principal)',
    );

    await allure.step(
      '1. Pré-condição: curso sem has_recertification + 1 aluno elegível',
      async () => {
        // Quando `seed-roadmap-atividade-aula-1` for implementado, refatorar
        // pra: cursoSeed + atividade + alunoMatriculadoSeed + completar curso
        // (sem ligar has_recertification — fica default false). Aluno fica
        // elegível por progresso 100%, botão Reinscrever aparece DISABLED.
      },
    );

    await allure.step(
      '2. Acessar lista de aprendizagem do curso → Aluno listado',
      async () => {
        // Implementação pendente — ver fixme acima.
        expect(true).toBe(true);
      },
    );

    await allure.step(
      '3. Abrir menu de ações da linha do aluno → Item "Reinscrever" exibido mas DESABILITADO',
      async () => {
        // Implementação pendente — ver fixme acima.
        await allure.tag('REVIEW_NEEDED');
        // Asserção planejada quando seed estiver pronto:
        // await learning.expectReinscreverButtonState(alunoEmail, 'disabled');
        expect(tc4Data.tooltipDesabilitadoRegex).toBeDefined();
      },
    );
  });
});
