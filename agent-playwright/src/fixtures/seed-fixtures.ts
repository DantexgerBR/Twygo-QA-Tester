import { test as base } from './exploratory-fixture.js';
import type { Browser } from '@playwright/test';
import { resolve } from 'node:path';
import { ProfileSwitcher } from '../pages/ProfileSwitcher.js';
import { SeedAdminPage } from '../../projects/recertificacao/pages/SeedAdminPage.js';

/**
 * Fixtures canônicas de seed para o projeto Recertificação.
 *
 * Use estas fixtures em specs que declaram pré-condição "X pré-existente"
 * — o test descreve o que precisa, a fixture provê (criando ou reusando).
 * Cada fixture tem cleanup `afterAll` pareado: ao fim do test/worker,
 * recursos criados são deletados via variant `*_safe`.
 *
 * **Escopo**: todos os fixtures aqui usam `scope: 'test'` por default
 * pra garantir isolamento entre TCs do mesmo arquivo. Para reuso entre
 * specs (cache cross-test), promova pra `scope: 'worker'` na chamada.
 *
 * **Naming worker-isolated**: recursos criados têm sufixo
 * `w<workerIndex>-<timestamp>` pra evitar colisão em paralelo.
 *
 * Skill canônica: [[provisionar-seed]] §"Integração com fixtures".
 *
 * Exemplo de spec consumindo:
 *
 * ```ts
 * import { test, expect } from '../../../../../src/fixtures/seed-fixtures.js';
 *
 * test('TC1 — switch aparece com flag ON', async ({ page, cursoSeed }) => {
 *   await page.goto(`/o/${orgId}/contents/${cursoSeed.id}/edit?tab=access`);
 *   // ... cursoSeed foi criado no beforeAll auto + será deletado no afterAll
 * });
 * ```
 *
 * @see provisionar-seed (skill v1.4.1+)
 */

const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

export type SeedFixtures = {
  /** Curso seed dedicado pra um test (worker-isolated, deletado no afterAll). */
  cursoSeed: { id: number; name: string };
  /** Trilha seed dedicada pra um test (worker-isolated). */
  trilhaSeed: { id: number; name: string };
  /**
   * Curso seed PUBLICADO (situation = Liberado) — visível e acessível ao
   * aluno. Necessário pra fluxos do Play (`/e/{id}/learn`, "APRENDER").
   * Reusa `cursoSeed` + chama `publicarCurso`.
   */
  cursoLiberadoSeed: { id: number; name: string };
  /**
   * Curso seed com `events.has_recertification = true`. Reusa
   * `cursoSeed` e chama `setHasRecertification(id, true)` via UI admin
   * (tab Acesso, switch Chakra). Pré-condição: feature flag
   * `:recertificacao` ATIVA na org (kill switch RN 1). Cleanup é
   * herdado de cursoSeed (cascata).
   *
   * Use em specs que validam comportamento dependente de
   * `has_recertification = true` — fluxos de Reinscrição Individual /
   * em Massa, banner "Reinscreva-se" no Play, e-mail diferenciado.
   */
  cursoComRecertificacaoSeed: { id: number; name: string };
  /**
   * Curso seed com 4 atividades pendentes (vídeo/SCORM/Aula) configuradas
   * com "Permitir marcar concluído manualmente". Reusa `cursoSeed` +
   * exige atividades pré-existentes no curso (ver §"Catálogo" — helpers
   * adicionarAtividade* ainda não implementados; por enquanto a fixture
   * apenas configura as atividades JÁ existentes via
   * `configurarMarcarConcluidoManualmente`).
   */
  cursoComAtividadesMarcaveisSeed: {
    id: number;
    name: string;
    activityIds: number[];
  };
  /**
   * Aluno matriculado num curso seed dedicado. Reusa `cursoSeed` se já
   * provisionado no mesmo test. Aluno tem email worker-isolated mas NÃO
   * tem senha — pra OAuth login use `alunoComSenhaSeed`.
   */
  alunoMatriculadoSeed: {
    cursoId: number;
    cursoNome: string;
    alunoEmail: string;
    alunoFirstName: string;
    alunoLastName: string;
  };
  /**
   * Aluno com SENHA gravada (permite login OAuth + UI). Útil pra specs
   * que validam fluxo do aluno (completar curso, ver listagem, etc).
   */
  alunoComSenhaSeed: {
    cursoId: number;
    cursoNome: string;
    alunoEmail: string;
    alunoSenha: string;
    alunoFirstName: string;
    alunoLastName: string;
  };
  /**
   * Aluno aprovado com certificado emitido. Dispara fluxo completo:
   * criar aluno + matricular + completar curso pelo Play até cert.
   * Validado live em 2026-05-28 (cert 5027067 emitido em ~9min).
   *
   * **Custo**: ~5-9min por test que consome (login + iterar atividades
   * + poll cert). Use `scope: 'worker'` quando possível pra amortizar.
   */
  alunoAprovadoSeed: {
    cursoId: number;
    cursoNome: string;
    alunoEmail: string;
    alunoSenha: string;
    attendeeId: number | null;
    progress: number;
    approvedAt: string | null;
    certificateId: number | null;
    certificateLink: string | null;
  };
};

