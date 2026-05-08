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

Dentro do Claude Code, instale o marketplace oficial do Claude e plugin oficial do Playwright (subagents que o orquestrador usa para planner/generator/healer):

```
claude plugin marketplace add anthropics/claude-plugins-official
claude plugin install playwright@claude-plugins-official
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

### 2. Criar a pasta do projeto

```bash
mkdir -p projects/widgets/{inputs,specs,tests/features,pages,utils}
```

### 3. Receber o XML do agente AT

O agente AT gera um XML TestLink a partir do XMind. Coloque o arquivo em `projects/widgets/inputs/`:

```
projects/widgets/inputs/Analise_Teste_Widgets.xml
```

### 4. Criar `projects/widgets/project.config.json`

Use [`projects/creditos-fase-02/project.config.json`](projects/creditos-fase-02/project.config.json) como referência. Mínimo:

```jsonc
{
  "projectName": "Widgets",
  "testAnalysisFile": "inputs/Analise_Teste_Widgets.xml",
  "environment": "staging",
  "browsers": ["chromium"],
  "headless": true,
  "reporting": {
    "format": "html",
    "outputDir": "outputs",
    "screenshotsOnFailure": true
  },
  "performance": {
    "enableTracing": true,
    "enableVideo": false
  },
  "exploratory": {
    "enabled": true,
    "scopedRoutes": [],
    "scopedKeywords": []
  }
}
```

> O caminho de `testAnalysisFile` é **relativo ao diretório do projeto** (`projects/widgets/`), não à raiz do agente.

### 5. Sanity check de configuração

```bash
npm run typecheck                          # deve passar limpo
npm run agent:parse -- --project widgets   # parseia o XML do projeto
npm run agent:suites -- --project widgets  # lista as testsuites disponíveis
```

Se os 3 comandos terminaram sem erro, o XML está válido e o projeto está pronto pra preparação + geração de specs.

> Se `projects/` tiver **só 1 projeto**, a flag `--project` é opcional — o agente auto-detecta. Quando houver 2+ projetos coexistindo (na master cumulativa), a flag é obrigatória.

### 6. Preparar storageState (login global 1×)

```bash
npm run agent:smoke -- --project widgets
```

Faz login no env primário (e no secundário se houver `*-without-credits` ou `*-widgets-disabled` em `environment.json`) e grava `outputs/.auth/storage.json`. Specs reusam esse storage — não logam por teste.

> Idempotente: o smoke detecta storage fresco (<30min) e não re-loga sem necessidade.

### 7. Gerar specs por bloco (primeira vez)

Para **cada testsuite** que você quer cobrir, rode este ciclo: recon → plan + generate → run. Faça **uma de cada vez** — generator funciona melhor com escopo enxuto e dá pra revisar diff por bloco.

#### 7.1. Recon da área (opcional, recomendado)

```bash
# Linux / macOS / Git Bash
PROJECT=widgets npm run agent:recon -- --suite "Listagem de painéis"

# Windows PowerShell
$env:PROJECT="widgets"; npm run agent:recon -- --suite "Listagem de painéis"
```

Loga no app, navega na área da testsuite, captura test-ids/roles/labels e salva em `projects/<slug>/inputs/recon-<slug-suite>.md`. O planner consome isso depois e corta ~70% do tempo de exploração live.

> A flag `--project` ainda não é parseada por `agent:recon` — use a env var `PROJECT=<slug>` (ou rode dentro de um shell já exportado).

#### 7.2. Plan + Generate (interativo via Claude Code)

```bash
claude
```

Dentro do Claude Code, peça em linguagem natural:

```
Execute o orquestrador para a suite "Listagem de painéis"
```

O agente:
1. Carrega `CLAUDE.md` + skill `twygo-test-orchestrator`
2. Despacha o subagent **planner** (exploração live → plano em `projects/<slug>/specs/<slug-suite>-plan.md`)
3. Despacha o subagent **generator** (Page Objects em `projects/<slug>/pages/` + specs em `projects/<slug>/tests/features/<slug-suite>/`)
4. Roda `npm run typecheck`

> Testcases com pré-condição não satisfeita (dados não seedados, env não disponível) saem do generator com `test.fixme(true, "<motivo>")` — não chutamos.

#### 7.3. Executar e validar a suite gerada

```bash
npm run agent:run -- --project widgets --suite "Listagem de painéis"
```

Pre-flight + Playwright filtrado por suite + validador exploratório + relatório. Saída:

```
outputs/widgets/reports/listagem-de-paineis_{timestamp}/index.md
outputs/reports/latest-suite-listagem-de-paineis.md
```

Se algum teste quebrar por seletor após mudança de UI, use **healing** (ver [seção dedicada](#healing-teste-quebrou-depois-de-mudança-de-ui)).

### 8. Iterar pelos demais blocos

Repita **7.1 → 7.3** para cada testsuite do projeto. Cada bloco vira um diretório em `projects/<slug>/tests/features/<slug-suite>/` com 1 `.spec.ts` por testcase.

### 9. Geração completa / regressivo final

Quando os blocos individuais estiverem todos passando, rode o projeto inteiro:

```bash
# Todas as suítes do projeto (pre-flight → execução completa → report)
npm run agent:run -- --project widgets

