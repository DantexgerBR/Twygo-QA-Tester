# Bootstrap de novo projeto Twygo

Ritual para iniciar um projeto novo no agente Playwright. Cada projeto vive
em duas dimensões:

- **Pasta**: `projects/<slug>/` (com seus próprios `inputs/`, `specs/`,
  `tests/features/`, `pages/`, `utils/` e `project.config.json`).
- **Branch**: `project/<slug>` para o trabalho ativo. Quando concluído,
  merge para `master`, onde os projetos coexistem em `projects/*/`.

Infra do agente (`src/`, `config/environment.json`, `tests/{auth,setup}/`)
fica em raiz e é compartilhada por todos os projetos.

## 1. Criar branch dedicada

A partir do `master` atualizado:

```bash
cd agent-playwright/..        # raiz do monorepo
git checkout master
git pull origin master
git checkout -b project/<slug-do-projeto>     # ex.: project/kit-de-marca
```

> **Convenção de slug**: lowercase, hífens. Ex.: `kit-de-marca`,
> `widgets`, `aprendizagem-compartilhamentos`.

## 2. Criar a pasta do projeto

```bash
cd agent-playwright
mkdir -p projects/<slug>/{inputs,specs,tests/features,pages,utils,data}
```

> **Pasta `data/`**: variáveis específicas do projeto (orgIds de
> sub-ambientes, paths derivados, listas de fixtures) que são reusadas
> entre specs do mesmo projeto. Variáveis específicas de **um único** spec
> ficam num `<test-case>.data.ts` ao lado do spec — não em `data/`. Ver
> CLAUDE.md §3.1 (convenção de dados por teste).

## 3. Receber inputs do agente AT

Drop os arquivos em `projects/<slug>/inputs/`:

- **`Analise_Teste_<NomeDoProjeto>.xml`** — XML TestLink gerado pelo agente
  AT a partir do XMind. **Obrigatório** — é a fonte de verdade dos casos
  roteirizados.
- **`Quebra de atividades - <NomeDoProjeto>.xlsx`** — opcional, só para
  referência humana (este agente não processa o XLSX; ele é input do
  agente AT, não do Playwright).

## 4. Criar `projects/<slug>/project.config.json`

Use [`projects/creditos-fase-02/project.config.json`](../projects/creditos-fase-02/project.config.json)
como referência:

```jsonc
{
  "projectName": "Kit de Marca",                                   // nome literal — vai pro Allure epic
  "testAnalysisFile": "inputs/Analise_Teste_Kit_de_Marca.xml",     // RELATIVO ao projects/<slug>/
  "environment": "staging",                                         // staging | production
  "browsers": ["chromium"],
  "headless": true,
  "reporting": { "format": "html", "outputDir": "outputs", "screenshotsOnFailure": true },
  "performance": { "enableTracing": true, "enableVideo": false },
  "exploratory": {
    "enabled": true,
    "scopedRoutes": [],            // rotas in-scope para findings exploratórios
    "scopedKeywords": [],          // palavras-chave que indicam route in-scope
    "activeProbes": { "hoverTooltips": true, "formEdge": true, "visualStability": true }
  }
}
```

> O `testAnalysisFile` é **relativo ao diretório do projeto**, não à raiz.

[`config/environment.json`](../config/environment.json) é compartilhado entre
projetos (mesma plataforma Twygo). Só altere se um projeto precisar de
ambiente novo.

## 5. Validar setup

```bash
cd agent-playwright
npm install                                # se primeira vez na máquina
npx playwright install chromium            # se primeira vez na máquina
cp .env.example .env                       # se primeira vez na máquina — depois preencher!
npm run typecheck                          # garantir que tudo compila
npm run agent:parse -- --project <slug>    # parsear o XML, verificar contagens
npm run agent:suites -- --project <slug>   # listar as testsuites do projeto
```

> **`.env`**: `config/environment.json` referencia `${TWYGO_*}` que vêm de
> `.env`. Se faltar, `npm run typecheck` ainda passa, mas
> `npm run agent:parse` lança erro explícito apontando a variável faltante.
> Para detalhes use a skill `configurar-ambiente`.

> Se houver **só 1 projeto** em `projects/`, a flag `--project` é opcional
> (auto-detect). Quando há 2+ projetos coexistindo (master cumulativa), é
> obrigatória — ou export `PROJECT=<slug>` antes dos comandos.

### 4.1. Subagents oficiais Playwright (uma vez por repo)

Os subagents `playwright-test-planner`, `playwright-test-generator` e
`playwright-test-healer` ficam em `.claude/agents/` e devem estar commitados
no master. Se algum projeto novo precisar regenerar (por exemplo, após
upgrade do Playwright), rode:

```bash
npx playwright init-agents --loop claude
```

Esse comando atualiza `.claude/agents/*.md`, `.mcp.json`, `tests/seed.spec.ts`
e `specs/README.md`. Reveja diffs antes de commitar — `init-agents`
sobrescreve sem perguntar.

> **Importante**: os subagents só ficam disponíveis em **sessões NOVAS** do
> Claude Code. Se você acabou de rodar `init-agents`, feche e reabra o
> `claude` em `agent-playwright/` para que apareçam como `subagent_type`.

A última saída deve mostrar a quebra de blocos em testsuites (1 bloco do
XLSX ≈ 1 testsuite no XML).

## 6. Commit baseline da branch

```bash
git add agent-playwright/projects/<slug>/
git commit -m "chore(<slug>): bootstrap projeto <Nome do Projeto>"
git push -u origin project/<slug>
```

## 7. Fluxo dia-a-dia (per-suite, conforme dev entrega blocos)

Cada bloco entregue:

```bash
# Liste as suítes para confirmar o nome literal
npm run agent:suites -- --project <slug>

# Rode parse + planner + generator + execução + validador + report
npm run agent:run -- --project <slug> --suite "[Kit de marca] QA 2.1 - Kit de marca - Criar / Editar - Identificação"
```

> Se `projects/` tem só 1 projeto, `--project` é opcional (auto-detect).

Resultado: `outputs/<slug>/reports/{slug-suite}_{timestamp}/index.html`.

Se a geração precisar do plugin oficial Playwright (planner/generator/healer),
use o Claude Code interativo dentro de `agent-playwright/`:

```bash
cd agent-playwright
claude
> Execute o orquestrador para a suíte "[Kit de marca] QA 2.1 - ..."
```

Após a execução estabilizar:

```bash
git add agent-playwright/projects/<slug>/tests/features/<slug-suite>/ \
        agent-playwright/projects/<slug>/pages/<NewPage>.ts \
        agent-playwright/projects/<slug>/utils/testIds.ts
git commit -m "test(<slug-suite>): add specs do bloco QA 2.1"
```

> Page Objects **genéricos Twygo** (que beneficiam outros projetos) vão em
> `src/pages/`. Page Objects **específicos** desta feature vão em
> `projects/<slug>/pages/`. Ver CLAUDE.md §3 (linha de corte).

## 8. Healing após mudança de UI

Quando um teste falha por seletor não encontrado / timing (não bug funcional):

```bash
cd agent-playwright
claude
> Invocar o healer do plugin Playwright para projects/<slug>/tests/features/<arquivo>.spec.ts
```

O healer propõe correção via diff. Aprove → commit no branch do projeto.

## 9. Encerramento do projeto: regressivo completo

Quando todos os blocos passaram individualmente:

```bash
# Limpa outputs antigos
npm run clean

# Rodada completa do projeto: todos os specs + Allure
npm run agent:regression -- --project <slug>
```

Saída: `outputs/<slug>/allure-report/` + `outputs/<slug>/reports/regression_{ts}/`.

O workflow `.github/workflows/regression.yml` roda automaticamente em PR
para `master` (se aplicável).

## 10. Merge para master e arquivamento

Quando o projeto está validado:

```bash
# Abrir PR project/<slug> → master
# Após aprovado, merge → master fica cumulativa com projects/<slug>/ junto com os outros

# Opcional — tag de release
git tag project/<slug>/v1.0
git push origin project/<slug>/v1.0
```

> **Master é cumulativa** — todos os `projects/*/` coexistem nela. Pra rodar
> regressivo cumulativo (todos os projetos juntos) em master, use:
> ```bash
> PROJECT_ALL=true npm run agent:regression
> ```

## 11. Próximo projeto

Repete do passo 1 com novo slug e novo XML.

---

## Checklist rápido para um novo projeto

- [ ] Branch `project/<slug>` criada a partir do master atualizado
- [ ] Pasta `projects/<slug>/{inputs,specs,tests/features,pages,utils,data}/` criada
- [ ] XML TestLink dropado em `projects/<slug>/inputs/Analise_Teste_<projeto>.xml`
- [ ] `projects/<slug>/project.config.json` criado (`projectName` + `testAnalysisFile` relativo ao projeto)
- [ ] `.env` preenchido (a partir de `.env.example` na primeira vez na máquina)
- [ ] `npm run typecheck` exit 0
- [ ] `npm run agent:parse -- --project <slug>` lista as suítes esperadas
- [ ] `npm run agent:suites` mostra os blocos
- [ ] Commit baseline da branch
- [ ] Push para o remoto
