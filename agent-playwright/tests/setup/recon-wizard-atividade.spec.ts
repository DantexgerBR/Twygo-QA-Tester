/**
 * Spec-piloto descartável — recon do wizard de criar atividade.
 *
 * Opt-in: RUN_RECON_WIZARD_ATIVIDADE=1
 */
import { test, expect } from '../../src/fixtures/exploratory-fixture.js';
import { fixedSeed } from '../../projects/recertificacao/data/fixed-seed.data.js';
import { ProfileSwitcher } from '../../src/pages/ProfileSwitcher.js';

const ENABLED = process.env.RUN_RECON_WIZARD_ATIVIDADE === '1';

test.describe.configure({ timeout: 5 * 60 * 1000 });

test.describe('recon wizard atividade', () => {
  test.skip(!ENABLED, 'opt-in via RUN_RECON_WIZARD_ATIVIDADE=1');

  test('listagem admin /e/{id}/contents + abrir wizard atividade', async ({ page }) => {
    await new ProfileSwitcher(page).switchToViaUrl('Administrador');
    const cursoId = fixedSeed.cursoComAtividadesEAprovadoEventId;
    await page.goto(`/e/${cursoId}/contents`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000);

    // Dump dos botões/links visíveis na página, especialmente que mencionem add/novo
    const ctaDump = await page.evaluate(() => {
      const all = Array.from(document.querySelectorAll('a, button, [role="button"]'));
      const visible = all.filter((el) => {
        const r = el.getBoundingClientRect();
        return r.width > 0 && r.height > 0;
      });
      return visible.slice(0, 50).map((el) => ({
        tag: el.tagName,
        text: (el.textContent || '').trim().slice(0, 50),
        href: el.getAttribute('href'),
        id: el.id,
        cls: el.className?.toString().slice(0, 60),
        testId: el.getAttribute('data-test-id') || el.getAttribute('data-testid'),
      }));
    });
    // eslint-disable-next-line no-console
    console.log('[recon] CTAs visíveis em /e/{id}/contents:', JSON.stringify(ctaDump.filter((c) =>
      /add|adicionar|novo|nova|criar|new/i.test(c.text)
      || /add|adicionar|novo|nova|criar|new/i.test(c.cls || '')
      || /add|adicionar|novo|nova|criar|new/i.test(c.id || '')
      || /add|adicionar|novo|nova|criar|new/i.test(c.testId || '')
    ), null, 2));

    // Procura por seletores conhecidos de Twygo (.btn-add, etc)
    const candidates = await page.evaluate(() => {
      const tries = [
        '.btn-add', '[id*="add"]', '[class*="add-content"]',
        '[class*="add_content"]', '.dd-list > .new', '.add-content',
        'a[href*="contents/new"]', 'a[href*="new_content"]',
      ];
      return tries.map((s) => ({
        selector: s,
        count: document.querySelectorAll(s).length,
        sample: document.querySelector(s)?.outerHTML?.slice(0, 200) || null,
      })).filter((x) => x.count > 0);
    });
    // eslint-disable-next-line no-console
    console.log('[recon] Candidatos por seletor:', JSON.stringify(candidates, null, 2));

    expect(page.url()).toContain('/contents');
  });
});
