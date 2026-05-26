---
name: agent-metrics
description: Agrega o histórico de `metrics.json` (1 por execução, emitido pelo twygo-test-orchestrator em outputs/<slug>/metrics/) e mostra trend dos KPIs do agente — durações por fase, fixmeRate, humanInterventionRate, contagens passed/failed. Tabela ASCII no terminal. Use quando alguém perguntar "como o agent tá performando?", "esse fixme rate tá normal?" ou "quanto tempo a execução tá levando ultimamente?".
version: 1.0.0
---

# agent-metrics

Skill de **observabilidade** do próprio agent-playwright. Lê os `metrics.json`
emitidos pelo `twygo-test-orchestrator` por execução e agrega o histórico em
tabela ASCII no terminal.

Implementa a parte de agregação do design
[`roadmap-agent-metrics`](../roadmap-agent-metrics/SKILL.md). A parte de
emissão vive no orchestrator (`MetricsCollector` em
`twygo-test-orchestrator/metrics.ts`) + schema em `src/types/metrics.ts`.

## De onde vêm os dados

Cada `npm run agent:run` / `agent:regression` grava
`outputs/<slug>/metrics/<runId>.json` (gitignored — intermediário regenerável).
`<runId>` = `YYYYMMDDTHHmm-<hex4>` (ex: `20260508T1430-a1b2`).

Schema completo em `src/types/metrics.ts`. Campos-chave por execução:

- `phases[]` — duração + status de cada fase instrumentável (`preflight`,
  `execute`, `validate`, `bug-reports`, `report`, `triage`).
- `phases[execute].details` — `passed` / `failed` / `fixmeSkipped` derivados do
  `test-results.json`.
- `kpis.fixmeRate` — proporção de testcases com `test.fixme` no resultado final.
- `kpis.humanInterventionRate` — 1 se a execução teve intervenção, 0 senão.
- `totals.durationMs` / `totals.exitCode`.

> **Não mensurável a partir do orchestrator**: `plannerMsPerTestcase`,
> `typecheckFirstPassRate`, `healValidatorBlockedRate`. Essas fases (plan /
> generate / heal) rodam em sessões interativas dos subagents do plugin
> Playwright, fora do processo do orchestrator. Ficam `null` no JSON com nota
> em `_meta.notes`, e o aggregator as ignora no cálculo de média (só agrega o
> que existe). Ver comentário de cabeçalho em `src/types/metrics.ts`.

## Comandos

```bash
# Lista as últimas N execuções (1 linha cada) de um projeto
npm run agent:metrics -- --project widgets --last 10

# Sumário agregado das execuções dos últimos 30 dias
npm run agent:metrics -- --project widgets --since 30d

# Trend de uma métrica específica ao longo do tempo
npm run agent:metrics -- --project widgets --metric fixmeRate --since 90d

# Comparação entre projetos (1 linha agregada por projeto)
npm run agent:metrics -- --compare widgets,kit-de-marca,creditos-fase-02
```

Sem `--project` nem `--compare`, usa o projeto resolvido por `getProjectSlug()`
(env `PROJECT` ou auto-detect quando há 1 só em `projects/`).

### Flags

| Flag | Efeito |
|---|---|
| `--project <slug>` | Projeto a inspecionar (default: `getProjectSlug()`) |
| `--last <N>` | Mostra as N execuções mais recentes, 1 linha cada |
| `--since <Nd>` | Filtra execuções dos últimos N dias (ex: `30d`) e agrega |
| `--metric <nome>` | Trend de UMA métrica (`fixmeRate`, `durationMs`, `passed`, `failed`, `humanInterventionRate`, ou nome de fase para sua duração) |
| `--compare a,b,c` | 1 linha agregada por projeto, lado a lado |

Default (sem `--last`/`--metric`/`--compare`): sumário agregado de todas as
runs do projeto.

## Métricas-chave (KPIs do agente)

| Métrica | O que captura | Sinal de problema |
|---|---|---|
| `fixmeRate` | testcases com `test.fixme` / total | >20% → recon raso ou pré-condições impossíveis no MD/XML |
| `humanInterventionRate` | execuções com intervenção / total | >50% → orquestração pediu mais ajuda do que devia |
| `durationMs` (totals) | tempo total por execução | tendência subindo → UI mais complexa, recon stale ou suite cresceu |
| `execute.failed` | falhas por execução | subindo → regressão de produto ou specs frágeis |

## Saída

Tabela ASCII no terminal (sem HTML — o design diz que HTML é opcional). Cada
modo imprime um bloco enquadrado por linhas `─`. Valores `null` aparecem como
`—` (não-mensurável) e são ignorados nas médias.

## Não-objetivos

- Não envia métricas para serviço externo (fica sempre local).
- Não persiste corpo de prompt nem conteúdo de spec — só contagens/tempos.
- Não instrumenta testes individuais (o Playwright já faz isso) — foco é o
  **agent** (orchestrator + fases).
