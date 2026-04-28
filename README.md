# Twygo QA Agents (Monorepo)

Este repositório unifica, em um único monorepo, os dois agentes de QA da Twygo. Cada agente vive em sua própria pasta, é totalmente autossuficiente e roda de forma isolada — não há código, dependências ou configuração compartilhada na raiz.

A organização em monorepo facilita a manutenção, o versionamento conjunto e a futura criação de pipelines independentes no GitHub Actions (um workflow por agente).

## Agentes

| Agente | Pasta | Função | Linguagem / Stack |
| --- | --- | --- | --- |
| **Agente de Análise de Testes (AT)** | [`agent-at/`](agent-at/) | Lê documentos de projeto e gera arquivos XMind com cenários e casos de teste. | Python + Claude Code Skills |
| **Agente Playwright (Testes Front)** | [`agent-playwright/`](agent-playwright/) | Executa testes E2E no frontend a partir de XMLs do TestLink. | TypeScript + Playwright + Claude Code Skills |

## Execução isolada

Cada agente é executado a partir da sua própria pasta. O Claude Code carrega apenas o `CLAUDE.md` e as skills de `.claude/skills/` daquela pasta — os agentes não enxergam um ao outro.

### Agente AT

```bash
cd agent-at
claude
```

### Agente Playwright

```bash
cd agent-playwright
npm install        # primeira execução
claude
```

## Estrutura da raiz

A raiz do monorepo contém apenas o necessário para orquestrar os dois agentes:

```
.
├── README.md          # este arquivo
├── .gitignore         # gitignore unificado (Node, Python, Playwright, IDE, OS)
├── .github/
│   └── workflows/     # workflows futuros (um por agente)
├── agent-at/          # agente isolado de Análise de Testes
└── agent-playwright/  # agente isolado de execução Playwright
```

> **Regra de isolamento:** nenhum arquivo de agente (`package.json`, `CLAUDE.md`, `playwright.config.ts`, etc.) deve aparecer na raiz. Tudo fica dentro de `agent-at/` ou `agent-playwright/`.
