// Probe LOCAL v2: scroll horizontal REAL + elemento com right edge ~ scrollWidth
import 'dotenv/config';
import { chromium } from '@playwright/test';

const BASE = 'https://novoestudio.stage.twygoead.com';
const ORG = '37061'; const ID = '807533';
const browser = await chromium.launch({ headless: true });

for (const vp of [{ width: 1024, height: 600 }, { width: 1440, height: 900 }]) {
  const ctx = await browser.newContext({ viewport: vp, locale: 'pt-BR' });
  const page = await ctx.newPage();
  await page.goto(`${BASE}/users/login`, { waitUntil: 'domcontentloaded' });
  await page.fill('#user_email', process.env.TWYGO_STAGING_NOVO_ESTUDIO_EMAIL);
  await page.fill('#user_password', process.env.TWYGO_STAGING_NOVO_ESTUDIO_PASSWORD);
  await page.click('#user_submit');
  await page.waitForURL((u) => !u.pathname.startsWith('/users/login'), { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(3000);
  await page.goto(`${BASE}/o/${ORG}/contents/${ID}/edit?tab=studio`, { waitUntil: 'domcontentloaded' });
  await page.locator('[data-test-id="creation-studio-three-column-shell"]').waitFor({ state: 'visible', timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(3000);
  const res = await page.evaluate(() => {
    const doc = document.documentElement;
    window.scrollTo(9999, 0);
    const scrollXMax = window.scrollX;
    window.scrollTo(0, 0);
    const cw = doc.clientWidth; const sw = doc.scrollWidth;
    // elementos em fluxo cujo right edge bate perto do scrollWidth
    const candidatos = [...document.querySelectorAll('body *')]
      .map((el) => ({ el, r: el.getBoundingClientRect() }))
      .filter(({ r }) => r.right > cw + 2 && r.right <= sw + 2 && r.width > 10)
      .sort((a, b) => b.r.right - a.r.right)
      .slice(0, 6)
      .map(({ el, r }) => ({
        tag: el.tagName, tid: el.getAttribute('data-test-id'),
        cls: String(el.className).slice(0, 70),
        right: Math.round(r.right), width: Math.round(r.width), left: Math.round(r.left),
        texto: (el.textContent || '').trim().slice(0, 50),
      }));
    return { cw, sw, scrollXMax, candidatos };
  });
  console.log(`\n===== ${vp.width}x${vp.height} =====`);
  console.log(JSON.stringify(res, null, 2));
  if (res.scrollXMax > 0) {
    await page.evaluate(() => window.scrollTo(9999, 0));
    await page.screenshot({ path: `outputs/novo-estudio/retrabalho-19813/probe-${vp.width}-scrollado.png` });
  }
  await ctx.close();
}
await browser.close();
