// Recon LOCAL revalidação QA 1.12/1.15/1.16 (não commitar no twygo-agents-qa)
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const OUT = 'outputs/novo-estudio/revalida-1216';
mkdirSync(OUT, { recursive: true });
const r = {};

const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();
await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
await page.click('#user_submit');
await page.waitForTimeout(7000);

// ===== 1.12/1.16: topo do Estúdio =====
await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
await page.locator('[data-test-id="creation-studio-activities-list"]').waitFor({ state: 'visible', timeout: 25000 });
await page.waitForTimeout(3000);
r.topoEstudio = await page.evaluate(() => {
  const termos = /publicar|salvar como novo|duplicar|publish/i;
  const todos = [...document.querySelectorAll('button, a, [role="menuitem"], [role="button"]')]
    .filter((el) => el.getBoundingClientRect().width > 0)
    .map((el) => ({ txt: (el.textContent ?? '').trim().slice(0, 40), aria: el.getAttribute('aria-label'), tid: el.getAttribute('data-test-id') }));
  return {
    matches: todos.filter((b) => termos.test(`${b.txt} ${b.aria}`)),
    topoBotoes: todos.filter((b) => b.txt || b.aria).slice(0, 30),
  };
});
console.log('TOPO ESTÚDIO — matches publicar/salvar-como-novo/duplicar:', JSON.stringify(r.topoEstudio.matches));
await page.screenshot({ path: `${OUT}/01-topo-estudio.png` });

// kebab/menu secundário? procurar botões de menu no header do estúdio
r.menusHeader = await page.evaluate(() => {
  return [...document.querySelectorAll('[data-test-id="creation-studio-three-column-shell"] button, [data-test-id="content-form-studio-tab"] button')]
    .filter((el) => { const b = el.getBoundingClientRect(); return b.width > 0 && b.top < 320; })
    .map((el) => ({ txt: (el.textContent ?? '').trim().slice(0, 35), aria: el.getAttribute('aria-label'), tid: el.getAttribute('data-test-id') }))
    .slice(0, 20);
});
console.log('BOTÕES DO HEADER:', JSON.stringify(r.menusHeader, null, 1));

// ===== 1.12: editor de Aula — Salvar e renderizar / badge render_status =====
for (const lessonId of ['9289484', '9295166']) {
  await page.goto(`${BASE}/o/${ORG}/studio/activities/${lessonId}/edit?type=lesson&eventId=${ID}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  const info = await page.evaluate(() => {
    const termos = /salvar e renderizar|renderizar|renderizando|pendente de renderiza|pronto|render/i;
    const els = [...document.querySelectorAll('button, [role="status"], span, div')]
      .filter((el) => el.getBoundingClientRect().width > 0 && el.children.length <= 2 && termos.test(el.textContent ?? '') && (el.textContent ?? '').length < 60)
      .map((el) => ({ tag: el.tagName, txt: (el.textContent ?? '').trim().slice(0, 50), tid: el.getAttribute('data-test-id') }));
    const botoes = [...document.querySelectorAll('button')]
      .filter((el) => el.getBoundingClientRect().width > 0)
      .map((el) => (el.textContent ?? '').trim()).filter(Boolean).slice(0, 25);
    return { renderHits: els.slice(0, 12), botoesVisiveis: botoes, url: location.pathname + location.search };
  });
  r[`lesson_${lessonId}`] = info;
  console.log(`LESSON ${lessonId}:`, JSON.stringify(info, null, 1));
  await page.screenshot({ path: `${OUT}/02-lesson-${lessonId}.png` });
}

// ===== 1.15: Flipper =====
for (const flag of ['novo_estudio_criacao', 'creation_studio']) {
  await page.goto(`${BASE}/admin/manage/features/${flag}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(4000);
  const info = await page.evaluate(() => ({
    titulo: document.querySelector('h1, h2')?.textContent?.trim().slice(0, 60),
    corpo: document.body.innerText.slice(0, 900),
  }));
  r[`flipper_${flag}`] = info;
  console.log(`FLIPPER ${flag}:`, JSON.stringify(info.corpo.replace(/\n+/g, ' | ').slice(0, 500)));
  await page.screenshot({ path: `${OUT}/03-flipper-${flag}.png` });
}

writeFileSync(`${OUT}/recon.json`, JSON.stringify(r, null, 2));
await browser.close();
