---
name: twygo-recon
description: Reconnaissance pass — antes dos planners, faz UMA varredura na área de uma testsuite (login + navegação a partir das pré-condições + dump completo de test-ids/labels/role+name encontrados) e salva em `inputs/recon-{slug}.md`. Planners consomem esse catálogo e pulam exploração ao vivo, cortando ~70% do tempo de planning.
version: 1.0.0
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

`inputs/recon-{slug-da-suite}.md` — markdown estruturado com seções:

- **URL canônica** observada
- **Test IDs encontrados** (`data-test-id`) com nome → seletor
- **Roles + names** acessíveis (button "Salvar", textbox "Login", etc)
- **Labels e placeholders** únicos
- **Condições observadas** (sync alert presente? toggle estado inicial?)

## Regras

1. Reusa storageState do globalSetup — não re-loga.
2. Idempotente — re-rodar sobrescreve com snapshot atual.
3. NÃO modifica nenhum arquivo fora de `inputs/`.
4. Falha se smoke test falhar (chamar pre-flight antes).
