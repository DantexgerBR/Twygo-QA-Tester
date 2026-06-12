// Validação retrabalho 19838 (arquivo LOCAL, não commitar no twygo-agents-qa)
// P1 [Novo estúdio de criação] Mover "atividade filha" para "fora do pai" não funciona.
// PR 10650 (merged 2026-06-10) trocou dnd-kit por HTML5 DnD nativo:
//   - wrapper draggable: creation-studio-activity-card-draggable-{id}
//   - zona do drop no card alvo: 1/4 superior='before', 1/4 inferior='after', meio='child'
//   - before/after em card de 1º nível → new_parent_id null → vai pra RAIZ (o fix)
// Gesto real via dragTo dispara o fluxo, mas derrapa de zona com scroll; para
// validar a SEMÂNTICA exata usamos DragEvent sintético com coordenada exata
// (invoca exatamente os handlers onDragStart/Over/Drop do app).
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061';
const CONTENT = '807533';
const EMAIL = process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL;
const PASS = process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD;
const OUT = 'outputs/novo-estudio/retrabalho-19838';
mkdirSync(OUT, { recursive: true });

// estrutura canônica que o curso deve ter ao final (filha Apresentação = 1.2 do Conteúdo 1)
const PAI = '9288189';        // Conteúdo 1
const FILHA = '9288191';      // Apresentação (deve ser 1.2)
const IRMA_ACIMA = '9288190'; // Material de apoio (1.1)
const TOP_SEGUINTE = '9288192'; // Conteúdo 2 (pos 2)

const snap = (page, name) =>
  page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false }).catch(() => {});

async function dismissModals(page) {
  for (let i = 0; i < 2; i++) {
    for (const txt of [/pergunte depois/i, /continuar mesmo assim/i, /aceitar( todos)?/i,
      /concordo/i, /entendi/i, /^fechar$/i, /^agora não$/i, /^ok$/i]) {
      const b = page.getByRole('button', { name: txt }).first();
      if (await b.isVisible().catch(() => false)) {
        await b.click().catch(() => {});
        await page.waitForTimeout(600);
      }
    }
  }
}

