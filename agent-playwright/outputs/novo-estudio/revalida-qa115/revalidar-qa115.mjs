// Revalidação QA 1.15 (LOCAL) — coexistência via flag novo_estudio_criacao.
// READ-ONLY (sem mutar Flipper): caso ON = org 37063 (actor presente);
// caso OFF = org do env EDUAPI (sem actor na lista do Flipper).
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const OUT = 'outputs/novo-estudio/revalida-qa115';
mkdirSync(OUT, { recursive: true });
const r = {};
const browser = await chromium.launch({ headless: true });

async function caso(nome, base, org, email, senha) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' });
  const page = await ctx.newPage();
  await page.goto(`${base}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', email);
  await page.fill('#user_password', senha);
  await page.click('#user_submit');
  await page.waitForTimeout(7000);

  // criação de curso: abas visíveis
  await page.goto(`${base}/o/${org}/contents/new?kind=course`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  const criacao = await page.evaluate(() => ({
    url: location.pathname + location.search,
    tabs: [...document.querySelectorAll('[data-test-id^="tab-"]')]
      .filter((el) => el.getBoundingClientRect().width > 5 && !/drag-handle/.test(el.getAttribute('data-test-id')))
      .map((el) => el.getAttribute('data-test-id')),
    formCarregou: [...document.querySelectorAll('input, [contenteditable]')]
      .filter((el) => el.getBoundingClientRect().width > 0).length > 2,
  }));
  await page.screenshot({ path: `${OUT}/${nome}-criacao.png` });

  // edição de um curso existente: aba Atividades(studio) presente?
  await page.goto(`${base}/o/${org}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  const cursoId = await page.evaluate(() => {
    const m = document.body.innerHTML.match(/contents\/(\d+)\/edit|data-item-id="(\d+)"/);
    return m ? (m[1] ?? m[2]) : null;
  });
  let edicao = null;
  if (cursoId) {
    await page.goto(`${base}/o/${org}/contents/${cursoId}/edit`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(8000);
    edicao = await page.evaluate(() => ({
      url: location.pathname,
      tabs: [...document.querySelectorAll('[data-test-id^="tab-"]')]
        .filter((el) => el.getBoundingClientRect().width > 5 && !/drag-handle/.test(el.getAttribute('data-test-id')))
        .map((el) => el.getAttribute('data-test-id')),
    }));
    await page.screenshot({ path: `${OUT}/${nome}-edicao.png` });
  }
  await ctx.close();
  return { org, criacao, cursoId, edicao };
}

try {
  r.flagOn = await caso('01-flag-on-37063', 'https://novoestudioadicional.stage.twygoead.com', '37063',
    process.env.TWYGO_STAGING_NOVO_ESTUDIO_ADITIONAL_EMAIL ?? process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL,
    process.env.TWYGO_STAGING_NOVO_ESTUDIO_ADITIONAL_PASSWORD ?? process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  console.log('CASO FLAG ON (37063):', JSON.stringify(r.flagOn, null, 1));

  // OFF: env EDUAPI (org fora da lista de actors) — credenciais do twygo-playwright-tests
  const eduBase = process.env.EDUAPI_BASE_URL_NE ?? 'https://eduapi.stage.twygoead.com';
  r.flagOff = await caso('02-flag-off-eduapi', eduBase.replace(/\/$/, ''), process.env.EDUAPI_ORG_ID_NE ?? '36912',
    process.env.EDUAPI_EMAIL_NE ?? 'agents.qa@claude.com', process.env.EDUAPI_SENHA_NE ?? '123456');
  console.log('CASO FLAG OFF (eduapi):', JSON.stringify(r.flagOff, null, 1));

  const tem = (c, t) => (c?.tabs ?? []).includes(t);
  r.passou =
    tem(r.flagOn.criacao, 'tab-studio') &&
    (r.flagOn.edicao ? tem(r.flagOn.edicao, 'tab-studio') : true) &&
    !tem(r.flagOff.criacao, 'tab-studio') && !tem(r.flagOff.criacao, 'tab-modelo') &&
    r.flagOff.criacao.formCarregou === true &&
    (r.flagOff.edicao ? !tem(r.flagOff.edicao, 'tab-studio') : true);
  console.log('PASSOU (ON mostra studio; OFF esconde e fluxo antigo segue)?', r.passou);
} catch (e) {
  r.erro = String(e).slice(0, 500);
  console.error('ERRO:', r.erro);
}

writeFileSync(`${OUT}/resultado.json`, JSON.stringify(r, null, 2));
console.log('\n===== DADOS =====');
console.log(JSON.stringify(r, null, 2));
await browser.close();
