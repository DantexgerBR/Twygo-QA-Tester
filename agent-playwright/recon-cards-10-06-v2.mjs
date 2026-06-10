// Reconfirmação v2 (10/06/2026) — acha a ROTA REAL do Estúdio e sonda controles.
// READ-ONLY. Org 37061, curso 807533.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061';
const COURSE = process.env.COURSE_ID || '807533';
const OUT = 'outputs/novo-estudio/recon-2026-06-10';
mkdirSync(OUT, { recursive: true });
const log = (...a) => console.log(...a);

const browser = await chromium.launch({ headless: true });
const ctx = await browser.newContext({ viewport: { width: 1366, height: 720 }, locale: 'pt-BR' });
const page = await ctx.newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
await page.click('#user_submit');
await page.waitForTimeout(6000);

const is404 = async () => /404|doesn't exist|não encontrad|not found/i.test(await page.title() + ' ' + (await page.evaluate(() => document.body.innerText.slice(0, 300))));

// 1) Descobrir a rota real a partir da listagem de Conteúdos → "Editar curso"
await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(6000);
const hrefs = await page.evaluate((course) => {
  const links = [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href'));
  return {
    doCurso: [...new Set(links.filter((h) => h && h.includes(course)))],
    editLike: [...new Set(links.filter((h) => h && /(edit|studio|contents)/i.test(h)))].slice(0, 25),
  };
}, COURSE);
log('[listagem] hrefs do curso 807533:', JSON.stringify(hrefs.doCurso, null, 1));
log('[listagem] hrefs edit/studio/contents:', JSON.stringify(hrefs.editLike, null, 1));

// 2) Tentar rotas candidatas até uma não-404
const candidates = [
  `${BASE}/o/${ORG}/contents/${COURSE}/edit?tab=studio`,
  `${BASE}/o/${ORG}/contents/${COURSE}/edit`,
  `${BASE}/o/${ORG}/events/${COURSE}/edit?tab=studio`,
  `${BASE}/o/${ORG}/events/${COURSE}/edit`,
];
let estudioUrl = null;
for (const url of candidates) {
  const resp = await page.goto(url, { waitUntil: 'domcontentloaded' }).catch(() => null);
  await page.waitForTimeout(7000);
  const bad = await is404();
  log(`  candidato ${url} -> HTTP ${resp ? resp.status() : '??'} | 404? ${bad} | urlFinal ${page.url()}`);
  if (!bad) { estudioUrl = page.url(); break; }
}

if (!estudioUrl) { log('NENHUMA rota de edição abriu — abortando.'); await browser.close(); process.exit(2); }

// 3) Na página de edição, garantir que estamos na aba Atividades/Estúdio e sondar controles
await page.waitForTimeout(2000);
// tenta clicar na aba "Atividades" se existir (pra renderizar o Estúdio)
const abaAtiv = page.getByRole('tab', { name: /Atividades/i }).first();
if (await abaAtiv.count().catch(() => 0)) {
  await abaAtiv.click().catch(() => {});
  await page.waitForTimeout(5000);
}
log('\n=== EDIÇÃO/ESTÚDIO ===');
log('URL:', page.url(), '| TITLE:', await page.title());
await page.screenshot({ path: `${OUT}/estudio-real-807533.png`, fullPage: false });

const probe = async (term) => page.evaluate((src) => {
  const rx = new RegExp(src, 'i');
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 3 && r.height > 3; };
  const hits = [...document.querySelectorAll('button, a, [role="button"], [role="menuitem"]')]
    .filter(vis)
    .filter((el) => rx.test((el.textContent || '') + ' ' + (el.getAttribute('aria-label') || '')))
    .map((el) => ((el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 50)));
  const anyTextNode = [...document.querySelectorAll('*')].some((el) => el.children.length === 0 && rx.test(el.textContent || ''));
  return { controls: [...new Set(hits)], anyTextNode };
}, term);

for (const term of ['Publicar', 'Salvar como novo', 'Duplicar', 'Visualizar como aluno', '\\bSalvar\\b', 'copiloto']) {
  const r = await probe(term);
  log(`  [${term}] controls=${JSON.stringify(r.controls)} | algumTextoNoDOM=${r.anyTextNode}`);
}

const tabsAll = await page.evaluate(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 3 && r.height > 3; };
  return [...new Set([...document.querySelectorAll('[role="tab"], nav a, [class*="tab"]')].filter(vis)
    .map((el) => (el.textContent || '').trim().slice(0, 30)).filter(Boolean))].slice(0, 25);
});
log('  ABAS/NAV visíveis:', JSON.stringify(tabsAll));

const topo = await page.evaluate(() => {
  const vis = (el) => { const r = el.getBoundingClientRect(); return r.width > 3 && r.height > 3 && r.y < 170; };
  return [...new Set([...document.querySelectorAll('button, a, [role="button"]')].filter(vis)
    .map((el) => (el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 40)).filter(Boolean))].slice(0, 40);
});
log('  TOPO (y<170):', JSON.stringify(topo));

await browser.close();
log('\n[ok] screenshots em', OUT);
