# Desempenho e Feedback — Projeto Twygo

Pasta do `agent-tasks-qa` dedicada ao projeto **Desempenho e Feedback**.

## Estrutura

```
agent-tasks-qa/projects/desempenho-feedback/
├── docs/                  # ← INPUTS: Discovery/Spike (.docx) + Planilha de Dev (.xlsx)
└── output/                # ← SAÍDA: planilhas QA geradas (.xlsx)
```

## Como iniciar

### 1. Depositar inputs em `docs/`

| Extensão | Conteúdo esperado |
|---|---|
| `.docx` | Discovery / Spike (regras de negócio, fluxos) |
| `.xlsx` | Quebra de atividades de Dev (atividades de "Execução de testes") |

### 2. Rodar `/break-qa-tasks`

Dentro do `agent-tasks-qa`:

```bash
cd agent-tasks-qa
claude
> /break-qa-tasks --project desempenho-feedback
```

A skill orquestra o fluxo (verifica ambiente → lê inputs → estrutura atividades QA → estima esforço → gera planilhas) e produz em `output/`:

| Arquivo | Papel |
|---|---|
| `Atividades_QA_Desempenho_Feedback.xlsx` | Planilha Completa (Dev + QA) — importação no gestor de projetos |
| `QA_Only_Desempenho_Feedback.xlsx` | Planilha QA-Only — usada como input pelo `agent-at` |

### 3. Encaminhar para análise de teste (agent-at)

Copiar a planilha QA-Only para o `agent-at`:

```bash
cp agent-tasks-qa/projects/desempenho-feedback/output/QA_Only_Desempenho_Feedback.xlsx \
   agent-at/projects/desempenho-feedback/docs/
```

## Referências

- [agent-tasks-qa/CLAUDE.md](../../CLAUDE.md) — especificação técnica do agente
- [CLAUDE.md raiz](../../../CLAUDE.md) — regras meta do monorepo
- Skill `break-qa-tasks` — orquestração do fluxo
