import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const EMAIL = process.env.TWYGO_STAGING_REGISTROSF2_EMAIL;
const PASSWORD = process.env.TWYGO_STAGING_REGISTROSF2_PASSWORD;

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: 'pt-BR' })).newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(4000);
await page.goto(`${BASE}/o/${ORG}/records?tab=records-tab`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
await page.waitForSelector('table tbody tr', { timeout: 15000 });

async function clickIcon(iconName) {
  const btn = page.locator(`[data-icon="${iconName}"]`).first();
  await btn.click({ force: true });
  await page.waitForTimeout(1200);
}

// clicar grid_view (view em cards)
await clickIcon('grid_view');
await page.screenshot({ path: `${OUT}/10-view-grid-cards.png`, fullPage: true });
const cardTextSample = await page.evaluate(() => {
  const body = document.body.innerText;
  return body.slice(0, 3000);
});
console.log('[apos grid_view] amostra texto pagina (3000 chars):\n', cardTextSample);

// tentar achar 1 card e extrair todos os campos rotulados dele
const primeiroCardCampos = await page.evaluate(() => {
  // procura por qualquer container repetido com "Pessoa" ou similar - fallback simples: pegar todo texto de possiveis cards
  const cards = document.querySelectorAll('[class*="css-"]');
  return null; // placeholder, sera analisado via screenshot
});

// voltar para list (reorder)
await clickIcon('reorder');
await page.waitForSelector('table tbody tr', { timeout: 15000 });
await page.screenshot({ path: `${OUT}/11-view-list-de-volta.png`, fullPage: true });
const headersDepoisVoltar = await page.evaluate(() => {
  const table = document.querySelector('table');
  return table ? [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim().replace(/\s+/g, ' ')) : 'sem-tabela';
});
console.log('[headers apos voltar pra list]:', JSON.stringify(headersDepoisVoltar));

writeFileSync(`${OUT}/resultado-toggle-grid-list.json`, JSON.stringify({
  headers_apos_voltar_list: headersDepoisVoltar,
  amostra_texto_grid_view: cardTextSample,
}, null, 2));

await browser.close();
