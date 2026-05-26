import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';

test.describe('Isolamento em Ambientes Adicionais', () => {
  // Decisão locked do QA (Suite 14): o frontmatter da suíte declara
  // `env_secondary: null` e não há env adicional pareado configurado em
  // `config/environment.json` para o projeto Recertificação. Sem o pareamento
  // `staging-base-de-conhecimento` ↔ `staging-base-de-conhecimento-aditional`
  // declarado, o Flipper toggle por org não pode ser validado cross-tenant.
  //
  // fixme legítimo (CLAUDE.md §7.6 F, categoria "dependência externa fora"):
  // bloqueio de infra — configurar env adicional + credenciais antes de
  // habilitar este TC. Destinatário: DevOps/QA Lead.
  test.fixme(
    true,
    'env secundário não configurado em config/environment.json (frontmatter env_secondary: null). Bloqueio de infra — configurar staging-base-de-conhecimento-aditional + senha em .env antes de habilitar este TC.',
  );

  test('TC2 — Toggle da flag :recertificacao no env principal NÃO afeta env secundário', async ({
    page,
  }) => {
    await allure.epic('Twygo - Recertificação');
    await allure.feature('Isolamento em Ambientes Adicionais');
    await allure.story(
      'Toggle da flag :recertificacao no env principal NÃO afeta env secundário',
    );
    await allure.severity('normal');
    await allure.tag('MULTI_TENANT');
    await allure.label('executionType', 'manual');
    await allure.parameter(
      'env_secondary',
      'null (não configurado em config/environment.json)',
    );

    await allure.step(
      '1. Pré-condição: flag `:recertificacao` ON em ambas as organizações (env principal e secundário)',
      async () => {
        // REVISAR: pré-condição cross-tenant — exige Flipper Admin acessível
        // tanto no principal quanto no adicional. Quando habilitado, validar
        // via `FlipperAdminPage.isActorPresent` em 2 contextos distintos
        // (storage default + ADITIONAL_STORAGE_PATH) — ver skills
        // `testar-feature-flag-twygo` + `testar-ambientes-adicionais-twygo`.
        expect(page).toBeDefined();
      },
    );

    await allure.step(
      '2. Acessar Flipper Admin e remover APENAS a organização do env principal do actor da flag',
      async () => {
        // REVISAR: toggle escopado por org no principal — `FlipperAdminPage`
        // com `removeActor('Organization;${principalOrgId}')`. Reverter no
        // `afterAll` para não contaminar a Suite 13 (que assume flag ON).
      },
    );

    await allure.step(
      '3. Acessar a edição de curso no env principal → Switch "Habilitar reinscrição" NÃO está visível',
      async () => {
        // REVISAR: validar ausência no principal via `ContentEditPage`
        // (mesmo POM da Suite 1 TC2). Asserta `toBeHidden()` no switch
        // `has_recertification` após remoção do actor.
      },
    );

    await allure.step(
      '4. Acessar a edição de curso no env secundário → Switch "Habilitar reinscrição" CONTINUA visível',
      async () => {
        // REVISAR: invariante do isolamento Flipper — actor removido no
        // principal NÃO propaga para o adicional. Em contexto pareado
        // (`storageState: ADITIONAL_STORAGE_PATH` + `baseURL: aditional.baseUrl`),
        // o switch precisa permanecer visível. Demonstra que feature flag
        // é por env (rollout actor), não global.
      },
    );
  });
});
