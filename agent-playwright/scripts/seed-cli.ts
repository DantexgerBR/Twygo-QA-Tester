/**
 * CLI de provisionamento de dados de seed sob demanda — cross-projeto Twygo
 * (F3 recorte 2 do `twygo-qa-ui`: "provisionar dados de teste via UI admin").
 *
 * Script plano (sem test-runner), mesmo padrão de `cleanup-env-orphans.ts`:
 * um `SeedAdminPageBase` reusado pra todas as chamadas (cada método já garante
 * o próprio perfil Administrador via `ensureAdminProfile()`). Diferente das
 * fixtures de `seed-fixtures-base.ts` (sempre fazem cleanup automático no
 * `afterAll`), este script **persiste** o que cria até um `--cleanup` explícito
 * apagar — é o que permite o QA provisionar dado antes de rodar/explorar uma
 * suíte sem precisar de um teste pra isso.
 *
 * Uso:
 *   npx tsx scripts/seed-cli.ts --project <slug> --kind <tipo> --qty N
 *   npx tsx scripts/seed-cli.ts --project <slug> --cleanup --kind <tipo> --id <entityId> [--email ...] [--content-name ...]
 *
 * Saída: banners `PREFIXO {json}` em stdout (via logger) — o `twygo-qa-ui`
 * parseia `SEED_ITEM_START`/`SEED_ITEM_DONE`/`SEED_ITEM_ERROR`/
 * `SEED_CLEANUP_DONE`/`SEED_CLEANUP_ERROR`. JSON depois do prefixo (não
 * `key=value`) porque nome/email de seed têm espaço.
 */
import { parseArgs } from 'node:util';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { chromium } from '@playwright/test';
import type { Browser } from '@playwright/test';
import { createLogger } from '../src/utils/logger.js';
import { getBaseUrl, getProjectSlug } from '../src/utils/environment.js';
import { SeedAdminPageBase } from '../src/pages/SeedAdminPageBase.js';

const log = createLogger('seed-cli');
const STORAGE_PATH = resolve(process.cwd(), 'outputs/.auth/storage.json');

// Enum fechado — cursoComAtividadesMarcaveisSeed FICA FORA: via CLI o curso é
// sempre novo/vazio, então esse tipo seria um no-op garantido (0 atividades
// pra configurar). Reavaliar quando existir um createAtividade* real.
export const SEED_KINDS = [
  'cursoSeed',
  'trilhaSeed',
  'cursoLiberadoSeed',
  'alunoMatriculadoSeed',
  'alunoComSenhaSeed',
  'alunoAprovadoSeed',
] as const;
export type SeedKind = (typeof SEED_KINDS)[number];

function isSeedKind(v: string | undefined): v is SeedKind {
  return !!v && (SEED_KINDS as readonly string[]).includes(v);
}

function emit(type: string, payload: Record<string, unknown>): void {
  log.info(`${type} ${JSON.stringify(payload)}`);
}

type Flags = {
  kind?: string;
  qty: number;
  project?: string;
  cleanup: boolean;
  id?: string;
  email?: string;
  contentName?: string;
};

function parseFlags(): Flags {
  const { values } = parseArgs({
    options: {
      kind: { type: 'string' },
      qty: { type: 'string', default: '1' },
      project: { type: 'string' },
      cleanup: { type: 'boolean', default: false },
      id: { type: 'string' },
      email: { type: 'string' },
      'content-name': { type: 'string' },
    },
    strict: false,
  });
  return {
    kind: values.kind as string | undefined,
    qty: parseInt((values.qty as string) || '1', 10) || 1,
    project: values.project as string | undefined,
    cleanup: Boolean(values.cleanup),
    id: values.id as string | undefined,
    email: values.email as string | undefined,
    contentName: values['content-name'] as string | undefined,
  };
}

type SeedError = Error & { partialId?: number };

