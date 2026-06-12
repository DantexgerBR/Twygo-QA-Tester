// QA 1.18 re-seed (LOCAL) — Trial 37062: curso descartável + Página + geração
// de roteiro (linha do popover de pendências). Fluxo validado em 11/06.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudiotrial.stage.twygoead.com';
const ORG = '37062';
const NOME_CURSO = 'QA 1.18 E2E - curso descartavel 1206';
const NOME_PAGE = 'QA118-GERACAO-1206';
const OUT = 'outputs/novo-estudio/revalida-qa118';
mkdirSync(OUT, { recursive: true });
const r = {};
const gen = [];

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();
page.on('request', (req) => {
  if (req.method() !== 'GET' && /generat|ai_generation|copilot|artifact/i.test(req.url()))
    gen.push(`>> ${req.method()} ${req.url().replace(BASE, '').slice(0, 100)}`);
});
page.on('response', (res) => {
  if (res.request().method() !== 'GET' && /generat|ai_generation|copilot|artifact/i.test(res.url()))
    gen.push(`<< ${res.status()} ${res.url().replace(BASE, '').slice(0, 100)}`);
});

async function dismiss() {
  for (const txt of [/pergunte depois/i, /continuar mesmo assim/i, /entendi/i, /^fechar$/i, /^agora não$/i]) {
    const b = page.getByRole('button', { name: txt }).first();
    if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(600); }
  }
}

try {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_TRIAL_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_TRIAL_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForTimeout(7000);
  await dismiss();

  // 1) criar curso (form com CKEditor — setData + change pro React sincronizar)
  await page.goto(`${BASE}/o/${ORG}/contents/new?kind=course`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(5000);
  await dismiss();
  await page.getByPlaceholder('Nome do curso').first.fill?.(NOME_CURSO)
    ?? await page.getByPlaceholder('Nome do curso').first().fill(NOME_CURSO);
  const tipo = page.locator("input[id^='react-select']").first();
  await tipo.click(); await tipo.fill('Curso');
  await page.waitForTimeout(1200);
  await page.keyboard.press('Enter');
  r.ck = await page.evaluate((html) => {
    if (!window.CKEDITOR) return 'sem CKEDITOR';
    const keys = Object.keys(CKEDITOR.instances);
    if (!keys.length) return 'sem instancias';
    const ed = CKEDITOR.instances[keys[0]];
    ed.setData('<p>' + html + '</p>'); ed.updateElement(); ed.fire('change');
    const ta = ed.element && ed.element.$;
    if (ta) { ta.dispatchEvent(new Event('input', { bubbles: true })); ta.dispatchEvent(new Event('change', { bubbles: true })); }
    return 'ok';
  }, 'Curso descartavel do QA 1.18 (revalidacao 12/06) - sera excluido.');
  console.log('[ck]', r.ck);
  await page.getByRole('button', { name: /^Salvar/i }).first().click();
  await page.waitForURL(/\/(contents|e|events)\/\d+/, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4000);
  await dismiss();
  r.cursoId = (page.url().match(/\/(?:contents|e|events)\/(\d+)/) ?? [])[1] ?? null;
  console.log('[curso] id:', r.cursoId, '| url:', page.url().replace(BASE, ''));
  await page.screenshot({ path: `${OUT}/01-curso-criado.png` });
  if (!r.cursoId) throw new Error('curso não criado');

  // 2) aba studio → criar Página
  await page.goto(`${BASE}/o/${ORG}/contents/${r.cursoId}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test-id="creation-studio-activities-list"]').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(3000);
  await dismiss();
  await page.locator('[data-test-id="creation-studio-activity-add-button"]').click();
  await page.locator('[data-test-id="creation-studio-type-selector-drawer"]').waitFor({ state: 'visible', timeout: 10000 });
  await page.locator('[data-test-id="creation-studio-type-selector-page"]').click();
  await page.locator('[data-test-id="studio-activity-form-page"]').waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(2500);
  r.pageActivityId = (page.url().match(/activities\/(\d+)\//) ?? [])[1] ?? null;
  await page.locator('[data-test-id="studio-activity-form-page"] input[name="title"]').fill(NOME_PAGE);
  await page.locator('[data-test-id="creation-studio-activity-page-save"]').click();
  await page.waitForTimeout(4000);
  console.log('[page] id:', r.pageActivityId);
  await page.screenshot({ path: `${OUT}/02-page-criada.png` });

  // 3) disparar geração do roteiro via popover de pendências
  await page.goto(`${BASE}/o/${ORG}/contents/${r.cursoId}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test-id="creation-studio-activities-list"]').waitFor({ state: 'visible', timeout: 30000 });
  await page.waitForTimeout(3000);
  const card = page.locator(`[data-test-id="creation-studio-activity-card-${r.pageActivityId}"]`);
  await card.scrollIntoViewIfNeeded();
  const badge = card.locator('[data-test-id="studio-pending-artifacts-badge"]').first();
  await badge.waitFor({ state: 'visible', timeout: 15000 });
  await badge.click();
  const popover = page.locator('[data-test-id="studio-pending-artifacts-popover"]:visible').first();
  await popover.waitFor({ state: 'visible', timeout: 10000 });
  await popover.locator('[data-test-id="studio-pending-artifacts-row-roteiro"]').click();
  await page.waitForTimeout(8000);
  await page.screenshot({ path: `${OUT}/03-roteiro-disparado.png` });
  r.geracaoDisparada = gen.some((l) => l.startsWith('>>'));
  console.log('[geração] disparada?', r.geracaoDisparada, '| rede:', JSON.stringify(gen.slice(0, 6)));

  // 4) aguardar a task completar (validation card no copiloto / status)
  let completou = false;
  const t0 = Date.now();
  while (Date.now() - t0 < 300000) {
    await page.waitForTimeout(20000);
    const estado = await page.evaluate(() => {
      const txt = document.body.innerText;
      return {
        enfileirada: /enfileirad|disparei a gera/i.test(txt),
        completou: /Roteiro gerado|Aprovar|conclu[ií]da|finalizada/i.test(txt),
        falhou: /falhou|erro na gera/i.test(txt),
      };
    });
    console.log(`[${Math.round((Date.now() - t0) / 1000)}s]`, JSON.stringify(estado));
    if (estado.completou || estado.falhou) { completou = estado.completou; break; }
  }
  r.geracaoCompletou = completou;
  await page.screenshot({ path: `${OUT}/04-geracao-status.png` });
  console.log('[geração] completou?', completou);
} catch (e) {
  r.erro = String(e).slice(0, 500);
  console.error('ERRO:', r.erro);
  await page.screenshot({ path: `${OUT}/99-erro-seed.png` }).catch(() => {});
}

r.rede = gen;
writeFileSync(`${OUT}/seed-resultado.json`, JSON.stringify(r, null, 2));
console.log('\n===== SEED =====');
console.log(JSON.stringify(r, null, 2));
await browser.close();
