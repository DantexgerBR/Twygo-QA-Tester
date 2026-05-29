/**
 * Recon: lista de conteúdos → kebab da row do curso → "Atividades".
 * Caminho confirmado pelo usuário 2026-05-28 (screenshot recon v6).
 * Opt-in: RUN_RECON_WIZARD_ATIVIDADE=1
 */
import { test, expect } from '../../src/fixtures/exploratory-fixture.js';
import { fixedSeed } from '../../projects/recertificacao/data/fixed-seed.data.js';
import { ProfileSwitcher } from '../../src/pages/ProfileSwitcher.js';
import { ContentEditPage } from '../../projects/recertificacao/pages/ContentEditPage.js';

const ENABLED = process.env.RUN_RECON_WIZARD_ATIVIDADE === '1';

test.describe.configure({ timeout: 5 * 60 * 1000 });

test.describe('recon wizard atividade', () => {
  test.skip(!ENABLED, 'opt-in via RUN_RECON_WIZARD_ATIVIDADE=1');

  test('row kebab Atividades → tela gerenciar → dump wizard', async ({ page }) => {
    await new ProfileSwitcher(page).switchToViaUrl('Administrador');

    const edit = new ContentEditPage(page);
    await edit.goToContentList();
    await page.waitForTimeout(2500);

    // Pesquisa pra reduzir a lista a 1 row
    const searchBox = page.getByPlaceholder(/Pesquise aqui/i).first();
    if (await searchBox.isVisible({ timeout: 3_000 }).catch(() => false)) {
      await searchBox.fill('Curso com atividades');
      await page.waitForTimeout(2000);
    }

    // Localiza a row específica
    const row = page
      .locator('tr, [role="row"]')
      .filter({ hasText: 'Curso com atividades' })
      .first();
    await row.waitFor({ state: 'visible', timeout: 10_000 });

    // Diagnóstico: lista todos buttons da row
    const buttonsInRow = await row.evaluate((rowEl) => {
      return Array.from(rowEl.querySelectorAll('button')).map((b, i) => ({
        idx: i,
        ariaLabel: b.getAttribute('aria-label'),
        text: b.textContent?.trim().slice(0, 30),
        testId: b.getAttribute('data-test-id') || b.getAttribute('data-testid'),
        innerHTML: b.innerHTML.slice(0, 80),
      }));
    });
    // eslint-disable-next-line no-console
    console.log('[recon] Buttons na row:', JSON.stringify(buttonsInRow, null, 2));

    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);

    // Click via JS direto no kebab
    await row.evaluate((rowEl) => {
      const btn = rowEl.querySelector(
        '[data-test-id="events-807403-actions-kebab"]',
      ) as HTMLElement | null;
      if (btn) btn.click();
    });
    await page.waitForTimeout(1500);

    // Aguarda menuitem "Atividades" aparecer
    const atividadesItem = page
      .getByRole('menuitem')
      .filter({ hasText: /Atividades/i })
      .first();
    await atividadesItem.waitFor({ state: 'visible', timeout: 15_000 });

    // Captura URLs navegadas pós-click
    const navigatedUrls: string[] = [];
    page.on('framenavigated', (frame) => {
      if (frame === page.mainFrame()) navigatedUrls.push(frame.url());
    });
    // Captura também requests document/xhr
    const documentRequests: string[] = [];
    page.on('request', (req) => {
      if (
        req.resourceType() === 'document' ||
        (req.resourceType() === 'fetch' &&
          req.url().includes('/events/') &&
          !req.url().includes('/avatar'))
      ) {
        documentRequests.push(`${req.method()} ${req.url()}`);
      }
    });

    // Listener pra nova aba (Atividades pode abrir em nova aba)
    const newPagePromise = page.context().waitForEvent('page', { timeout: 5_000 }).catch(() => null);
    // Detect href se for <a>
    const hrefBefore = await atividadesItem.evaluate(
      (el) => (el.closest('a') as HTMLAnchorElement | null)?.href || null,
    );
    // eslint-disable-next-line no-console
    console.log('[recon] href do menuitem Atividades:', hrefBefore);

    // eslint-disable-next-line no-console
    console.log('[recon] Clicando Atividades...');
    await atividadesItem.click();
    await page.waitForTimeout(7000);

    const newPage = await newPagePromise;
    if (newPage) {
      // eslint-disable-next-line no-console
      console.log('[recon] Nova aba aberta!', newPage.url());
    }

    // eslint-disable-next-line no-console
    console.log('[recon] URL atual (orig page):', page.url());
    // eslint-disable-next-line no-console
    console.log('[recon] URLs navegadas:', JSON.stringify(navigatedUrls, null, 2));
    // eslint-disable-next-line no-console
    console.log(
      '[recon] Document/fetch requests:',
      JSON.stringify(documentRequests.slice(0, 10), null, 2),
    );

    // Pages total do contexto
    const allPages = page.context().pages();
    // eslint-disable-next-line no-console
    console.log('[recon] Total pages no contexto:', allPages.length, 'URLs:', allPages.map(p => p.url()));

    // Dump da tela de gerenciar atividades
    const ctas = await page.evaluate(() => {
      const all = Array.from(
        document.querySelectorAll('a, button, [role="button"]'),
      );
      return all
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        })
        .map((el) => ({
          tag: el.tagName,
          text: (el.textContent || '').trim().slice(0, 60),
          href: el.getAttribute('href'),
          id: el.id,
          testId:
            el.getAttribute('data-test-id') || el.getAttribute('data-testid'),
        }))
        .filter((c) => c.text);
    });
    // eslint-disable-next-line no-console
    console.log(
      '[recon] CTAs tela Atividades (filtro add/novo/criar):',
      JSON.stringify(
        ctas.filter(
          (c) =>
            /adicionar|novo|nova|criar|new|add|atividade/i.test(c.text) ||
            /add|new|atividade|content/i.test(c.testId || '') ||
            /atividade|content/i.test(c.href || ''),
        ).slice(0, 30),
        null,
        2,
      ),
    );

    await page.screenshot({
      path: 'outputs/recertificacao/seed-recon-wizard-atividade-v7.png',
      fullPage: true,
    });
    // eslint-disable-next-line no-console
    console.log('[recon] Screenshot v7 salvo');

    expect(true).toBe(true);
  });
});
