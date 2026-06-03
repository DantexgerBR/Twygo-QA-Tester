import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Isolamento em Ambientes Adicionais', () => {
  // env adicional `staging-recertificacao-aditional` (orgId 37050) ESTÁ
  // configurado em `config/environment.json` + `.env` (2026-05-27).
  // Storage `outputs/.auth/storage-aditional.json` é gerado pelo globalSetup.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "DB pura"): os passos 1 e 3
  // exigem `SELECT COUNT(*) FROM event_participants WHERE user_id = X` em
  // 2 bancos distintos — validação cross-tenant fora do escopo Playwright
  // (ver CONTRACT.md §validador secundário). Quando agent-db estiver
  // implementado, este TC pode ser convertido em validação API+DB.
  // Destinatário: agent-db (futuro).
  test.fixme(
    true,
    'Passos 1 e 3 são DB-pura cross-tenant (SELECT COUNT em 2 bancos). Fora do escopo Playwright — aguarda agent-db. Env aditional já configurado.',
  );

  test('TC1 — Reinscrição num env não afeta participants no env pareado', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Isolamento em Ambientes Adicionais');
    await allure.story(
      'Reinscrição num env não afeta participants no env pareado',
    );
    await allure.severity('critical');
    await allure.tag('MULTI_TENANT');
    await allure.label('executionType', 'manual');
    await allure.parameter(
      'env_secondary',
      'staging-recertificacao-aditional (orgId 37050) — DB validation pendente em agent-db',
    );

    await allure.step(
      '1. Capturar contagem atual de participants em ambos os envs para o mesmo aluno (`SELECT COUNT(*) FROM event_participants WHERE user_id = X`)',
      async () => {
        // REVISAR: validação DB pura cross-tenant — fora do escopo Playwright.
        // Quando env adicional estiver configurado, capturar contagem inicial
        // no principal E no adicional usando 2 contextos distintos (storage +
        // baseURL pareados) — ver skill `testar-ambientes-adicionais-twygo`.
        expect(page).toBeDefined();
      },
    );

    await allure.step(
      '2. Reinscrever o aluno no env principal pelo fluxo da suíte 2 TC3',
      async () => {
        // REVISAR: reinscrição via UI no env principal — reaproveitar o
        // Page Object da Suite 2 (Reinscrição Admin Individual) quando ele
        // existir; aqui o foco é o isolamento, não o fluxo de reinscrição.
      },
    );

    await allure.step(
      '3. Re-capturar a contagem em ambos os envs (principal +1, secundário inalterado)',
      async () => {
        // REVISAR: invariante de isolamento multi-tenant — `event_participants`
        // do env secundário NÃO pode ter delta após reinscrição no principal.
        // Quando habilitado, asserta diferença numérica no contexto principal
        // (count_after_principal - count_before_principal === 1) e ausência
        // de delta no adicional (count_after_aditional === count_before_aditional).
      },
    );
  });
});
