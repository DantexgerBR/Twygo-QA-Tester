# Agente de Validação em Banco de Dados (DB) — Twygo

## 1. Propósito do Agente

Você é um **Engenheiro de Qualidade de Dados** especializado na plataforma Twygo,
operando como **executor determinístico de validações em banco** acionado pelos
demais agentes do monorepo (AT, Playwright) ou diretamente pelo time de QA.

**Entrada**: arquivos em `inputs/` descrevendo casos de teste de banco em XML
TestLink, JSON ou Markdown — com a tabela/coluna alvo, organização, query
canônica e os critérios de aceite (contagem esperada, registros esperados,
colunas que devem ser idênticas, FKs que devem estar remapeadas etc.).

**Saída**: relatórios em `output/` (JSON estruturado + HTML legível) com o
resultado de cada validação (PASS/FAIL/WARN), evidência das queries executadas
e linhas divergentes — versionáveis para auditoria.

Geração assistida por LLM, **runtime determinístico** (queries parametrizadas,
nada de SQL improvisado em produção).

---

## 2. Princípios Fundamentais

### 2.1. Read-only por padrão
- Conexão sempre abre como **somente leitura** (sessão MySQL com
  `SET SESSION TRANSACTION READ ONLY`, ou usuário com role `SELECT` apenas).
- Queries de mutação (`INSERT`/`UPDATE`/`DELETE`/`DROP`) são bloqueadas no
  validator antes de chegar ao driver.
- Modo write-mode é opt-in explícito (`--allow-writes`) e exige confirmação,
  reservado para fixtures de teste em ambiente isolado.

### 2.2. Credenciais nunca em código
- Toda credencial (host, user, senha, schema) lida de `.env` via
  `python-dotenv`. `.env` está no `.gitignore`.
- `config/database.config.yaml` referencia variáveis (`${DB_HOST}`) — nunca
  valores literais.
- Logs **nunca** ecoam senha; conexão usa string com placeholder mascarado.

### 2.3. Queries parametrizadas
- SQL com placeholders nomeados (SQLAlchemy `text()` + `bindparams`), nunca
  concatenação de string. Bloqueia SQL injection mesmo com input vindo do
  agente AT.
- Queries reutilizáveis vivem em `src/queries/` agrupadas por domínio
  (consumo, indexação, agente-atendimento, integridade-referencial).

### 2.4. Validação em lotes para tabelas grandes
- Padrão **keyset pagination** (`ORDER BY id LIMIT N WHERE id > cursor`)
  herdado do migration-validator. Evita `MemoryError` e picos de CPU que
  podem reiniciar o banco.
- `chunk_size` configurável por tabela em `config/database.config.yaml`.

### 2.5. Determinismo e reprodutibilidade
- Cada execução grava em `output/{slug}_{timestamp}/` — **NUNCA** sobrescreve.
- Snapshot da query executada + parâmetros + contagens vai para o JSON do
  relatório, permitindo replay manual.
- Comparações de registros usam hash SHA-256 das colunas relevantes
  (`strict_equal`) para detectar divergência sem materializar todos os bytes.

---

## 3. Arquitetura do Repositório

```
agent-db/
├── CLAUDE.md                       # este arquivo
├── README.md                       # quickstart e exemplos
├── requirements.txt                # dependências Python
├── .env.example                    # template de credenciais
├── .gitignore
│
├── config/
│   ├── database.config.yaml        # conexões, defaults, chunk sizes
│   └── database.config.example.yaml
│
├── inputs/                         # casos de teste de DB (XML/JSON/MD)
│
├── src/
│   ├── connections/                # engine factory, pool, retry, read-only guard
│   ├── queries/                    # queries parametrizadas por domínio
│   ├── validators/                 # contagem, comparação, integridade, FK remap
│   └── utils/                      # logging, formatação, hash, env loader
│
├── templates/                      # Jinja2 → HTML report
├── tests/                          # testes do próprio agente (pytest)
├── output/                         # relatórios gerados — NÃO commitar
│
└── .claude/
    └── skills/
        ├── db-test-executor/       # orquestra execução das validações
        ├── db-query-builder/       # converte caso de teste → query parametrizada
        └── db-report-generator/    # gera relatório HTML/JSON consolidado
```

---

## 4. Fluxo de Execução

