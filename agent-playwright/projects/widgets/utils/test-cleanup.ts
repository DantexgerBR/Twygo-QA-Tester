import type { Browser } from '@playwright/test';
import { resolve } from 'node:path';
import { PaineisListPage } from '../pages/PaineisListPage.js';

export const STORAGE_STATE = resolve(process.cwd(), 'outputs/.auth/storage.json');

const DEFAULT_VIEWPORT = { width: 1920, height: 1080 };

/**
 * Cleanup canônico de painel criado em teste. Uso em `test.afterAll`.
 * Cria contexto fresco (page do test já fechada quando afterAll roda),
 * abre listagem e remove painel via `deletePanelByNameSafe` (no-op se já
 * deletado ou se o test falhou antes de criar).
 *
 * Skill: limpar-dados-de-teste-twygo. Anti-pattern G (CLAUDE.md §7.6).
 *
 * @param panelName Quando `undefined`, vira no-op silencioso — útil em
 *   suites que capturam o nome em runtime e podem nunca atribuir caso
 *   o test falhe muito cedo.
 */
export async function cleanupPanel(
  browser: Browser,
  panelName: string | undefined,
): Promise<void> {
  if (!panelName) return;
  const ctx = await browser.newContext({
    storageState: STORAGE_STATE,
    viewport: DEFAULT_VIEWPORT,
  });
  const page = await ctx.newPage();
  try {
    const paineis = new PaineisListPage(page);
    await paineis.goToList();
    await paineis.deletePanelByNameSafe(panelName);
  } finally {
    await ctx.close();
  }
}

/**
 * Cleanup de N painéis numa única sessão. Suites que criam source+dest
 * (importar-abas) ou múltiplos painéis numa run. Reusa o mesmo contexto
 * pra economizar o setup de N páginas.
 */
export async function cleanupPanels(
  browser: Browser,
  panelNames: ReadonlyArray<string | undefined>,
): Promise<void> {
  const names = panelNames.filter((n): n is string => Boolean(n));
  if (names.length === 0) return;
  const ctx = await browser.newContext({
    storageState: STORAGE_STATE,
    viewport: DEFAULT_VIEWPORT,
  });
  const page = await ctx.newPage();
  try {
    const paineis = new PaineisListPage(page);
    await paineis.goToList();
    for (const name of names) {
      await paineis.deletePanelByNameSafe(name);
    }
  } finally {
    await ctx.close();
  }
}

/**
 * Cleanup com dependência: desassocia item de menu ANTES de deletar
 * painel — produto bloqueia delete com modal "Painel em uso" enquanto
 * existir item de menu vinculado.
 */
export async function cleanupPanelWithMenuItem(
  browser: Browser,
  panelName: string | undefined,
  useModeId: number,
  itemName?: string,
): Promise<void> {
  if (!panelName) return;
  const ctx = await browser.newContext({
    storageState: STORAGE_STATE,
    viewport: DEFAULT_VIEWPORT,
  });
  const page = await ctx.newPage();
  try {
    const paineis = new PaineisListPage(page);
    await paineis.disassociatePanelFromMenu_safe(panelName, useModeId, itemName);
    await paineis.goToList();
    await paineis.deletePanelByNameSafe(panelName);
  } finally {
    await ctx.close();
  }
}
