---
name: twygo-report-generator
description: Gera reportDir self-contained em outputs/<slug>/reports/{slug}_{ts}/ (index.md + tests.md + exploratory.md + JSONs). Regressivo dispara Allure CLI. v3.4 — bug-report propaga categoria sugerida, fixme exige `[xml-desatualizado|seed-ausente|dep-externa|bloqueio-temporario]`. Ver corpo p/ changelog detalhado.
when_to_use: |
  - Após Playwright run completar — Fase 6 do orchestrator
  - Rodou `npx playwright test` direto e precisa gerar reportDir manual
  - Regressivo precisa Allure HTML + trend histórico
triggers:
  - "agent:report"
  - "twygo-report-generator"
  - "index.md tests.md"
  - "reportDir"
  - "playwrightHumanSummary"
  - "Allure CLI"
  - "outputs/<slug>/reports/"
  - "Comportamento atual"
version: 3.4.0
---

# twygo-report-generator

## Linguagem leiga em `tests.md` (v3.4+)

Endereça o gap de relatórios opacos para QAs leigos. 6 mudanças cumulativas:

### 1. Mensagens de erro traduzidas

`playwrightHumanSummary` agora cobre 15+ padrões (vs 12 antes). Novos:

| Padrão Playwright | Tradução PT-BR |
|---|---|
| `toBeGreaterThan(OrEqual)` / `toBeLessThan(OrEqual)` falhou | "Quantidade fora do esperado: deveria ser maior/menor a N, mas obteve M. Isso geralmente indica que a ação que deveria popular a tela (listagem/filtro/busca) ficou vazia ou retornou menos itens que o necessário." |
| `Error: esperava ao menos N X, encontrei M` (assert custom) | "Esperava encontrar pelo menos N "X" na tela, mas encontrou M. Provavelmente a listagem/filtro/busca não retornou os resultados esperados (ou a UI não renderizou os elementos a tempo)." |
| `toBe(true/false)` falhou | "Condição esperada não foi atendida: esperava verdadeiro/falso, mas obteve falso/verdadeiro." |
| `toEqual(primitive)` falhou | "O valor obtido não é igual ao esperado. Esperado: X · Atual: Y." |
| `toBeTruthy()` / `toBeFalsy()` falhou | "O valor obtido era vazio/nulo/falso..." |
| `toHaveAttribute/Value/Class` falhou | "Atributo HTML/Valor/Classes CSS do elemento não bate com o esperado." |
| `expect.poll`/`waitFor` timeout | "A condição esperada não se tornou verdadeira dentro do tempo limite — a UI não chegou ao estado aguardado." |

### 2. Classificação automática propagada do bug-report

Quando `gerar-bug-report-de-tc-red` rodou antes (`bug-reports.json` existe),
o bloco `🐛 Pronto para registro de bug` no `tests.md` agora exibe um
cabeçalho destacado:

```markdown
> 🐛 **Análise automática:** Bug de produto · Confiança 🟢 alta
> _Por quê:_ HTTP 422 in-scope no PATCH /panels/:id/change_status
> _Bug-report estruturado:_ [`bug-reports/<id>.md`](bug-reports/<id>.md)

**Próximas ações sugeridas:**
- Reproduzir o cenário manualmente seguindo os passos do TC para confirmar o bug.
- Abrir `error-context.md` para ver o estado da página no momento da falha.
- Verificar Network/Console no exploratório agregado (`exploratory.md`)...
- Registrar como bug de produto no backlog do dev responsável.
```

5 categorias × 2-4 próximas ações cada (`NEXT_ACTIONS_BY_CATEGORY` no
generator.ts). Sem `bug-reports.json`, o bloco fica como antes (sem
header de classificação).

### 3. Fixme/skip exige categoria + destinatário

Default antigo: `"Caso ignorado pelo Playwright sem justificativa registrada"`
— opaco. Novo: o spec **deve** declarar categoria no formato
`test.fixme(true, '[Categoria] motivo')`. Categorias canônicas (CLAUDE.md
§7.6 Anti-pattern F):

| Categoria | Destinatário | Próximo passo |
|---|---|---|
| `xml-desatualizado` | AT / QA Lead | Atualizar o roteiro do TC no `test-analysis.md` e regenerar derivados |
| `seed-ausente` | QA Lead | Criar a seed especificada no env |
| `dep-externa` | DevOps / Infra | Verificar feature flag / serviço externo |
| `bloqueio-temporario` | Time (PM/Tech Lead) | Reabrir quando ticket fechado |

