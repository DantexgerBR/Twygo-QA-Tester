import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://registrosf2.stage.twygoead.com';
const ORG = '37079';
const OUT = 'outputs/registros-ordenacao-20504';
mkdirSync(OUT, { recursive: true });

const EMAIL = process.env.TWYGO_STAGING_REGISTROSF2_EMAIL;
const PASSWORD = process.env.TWYGO_STAGING_REGISTROSF2_PASSWORD;

const resultado = {
  card: 20504,
  checagem: 'scroll horizontal + column-picker + botao Interromper BETA teste',
  env: BASE,
  org: ORG,
};

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1920, height: 1080 }, locale: 'pt-BR' })).newPage();

await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
await page.getByRole('button', { name: 'Entrar' }).click();
await page.waitForTimeout(4000);

await page.goto(`${BASE}/o/${ORG}/records?tab=records-tab`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(3000);
const npsLater = page.getByRole('button', { name: 'Pergunte depois' });
if (await npsLater.count().catch(() => 0)) { await npsLater.click().catch(() => {}); await page.waitForTimeout(1000); }

await page.waitForSelector('table tbody tr', { timeout: 15000 });

// 1) HEADERS COMPLETOS NO DOM
const headers = await page.evaluate(() => {
  const table = document.querySelector('table');
  if (!table) return null;
  return [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim().replace(/\s+/g, ' '));
});
console.log('[headers thead th]:', JSON.stringify(headers));
resultado.headers_thead_th = headers;

// 2) SCROLL WIDTH vs CLIENT WIDTH — tentar achar o container que rola (table, wrapper pai, etc)
const scrollInfo = await page.evaluate(() => {
  const table = document.querySelector('table');
  if (!table) return null;
  const info = [];
  let el = table;
  for (let i = 0; i < 5 && el; i++) {
    info.push({
      tag: el.tagName,
      cls: el.className,
      scrollWidth: el.scrollWidth,
      clientWidth: el.clientWidth,
      overflowX: getComputedStyle(el).overflowX,
    });
    el = el.parentElement;
  }
  return info;
});
console.log('[scroll chain table->ancestors]:', JSON.stringify(scrollInfo, null, 2));
resultado.scroll_chain = scrollInfo;

// Se algum container tiver scrollWidth > clientWidth, rola pra direita nele e printa
let scrollContainerSelectorUsed = null;
let scrolled = false;
const scrollableIdx = scrollInfo?.findIndex((c) => c.scrollWidth > c.clientWidth + 5);
if (scrollableIdx !== undefined && scrollableIdx >= 0) {
  scrolled = await page.evaluate((idx) => {
    const table = document.querySelector('table');
    let el = table;
    for (let i = 0; i < idx; i++) el = el.parentElement;
    el.scrollLeft = el.scrollWidth;
    return true;
  }, scrollableIdx);
  scrollContainerSelectorUsed = `ancestor#${scrollableIdx} (${scrollInfo[scrollableIdx].tag}.${scrollInfo[scrollableIdx].cls})`;
  await page.waitForTimeout(800);
  await page.screenshot({ path: `${OUT}/06-scroll-direita.png`, fullPage: true });
}
resultado.scroll_horizontal = { encontrado: !!scrolled, container: scrollContainerSelectorUsed };
if (!scrolled) {
  await page.screenshot({ path: `${OUT}/06-scroll-nao-encontrado.png`, fullPage: true });
}

// 3) COLUMN-PICKER: procurar botões "Colunas", engrenagem, ☰ lista, ⊞ grid, "Personalizar"
const candidatosTexto = ['Colunas', 'Personalizar', 'view_column', 'settings', 'tune', 'filter_list', 'list', 'view_list', 'grid_view'];
const achados = [];
for (const txt of candidatosTexto) {
  const loc = page.getByText(txt, { exact: true });
  const count = await loc.count().catch(() => 0);
  if (count) achados.push({ texto: txt, count });
}
console.log('[candidatos icone/texto encontrados]:', JSON.stringify(achados));
resultado.candidatos_column_picker = achados;

await page.screenshot({ path: `${OUT}/07-toolbar-antes-testar-icones.png`, fullPage: true });

// Testar clique no icone de LISTA (☰ / view_list) se existir, sem quebrar nada de destrutivo
let resultadoListIcon;
try {
  const listIcon = page.getByText('view_list', { exact: true }).first();
  const listCount = await listIcon.count();
  if (listCount) {
    await listIcon.click({ force: true });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: `${OUT}/08-apos-click-list-icon.png`, fullPage: true });
    const headersApos = await page.evaluate(() => {
      const table = document.querySelector('table');
      return table ? [...table.querySelectorAll('thead th')].map((th) => th.textContent.trim().replace(/\s+/g, ' ')) : 'sem-tabela';
    });
    resultadoListIcon = { clicado: true, headers_apos: headersApos };
    console.log('[list icon] headers apos click:', JSON.stringify(headersApos));
  } else {
    resultadoListIcon = { clicado: false, motivo: 'view_list nao encontrado' };
  }
} catch (e) {
  resultadoListIcon = { clicado: false, erro: e.message };
}
resultado.list_icon_toggle = resultadoListIcon;

// 4) Botao "Interromper BETA teste" — so inspecionar, NAO clicar
let betaBtnInfo;
try {
  const betaBtn = page.getByText(/Interromper.*BETA/i).first();
  const count = await betaBtn.count();
  if (count) {
    const box = await betaBtn.boundingBox();
    const outerHTML = await betaBtn.evaluate((el) => el.outerHTML?.slice(0, 500));
    const tagName = await betaBtn.evaluate((el) => el.tagName);
    // hover para ver se muda algo (tooltip) - nao clicar
    await betaBtn.hover().catch(() => {});
    await page.waitForTimeout(500);
    await page.screenshot({ path: `${OUT}/09-hover-interromper-beta.png`, fullPage: true });
    betaBtnInfo = { encontrado: true, tag: tagName, box, outerHTML_preview: outerHTML };
  } else {
    betaBtnInfo = { encontrado: false };
  }
} catch (e) {
  betaBtnInfo = { encontrado: false, erro: e.message };
}
console.log('[Interromper BETA teste] info:', JSON.stringify(betaBtnInfo, null, 2));
resultado.botao_interromper_beta = betaBtnInfo;

writeFileSync(`${OUT}/resultado-scroll-picker.json`, JSON.stringify(resultado, null, 2));
console.log('\n[resultado-scroll-picker.json gravado]');

await browser.close();
