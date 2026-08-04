// TEMPORÁRIO — descobrir por que /users/new não cria. Captura rede (o POST sai?), console, e prints.
import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { getBaseUrl, getEnvByName, getOrgId } from '../../../../../src/utils/environment.js';
import { safeGoto, dismissCommonModals } from '../../../../../src/utils/modals.js';
import { acessoData as data } from '../acesso-e-regras-de-inscricao/acesso-e-regras-de-inscricao.data.js';

const TS = Date.now();
const EMAIL = `qa.gestor.${TS}@example.com`;
const DIR = 'outputs/jornadas/evidencia-criar-usuario';

test('DIAG criar usuario com perfil', async ({ page }) => {
  test.setTimeout(600_000);
  const env = getEnvByName(data.ambiente);
  const orgId = env.orgId ?? getOrgId();
  const baseUrl = env.baseUrl || getBaseUrl();

  const reqs: string[] = [];
  const resps: string[] = [];
  page.on('request', (r) => { if (/\/users/.test(r.url())) reqs.push(`${r.method()} ${r.url().replace(baseUrl, '')}`); });
  page.on('response', async (r) => { if (/\/users/.test(r.url())) resps.push(`${r.status()} ${r.request().method()} ${r.url().replace(baseUrl, '')}`); });
  const consoleErr: string[] = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErr.push(m.text().replace(/\s+/g, ' ').slice(0, 150)); });
  page.on('pageerror', (e) => consoleErr.push('PAGEERROR ' + e.message.replace(/\s+/g, ' ').slice(0, 150)));

  await safeGoto(page, new URL(`/o/${orgId}/users/new`, baseUrl).toString());
  await page.locator('#professional_email').waitFor({ state: 'visible', timeout: 30_000 });
  await dismissCommonModals(page);

  await page.locator('#professional_email').fill(EMAIL);
  await page.locator('#professional_first_name').fill('QA');
  await page.locator('#professional_last_name').fill(`Gestor ${TS}`);
  await page.locator('input.checkboxProfile#user_profile_settings_manager_class').click();
  await page.waitForTimeout(1_500);
  await page.screenshot({ path: `${DIR}/01-form-preenchido.png`, fullPage: true });

  reqs.length = 0; resps.length = 0;
  const form = page.locator('#professional-form');
  const salvar = form.locator('button, input[type="submit"]').filter({ hasText: /^Salvar$/ }).first();
  const alvo = (await salvar.count()) ? salvar : form.locator('[value="save"]').first();
  console.log('botao alvo count =', await alvo.count());
  await alvo.click();
  await page.waitForTimeout(9_000);

  console.log('\n=== REDE apos o clique ===');
  console.log('  requests /users:', JSON.stringify(reqs));
  console.log('  responses /users:', JSON.stringify(resps));
  console.log('  POST saiu? =', reqs.some((r) => r.startsWith('POST')));
  console.log('\n=== CONSOLE ===');
  console.log('  ' + (consoleErr.length ? JSON.stringify([...new Set(consoleErr)].slice(0, 6)) : '(sem erro)'));
  console.log('\nurl atual =', page.url());

  await page.screenshot({ path: `${DIR}/02-apos-salvar.png`, fullPage: true });

  // Se o browser bloqueou por validacao, o campo invalido fica com :invalid — listar TODOS, do form ou nao
  const invalidos = await page.evaluate(() => {
    const out: string[] = [];
    document.querySelectorAll('#professional-form input, #professional-form select, #professional-form textarea').forEach((e) => {
      const x = e as HTMLInputElement;
      if (x.willValidate && !x.checkValidity()) out.push(`${x.id || x.getAttribute('name')} :: ${x.validationMessage}`);
    });
    const f = document.querySelector('#professional-form') as HTMLFormElement | null;
    out.push(`form.checkValidity() = ${f ? f.checkValidity() : 'form ausente'}`);
    out.push(`form.noValidate = ${f ? f.noValidate : '-'}`);
    return out;
  });
  console.log('\n=== validacao do #professional-form ===');
  invalidos.forEach((l) => console.log('  ' + l));

  // Texto de erro em qualquer lugar da pagina (Rails re-render)
  const txt = (await page.locator('body').innerText().catch(() => '')).replace(/\s+/g, ' ');
  for (const termo of ['obrigat', 'inválid', 'invalid', 'erro', 'não pode', 'already been taken', 'em branco']) {
    const i = txt.toLowerCase().indexOf(termo);
    if (i >= 0) console.log(`  trecho "${termo}": ${JSON.stringify(txt.slice(Math.max(0, i - 90), i + 90))}`);
  }
});