Sem declaração, o report mostra: _"[REVISAR] Motivo do skip não declarado
no spec. Edite o `test.fixme(true, '[Categoria] motivo')'..."_ — indica
ao leitor leigo que o spec precisa ser corrigido.

### 4. "Comportamento atual" interpretativo

Antes: repetia só a mensagem técnica.
Depois: combina tradução leiga + step que falhou + expectedResults do XML:

```
Comportamento atual:
Quantidade fora do esperado: deveria ser maior ou igual a 1, mas obteve 0.
(falha aconteceu no passo 3: "Aplicar o filtro", que deveria resultar em:
"Drawer fecha. Listagem exibe apenas modelos com Situação 'Ativo'.")
```

### 5. Credenciais `${VAR}` substituídas por texto amigável

Antes: `| Login | ${TWYGO_STAGING_BASE_DE_CONHECIMENTO_EMAIL} |`
Depois: `| Login | Credenciais via env: \`TWYGO_STAGING_BASE_DE_CONHECIMENTO_EMAIL\` (consulte \`.env\`) |`

### 6. Step impactado sem duplicação numérica

Antes: `Step impactado: 3. 3. Validar drawer fechou` (duplicado porque
`failedStep.title` já contém `"3. ..."` e prefixávamos com `failedStep.number`)
Depois: `Step impactado: 3. Validar drawer fechou` (deduplicado via regex)

## Override de env por annotation (v3.3+)

Specs que rodam contra um env diferente do principal do `project.config.json`
(ex: Trial via `test.use({ baseURL: TRIAL.url })`) devem emitir annotations
no `beforeEach` pra o bug-report mostrar a Trial real, não o env principal:

```ts
test.beforeEach(async ({ page }, testInfo) => {
  testInfo.annotations.push(
    { type: 'baseURL', description: TRIAL.url },
    { type: 'orgId', description: String(TRIAL.orgId) },
    { type: 'emailRef', description: '${TWYGO_TRIAL_AGENTSQA_OTHER_EMAIL} (Trial widgets)' },
    { type: 'passwordRef', description: '${TWYGO_TRIAL_AGENTSQA_OTHER_PASSWORD}' },
    { type: 'envLabel', description: 'trial-agentsqa-other (Trial widgets)' },
  );
  // ... login ...
});
```

| Annotation type | Efeito no bug-report |
|---|---|
| `baseURL` | Substitui `envEntry.baseUrl` no campo "URL". Também é usado pelo `inferFailureUrl` quando há path relativo na falha |
| `orgId` | Substitui o `orgId` extraído da URL no campo "orgId" |
| `emailRef` | Texto literal exibido em "Login" (formato livre — geralmente referência a env var, ex: `${TWYGO_..._EMAIL}`) |
| `passwordRef` | Idem em "Senha" |
| `envLabel` | Substitui o nome em "Execução → environment.json". Aparece também numa linha extra "Env (override via annotation)" pra deixar claro que foi override |

Sem annotations, o comportamento legado prevalece (lê env principal). Compatível com specs antigos sem alteração.

**Caso real (2026-05-15)**: bug-report do TC4 da suite Trial mostrava `URL: widgets.stage.twygoead.com` mesmo quando o spec rodava contra `trialagentsqa5.stage.twygoead.com`. Confundia QA — parecia que o spec não usava a Trial. Annotations corrigem.

## Quando usar

Após execução do Playwright + agregação exploratória (Fase 5.5). É chamado
automaticamente pelo `twygo-test-orchestrator` ao final do fluxo, ou pode ser
invocado manualmente:

```bash
npm run agent:report                              # all-suites (default)
npm run agent:report -- --suite "<nome>"          # per-suite
npm run agent:report -- --regression              # regressivo + Allure
```

## Modos

| Modo | Folder de saída | Uso típico |
|---|---|---|
| `--suite "<nome>"` | `outputs/reports/{slug-suite}_{ts}/` | QA testou 1 bloco |
| (default + 1 suite no test-results.json) | `outputs/reports/{slug-suite-auto-detectado}_{ts}/` | **Auto-detect** — quando agent:report roda sem flag mas o Playwright filtrou só 1 testsuite (ex: `npx playwright test path/da/suite`) |
| (default + N suites no test-results.json) | `outputs/reports/all-suites_{ts}/` | Resumo de execução não-filtrada (várias suites) |
| `--regression` | `outputs/reports/regression_{ts}/` + `outputs/allure-report/` | CI / fim de projeto |

### Auto-detect (v3.1)

Quando o gerador é invocado sem `--suite` nem `--regression`, ele inspeciona
`outputs/<projeto>/test-results.json` e conta testsuites distintas. Se houver
**1 única**, promove automaticamente para modo per-suite usando o nome dessa
testsuite — folder fica `{slug-auto-detectado}_{ts}/`, não `all-suites_{ts}/`.

Esse comportamento cobre o caso comum de QA rodar:

```bash
PROJECT=widgets npx playwright test projects/widgets/tests/features/layout-das-abas
PROJECT=widgets npm run agent:report   # auto-detecta "Layout das abas" → folder layout-das-abas_<ts>
```

Flag explícita (`--suite "<nome>"` ou `--regression`) sempre tem prioridade
sobre o auto-detect — passa-se direto pro modo correspondente sem inspecionar
o test-results.

