# Bootstrap de novo projeto Twygo

Ritual para iniciar um projeto novo no agente Playwright. O `master` é o
baseline genérico do agente; cada projeto vive na própria branch para
isolar inputs, specs gerados, POMs específicos e relatórios.

## 1. Criar branch dedicada

A partir do `master` atualizado:

```bash
cd agent-playwright/..        # raiz do monorepo
git checkout master
git pull origin master
git checkout -b project/<slug-do-projeto>     # ex.: project/kit-de-marca
```

> **Convenção de slug**: lowercase, hífens. Ex.: `kit-de-marca`,
> `aprendizagem-compartilhamentos`, `play-config-aparencia`.

## 2. Receber inputs do agente AT

Drop os arquivos em [`inputs/`](../inputs/):

- **`Analise_Teste_<NomeDoProjeto>.xml`** — XML TestLink gerado pelo agente
  AT a partir do XMind. **Obrigatório** — é a fonte de verdade dos casos
  roteirizados.
- **`Quebra de atividades - <NomeDoProjeto>.xlsx`** — opcional, só para
  referência humana (este agente não processa o XLSX; ele é input do
  agente AT, não do Playwright).

## 3. Atualizar configuração

Edite [`config/project.config.json`](../config/project.config.json):

```jsonc
{
  "projectName": "Kit de Marca",                                   // nome literal — vai pro Allure epic
  "testAnalysisFile": "inputs/Analise_Teste_Kit_de_Marca.xml",     // caminho do XML do passo 2
  "environment": "staging",                                         // staging | production
  "browsers": ["chromium"],
  // ... resto inalterado
}
```

E [`config/environment.json`](../config/environment.json) se URLs/credenciais
mudarem por projeto (geralmente não — é a mesma plataforma Twygo).

## 4. Validar setup

```bash
cd agent-playwright
npm install                                # se primeira vez na máquina
npx playwright install chromium            # se primeira vez na máquina
npm run typecheck                          # garantir que tudo compila
npm run agent:parse                        # parsear o XML, verificar contagens
npm run agent:suites                       # listar as testsuites do projeto
```

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

## 5. Commit baseline da branch

```bash
git add agent-playwright/inputs/Analise_Teste_<projeto>.xml \
        agent-playwright/config/project.config.json
# (opcional) git add "agent-playwright/inputs/Quebra de atividades - <projeto>.xlsx"
git commit -m "chore(<slug>): bootstrap projeto <Nome do Projeto>"
git push -u origin project/<slug-do-projeto>
```

## 6. Fluxo dia-a-dia (per-suite, conforme dev entrega blocos)

Cada bloco entregue:

```bash
# Liste as suítes para confirmar o nome literal
npm run agent:suites

# Rode parse + planner + generator + execução + validador + report
npm run agent:run -- --suite "[Kit de marca] QA 2.1 - Kit de marca - Criar / Editar - Identificação"
```

Resultado: `outputs/reports/{slug-suite}_{timestamp}/index.html`.

Se a geração precisar do plugin oficial Playwright (planner/generator/healer),
use o Claude Code interativo dentro de `agent-playwright/`:

```bash
cd agent-playwright
claude
> Execute o orquestrador para a suíte "[Kit de marca] QA 2.1 - ..."
```

Após a execução estabilizar:

```bash
git add agent-playwright/tests/features/<slug-suite>/ \
        agent-playwright/src/pages/<NewPages>.ts \
        agent-playwright/src/utils/testIds.ts
git commit -m "test(<slug-suite>): add specs do bloco QA 2.1"
```

## 7. Healing após mudança de UI

Quando um teste falha por seletor não encontrado / timing (não bug funcional):

```bash
cd agent-playwright
claude
> Invocar o healer do plugin Playwright para tests/features/<arquivo>.spec.ts
```

O healer propõe correção via diff. Aprove → commit no branch do projeto.

## 8. Encerramento do projeto: regressivo completo

Quando todos os blocos passaram individualmente:

```bash
# Limpa outputs antigos
npm run clean

# Rodada completa: todos os specs + Allure + GH Pages
npm run agent:regression
```

O workflow [`.github/workflows/regression.yml`](../../.github/workflows/regression.yml)
roda automaticamente em PR para `main` (se você abrir um); localmente o
mesmo comando produz `outputs/allure-report/` + `outputs/reports/regression_{ts}/`.

## 9. Arquivar o projeto

A branch fica preservada como histórico:

```bash
# Opcional — se quiser tag para releases
git tag project/kit-de-marca/v1.0
git push origin project/kit-de-marca/v1.0
```

**Não merge** a branch de volta no `master` — ela contém artefatos
específicos do projeto (XML, specs, POMs específicos) que poluiriam o
baseline. O master só recebe melhorias do agente em si, em PRs separados.

## 10. Próximo projeto

Repete do passo 1 com novo slug e novo XML.

---

## Checklist rápido para um novo projeto

- [ ] Branch `project/<slug>` criada a partir do master atualizado
- [ ] XML TestLink dropado em `inputs/Analise_Teste_<projeto>.xml`
- [ ] (opcional) XLSX dropado em `inputs/Quebra de atividades - <projeto>.xlsx`
- [ ] `config/project.config.json` atualizado (`projectName` + `testAnalysisFile`)
- [ ] `npm run typecheck` exit 0
- [ ] `npm run agent:parse` lista as suítes esperadas
- [ ] `npm run agent:suites` mostra os blocos
- [ ] Commit baseline da branch
- [ ] Push para o remoto
