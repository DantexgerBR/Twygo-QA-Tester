---
name: twygo-exploratory-validator
description: Agrega findings exploratórios da execução Playwright (console errors, HTTP 4xx/5xx, broken images, violations a11y axe-core, snapshot de elementos interativos) por testsuite. Em modo regressivo, exporta também attachments Allure-compatíveis.
when_to_use: |
  - Pós-execução Playwright, antes de gerar relatório final
  - Consolidar `outputs/exploratory/*.json` em `exploratory-findings.json`
  - Modo regressivo precisa exportar attachments Allure-compatíveis
triggers:
  - "exploratory-findings.json"
  - "agent:validate-exploratory"
  - "console errors"
  - "broken images"
  - "axe-core"
  - "a11y violations"
  - "fixture exploratória"
version: 2.0.0
---

# twygo-exploratory-validator

## Quando usar

Após a execução do Playwright (`agent:run`), antes de gerar o relatório final.
Os probes exploratórios são plugados automaticamente nos specs gerados via a
fixture `src/fixtures/exploratory-fixture.ts` — cada teste grava um arquivo
`outputs/exploratory/{suite}__{teste}__w{worker}.json` com seus findings. Esta
skill consolida todos eles em `outputs/exploratory-findings.json` e imprime um
sumário por suíte.

## Entradas

- Diretório `outputs/exploratory/` (criado pela fixture durante a execução).
- `outputs/test-analysis.parsed.json` (do `twygo-xml-parser`) — usado para
  calcular cobertura: quantos locators a suíte exercitou vs. quantos
  elementos interativos foram observados nas páginas visitadas.
- `projects/<slug>/project.config.json` (campo `exploratory`).

## Saída

- `outputs/exploratory-findings.json` com a estrutura:
  ```json
  {
    "generatedAt": "ISO-8601",
    "summary": { "errors": N, "warnings": N, "info": N, "suites": N, "tests": N },
    "suites": [
      {
        "name": "Autenticação de Usuários",
        "totals": { "errors": 0, "warnings": 1, "info": 3 },
        "findings": [ { "kind": "...", "severity": "...", "url": "...", "message": "..." } ],
        "coverage": [
          {
            "url": "https://app.twygo.com/login",
            "totalInteractive": 12,
            "visibleInteractive": 9,
            "exercisedByScript": 4,
            "coverageRatio": 0.44,
            "untouchedSamples": [ { "role": "button", "name": "Esqueci minha senha" } ]
          }
        ]
      }
    ]
  }
  ```

## Severidades

| Kind                  | Severity default | Significado                                       |
|-----------------------|------------------|---------------------------------------------------|
| `console_error`       | `error`          | Erro logado no console do browser                 |
| `page_error`          | `error`          | Exceção JS não capturada                          |
| `http_error` (5xx)    | `error`          | Resposta HTTP server-side                         |
| `http_error` (4xx)    | `warn`           | Resposta HTTP client-side                         |
| `broken_image`        | `warn`           | `<img>` com `naturalWidth === 0`                  |
| `a11y_violation` (critical/serious) | `error` | Violação WCAG detectada pelo axe-core            |
| `a11y_violation` (moderate) | `warn`     | Violação WCAG (impacto moderado)                  |
| `a11y_violation` (minor) | `info`        | Violação WCAG (impacto menor)                     |
| `coverage_snapshot`   | `info`          | Snapshot de elementos interativos por URL         |

## Flags

- `--strict` — exit code `1` se houver findings de severidade `error`.
  Equivale a passar `EXPLORATORY_STRICT=1` na execução do Playwright (que
  promove os mesmos erros a falha do teste). Use `--strict` em CI para que o
  pipeline quebre quando o agente detectar erros silenciosos.
- `--quiet` — não imprime detalhes, apenas o sumário final.

## Regras

1. A skill **não edita** os specs; apenas lê os findings escritos pela fixture.
2. Coverage gap (`coverageRatio < 0.5`) é **info**, nunca falha o build —
   serve como sinal para revisar se faltou cenário no XML.
3. Se `outputs/exploratory/` estiver vazio, a skill não falha: apenas avisa
   que nenhum probe rodou (provavelmente `exploratory.enabled: false`).

## Execução manual

```bash
npm run agent:explore           # gera o JSON consolidado
npm run agent:explore -- --strict   # falha se houver erros
```

## Ordem canônica do fluxo

```
agent:parse  →  agent:generate  →  agent:run  →  agent:explore  →  agent:report
```
