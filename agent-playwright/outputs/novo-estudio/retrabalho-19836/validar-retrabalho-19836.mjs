// Validação retrabalho 19836 (arquivo LOCAL, não commitar no twygo-agents-qa)
// P1 [Novo estúdio] Reorganização de atividades não reflete no front de imediato.
// PR 10650: HTML5 DnD + optimistic update. Repro: atividade pos 1 → pos 3
// (drop na borda), PATCH imediato, posições atualizam SEM reload.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061';
const CONTENT = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19836';
mkdirSync(OUT, { recursive: true });

const MOVIDA = '9288189';      // Conteúdo 1 (pos 1)
const TERCEIRA = '9288195';    // Conteúdo 3 (pos 3) — drop 'after' → vira pos 3
const SEGUNDA = '9288192';     // Conteúdo 2 — restore: drop 'before' → volta pos 1

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

async function mapStructure(page) {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-test-id^="creation-studio-activity-card-"]')]
      .filter((el) => /^creation-studio-activity-card-\d+$/.test(el.getAttribute('data-test-id')));
    return cards.map((el) => {
      const pc = el.closest('[data-test-id^="creation-studio-activity-children-"]');
      return {
        id: el.getAttribute('data-test-id').match(/(\d+)$/)[1],
        title: el.querySelector('[data-test-id="creation-studio-activity-card-title"]')?.textContent?.trim() ?? '',
        pos: el.querySelector('[data-test-id="creation-studio-activity-card-position"]')?.textContent?.trim() ?? '',
        parentId: pc ? pc.getAttribute('data-test-id').match(/(\d+)$/)[1] : null,
      };
    });
  });
}

async function syntheticDrag(page, srcId, tgtId, zone) {
  const sel = (id) => `[data-test-id="creation-studio-activity-card-draggable-${id}"]`;
  await page.locator(sel(srcId)).scrollIntoViewIfNeeded();
  await page.locator(sel(tgtId)).scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  const fireOne = (type) => page.evaluate(({ srcId, tgtId, zone, type }) => {
    const q = (id) => document.querySelector(`[data-test-id="creation-studio-activity-card-draggable-${id}"]`);
    const s0 = q(srcId), t0 = q(tgtId);
    if (!s0 || !t0) throw new Error('draggable não achado');
    const fire = (el, t, x, y) =>
      el.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: new DataTransfer() }));
    const s = s0.getBoundingClientRect(); const r = t0.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = zone === 'before' ? r.top + 2 : zone === 'after' ? r.bottom - 2 : r.top + r.height / 2;
    if (type === 'dragstart') fire(s0, 'dragstart', s.left + 40, s.top + s.height / 2);
    else if (type === 'dragend') fire(s0, 'dragend', x, y);
    else fire(t0, type, x, y);
  }, { srcId, tgtId, zone, type });
  for (const t of ['dragstart', 'dragover', 'drop', 'dragend']) {
    await fireOne(t);
    await page.waitForTimeout(250);
  }
}

const netLog = [];
const summary = { card: 19836, env: BASE, org: ORG, content: CONTENT };
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1366, height: 768 }, locale: 'pt-BR' })).newPage();

page.on('request', (req) => {
  if (['PATCH', 'POST', 'PUT'].includes(req.method()) && /reorder/i.test(req.url()))
    netLog.push({ t: new Date().toISOString(), method: req.method(), url: req.url(), body: req.postData()?.slice(0, 400) ?? null });
});
page.on('response', (res) => {
  if (['PATCH', 'POST', 'PUT'].includes(res.request().method()) && /reorder/i.test(res.url()))
    netLog.push({ t: new Date().toISOString(), status: res.status(), url: res.url() });
});

const topOrder = (struct) => struct.filter((a) => !a.parentId).map((a) => `${a.pos}:${a.title}`);

try {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await dismissModals(page);
  await gotoStudio(page);

  const antes = await mapStructure(page);
  summary.ordemAntes = topOrder(antes).slice(0, 6);
  const pos = (struct, id) => struct.find((a) => a.id === id)?.pos;
  if (pos(antes, MOVIDA) !== '1') throw new Error(`pré-condição: ${MOVIDA} deveria estar na pos 1, está em ${pos(antes, MOVIDA)}`);
  await snap(page, '01-ordem-inicial');
  console.log('ANTES:', JSON.stringify(summary.ordemAntes));

  // mover pos 1 → pos 3: drop 'after' (borda inferior) no card da pos 3
  const netBefore = netLog.length;
  await syntheticDrag(page, MOVIDA, TERCEIRA, 'after');
  await page.waitForTimeout(3000);
  await snap(page, '02-apos-drag-sem-reload');

  const depois = await mapStructure(page);
  summary.ordemDepoisUI = topOrder(depois).slice(0, 6);
  summary.atualizouImediato = pos(depois, MOVIDA) === '3';
  summary.requestsDoDrag = netLog.slice(netBefore);
  console.log('APÓS DRAG (sem reload):', JSON.stringify(summary.ordemDepoisUI));
  console.log('ATUALIZOU IMEDIATO (pos 1→3)?', summary.atualizouImediato);
  console.log('NETWORK:', JSON.stringify(summary.requestsDoDrag, null, 2));

  await gotoStudio(page);
  const reload = await mapStructure(page);
  summary.ordemAposReload = topOrder(reload).slice(0, 6);
  summary.persistiu = pos(reload, MOVIDA) === '3';
  console.log('APÓS RELOAD:', JSON.stringify(summary.ordemAposReload), 'PERSISTIU?', summary.persistiu);
  await snap(page, '03-apos-reload');

  // restaurar: drop 'before' no Conteúdo 2 → volta pra pos 1
  if (summary.persistiu) {
    await syntheticDrag(page, MOVIDA, SEGUNDA, 'before');
    await page.waitForTimeout(3000);
    const final = await mapStructure(page);
    summary.ordemFinal = topOrder(final).slice(0, 6);
    summary.restaurada = pos(final, MOVIDA) === '1';
    console.log('RESTAURADA (pos 1)?', summary.restaurada, JSON.stringify(summary.ordemFinal));
    await snap(page, '04-apos-restauracao');
  }
} catch (e) {
  summary.erro = String(e).slice(0, 400);
  console.error('ERRO:', summary.erro);
  await snap(page, '99-erro');
}

summary.networkCompleta = netLog;
writeFileSync(`${OUT}/resultado.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify({ ...summary, networkCompleta: undefined }, null, 2));
await browser.close();
