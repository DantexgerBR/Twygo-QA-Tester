import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Isolamento em Ambientes Adicionais', () => {
  // Decisão locked do QA (Suite 14): o frontmatter da suíte declara
  // `env_secondary: null` e não há env adicional pareado configurado em
  // `config/environment.json` para o projeto Recertificação (catálogo da
  // skill `testar-ambientes-adicionais-twygo` lista apenas `staging-widgets`
  // pareado em 2026-05). Sem `staging-base-de-conhecimento-aditional` em
  // `environment.json` + credenciais TWYGO_*_ADITIONAL_* em `.env`, não há
  // como criar `outputs/.auth/storage-aditional.json` nem resolver `baseURL`
  // do tenant pareado.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio de infra — configurar env adicional + credenciais antes de
  // habilitar este TC. Destinatário: DevOps/QA Lead.
  test.fixme(
    true,
    'env secundário não configurado em config/environment.json (frontmatter env_secondary: null). Bloqueio de infra — configurar staging-base-de-conhecimento-aditional + senha em .env antes de habilitar este TC.',
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
      'null (não configurado em config/environment.json)',
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
