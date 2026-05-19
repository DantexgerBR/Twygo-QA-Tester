# Twygo QA Agents — Monorepo

Monorepo dos agentes de QA da Twygo. Cada agente vive em sua própria pasta,
é totalmente autossuficiente e roda de forma isolada — não há código,
dependências ou configuração compartilhada em runtime.

> **Quem é o público deste README?** Estagiários, QAs novos no time, ou
> qualquer pessoa começando a usar os agentes pela primeira vez.

---

## Sumário

1. [Visão geral](#visão-geral)
2. [Categorias e agentes](#categorias-e-agentes)
3. [Pré-requisitos (uma vez na máquina)](#pré-requisitos-uma-vez-na-máquina)
4. [Quickstart](#quickstart)
5. [Fluxo completo de um projeto Twygo](#fluxo-completo-de-um-projeto-twygo)
6. [Estrutura do monorepo](#estrutura-do-monorepo)
7. [Convenções gerais](#convenções-gerais)
8. [Onde aprender mais](#onde-aprender-mais)

---

## Visão geral

O time de QA Twygo opera com agentes especializados que trabalham em
sequência, cada um numa fase do ciclo de QA. O modelo é:

```
docs (Discovery + Spike + Quebra)
            │
            ▼
  agente upstream (análise de teste)
            │
            ▼  test-analysis.md  (canônico)
            │  + .xmind / .xml TestLink (derivados)
            │
            ▼
  agente(s) executor(es) primário(s)         ─── invoca validadores
  (cada suíte declara seu executor)              secundários quando o
            │                                    TC pede validação
            │                                    cruzada (DB, API)
            ▼
  outputs/<slug>/reports/<runId>/ (commitável)
```

Detalhes técnicos do contrato entre agentes em [`CONTRACT.md`](CONTRACT.md).
Mapa do ecossistema completo em [`CLAUDE.md`](CLAUDE.md).

---

## Categorias e agentes

Os agentes se organizam em **4 categorias** por papel no fluxo. A lista
abaixo cresce conforme novos agentes maturam.

### Upstream (produzem para outros)

| Agente | Pasta | Função | Stack | Status |
|---|---|---|---|---|
| **AT** (Análise de Teste) | [`agent-at/`](agent-at/) | Lê docs do projeto e gera AT canônica (MD + XMind + XML TestLink) | Python + Claude Code | ✅ Ativo |
| **Tasks QA** | `agent-tasks-qa/` | Quebra Discovery/Spike em atividades de QA (entrada do AT) | TBD | 📋 Planejado |

### Executores primários (1 por suíte)

| Agente | Pasta | Função | Stack | Status |
|---|---|---|---|---|
| **Playwright** | [`agent-playwright/`](agent-playwright/) | Executa testes E2E de UI a partir do AT canônico | TypeScript + Playwright + Claude Code | ✅ Ativo |
| **API** | `agent-api/` | Executa validações REST/GraphQL a partir do AT canônico | TBD (Pytest+Requests ou TS+Vitest) | 📋 Planejado |
| **DB** | [`agent-db/`](agent-db/) | Executa validações em banco a partir do AT canônico | Python + SQLAlchemy + Claude Code | 🚧 Esqueleto |
| **Pentest** | `agent-pentest/` | Executa testes de penetração/segurança (OWASP, ZAP) | TBD | 📋 Planejado |

### Validadores acionáveis (mesmos agentes acima em modo sub-rotina)

Quando o executor primário (ex.: Playwright) precisa validar algo fora do
seu domínio (banco, API), invoca `agent-db` / `agent-api` como sub-rotina
via filesystem + CLI. Mesmo binário, modo de chamada diferente. Detalhes
no [CONTRACT.md §11 (V2)](CONTRACT.md).

### Produtor de docs de usabilidade

| Agente | Pasta | Função | Stack | Status |
|---|---|---|---|---|
| **Docs QA** | `agent-docs-qa/` | Produz documentação de usabilidade para o usuário final do produto Twygo | TBD | 📋 Planejado |

### Decisão rápida

| Você precisa de... | Use |
|---|---|
| Transformar Discovery/Spike em AT detalhada | [agent-at](agent-at/) |
| Rodar testes E2E de UI a partir do AT | [agent-playwright](agent-playwright/) |
| Validar consequências em banco (registros, FKs, views) | [agent-db](agent-db/) — esqueleto |
| Validar endpoints REST/GraphQL | agent-api (planejado) |
| Auditar segurança (OWASP, ZAP) | agent-pentest (planejado) |
| Gerar documentação de usabilidade do produto | agent-docs-qa (planejado) |

---

## Pré-requisitos (uma vez na máquina)

| Ferramenta | Usado por | Versão mínima | Onde baixar |
|---|---|---|---|
| **Claude Code CLI** | todos os agentes | latest | https://code.claude.com/ |
| **Node.js** | agentes TypeScript (agent-playwright) | 20+ | https://nodejs.org/ |
| **Python** | agentes Python (agent-at, agent-db) | 3.10+ | https://python.org/ |
| **Java JRE 17** | agent-playwright (regressivo Allure) | 17+ | https://adoptium.net/ |
| **XMind Desktop** | agent-at (visualizar XMind derivado — opcional) | qualquer | https://xmind.app/ |
| **Git** | todos | 2.30+ | https://git-scm.com/ |

> Cada agente lista seus pré-requisitos específicos no próprio README.
> Acima é o consolidado dos ativos hoje. Agentes futuros adicionam suas
> próprias ferramentas (Python pra API, Docker pra pentest etc.).

---

## Quickstart

Cada agente é executado a partir da sua própria pasta. O Claude Code carrega
apenas o `CLAUDE.md` e as skills de `.claude/skills/` daquela pasta — os
agentes **não enxergam um ao outro**. A comunicação entre eles é por
filesystem (cópia do `test-analysis.md` canônico).

### Padrão genérico de quickstart por agente

```bash
cd agent-<nome>
# Setup da stack (npm install / pip install / etc — ver README do agente)
claude
```

Dentro do Claude Code, invocar o comando inicial documentado no
`agent-<nome>/CLAUDE.md` ou `agent-<nome>/README.md` (geralmente um
`/analyze-test`, `/run-suite`, ou similar).

### Quickstart por agente ativo

#### Agente AT

```bash
cd agent-at
claude
> /analyze-test                # após depositar docs em projects/<slug>/docs/
```

> Detalhes: [agent-at/README.md](agent-at/README.md)

#### Agente Playwright

```bash
cd agent-playwright
npm install                          # primeira vez
npx playwright install chromium      # primeira vez
npm run typecheck                    # confirmar setup
claude
> /plugin install playwright         # primeira vez
```

> Detalhes: [agent-playwright/README.md](agent-playwright/README.md)

#### Agente DB (esqueleto)

```bash
cd agent-db
# (pendente implementação — ver agent-db/README.md)
```

> Detalhes: [agent-db/README.md](agent-db/README.md)

---

## Fluxo completo de um projeto Twygo

Suponha que chega um projeto novo: **"Widgets"** (com Discovery + planilha
de quebra de atividades).

### 1. Análise de teste

```bash
cd agent-at
mkdir -p projects/widgets/docs
# Depositar documentos do projeto em projects/widgets/docs/
#   - [Discovery] Widgets.docx
#   - Quebra de atividades - Widgets.xlsx
claude
> /analyze-test
```

Saída em `agent-at/projects/widgets/output/`:
- `test-analysis.md` (canônico — fonte de verdade)
- `Analise_Teste_Widgets.xmind` (derivado — visualização opcional)
- `Analise_Teste_Widgets.xml` (derivado — importação no TestLink)

Revise o `test-analysis.md` (e XMind se preferir visual), peça ajustes ao
agente se necessário. O AT regenera os 3 arquivos juntos quando alterado.

### 2. Fluxo manual (TestLink) — opcional, em paralelo

Importe `Analise_Teste_Widgets.xml` no TestLink Web. Equipe de QA manual
executa via TestLink normalmente. Esse fluxo continua 100% inalterado pela
adoção do MD canônico.

### 3. Execução automatizada

```bash
cd ../agent-playwright

# Criar branch dedicada do projeto
git checkout master
git pull
git checkout -b project/widgets

# Criar pasta do projeto
mkdir -p projects/widgets/{inputs,specs,tests/features,pages,utils}

# Receber MD canônico do AT
cp ../agent-at/projects/widgets/output/test-analysis.md projects/widgets/inputs/

# Criar projects/widgets/project.config.json (nome + env)

npm run agent:parse -- --project widgets    # parsear MD canônico
npm run agent:suites -- --project widgets   # listar suítes

# Por cada bloco entregue pelo dev:
npm run agent:run -- --project widgets --suite "<nome literal da suíte>"
```

Saída: `agent-playwright/outputs/widgets/reports/{slug-suite}_{timestamp}/index.md`.

> Suítes da AT com `executor: api` rodam pelo agent-api (futuro). Suítes
> com `executor: db` rodam pelo agent-db. Cada executor primário tem seu
> próprio comando — mesmo padrão acima adaptado à stack.

### 4. Validações cruzadas (V2 — quando agent-api/db rodarem standalone)

Quando uma suíte com `executor: playwright` declara validações secundárias
no MD canônico (ex.: validar que UI criou registro no banco), o Playwright
invoca o agent correspondente como sub-rotina. Especificação no
[CONTRACT.md §11](CONTRACT.md).

Hoje (v1) essas validações ainda são manuais.

### 5. Regressivo no fim do projeto

```bash
cd agent-playwright
npm run clean
npm run agent:regression
```

Saída: `outputs/allure-report/index.html` (executivo Allure) + Markdown
estruturado por suíte (`outputs/reports/<slug>_<ts>/index.md`).

### 6. Encerramento

A branch `project/<slug>` fica preservada como histórico do projeto.
Próximo projeto começa numa branch nova a partir do master.

---

## Estrutura do monorepo

```
.
├── README.md                       # este arquivo
├── CLAUDE.md                       # regras meta + mapa do ecossistema
├── CONTRACT.md                     # contrato cross-agente (schema do MD canônico)
├── .gitignore                      # gitignore unificado
├── .github/
│   └── workflows/                  # 1 workflow por agente (regression.yml ativo; outros virão)
│
├── shared/                         # fatos do produto Twygo (cross-agente — não código)
│   └── twygo-platform.md           # URLs, orgIds, modais, gotchas Twygo
│
├── agent-at/                       # Agente upstream — Análise de Teste
│   ├── README.md · CLAUDE.md
│   ├── projects/<slug>/{docs,output}/   # 1 subpasta por projeto Twygo
│   ├── template/template.xmind     # template base compartilhado
│   └── .claude/skills/
│
├── agent-playwright/               # Agente executor primário — UI E2E
│   ├── README.md · CLAUDE.md
│   ├── package.json · playwright.config.ts
│   ├── config/environment.json     # baseUrl/orgId/paths (credenciais via ${VAR} → .env)
│   ├── .env.example
│   ├── projects/<slug>/            # 1 subpasta por projeto Twygo
│   ├── tests/{auth,setup}/         # specs e setup compartilhados
│   ├── src/                        # Page Objects + fixtures + utils (genérico)
│   ├── outputs/                    # gerado (parcialmente commitável; ver agent-playwright/CLAUDE.md §4.1)
│   └── .claude/                    # SETUP, PROJECT_BOOTSTRAP, commands, skills, agents
│
├── agent-db/                       # Agente executor primário — DB (esqueleto)
│   ├── README.md · CLAUDE.md
│   ├── requirements.txt
│   ├── inputs/                     # casos de teste de DB
│   ├── output/                     # relatórios (gerado, gitignored)
│   ├── src/                        # connections + queries + validators (em construção)
│   └── .claude/skills/
│
└── [agent-tasks-qa, agent-api, agent-pentest, agent-docs-qa — entram aqui no futuro]
```

> **Regra de isolamento:** arquivos na raiz permitidos são `README.md`,
> `CLAUDE.md`, `CONTRACT.md` e a pasta `shared/`. Demais artefatos de
> agente (`package.json`, `playwright.config.ts`, `requirements.txt` etc.)
> ficam dentro de `agent-*/`.

---

## Convenções gerais

- **Branches por projeto**: cada projeto Twygo (ex.: `project/widgets`,
  `project/creditos-fase-02`) vive na própria branch a partir de `master`.
  Detalhe: [agent-playwright/.claude/PROJECT_BOOTSTRAP.md](agent-playwright/.claude/PROJECT_BOOTSTRAP.md).
- **Slug de projeto**: lowercase com hífens (ex.: `widgets`, `creditos-fase-02`).
- **Pasta `projects/<slug>/`**: cada agente que opera por projeto segue
  essa convenção uniforme. Permite paralelismo (2+ projetos ao mesmo tempo)
  e onboarding consistente entre agentes.
- **Ambiente padrão**: slug `staging` (valor concreto no `.env` de cada
  agente). Convenção de naming e sufixos semânticos em
  [`shared/twygo-platform.md §1`](shared/twygo-platform.md).
- **Pasta `outputs/`/`output/`**: 100% gerada — políticas de gitignore
  variam por agente (ver CLAUDE.md de cada um). Mas em nenhum caso editar
  manualmente.
- **Credenciais**: sempre em `.env` (gitignored), referenciadas via `${VAR}`
  em arquivos de config. **Nunca commitar `.env`**. Cada agente que precisa
  de credenciais traz seu próprio `.env.example`.
- **MD canônico do AT é fonte de verdade**: editar `test-analysis.md`,
  não o XMind/XML diretamente. Derivados são regenerados.

---

## Onde aprender mais

### Por agente (ativos)

| Agente | README | CLAUDE.md (espec técnica) |
|---|---|---|
| Análise de Teste | [agent-at/README.md](agent-at/README.md) | [agent-at/CLAUDE.md](agent-at/CLAUDE.md) |
| Playwright | [agent-playwright/README.md](agent-playwright/README.md) | [agent-playwright/CLAUDE.md](agent-playwright/CLAUDE.md) |
| DB | [agent-db/README.md](agent-db/README.md) | [agent-db/CLAUDE.md](agent-db/CLAUDE.md) |

### Cross-agente

| Documento | Propósito |
|---|---|
| [CLAUDE.md raiz](CLAUDE.md) | Regras meta + mapa do ecossistema + anatomia de agente novo |
| [CONTRACT.md](CONTRACT.md) | Schema do MD canônico + contrato entre agentes |
| [shared/twygo-platform.md](shared/twygo-platform.md) | Fatos do produto Twygo (URLs, orgIds, modais) |

### Documentação técnica avançada (agente Playwright)

| Documento | Conteúdo |
|---|---|
| [SETUP.md](agent-playwright/.claude/SETUP.md) | Instalação inicial (Node, MCPs, plugin Playwright) |
| [PROJECT_BOOTSTRAP.md](agent-playwright/.claude/PROJECT_BOOTSTRAP.md) | Ritual de iniciar projeto novo |
| [commands.md](agent-playwright/.claude/commands.md) | Comandos npm + flags + env vars |
| [prose-patterns.md](agent-playwright/.claude/prose-patterns.md) | Mapeamento prosa PT-BR → Playwright |

### Externos

- [Claude Code](https://code.claude.com/) — CLI usado para operar os agentes
- [Playwright](https://playwright.dev/) — framework de testes E2E
- [Allure Report](https://allurereport.org/) — relatório executivo do regressivo
- [TestLink](https://testlink.org/) — ferramenta de gestão de testes manuais (consome o XML derivado do AT)
- [XMind](https://xmind.app/) — visualização do XMind derivado (opcional)

---

## Suporte

- Dúvidas sobre o monorepo: pergunte no canal do time de QA.
- Bugs nos agentes: abrir issue no repositório.
- Solicitação de novo agente ou melhoria: documentar caso de uso, levar ao
  QA Lead, abrir PR seguindo o checklist da seção "Anatomia de um agente
  novo" no [CLAUDE.md raiz](CLAUDE.md).
