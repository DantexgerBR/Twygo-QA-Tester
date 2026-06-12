// Validação retrabalho 19818 (arquivo LOCAL, não commitar no twygo-agents-qa)
// P4 [Novo estúdio] aria-label nos botões de pendência do popover.
// PR 10637: aria-label="{artifact}, {status}. Clique para gerar com o copiloto."
// Seed: criar atividade Página (3 pendências), abrir popover via badge,
// LER aria-labels (NUNCA clicar nas linhas — dispara geração real), excluir seed.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061';
const CONTENT = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19818';
const SEED_TITLE = `ARIA-19818-${process.argv[2] ?? 'seed'}`;
mkdirSync(OUT, { recursive: true });

const snap = (page, name) => page.screenshot({ path: `${OUT}/${name}.png` }).catch(() => {});

async function dismissModals(page) {
  for (let i = 0; i < 2; i++) {
    for (const txt of [/pergunte depois/i, /continuar mesmo assim/i, /aceitar( todos)?/i,
      /concordo/i, /entendi/i, /^fechar$/i, /^agora não$/i, /^ok$/i]) {
      const b = page.getByRole('button', { name: txt }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(600); }
    }
  }
}

async function gotoStudio(page) {
  for (let i = 1; i <= 3; i++) {
    await page.goto(`${BASE}/o/${ORG}/contents/${CONTENT}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await page.locator('[data-test-id="creation-studio-activities-list"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) { await page.waitForTimeout(2500); await dismissModals(page); return; }
    console.log(`[gotoStudio] não hidratou (${i}/3) — retry`);
  }
  throw new Error('painel do Estúdio não hidratou após 3 tentativas');
}

const summary = { card: 19818, env: BASE, org: ORG, content: CONTENT, seedTitle: SEED_TITLE };
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1366, height: 768 }, locale: 'pt-BR' })).newPage();

try {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await dismissModals(page);
  await gotoStudio(page);

  // SEED: adicionar atividade tipo Página (clicar o tipo JÁ CRIA) + salvar título
  await page.locator('[data-test-id="creation-studio-activity-add-button"]').click();
  await page.locator('[data-test-id="creation-studio-type-selector-drawer"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('[data-test-id="creation-studio-type-selector-page"]').click();
  await page.locator('[data-test-id="studio-activity-form-page"]').waitFor({ state: 'visible', timeout: 20000 });
  await page.locator('[data-test-id="studio-activity-form-page"] input[name="title"]').fill(SEED_TITLE);
  await page.locator('[data-test-id="creation-studio-activity-page-save"]').click();
  await page.waitForTimeout(3000);
  console.log('[seed] Página criada e salva:', SEED_TITLE);

  // achar o card da seed pelo título
  const seedCard = page
    .locator('[data-test-id^="creation-studio-activity-card-"]')
    .filter({ has: page.locator(`[data-test-id="creation-studio-activity-card-title"]:text-is("${SEED_TITLE}")`) })
    .last();
  await seedCard.scrollIntoViewIfNeeded();
  const badge = seedCard.locator('[data-test-id="studio-pending-artifacts-badge"]').first();
  await badge.waitFor({ state: 'visible', timeout: 15000 });
  summary.badgeTexto = (await badge.textContent())?.trim();
  console.log('[badge]', summary.badgeTexto);
  await snap(page, '01-card-com-badge-pendentes');

  // abrir o popover (clicar o BADGE, nunca as linhas)
  await badge.click();
  const popover = page.locator('[data-test-id="studio-pending-artifacts-popover"]:visible').first();
  await popover.waitFor({ state: 'visible', timeout: 10000 });
  await page.waitForTimeout(800);
  await snap(page, '02-popover-aberto');

  // inspecionar título do popover + aria-label de CADA linha (sem clicar)
  summary.popover = await popover.evaluate((pop) => {
    const rows = [...pop.querySelectorAll('[data-test-id^="studio-pending-artifacts-row-"]')];
    return {
      headerText: pop.textContent?.slice(0, 120),
      rows: rows.map((b) => ({
        testId: b.getAttribute('data-test-id'),
        tag: b.tagName,
        text: b.textContent?.trim(),
        ariaLabel: b.getAttribute('aria-label'),
      })),
    };
  });
  console.log('[popover]', JSON.stringify(summary.popover, null, 2));

  const esperado = /, pendente\. Clique para gerar com o copiloto\.$/;
  const rowsPendentes = summary.popover.rows.filter((r) => /-pending$/.test(r.testId) || /pendente/i.test(r.text ?? ''));
  summary.totalLinhas = summary.popover.rows.length;
  summary.linhasComAriaCorreto = summary.popover.rows.filter((r) => r.ariaLabel && esperado.test(r.ariaLabel)).length;
  summary.todasTemAria = summary.popover.rows.length >= 3 && summary.popover.rows.every((r) => !!r.ariaLabel);
  console.log(`aria-label correto em ${summary.linhasComAriaCorreto}/${summary.totalLinhas} linhas; todasTemAria=${summary.todasTemAria}`);

  // fechar popover sem disparar nada
  await page.keyboard.press('Escape');
  await page.waitForTimeout(800);

  // CLEANUP: abrir a seed no preview e excluir (dialog de confirmação)
  await seedCard.locator('[data-test-id="creation-studio-activity-card-title"]').click();
  await page.waitForTimeout(1500);
  const del = page.locator('[data-test-id="creation-studio-preview-delete"]');
  await del.waitFor({ state: 'visible', timeout: 10000 });
  await del.click({ force: true });
  const dialog = page.locator('[data-test-id="creation-studio-preview-delete-dialog"]');
  await dialog.waitFor({ state: 'visible', timeout: 10000 });
  await dialog.getByRole('button', { name: /excluir/i }).click({ force: true });
  await page.waitForTimeout(3000);
  summary.seedExcluida = (await page
    .locator(`[data-test-id="creation-studio-activity-card-title"]:text-is("${SEED_TITLE}")`).count()) === 0;
  console.log('[cleanup] seed excluída?', summary.seedExcluida);
  await snap(page, '03-apos-cleanup');
} catch (e) {
  summary.erro = String(e).slice(0, 500);
  console.error('ERRO:', summary.erro);
  await snap(page, '99-erro');
}

writeFileSync(`${OUT}/resultado.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify(summary, null, 2));
await browser.close();
