# agent-at — Agente de Análise de Teste (Twygo)

Lê documentação de projetos Twygo (Discovery + Spike + planilha de quebra)
e gera Análise de Teste (AT) em 3 formatos sincronizados:

- `test-analysis.md` — **MD canônico** (fonte única de verdade)
- `Analise_Teste_<Projeto>.xmind` — **derivado** (visualização opcional)
- `Analise_Teste_<Projeto>.xml` — **derivado** (importação manual no TestLink)

> Quem é o público deste README: QA novo, estagiário, ou primeira vez
> rodando o agent-at. Para detalhes técnicos profundos, ver
> [`CLAUDE.md`](CLAUDE.md) e [`../CONTRACT.md`](../CONTRACT.md).

---

## Pré-requisitos (uma vez na máquina)

- **Claude Code CLI**: https://code.claude.com/
- **Python 3.10+**: https://python.org/
- **Dependências Python**:
  ```bash
  pip install -r agent-at/requirements.txt
  ```
  (PyYAML, Jinja2, python-docx, openpyxl)
- **XMind Desktop** (opcional — só pra visualizar o XMind derivado):
  https://xmind.app/

---

## Minha primeira AT — passo a passo

Vamos supor que chegou o projeto **"Base de Conhecimento"** com Discovery
e planilha de quebra.

### 1. Criar pasta do projeto

```bash
cd agent-at
mkdir -p projects/base-de-conhecimento/{docs,output}
```

Ou use a estrutura já criada se existir.

### 2. Depositar inputs em `docs/`

```
agent-at/projects/base-de-conhecimento/docs/
├── [Discovery] Base de Conhecimento.docx
├── Quebra de atividades - Base de Conhecimento.xlsx
└── (opcional: migrations .rb, exemplos API .json)
```

### 3. Configurar `project.config.json`

```json
{
  "name": "Base de Conhecimento",
  "slug": "base-de-conhecimento",
  "environment": "staging",
  "sourceDocs": [
    "docs/[Discovery] Base de Conhecimento.docx",
    "docs/Quebra de atividades - Base de Conhecimento.xlsx"
  ],
  "contractVersion": "1.0",
  "atVersion": 1
}
```

Se o projeto precisar de env dedicado, trocar `staging` por
`staging-base-conhecimento` (ou similar — convenção em
[`../shared/twygo-platform.md §1`](../shared/twygo-platform.md)).

### 4. Rodar `/analyze-test`

```bash
cd agent-at
claude
```

Dentro do Claude Code:

```
/analyze-test --project base-de-conhecimento
```

A skill orquestra 8 fases:

| Fase | O que faz |
|---|---|
| 1. Init | Valida `docs/` e `template.xmind` |
| 2. `/read-docs` | Lê todos os arquivos de `docs/` → `output/requisitos_extraidos.md` |
| 3. Plan | Define estrutura de suítes/TCs (apresenta ao usuário pra revisão) |
| 4. Criação | Detalha TCs seguindo `twygo-qa-conventions` (verbos canônicos) |
| 5. `/generate-md-canonical` | Emite `output/test-analysis.md` + **valida** com `validate_md_canonical.py` |
| 6. `/generate-xmind` + `/generate-xml-testlink` | Gera derivados a partir do MD |
| 7. Validate | Confere que os 3 arquivos batem (contagens de TCs) |
| 8. Entrega | Resumo + caminhos |

### 5. Conferir validação

A skill aborta automaticamente se houver **erros**. Saída típica:

```
=== 2 ERRO(S) — bloqueiam entrega da AT ===
  [ERROR] TC1 (...) passo 1: anti-pattern A (Ação vaga). Ação: 'Verificar a tela'
  [ERROR] Catálogo '## Modais relevantes' obrigatório mas vazio.

=== 1 WARNING(S) — revisar antes de entregar ===
  [WARN] Suíte '...': playbook 'flipper' sugerido mas não declarado.
```

Erros → corrigir + re-validar. Warnings → revisar caso a caso
(geralmente vale corrigir, especialmente playbook faltante).

