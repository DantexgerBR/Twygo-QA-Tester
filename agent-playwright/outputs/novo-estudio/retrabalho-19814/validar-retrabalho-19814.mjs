// Validação retrabalho 19814 (LOCAL, não commitar no twygo-agents-qa)
// P2 [Novo estúdio] Sem controles de colapsar/ocultar o menu lateral (RN 2).
// Recon ao vivo: existe algum controle de colapso/ocultar no menu lateral
// principal com o Estúdio aberto? (card sem PR vinculada)
import 'dotenv/config';
import { chromium } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const OUT = 'outputs/novo-estudio/retrabalho-19814';
mkdirSync(OUT, { recursive: true });

const summary = { card: 19814, env: BASE, org: ORG, content: ID };
const browser = await chromium.launch({ headless: true });
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'pt-BR' })).newPage();

try {
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test-id="creation-studio-three-column-shell"]').waitFor({ state: 'visible', timeout: 20000 });
  await page.waitForTimeout(3000);

  summary.recon = await page.evaluate(() => {
    // sidebar principal: região que contém Dashboard/Aprendizagem/Usuários
    const menu = document.querySelector('#menu') ?? [...document.querySelectorAll('nav, aside, div')]
      .find((el) => /Dashboard/.test(el.textContent ?? '') && /Aprendizagem/.test(el.textContent ?? '') && el.getBoundingClientRect().width < 400 && el.getBoundingClientRect().width > 50);
    const r = menu?.getBoundingClientRect();
    const sidebarInfo = menu ? { largura: Math.round(r.width), visivel: r.width > 0 } : null;

    // candidatos a controle de colapso/ocultar: botões com termos/ícones típicos
    const termos = /colaps|recolher|ocultar|esconder|expandir menu|hide menu|collapse|chevron|menu_open|toggle.*(menu|sidebar)|sidebar/i;
    const candidatos = [...document.querySelectorAll('button, [role="button"], a, svg')]
      .map((el) => ({
        el,
        aria: el.getAttribute?.('aria-label') ?? '',
        tid: el.getAttribute?.('data-test-id') ?? '',
        title: el.getAttribute?.('title') ?? '',
        cls: String(el.className ?? '').slice(0, 60),
        txt: (el.textContent ?? '').trim().slice(0, 30),
      }))
      .filter((c) => termos.test(`${c.aria} ${c.tid} ${c.title} ${c.cls} ${c.txt}`))
      .filter((c) => {
        const b = c.el.getBoundingClientRect?.();
        return b && b.width > 0 && b.height > 0;
      })
      .map(({ aria, tid, title, cls, txt }) => ({ aria, tid, title, cls, txt }));

    // dentro da sidebar: QUALQUER botão/ícone clicável (pra não depender só dos termos)
    const botoesNaSidebar = menu ? [...menu.querySelectorAll('button, [role="button"]')]
      .filter((el) => el.getBoundingClientRect().width > 0)
      .map((el) => ({
        aria: el.getAttribute('aria-label') ?? '',
        tid: el.getAttribute('data-test-id') ?? '',
        txt: (el.textContent ?? '').trim().slice(0, 30),
      })) : [];

    return { sidebarInfo, candidatos, botoesNaSidebar };
  });
  console.log(JSON.stringify(summary.recon, null, 2));
  await page.screenshot({ path: `${OUT}/01-estudio-sidebar-sem-controles.png` });

  // hover na borda da sidebar (alguns apps só mostram o controle no hover)
  const sb = await page.evaluate(() => {
    const menu = document.querySelector('#menu');
    const r = menu?.getBoundingClientRect();
    return r ? { x: r.right - 4, y: r.top + r.height / 2 } : null;
  });
  if (sb) {
    await page.mouse.move(sb.x, sb.y);
    await page.waitForTimeout(1200);
    summary.aposHoverBorda = await page.evaluate(() => {
      const termos = /colaps|recolher|ocultar|expandir|collapse|chevron/i;
      return [...document.querySelectorAll('button, [role="button"]')]
        .filter((el) => {
          const b = el.getBoundingClientRect();
          return b.width > 0 && termos.test(`${el.getAttribute('aria-label')} ${el.getAttribute('data-test-id')} ${el.textContent}`);
        })
        .map((el) => ({ aria: el.getAttribute('aria-label'), tid: el.getAttribute('data-test-id'), txt: el.textContent?.trim().slice(0, 30) }));
    });
    console.log('APÓS HOVER NA BORDA:', JSON.stringify(summary.aposHoverBorda));
    await page.screenshot({ path: `${OUT}/02-hover-borda-sidebar.png` });
  }

  summary.controleEncontrado =
    (summary.recon.candidatos?.length ?? 0) > 0 || (summary.aposHoverBorda?.length ?? 0) > 0;
  console.log('CONTROLE DE COLAPSO/OCULTAR ENCONTRADO?', summary.controleEncontrado);
} catch (e) {
  summary.erro = String(e).slice(0, 500);
  console.error('ERRO:', summary.erro);
  await page.screenshot({ path: `${OUT}/99-erro.png` }).catch(() => {});
}

writeFileSync(`${OUT}/resultado.json`, JSON.stringify(summary, null, 2));
console.log('\n===== VEREDITO-DADOS =====');
console.log(JSON.stringify(summary, null, 2));
await browser.close();
