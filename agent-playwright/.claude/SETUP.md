# Setup do Agente Playwright Twygo

Esta página guia a configuração inicial do Claude Code + plugins/MCPs
necessários para o agente operar.

> **Pré-requisito**: Claude Code CLI instalado.
> Instalação: https://code.claude.com/docs/en/installation

## 1. Dependências npm

A partir de `agent-playwright/`:

```bash
npm install
```

Isso instala Playwright, axe-core, allure-playwright, allure-commandline,
fast-xml-parser, etc. (ver [package.json](../package.json)).

## 2. Browsers do Playwright

```bash
npx playwright install chromium
# (ou --with-deps em Linux)
```

Use `--with-deps` em ambientes Linux que ainda não têm libs do sistema
instaladas.

### 2.1. Java (necessário para Allure CLI no modo regressivo)

O `agent:regression` invoca `npx allure generate` no fim, e o Allure CLI
precisa de uma JRE/JDK completa (com `tzdb.dat`). Em CI já está configurado
via `actions/setup-java@v4`. Localmente:

**Windows**: instale [Eclipse Adoptium Temurin 17](https://adoptium.net/) ou
configure `JAVA_HOME` apontando para uma JRE completa:
```cmd
set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot
```

**Sintoma de Java incompleto**: `java.io.FileNotFoundException: ...lib\tzdb.dat`.
A skill `twygo-report-generator` detecta esse caso e sugere a correção.

**Linux/macOS**: `apt install default-jre` ou `brew install openjdk@17` e
exportar `JAVA_HOME`.

> Em modo per-suite (sem `--regression`) o Allure NÃO é invocado — só a
> geração HTML estruturada. Java só é exigido para regressivo.

## 3. MCPs

O arquivo [`.mcp.json`](../.mcp.json) já registra o **Playwright MCP** da
Microsoft. Quando o `claude` é iniciado a partir de `agent-playwright/`, o
MCP sobe automaticamente.

### Validar que está ativo

Dentro do Claude Code:

```
/mcp
```

Deve aparecer `playwright` na lista de MCPs conectados.

### MCPs opcionais

Para ativar **Chrome DevTools MCP** (sob demanda — debug profundo de Web
Vitals, performance traces, etc.):

```bash
claude mcp add chrome-devtools --scope project -- npx chrome-devtools-mcp@latest
```

Para ativar **GitHub MCP** (CI / abrir issues automatizadas):

```bash
claude mcp add github --scope project
# requer GITHUB_TOKEN no ambiente
```

## 4. Plugin oficial Playwright (planner/generator/healer)

O plugin é **distribuído via marketplace do Claude Code**, não via npm.

### Instalar

Dentro do Claude Code (modo interativo):

```
/plugin install playwright
```

Ou pela URL canônica: https://claude.com/plugins/playwright

Após instalar, o Claude Code passa a expor 3 subagentes invocáveis pelo
orquestrador `twygo-test-orchestrator`:

| Subagente | Quando o orquestrador chama |
|---|---|
| **`planner`** | Fase 3 — para cada testcase, produzir plano técnico |
| **`generator`** | Fase 4 — escrever spec usando o plano + Playwright MCP |
| **`healer`** | Fase 7 — corrigir spec após mudança de UI |

### Validar que está instalado

```
/plugins
```

Deve aparecer `playwright` na lista.

## 5. Skills (já no repositório)

Skills locais ficam em [`.claude/skills/`](.):

- `configurar-ambiente` — setup operacional (.env, deps, smoke). Use como
  referência viva quando aparecer "como rodo isso?" ou erro de variável
  ausente.
- `debugar-smoke-login` — checklist de 1min de diagnóstico quando o smoke
  falha com timeout no `LoginPage` (ambiente fora vs `.env` vs layout vs
  storage). Use ANTES de mexer em código.
- `webapp-testing` — guia metodológico oficial Anthropic (consultado pelo
  orquestrador como contexto de boas práticas).
- `twygo-xml-parser` — parser TestLink → JSON.
- `twygo-test-orchestrator` — orquestra planner/generator/healer.
- `twygo-exploratory-validator` — agrega findings + cobertura.
- `twygo-report-generator` — relatórios HTML híbridos.
- `twygo-recon` — varredura prévia de testsuite (test-ids/labels) pros planners.

Não precisam instalação extra — Claude Code descobre automaticamente
ao iniciar em `agent-playwright/`.

## 6. Variáveis de ambiente

```bash
cd agent-playwright
cp .env.example .env
```

Edite `.env` e preencha:

```bash
TWYGO_STAGING_EMAIL=<email da conta de QA staging>
TWYGO_STAGING_PASSWORD=<senha staging>

TWYGO_STAGING_WITHOUT_CREDITS_EMAIL=<email da conta "sem créditos">
TWYGO_STAGING_WITHOUT_CREDITS_PASSWORD=<senha "sem créditos">

# Opcional — só pra CI / GH MCP:
GITHUB_TOKEN=<PAT com escopo repo>
```

> `.env` está no `.gitignore` da raiz do monorepo. Nunca commitar.
> `config/environment.json` carrega esses valores via `${VAR}` (resolvido por
> `loadEnvironmentConfig()` em `src/utils/environment.ts`). Se a variável
> faltar, qualquer comando que toque o env (`agent:parse`, `agent:run`,
> `playwright test`) falha com mensagem explícita apontando o nome.

Para um passo-a-passo guiado (incluindo diagnóstico), use a skill
[`configurar-ambiente`](skills/configurar-ambiente/SKILL.md).

## 7. Validar setup

```bash
npm run typecheck         # tsc --noEmit deve sair 0
npm run agent:parse       # lê o XML configurado em project.config.json
```

Se ambos passarem, o ambiente está pronto.

## 8. Próximo passo

Inicie o Claude Code:

```bash
cd agent-playwright
claude
```

E peça:

> Execute o orquestrador para a suíte "[Kit de marca] QA 1.1 ..."

O agente carrega o `CLAUDE.md` e segue o `twygo-test-orchestrator`.