/** Tenta deletar o curso/trilha parcialmente criado antes de reportar erro (evita órfão sem registro). */
async function attemptCleanupPartial(
  seed: SeedAdminPageBase,
  kind: SeedKind,
  entityId: number,
): Promise<string | null> {
  try {
    if (kind === 'trilhaSeed') {
      await seed.deleteTrilhaByIdSafe(entityId);
    } else {
      await seed.deleteCursoByIdSafe(entityId);
    }
    return null;
  } catch (err) {
    return (err as Error).message;
  }
}

/** Cria 1 item do tipo `kind`. `idx` entra no sufixo do nome/email — evita colisão em qty>1 no mesmo ms. */
async function createOne(
  seed: SeedAdminPageBase,
  browser: Browser,
  kind: SeedKind,
  idx: number,
): Promise<Record<string, unknown>> {
  const suffix = `seed-${idx}-${Date.now()}`;
  const name = `${kind === 'trilhaSeed' ? 'Trilha' : 'Curso'} Seed ${suffix}`;
  let entityId: number | undefined;
  try {
    switch (kind) {
      case 'cursoSeed': {
        entityId = await seed.createCurso({ name });
        return { id: entityId, name };
      }
      case 'trilhaSeed': {
        entityId = await seed.createTrilha({ name });
        return { id: entityId, name };
      }
      case 'cursoLiberadoSeed': {
        entityId = await seed.createCurso({ name });
        await seed.publicarCurso(entityId);
        return { id: entityId, name };
      }
      case 'alunoMatriculadoSeed': {
        entityId = await seed.createCurso({ name });
        const alunoEmail = `aluno-${suffix}@example.com`;
        const alunoFirstName = 'AlunoSeed';
        const alunoLastName = suffix;
        await seed.matricularAluno({ contentName: name, alunoEmail, alunoFirstName, alunoLastName });
        return { id: entityId, name, alunoEmail, alunoFirstName, alunoLastName };
      }
      case 'alunoComSenhaSeed': {
        entityId = await seed.createCurso({ name });
        const alunoEmail = `aluno-${suffix}@example.com`;
        const alunoSenha = 'Senha123!';
        const alunoFirstName = 'AlunoSenha';
        const alunoLastName = suffix;
        await seed.matricularAlunoComSenha({
          contentName: name,
          alunoEmail,
          alunoFirstName,
          alunoLastName,
          alunoSenha,
        });
        return { id: entityId, name, alunoEmail, alunoSenha, alunoFirstName, alunoLastName };
      }
      case 'alunoAprovadoSeed': {
        entityId = await seed.createCurso({ name });
        const alunoEmail = `aluno-${suffix}@example.com`;
        const alunoSenha = 'Senha123!';
        await seed.matricularAlunoComSenha({
          contentName: name,
          alunoEmail,
          alunoFirstName: 'AlunoAprovado',
          alunoLastName: suffix,
          alunoSenha,
        });
        // baseURL EXPLÍCITO: sem isso, completarCursoComoAluno cai no fallback
        // hardcoded de Recertificação (SeedAdminPageBase.ts, ~linha 1260) —
        // errado pra qualquer outro projeto. Nunca confiar no default aqui.
        const result = await seed.completarCursoComoAluno({
          browser,
          cursoId: entityId,
          alunoEmail,
          alunoSenha,
          baseURL: getBaseUrl(),
        });
        return {
          id: entityId,
          name,
          alunoEmail,
          alunoSenha,
          attendeeId: result.attendeeId,
          progress: result.progress,
          approvedAt: result.approvedAt,
          certificateId: result.certificate?.certificate_id ?? null,
          certificateLink: result.certificate?.certificate_link ?? null,
        };
      }
    }
  } catch (err) {
    if (entityId === undefined) throw err; // nada foi criado ainda — nada pra limpar
    const cleanupErr = await attemptCleanupPartial(seed, kind, entityId);
    const wrapped: SeedError = new Error(
      cleanupErr
        ? `${(err as Error).message} — falha ao limpar o que já foi criado (${cleanupErr})`
        : `${(err as Error).message} — o que já tinha sido criado (id ${entityId}) foi limpo`,
    );
    if (cleanupErr) wrapped.partialId = entityId;
    throw wrapped;
  }
  throw new Error(`kind desconhecido: ${kind}`);
}

