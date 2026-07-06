import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const EMAIL = process.env.TWYGO_STAGING_REGISTROSF2_EMAIL;
const PASSWORD = process.env.TWYGO_STAGING_REGISTROSF2_PASSWORD;

const capturedResponses = [];

const browser = await chromium.launch({ headless: false, slowMo: 300 });
const context = await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: 'pt-BR' });
const page = await context.newPage();

// Captura TODAS as respostas de rede (XHR/fetch/document) desde antes do goto de records.
page.on('response', async (resp) => {
  const req = resp.request();
  const rtype = req.resourceType();
  if (rtype === 'xhr' || rtype === 'fetch') {
    let bodySnippet;
    let bodyFull = null;
    try {
      const ct = resp.headers()['content-type'] || '';
      if (ct.includes('json')) {
        bodyFull = await resp.json();
        bodySnippet = JSON.stringify(bodyFull).slice(0, 500);
      } else {
        const txt = await resp.text();
        bodySnippet = txt.slice(0, 300);
      }
    } catch (e) {
      bodySnippet = `[erro ao ler body: ${e.message}]`;
    }
    capturedResponses.push({
      url: resp.url(),
      method: req.method(),
      status: resp.status(),
      contentType: resp.headers()['content-type'] || null,
      bodySnippet,
      bodyFull,
    });
  }
});

console.log('[login] iniciando...');
await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(4000);
console.log('[login] url pos submit:', page.url());

console.log('[records] navegando...');
await page.goto(`${BASE}/o/${ORG}/records?tab=records-tab`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(4000);

const npsLater = page.getByRole('button', { name: 'Pergunte depois' });
if (await npsLater.count().catch(() => 0)) {
  await npsLater.click().catch(() => {});
  await page.waitForTimeout(1000);
}

await page.waitForTimeout(2000); // espera XHRs assincronas adicionais

const bodyText = await page.evaluate(() => document.body.innerText);
const semPermissao = /você não tem permissão/i.test(bodyText);
const tabelaExiste = (await page.locator('table tbody tr').count().catch(() => 0)) > 0;

console.log('[gate] texto "sem permissao" encontrado?', semPermissao);
console.log('[gate] tabela com linhas renderizou?', tabelaExiste, '| linhas:', await page.locator('table tbody tr').count().catch(() => 0));

await page.screenshot({ path: `${OUT}/20-gate-acesso-records.png`, fullPage: true });

// Filtra respostas relevantes (contendo "record" na URL, JSON, 2xx)
const relevantes = capturedResponses.filter((r) => /record/i.test(r.url));

console.log('\n[network] total XHR/fetch capturadas:', capturedResponses.length);
console.log('[network] relevantes (url contem "record"):', relevantes.length);
relevantes.forEach((r, i) => {
  console.log(`\n--- [${i}] ${r.method} ${r.status} ${r.url}`);
  console.log('    content-type:', r.contentType);
  console.log('    bodySnippet:', r.bodySnippet);
});

const resultado = {
  card: 20504,
  fase: 'recon-api-order-by',
  env: BASE,
  org: ORG,
  gate_sem_permissao_no_texto: semPermissao,
  gate_tabela_renderizou: tabelaExiste,
  gate_linhas_tabela: await page.locator('table tbody tr').count().catch(() => 0),
  url_final: page.url(),
  total_xhr_fetch_capturadas: capturedResponses.length,
  respostas_relacionadas_a_record: relevantes,
  todas_respostas_xhr_fetch: capturedResponses,
};

writeFileSync(`${OUT}/recon-network-order-by.json`, JSON.stringify(resultado, null, 2));
console.log('\n[recon-network-order-by.json gravado]');

await browser.close();
