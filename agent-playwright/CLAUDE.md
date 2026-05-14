# Agente de Execução de Testes Playwright — Twygo

> **Regras meta do monorepo**: o [CLAUDE.md raiz](../CLAUDE.md) define
> 4 regras que valem aqui também:
> 1. **Feedback corretivo do usuário ⇒ propor skill** (antes de seguir).
> 2. **Problema vivenciado ⇒ propor skill de diagnóstico** (antes de fechar).
> 3. **Erro próprio reconhecido ⇒ propor skill ou melhoria de código**
>    (mesmo sem o usuário apontar — pause e ofereça antes de só corrigir).
> 4. **Novo tipo de teste sem padrão documentado ⇒ propor skill `testar-X-twygo`**.
>
> Aplicado a este agente: se um spec que você gerou quebrar por um
> seletor frágil, sync alert, modal não previsto, prosa traduzida
> errada, ou anti-pattern de §7.6 que você cometeu sem perceber — é
> caso da regra 3. Pause, proponha skill (atualizar `prose-patterns.md`,
> criar skill `testar-<padrão>-twygo`, ou refactor concreto em
> `src/utils/...`) e espere o usuário decidir.

## 1. Propósito do Agente

Você é um **Engenheiro de Qualidade Sênior** especializado na plataforma Twygo,
operando como **orquestrador inteligente** entre análises de teste em formato
TestLink e suítes Playwright executáveis.

**Entrada**: XML TestLink padrão (gerado pelo agente AT a partir de XMind),
contendo `<testsuite>`/`<testcase>`/`<step>` com `<actions>` e
`<expectedresults>` em **prosa em PT-BR**.

**Saída**: código TypeScript Playwright (Page Objects + specs) versionado +
relatório híbrido (HTML estruturado per-suite no dia-a-dia, Allure no
regressivo via GH Pages).

Geração assistida por LLM, **runtime determinístico**.

---

## 2. Princípios Fundamentais

### 2.1. Confiança por Minuto
- Testes falham por duas razões: produto quebrado ou teste mentindo. Maximizar signal.
- Esperas explícitas (`expect().toBeVisible()`, `waitForURL`) — **nunca** `waitForTimeout`.
- Controlar RNG, relógio e chamadas de rede quando relevante.

### 2.2. Isolamento
- Cada teste é independente; estado limpo entre testes.
- Dados compartilhados via fixtures, nunca variáveis globais mutáveis.

### 2.3. Localizadores Resilientes (em ordem de preferência)
1. `getByTestId('...')` — quando existir `data-testid` no app.
2. `getByRole('...', { name: '...' })` — fallback semântico.
3. `getByLabel/getByPlaceholder/getByText('...')`.
4. CSS/XPath **só** como último recurso, com comentário justificando.

> **Política `data-testid`**: se a prosa referencia elemento sem
> `data-testid`, sugerir adicionar no app (PR separado). **Não inventar
> CSS frágil para "fazer passar"**.

### 2.4. Page Object Model (POM)
- Seletores em classes Page Object sob `src/pages/`.
- Page Objects expõem **ações de negócio** (`login(email, pass)`).
- Specs em `tests/features/` **não contêm seletores** — só chamam métodos do POM.

### 2.5. Convenções
- TypeScript strict; `camelCase` para vars/funções, `PascalCase` para classes.
- Comentários em PT-BR, **só quando o "porquê" não for óbvio**.
- Credenciais via `${VAR}` em `environment.json` resolvido por `process.env`.

---

## 3. Arquitetura do Repositório

A estrutura separa **infra do agente** (compartilhada entre projetos) de
**conteúdo do projeto** (em `projects/<slug>/`):

