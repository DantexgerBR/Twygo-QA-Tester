---
name: twygo-recon
description: Reconnaissance pass — antes dos planners, faz UMA varredura na área de uma testsuite (login + navegação a partir das pré-condições + dump completo de test-ids/labels/role+name encontrados) e salva em `outputs/<slug>/recon-cache/{slug}.md` (cache regenerável com TTL de 7 dias). Planners consomem esse catálogo e pulam exploração ao vivo, cortando ~70% do tempo de planning.
version: 2.0.0
---

# twygo-recon

## Quando usar

Antes de invocar `playwright-test-planner` para uma nova testsuite. O recon
catalogga test-ids, labels e roles da área (via login + navegação real) em um
único arquivo markdown. Os planners passam a consumir o catálogo + a prosa do
XML, sem precisar redescobrir o DOM 1× por testcase.

## Como invocar

```bash
npm run agent:recon -- --suite "<nome da testsuite>"
```

Ou com URL específica em vez do nome da testsuite:

```bash
npm run agent:recon -- --url "/o/{orgId}/ai_consumption_analysis?tab=settings"
```

## Saída

`outputs/<slug>/recon-cache/{slug-da-suite}.md` — cache regenerável com TTL
(gitignored). Markdown estruturado com:

- **Header de metadados** (bloco `<!-- recon-cache ... -->` no topo):
  `generatedAt`, `suite`, `slug`, `ttlHours`, `twygoBaseUrl` — parseado para
  detecção de staleness.
- **URL canônica** observada
- **Test IDs encontrados** (`data-test-id`) com nome → seletor
- **Roles + names** acessíveis (button "Salvar", textbox "Login", etc)
- **Labels e placeholders** únicos
- **Condições observadas** (sync alert presente? toggle estado inicial?)

Além disso, atualiza `outputs/<slug>/recon-cache/_meta.json` (índice + TTL por
suite). Ver design completo na skill `roadmap-recon-cache`.

## Cache e TTL

- TTL default: **7 dias (168h)**. Configurável em `project.config.json` via
  `"recon": { "ttlHours": 168, "autoRegenerate": false }` (chave opcional).
- **Self-check**: re-rodar com cache fresco pula a varredura (cache hit). Use
  `--force` para regenerar de qualquer forma. Cache stale regenera por padrão;
  use `--use-stale` para mantê-lo.
- **Invalidação manual** (raro, ex: redesign de UI Twygo):
  `npm run agent:recon:clear -- --project <slug>` apaga todo o cache do projeto.

## Regras

1. Reusa storageState do globalSetup — não re-loga.
2. Idempotente — re-rodar regenera o snapshot atual (a menos que cache fresco).
3. NÃO modifica nenhum arquivo fora de `outputs/<slug>/recon-cache/`.
4. Falha se smoke test falhar (chamar pre-flight antes).
