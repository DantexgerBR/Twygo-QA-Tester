/**
 * Spec-piloto descartável — valida createPacote retornando um eventId.
 * Opt-in: RUN_SEED_PILOTO_CREATE_PACOTE=1
 */
import { expect } from '@playwright/test';
import { test } from '../../src/fixtures/seed-fixtures.js';
import type { Browser } from '@playwright/test';
import { resolve } from 'node:path';
import { ProfileSwitcher } from '../../src/pages/ProfileSwitcher.js';
import { SeedAdminPage } from '../../projects/recertificacao/pages/SeedAdminPage.js';

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');
const ENABLED = process.env.RUN_SEED_PILOTO_CREATE_PACOTE === '1';

test.describe.configure({ timeout: 3 * 60 * 1000 });

test.describe('piloto createPacote', () => {
  test.skip(!ENABLED, 'opt-in via RUN_SEED_PILOTO_CREATE_PACOTE=1');

  test('createPacote retorna eventId válido', async ({ browser }: { browser: Browser }) => {
    const ctx = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await ctx.newPage();
    try {
      await new ProfileSwitcher(page).switchToViaUrl('Administrador');
      const seed = new SeedAdminPage(page);
      const name = `Pacote piloto w0-${Date.now()}`;
      const id = await seed.createPacote({ name });
      // eslint-disable-next-line no-console
      console.log('[piloto createPacote] id criado:', id, 'name:', name);
      expect(id).toBeGreaterThan(0);
      // Cleanup
      await seed.deletePacoteByIdSafe(id);
    } finally {
      await ctx.close();
    }
  });
});