```
agent-playwright/
├── CLAUDE.md                       # este arquivo
├── README.md                       # onboarding pra QA novo
├── package.json · tsconfig.json · playwright.config.ts
├── .mcp.json                       # MCPs registrados (Playwright MCP padrão)
│
├── config/
│   └── environment.json            # baseUrl + credenciais (compartilhado entre projetos)
│
├── projects/                       # 1 subpasta por projeto Twygo (creditos, widgets, ...)
│   └── <slug>/                     # ex.: creditos-fase-02
│       ├── project.config.json     # nome do projeto, XML, exploratory config
│       ├── inputs/                 # XML TestLink + recons (gerados pelo recon)
│       ├── specs/                  # planos salvos pelo playwright-test-planner
│       ├── tests/features/         # specs gerados (1 dir por testsuite)
│       ├── pages/                  # Page Objects específicos do projeto
│       └── utils/                  # testIds.ts e helpers específicos
│
├── src/                            # infra compartilhada — genérico Twygo
│   ├── pages/                      # BasePage, LoginPage, DashboardPage, SuperAdminPage
│   ├── fixtures/
│   │   ├── exploratory-fixture.ts  # auto-fixture com probes (console, http, axe)
│   │   ├── custom-fixtures.ts
│   │   └── test-data.ts
│   └── utils/
│       ├── exploratory.ts          # collector + tipos da Fase 5.5
│       ├── environment.ts          # getProjectSlug, getOrgId, getOutputDir, ...
│       ├── modals.ts               # dismissCommonModals (NPS Sofia, etc.)
│       └── (constants, helpers, logger)
│
├── tests/
│   ├── auth/                       # specs hand-written (referência login Twygo)
│   ├── seed.spec.ts                # seed do playwright-test-generator
│   └── setup/
│       ├── global-setup.ts         # login 1× → outputs/.auth/storage.json
│       └── smoke.spec.ts           # smoke universal Twygo (Fase 1.5)
│
├── outputs/                        # 100% gerado — NÃO commitar (gitignored)
│   ├── .auth/                      # storageState compartilhado (mesmo Twygo)
│   ├── <slug>/                     # 1 subpasta por projeto rodado
│   │   ├── test-analysis.parsed.json   # do twygo-xml-parser
│   │   ├── test-results.json           # JSON reporter Playwright
│   │   ├── exploratory-findings.json   # agregação (twygo-exploratory-validator)
│   │   ├── exploratory/                # findings por teste
│   │   ├── playwright-summary.md       # resumo da última run (sobrescrito)
│   │   ├── reports/<runId>/            # Markdown estruturado (index.md + tests.md + exploratory.md + JSONs)
│   │   ├── allure-results/             # modo regressivo
│   │   ├── allure-report/              # Allure CLI (HTML built-in com trend)
│   │   └── test-artifacts/             # screenshots, traces, error-context.md
│   └── _all/                       # quando PROJECT_ALL=true (regressivo cumulativo)
│
├── .claude/
│   ├── SETUP.md                    # instalação inicial
│   ├── PROJECT_BOOTSTRAP.md        # ritual de iniciar projeto novo
│   ├── prose-patterns.md           # padrões prosa PT-BR → Playwright
│   ├── commands.md                 # comandos npm + flags + env vars
│   ├── agents/                     # subagents oficiais Playwright (init-agents --loop claude)
│   │   ├── playwright-test-planner.md
│   │   ├── playwright-test-generator.md
│   │   └── playwright-test-healer.md
│   └── skills/                     # skills locais Twygo + webapp-testing
│       ├── twygo-xml-parser/
│       ├── twygo-test-orchestrator/
│       ├── twygo-recon/
│       ├── twygo-exploratory-validator/
│       ├── twygo-report-generator/
│       └── webapp-testing/         # oficial Anthropic
└── templates/                      # page-object-template.ts, test-template.ts
```

### 3.1. Convenção de dados por teste

Cada caso de teste isola seus dados (IDs de ambientes, slugs, listas de
inputs, paths derivados) num arquivo `*.data.ts` ao lado do spec. Variáveis
**reutilizadas entre specs do mesmo projeto** ficam em `projects/<slug>/data/`.
Variáveis **genéricas Twygo** (não acopladas a um projeto) ficam em
`src/fixtures/`.

```
projects/<slug>/
├── tests/features/<suite-slug>/
│   ├── <test-case>.spec.ts            # spec — sem hardcode
│   ├── <test-case>.data.ts            # variáveis SÓ deste teste
│   └── <suite-slug>.shared.data.ts    # opcional — compartilhado pela suíte
├── data/                              # constants do projeto (orgIds extra, paths)
│   ├── environments.data.ts
│   └── content-types.data.ts
└── ...
```

Forma do `<test-case>.data.ts`:

```ts
// projects/creditos-fase-02/tests/features/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-curso-checkbox.data.ts
export const configurarIndexacaoCursoData = {
  envId: 36799,
  alternativeEnvId: 36796,
  contentAssets: ['text', 'page', 'lesson', 'stampedPdf', 'video', 'files'] as const,
} as const;
```

E no spec:

```ts
import { configurarIndexacaoCursoData as data } from './configurar-a-indexacao-curso-checkbox.data.js';

test('configurar a indexação curso checkbox', async ({ page }) => {
  await page.goto(`/o/${getOrgId()}/environments/${data.envId}/edit`);
  // ...
});
```

**Por quê**:
- Specs param de carregar literais opacos (`36799`) — leitor entende a
  intenção pelo nome (`data.envId`).
- Mesma variável repetida em N specs vira 1 ponto de mudança quando o
  ambiente muda.
- Generator/healer não precisam adivinhar quais constantes são fixture —
  tudo que estiver em `*.data.ts` é dado, tudo que estiver em `*.spec.ts`
  é fluxo.

Generator (`playwright-test-generator`) deve emitir `<test-case>.data.ts`
junto com o `.spec.ts` mesmo que o teste tenha apenas 1 constante — não
inline. Ver Anti-pattern E em §7.6.

### Como o orquestrador descobre o projeto ativo

1. Flag `--project <slug>` no orchestrator → seta `process.env.PROJECT`
2. Variável de ambiente `PROJECT=<slug>`
3. Auto-detect: se há **exatamente 1** projeto em `projects/`, usa ele
4. Erro explícito: lista projetos disponíveis e pede flag

Para regressivo cumulativo (todos os projetos juntos), use `PROJECT_ALL=true`.

### Linha de corte genérico vs específico

- **Genérico** (em `src/`, `tests/{auth,setup}/`, `config/environment.json`): serve a 2+ projetos hoje ou claramente serviria.
- **Específico** (em `projects/<slug>/`): nasceu para um projeto e ninguém mais tem motivo para mexer.

---

## 4. Fluxo de Execução

Dois modos:

| Modo | Quando usar | Saída |
|---|---|---|
| **Per-suite** | Dia-a-dia: testar 1 bloco entregue por dev | `outputs/reports/{slug}_{ts}/` |
| **Regressivo** | Fim de projeto / GitHub Actions | `outputs/reports/regression_{ts}/` + Allure em GH Pages |