# Regressivo final com Allure CLI + GH Pages (fim de projeto)
npm run agent:regression -- --project widgets
```

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
outputs/reports/{slug-suite}_{timestamp}/index.md
outputs/reports/latest-suite-{slug}.md       (atalho pra última run)
```

Abra o `index.md` no IDE/GitHub pra ver:
- ✅ Casos passados / ❌ falhados
- 📷 Screenshots inline e link pro trace nas falhas
- 🔍 Findings exploratórios (console errors, axe-core, HTTP 4xx/5xx) em [`exploratory.md`](#)

---

## Fluxo regressivo: fim de projeto

Quando todos os blocos passaram individualmente e você quer rodar **tudo de uma vez** com relatório executivo:

```bash
npm run clean              # apaga outputs/ antigos
npm run agent:regression   # roda tudo + Allure CLI
```

> Internamente equivale a: `npm run agent:parse && REGRESSION=true npm run agent:run -- --regression && npm run agent:explore && npm run agent:report -- --regression`.

Saída:
- `outputs/allure-report/index.html` — relatório executivo Allure (HTML built-in, com tendência histórica em CI/GH Pages)
- `outputs/reports/regression_{timestamp}/` — Markdown estruturado por suíte (`index.md` + `tests.md` + `exploratory.md` + JSONs)

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

### Auto-PR pós-heal (opt-in)

Se você ativou o **GitHub MCP** ([SETUP.md §3.2](.claude/SETUP.md)), o orquestrador oferece abrir um PR automaticamente após você aprovar as correções do healer. Fluxo:

1. Healer aplicou correções e você aprovou o diff.
2. Orquestrador detecta MCP `github` ativo → cria branch `fix/heal-<slug>-<timestamp>` (se você estava em `master`), commita, push, abre PR.
3. Você recebe a URL do PR no chat — review humano continua seu.

Sem o GitHub MCP ativo, a Etapa 8.5 é pulada silenciosamente — fluxo manual segue funcionando como sempre. Detalhes em [twygo-test-orchestrator SKILL.md](.claude/skills/twygo-test-orchestrator/SKILL.md) Etapa 8.5.

---

## Estrutura de pastas

A separação é entre **infra do agente** (compartilhada por projetos) e **conteúdo do projeto** (em `projects/<slug>/`):

```
agent-playwright/
├── CLAUDE.md                       # Especificação técnica (engenharia QA sênior)
├── README.md                       # Este arquivo
├── package.json · tsconfig.json    # Node + TypeScript
├── playwright.config.ts            # Config Playwright (lê env/project.config)
├── .mcp.json                       # MCPs registrados (Playwright MCP)
│
├── config/
│   └── environment.json            # baseUrl + credenciais (compartilhado entre projetos)
│
├── projects/                       # 1 subpasta por projeto Twygo
│   └── <slug>/                     # ex.: creditos-fase-02, widgets
│       ├── project.config.json     # nome do projeto, XML, exploratório
│       ├── inputs/                 # XML TestLink + recons gerados
│       ├── specs/                  # Plans do planner (Markdown)
│       ├── tests/features/         # Specs gerados (1 dir por testsuite)
│       ├── pages/                  # Page Objects específicos do projeto
│       └── utils/                  # testIds + helpers específicos
│
├── src/                            # infra compartilhada — genérico Twygo
│   ├── pages/                      # BasePage, LoginPage, DashboardPage, SuperAdminPage
│   ├── fixtures/                   # Fixtures (exploratório, etc.) — auto-aplicadas
│   └── utils/                      # environment, constants, helpers, modals, exploratory, logger
│
├── tests/                          # specs e setup compartilhados
│   ├── auth/                       # Specs de referência da tela de login Twygo
│   ├── seed.spec.ts                # Seed do generator (não é caso de teste)
│   └── setup/
│       ├── global-setup.ts         # Login 1× → grava storageState
│       └── smoke.spec.ts           # Pre-flight universal (Fase 1.5)
│
├── outputs/                        # 100% gerado — gitignored
│   ├── .auth/storage.json          # storageState do globalSetup (compartilhado)
│   ├── <slug>/                     # 1 subpasta por projeto rodado
│   │   ├── test-results.json
│   │   ├── exploratory-findings.json
│   │   ├── reports/                # HTML estruturado por execução
│   │   ├── allure-report/          # Allure (modo regressivo)
│   │   └── (screenshots, traces, logs)
│   └── _all/                       # quando PROJECT_ALL=true (regressivo cumulativo)
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
npm run agent:parse                                     # XML TestLink → JSON estruturado
npm run agent:suites                                    # listar testsuites disponíveis
npm run agent:recon -- --suite "<nome>"                 # mapear test-ids/labels da área
```

### Execução
```bash
npm run agent:smoke                                     # só smoke pre-flight (~10s)
npm run agent:run -- --suite "<nome>"                   # per-suite (dia-a-dia)
npm run agent:run -- --project widgets --suite "<nome>" # explicitar projeto (quando há 2+)
npm run agent:regression                                # tudo + Allure (fim de projeto)
npm run test                                            # Playwright puro (sem orquestração)
npm run test:headed                                     # com browser visível
npm run test:ui                                         # Playwright UI mode (debug interativo)
npm run test:debug                                      # debug step-by-step
```

> **Sobre `--project <slug>`**: opcional quando `projects/` tem só 1 projeto (auto-detect). Obrigatório quando há 2+ (master cumulativa). Pode ser substituído por `export PROJECT=<slug>` (ou `$env:PROJECT="<slug>"` no PowerShell) antes do comando.

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

Copie o template e preencha:

```bash
cp .env.example .env
```

Variáveis obrigatórias (todas em `.env`):

```bash
TWYGO_STAGING_EMAIL=<email da conta de QA staging>
TWYGO_STAGING_PASSWORD=<senha staging>

# Para specs de bloqueio "sem créditos" (ver CLAUDE.md §7.5):
TWYGO_STAGING_WITHOUT_CREDITS_EMAIL=<email da conta zerada>
TWYGO_STAGING_WITHOUT_CREDITS_PASSWORD=<senha da conta zerada>

# Opcionais:
EXPLORATORY_STRICT=1     # promove findings exploratórios (axe, console errors) a falhas
LOG_LEVEL=debug          # output verbose dos scripts
REGRESSION=true          # ativa reporter Allure (geralmente setado pelo agent:regression)
```

`config/environment.json` referencia essas variáveis via `${VAR}` e
`src/utils/environment.ts#loadEnvironmentConfig()` resolve no boot. `.env`
está no `.gitignore` da raiz do monorepo — nunca commitar.

> Se aparecer `Variável de ambiente "TWYGO_*" referenciada em
> config/environment.json mas não definida`, sua `.env` está faltando ou
> incompleta. Use a skill `configurar-ambiente` (`.claude/skills/configurar-ambiente/SKILL.md`).

---

## Troubleshooting comum

### `Smoke test falhou — não vou prosseguir com planner/execução`

**Antes de mexer em qualquer coisa**, rode o checklist de 1min em
[.claude/skills/debugar-smoke-login/SKILL.md](.claude/skills/debugar-smoke-login/SKILL.md):

```bash
curl -sI https://<host-staging>/users/login | head -3   # 5xx? ambiente fora
grep -c '^TWYGO_.*=.\+$' .env                            # 4? .env completo
```

Se `curl` deu **5xx**: ambiente Twygo fora — **não mexa em código**, espere
voltar. Se `grep` deu **<4**: `.env` incompleto — `cp .env.example .env` e
preencha (skill `configurar-ambiente`).

Se ambos OK, storageState pode estar corrompido — apaga e re-roda:

```bash
rm -rf outputs/.auth   # Linux/macOS/Git Bash
# Remove-Item -Recurse -Force outputs/.auth   # Windows PowerShell
# rmdir /s /q outputs\.auth                   # Windows CMD
npm run agent:smoke
```

Outras causas (layout mudou, etc) cobertas no skill `debugar-smoke-login`.

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
4. Abra `outputs/reports/<slug>_<ts>/index.md` no IDE/GitHub e confira o relatório

Se isso passou, você está pronto pro fluxo dia-a-dia.
