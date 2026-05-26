/**
 * Schema das métricas estruturadas emitidas pelo orchestrator por execução.
 *
 * Origem: design `roadmap-agent-metrics` (`.claude/skills/roadmap-agent-metrics/SKILL.md`).
 * Consumido por `.claude/skills/agent-metrics/aggregator.ts`.
 *
 * IMPORTANTE — o que é mensurável vs. o que não é a partir do orchestrator:
 *
 * O orchestrator (`twygo-test-orchestrator/orchestrator.ts`) dispara cada fase
 * via subprocesso (`runShell`) e mede a duração desses subprocessos. Mas as
 * fases `plan` e `generate` do design NÃO rodam dentro deste processo — são
 * executadas pelos subagents interativos do plugin Playwright
 * (`playwright-test-planner` / `playwright-test-generator`) em sessão Claude
 * separada. Logo, `plannerMsPerTestcase` e `typecheckFirstPassRate` não têm como
 * ser medidos aqui: ficam `null` com nota em `_meta.notes`.
 *
 * Métricas DERIVADAS do `test-results.json` (gravado pelo Playwright reporter):
 * contagem de passed/failed/skipped e `fixmeRate` (proporção de testcases com
 * annotation `fixme` no resultado final — NÃO é "fixme emission do generator",
 * que exigiria instrumentar o generator).
 */

export type RunMode = 'per-suite' | 'all-suites' | 'regression';

export type PhaseStatus = 'passed' | 'failed' | 'skipped';

/** Nomes canônicos das fases instrumentáveis pelo orchestrator. */
export type PhaseName =
  | 'preflight'
  | 'execute'
  | 'validate'
  | 'bug-reports'
  | 'report'
  | 'triage';

export type PhaseEntry = {
  phase: PhaseName;
  /** Duração em ms (medida via `performance.now()` em volta do subprocesso). */
  durationMs: number;
  status: PhaseStatus;
  /** Código de saída do subprocesso, quando aplicável. */
  exitCode?: number;
  /** Métricas específicas da fase, quando deriváveis (ex: contagens de execute). */
  details?: Record<string, unknown>;
};

/** Contagens derivadas do `test-results.json` para a fase `execute`. */
export type ExecuteDetails = {
  passed: number;
  failed: number;
  /** Tests com status `skipped` que têm annotation `fixme`. */
  fixmeSkipped: number;
  /** Demais `skipped` (skip/manual). */
  otherSkipped: number;
  total: number;
};

/** KPIs do agente — derivados quando possível, `null` quando não-mensurável. */
export type RunKpis = {
  /**
   * Proporção de testcases com `test.fixme` no resultado final
   * (`fixmeSkipped / total`). Aproxima a "fixme emission rate" do design — a
   * métrica exata exigiria instrumentar o generator, fora deste processo.
   */
  fixmeRate: number | null;
  /**
   * % de specs que passam typecheck na 1ª geração. NÃO mensurável aqui — o
   * generator roda em sessão interativa de subagent. Sempre `null`.
   */
  typecheckFirstPassRate: number | null;
  /**
   * Hunks bloqueados pelo `validar-heal-diff` / hunks totais. NÃO mensurável
   * aqui — o heal roda em sessão interativa de subagent. Sempre `null`.
   */
  healValidatorBlockedRate: number | null;
  /**
   * Tempo médio do planner por testcase. NÃO mensurável aqui — o planner roda
   * em sessão interativa de subagent. Sempre `null`.
   */
  plannerMsPerTestcase: number | null;
  /**
   * 1 se a execução teve intervenção humana (`humanInterventions > 0`), 0 caso
   * contrário. Por execução é binário; o trend (`humanInterventionRate`) é
   * agregado pelo aggregator como média entre execuções.
   */
  humanInterventionRate: number | null;
};

export type RunMetrics = {
  runId: string;
  startedAt: string;
  completedAt: string;
  mode: RunMode;
  scope: {
    project: string;
    /** `null` em modo regressivo/all-suites (não há suite única). */
    suite: string | null;
  };
  phases: PhaseEntry[];
  totals: {
    durationMs: number;
    /** Falhas/abortos que exigiram (ou exigiriam) input humano nesta execução. */
    humanInterventions: number;
    exitCode: number;
  };
  kpis: RunKpis;
  agentVersion: {
    twygoTestAgent: string;
  };
  _meta: {
    /** Notas sobre campos `null` / decisões de mensurabilidade. */
    notes: string[];
  };
};
