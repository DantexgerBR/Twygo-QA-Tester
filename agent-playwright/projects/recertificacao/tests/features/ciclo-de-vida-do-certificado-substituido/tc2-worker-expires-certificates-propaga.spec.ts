import { test, expect } from '../../../../../src/fixtures/seed-fixtures.js';
import * as allure from 'allure-js-commons';
import { LearningStudentsPage } from '../../../pages/LearningStudentsPage.js';
import { tc2Data } from './tc2-worker-expires-certificates-propaga.data.js';

test.describe.configure({ timeout: 15 * 60 * 1000 });

test.describe('Ciclo de Vida do Certificado Substituído', () => {
  // Decisão QA 2026-05-29: refatorado de "requer Rails console" para validação
  // via UI usando a ação "Expirar certificado" no menu kebab da linha do aluno.
  //
  // Seed: fixture canônica `alunoAprovadoNoCursoFixoSeed` cria aluno
  // worker-isolated com cert Emitido no curso 807403 — não conflita com
  // TC4 (que usa Richard Sebold no 807287).
  //
  // RN 22/22.1: `ExpiresCertificates#expire_replaced_certificates` —
  // ao expirar o cert VALID, os REPLACED do mesmo par também expiram.
  // A ação UI "Expirar certificado" dispara esse mesmo fluxo server-side
  // e o resultado é observável via badge "Expirado" na listagem.

  test(
    'TC2 — Worker ExpiresCertificates expira VALID e propaga para REPLACED do mesmo par',
    { tag: '@seed-heavy' },
    async ({ page, alunoAprovadoNoCursoFixoSeed }) => {
      await allure.epic('Twygo - Recertificação');
      await allure.feature('Ciclo de Vida do Certificado Substituído');
      await allure.story(
        'Worker ExpiresCertificates expira VALID e propaga para REPLACED do mesmo par',
      );
      await allure.severity('normal');
      await allure.parameter('seed_cursoId', String(alunoAprovadoNoCursoFixoSeed.cursoId));
      await allure.parameter('seed_alunoEmail', alunoAprovadoNoCursoFixoSeed.alunoEmail);

      const learning = new LearningStudentsPage(page);
      const cursoId = alunoAprovadoNoCursoFixoSeed.cursoId;
      const alunoEmail = alunoAprovadoNoCursoFixoSeed.alunoEmail;

      await allure.step(
        '1. Pré-condição: aluno aprovado com cert Emitido (fixture) — linha visível na Aprendizagem',
        async () => {
          expect(
            alunoAprovadoNoCursoFixoSeed.certificateId,
            'Fixture deve produzir cert emitido',
          ).not.toBeNull();
          await learning.goToList(cursoId);
          const linhaEmitida = learning.getRowByEmail(alunoEmail, {
            certState: tc2Data.certStateAntes,
          });
          await expect(linhaEmitida).toBeVisible({ timeout: 15_000 });
        },
      );

      await allure.step(
        '2. Expirar certificado do aluno via menu kebab "Expirar certificado" → ' +
          'RN 22: expire_replaced_certificates processa o cert VALID e propaga REPLACED do par',
        async () => {
          await learning.expirarCertificadoDoAluno(alunoEmail, {
            certState: tc2Data.certStateAntes,
          });
        },
      );

      await allure.step(
        '3. Verificar na Aprendizagem que a linha do aluno agora exibe badge "Expirado"',
        async () => {
          await page.reload();
          await learning.goToList(cursoId);
          const linhaExpirada = learning.getRowByEmail(alunoEmail, {
            certState: tc2Data.expectedBadgeApos,
          });
          await expect(linhaExpirada).toBeVisible({ timeout: 15_000 });
          await expect(linhaExpirada).toContainText(tc2Data.expectedBadgeApos);
        },
      );
    },
  );
});
