/**
 * Cleanup descartável: deleta pacote 807420 criado pelo piloto.
 * Opt-in: RUN_CLEANUP_PACOTE_PILOTO=1
 */
import { test, expect } from '@playwright/test';
import type { Browser } from '@playwright/test';
import { resolve } from 'node:path';
import { ProfileSwitcher } from '../../src/pages/ProfileSwitcher.js';
import { SeedAdminPage } from '../../projects/recertificacao/pages/SeedAdminPage.js';

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
const ENABLED = process.env.RUN_CLEANUP_PACOTE_PILOTO === '1';
const PACOTE_ID = Number(process.env.PACOTE_ID || '807420');

test.describe('cleanup pacote piloto', () => {
  test.skip(!ENABLED, 'opt-in via RUN_CLEANUP_PACOTE_PILOTO=1');

  test(`deletePacoteByIdSafe(${PACOTE_ID})`, async ({ browser }: { browser: Browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await ctx.newPage();
    try {
      await new ProfileSwitcher(page).switchToViaUrl('Administrador');
      const seed = new SeedAdminPage(page);
      await seed.deletePacoteByIdSafe(PACOTE_ID);
      // eslint-disable-next-line no-console
      console.log(`[cleanup] Pacote ${PACOTE_ID} deletado (ou já ausente)`);
      expect(true).toBe(true);
    } finally {
      await ctx.close();
    }
  });
});
