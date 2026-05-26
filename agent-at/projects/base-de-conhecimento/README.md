# Base de Conhecimento — Projeto Twygo

Pasta do agent-at dedicada ao projeto **Base de Conhecimento**.

## Estrutura

```
agent-at/projects/base-de-conhecimento/
├── project.config.json    # configuração (nome, env-alvo, contract_version)
├── docs/                  # ← INPUTS: deposite aqui Discovery, Spike, planilhas
│   └── .gitkeep
└── output/                # ← SAÍDA: gerada pelo /analyze-test
    └── .gitkeep
```

## Como iniciar (passo a passo)

### 1. Depositar os inputs em `docs/`

Tipos de arquivo aceitos (skill `read-docs`):

| Extensão | Conteúdo esperado |
|---|---|
| `.docx` | Discovery / Spike (regras de negócio, textos UI, mensagens, campos, fluxos, endpoints) |
| `.xlsx` | Quebra de atividades (atividades de "Execução de testes") |
| `.rb` | Migrations (tabelas/colunas/constraints/FKs) |
| `.json` | Exemplos de payload/response de API (status codes, mensagens) |
| `.xml` / `.xmind` | Exemplos de AT de projetos anteriores (referência opcional) |

### 2. Atualizar `project.config.json`

Após depositar os docs, listar os arquivos em `sourceDocs`:

```json
{
  "sourceDocs": [
    "docs/[Discovery] Base de Conhecimento.docx",
    "docs/Quebra de atividades - Base de Conhecimento.xlsx"
  ]
}
```

Definir também o `environment` correto (`staging` é o default; trocar se
projeto exigir env dedicado, ex.: `staging-base-conhecimento`).

### 3. Rodar `/analyze-test`

Dentro do `agent-at/`:

```bash
cd agent-at
claude
> /analyze-test --project base-de-conhecimento
```

A skill orquestra 8 fases (init → read-docs → plan → MD canônico →
XMind → XML → validate → publish) e produz em `output/`:

| Arquivo | Papel |
|---|---|
| `test-analysis.md` | **Canônico** — fonte de verdade da AT |
| `Analise_Teste_<NomeLegivel>.xmind` | Derivado — visualização opcional |
| `Analise_Teste_<NomeLegivel>.xml` | Derivado — importação no TestLink |
| `requisitos_extraidos.md` | Intermediário (raw extract de `docs/`) |

### 4. Importar no TestLink (fluxo manual)

Importar `Analise_Teste_<NomeLegivel>.xml` no TestLink Web — o fluxo
manual da equipe de QA continua inalterado.

### 5. Encaminhar para automação (agent-playwright)

Copiar o `test-analysis.md` para o agent-playwright:

```bash
cp agent-at/projects/base-de-conhecimento/output/test-analysis.md \
   agent-playwright/projects/base-de-conhecimento/inputs/
```

## Convenções

Detalhe em [agent-at/CLAUDE.md](../../CLAUDE.md) e
[CONTRACT.md raiz](../../../CONTRACT.md):

- Verbos canônicos em toda ação ("Clicar no botão 'X'", "Preencher o campo 'X' com 'Y'")
- Textos literais entre aspas duplas
- Resultados assertáveis (objeto + texto literal)
- Pré-condições NÃO referenciam Dev
- Catálogos preenchidos (`## Dados de teste`, `## Textos literais`, `## Modais relevantes`)
- Playbooks Twygo declarados no frontmatter de cada suíte (lista canônica em CONTRACT.md §6)

## Referências

- [agent-at/CLAUDE.md](../../CLAUDE.md) — especificação técnica do agent-at
- [CONTRACT.md raiz](../../../CONTRACT.md) — schema do MD canônico
- [shared/twygo-platform.md](../../../shared/twygo-platform.md) — gotchas Twygo
- Skill `analyze-test` — orquestração do fluxo
- Skill `twygo-qa-conventions` — verbos canônicos, hierarquia, anti-patterns
