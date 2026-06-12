// Validação retrabalho 19813 (LOCAL, não commitar no twygo-agents-qa)
// P2 [Novo estúdio] Sem layout mobile abaixo de 1366px. PR 10644 (+10666).
// Espera: em 1024x600 layout mobile (abas no rodapé) e SEM scroll horizontal.
// Controle: em 1440x900 layout desktop (3 colunas, sem barra de abas).
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061';
const ID = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19813';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19813, env: BASE, org: ORG, content: ID };
const browser = await chromium.launch({ headless: true });

async function dismissModals(page) {
  for (let i = 0; i < 2; i++) {
    for (const txt of [/pergunte depois/i, /continuar mesmo assim/i, /aceitar( todos)?/i,
      /concordo/i, /entendi/i, /^fechar$/i, /^agora não$/i, /^ok$/i]) {
      const b = page.getByRole('button', { name: txt }).first();
      if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(600); }
    }
  }
}

async function abrirEstudio(viewport) {
  const ctx = await browser.newContext({ viewport, locale: 'pt-BR' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await dismissModals(page);
  for (let i = 1; i <= 3; i++) {
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await page.locator('[data-test-id="creation-studio-three-column-shell"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) { await page.waitForTimeout(3000); await dismissModals(page); return { ctx, page }; }
    console.log(`[gotoStudio ${viewport.width}] não hidratou (${i}/3)`);
  }
  throw new Error('Estúdio não hidratou após 3 tentativas');
}

const medir = (page) => page.evaluate(() => {
  const doc = document.documentElement;
  const bar = document.querySelector('[data-test-id="creation-studio-mobile-tab-bar"]');
  const shell = document.querySelector('[data-test-id="creation-studio-three-column-shell"]');
  const visivel = (el) => !!el && el.getBoundingClientRect().width > 0;
  return {
    viewport: `${window.innerWidth}x${window.innerHeight}`,
    scrollWidth: doc.scrollWidth,
    clientWidth: doc.clientWidth,
    temScrollHorizontal: doc.scrollWidth > doc.clientWidth + 2,
    barraRodape: visivel(bar),
    shellWidth: shell ? Math.round(shell.getBoundingClientRect().width) : null,
  };
});

try {
  // 1024x600 — deve estar em layout mobile, sem scroll horizontal
  const a = await abrirEstudio({ width: 1024, height: 600 });
  summary.v1024 = await medir(a.page);
  console.log('[1024x600]', JSON.stringify(summary.v1024, null, 2));
  await a.page.screenshot({ path: `${OUT}/01-1024x600-layout-mobile.png` });
  await a.ctx.close();

  // 1280x720 — também <1366, mesmo comportamento
  const b = await abrirEstudio({ width: 1280, height: 720 });
  summary.v1280 = await medir(b.page);
  console.log('[1280x720]', JSON.stringify(summary.v1280, null, 2));
  await b.page.screenshot({ path: `${OUT}/02-1280x720-layout-mobile.png` });
  await b.ctx.close();

  // 1440x900 — controle: desktop 3 colunas, sem barra
  const c = await abrirEstudio({ width: 1440, height: 900 });
  summary.v1440 = await medir(c.page);
  console.log('[1440x900]', JSON.stringify(summary.v1440, null, 2));
  await c.page.screenshot({ path: `${OUT}/03-1440x900-desktop-3-colunas.png` });
  await c.ctx.close();

  summary.passou =
    summary.v1024.temScrollHorizontal === false && summary.v1024.barraRodape === true
    && summary.v1280.temScrollHorizontal === false && summary.v1280.barraRodape === true
    && summary.v1440.temScrollHorizontal === false && summary.v1440.barraRodape === false;
  console.log('PASSOU?', summary.passou);
} catch (e) {
  summary.erro = String(e).slice(0, 500);
  console.error('ERRO:', summary.erro);
}

writeFileSync(`${OUT}/resultado.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify(summary, null, 2));
await browser.close();