> **Por que isso existe**: antes da v3.1, rodar `agent:report` standalone após
> filtrar 1 suite via path/grep do Playwright gerava `all-suites_<ts>/` com
> nome enganoso. O orchestrator (`agent:run`) já passava `--suite` quando 1
> única suite ativa — auto-detect generaliza esse comportamento pro CLI direto.

## Conteúdo de cada pasta de execução

```
{folder}_{YYYYMMDD-HHMMSS}/
├── index.md                ← Dashboard com KPIs + tabela por testsuite + lista de falhas
├── tests.md                ← Detalhamento dos casos de teste por testsuite
├── exploratory.md          ← Findings exploratórios + cobertura por URL
├── summary.json            ← Totais agregados (machine-readable)
├── run_context.json        ← projectName, environment, browsers, mode, timestamp
├── tests.json              ← Cópia de outputs/test-results.json (Playwright JSON)
└── exploratory.json        ← Cópia de outputs/exploratory-findings.json
```

## Rotação automática de reports (v3.2)

Após gerar o reportDir + atalhos, o generator chama `rotateReports()`
(`rotator.ts`) que:

1. Lista todos os subdirs `<prefix>_<YYYYMMDD-HHMMSS>/` em
   `outputs/<slug>/reports/`.
2. Agrupa por `<prefix>` (tudo antes do timestamp final).
3. Para cada prefix, mantém o de timestamp maior. Move os outros para
   `outputs-archive/<slug>/reports/` (gitignored).

**Resultado**: git só tem 1 reportDir por prefix (latest); histórico fica
local em `outputs-archive/` para análise/audit. Sem perda — `rename()`
no mesmo volume é instantâneo, ocupa o mesmo disco.

**Política**:
- 1 latest por prefix (per-suite + regression + all-suites)
- Atalhos `latest-*.md` ficam intactos na raiz `reports/`
- Bug-reports/exploratory por testcase NÃO rotacionam (mantêm padrão
  "latest sobrescreve por TC")

**Migração inicial** (rodar 1× ao adotar a feature):

```bash
PROJECT=widgets npx tsx .claude/skills/twygo-report-generator/rotator.ts
```

Output: lista kept (1 por prefix) + archived (vão pra `outputs-archive/`).
Subsequente: ocorre auto a cada `npm run agent:report`.

## Atalhos `latest-*.md` na raiz de `outputs/reports/`

Para abrir sempre a última run de um modo:

```
outputs/reports/latest-suite-<slug>.md       # última run da suíte X
outputs/reports/latest-regression.md          # última regressão
outputs/reports/latest-all.md                 # última execução all-suites
```

São arquivos Markdown curtos com um link relativo apontando para a pasta
mais recente correspondente. Em IDE/GitHub o link resolve direto.

## Por que MD em vez de HTML

Decisão tomada na chore/agentes-qa-overhaul (2026-05): o gerador HTML
custom (~2k linhas com CSS embutido, JS de tabela ordenável, accordeon
de detalhes) foi substituído por Markdown. Razões:

- **Leitura nativa em IDE/GitHub** — VSCode, IntelliJ e Web do GitHub
  renderizam tabelas, code blocks, `<details>`, e screenshots inline.
  Sem dependência de browser pra abrir.
- **Manutenção 70% menor** — sem CSS/temas/sortable JS pra manter.
- **Diff-friendly** — mudança em relatório é diff legível em PR. HTML
  com 2k tags vira ruído.
- **Allure continua HTML** — onde "trend histórico" e "executivo"
  importam (regressivo), o relatório built-in do Allure cobre. MD é o
  formato do dia-a-dia (per-suite + all-suites).

## Modo regressivo + Allure

Quando `--regression` é passado:

1. Gera a pasta `outputs/reports/regression_{ts}/` com os 3 `.md` + JSONs.
2. Invoca `npx allure generate outputs/allure-results -o outputs/allure-report --clean`.
3. Adiciona link no `index.md` apontando para `../../allure-report/index.html`.

O workflow `.github/workflows/regression.yml` (Fase 7) publica o
`outputs/allure-report/` em GitHub Pages, preservando o `history/` da
execução anterior para alimentar os trends.

## Entradas

- `outputs/test-results.json` (Playwright JSON reporter — obrigatório).
- `outputs/exploratory-findings.json` (validator — opcional, mas recomendado).
- `outputs/test-analysis.parsed.json` (xml-parser — recomendado, dá metadata
  do XML pros testcases).
- `projects/<slug>/project.config.json` (projectName, environment, browsers).

## Saída resumida no console

```
[INFO] [report-generator] Relatório gerado → outputs/reports/.../index.md
[INFO] [report-generator]   13✓ 1✗ 3⊘ · exploratório: 0E 1W 4I
[INFO] [report-generator]   Atalho: outputs/reports/latest-suite-....md
```
