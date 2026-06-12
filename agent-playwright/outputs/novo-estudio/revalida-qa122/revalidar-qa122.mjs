// QA 1.22 (LOCAL) — Repasse SEM a feature flag (org EDUAPI 36912, sem
// novo_estudio_criacao). Fluxos principais da experiência CLÁSSICA +
// vazamentos do Estúdio + erros de console/HTTP.
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = (process.env.EDUAPI_BASE_URL_NE ?? 'https://eduapi.stage.twygoead.com').replace(/\/$/, '');
const ORG = process.env.EDUAPI_ORG_ID_NE ?? '36912';
const EMAIL = process.env.EDUAPI_EMAIL_NE ?? 'agents.qa@claude.com';
const SENHA = process.env.EDUAPI_SENHA_NE ?? '123456';
const NOME_CURSO = 'QA122-repasse-1206-excluir';
const OUT = 'outputs/novo-estudio/revalida-qa122';
mkdirSync(OUT, { recursive: true });
const r = { org: ORG, base: BASE };
const consoleErrors = [];
const httpErrors = [];

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160)); });
page.on('response', (res) => {
  if (res.status() >= 400 && res.url().includes('twygoead.com'))
    httpErrors.push(`${res.status()} ${res.request().method()} ${res.url().replace(BASE, '').slice(0, 110)}`);
});

async function dismiss() {
  for (const txt of [/pergunte depois/i, /continuar mesmo assim/i, /entendi/i, /^fechar$/i, /^agora não$/i]) {
    const b = page.getByRole('button', { name: txt }).first();
    if (await b.isVisible().catch(() => false)) { await b.click().catch(() => {}); await page.waitForTimeout(600); }
  }
}
const tabsVisiveis = () => page.evaluate(() =>
  [...document.querySelectorAll('[data-test-id^="tab-"]')]
    .filter((el) => el.getBoundingClientRect().width > 5 && !/drag-handle/.test(el.getAttribute('data-test-id')))
    .map((el) => ({ tid: el.getAttribute('data-test-id'), draggable: el.getAttribute('draggable'), temHandle: !!el.querySelector('[data-test-id$="-drag-handle"]') })));

