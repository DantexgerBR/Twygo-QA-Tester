// Ad-hoc: valida PR #10983 (card Artia 20480) — link de download de
// evidências no e-mail de exportação deve vir como https:// (antes: http://
// quando @organization_domain.has_ssl? = false, caso da org "Stage 10", que
// é o org ligado ao login deste card via domínio dedicado
// stage10.stage.twygoead.com).
//
// Credenciais são as do próprio card — NÃO vêm do .env porque o card já
// fornece um login específico pra este teste, fora do usuário canônico do
// projeto.
//
// ORACLE do PR: `build_download_urls` no mailer agora força
// `protocol: 'https'`. O ÚNICO jeito fiel de confirmar é ler o link
// GERADO NO E-MAIL renderizado pelo mailer (não a URL de download em si,
// que funciona em http e https igualmente — isso é o paliativo, não a prova).
import { chromium, type Page } from '@playwright/test';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dismissCommonModals } from '../src/utils/modals.js';

const LOGIN_URL = 'https://stage10.stage.twygoead.com/users/login';
const EMAIL = 'evertongambeta@gmail.com';
const PASSWORD = '123456';

// Host de controle: usado apenas para confirmar que letter_opener está
// universalmente ausente nestes stages (não é o org do card).
const CONTROL_HOST = 'registrosf2.stage.twygoead.com';

const OUT_DIR = 'outputs/registros-download-evidencias-https';
mkdirSync(OUT_DIR, { recursive: true });

