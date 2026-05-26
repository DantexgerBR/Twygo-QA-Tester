# Agente DB — Validação em Banco de Dados (Twygo)

Agente especializado em executar validações diretas em banco de dados acionadas por casos de teste — chamado pelos demais agentes do monorepo (AT, Playwright) quando o caso de teste exige verificação além da UI.

> ⚠️ **Status atual: estrutura inicial em desenvolvimento.** As skills e scripts ainda estão em esqueleto. **Não usar em produção QA ainda.** Para casos onde validação em banco é crítica, hoje a equipe ainda valida manualmente via cliente SQL ou pelo `migration-validator` legado.

---

## Sumário

1. [O que ele faz e quando vai usar](#o-que-ele-faz-e-quando-vai-usar)
2. [Status de implementação](#status-de-implementação)
3. [Pré-requisitos (para quando estiver pronto)](#pré-requisitos-para-quando-estiver-pronto)
4. [Setup planejado](#setup-planejado)
5. [Estrutura de pastas](#estrutura-de-pastas)
6. [Tipos de validação suportados](#tipos-de-validação-suportados)
7. [Conexão com os outros agentes](#conexão-com-os-outros-agentes)
8. [Onde aprender mais](#onde-aprender-mais)

---

## O que ele faz e quando vai usar

**Em uma frase:** ele recebe um caso de teste que exige verificação em banco (contagem, presença, FK, view, etc.), constrói uma query parametrizada read-only e devolve PASS/FAIL/WARN com evidência.

### Vai ser usado quando:
- Caso de teste exige verificação de **registro/contagem em tabela**.
- Validar **integridade de FK** ou **remapeamento entre organizações**.
- Conferir **definição de view** (existência, colunas, retorno).
- Comparar dados entre duas orgs (de-para herdado do `migration-validator`).

### Casos típicos no projeto Créditos de IA — Fase 02
- "Armazenar logs da indexação e agente de atendimento" (verificação em `ai_indexing_logs`)
- "Criar view para acompanhamento de consumo de créditos" (existência + colunas)

---

## Status de implementação

| Componente | Status |
|---|---|
| `CLAUDE.md` (especificação) | ✅ Completo |
| `README.md` (este arquivo) | ✅ Visão geral |
| Skills `db-test-executor`, `db-query-builder`, `db-report-generator` | 🚧 Esqueleto (SKILL.md presentes, scripts não implementados) |
| Conexão MySQL + read-only guard | ❌ Pendente |
| Templates de query por domínio (`src/queries/`) | ❌ Pendente |
| Validators (count, presence, equals, FK, view, etc.) | ❌ Pendente |
| Relatório HTML/JSON | ❌ Pendente |

> O agente já tem **especificação detalhada** em [CLAUDE.md](CLAUDE.md). A implementação foi planejada herdando padrões do projeto-base [Twygo/migration-validator](https://github.com/Twygo/migration-validator).

---

## Pré-requisitos (para quando estiver pronto)

| Ferramenta | Versão | Onde baixar |
|---|---|---|
| **Claude Code CLI** | latest | https://code.claude.com/ |
| **Python** | 3.11+ | https://python.org/ |
| **Acesso read-only ao banco staging Twygo** | — | solicitar ao time de infra |

---

## Setup planejado

> Os comandos abaixo refletem a especificação. **Não funcionam ainda** — o esqueleto não está implementado.

```bash
cd agent-db

# 1. Ambiente Python virtual
python -m venv venv
source venv/Scripts/activate    # Windows: venv\Scripts\activate.bat

# 2. Dependências
pip install -r requirements.txt

# 3. Credenciais
cp .env.example .env
# Editar .env com host/user/pass read-only

# 4. Validar conexão (ainda não implementado)
python -m src.main --help
```

---

## Estrutura de pastas

```
agent-db/
├── CLAUDE.md                       # Especificação técnica completa
├── README.md                       # Este arquivo
├── requirements.txt                # Dependências Python (planejadas)
├── .env.example                    # Template de credenciais
│
├── config/
│   ├── database.config.yaml        # Conexões + chunk sizes (planejado)
│   └── database.config.example.yaml
│
├── inputs/                         # Casos de teste de DB (XML/JSON/MD) — vazio
├── output/                         # Relatórios gerados — gitignored
├── templates/                      # Jinja2 → HTML report — vazio
├── tests/                          # Testes do próprio agente (pytest) — vazio
│
├── src/
│   ├── connections/                # Engine + read-only guard — não implementado
│   ├── queries/                    # Queries por domínio — não implementado
│   ├── validators/                 # Validators (count, presence, ...) — não implementado
│   └── utils/                      # Helpers — não implementado
│
└── .claude/
    └── skills/
        ├── db-test-executor/       # Orquestra execução
        ├── db-query-builder/       # Caso → SQL parametrizado
        └── db-report-generator/    # Consolida métricas → HTML/JSON
```

---

## Tipos de validação suportados

> Os tipos abaixo estão **especificados** mas ainda não **implementados**.

| Tipo | Quando usar | Exemplo |
|---|---|---|
| `count` | Verificar quantidade esperada | "deve haver 1 log por execução de indexação" |
| `presence` | Garantir que registro foi criado | "log foi gravado em `ai_indexing_logs`" |
| `absence` | Garantir que registro NÃO foi criado | "nenhum log quando agente está desligado" |
| `equals` | Comparar valor de coluna | "`status = 'completed'` após indexação" |
| `compare_orgs` | Comparar registros entre duas organizações | herdado do migration-validator |
| `view_definition` | Validar view + colunas | "view `vw_consumo_creditos` exposta com X/Y/Z" |
| `fk_integrity` | Garantir FK não nula / referenciada | "`organization_id` aponta pra org existente" |
| `time_window` | Filtro temporal | "logs da última hora" |

---

## Conexão com os outros agentes

```
┌──────────────────┐  caso de teste com    ┌────────────┐    queries    ┌─────────┐
│ agent-playwright │  validação em banco   │  agent-db  │  read-only   │  MySQL  │
│   (executa UI)   │ ─────────────────────►│            │ ────────────► │ Twygo   │
└──────────────────┘                       └────────────┘               └─────────┘
                                                  │
                                                  ▼
                                           output/{slug}_{ts}/
                                           ├── report.html
                                           ├── report.json
                                           └── evidence/*.csv
```

- **Entrada**: arquivos em `inputs/` (XML/JSON/MD) descrevendo o caso de teste com tabela alvo, query canônica e critérios.
- **Saída**: `output/{slug}_{timestamp}/` com relatório legível e máquina-legível.
- **Comunicação entre agentes**: por filesystem (sem importação direta de código entre agentes).

---

## Regras duras (do CLAUDE.md)

1. **Conexão sempre read-only** — exceto com `--allow-writes` explícito.
2. **Credenciais só via `.env`** — nunca em `config.yaml`, código ou logs.
3. **Queries sempre parametrizadas** — string-format de SQL é proibido.
4. **Não modificar dados** mesmo em modo write — apenas seed de fixtures declaradas.
5. **Não commitar `output/` nem `.env`** — gitignored.

---

## Onde aprender mais

| Documento | Quando ler |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Especificação técnica completa do agente |
| [Twygo/migration-validator](https://github.com/Twygo/migration-validator) | Projeto-base do qual este agente herda padrões |

Documentação dos outros agentes:
- [agent-at](../agent-at/README.md) — análise de teste (gera XMind/XML)
- [agent-playwright](../agent-playwright/README.md) — execução E2E (UI)
