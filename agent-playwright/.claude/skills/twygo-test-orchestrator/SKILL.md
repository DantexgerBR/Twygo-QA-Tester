---
name: twygo-test-orchestrator
description: Orquestra o ciclo completo de geração e execução de testes Playwright a partir do JSON parseado do XML TestLink. Delega planejamento, geração e healing aos subagentes do plugin oficial Playwright (planner/generator/healer) com contexto Twygo. Suporta modo per-suite (dia-a-dia) e modo regressivo (CI).
version: 1.0.0
---

# twygo-test-orchestrator

## Quando usar

Sempre que o time de QA precisa **gerar, executar ou consertar specs Playwright**
a partir da análise de testes em XML TestLink. Cobre dois cenários:

| Cenário | Quem invoca | Como |
|---|---|---|
| **Per-suite (dia-a-dia)** | QA da Twygo, localmente | `claude` interativo + esta skill |
| **Regressivo / CI** | GitHub Actions | `npm run agent:regression` |

## Pré-requisitos

- `outputs/test-analysis.parsed.json` existe (rode `npm run agent:parse` antes).
- Plugin oficial Playwright instalado (ver [SETUP.md](../../SETUP.md)).
- Playwright MCP rodando (`.mcp.json` registrado).
- Ambiente Twygo acessível (URL configurada em `config/environment.json`).
- Page Objects existentes em `src/pages/` para reuso.
- `src/utils/testIds.ts` central (cria sob demanda se não existir).

## Fluxo orquestrado

### Etapa 1 — Determinar escopo

| Argumento | Comportamento |
|---|---|
| `--suite "<nome literal>"` | Filtra por nome exato ou substring da `<testsuite>` |
| `--all` | Todas as testsuites |
| `--regression` | `--all` + `REGRESSION=true` (ativa reporter Allure) |

Se nenhum, padrão é executar `--all` (regressivo curto, sem Allure).

### Etapa 2 — Planejamento (planner)

Para cada `<testcase>` no escopo:

1. Carregar do JSON parseado: `name`, `summary`, `preconditions`, `importance`,
   `executionType`, `steps[]`.
2. Invocar o subagente **`planner`** do plugin Playwright com este contexto:
   ```
   Você está testando a plataforma Twygo (módulo: <nome da testsuite>).
   Caso de teste: <nome do testcase>
   Resumo: <summary>
   Pré-condições: <preconditions>
   
   Passos a automatizar:
   1. AÇÃO: <step.actions> | RESULTADO ESPERADO: <step.expectedResults>
   2. AÇÃO: ...
   
   Convenções obrigatórias (ver CLAUDE.md seção 5):
   - Tradução de prosa PT-BR → Playwright conforme padrões documentados.
   - Preferir getByTestId; se não houver data-testid no DOM, sugerir adicioná-lo.
   - Nunca waitForTimeout.
   - Annotations Allure obrigatórias (ver Etapa 4).
   ```
3. Validar que o plano contempla **todos** os steps do XML — não pode pular.
4. Se o planner reportar ambiguidade ou impossibilidade, marcar como
   `// REVISAR` e prosseguir (não chutar).

### Etapa 3 — Geração de Page Objects (sob demanda)

Antes do generator escrever o spec:

1. Listar pages únicas referenciadas no plano (ex.: `LoginPage`, `KitMarcaListPage`).
2. Para cada page:
   - Se já existe em `src/pages/`, reutilizar — NÃO sobrescrever locators existentes.
   - Se não existe, gerar com `templates/page-object-template.ts` + Playwright MCP
     para descobrir locators reais no DOM.
3. Atualizar `src/utils/testIds.ts` com novos `data-testid` mapeados.

### Etapa 4 — Geração de spec (generator)

Para cada testcase planejado:

1. Invocar o subagente **`generator`** do plugin Playwright com:
   - O plano da Etapa 2.
   - Lista de Page Objects disponíveis (e quais métodos eles expõem).
   - Acesso ao Playwright MCP para validar seletores ao vivo.
   - Convenções do CLAUDE.md (importar de `exploratory-fixture`).
