---
name: roadmap-agent-metrics
description: Design doc — propõe orchestrator emitir métricas estruturadas por execução (planner duration, generator first-pass typecheck rate, healer success rate, fixme emission rate) e skill nova `agent-metrics` agregar histórico. Não é executável — é especificação pra implementação futura. Use quando alguém perguntar "como o agent tá performando?" ou "esse fixme/heal rate tá normal?".
version: 0.1.0-design
---

# roadmap-agent-metrics (DESIGN, não-implementado)

Especificação pra dar **observabilidade** ao próprio agent-playwright.
Hoje cada projeto começa cego — o time não tem como responder
quantitativamente "isso tá funcionando bem?".

## Status

🟡 **Design aprovado, implementação pendente**. Conversado em 2026-05-08
com o user. Item #3 do roadmap "reformas de agente" da branch
`chore/agentes-qa-overhaul`.

## Problema (estado atual)

Sem métricas estruturadas, ninguém consegue responder:

- "Quanto tempo o planner gasta por testcase em média?" → ninguém sabe
- "% de specs gerados que passam typecheck na primeira tentativa?" → ninguém sabe
- "Quantos `test.fixme(true, ...)` saem por geração? Tá subindo ou estável?" → ninguém sabe
- "Healer, quando dispara, conserta na primeira tentativa em que % dos casos?" → ninguém sabe
- "Recon stale (com cache implementado, ver #2) quantas vezes prejudicou um plan?" → ninguém sabe

Decisões hoje são por **memória de QA sênior**. Funciona até dois projetos;
escala mal.

## Proposta

### 1. Orchestrator emite `metrics.json` por execução

Cada `npm run agent:run` ou `agent:regression` cria:

```
outputs/<slug>/metrics/<runId>.json
```

`<runId>` = ISO timestamp + random short hex (ex: `20260508T1430-a1b2`).

Schema:

```jsonc
{
  "runId": "20260508T1430-a1b2",
  "startedAt": "2026-05-08T14:30:00Z",
  "completedAt": "2026-05-08T14:45:32Z",
  "mode": "per-suite" | "regression",
  "scope": {
    "project": "widgets",
    "suite": "Listagem de painéis"          // null se regressivo
  },
  "phases": [
    {
      "phase": "preflight",
      "durationMs": 8200,
      "status": "passed" | "failed" | "skipped",
      "details": {}
    },
    {
      "phase": "parse",
      "durationMs": 1200,
      "testsuitesFound": 14,
      "testcasesFound": 87
    },
    {
      "phase": "recon",
      "durationMs": 23400,
      "cacheHit": false,                     // requer #2 implementado
      "testIdsFound": 42
    },
    {
      "phase": "plan",
      "durationMs": 412000,                  // somatório de N invocações do planner
      "perTestcase": [
        { "testcase": "Acessar listagem", "durationMs": 18000, "status": "ok" },
        { "testcase": "Ordenar por nome", "durationMs": 21000, "status": "ambiguous", "revisarMarkers": 1 }
      ]
    },
    {
      "phase": "generate",
      "durationMs": 380000,
      "perTestcase": [
        { "testcase": "Acessar listagem", "fileWritten": "tests/features/.../acessar-listagem.spec.ts",
          "typecheckFirstPass": true, "fixmeEmitted": false, "linesGenerated": 64 }
      ],
      "fixmeRate": 0.14,                     // 1 / 7 testcases
      "typecheckFirstPassRate": 1.0
    },
    {
      "phase": "execute",
      "durationMs": 156000,
      "passed": 5,
      "failed": 2,
      "fixmeSkipped": 1,
      "exploratoryFindings": {
        "consoleErrors": 3,
        "http5xx": 0,
        "axeViolations": 1,
        "brokenImages": 0
      }
    },
    {
      "phase": "validate",
      "durationMs": 4200
    },
    {
      "phase": "report",
      "durationMs": 12000,
      "reportPath": "outputs/widgets/reports/listagem-de-paineis_20260508T1430"
    },
    {
      "phase": "heal",
      "durationMs": 67000,
      "specsAttempted": 2,
      "validatorPassed": 1,                  // requer #1 implementado
      "validatorBlocked": 0,
      "validatorNeedsReview": 1,
      "humanAcceptedAfterReview": 1
    },
    {
      "phase": "post-heal-pr",
      "status": "skipped",                   // GitHub MCP não ativo
      "reason": "github_mcp_not_active"
    }
  ],
  "totals": {
    "durationMs": 935000,
    "humanInterventions": 1,                 // contagem de "needs_review" + falhas que pediram input
    "exitCode": 0
  },
  "agentVersion": {
    "playwrightTestPlugin": "1.50.0",
    "twygoOrchestratorSkill": "1.0.0",
    "agentPlaywright": "<git-sha-curto>"
  }
}
```