### 6. Importar no TestLink (fluxo manual)

```
agent-at/projects/base-de-conhecimento/output/Analise_Teste_<NomeLegivel>.xml
↓
TestLink Web → Admin → Test Specification → Import
```

Equipe de QA manual executa via TestLink normalmente.

### 7. Encaminhar para automação (agent-playwright)

```bash
cp agent-at/projects/base-de-conhecimento/output/test-analysis.md \
   agent-playwright/projects/base-de-conhecimento/inputs/
```

A partir daí, ver [`agent-playwright/README.md`](../agent-playwright/README.md).

---

## Estrutura do agent-at

```
agent-at/
├── README.md                       # este arquivo
├── CLAUDE.md                       # especificação técnica (regras duras, anti-patterns)
├── requirements.txt                # deps Python
├── template/
│   └── template.xmind              # template base compartilhado entre projetos
├── projects/                       # 1 subpasta por projeto
│   └── <slug>/
│       ├── project.config.json
│       ├── docs/                   # ★ inputs aqui ★
│       └── output/
│           ├── test-analysis.md    # canônico (fonte de verdade)
│           ├── Analise_Teste_*.xmind    # derivado
│           ├── Analise_Teste_*.xml      # derivado
│           └── requisitos_extraidos.md  # intermediário
├── scripts/                        # parsers + geradores + validador
│   ├── md_canonical_parser.py
│   ├── md_to_xmind.py
│   ├── md_to_testlink.py
│   ├── testlink.xml.j2
│   └── validate_md_canonical.py    # validação semântica
└── .claude/
    └── skills/                     # 6 skills (analyze-test orquestra as demais)
```

---

## Skills disponíveis

| Skill | Quando usar |
|---|---|
| `/analyze-test` | **Fluxo completo** (input em `docs/` → 3 arquivos em `output/`) |
| `/read-docs` | Só re-extrair `requisitos_extraidos.md` de `docs/` |
| `/generate-md-canonical` | Só (re)gerar `test-analysis.md` (canônico) |
| `/generate-xmind` | Só (re)gerar `.xmind` a partir do MD |
| `/generate-xml-testlink` | Só (re)gerar `.xml` a partir do MD |
| `twygo-qa-conventions` | Convenções de escrita (carregada automaticamente) |

---

## Erros comuns

### `ValueError: executor=... não suportado em v1`

Você declarou `executor: api` (ou `db`/`pentest`). Em v1 só `playwright`.
Outros executores entram no V2 do CONTRACT.md.

### `ValueError: type='mixed' não suportado em v1`

Mesma coisa pra `**Tipo**: mixed` no TC. Use `ui`/`api`/`db`.

### `[ERROR] Anti-pattern A — Ação vaga`

Você escreveu "Verificar X" ou similar. Troque por verbo canônico + objeto
literal: `Clicar no botão "Salvar"`, `Aguardar 'Modal X' ser exibido`. Ver
tabela em [`CLAUDE.md §8`](CLAUDE.md).

### `[ERROR] Catálogo '## Textos literais' obrigatório`

Sua prosa menciona "toast" ou "mensagem", mas o catálogo está vazio.
Preencha com os textos literais extraídos de `docs/` (estão em
`output/requisitos_extraidos.md` se já rodou `/read-docs`).

### `[WARN] Playbook 'flipper' sugerido mas não declarado`

Sua prosa cita "feature flag" mas o frontmatter da suíte não declara
`playbooks: [flipper]`. Adicione — o agent-playwright vai precisar
disso pra carregar o protocolo correto de toggle/revert.

---

## Referências

- [`CLAUDE.md`](CLAUDE.md) — especificação técnica (princípios, regras duras, anti-patterns)
- [`../CONTRACT.md`](../CONTRACT.md) — schema do MD canônico (consumido pelos agentes downstream)
- [`../shared/twygo-platform.md`](../shared/twygo-platform.md) — gotchas Twygo
- [`../CLAUDE.md`](../CLAUDE.md) — regras meta do monorepo