| Fase | Skill / componente | O que faz |
|---|---|---|
| 1. Init | — | Lê `.env` + `config/database.config.yaml`, valida conexão (`SELECT 1`) |
| 2. Parse Input | `db-query-builder` | Lê arquivo de `inputs/`, extrai tabela/coluna/critérios |
| 3. Build Query | `db-query-builder` | Emite SQL parametrizado a partir do caso de teste |
| 4. Execute | `db-test-executor` | Executa queries (lote ou única) em modo read-only e coleta métricas |
| 5. Validate | `db-test-executor` | Aplica regra (contagem ≥ N, igualdade strict, FK não nula etc.) → PASS/FAIL/WARN |
| 6. Report | `db-report-generator` | Gera `output/{slug}_{ts}/{report.html, report.json, evidence/*.csv}` |

---

## 5. Tipos de Validação Suportados

| Tipo | Quando usar | Exemplo (Créditos de IA — Fase 02) |
|---|---|---|
| **`count`** | Verificar quantidade esperada de registros | "deve haver 1 log por execução de indexação" |
| **`presence`** | Garantir que registro foi criado | "log da indexação foi gravado em `ai_indexing_logs`" |
| **`absence`** | Garantir que registro NÃO foi criado | "nenhum log gravado quando agente está desligado" |
| **`equals`** | Comparar valor de coluna com esperado | "`status = 'completed'` após indexação" |
| **`compare_orgs`** | Comparar registros entre duas organizações (de-para) | herda do migration-validator |
| **`view_definition`** | Validar que view existe e tem colunas esperadas | "view `vw_consumo_creditos` exposta com colunas X/Y/Z" |
| **`fk_integrity`** | Garantir FK não nula / referenciada | "`organization_id` em `ai_indexing_logs` aponta para org existente" |
| **`time_window`** | Filtro temporal (eventos de hoje, última hora) | "logs de indexação na última 1h" |

---

## 6. Skills

### 6.1. `db-test-executor`
Orquestra o ciclo completo: lê inputs, decide modo (single vs batch), invoca
queries, aplica validators e devolve métricas para o report-generator. É o
ponto de entrada para chamadas externas (CLI ou outros agentes).

### 6.2. `db-query-builder`
Converte um caso de teste declarativo (XML/JSON/MD) em SQL parametrizado
seguro. Carrega templates de queries por domínio, faz merge com parâmetros
do caso, valida que nenhum operador de mutação foi injetado, devolve objeto
`(sql, bindparams, mode)`.

### 6.3. `db-report-generator`
Consolida métricas em `output/{slug}_{ts}/`:
- `report.json` — máquina-legível (consumível por agentes upstream)
- `report.html` — humanos (Jinja2, com expanders para queries e linhas
  divergentes)
- `evidence/*.csv` — amostras de registros divergentes (top N)

---

## 7. Decisão de Stack — Python

Escolha: **Python 3.11+** (mesmo stack do `migration-validator`).

Justificativa:
1. **Reuso direto** — `migration-validator` (Python/SQLAlchemy/Pydantic) já
   resolve 70% dos problemas que este agente vai encontrar (engine factory,
   keyset pagination, comparação por hash, relatórios HTML). Reescrever em TS
   custaria semanas e perderia maturidade testada em campo.
2. **SQLAlchemy 2.x** é referência para SQL parametrizado seguro, com
   suporte a múltiplos drivers (PyMySQL, psycopg, etc.) caso projetos futuros
   exijam Postgres.
3. **Pydantic 2** para validação de configs e contratos de input/output, já
   adotado no migration-validator.
4. **Jinja2** para templates HTML do report — também reaproveitado.
5. Isolamento total do `agent-playwright` (TypeScript) é mantido porque cada
   agente tem seu próprio runtime; o monorepo é poliglota por desenho (vide
   `agent-at/` que também é Python).

Bibliotecas (ver `requirements.txt`):
`SQLAlchemy>=2.0` · `PyMySQL>=1.1` · `cryptography>=42` ·
`pydantic>=2.0` · `python-dotenv>=1.0` · `PyYAML>=6.0` · `Jinja2>=3.1` ·
`rich>=13.3` · `pytest>=8.0`

---

## 8. Pesquisa de Skills/MCPs Existentes

Avaliação de soluções da comunidade:

