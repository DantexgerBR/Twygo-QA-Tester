# Modelos — Projeto Twygo

Pasta do agent-at dedicada ao projeto **Modelos**.

## Estrutura

```
agent-at/projects/modelos/
├── project.config.json    # configuração (nome, env-alvo, sourceDocs, figmaPrototype)
├── docs/                  # ← INPUTS: deposite aqui Discovery, Spike, planilhas
│   └── .gitkeep
└── output/                # ← SAÍDA: gerada pelo /analyze-test
    └── .gitkeep
```

## Como iniciar (passo a passo)

### 1. Depositar inputs em `docs/`

Tipos de arquivo aceitos pelo `/read-docs`:

| Extensão | Conteúdo esperado |
|---|---|
| `.docx` | Discovery / Spike (regras de negócio, textos UI, mensagens, campos, fluxos, endpoints) |
| `.xlsx` | Quebra de atividades (atividades de "Execução de testes") |
| `.rb` | Migrations (tabelas/colunas/constraints/FKs) |
| `.json` | Exemplos de payload/response de API |
| `.xml` / `.xmind` | Exemplos de AT de projetos anteriores (referência opcional) |

### 2. Atualizar `project.config.json`

Após depositar os docs, preencher:

```json
{
  "environment": "staging-modelos",        // se o projeto tem env dedicado; senão "staging"
  "figmaPrototype": "<URL do protótipo>",  // se houver — habilita /recon-visual
  "sourceDocs": [
    "docs/[Discovery] Modelos.docx",
    "docs/Quebra de atividades - Modelos.xlsx"
  ]
}
```

### 3. Rodar `/analyze-test`

Dentro do agent-at:

```bash
cd agent-at
claude
> /analyze-test --project modelos
```

A skill orquestra 8 fases (init → read-docs → recon-visual opt-in → plan → MD canônico
→ XMind → XML → validate → publish) e produz em `output/`:

| Arquivo | Papel |
|---|---|
| `test-analysis.md` | **Canônico** — fonte de verdade da AT |
| `Analise_Teste_Modelos.xmind` | Derivado — visualização opcional |
| `Analise_Teste_Modelos.xml` | Derivado — importação no TestLink |
| `requisitos_extraidos.md` | Intermediário (raw extract de `docs/`) |

### 4. Importar no TestLink (fluxo manual)

Importar `Analise_Teste_Modelos.xml` no TestLink Web — fluxo manual da
equipe de QA roda em paralelo.

### 5. Encaminhar para automação (agent-playwright)

Copiar o `test-analysis.md` para o agent-playwright:

```bash
cp agent-at/projects/modelos/output/test-analysis.md \
   agent-playwright/projects/modelos/inputs/
```

## Referências

- [agent-at/CLAUDE.md](../../CLAUDE.md) — especificação técnica
- [CONTRACT.md](../../../CONTRACT.md) — schema do MD canônico
- [shared/twygo-platform.md](../../../shared/twygo-platform.md) — gotchas Twygo cross-agente
- Skill `analyze-test` — orquestração do fluxo
- Skill `recon-visual` — opt-in para extrair textos de Figma protótipo