### 2. Skill nova `agent-metrics`

`.claude/skills/agent-metrics/SKILL.md` + opcional `aggregator.ts`.

Comandos:

```bash
# Lista runs recentes
npm run agent:metrics -- --project widgets --last 10

# Sumário agregado das últimas N execuções
npm run agent:metrics -- --project widgets --since 30d

# Trend de uma métrica específica
npm run agent:metrics -- --metric typecheckFirstPassRate --since 90d

# Comparação entre projetos
npm run agent:metrics -- --compare widgets,kit-de-marca,creditos-fase-02
```

Saída: tabela ASCII no terminal + opcionalmente HTML em
`outputs/<slug>/metrics/summary.html`.

### 3. Métricas-chave (KPIs do agent)

Listadas em ordem de prioridade pra dashboard inicial:

| Métrica | O que captura | Sinal de problema |
|---|---|---|
| `typecheckFirstPassRate` | % de specs gerados que passam typecheck sem retry | <80% → generator está chutando tipos |
| `fixmeEmissionRate` | `test.fixme(true,)` emitidos / total de testcases | >20% → recon raso ou XML com pré-condições impossíveis |
| `healValidatorBlockedRate` | hunks bloqueados pelo `validar-heal-diff` / hunks totais | >5% → healer drift; checar prompt do healer |
| `plannerMsPerTestcase` | tempo médio do planner por testcase | tendência subindo → recon stale ou UI mais complexa |
| `humanInterventionRate` | execuções com `humanInterventions > 0` / total | >50% → orquestração pediu mais ajuda do que devia |

### 4. Onde os dados são consumidos

1. **Dashboard local**: `npm run agent:metrics -- --since 30d` no terminal antes de iniciar projeto novo.
2. **CI**: workflow que roda mensalmente e abre issue se algum KPI piorou >20% MoM.
3. **Pré-projeto checklist**: ler trend antes de promessas de timing.

## Migração

1. Schema acima como `src/types/metrics.ts`.
2. Orchestrator instrumenta cada Etapa com timing wrapper:
   ```ts
   const t0 = performance.now();
   const result = await runPhase(...);
   metrics.phases.push({
     phase: 'plan',
     durationMs: performance.now() - t0,
     ...result.metricsContribution,
   });
   ```
3. No fim, escreve `metrics.json` antes de exit.
4. `agent-metrics/aggregator.ts` lê `outputs/*/metrics/*.json` e agrega.

## Trade-offs

| Pro | Contra |
|---|---|
| Decisões baseadas em dado, não intuição | Esforço inicial: ~6-8h (instrumentação + skill nova) |
| Detecta regressão do próprio agent (drift do generator, healer piorando) | Mais 1 fonte de complexidade pra manter |
| Justifica investimentos (ex: "pq mexer no recon?" → "porque plannerMsPerTestcase subiu 40%") | Sem CI/dashboard externo, tabela no terminal pode virar coisa que ninguém olha |

## Não-objetivos

- **Não** enviar métricas pra serviço externo (Datadog, etc) — fica
  sempre local. Privacidade + simplicidade.
- **Não** persistir corpo de prompt nem conteúdo de spec — só métricas
  agregadas (tempo, tamanho, contagens).
- **Não** instrumentar testes individuais — Playwright já faz isso. Foco
  é o **agent** (planner/generator/healer/orchestrator), não a suite.

## Quando implementar

Sugestão: depois de #1 (heal-validator) E #2 (recon-cache). Métricas
ganham valor quando há comportamento estável pra medir — instrumentar um
sistema que ainda muda toda semana só gera ruído.

## Quem implementa

Idealmente um pair: 1 dev TS pra instrumentação no orchestrator + 1 QA
pra definir KPIs e formato de output. Tempo estimado: 6-8h.

## Referências

- `.claude/skills/twygo-test-orchestrator/orchestrator.ts` — onde a
  instrumentação entra
- `.claude/skills/twygo-test-orchestrator/SKILL.md` — fluxo das 9 fases
  (cada uma vira uma entrada em `phases[]`)
- `src/utils/logger.ts` — pode ser estendido pra emit também métricas
- Roadmap items #1 (heal-validator) e #2 (recon-cache) — esta skill
  consome métricas geradas por eles