// retry de hidratação (gotcha do Estúdio): navega → espera lista 15s → reload, até 3x
async function gotoStudio(page) {
  for (let i = 1; i <= 3; i++) {
    await page.goto(`${BASE}/o/${ORG}/contents/${CONTENT}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await page.locator('[data-test-id="creation-studio-activities-list"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) {
      await page.waitForTimeout(2500);
      await dismissModals(page);
      return;
    }
    console.log(`[gotoStudio] painel não hidratou (tentativa ${i}/3) — reload`);
  }
  throw new Error('painel do Estúdio não hidratou após 3 tentativas');
}

async function mapStructure(page) {
  return page.evaluate(() => {
    const cards = [...document.querySelectorAll('[data-test-id^="creation-studio-activity-card-"]')]
      .filter((el) => /^creation-studio-activity-card-\d+$/.test(el.getAttribute('data-test-id')));
    return cards.map((el) => {
      const parentContainer = el.closest('[data-test-id^="creation-studio-activity-children-"]');
      return {
        id: el.getAttribute('data-test-id').match(/(\d+)$/)[1],
        title: el.querySelector('[data-test-id="creation-studio-activity-card-title"]')?.textContent?.trim() ?? '',
        pos: el.querySelector('[data-test-id="creation-studio-activity-card-position"]')?.textContent?.trim() ?? '',
        parentId: parentContainer ? parentContainer.getAttribute('data-test-id').match(/(\d+)$/)[1] : null,
      };
    });
  });
}

// DragEvent sintético com coordenada exata na zona desejada do card alvo
async function syntheticDrag(page, srcId, tgtId, zone) {
  const src = page.locator(`[data-test-id="creation-studio-activity-card-draggable-${srcId}"]`);
  const tgt = page.locator(`[data-test-id="creation-studio-activity-card-draggable-${tgtId}"]`);
  await src.scrollIntoViewIfNeeded();
  await tgt.scrollIntoViewIfNeeded();
  await page.waitForTimeout(300);
  // eventos em fases separadas: draggedId/dropIndicator são state React — o
  // drop só funciona depois que o re-render do dragstart/dragover aconteceu
  const fireOne = (type) => page.evaluate(({ srcId, tgtId, zone, type }) => {
    const q = (id) => document.querySelector(`[data-test-id="creation-studio-activity-card-draggable-${id}"]`);
    const src = q(srcId), tgt = q(tgtId);
    if (!src || !tgt) throw new Error(`draggable não achado: ${!src ? srcId : tgtId}`);
    const fire = (el, t, x, y) =>
      el.dispatchEvent(new DragEvent(t, { bubbles: true, cancelable: true, clientX: x, clientY: y, dataTransfer: new DataTransfer() }));
    const s = src.getBoundingClientRect();
    const r = tgt.getBoundingClientRect();
    const x = r.left + r.width / 2;
    const y = zone === 'before' ? r.top + 2 : zone === 'after' ? r.bottom - 2 : r.top + r.height / 2;
    if (type === 'dragstart') fire(src, 'dragstart', s.left + 40, s.top + s.height / 2);
    else if (type === 'dragend') fire(src, 'dragend', x, y);
    else fire(tgt, type, x, y);
  }, { srcId, tgtId, zone, type });
  await fireOne('dragstart');
  await page.waitForTimeout(250);
  await fireOne('dragover');
  await page.waitForTimeout(250);
  await fireOne('drop');
  await page.waitForTimeout(250);
  await fireOne('dragend');
}

const netLog = [];
const summary = { card: 19838, env: BASE, org: ORG, content: CONTENT };

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({
  viewport: { width: 1366, height: 768 }, locale: 'pt-BR',
})).newPage();

page.on('request', (req) => {
  if (!['PATCH', 'POST', 'PUT'].includes(req.method())) return;
  if (!/activit|studio|reorder/i.test(req.url())) return;
  netLog.push({ t: new Date().toISOString(), method: req.method(), url: req.url(), body: req.postData()?.slice(0, 800) ?? null });
});
page.on('response', (res) => {
  const req = res.request();
  if (!['PATCH', 'POST', 'PUT'].includes(req.method())) return;
  if (!/activit|studio|reorder/i.test(req.url())) return;
  netLog.push({ t: new Date().toISOString(), status: res.status(), method: req.method(), url: res.url() });
});

const findIn = (struct, id) => struct.find((a) => a.id === id);

try {
  // login
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', EMAIL);
  await page.fill('#user_password', PASS);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await dismissModals(page);

  await gotoStudio(page);

  // PASSO 0 — se a run anterior deixou a filha aninhada no lugar errado, restaurar:
  // drop 'after' na irmã 1.1 → volta a ser 1.2 do Conteúdo 1
  let estado = await mapStructure(page);
  if (findIn(estado, FILHA)?.parentId !== PAI) {
    console.log(`[restauração prévia] filha ${FILHA} está sob ${findIn(estado, FILHA)?.parentId}; devolvendo pra 1.2 do ${PAI}`);
    await syntheticDrag(page, FILHA, IRMA_ACIMA, 'after');
    await page.waitForTimeout(3500);
    estado = await mapStructure(page);
    if (findIn(estado, FILHA)?.parentId !== PAI) throw new Error('restauração prévia FALHOU — intervir manualmente');
    console.log('[restauração prévia] OK — filha de volta como', findIn(estado, FILHA).pos);
  }
  summary.estruturaAntes = estado;
  summary.filhaAntes = findIn(estado, FILHA);
  await snap(page, '01-antes-do-drag');
  console.log('ANTES: filha =', JSON.stringify(summary.filhaAntes));

  // PASSO 1 — mover a filha 1.2 PARA FORA do pai: drop 'before' no Conteúdo 2 (top-level)
  const netBefore = netLog.length;
  await syntheticDrag(page, FILHA, TOP_SEGUINTE, 'before');
  await page.waitForTimeout(3500);
  await snap(page, '02-apos-drag-pra-fora');

  const aposDrag = await mapStructure(page);
  summary.estruturaDepoisUI = aposDrag;
  summary.filhaDepoisUI = findIn(aposDrag, FILHA);
  summary.viroTopLevelNaUI = summary.filhaDepoisUI?.parentId === null;
  summary.requestsDoDrag = netLog.slice(netBefore);
  console.log('APÓS DRAG (UI): filha =', JSON.stringify(summary.filhaDepoisUI));
  console.log('VIROU TOP-LEVEL NA UI?', summary.viroTopLevelNaUI);
  console.log('NETWORK:', JSON.stringify(summary.requestsDoDrag, null, 2));

  // PASSO 2 — persistência (reload)
  await gotoStudio(page);
  const aposReload = await mapStructure(page);
  summary.estruturaAposReload = aposReload;
  summary.filhaAposReload = findIn(aposReload, FILHA);
  summary.persistiuComoTopLevel = summary.filhaAposReload?.parentId === null;
  console.log('APÓS RELOAD: filha =', JSON.stringify(summary.filhaAposReload));
  console.log('PERSISTIU COMO TOP-LEVEL?', summary.persistiuComoTopLevel);
  await snap(page, '03-apos-reload');

  // PASSO 3 — restaurar estrutura original: drop 'after' na irmã 1.1
  if (summary.persistiuComoTopLevel) {
    const netRestore = netLog.length;
    await syntheticDrag(page, FILHA, IRMA_ACIMA, 'after');
    await page.waitForTimeout(3500);
    const final = await mapStructure(page);
    summary.estruturaFinal = final;
    summary.filhaFinal = findIn(final, FILHA);
    summary.restauradaNoPai = summary.filhaFinal?.parentId === PAI;
    summary.requestsDaRestauracao = netLog.slice(netRestore);
    console.log('RESTAURADA NO PAI?', summary.restauradaNoPai, JSON.stringify(summary.filhaFinal));
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
console.log(JSON.stringify({
  filhaAntes: summary.filhaAntes, filhaDepoisUI: summary.filhaDepoisUI,
  filhaAposReload: summary.filhaAposReload, filhaFinal: summary.filhaFinal,
  viroTopLevelNaUI: summary.viroTopLevelNaUI, persistiuComoTopLevel: summary.persistiuComoTopLevel,
  restauradaNoPai: summary.restauradaNoPai, requestsDoDrag: summary.requestsDoDrag,
  erro: summary.erro ?? null,
}, null, 2));
await browser.close();