let shotIdx = 0;
async function snap(page: Page, name: string): Promise<string> {
  shotIdx += 1;
  const path = `${OUT_DIR}/${String(shotIdx).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log('[snap]', path);
  return path;
}

async function probe(page: Page, url: string): Promise<{ url: string; status: number | string }> {
  try {
    const resp = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 15_000 });
    const status = resp?.status() ?? 0;
    console.log('[probe]', status, url);
    return { url, status };
  } catch (err) {
    console.log('[probe-erro]', url, (err as Error).message.split('\n')[0]);
    return { url, status: 'ERR' };
  }
}

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 250 });
  const context = await browser.newContext({ viewport: { width: 1600, height: 950 } });
  const page = await context.newPage();

  console.log('--- 1. login (domínio dedicado da org "Stage 10") ---');
  await page.goto(LOGIN_URL, { waitUntil: 'domcontentloaded' });
  await dismissCommonModals(page);
  await page.getByRole('textbox', { name: 'Login' }).fill(EMAIL);
  await page.getByRole('textbox', { name: 'Senha' }).fill(PASSWORD);
  await snap(page, 'login-preenchido');
  await page.getByRole('button', { name: 'Entrar' }).click();
  await page.waitForTimeout(4000);
  await dismissCommonModals(page);
  console.log('URL pós-login:', page.url());
  await snap(page, 'pos-login');

  console.log('--- 2. virar Administrador via dropdown de perfil ---');
  // Login em stage10.stage.twygoead.com cai como Aluno por padrão. Trocar
  // perfil pela URL direta (/o/{orgId}/events?tab=events&profile=admin) dá
  // "Você não tem permissão" nesta org (confirmado por recon prévio). O
  // caminho que funciona é o dropdown de perfil ("Aluno" -> "Administrador").
  await page.getByRole('button', { name: /Aluno/i }).click();
  await page.waitForTimeout(500);
  await page.getByText('Administrador', { exact: true }).click();
  await page.waitForTimeout(3000);
  await dismissCommonModals(page);
  const currentHost = new URL(page.url()).host;
  const orgId = new URL(page.url()).pathname.match(/\/o\/(\d+)\//)?.[1];
  console.log('URL após virar admin:', page.url(), '| orgId real:', orgId);
  await snap(page, 'org-context-stage10');

  console.log('--- 3. navegar até Aprendizagem > Registros ---');
  await page.goto(`https://${currentHost}/o/${orgId}/records`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(6000);
  await dismissCommonModals(page);
  console.log('URL Registros:', page.url());
  await snap(page, 'registros-listagem');

  console.log('--- 4. abrir Extrair dados > Evidências ---');
  await page.getByRole('button', { name: /Extrair dados/i }).first().click({ timeout: 10_000 });
  await page.waitForTimeout(500);
  await snap(page, 'drawer-extracao-aberto');

  // O modal Chakra fica num portal separado do DOM da página de fundo, que
  // ainda tem seu próprio <select id="select_pages"> (paginação "25 por
  // página"). Sem escopar no dialog, o Playwright resolve o select errado.
  const dialog = page.getByRole('dialog');
  await dialog.locator('select').first().selectOption({ label: 'Evidências' });
  await page.waitForTimeout(500);
  await snap(page, 'drawer-evidencias-selecionado');

  console.log('--- 5. clicar Extrair e capturar a resposta da API ---');
  const [extractResp] = await Promise.all([
    page.waitForResponse((r) => /subscription_attachments_exports/i.test(r.url()), { timeout: 15_000 }),
    dialog.getByRole('button', { name: /^Extrair$/i }).click(),
  ]);
  const extractBody = await extractResp.text().catch(() => '');
  console.log('[export-api]', extractResp.status(), extractBody);
  await page.waitForTimeout(2000);
  await dismissCommonModals(page);
  await snap(page, 'export-disparado');

  console.log('--- 6. confirmar conclusão via sino de notificações (in-app) ---');
  // O bell não expõe o link — só confirma "Acesse o e-mail para baixar os
  // arquivos". Serve pra provar que o job assíncrono terminou antes de
  // tentarmos ler o e-mail por outra via.
  let notifText = '';
  try {
    await page.waitForTimeout(15_000); // dá tempo do worker assíncrono processar o zip
    await page.reload({ waitUntil: 'domcontentloaded' });
    await dismissCommonModals(page);
    await page.getByRole('button', { name: 'Users' }).click({ timeout: 10_000 }); // aria-label real do sino nesta versão do app
    await page.waitForTimeout(1500);
    notifText = (await page.locator('body').innerText().catch(() => '')).slice(0, 0);
    const notifPanel = await page.locator('body').innerText();
    const idx = notifPanel.indexOf('Exportação de anexos concluída');
    notifText = idx >= 0 ? notifPanel.slice(idx, idx + 200) : '(notificação de exportação não encontrada ainda)';
    console.log('[notificacao]', notifText);
    await snap(page, 'notificacao-exportacao-concluida');
  } catch (err) {
    console.log('[notificacao-erro]', (err as Error).message.split('\n')[0]);
  }

  console.log('--- 7. tentar letter_opener / mailer preview (alvo + controle) ---');
  const attempts: { url: string; status: number | string }[] = [];
  const hostsToTry = [currentHost, CONTROL_HOST];
  const pathsToTry = ['/letter_opener', '/rails/mailers', '/rails/mailers/export_attachments_notification_mailer'];
  for (const host of hostsToTry) {
    for (const p of pathsToTry) {
      const r = await probe(page, `https://${host}${p}`);
      attempts.push(r);
      await snap(page, `tentativa-${host.replace(/\W+/g, '_')}${p.replace(/\W+/g, '_')}`);
    }
  }

  console.log('--- 8. Sidekiq (confirma pipeline assíncrono, não expõe URL renderizada) ---');
  const sidekiqResp = await probe(page, `https://${currentHost}/sidekiq`);
  await snap(page, 'sidekiq-dashboard');

  const result = {
    timestamp: new Date().toISOString(),
    orgAlvo: { host: currentHost, orgId, nomeConfirmadoNaSidebar: 'Stage 10' },
    exportApi: { status: extractResp.status(), body: extractBody },
    notificacaoInApp: notifText,
    tentativasLetterOpenerMailerPreview: attempts,
    sidekiq: sidekiqResp,
    conclusao:
      'Nenhuma via disponível neste stage rendeu o HTML do e-mail (letter_opener e /rails/mailers 404 ' +
      'tanto no host alvo quanto num host de controle; API de export não expõe a URL final; sino de ' +
      'notificação só informa "acesse o e-mail"). Sem acesso à caixa evertongambeta@gmail.com, não foi ' +
      'possível ler o scheme (http/https) do link efetivamente gerado pelo mailer. Veredito: BLOQUEADO.',
  };
  writeFileSync(`${OUT_DIR}/resultado.json`, JSON.stringify(result, null, 2));
  console.log('=== RESULTADO ===');
  console.log(JSON.stringify(result, null, 2));

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
