// Probe focado (LOCAL): preview admin do SCORM após processamento concluir.
// Cria seed, sobe zip, salva, libera e espera ATÉ 6min clicando "Recarregar".
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const ZIP = 'test-assets/uploads/documents/scorm-qa19857.zip';
const OUT = 'outputs/novo-estudio/retrabalho-19857';

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();
const r = {};

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
await page.click('#user_submit');
await page.waitForTimeout(7000);

async function gotoStudio() {
  for (let i = 1; i <= 3; i++) {
    await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
    const ok = await page.locator('[data-test-id="creation-studio-activities-list"]')
      .waitFor({ state: 'visible', timeout: 15000 }).then(() => true, () => false);
    if (ok) { await page.waitForTimeout(3000); return; }
  }
  throw new Error('não hidratou');
}
await gotoStudio();

// seed SCORM
await page.locator('[data-test-id="creation-studio-activity-add-button"]').click();
await page.locator('[data-test-id="creation-studio-type-selector-drawer"]').waitFor({ state: 'visible', timeout: 10000 });
await page.locator('[data-test-id="creation-studio-type-selector-scorm"]').click();
await page.locator('[data-test-id^="studio-activity-form-"]').first().waitFor({ state: 'visible', timeout: 20000 });
await page.waitForTimeout(2500);
r.novoId = (page.url().match(/activities\/(\d+)\//) ?? [])[1];
await page.locator('input[name="title"]:visible').first().fill('QA-19857-PREVIEW');
await page.getByRole('tab', { name: /conte[uú]do/i }).first().click();
await page.waitForTimeout(2000);
await page.getByRole('button', { name: /enviar arquivo/i }).first().click();
await page.waitForTimeout(2500);
const inputs = page.locator('input[type="file"]');
await inputs.nth((await inputs.count()) - 1).setInputFiles(ZIP);
await page.waitForTimeout(4000);
for (const nome of [/^enviar$/i, /confirmar/i, /concluir/i]) {
  const b = page.locator('[role="dialog"]').getByRole('button', { name: nome }).first();
  if (await b.isVisible().catch(() => false)) { await b.click(); await page.waitForTimeout(2500); break; }
}
await page.locator('button:has-text("Salvar"):visible').first().click();
await page.waitForTimeout(6000);

// liberar + poll com clique em "Recarregar"
await gotoStudio();
const closeCopilot = page.locator('[data-test-id="copilot-drawer-close"]');
if (await closeCopilot.isVisible().catch(() => false)) { await closeCopilot.click(); await page.waitForTimeout(800); }
const card = page.locator(`[data-test-id="creation-studio-activity-card-${r.novoId}"]`);
await card.scrollIntoViewIfNeeded();
await card.locator('[data-test-id="creation-studio-activity-card-title"]').click();
await page.waitForTimeout(3000);
if (await card.locator('[data-test-id="creation-studio-activity-card-status-locked"]').isVisible().catch(() => false)) {
  await page.locator('[data-test-id="creation-studio-preview-toggle-status"]').evaluate((el) => el.click());
  await page.waitForTimeout(3000);
}

const estado = async () => {
  let scormOk = false;
  for (const f of page.frames()) {
    const txt = await f.evaluate(() => document.body?.innerText ?? '').catch(() => '');
    if (/SCORM-19857 carregou com sucesso/.test(txt)) scormOk = true;
  }
  const paneTxt = await page.evaluate(() =>
    (document.querySelector('[data-test-id="creation-studio-preview-pane"]')?.textContent ?? ''));
  return { scormOk, processando: /processamento/i.test(paneTxt), erro: /não existe|Desculpe/i.test(paneTxt), resumo: paneTxt.replace(/\s+/g, ' ').slice(0, 140) };
};

let e = await estado();
const t0 = Date.now();
while (!e.scormOk && !e.erro && Date.now() - t0 < 360000) {
  await page.waitForTimeout(20000);
  const rec = page.locator('[data-test-id="creation-studio-preview-pane"] button:has-text("Recarregar")').first();
  if (await rec.isVisible().catch(() => false)) await rec.evaluate((el) => el.click());
  await page.waitForTimeout(5000);
  e = await estado();
  console.log(`[${Math.round((Date.now() - t0) / 1000)}s]`, JSON.stringify(e));
}
r.previewFinal = e;
r.segundosAteCarregar = Math.round((Date.now() - t0) / 1000);
console.log('FINAL:', JSON.stringify(r, null, 2));
await page.screenshot({ path: `${OUT}/06-preview-admin-pos-processamento.png` });

// cleanup
await gotoStudio();
if (await closeCopilot.isVisible().catch(() => false)) { await closeCopilot.click(); await page.waitForTimeout(800); }
await card.scrollIntoViewIfNeeded();
await card.locator('[data-test-id="creation-studio-activity-card-title"]').click();
await page.waitForTimeout(2000);
await page.locator('[data-test-id="creation-studio-preview-delete"]').evaluate((el) => el.click());
const dialog = page.locator('[data-test-id="creation-studio-preview-delete-dialog"]');
await dialog.waitFor({ state: 'visible', timeout: 10000 });
await dialog.getByRole('button', { name: /excluir/i }).evaluate((el) => el.click());
await page.waitForTimeout(3000);
r.seedExcluida = (await page.locator(`[data-test-id="creation-studio-activity-card-${r.novoId}"]`).count()) === 0;
console.log('SEED EXCLUÍDA?', r.seedExcluida);
writeFileSync(`${OUT}/resultado-preview.json`, JSON.stringify(r, null, 2));
await browser.close();