try {
  // 1) login + listagem
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', EMAIL);
  await page.fill('#user_password', SENHA);
  await page.click('#user_submit');
  await page.waitForTimeout(7000);
  await dismiss();
  await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  await dismiss();
  r.listagem = await page.evaluate(() => ({
    titulo: document.title.slice(0, 60),
    temLinhas: document.querySelectorAll('[data-item-id], tr').length > 1,
  }));
  console.log('[1 listagem]', JSON.stringify(r.listagem));
  await page.screenshot({ path: `${OUT}/01-listagem.png` });

  // 2) criação de curso CLÁSSICA (sem abas studio/modelo) + salvar
  await page.goto(`${BASE}/o/${ORG}/contents/new?kind=course`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  await dismiss();
  r.tabsCriacao = await tabsVisiveis();
  r.vazamentoCriacao = r.tabsCriacao.some((t) => t.tid === 'tab-studio' || t.tid === 'tab-modelo');
  console.log('[2 criação] tabs:', JSON.stringify(r.tabsCriacao.map((t) => t.tid)), '| vazamento studio/modelo?', r.vazamentoCriacao);
  await page.getByPlaceholder('Nome do curso').first().fill(NOME_CURSO);
  // react-select abre com MOUSEDOWN no control (click simples não abre; JS focus não basta)
  await page.evaluate(() => {
    const input = document.querySelector("input[id^='react-select']");
    input.scrollIntoView({ block: 'center' });
    const control = input.closest('[class*="control"]') ?? input.parentElement.parentElement;
    control.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    input.focus();
  });
  await page.waitForTimeout(1000);
  await page.keyboard.type('Curso', { delay: 80 });
  await page.waitForTimeout(1500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(1000);
  r.tipoSelecionado = await page.evaluate(() => {
    const input = document.querySelector("input[id^='react-select']");
    const control = input.closest('[class*="control"]') ?? input.parentElement.parentElement;
    return (control.textContent ?? '').trim().slice(0, 60);
  });
  console.log('[2 criação] tipo selecionado:', JSON.stringify(r.tipoSelecionado));
  await page.screenshot({ path: `${OUT}/02a-form-preenchido.png` });
  // descrição: CKEditor se carregou; senão, textarea cru (CSP bloqueia cdn.ckeditor.com neste host)
  r.ck = await page.evaluate((html) => {
    if (window.CKEDITOR && Object.keys(CKEDITOR.instances).length) {
      const ed = CKEDITOR.instances[Object.keys(CKEDITOR.instances)[0]];
      ed.setData('<p>' + html + '</p>'); ed.updateElement(); ed.fire('change');
      const ta = ed.element && ed.element.$;
      if (ta) { ta.dispatchEvent(new Event('input', { bubbles: true })); ta.dispatchEvent(new Event('change', { bubbles: true })); }
      return 'ckeditor';
    }
    const ta = [...document.querySelectorAll('textarea')].find((t) => t.getBoundingClientRect().width > 0 || /descri/i.test(t.name ?? ''));
    if (!ta) return 'sem editor nem textarea';
    const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value').set;
    setter.call(ta, html);
    ta.dispatchEvent(new Event('input', { bubbles: true }));
    ta.dispatchEvent(new Event('change', { bubbles: true }));
    return 'textarea-cru (CKEditor não carregou — CSP)';
  }, 'Curso descartavel do repasse QA 1.22 (sera excluido).');
  console.log('[2 criação] descrição via:', r.ck);
  await page.getByRole('button', { name: /^Salvar/i }).first().click();
  await page.waitForURL(/\/(contents|e|events)\/\d+/, { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(4000);
  await dismiss();
  r.cursoId = (page.url().match(/\/(?:contents|e|events)\/(\d+)/) ?? [])[1] ?? null;
  r.criacaoOk = !!r.cursoId;
  console.log('[2 criação] salvo? cursoId:', r.cursoId);
  await page.screenshot({ path: `${OUT}/02-curso-criado.png` });

  // 3) edição: abas clássicas, sem drag handle, navegação entre abas funciona
  if (r.cursoId) {
    await page.goto(`${BASE}/o/${ORG}/contents/${r.cursoId}/edit`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(7000);
    await dismiss();
    r.tabsEdicao = await tabsVisiveis();
    r.vazamentoEdicao = r.tabsEdicao.some((t) => t.tid === 'tab-studio' || t.tid === 'tab-modelo');
    r.dragNasAbas = r.tabsEdicao.some((t) => t.draggable === 'true' || t.temHandle);
    console.log('[3 edição] tabs:', JSON.stringify(r.tabsEdicao.map((t) => t.tid)),
      '| vazamento?', r.vazamentoEdicao, '| drag de abas (não deveria sem flag)?', r.dragNasAbas);
    // navegar 2 abas e voltar
    for (const t of ['tab-access', 'tab-banner', 'tab-identification']) {
      const aba = page.locator(`[data-test-id="${t}"]:visible`).first();
      if (await aba.isVisible().catch(() => false)) { await aba.click(); await page.waitForTimeout(2500); }
    }
    r.overflowEdicao = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth, clientW: document.documentElement.clientWidth,
    }));
    console.log('[3 edição] overflow horizontal:', JSON.stringify(r.overflowEdicao));
    await page.screenshot({ path: `${OUT}/03-edicao-abas-classicas.png` });

    // 4) re-salvar Identificação (fluxo de save clássico segue ok)
    await page.locator('[data-test-id="tab-identification"]:visible').first().click().catch(() => {});
    await page.waitForTimeout(2500);
    const salvar = page.getByRole('button', { name: /^Salvar/i }).first();
    if (await salvar.isVisible().catch(() => false)) {
      await salvar.click();
      await page.waitForTimeout(4000);
      r.resaveOk = !/erro/i.test(await page.evaluate(() => document.querySelector('.chakra-toast')?.textContent ?? ''));
      console.log('[4 resave] ok?', r.resaveOk);
    }
    await page.screenshot({ path: `${OUT}/04-resave.png` });

    // 5) atividades LEGADAS: como chega? kebab da listagem + procurar link na edição
    await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    await dismiss();
    const kebab = page.locator(`[data-test-id="events-${r.cursoId}-actions-kebab"]`);
    if (await kebab.isVisible().catch(() => false)) {
      await kebab.click();
      await page.waitForTimeout(1500);
      r.kebabItens = await page.evaluate(() =>
        [...document.querySelectorAll('[role="menuitem"], .chakra-menu__menuitem')]
          .filter((el) => el.getBoundingClientRect().width > 0)
          .map((el) => (el.textContent ?? '').trim()).filter(Boolean));
      console.log('[5 kebab]', JSON.stringify(r.kebabItens));
      await page.screenshot({ path: `${OUT}/05-kebab.png` });
      // abrir "Atividades" legado se existir
      const ativ = page.getByRole('menuitem', { name: /atividades/i }).first();
      if (await ativ.isVisible().catch(() => false)) {
        await ativ.click();
        await page.waitForTimeout(7000);
        await dismiss();
        r.atividadesLegado = { url: page.url().replace(BASE, ''), carregou: await page.evaluate(() => document.body.innerText.length > 500) };
        console.log('[5 atividades legado]', JSON.stringify(r.atividadesLegado));
        await page.screenshot({ path: `${OUT}/06-atividades-legado.png` });
      } else { await page.keyboard.press('Escape'); }
    }

    // 6) CLEANUP: excluir o curso pelo kebab
    await page.goto(`${BASE}/o/${ORG}/events?tab=events&profile=admin`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(5000);
    await dismiss();
    const kebab2 = page.locator(`[data-test-id="events-${r.cursoId}-actions-kebab"]`);
    if (await kebab2.isVisible().catch(() => false)) {
      await kebab2.click();
      await page.waitForTimeout(1500);
      const excluir = page.getByRole('menuitem', { name: /excluir/i }).first();
      if (await excluir.isVisible().catch(() => false)) {
        page.once('dialog', (d) => d.accept());
        await excluir.click().catch(() => {});
        await page.waitForTimeout(2500);
        const conf = page.getByRole('button', { name: /^(Excluir|Confirmar|Sim)$/i }).first();
        if (await conf.isVisible().catch(() => false)) await conf.click().catch(() => {});
        await page.waitForTimeout(4000);
      }
      r.cursoExcluido = !(await page.locator(`[data-test-id="events-${r.cursoId}-actions-kebab"]`).isVisible().catch(() => false));
      console.log('[6 cleanup] curso excluído?', r.cursoExcluido);
      await page.screenshot({ path: `${OUT}/07-pos-cleanup.png` });
    }
  }
} catch (e) {
  r.erro = String(e).slice(0, 500);
  console.error('ERRO:', r.erro);
  await page.screenshot({ path: `${OUT}/99-erro.png` }).catch(() => {});
}

r.consoleErrors = [...new Set(consoleErrors)].slice(0, 20);
r.httpErrors = [...new Set(httpErrors)].slice(0, 20);
console.log('\nCONSOLE ERRORS:', JSON.stringify(r.consoleErrors, null, 1));
console.log('HTTP 4xx/5xx:', JSON.stringify(r.httpErrors, null, 1));
writeFileSync(`${OUT}/resultado.json`, JSON.stringify(r, null, 2));
console.log('\n===== DADOS =====');
console.log(JSON.stringify({ ...r, tabsCriacao: r.tabsCriacao?.map((t) => t.tid), tabsEdicao: r.tabsEdicao?.map((t) => t.tid) }, null, 2));
await browser.close();
