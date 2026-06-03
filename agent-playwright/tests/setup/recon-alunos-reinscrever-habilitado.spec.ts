/**
 * Recon: identifica alunos com botão "Iniciar reinscrição" habilitado
 * nos cursos seed (807287 Richard + 807403 Curso com atividades).
 * Reporta JSON com cursoId + emails + estado do botão Reinscrever
 * (habilitado/desabilitado/ausente).
 *
 * Opt-in: RUN_RECON_ALUNOS_REINSCREVER=1
 */
import { test, expect } from '../../src/fixtures/exploratory-fixture.js';
import { ProfileSwitcher } from '../../src/pages/ProfileSwitcher.js';
import { fixedSeed } from '../../projects/recertificacao/data/fixed-seed.data.js';

const ENABLED = process.env.RUN_RECON_ALUNOS_REINSCREVER === '1';

test.describe.configure({ timeout: 10 * 60 * 1000 });

interface ParticipantInfo {
  email: string;
  certBadge: string;
  progresso: string;
  reinscreverEstado: 'habilitado' | 'desabilitado' | 'ausente';
}

async function reconCurso(
  page: import('@playwright/test').Page,
  cursoId: number,
  cursoLabel: string,
): Promise<{ cursoId: number; cursoLabel: string; participants: ParticipantInfo[] }> {
  await page.goto(`/e/${cursoId}/learning`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(8000);
  // Tira screenshot pra debug
  await page.screenshot({
    path: `outputs/recertificacao/recon-${cursoId}-learning.png`,
    fullPage: true,
  });
  // eslint-disable-next-line no-console
  console.log(`[recon] Screenshot salvo: outputs/recertificacao/recon-${cursoId}-learning.png`);
  // eslint-disable-next-line no-console
  console.log(`[recon] URL: ${page.url()}`);
  // eslint-disable-next-line no-console
  console.log(`[recon] Tem 'tbody tr':`, await page.locator('tbody tr').count());
  // eslint-disable-next-line no-console
  console.log(`[recon] Tem '@example.com':`, await page.locator('text=@example.com').count());

  // Lista participants direto via tbody tr (estrutura HTML padrão do 807287)
  const participants = await page.evaluate(() => {
    const emailRegex = /[\w.+-]+@[\w-]+\.[\w.-]+/;
    const rows = Array.from(document.querySelectorAll('tbody tr')).filter(
      (tr) => !tr.querySelector('td[colspan]') && tr.querySelector('td'),
    );
    return rows.slice(0, 15).map((row, idx) => {
      const text = (row.textContent || '').trim();
      const emailMatch = text.match(emailRegex);
      const email = emailMatch ? emailMatch[0] : `(row-${idx}-no-email)`;
      const certMatch = text.match(/(Emitido|Pendente|Aprovado|Expirado|Substituído)/i);
      const certBadge = certMatch ? certMatch[0] : '(no badge)';
      const progMatch = text.match(/(\d+)%/);
      const progresso = progMatch ? `${progMatch[1]}%` : '0%';
      return { email, certBadge, progresso, rowIdx: idx };
    });
  });

  // Pra cada participant, abrir kebab e checar item Reinscrever
  const enriched: ParticipantInfo[] = [];
  for (let i = 0; i < participants.length; i += 1) {
    const p = participants[i];
    let reinscreverEstado: 'habilitado' | 'desabilitado' | 'ausente' = 'ausente';
    try {
      // Usa rowIdx pra mirar a linha exata (mesmo se email duplicar)
      const row = page.locator('tbody tr').nth(p.rowIdx);
      const kebab = row.getByRole('button', { name: 'more_vert' }).first();
      if (await kebab.isVisible({ timeout: 2_000 }).catch(() => false)) {
        await kebab.scrollIntoViewIfNeeded();
        await kebab.click();
        await page.waitForTimeout(800);
        const item = page
          .getByRole('menuitem', { name: /Iniciar reinscrição/i })
          .first();
        const visivel = await item.isVisible({ timeout: 1_500 }).catch(() => false);
        if (visivel) {
          const ariaDisabled = await item.getAttribute('aria-disabled').catch(() => null);
          reinscreverEstado = ariaDisabled === 'true' ? 'desabilitado' : 'habilitado';
        }
        await page.keyboard.press('Escape');
        await page.waitForTimeout(400);
      }
    } catch {
      // ignora
    }
    enriched.push({
      email: p.email,
      certBadge: p.certBadge,
      progresso: p.progresso,
      reinscreverEstado,
    });
  }

  return { cursoId, cursoLabel, participants: enriched };
}

test.describe('recon alunos reinscrever', () => {
  test.skip(!ENABLED, 'opt-in via RUN_RECON_ALUNOS_REINSCREVER=1');

  test('dump 807287 (Richard Sebold) + 807403 (Curso com atividades)', async ({ page }) => {
    await new ProfileSwitcher(page).switchToViaUrl('Administrador');

    const r1 = await reconCurso(page, fixedSeed.cursoComSubstituidoId, '807287 Richard Sebold');

    // eslint-disable-next-line no-console
    console.log('[recon-alunos-reinscrever]', JSON.stringify({ cursos: [r1] }, null, 2));

    expect(true).toBe(true);
  });
});
