# Twygo QA Agents — Monorepo

Monorepo dos agentes de QA da Twygo. Cada agente vive em sua própria pasta, é totalmente autossuficiente e roda de forma isolada — não há código, dependências ou configuração compartilhada na raiz.

> **Quem é o público deste README?** Estagiários, QAs novos no time, ou qualquer pessoa começando a usar os agentes pela primeira vez.

---

## Sumário

1. [Visão geral](#visão-geral)
2. [Os 3 agentes — quando usar cada um](#os-3-agentes--quando-usar-cada-um)
3. [Pré-requisitos (uma vez na máquina)](#pré-requisitos-uma-vez-na-máquina)
4. [Quickstart](#quickstart)
5. [Fluxo completo de um projeto Twygo](#fluxo-completo-de-um-projeto-twygo)
6. [Estrutura do monorepo](#estrutura-do-monorepo)
7. [Onde aprender mais](#onde-aprender-mais)

---

## Visão geral

O time de QA Twygo opera com **3 agentes especializados** que trabalham em sequência, cada um numa fase do ciclo de QA:

```
┌────────────┐   docs   ┌──────────┐  XML  ┌────────────────┐  acessa  ┌──────────┐
│ Discovery  │ ───────► │ agent-at │ ────► │ agent-          │ quando   │ agent-   │
│ + Spike    │  (.docx, │   (AT)   │       │  playwright    │ ───────► │   db     │
│ + Quebra   │  .xlsx)  │          │       │  (executa E2E) │ preciso  │  (DB)    │
└────────────┘          └──────────┘       └────────────────┘          └──────────┘
                          XMind →             specs Playwright            queries
                          XML TestLink        + relatórios                read-only
```

A organização em monorepo facilita manutenção, versionamento conjunto, e a futura criação de pipelines independentes no GitHub Actions (um workflow por agente).

---

## Os 3 agentes — quando usar cada um

| Agente | Pasta | Função | Stack | Status |
|---|---|---|---|---|
| **AT** (Análise de Teste) | [`agent-at/`](agent-at/) | Lê documentos do projeto e gera XMind com cenários e casos de teste | Python + Claude Code Skills | ✅ Operacional |
| **Playwright** (E2E UI) | [`agent-playwright/`](agent-playwright/) | Executa testes E2E no frontend a partir de XMLs do TestLink | TypeScript + Playwright + Claude Code | ✅ Operacional |
| **DB** (Banco de Dados) | [`agent-db/`](agent-db/) | Executa validações em banco quando o caso de teste exige | Python + SQLAlchemy + Claude Code | 🚧 Em construção |

### Decisão rápida

| Você precisa de... | Use |
|---|---|
| Transformar Discovery/Spike em casos de teste detalhados | [agent-at](agent-at/README.md) |
| Rodar testes de UI a partir de um XML TestLink | [agent-playwright](agent-playwright/README.md) |
| Validar consequências em banco (registros, FKs, views) | [agent-db](agent-db/README.md) — quando estiver pronto |

---

## Pré-requisitos (uma vez na máquina)

| Ferramenta | Usado por | Versão mínima | Onde baixar |
|---|---|---|---|
| **Claude Code CLI** | todos | latest | https://code.claude.com/ |
| **Node.js** | agent-playwright | 20+ | https://nodejs.org/ |
| **Python** | agent-at, agent-db | 3.10+ | https://python.org/ |
| **Java JRE 17** | agent-playwright (regressivo Allure) | 17+ | https://adoptium.net/ |
| **XMind Desktop** | agent-at (visualizar XMind) | qualquer | https://xmind.app/ |

> Cada agente lista seus pré-requisitos específicos no próprio README. Acima é o consolidado.

---

## Quickstart

Cada agente é executado a partir da sua própria pasta. O Claude Code carrega apenas o `CLAUDE.md` e as skills de `.claude/skills/` daquela pasta — os agentes **não enxergam um ao outro**.

### Agente AT

```bash
cd agent-at
claude
```

Dentro do Claude Code: `/analyze-test` (após depositar docs em `docs/`).

> Detalhes: [agent-at/README.md](agent-at/README.md)

### Agente Playwright

```bash
cd agent-playwright
npm install                          # primeira vez
npx playwright install chromium      # primeira vez
npm run typecheck                    # confirmar setup
claude
```

Dentro do Claude Code: `/plugin install playwright` (primeira vez).

> Detalhes: [agent-playwright/README.md](agent-playwright/README.md)

### Agente DB

```bash
cd agent-db
# (pendente implementação — ver agent-db/README.md)
```

> Detalhes: [agent-db/README.md](agent-db/README.md)

---

## Fluxo completo de um projeto Twygo

Suponha que chega um projeto novo: **"Widgets"** (com Discovery + planilha de quebra de atividades).

### 1. Análise de teste

```bash
cd agent-at
# Depositar documentos do projeto em docs/
#   - [Discovery] Widgets.docx
#   - Quebra de atividades - Widgets.xlsx
claude
> /analyze-test
```

Saída: `agent-at/output/Analise_Teste_Widgets.xmind` + `requisitos_extraidos.md`.

Revise o XMind no XMind Desktop, peça ajustes ao agente se necessário, e exporte como **XML TestLink**.

### 2. Execução E2E

```bash
cd ../agent-playwright

# Criar branch dedicada do projeto
git checkout master
git pull
git checkout -b project/widgets

# Criar pasta do projeto
mkdir -p projects/widgets/{inputs,specs,tests/features,pages,utils}

# Receber XML do AT
cp <caminho>/Analise_Teste_Widgets.xml projects/widgets/inputs/

# Criar projects/widgets/project.config.json (nome + XML + env)

npm run agent:parse -- --project widgets    # parsear XML
npm run agent:suites -- --project widgets   # listar testsuites

# Por cada bloco entregue pelo dev:
npm run agent:run -- --project widgets --suite "<nome literal da suíte>"
```

Saída: `agent-playwright/outputs/widgets/reports/{slug-suite}_{timestamp}/index.html`.

> Se houver só 1 projeto em `projects/`, a flag `--project` é opcional (auto-detect).

### 3. Validações em banco (quando o caso de teste exigir)

> Em construção — hoje validações em DB são feitas manualmente. Ver [agent-db/README.md](agent-db/README.md).

### 4. Regressivo no fim do projeto

```bash
cd agent-playwright
npm run clean
npm run agent:regression
```

Saída: `outputs/allure-report/index.html` (executivo) + HTML estruturado por suíte.

### 5. Encerramento

A branch `project/<slug>` fica preservada como histórico do projeto. Próximo projeto começa numa branch nova a partir do master.

---

## Estrutura do monorepo

```
.
├── README.md                       # este arquivo (visão geral)
├── .gitignore                      # gitignore unificado (Node, Python, Playwright, IDE, OS)
├── .github/
│   └── workflows/                  # workflows futuros (um por agente)
│
├── agent-at/                       # Agente de Análise de Teste (Python + Claude Code)
│   ├── README.md                   # como usar este agente
│   ├── CLAUDE.md                   # especificação técnica
│   ├── docs/                       # depositar docs do projeto aqui
│   ├── output/                     # XMind + requisitos extraídos (gerado)
│   ├── template/template.xmind     # template base reutilizado
│   └── .claude/skills/             # skills locais (analyze-test, read-docs, ...)
│
├── agent-playwright/               # Agente Playwright (TypeScript + Playwright)
│   ├── README.md                   # como usar este agente
│   ├── CLAUDE.md                   # especificação técnica
│   ├── package.json                # dependências Node
│   ├── playwright.config.ts        # config Playwright
│   ├── config/environment.json     # baseUrl/orgId/paths (credenciais via ${VAR} → .env)
│   ├── .env.example                # template das vars TWYGO_* — copiar para .env
│   ├── projects/<slug>/            # 1 subpasta por projeto Twygo (XML, specs, pages específicos)
│   ├── tests/{auth,setup}/         # specs e setup compartilhados
│   ├── src/                        # Page Objects + fixtures + utils — infra compartilhada
│   ├── outputs/                    # relatórios + traces (gerado, gitignored)
│   └── .claude/                    # SETUP, PROJECT_BOOTSTRAP, commands, skills, agents
│
└── agent-db/                       # Agente de Banco de Dados (Python + SQLAlchemy)
    ├── README.md                   # como usar este agente
    ├── CLAUDE.md                   # especificação técnica
    ├── requirements.txt            # dependências Python
    ├── inputs/                     # casos de teste de DB (entrada)
    ├── output/                     # relatórios (gerado, gitignored)
    ├── src/                        # connections + queries + validators (em construção)
    └── .claude/skills/             # skills locais (db-test-executor, ...)
```

> **Regra de isolamento:** nenhum arquivo de agente (`package.json`, `CLAUDE.md`, `playwright.config.ts`, etc.) deve aparecer na raiz. Tudo fica dentro de `agent-at/`, `agent-playwright/` ou `agent-db/`.

---

## Onde aprender mais

### Por agente

| Agente | README |
|---|---|
| Análise de Teste | [agent-at/README.md](agent-at/README.md) |
| Playwright | [agent-playwright/README.md](agent-playwright/README.md) |
| Banco de Dados | [agent-db/README.md](agent-db/README.md) |

### Documentação técnica avançada (engenheiro QA)

| Agente | CLAUDE.md (espec) | Setup | Outros |
|---|---|---|---|
| AT | [agent-at/CLAUDE.md](agent-at/CLAUDE.md) | — | — |
| Playwright | [agent-playwright/CLAUDE.md](agent-playwright/CLAUDE.md) | [SETUP.md](agent-playwright/.claude/SETUP.md) | [PROJECT_BOOTSTRAP](agent-playwright/.claude/PROJECT_BOOTSTRAP.md) · [commands](agent-playwright/.claude/commands.md) · [prose-patterns](agent-playwright/.claude/prose-patterns.md) |
| DB | [agent-db/CLAUDE.md](agent-db/CLAUDE.md) | — | — |

### Externos

- [Claude Code](https://code.claude.com/) — CLI usado para operar os agentes
- [Playwright](https://playwright.dev/) — framework de testes E2E
- [Allure Report](https://allurereport.org/) — relatório executivo do regressivo
- [TestLink XML](https://testlink.org/) — formato de troca entre AT e Playwright

---

## Convenções gerais

- **Branches por projeto**: cada projeto Twygo (ex.: `project/kit-de-marca`, `project/widgets`) vive na própria branch a partir de `master`. Detalhe: [agent-playwright/.claude/PROJECT_BOOTSTRAP.md](agent-playwright/.claude/PROJECT_BOOTSTRAP.md).
- **Slug de projeto**: lowercase com hífens (ex.: `widgets`, `kit-de-marca`).
- **Ambiente padrão**: `staging` (`stage10.stage.twygoead.com`). Ver `agent-playwright/config/environment.json`.
- **Pasta `outputs/`/`output/`**: 100% gerada pelos agentes — **nunca commitar**, está no `.gitignore`.
- **Credenciais**: sempre em `.env` (gitignored), referenciadas via `${VAR}` em arquivos de config (ex: `agent-playwright/config/environment.json`). **Nunca commitar `.env`**. Cada agente que precisa de credenciais traz seu próprio `.env.example`.

---

## Suporte

- Dúvidas sobre o monorepo: pergunte no canal do time de QA.
- Bugs nos agentes: abrir issue no repositório.
- Solicitação de novo agente ou melhoria: documentar caso de uso e levar ao time.