async function cleanupOne(
  seed: SeedAdminPageBase,
  kind: SeedKind,
  id: number,
  extra: { email?: string; contentName?: string },
): Promise<void> {
  const isAlunoKind =
    kind === 'alunoMatriculadoSeed' || kind === 'alunoComSenhaSeed' || kind === 'alunoAprovadoSeed';
  if (isAlunoKind && extra.contentName && extra.email) {
    // Idempotente (*_safe) — mesma ordem das fixtures: desmatricula antes de apagar o curso.
    await seed.desmatricularAlunoSafe({ contentName: extra.contentName, alunoEmail: extra.email });
  }
  if (kind === 'trilhaSeed') {
    await seed.deleteTrilhaByIdSafe(id);
  } else {
    await seed.deleteCursoByIdSafe(id);
  }
}

async function main(): Promise<void> {
  const args = parseFlags();
  if (!args.project) {
    emit('SEED_ITEM_ERROR', { kind: args.kind || '', message: '--project obrigatório' });
    process.exit(1);
  }
  getProjectSlug(args.project); // cacheia o slug pra getOrgId()/getBaseUrl() resolverem o profile certo do projeto

  if (!existsSync(STORAGE_PATH)) {
    emit(args.cleanup ? 'SEED_CLEANUP_ERROR' : 'SEED_ITEM_ERROR', {
      kind: args.kind || '',
      message: `Sessão não encontrada (${STORAGE_PATH}). Rode "npm run agent:smoke" antes de provisionar.`,
    });
    process.exit(1);
  }

  if (!isSeedKind(args.kind)) {
    emit(args.cleanup ? 'SEED_CLEANUP_ERROR' : 'SEED_ITEM_ERROR', {
      kind: args.kind || '',
      message: `kind desconhecido ou ausente — use um de: ${SEED_KINDS.join(', ')}`,
    });
    process.exit(1);
  }
  const kind = args.kind;

  const browser = await chromium.launch({ headless: true });
  // baseURL explícito: fora do test-runner, `page.goto('/relativo')` (o que `safeGoto`
  // faz por dentro) não tem contexto pra resolver — precisa do baseURL na criação
  // do context (playwright.config.ts injeta isso automaticamente só via test-runner).
  const ctx = await browser.newContext({ storageState: STORAGE_PATH, baseURL: getBaseUrl() });
  const page = await ctx.newPage();
  const seed = new SeedAdminPageBase(page);
  try {
    if (args.cleanup) {
      const id = Number(args.id);
      if (!Number.isFinite(id)) {
        emit('SEED_CLEANUP_ERROR', { kind, message: '--id obrigatório e numérico' });
        process.exit(1);
      }
      try {
        await cleanupOne(seed, kind, id, { email: args.email, contentName: args.contentName });
        emit('SEED_CLEANUP_DONE', { kind, id });
      } catch (err) {
        emit('SEED_CLEANUP_ERROR', { kind, id, message: (err as Error).message });
        process.exitCode = 1;
      }
      return;
    }

    const qty = Math.max(1, args.qty);
    for (let idx = 1; idx <= qty; idx++) {
      emit('SEED_ITEM_START', { kind, idx, total: qty });
      try {
        const details = await createOne(seed, browser, kind, idx);
        emit('SEED_ITEM_DONE', { kind, id: details.id, details });
      } catch (err) {
        const partialId = (err as SeedError).partialId;
        emit('SEED_ITEM_ERROR', {
          kind,
          message: (err as Error).message,
          ...(partialId !== undefined ? { partialId } : {}),
        });
        process.exitCode = 1;
      }
    }
  } finally {
    await ctx.close();
    await browser.close();
  }
}

main().catch((err) => {
  log.error('Falha na seed-cli', err);
  process.exit(1);
});