async function withAdminPage<T>(
  browser: Browser,
  fn: (page: import('@playwright/test').Page, seed: SeedAdminPage) => Promise<T>,
): Promise<T> {
  const ctx = await browser.newContext({ storageState: STORAGE_PATH });
  const page = await ctx.newPage();
  try {
    // `switchToViaUrl` ao invés de `switchTo` — newPage abre about:blank e
    // `switchTo` tenta ler `button.menu-target` (trigger do popover) antes
    // de navegar, dando timeout 30s. `switchToViaUrl('Administrador')`
    // navega via /o/{orgId}/events?tab=events&profile=admin que estabelece
    // sessão admin sem depender do popover.
    await new ProfileSwitcher(page).switchToViaUrl('Administrador');
    return await fn(page, new SeedAdminPage(page));
  } finally {
    await ctx.close();
  }
}

export const test = base.extend<SeedFixtures>({
  cursoSeed: [
    async ({ browser }, use, testInfo) => {
      const name = `Curso Seed w${testInfo.workerIndex}-${Date.now()}`;
      const id = await withAdminPage(browser, (_p, seed) => seed.createCurso({ name }));
      await use({ id, name });
      // Cleanup
      await withAdminPage(browser, (_p, seed) => seed.deleteCursoByIdSafe(id));
    },
    { scope: 'test' },
  ],

  trilhaSeed: [
    async ({ browser }, use, testInfo) => {
      const name = `Trilha Seed w${testInfo.workerIndex}-${Date.now()}`;
      const id = await withAdminPage(browser, (_p, seed) => seed.createTrilha({ name }));
      await use({ id, name });
      await withAdminPage(browser, (_p, seed) => seed.deleteTrilhaByIdSafe(id));
    },
    { scope: 'test' },
  ],

  cursoLiberadoSeed: [
    async ({ browser, cursoSeed }, use) => {
      // Reusa cursoSeed e apenas publica (situation = Liberado).
      await withAdminPage(browser, (_p, seed) => seed.publicarCurso(cursoSeed.id));
      await use({ id: cursoSeed.id, name: cursoSeed.name });
      // Cleanup do curso é feito pelo cursoSeed (cascata).
    },
    { scope: 'test' },
  ],

  cursoComRecertificacaoSeed: [
    async ({ browser, cursoSeed }, use) => {
      // Reusa cursoSeed e liga has_recertification via tab Acesso.
      await withAdminPage(browser, (_p, seed) =>
        seed.setHasRecertification(cursoSeed.id, true),
      );
      await use({ id: cursoSeed.id, name: cursoSeed.name });
      // Cleanup do curso é feito pelo cursoSeed (cascata).
    },
    { scope: 'test' },
  ],

  cursoComAtividadesMarcaveisSeed: [
    async ({ browser, cursoSeed }, use) => {
      // Lista atividades existentes (pré-condição: curso já tem N atividades
      // — caller deve adicionar antes ou usar fixed-seed com curso pre-povoado).
      const atividades = await withAdminPage(browser, (_p, seed) =>
        seed.listarAtividades(cursoSeed.id),
      );
      const activityIds = atividades.map((a) => a.id);
      if (activityIds.length > 0) {
        await withAdminPage(browser, (_p, seed) =>
          seed.configurarMarcarConcluidoManualmente(cursoSeed.id, activityIds),
        );
      }
      await use({ id: cursoSeed.id, name: cursoSeed.name, activityIds });
    },
    { scope: 'test' },
  ],

  alunoMatriculadoSeed: [
    async ({ browser, cursoSeed }, use, testInfo) => {
      const wi = testInfo.workerIndex;
      const ts = Date.now();
      const alunoEmail = `aluno-mat-w${wi}-${ts}@example.com`;
      const alunoFirstName = 'AlunoSeed';
      const alunoLastName = `W${wi}T${ts}`;
      await withAdminPage(browser, (_p, seed) =>
        seed.matricularAluno({
          contentName: cursoSeed.name,
          alunoEmail,
          alunoFirstName,
          alunoLastName,
        }),
      );
      await use({
        cursoId: cursoSeed.id,
        cursoNome: cursoSeed.name,
        alunoEmail,
        alunoFirstName,
        alunoLastName,
      });
      // Cleanup: desmatricula (curso/aluno são deletados pelos seus próprios cleanups)
      await withAdminPage(browser, (_p, seed) =>
        seed.desmatricularAlunoSafe({ contentName: cursoSeed.name, alunoEmail }),
      );
    },
    { scope: 'test' },
  ],

  alunoComSenhaSeed: [
    async ({ browser, cursoSeed }, use, testInfo) => {
      const wi = testInfo.workerIndex;
      const ts = Date.now();
      const alunoEmail = `aluno-senha-w${wi}-${ts}@example.com`;
      const alunoSenha = 'Senha123!';
      const alunoFirstName = 'AlunoSenha';
      const alunoLastName = `W${wi}T${ts}`;
      await withAdminPage(browser, (_p, seed) =>
        seed.matricularAlunoComSenha({
          contentName: cursoSeed.name,
          alunoEmail,
          alunoFirstName,
          alunoLastName,
          alunoSenha,
        }),
      );
      await use({
        cursoId: cursoSeed.id,
        cursoNome: cursoSeed.name,
        alunoEmail,
        alunoSenha,
        alunoFirstName,
        alunoLastName,
      });
      await withAdminPage(browser, (_p, seed) =>
        seed.desmatricularAlunoSafe({ contentName: cursoSeed.name, alunoEmail }),
      );
    },
    { scope: 'test' },
  ],

  alunoAprovadoSeed: [
    async ({ browser, alunoComSenhaSeed }, use) => {
      // Dispara pipeline completo de completar curso → cert.
      const result = await withAdminPage(browser, async (_p, seed) =>
        seed.completarCursoComoAluno({
          browser,
          cursoId: alunoComSenhaSeed.cursoId,
          alunoEmail: alunoComSenhaSeed.alunoEmail,
          alunoSenha: alunoComSenhaSeed.alunoSenha,
        }),
      );
      await use({
        cursoId: alunoComSenhaSeed.cursoId,
        cursoNome: alunoComSenhaSeed.cursoNome,
        alunoEmail: alunoComSenhaSeed.alunoEmail,
        alunoSenha: alunoComSenhaSeed.alunoSenha,
        attendeeId: result.attendeeId,
        progress: result.progress,
        approvedAt: result.approvedAt,
        certificateId: result.certificate?.certificate_id ?? null,
        certificateLink: result.certificate?.certificate_link ?? null,
      });
      // Cleanup é herdado de alunoComSenhaSeed + cursoSeed.
    },
    { scope: 'test' },
  ],
});

export { expect } from '@playwright/test';