2. Annotations Allure obrigatórias no início de cada `test()`:
   ```ts
   await allure.epic(`Twygo - ${projectName}`);                    // do projectName em config
   await allure.feature(`${testsuiteName}`);                       // do <testsuite name>
   await allure.story(`${testcaseName}`);                          // do <testcase name>
   await allure.severity(severityFromImportance(importance));      // 1=minor, 2=normal, 3=critical
   if (executionType === 1) await allure.label('executionType', 'manual');
   else if (executionType === 2) await allure.label('executionType', 'automated');
   for (const step of steps) {
     await allure.step(`${step.stepNumber}. ${step.actions}`, async () => {
       // ... ações Playwright
     });
   }
   ```
3. Escrever em `tests/features/<slug-suite>/<slug-testcase>.spec.ts`
   (organização por suíte facilita filtro `--grep` e leitura).
4. Rodar `npm run typecheck` — se falhar, **parar** e pedir correção ao
   generator antes de seguir.

### Etapa 5 — Execução

Delegar ao Node helper [`orchestrator.ts`](orchestrator.ts) que:

1. Constrói `--grep` apropriado para o escopo (suite filter ou tudo).
2. Define `REGRESSION=true` se modo regressivo.
3. Invoca `npx playwright test`.
4. Captura exit code para retornar ao final.

### Etapa 6 — Validação Exploratória

Após a execução, **sempre**:

```bash
npm run agent:explore
```

Que invoca `twygo-exploratory-validator` para agregar findings.

### Etapa 7 — Relatório

```bash
npm run agent:report -- --suite "<nome>"        # per-suite
# OU
npm run agent:report -- --regression             # regressivo
```

### Etapa 8 — Healing (opcional, sob falha)

Se houve falhas que parecem **mudança de UI** (não bug funcional):

1. Identificar specs com falha por seletor não encontrado / timeout.
2. Para cada um, invocar o subagente **`healer`** do plugin Playwright:
   - Input: spec + screenshot da falha + DOM atual via Playwright MCP.
   - O healer propõe correção minimal (apenas seletor/espera/asserção,
     **nunca** muda o que o teste valida).
3. Apresentar diff ao QA para aprovação antes de aplicar.

## Modos de uso

### Modo interativo (per-suite, dev local)

```
$ cd agent-playwright
$ claude
> Execute o orquestrador para a suíte "[Kit de marca] QA 2.1 - ..."
```

Claude carrega `CLAUDE.md` + esta SKILL.md, executa Etapas 1–7 acima,
mostra resumo + link para o relatório.

### Modo CLI (apenas execução, sem regenerar)

Quando os specs já estão commitados e você só quer **executar**:

```bash
# Per-suite
npm run agent:run -- --suite "[Kit de marca] QA 2.1 - ..."

# Regressivo
npm run agent:regression
```

### Modo regeneração forçada

Quando o XML mudou e precisa regerar specs:

```
$ claude
> Regenere os specs da suíte "<nome>" — XML foi atualizado pelo AT
```

O orquestrador detecta `tests/features/<slug>/*.spec.ts` existentes,
compara com o JSON, regenera os que mudaram, preserva os outros.

## Saídas

Após orquestração completa:

```
tests/features/<slug-suite>/*.spec.ts        # specs gerados/atualizados
src/pages/<NewPage>.ts                       # POMs gerados/atualizados
src/utils/testIds.ts                         # data-testids registrados
outputs/test-results.json                    # do Playwright
outputs/exploratory/*.json                   # da fixture
outputs/exploratory-findings.json            # do validator
outputs/reports/{slug-suite}_{timestamp}/    # do report-generator (per-suite)
outputs/allure-report/                       # do Allure CLI (regressivo)
```

## Regras

1. **Nunca** gerar testcase que não está no XML — XML é fonte única de verdade.
2. **Sempre** preservar Page Objects existentes — só estender, não sobrescrever.
3. **Sempre** rodar typecheck antes de tentar executar.
4. **Sempre** invocar validator + report-generator após execução.
5. **Não** modificar `inputs/` ou `outputs/` durante a orquestração (somente `outputs/` é gravado pelos sub-skills).
6. Healer **só** corrige seletor/timing/asserção. Para mudanças de intenção,
   o XML do AT precisa ser atualizado primeiro.
