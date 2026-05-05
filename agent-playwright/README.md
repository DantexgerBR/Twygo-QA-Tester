# Agente Playwright — QA Twygo

Agente que **converte XML TestLink em testes Playwright executáveis**, roda contra a plataforma Twygo, e gera relatórios. É operado via [Claude Code](https://code.claude.com/) — você fala em linguagem natural, ele orquestra parser + planner + generator + execução + relatório.

> **Quem é o público deste README?** Estagiários, QAs novos no time, ou qualquer pessoa começando a usar o agente. Para detalhes técnicos avançados, ver [CLAUDE.md](CLAUDE.md).

---

## Sumário

1. [O que ele faz e quando usar](#o-que-ele-faz-e-quando-usar)
2. [Pré-requisitos](#pré-requisitos)
3. [Setup (primeira vez na máquina)](#setup-primeira-vez-na-máquina)
4. [Iniciando um projeto novo](#iniciando-um-projeto-novo)
5. [Fluxo dia-a-dia: testar 1 bloco entregue](#fluxo-dia-a-dia-testar-1-bloco-entregue)
6. [Fluxo regressivo: fim de projeto](#fluxo-regressivo-fim-de-projeto)
7. [Healing: teste quebrou depois de mudança de UI](#healing-teste-quebrou-depois-de-mudança-de-ui)
8. [Estrutura de pastas](#estrutura-de-pastas)
9. [Comandos de referência](#comandos-de-referência)
10. [Variáveis de ambiente](#variáveis-de-ambiente)
11. [Troubleshooting comum](#troubleshooting-comum)
12. [Onde aprender mais](#onde-aprender-mais)

---

## O que ele faz e quando usar

**Em uma frase:** você dá um XML do agente AT → ele gera specs Playwright + Page Objects + relatório executivo Allure, e mantém esses testes ao longo do projeto.

### Use este agente quando:
- Acabou de receber um XML do agente AT e precisa traduzir em testes E2E.
- Dev entregou um bloco do projeto (1 testsuite) e você quer validar só aquela parte.
- Fim do projeto: quer rodar regressivo completo (todas as suítes).
- Spec quebrou após mudança de UI e você quer healing automático.

### NÃO use este agente para:
- Validações em banco de dados → use [agent-db](../agent-db/) (em construção).
- Análise de teste a partir de Discovery/Spike → use [agent-at](../agent-at/).
- Testes de API puros (sem UI).

---

## Pré-requisitos

| Ferramenta | Versão mínima | Onde baixar |
|---|---|---|
| **Claude Code CLI** | latest | https://code.claude.com/ |
| **Node.js** | 20 ou superior | https://nodejs.org/ |
| **Java JRE 17** *(só para regressivo Allure)* | 17 | https://adoptium.net/ |

> Sem Java o **fluxo dia-a-dia funciona normalmente**. Java só é exigido pelo `npm run agent:regression` (que invoca o Allure CLI no fim).

---

## Setup (primeira vez na máquina)

A partir da raiz do monorepo:

```bash
cd agent-playwright

# 1. Instalar dependências Node
npm install

# 2. Instalar o browser que o Playwright vai usar
npx playwright install chromium

# 3. Conferir que TypeScript compila limpo
npm run typecheck
```

Se os 3 passos terminaram sem erro, abra o Claude Code:

```bash
claude
```

Dentro do Claude Code, instale o plugin oficial Playwright (subagents que o orquestrador usa para planner/generator/healer):

```
/plugin install playwright
```

Conferir que está OK:

```
/plugins
```

Deve aparecer `playwright` na lista.

> **Detalhes do setup** (Java, MCPs opcionais, GitHub MCP): [.claude/SETUP.md](.claude/SETUP.md).

---

## Iniciando um projeto novo

Quando você começa um projeto novo Twygo (ex.: "Widgets"), o ritual é:

### 1. Criar branch dedicada

```bash
git checkout master
git pull origin master
git checkout -b project/widgets
```

> Convenção: `project/<slug>` em lowercase com hífens. Ex.: `project/kit-de-marca`, `project/widgets`.

### 2. Receber o XML do agente AT

O agente AT gera um XML TestLink a partir do XMind. Coloque o arquivo em `inputs/`:

```
inputs/Analise_Teste_Widgets.xml
```

### 3. Atualizar `config/project.config.json`

Edite com o nome do projeto e o caminho do XML:

```jsonc
{
  "projectName": "Widgets",
  "testAnalysisFile": "inputs/Analise_Teste_Widgets.xml",
  "environment": "staging",
  "browsers": ["chromium"],
  // ...
}
```

### 4. Validar

```bash
npm run typecheck       # deve passar limpo
npm run agent:parse     # parseia o XML
npm run agent:suites    # lista as testsuites do projeto
```

A última saída mostra os blocos do projeto (1 bloco do XLSX ≈ 1 testsuite no XML).

> **Checklist completo + commits**: [.claude/PROJECT_BOOTSTRAP.md](.claude/PROJECT_BOOTSTRAP.md).

---

## Fluxo dia-a-dia: testar 1 bloco entregue

Quando o dev entrega 1 bloco do projeto e você quer validar só aquela testsuite:

### Opção A — Suíte já gerada (rerun)

Se os specs já existem em `tests/features/<slug>/`, basta executar:

```bash
# Lista as testsuites pra confirmar o nome literal
npm run agent:suites

# Roda só aquela suíte (parser → execução → validador → relatório)
npm run agent:run -- --suite "[Kit de marca] QA 2.1 - Identificação"
```

### Opção B — Suíte ainda não gerada (primeira vez)

Quando ainda não existem specs (ou o XML mudou e precisa regerar), use o Claude Code interativo:

```bash
cd agent-playwright
claude
```

E peça em linguagem natural:

```
> Execute o orquestrador para a suíte "[Kit de marca] QA 2.1 - Identificação"
```

Claude carrega o `CLAUDE.md` + skills locais e segue as 9 fases canônicas (parse → recon → plan → generate → execute → validate → report).

### O que esperar de saída

```
outputs/reports/{slug-suite}_{timestamp}/index.html
outputs/reports/latest-suite-{slug}.html       (atalho pra última run)
```

Abra o `index.html` no navegador pra ver:
- ✅ Casos passados / ❌ falhados
- 📷 Screenshots e traces das falhas
- 🔍 Findings exploratórios (console errors, axe-core, HTTP 4xx/5xx)

---

## Fluxo regressivo: fim de projeto

Quando todos os blocos passaram individualmente e você quer rodar **tudo de uma vez** com relatório executivo:

```bash
npm run clean              # apaga outputs/ antigos
npm run agent:regression   # roda tudo + Allure CLI
```

> Internamente equivale a: `npm run agent:parse && REGRESSION=true npm run agent:run -- --regression && npm run agent:explore && npm run agent:report -- --regression`.

Saída:
- `outputs/allure-report/index.html` — relatório executivo Allure (com tendência histórica em CI/GH Pages)
- `outputs/reports/regression_{timestamp}/` — HTML estruturado por suíte

> Em CI, o workflow `.github/workflows/regression.yml` roda automaticamente em PR para `main`.

---

## Healing: teste quebrou depois de mudança de UI

Quando um spec falha porque um seletor mudou (não bug funcional), peça healing dentro do Claude Code:

```bash
cd agent-playwright
claude
```

```
> Invocar o healer do plugin Playwright para tests/features/<arquivo>.spec.ts
```

O healer:
1. Lê o spec + screenshot da falha + DOM atual via Playwright MCP
2. Identifica o que mudou (seletor, espera, asserção)
3. Propõe correção via diff

Você revisa, aprova, commita.

> **Healer NUNCA muda intenção do teste** — só seletor, timing ou asserção. Para mudar o que o teste valida, o XML do agente AT precisa ser atualizado primeiro.

---

## Estrutura de pastas

```
agent-playwright/
├── CLAUDE.md                       # Especificação técnica (engenharia QA sênior)
├── README.md                       # Este arquivo
├── package.json · tsconfig.json    # Node + TypeScript
├── playwright.config.ts            # Config Playwright (lê env/project.config)
├── .mcp.json                       # MCPs registrados (Playwright MCP)
│
├── config/
│   ├── environment.json            # baseUrl + credenciais (referencia ${VAR})
│   └── project.config.json         # nome do projeto, XML, exploratório, etc.
│
├── inputs/
│   ├── Analise_Teste_<projeto>.xml # XML do AT (fonte única de verdade)
│   └── recon-<slug>.md             # Catálogo de test-ids/labels (gerado)
│
├── src/
│   ├── pages/                      # Page Objects (BasePage + Login + Dashboard + ...)
│   ├── fixtures/                   # Fixtures (exploratório, etc.) — auto-aplicadas
│   └── utils/                      # Helpers (environment, constants, testIds, modals)
│
├── tests/
│   ├── auth/                       # Specs de referência da tela de login
│   ├── features/                   # Specs gerados pelo orquestrador (1 dir por suíte)
│   ├── seed.spec.ts                # Seed do generator (não é caso de teste)
│   └── setup/
│       ├── global-setup.ts         # Login 1× → grava storageState
│       └── smoke.spec.ts           # Pre-flight (Fase 1.5)
│
├── specs/                          # Test plans gerados pelo planner (Markdown)
│
├── outputs/                        # 100% gerado — gitignored
│   ├── .auth/storage.json          # storageState do globalSetup
│   ├── reports/                    # HTML estruturado por execução
│   ├── allure-report/              # Allure (modo regressivo)
│   └── (screenshots, traces, logs, exploratory-findings.json)
│
└── .claude/
    ├── SETUP.md                    # Instalação inicial (Java, MCPs, plugin)
    ├── PROJECT_BOOTSTRAP.md        # Ritual de novo projeto
    ├── commands.md                 # Referência de comandos
    ├── prose-patterns.md           # Padrões prosa PT-BR → Playwright
    ├── agents/                     # Subagents oficiais Playwright (planner/generator/healer)
    └── skills/                     # Skills locais Twygo (orchestrator, parser, recon, etc.)
```

---

## Comandos de referência

### Setup
```bash
npm install                              # instalar dependências Node
npx playwright install chromium          # instalar browser
npm run typecheck                        # tsc --noEmit (deve passar limpo)
```

### Inspeção do XML do agente AT
```bash
npm run agent:parse                      # XML TestLink → JSON estruturado
npm run agent:suites                     # listar testsuites disponíveis
npm run agent:recon -- --suite "<nome>"  # mapear test-ids/labels da área da suíte
```

### Execução
```bash
npm run agent:smoke                      # só smoke pre-flight (~10s)
npm run agent:run -- --suite "<nome>"    # per-suite (dia-a-dia)
npm run agent:regression                 # tudo + Allure (fim de projeto)
npm run test                             # Playwright puro (sem orquestração)
npm run test:headed                      # com browser visível
npm run test:ui                          # Playwright UI mode (debug interativo)
npm run test:debug                       # debug step-by-step
```

### Pós-execução
```bash
npm run agent:explore                    # consolida findings exploratórios
npm run agent:report                     # gera relatório (per-suite ou regressivo)
npm run test:report                      # abre o HTML report do Playwright
```

### Limpeza
```bash
npm run clean                            # apaga outputs/
```

> **Flags do orquestrador** (`--suite`, `--all`, `--regression`, `--no-explore`, `--no-report`, `--no-preflight`, `--list`, `--smoke-only`): [.claude/commands.md](.claude/commands.md).

---

## Variáveis de ambiente

Crie `.env` na raiz do agente (gitignored):

```bash
TWYGO_STAGING_USER=qa@twygo.com
TWYGO_STAGING_PASS=<senha do staging>

# Opcionais:
EXPLORATORY_STRICT=1     # promove findings exploratórios (axe, console errors) a falhas
LOG_LEVEL=debug          # output verbose dos scripts
REGRESSION=true          # ativa reporter Allure (geralmente setado pelo agent:regression)
```

`config/environment.json` resolve `${TWYGO_STAGING_USER}` automaticamente.

---

## Troubleshooting comum

### `Smoke test falhou — não vou prosseguir com planner/execução`
storageState corrompido ou ambiente Twygo fora do ar. Force relogin apagando o storage:

```bash
# Linux / macOS / Git Bash
rm -rf outputs/.auth

# Windows PowerShell
Remove-Item -Recurse -Force outputs/.auth

# Windows CMD
rmdir /s /q outputs\.auth
```

E rode novamente:

```bash
npm run agent:smoke
```

Se ainda falhar, confira que a baseURL do staging está acessível e que as credenciais em `.env` estão corretas.

### `Cannot find module 'allure-js-commons'`
```bash
npm install
```
Allure facade vem deste pacote, **não** de `allure-playwright`.

### `java.io.FileNotFoundException: ...lib\tzdb.dat` (modo regressivo)
JRE incompleta. Instale [Adoptium Temurin 17](https://adoptium.net/) e configure `JAVA_HOME`:

```bash
# Windows CMD
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot

# Windows PowerShell
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot"

# macOS
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Linux
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

### Spec falha em "checkbox not interactive"
Sync alert do Twygo deixa container `aria-disabled`. Use:

```ts
await editPage.assetText.click({ force: true });
// OU
if (!(await editPage.isSyncBlocking())) { ... }
```

Documentado em [CLAUDE.md §7.5](CLAUDE.md).

### `getByLabel(/e-?mail/i)` bate em checkbox errado
Twygo tem labels específicos. Use:

```ts
page.getByRole('textbox', { name: 'Login' });
```

### `Environment "staging" não encontrado em config/environment.json`
Verifique que `config/project.config.json` tem `"environment": "staging"` e que `config/environment.json` tem a chave `staging`.

### Login real está sendo executado em todo teste
Erro do generator. Specs gerados **não devem** chamar `loginPage.login()` — o `globalSetup` já cobre via storageState. Se vir spec novo com login boilerplate, abra issue ou refatore conforme [CLAUDE.md §7.6](CLAUDE.md) (anti-pattern A).

---

## Onde aprender mais

| Documento | Quando ler |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Antes de modificar o agente — princípios, regras duras, gotchas Twygo |
| [.claude/SETUP.md](.claude/SETUP.md) | Configurar Java, MCPs opcionais, GitHub MCP |
| [.claude/PROJECT_BOOTSTRAP.md](.claude/PROJECT_BOOTSTRAP.md) | Iniciar projeto novo (passo a passo + commits) |
| [.claude/commands.md](.claude/commands.md) | Referência completa de comandos npm + flags + env vars |
| [.claude/prose-patterns.md](.claude/prose-patterns.md) | Como o agente traduz prosa PT-BR do XML → Playwright |
| [Playwright Best Practices](https://playwright.dev/docs/best-practices) | Boas práticas oficiais Playwright |

---

## Próximos passos sugeridos

Acabou o setup? Faça este ciclo curto pra confirmar que tudo funciona:

1. `npm run agent:smoke` — confirma que login + ambiente estão OK
2. `npm run agent:suites` — lista as testsuites do projeto atual
3. `npm run agent:run -- --suite "<um nome da lista>"` — roda 1 suíte
4. Abra `outputs/reports/<slug>_<ts>/index.html` no navegador e confira o relatório

Se isso passou, você está pronto pro fluxo dia-a-dia.
