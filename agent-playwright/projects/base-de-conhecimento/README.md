# Base de Conhecimento — Projeto Twygo

Pasta do agent-playwright dedicada ao projeto **Base de Conhecimento**.

> **Status atual**: aguardando AT do `agent-at`. Quando o
> `test-analysis.md` for gerado em
> `agent-at/projects/base-de-conhecimento/output/`, copiar para
> `inputs/` aqui e começar o fluxo Playwright.

## Estrutura

```
agent-playwright/projects/base-de-conhecimento/
├── project.config.json    # configuração (env, exploratory, etc.)
├── inputs/                # ← test-analysis.md vindo do agent-at
├── specs/                 # planos gerados pelo planner
├── tests/features/        # specs Playwright (.spec.ts + .data.ts)
├── pages/                 # Page Objects específicos do projeto
├── data/                  # constantes compartilhadas do projeto
└── utils/                 # helpers específicos
```

## Configuração inicial

`project.config.json` está pré-configurado com:
- `environment: staging` — **ajustar** se o projeto precisar de env dedicado (ex.: `staging-base-conhecimento`)
- `testAnalysisFile: inputs/test-analysis.md` — apontando para o MD canônico (preferencial v1+)
- `exploratory.enabled: true` — fixture exploratória ativa por padrão

## Quando começar a rodar

### 1. Importar o `test-analysis.md` do agent-at

```bash
cp ../../../agent-at/projects/base-de-conhecimento/output/test-analysis.md \
   inputs/
```

### 2. Parsear (dispatcher detecta automaticamente)

```bash
PROJECT=base-de-conhecimento npm run agent:parse
```

### 3. Listar suítes disponíveis

```bash
PROJECT=base-de-conhecimento npm run agent:suites
```

### 4. Rodar por suíte (dia-a-dia)

```bash
PROJECT=base-de-conhecimento npm run agent:run -- --suite "<nome da suíte>"
```

### 5. Regressivo (fim do projeto)

```bash
PROJECT=base-de-conhecimento npm run agent:regression
```

## Convenções

- Branch dedicada: `project/base-de-conhecimento`
- Specs em `tests/features/<slug-suite>/<testcase>.spec.ts` com `.data.ts` adjacente
- Anti-patterns A-G do `agent-playwright/CLAUDE.md §7.6` proibidos
- Gotchas Twygo em [`shared/twygo-platform.md`](../../../shared/twygo-platform.md)

## Referências

- [agent-playwright/CLAUDE.md](../../CLAUDE.md) — especificação técnica
- [.claude/PROJECT_BOOTSTRAP.md](../../.claude/PROJECT_BOOTSTRAP.md) — ritual de início de projeto
- [.claude/commands.md](../../.claude/commands.md) — comandos npm/flags
