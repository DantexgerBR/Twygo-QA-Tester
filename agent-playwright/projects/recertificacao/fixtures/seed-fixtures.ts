import { test as baseTest } from '../../../src/fixtures/seed-fixtures-base.js';
import type { Browser } from '@playwright/test';
import { resolve } from 'node:path';
import { ProfileSwitcher } from '../../../src/pages/ProfileSwitcher.js';
import { SeedAdminPage } from '../pages/SeedAdminPage.js';

/**
 * **Fixtures canônicas de seed — projeto Recertificação**.
 *
 * Estende [[seed-fixtures-base]] (cross-projeto) e adiciona apenas as
 * fixtures específicas do domínio Recertificação:
 *
 *  - `cursoComRecertificacaoSeed`: reusa `cursoSeed` (genérico) e liga
 *    `events.has_recertification` via `SeedAdminPage.setHasRecertification`
 *    (subclass com helper específico).
 *
 * **Fixtures herdadas automaticamente do Base** (não precisa redefinir):
 *  `cursoSeed`, `trilhaSeed`, `cursoLiberadoSeed`,
 *  `cursoComAtividadesMarcaveisSeed`, `alunoMatriculadoSeed`,
 *  `alunoComSenhaSeed`, `alunoAprovadoSeed`.
 *
 * **Naming worker-isolated**: recursos criados têm sufixo
 * `w<workerIndex>-<timestamp>` pra evitar colisão em paralelo + permitir
 * cleanup de orfãos por threshold (`scripts/cleanup-env-orphans.ts`).
 *
 * Skill canônica: [[provisionar-seed]] v2.1+ §"Como projeto novo herda
 * o pool".
 *
 * Exemplo de spec consumindo:
 *
 * ```ts
 * import { test, expect } from '../../../fixtures/seed-fixtures.js';
 *
 * test('TC1 — switch aparece com flag ON', async ({ page, cursoSeed }) => {
 *   await page.goto(`/o/${orgId}/contents/${cursoSeed.id}/edit?tab=access`);
 *   // cursoSeed (do Base) + outras fixtures genéricas disponíveis automaticamente
 * });
 * ```
 */

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

export type RecertificacaoFixtures = {
  /**
   * Curso seed com `events.has_recertification = true`. Reusa
   * `cursoSeed` (genérico) e chama `setHasRecertification(id, true)`
   * via UI admin (tab Acesso, switch Chakra). Pré-condição: feature
   * flag `:recertificacao` ATIVA na org (kill switch RN 1). Cleanup é
   * herdado de cursoSeed (cascata).
   *
   * Use em specs que validam comportamento dependente de
   * `has_recertification = true` — fluxos de Reinscrição Individual /
   * em Massa, banner "Reinscreva-se" no Play, e-mail diferenciado.
   */
  cursoComRecertificacaoSeed: { id: number; name: string };
};

async function withAdminPage<T>(
  browser: Browser,
  fn: (page: import('@playwright/test').Page, seed: SeedAdminPage) => Promise<T>,
): Promise<T> {
  const ctx = await browser.newContext({ storageState: STORAGE_PATH });
  const page = await ctx.newPage();
  try {
    await new ProfileSwitcher(page).switchToViaUrl('Administrador');
    return await fn(page, new SeedAdminPage(page));
  } finally {
    await ctx.close();
  }
}

export const test = baseTest.extend<RecertificacaoFixtures>({
  cursoComRecertificacaoSeed: [
    async ({ browser, cursoSeed }, use) => {
      await withAdminPage(browser, (_p, seed) =>
        seed.setHasRecertification(cursoSeed.id, true),
      );
      await use({ id: cursoSeed.id, name: cursoSeed.name });
      // Cleanup do curso é feito pelo cursoSeed (cascata via Base).
    },
    { scope: 'test' },
  ],
});

export { expect } from '@playwright/test';
