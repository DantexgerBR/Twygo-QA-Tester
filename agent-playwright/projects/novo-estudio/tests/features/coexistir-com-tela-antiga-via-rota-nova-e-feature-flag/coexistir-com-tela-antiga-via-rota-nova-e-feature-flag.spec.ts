import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import * as allure from 'allure-js-commons';
import { StudioActivitiesPage } from '../../../pages/StudioActivitiesPage.js';
import { safeGoto, dismissCommonModals } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';
import { suiteData } from './coexistir-com-tela-antiga-via-rota-nova-e-feature-flag.shared.data.js';

// ============================================================================
// Suíte #R15 — "Coexistir com tela antiga via rota nova e feature flag" (1.15).
//
// ⚠️ PREMISSA DA SUÍTE NÃO SE CONFIRMA (recon 2026-06-09, org 37061):
//  - A flag Flipper `creation_studio` está **DISABLED** ("No actors enabled,
//    0% of actors, 0% of time") — e MESMO ASSIM o Estúdio funciona.
//  - Não existe rota antiga `/o/{org}/events/:id/edit/activities` (→ 404).
//  - A edição do curso é uma página ÚNICA (`/o/{org}/contents/{id}/edit`) com
//    abas; a aba "Atividades" (`tab-studio`) renderiza o Estúdio.
//  Logo o gate real do Estúdio NÃO é essa flag Flipper (provável contrato /
//  sys_subscription_functionalities — que a suíte 1.18 cita, ou feature
//  promovida). PERGUNTA AO DEV: qual é o gate real do Estúdio? Sem isso, os TCs
//  de roteamento-por-flag e de estado-OFF não são testáveis como especificado.
//  NÃO desligar o gate na 37061 (blast radius — org principal de todos os QAs).
//
//  ⚠️ Atualizar a skill `testar-estudio-criacao-twygo`: ela afirma
//  "creation_studio (Flipper) na 37061 já está ON; se OFF cai na tela antiga
//  /edit/activities" — recon falsificou as 3 afirmações. Tracking: card 19719.
// ============================================================================

test.describe(suiteData.suiteName, () => {
  test('Feature flag habilitada redireciona para nova rota', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Feature flag habilitada redireciona para nova rota');
    await allure.severity('critical');

    // Validável HOJE: a aba "Atividades" da edição do curso resolve para o
    // Estúdio. REVISAR (premissa da AT divergente): a AT diz que isto depende
    // da flag `creation_studio` ON e que a URL vira `/edit/studio` — porém a
    // flag está OFF e a URL real é `?tab=studio`. Ver header do arquivo.
    await safeGoto(page, `/o/${getOrgId()}/contents/${suiteData.contentId}/edit`);
    await dismissCommonModals(page);
    await page.getByTestId('tab-studio').click(); // rótulo visível: "Atividades"
    const studio = new StudioActivitiesPage(page);
    await expect(studio.threeColumnShell).toBeVisible({ timeout: 20_000 });
    await expect(page).toHaveURL(/tab=studio/);
  });

  test('Feature flag desabilitada redireciona para rota antiga', async () => {
    test.fixme(
      true,
      `[premissa-divergente] a AT pressupõe que com a flag OFF a edição cai na tela antiga; mas a flag Flipper creation_studio JÁ está OFF e o Estúdio aparece mesmo assim (recon ${suiteData.reconDate}). Gate real ≠ essa flag — confirmar com o dev. Não desligar gate na 37061 (blast radius). Card ${suiteData.trackingCard}.`,
    );
  });

  test('Habilitar feature flag para organização via Flipper', async () => {
    test.fixme(
      true,
      '[premissa-divergente] habilitar/desabilitar a flag Flipper creation_studio não altera o comportamento do Estúdio (já está OFF e funciona). Testar o toggle desta flag não valida o gating. Confirmar gate real com o dev.',
    );
  });

  test('Rota nova /edit/studio acessível', async ({ page }) => {
    await allure.epic(suiteData.projectEpic);
    await allure.feature(suiteData.suiteName);
    await allure.story('Rota nova /edit/studio acessível');
    await allure.severity('critical');

    // Rota REAL é `/o/{org}/contents/{id}/edit?tab=studio` (a AT documenta
    // `/events/:id/edit/studio`, que dá 404 — REVISAR no AT).
    const studio = new StudioActivitiesPage(page);
    await studio.goto(suiteData.contentId);
    await expect(studio.threeColumnShell).toBeVisible();
    await expect(studio.list).toBeVisible();
  });

  test('Rota antiga /edit/activities continua acessível', async () => {
    test.fixme(
      true,
      `[rota-inexistente] /o/{org}/events/:id/edit/activities retorna 404 (recon ${suiteData.reconDate}). Não há rota antiga distinta: a edição é página única com a aba "Atividades" = Estúdio. "Coexistência por URL" como na AT não existe. Confirmar com dev/AT.`,
    );
  });

  test('Aluno consome conteúdo publicado independente da origem', async () => {
    test.fixme(
      true,
      '[publicar-ausente] pré-condição exige "atividade publicada via Estúdio E via rota antiga"; a publicação via Estúdio não existe (ver suíte 1.12 — botão "Publicar alterações" ausente) e não há rota antiga. Bloqueado até o gate/publicação existirem.',
    );
  });

  test('[Regressão] Tela antiga não recebe novas funcionalidades', async () => {
    test.fixme(
      true,
      '[premissa-divergente] requer a tela antiga com a flag OFF; mas a flag está OFF e a tela exibida é o Estúdio (novo). Sem caminho confiável para a tela antiga, a regressão não é verificável. Confirmar gate real com o dev.',
    );
  });

  test('Rollback (desligar flag) sem perda de dados', async () => {
    test.fixme(
      true,
      '[premissa-divergente] + [publicar-ausente] requer desligar o gate (não é a flag Flipper) + publicar via Estúdio (ausente). Desligar o gate na 37061 tem blast radius (org principal). Alinhar com dev/João.',
    );
  });

  test('EventContent é o mesmo nas duas telas', async () => {
    test.fixme(
      true,
      '[db] + [premissa-divergente] asserção depende de consultar event_contents (executor agent-db) e de editar "nas duas telas"; não há rota antiga distinta. Parte de banco vai para agent-db (CONTRACT.md).',
    );
  });

  test('[Validação Manual] Métrica de adoção monitorada pelo CS', async () => {
    test.fixme(
      true,
      '[dep-externa] requer dashboard de métricas do CS, fora do produto/alcance do agente. Validação manual conforme a própria AT.',
    );
  });

  test('Transição entre estados de flag durante sessão ativa', async () => {
    test.fixme(
      true,
      '[premissa-divergente] requer desligar o gate em runtime e observar o redirect; o gate não é a flag Flipper creation_studio (já OFF e o Estúdio funciona). Não desligar gate na 37061 (blast radius). Confirmar com o dev.',
    );
  });
});
