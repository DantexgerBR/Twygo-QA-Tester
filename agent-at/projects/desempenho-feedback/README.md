# Desempenho e Feedback — Projeto Twygo

Pasta do `agent-at` dedicada ao projeto **Desempenho e Feedback**.

## Estrutura

```
agent-at/projects/desempenho-feedback/
├── project.config.json    # nome, env-alvo, sourceDocs, figmaPrototype
├── docs/                  # ← INPUTS: Discovery, Spike, planilha QA-Only
└── output/                # ← SAÍDA: gerada pelo /analyze-test
```

## Como iniciar

### 1. Depositar inputs em `docs/`

Tipos aceitos pelo `/read-docs`:

| Extensão | Conteúdo esperado |
|---|---|
| `.docx` / `.md` | Discovery / Spike (RNs, textos UI, mensagens, campos, fluxos, endpoints) |
| `.xlsx` | Planilha QA-Only gerada pelo `agent-tasks-qa` |
| `.rb` | Migrations (tabelas/colunas/constraints/FKs) — opcional |
| `.json` | Exemplos de payload/response de API — opcional |
| `.xml` / `.xmind` | Exemplos de AT de projetos anteriores — referência opcional |

### 2. Atualizar `project.config.json`

Após depositar os docs, preencher:

```json
{
  "figmaPrototype": "<URL do protótipo>",
  "sourceDocs": [
    "docs/discovery.md",
    "docs/QA_Only_Desempenho_Feedback.xlsx"
  ]
}
```

### 3. Rodar `/analyze-test`

```bash
cd agent-at
claude
> /analyze-test --project desempenho-feedback
```

A skill orquestra 8 fases (init → read-docs → recon-prototipo opt-in → plan → MD canônico → XMind → XML → validate → publish) e produz em `output/`:

| Arquivo | Papel |
|---|---|
| `test-analysis.md` | **Canônico** — fonte de verdade da AT |
| `Analise_Teste_Desempenho_Feedback.xmind` | Derivado — visualização opcional |
| `Analise_Teste_Desempenho_Feedback.xml` | Derivado — importação no TestLink |
| `requisitos_extraidos.md` | Intermediário (raw extract de `docs/`) |

### 4. Importar no TestLink (fluxo manual)

Importar `Analise_Teste_Desempenho_Feedback.xml` no TestLink Web.

### 5. Encaminhar para automação (agent-playwright)

```bash
cp agent-at/projects/desempenho-feedback/output/test-analysis.md \
   agent-playwright/projects/desempenho-feedback/inputs/
```

## Referências

- [agent-at/CLAUDE.md](../../CLAUDE.md) — especificação técnica
- [CONTRACT.md](../../../CONTRACT.md) — schema do MD canônico
- [shared/twygo-platform.md](../../../shared/twygo-platform.md) — gotchas Twygo cross-agente
- Skill `analyze-test` — orquestração do fluxo
- Skill `recon-prototipo` — opt-in para extrair textos de Figma protótipo
