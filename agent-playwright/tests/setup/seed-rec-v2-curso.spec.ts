import { test, expect } from '@playwright/test';
import { ContentEditPage } from '../../projects/recertificacao/pages/ContentEditPage.js';
import { fixedSeed } from '../../projects/recertificacao/data/fixed-seed.data.js';
import { getOrgId } from '../../src/utils/environment.js';

/**
 * Script one-shot pra ATIVAR switch "Habilitar reinscrição" no curso seed
 * já criado (event_id em fixed-seed.data.ts).
 *
 * **Bypass do POM canônico (workaround temporário)**:
 * `ContentEditPage.openEditByIdInAcessoTab` usa `safeGoto` que aguarda
 * `domcontentloaded` (NÃO `load`/`networkidle`, propositalmente — trackers
 * Twygo seguram `load` indefinidamente). Mas a edit page facelift carrega
 * o React app via fetch DEPOIS do domcontentloaded; e `dismissCommonModals`
 * chamado IMEDIATAMENTE pode interferir com a hidratação. Resultado: tabs
 * `[role="tab"]` levam mais que 20s pra aparecer no DOM.
 *
 * Workaround: `page.goto` direto com `waitUntil: 'networkidle'` → React
 * já hidratou quando retorna. Tabs aparecem imediato.
 *
 * **Fix canônico pendente (TODO no projeto)**: `openEditReactAccessById`
 * em ContentEditPage.ts:59 deveria fazer `waitForLoadState('networkidle')`
 * (com `blockTrackers` aplicado antes pra evitar travamento) APÓS o
 * safeGoto. Ver investigação completa em commits 2026-05-28.
 *
 * Como rodar:
 *   RUN_SEED_REC_V2=1 PROJECT=recertificacao npx playwright test --project=chromium tests/setup/seed-rec-v2-curso.spec.ts --reporter=list
 */
test('Bootstrap seed: ativar switch Habilitar reinscrição no curso Rec V2', async ({ page }) => {
  test.skip(
    !process.env.RUN_SEED_REC_V2,
    'Spec one-shot. Roda só com: RUN_SEED_REC_V2=1 npx playwright test --project=chromium tests/setup/seed-rec-v2-curso.spec.ts --reporter=list',
  );

  const cursoId = fixedSeed.cursoComRecertificacaoEventId;
  expect(cursoId, 'cursoComRecertificacaoEventId não pode ser sentinel 0').toBeGreaterThan(0);

  const orgId = getOrgId();
  const editUrl = `/o/${orgId}/contents/${cursoId}/edit`;

  console.log(`[SEED] Navegando para ${editUrl} (waitUntil networkidle)...`);
  // Bypass do safeGoto — usar networkidle pra garantir React hidratado.
  // Catch porque trackers Twygo podem segurar networkidle eternamente; se
  // timeout disparar mas tabs já estiverem visíveis, continua.
  await page.goto(editUrl, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {
    console.log('[SEED] networkidle timed out — verificando se tabs renderizaram mesmo assim...');
  });

  // Confirma tabs visíveis (React hidratado)
  const tabsCount = await page.locator('[role="tab"]').count();
  console.log(`[SEED] Tabs encontradas: ${tabsCount}`);
  expect(tabsCount, 'React deveria ter hidratado as tabs').toBeGreaterThanOrEqual(8);

  const editPage = new ContentEditPage(page);

  console.log(`[SEED] Clicando na tab Acesso...`);
  await editPage.goToAcessoTab();

  const before = await editPage.isHabilitarReinscricaoOn();
  console.log(`[SEED] Estado atual do switch: ${before}`);
  if (!before) {
    // Bypass setHabilitarReinscricao — input é screen-reader-only, .check()
    // dá timeout 30s. Click direto no label visível resolve.
    console.log(`[SEED] Clicando no label visível...`);
    await editPage.getHabilitarReinscricaoVisible().click();
  }
  // Aguarda um beat pra React refletir state
  await page.waitForTimeout(500);
  console.log(`[SEED] Estado após toggle: ${await editPage.isHabilitarReinscricaoOn()}`);

  console.log(`[SEED] Salvando...`);
  await editPage.save();
  await editPage.expectSaveSuccess();

  // Reabre pra confirmar persistência
  console.log(`[SEED] Reabrindo edit page pra confirmar persistência...`);
  await page.goto(editUrl, { waitUntil: 'networkidle', timeout: 30_000 }).catch(() => {});
  await editPage.goToAcessoTab();
  const stillOn = await editPage.isHabilitarReinscricaoOn();
  expect(stillOn, 'Switch deveria estar ON após save + reload').toBe(true);

  console.log('');
  console.log('============================================================');
  console.log(`[SEED] SUCESSO. Curso ${cursoId} agora tem has_recertification=true.`);
  console.log('');
  console.log('[NEXT STEP MANUAL] no UI admin:');
  console.log(`  1. Adicionar atividades ao curso ${cursoId}`);
  console.log(`  2. Configurar critérios de aprovação (Gerenciar)`);
  console.log(`  3. Configurar emissão automática de certificado`);
  console.log(`  4. (opcional) Publicar (situation development → released)`);
  console.log('============================================================');
});