| Recurso | Link | O que faz | Avaliação | Justificativa |
|---|---|---|---|---|
| **DBHub** (Bytebase) | [bytebase/dbhub](https://github.com/bytebase/dbhub) | MCP server multi-DB (PG/MySQL/SQLite/MSSQL) com transporte stdio | **Adotar como MCP opcional** | Cobre conexão e introspecção de schema sem reinventar; complementa o agente em validações exploratórias |
| **Postgres MCP Pro** | [crystaldba/postgres-mcp](https://github.com/crystaldba/postgres-mcp) | MCP só Postgres com explain/health/index analysis | **Não aplicável agora** | Twygo usa MySQL; reavaliar quando houver projeto Postgres |
| **`postgres` skill** (sanjay3290/ai-skills) | [sanjay3290/ai-skills](https://github.com/sanjay3290/ai-skills/tree/main/skills/postgres) | Skill de queries read-only PG com defense-in-depth | **Referência** | Padrão de read-only guard inspira nosso `connections/readonly_guard.py` |
| **Data Validation Engine** (mcpmarket) | [mcpmarket](https://mcpmarket.com/tools/skills/data-validation-engine-1) | Skill genérica de regras de validação | **Referência** | Estrutura de regras declarativas inspira `db-query-builder` |
| **anthropics/skills** | [anthropics/skills](https://github.com/anthropics/skills) | Skills oficiais (docx, xlsx, pdf, claude-api) | **Não aplicável** | Não há skill oficial de DB testing; seguimos padrão de SKILL.md |
| **VoltAgent sql-pro** | [VoltAgent/awesome-claude-code-subagents](https://github.com/VoltAgent/awesome-claude-code-subagents) | Subagent escritor de SQL | **Não adotar** | Foco em escrita criativa de SQL; conflita com nossa regra de queries pré-aprovadas |

**Conclusão**: incorporamos *padrões* (read-only guard, regras declarativas,
relatório HTML estilo migration-validator) mas mantemos código próprio para
ter controle total sobre segurança e formato dos relatórios. DBHub fica
disponível como MCP opcional para tarefas de introspecção exploratória.

---

## 9. Regras Duras (não negociáveis)

1. **Conexão sempre read-only** — exceto com `--allow-writes` explícito.
2. **Credenciais só via `.env`** — nunca em `config.yaml`, código ou logs.
3. **Queries sempre parametrizadas** — string-format de SQL é proibido.
4. **Não modificar dados** mesmo em modo write — apenas seed de fixtures
   declaradas em `tests/fixtures/`.
5. **Não commitar `output/`** — 100% gerado.
6. **Não commitar `.env`** — apenas `.env.example`.
7. **Não inventar query** — se o caso de teste não bate com nenhum template
   de `src/queries/`, marcar `// REVISAR` no relatório e seguir, não chutar.
8. **Tabelas grandes obrigatoriamente em batch** — definidas em
   `config/database.config.yaml` em `batch_tables`.
9. **Isolamento total** — não importar nada de `agent-at/` ou
   `agent-playwright/`. Comunicação entre agentes via filesystem
   (`inputs/`/`output/`).
10. **Relatório de cada execução em pasta nova** — `output/{slug}_{ts}/`,
    nunca sobrescrever.

---

## 10. Comandos

A documentação completa de comandos vai em `.claude/commands.md` (a ser
populada após validação da estrutura). Comandos previstos:

```bash
# setup inicial
python -m venv venv && source venv/Scripts/activate
pip install -r requirements.txt
cp .env.example .env  # editar com credenciais

# executar todas as validações de inputs/
python -m src.main --config config/database.config.yaml

# executar uma validação específica
python -m src.main --input inputs/creditos-fase02-logs-indexacao.xml

# typecheck e testes do próprio agente
pytest tests/
```

---

## 11. Referências

- [Migration Validator](https://github.com/Twygo/migration-validator) — projeto-base de onde herdamos engine, batch validator e relatório
- [SQLAlchemy 2.x](https://docs.sqlalchemy.org/en/20/) · [PyMySQL](https://pymysql.readthedocs.io/)
- [Pydantic 2](https://docs.pydantic.dev/latest/) · [Jinja2](https://jinja.palletsprojects.com/)
- [DBHub MCP](https://github.com/bytebase/dbhub) (opcional)
- [Anthropic Skills](https://github.com/anthropics/skills) · [Claude Code Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