9 fases canônicas (3 novas adicionadas em 2026-04 após diagnóstico de lentidão):

| Fase | Skill / agente | O que faz |
|---|---|---|
| 1. Init | — | Lê configs, valida XML existente |
| 1.5. **Pre-flight** *(novo)* | orquestrador | Valida configs + baseURL responde + storageState válido. Falha cedo, falha barato — antes de gastar planners |
| 2. Parse | `twygo-xml-parser` | XML TestLink → `outputs/test-analysis.parsed.json` |
| 2.5. **Recon** *(novo, opt-in)* | `twygo-recon` | Login + navegação na área da testsuite + dump de test-ids/labels em `inputs/recon-{slug}.md`. Planners consomem isso e pulam exploração ao vivo |
| 3. Plan | **planner** (plugin Playwright) | Para cada testcase, plano técnico baseado na prosa + recon |
| 4. Generate | **generator** (plugin Playwright) + Playwright MCP | Spec `.spec.ts` + Page Objects + annotations Allure |
| 5. Execute | Playwright (com `--grep` per-suite ou tudo regressivo) | Roda + grava findings exploratórios via fixture |
| 5.5. Validate | `twygo-exploratory-validator` | Agrega findings em `exploratory-findings.json` |
| 5.7. **Bug-reports** *(novo)* | `gerar-bug-report-de-tc-red` | Para cada TC red, monta registro estruturado (Network/Console + reprodução + categoria + severity) pronto pra virar task. Output em `outputs/<slug>/bug-reports/`. Roda antes do report-generator pra ele consumir o bundle |
| 6. Report | `twygo-report-generator` | HTML per-suite OU per-suite + Allure (regressivo). Renderiza seção "Bug Reports prontos" no `index.md` linkando os MDs por TC + arquiva `bug-reports/` dentro do reportDir (self-contained) |
| 7. Heal (opcional) | **healer** (plugin Playwright) | Conserta seletor/timing/asserção após mudança de UI |

**Annotations Allure obrigatórias** (Fase 4) derivadas do XML:

- `allure.epic('Twygo - <projectName>')`
- `allure.feature('<testsuite name>')`
- `allure.story('<testcase name>')`
- `allure.severity(<importance: 1=minor, 2=normal, 3=critical>)`
- `allure.step('<n>. <step.actions>', async () => { ... })` em volta de cada passo

**Strict exploratório**: `EXPLORATORY_STRICT=1` ou `--strict` promove findings
de severidade `error` (console error, page error, HTTP 5xx, axe critical) a
falhas explícitas. Default: informativos.

### 4.1. Evidências commitáveis vs intermediários gitignored

Fluxo de fases produz dois grupos de artefatos com tratamento git distinto:

| Grupo | Onde fica | Git | Quem consome |
|---|---|---|---|
| **Intermediários** (Fases 5/5.5) | `outputs/<slug>/test-artifacts/` · `outputs/<slug>/exploratory/` · `outputs/<slug>/exploratory-findings.json` · `outputs/<slug>/test-results.json` · `outputs/<slug>/playwright-summary.md` | **gitignored** (`outputs/**/<paths>`) | Input do report-generator (Fase 6). Não versionar |
| **Report self-contained** (Fase 6) | `outputs/<slug>/reports/<slug>_<ts>/` (com sub-`artifacts/` + `bug-reports/` + `index.md` + `tests.md` + `exploratory.md` + `*.json`) | **commitado** (`outputs/**/reports/` NÃO está no gitignore) | QAs auxiliares analisando run histórica |
| **Decisão QA** | `outputs/<slug>/triage-report.md` · `outputs/<slug>/bug-reports.json` · `outputs/<slug>/bug-reports/` | **commitado** | Próxima rodada do agente lê triage; bug-reports viram task |

**Por quê dois grupos**: report-generator copia attachments (screenshots step, `test-finished-*.png`, `trace.zip`, `video.webm`, `error-context.md`) para `<reportDir>/artifacts/<test-folder>/` durante render. ReportDir vira self-contained — QA auxiliar abre 1 pasta e tem TUDO (sumário, detalhe por teste, exploratórios agregados, bug-reports, artifacts). Originais em `test-artifacts/` ficam duplicados → gitignored sem perda. Ver memory `feedback_archive_artifacts_in_report`.

### 4.2. Pré-condição: rodar `agent:report` após `playwright test` standalone

Se você rodou via **orquestrador** (`npm run agent:suite -- --suite <slug>` ou `agent:regression`), Fase 6 (`twygo-report-generator`) executa auto — reportDir gerado, evidências commitáveis.

Se você rodou **`npx playwright test` direto** (smoke/debug), o reportDir NÃO existe. Para gerar manualmente:

```bash
PROJECT=<slug> npm run agent:report
```

Consome `outputs/<slug>/test-results.json` (+ `exploratory-findings.json` se a fixture exploratória gravou) e produz `outputs/<slug>/reports/<slug>_<ts>/`. **Sem esse passo, evidências ficam locais e não vão pro git** — outros QAs não conseguem analisar a run.

Regra dura: **toda run que vai virar commit precisa passar pelo report-generator**. Se rodar Playwright direto pra commitar resultados, lembre de rodar `agent:report` antes do `git add`.

### 4.3. Windows: `core.longpaths`

Paths gerados pelo report-generator (combinando slug do projeto + run-id + test-folder PT-BR transliterado + step name + SHA hash) excedem `MAX_PATH=260` do Windows. Habilitar uma vez por máquina:

```bash
git config --global core.longpaths true
```

Sem isso, `git add outputs/<slug>/reports/` falha com `Filename too long`. Detalhe em skill `debugar-filename-too-long-windows`.

---

## 5. Tradução de Prosa TestLink → Playwright

A prosa em `<actions>`/`<expectedresults>` é interpretada pelo planner +
generator usando padrões PT-BR canônicos da QA Twygo.

**Documentado em [.claude/prose-patterns.md](.claude/prose-patterns.md)** —
inclui tabelas de mapeamento ação→Playwright e asserção→Playwright,
política para prosa ambígua e cenários fora do escopo.

> Antes de invocar planner/generator, o orquestrador deve carregar
> `.claude/prose-patterns.md` como contexto.

---

## 6. Skills e MCPs

### 6.1. MCPs externos (`.mcp.json`)

| MCP | Quando usar |
|---|---|
| **`playwright-test`** (`npx playwright run-test-mcp-server`) | **Padrão** — usado pelos 3 subagents oficiais de test (Fases 3/4/7). Expõe `browser_*`, `planner_*`, `generator_*`, `test_*`, `browser_generate_locator` |
| **`chrome-devtools`** ([ChromeDevTools/chrome-devtools-mcp](https://github.com/ChromeDevTools/chrome-devtools-mcp)) | Opt-in — debug profundo (Web Vitals, performance traces, memory). Ativação: [SETUP.md §3.1](.claude/SETUP.md) |
| **`github`** ([github/github-mcp-server](https://github.com/github/github-mcp-server)) | Opt-in — healer abre PR pós-correção (Etapa 8.5 do orchestrator), CI abre issue em falha. Ativação: [SETUP.md §3.2](.claude/SETUP.md) |

> O `.mcp.json` é gerado por `npx playwright init-agents --loop claude` no
> SETUP. Não editar manualmente — para sincronizar com upstream, use a
> skill [`atualizar-agents-oficiais`](.claude/skills/atualizar-agents-oficiais/SKILL.md).

### 6.2. Subagents Claude Code para Playwright (`.claude/agents/`)

Definidos por `npx playwright init-agents --loop claude` (oficial Microsoft). São Markdown com frontmatter declarando `tools` (ferramentas do MCP `playwright-test`) e ficam disponíveis via `subagent_type` em sessões iniciadas dentro de `agent-playwright/`.

| Subagent (`subagent_type`) | Papel | Tools principais |
|---|---|---|
| **`playwright-test-planner`** | Lê o XML/contexto, navega no app real, salva plano estruturado em `specs/` | `browser_*`, `planner_setup_page`, `planner_save_plan` |
| **`playwright-test-generator`** | Lê o plano + seed (`tests/seed.spec.ts`), gera `.spec.ts` com seletores validados | `browser_*`, `generator_setup_page`, `generator_write_test` |
| **`playwright-test-healer`** | Roda specs, identifica falhas, edita corrigindo seletor/timing/asserção | `test_run`, `test_debug`, `browser_generate_locator` |

### 6.3. Skill externa metodológica

| Skill | Origem | Papel |
|---|---|---|
| **`webapp-testing`** | [anthropics/skills](https://github.com/anthropics/skills) | Guia metodológico de boas práticas de teste web (carregada como contexto) |

### 6.4. Skills locais Twygo (`.claude/skills/`)

| Skill | Fase | Papel |
|---|---|---|
| **`twygo-xml-parser`** | 2 | TestLink XML → JSON estruturado |
| **`twygo-test-orchestrator`** | 3, 4, 5, 7, 8.5 | Orquestra planner/generator/healer com contexto Twygo. Modos `--suite` e `--regression`. Etapa 8.5 abre PR via GitHub MCP (opt-in) |
| **`twygo-exploratory-validator`** | 5.5 | Agrega findings + cobertura + exporter Allure |
| **`twygo-report-generator`** | 6 | HTML híbrido per-suite + delega Allure CLI no regressivo |
| **`gerar-bug-report-de-tc-red`** | 5.7 | Para cada TC red (failed/timedOut sem fixme), monta bug-report pronto pra task: Network/Console da fixture exploratória + steps/erro/attachments do Playwright + categoria sugerida (bug-produto/spec-fragil/modal-nao-tratado/flakiness/inconclusivo) com confiança. Grava `outputs/<slug>/bug-reports.json` + 1 MD por TC em `bug-reports/<id>.md`. Consumido por `twygo-report-generator` (Fase 6) que renderiza seção no `index.md`. Rodar isolado via `npm run agent:bug-reports` |
| **`atualizar-agents-oficiais`** | manutenção | Re-roda `npx playwright init-agents --loop=claude` e mostra diff dos 3 subagents oficiais pra QA aprovar antes de aceitar updates upstream |
| **`validar-heal-diff`** | 8.1 | Gate estático sobre o diff do healer. Bloqueia mudanças que indicam drift de intenção (assertion polarity flip, title change, step reorder, fixme add/remove). Enforca regra dura #11 |
| **`limpar-dados-de-teste-twygo`** | 3, 4, 7 | Template canônico de `afterAll`/`afterEach` em specs que criam/alteram estado persistente (painel, item de menu, toggle, contrato). Catálogo de variants `*_safe` no POM + ordem de cleanup com dependência (filho antes de pai) + anti-patterns. Enforca Anti-pattern G do §7.6 |
| **`roadmap-recon-cache`** | design | Especificação não-implementada — propõe migrar recon de `inputs/` (git) pra `outputs/<slug>/recon-cache/` (regenerável + TTL) |
| **`roadmap-agent-metrics`** | design | Especificação não-implementada — orchestrator emite `metrics.json` por execução; skill nova agrega trend (typecheckFirstPassRate, fixmeRate, healBlockedRate, etc) |

### 6.5. Bibliotecas npm

`@playwright/test` · `@axe-core/playwright` · `allure-playwright` ·
`allure-commandline` · `fast-xml-parser`

---

## 7. Regras Duras (não negociáveis)

1. **Não usar `waitForTimeout(ms)`** — sempre esperas baseadas em condição.
2. **Preferir `data-testid`** sobre seletores estruturais. CSS/XPath frágil é proibido.
3. **Não encadear testes** por side-effect — cada `test()` parte de estado conhecido.
4. **Não commitar credenciais** — apenas `${VAR}` em `environment.json`.
5. **Não editar `outputs/`** — são 100% gerados.
6. **Não modificar XMLs em `inputs/`** — fonte única de verdade; mudanças vêm do agente AT.
7. **Não criar testes que não existem no XML** — orquestrador só gera o documentado.
8. **Não pular `npm run typecheck`** antes de rodar testes.
9. **Findings exploratórios não substituem casos de teste do XML** — sinalizam lacunas, não substituem.
10. **Não desabilitar a fixture exploratória** em specs — para desligar, use `exploratory.enabled: false` em `project.config.json`.
11. **Healer só corrige seletor / timing / asserção** — nunca altera intenção do teste.
12. **Não inventar mapeamento de prosa** — se não bate com `.claude/prose-patterns.md`, marcar `// REVISAR` e seguir, **não chutar**.

---

## 7.5. Convenções específicas Twygo (gotchas descobertos)

Erros comuns que custaram horas em sessões anteriores. Generator/healer/planner devem ler antes de gerar código:

### Auth e navegação
- **Login URL real**: `/users/login` (não `/login`).
- **Labels do formulário de login**: `Login` (email) e `Senha`. Botão `Entrar`.
  - `getByLabel(/e-?mail/i)` é regex amplo demais — bate em checkbox `send_copy` da tela. Use `getByRole('textbox', { name: 'Login' })`.
- **Pós-login redireciona pra `/play?menu_id=play`**, não `/dashboard_students`.
- **Não precisa "trocar perfil Administrador" via UI** — basta navegar direto pra `/o/{orgId}/...` que o app abre o contexto admin.
- **storageState global**: `tests/setup/global-setup.ts` faz login 1× e salva `outputs/.auth/storage.json`. Specs novos NÃO precisam fazer login — config já tem `use.storageState`. Specs antigos com `loginPage.login()` ainda funcionam (idempotente).

### Imports e bibliotecas
- **Allure facade** vem de `allure-js-commons`, NÃO `allure-playwright`:
  ```ts
  import * as allure from 'allure-js-commons';  // ← certo
  // import * as allure from 'allure-playwright';  // ← errado, sem epic/feature/story
  ```
- **`Locator` type** vem de `@playwright/test`, NÃO da fixture:
  ```ts
  import type { Locator } from '@playwright/test';                                    // ← certo
  // import { test, expect, type Locator } from '../../../src/fixtures/...';          // ← errado
  ```

### Test-IDs e seletores
- **Atributo `data-test-id` (com hífen)**, não `data-testid` padrão Playwright. Já configurado em `playwright.config.ts` via `use.testIdAttribute`.
- **Sync alert bloqueia o toggle Indexação**: quando `[role="alert"][data-status="warning"]` está visível, o container fica `aria-disabled` e clicks normais falham. Use `.click({ force: true })` OU verifique `editPage.isSyncBlocking()` e branch.
- **Test-IDs aparecem só com toggle pai habilitado**: sub-fields de Indexação (Período, datas, Tipo, Situação, Exceções) só renderizam quando o toggle mestre está ON.

### Modal RN37 ("Processo de indexação de conteúdo")
- Aparece apenas após **clicar Salvar com mudança real**. Se nada mudou, modal não dispara — não force `expect(creditsModal).toBeVisible()` sem mudar estado antes.

### Spec test() title = testcase name do XML
- A convenção é: `test.describe('<testsuite>', () => { test('<testcase>', ...) })`. O reporter tira o nome da testsuite do `describe` e o nome do testcase do `test()`.

### Super Admin (`/admin`) — tabela de preços e contratos
- **Pré-requisito**: usuário do `environment.json` precisa estar logado E em perfil "Administrador". O `globalSetup` cobre o login; o perfil já vem do user evertongambeta@gmail.com / eduardo.schmidt@twygo.com.
- **Não trocar perfil pela UI** — basta acessar a rota `/admin` direto. Use `SuperAdminPage` (`src/pages/SuperAdminPage.ts`).
- **Caminhos canônicos** (validados em 2026-05-05 com o usuário):
  | Operação | Rota direta | Helper |
  |---|---|---|
  | Entrada Super Admin | `/admin` | `superAdminPage.openSuperAdmin()` |
  | Tabela de preços (todas) | `/admin/subscription_plans` | `superAdminPage.openSubscriptionPlans()` — na lista, identificar tabela com coluna "Ativo" = Sim e clicar Editar |
  | Editar contrato vigente da org | `/admin/edit_sys_subscription_settings/{orgId}` | `superAdminPage.openEditContract(orgId)` |
- **Ambientes em `environment.json` (4 envs registrados):**

  | Env | Host | orgId | Papel |
  |---|---|---|---|
  | `staging` | `stage10.stage.twygoead.com` | 36602 | Principal Twygo (creditos-fase-02 e demais projetos) |
  | `staging-without-credits` | `eduapi.stage.twygoead.com` | 36912 | Secundário do staging — org com saldo IA zerado (specs de bloqueio por créditos) |
  | `staging-widgets` | `widgets.stage.twygoead.com` | 36988 | Específico do projeto **widgets** (Painéis/Modos de uso) |
  | `staging-widgets-disabled` | `widgetsdisabled.stage.twygoead.com` | 36989 | Secundário do widgets — módulo Widgets desligado por feature flag (specs de bloqueio por flag) |

  Cada `projects/<slug>/project.config.json` declara qual env usar via campo
  `environment`. Specs do widgets apontam pra `staging-widgets`; demais
  projetos pra `staging`. Credenciais vão pro `.env` (ver SETUP.md §6),
  resolvidas via `${VAR}` em `environment.json` por
  `loadEnvironmentConfig()` (`src/utils/environment.ts`).
- **Tabela de preços é COMPARTILHADA**: alterar a tabela ativa afeta TODAS as organizações daquele banco. Se um teste muda a tabela ativa, faça o **revert ao final** (idealmente via `test.afterEach`/`test.afterAll`). Tests que apenas leem (asserções) não precisam de revert.
- Padrões de prosa Super Admin estão em `.claude/prose-patterns.md` seção 3.5 — generator deve consultar antes de marcar `test.fixme` por "requer Super Admin".

### Cenários "bloqueio por flag/saldo" (env secundário)

A convenção do `globalSetup` cobre 2 famílias de bloqueio por env secundário:

| Família | Env secundário | Quando usar |
|---|---|---|
| **Saldo de IA zerado** | `staging-without-credits` | Specs que validam o que acontece quando a org não tem créditos pra IA (UI de bloqueio, mensagem, dispatch de evento) |
| **Módulo desligado** | `staging-widgets-disabled` (e futuros `*-disabled`) | Specs que validam UI quando feature flag/contrato está OFF (ex: aba não aparece, redirect, banner) |

**Como o `globalSetup` decide qual env secundário logar:**

1. Match direto pelo principal: `<principal>-without-credits` ou `<principal>-disabled`. Ex: principal `staging-widgets` → procura `staging-widgets-disabled` em `environment.json`.
2. Fallback: primeiro env diferente do principal que termina em qualquer dos sufixos `-without-credits`, `-disabled`, `-widgets-disabled`.

Sem ambos, sem secundário (specs que precisam dele falham com "storage não encontrado" — mas o storage é gerado em `outputs/.auth/storage-without-credits.json`, fixo, indep. de qual sufixo casou).

**Como specs consomem o env secundário:**

```ts
import { SECONDARY_STORAGE_PATH } from '../../../../../tests/setup/global-setup.js';
import { getEnvByName } from '../../../../../src/utils/environment.js';

test.use({
  storageState: SECONDARY_STORAGE_PATH,
  baseURL: getEnvByName('staging-widgets-disabled').baseUrl,  // ou 'staging-without-credits'
});
```

Não invente outras organizações pra "simular bloqueio" — sempre use o env secundário convencionado. Se aparecer um novo cenário (ex: "org sem feature X"), adicione um env `staging-X-disabled` em `environment.json` + `.env.example` + `.env`.

### Modal "Modelo de página duplicado" (form de item de menu)

- Form `/o/{orgId}/use_modes/{useModeId}/use_mode_itens/new` valida client-side a unicidade do `page_model` dentro do useMode. Quando o useMode já tem outro item com o mesmo modelo (ex.: dois `user_panels`), o click em Salvar dispara modal `role="dialog"` com header literal "Modelo de página duplicado" e body "Esta página já foi adicionada na lista de menus deste modo de uso. Deseja adicioná-la novamente?".
- Botão "Salvar" do modal confirma a duplicação e prossegue o POST → redirect normal. "Cancelar" mantém na rota /new.
- Validado live 2026-05-13 em `staging-widgets` useMode 70077 via chrome-devtools-mcp.
- `PaineisListPage.associatePanelToMenu` faz race-handle: após click no Salvar, espera 3s pelo modal; se aparecer, clica Salvar do modal e segue; se não, prossegue redirect normal. Getters: `getDuplicatePageModelModal()` / `getDuplicatePageModelConfirmButton()`.
- Implicação: tenants compartilhados entre testes podem ter seed manual ainda usando `page_model=user_panels` (ex.: TC5 deste suite depende do item 365759 em useMode 70077). Não delete esses items em cleanup sem confirmar.

---

## 7.6. Anti-patterns do output do generator (proibidos em specs gerados)

Estes 6 anti-patterns foram observados em specs gerados anteriormente e
violam regras do próprio CLAUDE.md. O `twygo-test-orchestrator` deve passá-los
explicitamente ao `playwright-test-generator` antes de cada geração (ver
SKILL.md do orchestrator, Etapa 4). Healer deve recusar correções que
introduzam qualquer um deles.

### A. NUNCA fazer login no spec
- ❌ `await page.goto('/users/login'); await loginPage.login(email, password);`
- ✅ Não fazer nada — `tests/setup/global-setup.ts` já gravou storageState e
  `playwright.config.ts` consome via `use.storageState`.
- **Por quê**: duplica trabalho do globalSetup, vaza credenciais em texto
  plano no git (regra dura #4), e quebra com refresh do storageState (TTL
  30min — global-setup re-loga sozinho).
- **Exceção**: specs em `tests/auth/` que testam a tela de login em si
  declaram `test.use({ storageState: { cookies: [], origins: [] } })`.

### B. NUNCA hardcodar URL/orgId/credenciais
- ❌ `const BASE_URL = 'https://stage10.stage.twygoead.com';`
- ❌ `await page.goto('/o/36602/ai_consumption_analysis?tab=settings');`
- ✅ Importar de [src/utils/environment.ts](src/utils/environment.ts):
  ```ts
  import { getBaseUrl, getOrgId } from '../../../../../src/utils/environment.js';
  await page.goto(`/o/${getOrgId()}/ai_consumption_analysis?tab=settings`);
  ```
- **Por quê**: specs hardcoded só rodam contra UM ambiente; quebram quando
  você quer rodar em `staging-without-credits` ou produção. Forçar o
  helper centraliza a fonte de verdade em `config/environment.json`.
- **Exceção**: rotas que não dependem de env (`/users/login`, `/play`) podem
  ficar literais — não são acopladas a host nem a org.

### C. NUNCA inline helpers de UI no spec
- ❌ `async function marcarApenasCheckboxESalvar(alvo, outros) { ... }` dentro do `test()`
- ✅ Adicionar método na Page Object correspondente:
  ```ts
  // EnvironmentEditPage.ts
  async marcarSomenteCheckbox(target: 'curso' | 'pacote' | 'trilha'): Promise<void> { ... }
  ```
- **Por quê**: viola regra dura #3 ("Specs em `tests/features/` não contêm
  seletores"). Helper inline com seletores polui o spec, dificulta reuso e
  quebra coesão do POM. Se a lógica é específica de um único teste, ainda
  assim deve viver no Page Object — apenas como método nomeado conforme a
  intenção do teste.

### D. Comentários no spec só justificam WHY, nunca explicam WHAT
- ❌ `// Habilitar toggle mestre se não estiver`
- ❌ `// Marcar o alvo se ainda não estiver marcado`
- ❌ `// Preencher credenciais e submeter`
- ✅ `// REVISAR: prosa ambígua "<texto original>"` (ver §5)
- ✅ `// Use force:true porque o sync alert deixa container aria-disabled (§7.5)`
- ✅ `// Tabela compartilhada — revert no afterAll obrigatório (§7.5)`
- **Por quê**: comentário WHAT (o que o código faz) duplica o que o código já
  diz com nome de método/variável. Comentários WHY (por que assim) capturam
  invariantes não-óbvias que somem se removidos. Allure step já narra o
  fluxo — comentário extra é ruído.

### E. NUNCA hardcodar constantes-de-domínio inline no spec

- ❌ `const ENV_ID = 36799; const AVIAO_ENV_ID = 36796;` no topo do `.spec.ts`
- ❌ `await page.goto('/o/${getOrgId()}/environments/36799/edit');`
- ✅ Mover para `<test-case>.data.ts` adjacente:
  ```ts
  // configurar-a-indexacao-curso-checkbox.data.ts
  export const data = { envId: 36799, alternativeEnvId: 36796 } as const;
  ```
- ✅ Importar no spec: `import { data } from './configurar-a-indexacao-curso-checkbox.data.js'`
- **Por quê**: viola §3.1 (convenção de dados por teste). IDs e listas
  hardcoded espalhados pelos specs (a) duplicam quando dois testes
  compartilham — e divergem em silêncio quando um spec atualiza e o outro
  não, (b) escondem intenção (leitor vê `36799`, não `envId.aviao`),
  (c) bagunçam o diff quando um ambiente troca de ID — vira pesca em
  N arquivos. Mover pra `*.data.ts` resolve os 3.
- **Exceção**: literais que NÃO são domínio — `await page.waitForTimeout(2000)`
  é proibido por outra regra; `expect(items).toHaveCount(3)` quando o `3`
  é a expectativa do próprio cenário (não dado de input). Use bom senso:
  **se o número/string poderia mudar quando o ambiente Twygo muda, é dado
  e vai pro `.data.ts`**.

### F. NUNCA usar `fixme` pra esconder bug de produto

- ❌ `test.describe.fixme('...', () => { /* BLOCKED-BY-PRODUCT-BUG */ })`
- ❌ `test.fixme(true, 'API retorna 500 quando ...')`
- ✅ Deixar o teste rodar e falhar com a asserção que deveria passar; documentar
  a causa raiz em comentário no topo do arquivo (sintoma observável + arquivo/linha
  do bug no servidor + fix sugerido). Quando o dev corrigir, o teste passa
  automaticamente sem mudança no spec.
- **Por quê**: skip esconde bug do relatório. Dev olha o vermelho, lê o
  comentário acima da `test.describe`, sabe o que arrumar — esse é o ciclo
  inteiro de feedback automatizado. `fixme` quebra esse loop: o spec fica
  amarelo silencioso, o bug nunca aparece no painel, e a pessoa que abriu
  o PR não tem como saber que tem teste cobrindo o caso.
- **Quando usar `fixme` (legítimo)**:
  - **Spec/XML desatualizado** — XML descreve fluxo que não existe mais na UI;
    destinatário é AT/QA Lead (revisar XML), não dev de produto. Ex: TC4 de
    `ativar-inativar-painel/reativar-modo-uso-painel-inativo.spec.ts`.
  - **Seed ausente** — cenário composto requer dados que não estão no env
    (ex: "Painel X inativo + menu Y vinculado"). Destinatário é QA Lead
    (criar seed), não dev de produto.
  - **Dependência externa fora** — feature flag desligada num env onde
    deveria estar ligada; destinatário é DevOps/infra.
  - **Bloqueio temporário declarado pelo time** — "vamos cobrir isso na
    sprint X"; deve ter ticket linkado.
- **Matriz de decisão**:

  | Sintoma | Destinatário do sinal | Mecanismo correto |
  |---|---|---|
  | Bug no servidor (500, 404 indevido, NoMethodError) | Dev de produto | ✅ falha vermelha + comentário causa raiz |
  | UI mudou e XML não acompanhou | AT / QA Lead | ✅ `fixme` com mensagem "XML desatualizado" |
  | Seed faltando | QA Lead | ✅ `fixme` com mensagem "seed ausente: <especificação>" |
  | Feature flag off num env errado | DevOps | ✅ `fixme` com mensagem + ticket |
  | "Vou voltar nisso depois" sem causa raiz identificada | — | ❌ NÃO commitar. Investigue antes |

- **Exceção real**: nenhuma — toda exceção cai em uma das 4 categorias
  "fixme legítimo" acima. Se não bate em nenhuma, é Anti-pattern F.

### G. NUNCA criar/alterar estado persistente sem `afterAll` que limpa

- ❌ Spec chama `createPanel`, `associatePanelToMenu`, `toggleActiveByName`
  (em estado pré-existente que não vai ser recriado), `addWidget` em painel
  pré-existente, ou edita Super Admin sem `test.afterAll` revertendo.
- ❌ `try { await paineis.deletePanelByName(name); } catch {}` inline no `afterAll`.
- ❌ `await page` (do test, já fechada) usado em `afterAll` — sempre criar
  contexto fresco via `browser.newContext({ storageState })`.
- ❌ Nome literal de recurso (`'Painel Teste'`) — sempre worker-isolated
  (`Painel TC2 w${testInfo.workerIndex}-${Date.now()}`).
- ✅ `test.afterAll` com contexto fresco + variant `*_safe` do POM
  (`deletePanelByNameSafe`, `disassociatePanelFromMenu_safe`).
- ✅ Quando há dependência (menu vinculado → painel), ORDEM: filho antes
  de pai. Desassociar menu **antes** de deletar painel — senão produto
  bloqueia delete com modal "Painel em uso".
- ✅ Toggle reversível (suite muda switch de painel pré-existente):
  `afterAll` reverte toggle com check de idempotência (`isChecked()`).
- **Por quê**: org compartilhada entre runs. Sem cleanup, env acumula
  orphans cumulativamente. Pior: orphan menu items disparam toast
  genérico "Não foi possível inativar o painel" pra TODOS os painéis da
  org enquanto o orphan existir (`bug_title_for_linked_menus`). Suítes
  verdes na primeira run viram red no dia seguinte por contaminação.
- **Como aplicar**: ler skill [`limpar-dados-de-teste-twygo`](.claude/skills/limpar-dados-de-teste-twygo/SKILL.md)
  ANTES de gerar/aprovar spec novo. Generator deve seguir checklist da
  skill; healer deve recusar PR sem cleanup pareado.
- **Catálogo de variants `*_safe` existentes**: `deletePanelByNameSafe`
  (`PaineisListPage.ts:786`), `disassociatePanelFromMenu_safe`
  (`PaineisListPage.ts:933`). Criar nova quando demandado seguindo
  protocolo da skill.
- **Exceção**: testes 100% read-only (apenas leem listagem/colunas) e
  testes que mockam request via `page.route` sem hitar backend não
  precisam cleanup. Em dúvida, assumir que precisa.

---

## 8. Comandos e Iniciação

Documentado em **[.claude/commands.md](.claude/commands.md)** — inclui setup
inicial por projeto, fluxo dia-a-dia (per-suite), fluxo regressivo, healing,
comandos individuais, variáveis de ambiente e flags do orquestrador.

Para a configuração inicial do ambiente (deps, MCPs, plugin Playwright), veja
**[.claude/SETUP.md](.claude/SETUP.md)**.

---

## 9. Referências

- [Playwright Best Practices](https://playwright.dev/docs/best-practices) · [Page Object Model](https://playwright.dev/docs/pom)
- [Plugin oficial Playwright (planner/generator/healer)](https://claude.com/plugins/playwright)
- [Microsoft Playwright MCP](https://github.com/microsoft/playwright-mcp) · [Chrome DevTools MCP](https://github.com/ChromeDevTools/chrome-devtools-mcp) · [GitHub MCP](https://github.com/github/github-mcp-server)
- [Anthropic Skills](https://github.com/anthropics/skills) (inclui `webapp-testing`)
- [Allure Playwright](https://www.npmjs.com/package/allure-playwright) · [@axe-core/playwright](https://www.npmjs.com/package/@axe-core/playwright)
- [Claude Code Skills Best Practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
