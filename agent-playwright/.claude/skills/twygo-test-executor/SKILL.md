---
name: twygo-test-executor
description: Transforma o JSON do twygo-xml-parser em Page Objects e specs Playwright, e (opcionalmente) dispara a execução via Playwright CLI.
version: 1.0.0
---

# twygo-test-executor

## Responsabilidade

1. Ler `outputs/test-analysis.parsed.json`.
2. Para cada `target` único identificado nos passos, criar/atualizar um Page Object em `src/pages/`.
3. Para cada cenário, gerar um `*.spec.ts` em `tests/features/`.
4. Rodar `npx playwright test` (a menos que `--generate-only` seja passado).

## Entradas

- `outputs/test-analysis.parsed.json` (do `twygo-xml-parser`).
- `templates/page-object-template.ts` e `templates/test-template.ts`.
- `config/project.config.json` (respeita `overwriteExistingPages` e `overwriteExistingTests`).

## Flags

- `--generate-only` — apenas gera arquivos, não executa testes.
- `--dry-run` — mostra o que seria gerado, sem escrever.

## Mapa ação → Playwright

Ver seção 5 do `claude.md`. Este executor **deve** seguir exatamente esse mapa.
Ações ou asserções não mapeadas produzem um comentário `// TODO` no código,
sem quebrar o build.

## Execução

```bash
npm run agent:generate   # só gera
npm run agent:run        # gera + executa
```
