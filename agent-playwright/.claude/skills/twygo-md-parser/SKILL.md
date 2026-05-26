---
name: twygo-md-parser
description: Lê o MD canônico (test-analysis.md) produzido pelo agent-at v1+ e produz um JSON estruturado consumível pelo twygo-test-orchestrator. Substitui (com coexistência) o twygo-xml-parser. Schema do MD definido em CONTRACT.md §4. Output JSON inclui campos extras (executor, playbooks, org, catálogos) que o XML legado não tem.
version: 1.0.0
---

# twygo-md-parser

## Quando usar

Sempre que o agente recebe um arquivo MD canônico (gerado pelo agent-at v1+,
seguindo CONTRACT.md §4) e precisa convertê-lo para JSON consumível pelo
orquestrador (`twygo-test-orchestrator` — Fase 4).

A partir do CONTRACT.md v1 (2026-05-18), o MD é o **formato preferencial**
de entrada. O parser XML legado (`twygo-xml-parser`) permanece como fallback
para projetos antigos durante a migração — sem flag-day.

## Como é invocado

Em ordem de preferência:

1. **Dispatcher unificado**: `npm run agent:parse` (detecta `.md` ou `.xml`
   automaticamente e delega — recomendado).
2. **Explícito**: `npm run agent:parse-md` (força uso deste parser).
3. **Programático**: `import { parseCanonicalMd } from './parser.js'`.

## Formato do MD esperado

Estrutura completa em [CONTRACT.md §4](../../../../CONTRACT.md). Resumo:

```markdown
---
contract_version: 1.0
at_version: 1
project: <slug>
project_name: "..."
generated_at: <ISO-8601>
env: <slug-env-principal>
env_secondary: <slug-env-secundario>      # opcional
totals: { suites, test_cases, steps }
---

# Análise de Teste — ...

## Dados de teste            # catálogo opcional
## Textos literais           # catálogo opcional
## Modais relevantes         # catálogo opcional
## Endpoints (referência)    # catálogo opcional
## Campos e validações       # catálogo opcional

---

---
suite: <Nome da Suíte>
executor: playwright          # playwright | api | db | pentest
org: principal                # opcional — chave simbólica
playbooks: [...]              # opcional — slugs canônicos
preconditions:
  - ...
---

# <Nome da Suíte>

## TC1 — <Título>
**Prioridade**: critical | high | medium | low
**Tipo**: ui | api | db | mixed
**Playbooks adicionais**: []

### Objetivo
...

### Passos
1. <ação com verbo canônico + nome literal>
   → <resultado assertável>
2. ...
```

## Saída

`outputs/<slug>/test-analysis.parsed.json` com a forma:

```jsonc
{
  "rootSuite": {
    "name": "",
    "testCases": [],
    "childSuites": [
      {
        "name": "<Nome da Suíte>",
        "testCases": [
          {
            "name": "<Título do TC>",
            "summary": "<Objetivo>",
            "preconditions": "<Pré-condições da suíte, juntadas em prosa>",
            "executionType": 1 | 2,    // 2 = automated (ui/api/db); 1 = manual (mixed/ausente)
            "importance": 1 | 2 | 3,    // mapeado de low/medium-high/critical
            "steps": [
              { "stepNumber": 1, "actions": "...", "expectedResults": "...", "executionType": ... }
            ],
            "priority": "critical" | "high" | "medium" | "low",  // ←  extra do MD
            "type": "ui" | "api" | "db" | "mixed",              // ← extra
            "playbooksAdicionais": [...]                          // ← extra
          }
        ],
        "childSuites": [],
        "executor": "playwright" | "api" | "db" | "pentest",   // ← extra do MD
        "org": "principal" | "secundario" | ...,                // ← extra
        "playbooks": [...],                                      // ← extra
        "preconditionsList": [...]                               // ← extra (lista original)
      }
    ]
  },
  "totals": { "suites": N, "testCases": N, "steps": N },
  "projectFrontmatter": { ... },     // ← extra do MD
  "catalogs": {                       // ← extra do MD
    "dados_de_teste": "...",
    "textos_literais": "...",
    "modais_relevantes": "...",
    "endpoints": "...",
    "campos_e_validacoes": "..."
  }
}
```

Campos extras são `undefined` quando o input foi XML (parser XML não os
produz). Orchestrator trata isso — tagging de playbooks fica disponível
apenas em projetos com MD canônico.

## Mapeamento de prioridade

| MD `**Prioridade**` | `importance` (compatível com XML TestLink) |
|---|---|
| `critical` | 3 |
| `high` | 2 |
| `medium` | 2 |
| `low` | 1 |

## Mapeamento de execution_type

| MD `**Tipo**` | `executionType` |
|---|---|
| `ui` / `api` / `db` | 2 (Automated) |
| `mixed` / ausente | 1 (Manual) |

## Validações

- Frontmatter de projeto: campos obrigatórios `contract_version`, `at_version`,
  `project`, `project_name`, `generated_at`, `env`.
- Cada suíte: campos obrigatórios `suite`, `executor`, `preconditions`.
- Cada TC: header válido `## TC<N> — <título>`, com `### Objetivo` e
  `### Passos`.
- Cada passo: formato `N. <ação>\n   → <resultado>`.
- Falha rápida e explícita se schema violado.

## Coexistência com twygo-xml-parser

| Aspecto | MD parser (este) | XML parser (legado) |
|---|---|---|
| Input | `.md` canônico | `.xml` TestLink |
| Schema output | `ParsedAnalysis` compatível (com extras) | `ParsedAnalysis` (sem extras) |
| Status | Ativo (preferencial v1+) | Mantido (fallback) |
| Quando usar | Projetos novos / AT regerada pelo agent-at v1+ | Projetos pré-2026-05-18 que ainda não migraram |

## Dependências

- `yaml@^2.5.0` — parsing de frontmatter (adicionado ao `package.json` em 2026-05-19)
- Reusa helpers de `src/utils/environment.ts` e `src/utils/logger.ts`

## Limitações conhecidas

- Não suporta suítes aninhadas no MD (CONTRACT.md v1 é flat — todas as
  suítes são filhas diretas da raiz). Quando o roadmap V2/V3 introduzir
  sub-suítes, o parser precisará suportar nesting.
- Catálogos são preservados como string crua (não estruturados em sub-objetos).
  Consumidores que precisam de parsing fino (ex: extrair tabela de textos
  literais) fazem isso por conta própria.
