---
name: debugar-generator-travado
description: O subagent `playwright-test-generator` (do plugin oficial Microsoft) trava silenciosamente em `generator_setup_page` depois de uma execução longa do planner na mesma sessão MCP — sem produzir output, sem timeout, sem erro. Use quando o generator estiver rodando há >10min sem nenhum output visível, ou quando você dispatch 2 generators paralelos e ambos ficaram "running" indefinidamente.
when_to_use: |
  - `playwright-test-generator` rodando >10min sem output visível
  - Dispatch de 2+ generators paralelos travou todos em `running`
  - `TaskOutput(block=false)` mostra `not_ready` indefinidamente
  - TaskStop forçado mostra trace parado antes de `generator_setup_page`
triggers:
  - "generator_setup_page"
  - "playwright-test-generator travado"
  - "TaskOutput not_ready"
  - "subagent travado"
  - "MCP playwright-test"
  - "feedback_parallel_mcp_limit"
version: 1.0.0
---

# debugar-generator-travado

## Sintoma canônico

- Dispatch de `playwright-test-generator` via Agent tool retorna agentId mas
  fica `running` indefinidamente.
- `TaskOutput(block=false)` mostra `retrieval_status: not_ready` por +30min.
- Quando `TaskStop` força encerramento, o `<result>` capturado mostra o agent
  parado numa linha tipo: `"Now I'll set up the page for the test scenario."`
  ou `"The POM structure is clear. Now I'll set up the page..."` — sempre
  imediatamente antes de chamar `generator_setup_page`.

## Quando o trava acontece (padrão observado em 2026-05-11)

Reprodução em sessão Claude Code que **já tinha**:

1. Rodado `npm run agent:recon -- --suite ...` (1ª chamada Playwright Node — fora do MCP).
2. Dispatch `playwright-test-planner` subagent que ficou **8+ minutos** explorando ao vivo via MCP, fez ~58 tool_uses, criou painéis de teste no produto, e finalizou OK.
3. Dispatch 2× `playwright-test-generator` em paralelo — ambos travaram em `generator_setup_page` por 1h+ sem output.

A memória `feedback_parallel_mcp_limit` documentava N>2 = trava, N≤2 = ok.
Esta sessão **mostrou trava com N=2** — provável causa: o MCP server
acumulou estado da run anterior (planner) e não conseguiu spawn novo
contexto pros generators.

## Workaround testado

**Parar os generators travados e escrever specs manualmente.**

1. Identifique os agentIds travados (vêm no resultado do dispatch `Agent`).
2. `TaskStop` cada um.
3. **Não tente re-dispatch** na mesma sessão — o MCP server provavelmente
   ainda está num estado bagunçado. Re-dispatch só falha de novo.
4. Use o **plano salvo pelo planner** (`projects/<slug>/specs/<slug>-plan.md`)
   como contrato + os Page Objects criados (manualmente pelo orquestrador
   na Etapa 3) e **escreva os specs `.spec.ts` direto via Write tool**.
5. Cada spec segue o template canônico (importar de `exploratory-fixture`,
   allure annotations, `test.describe('<testsuite>', () => { test('<name>') })`,
   POM-only no body). Modelo: copie qualquer spec verde de `projects/<slug>/tests/features/`.
6. `npm run agent:run -- --suite "<nome>"` ao final. Se falhar por seletor
   frágil, ajuste o POM correspondente e re-rode com `--grep`.

Custo: ~3-5 min por spec manualmente vs ~5-8 min por generator dispatch
(quando funciona). Para uma testsuite de 10-20 specs, manual é ~50% mais
rápido **se o generator estiver travando** — sem contar o tempo perdido
no debug.

## Fix definitivo (não automatizado)

Encerrar a sessão Claude Code e reabrir. O MCP server `playwright-test`
spawna fresh no próximo `playwright-test-*` subagent dispatch e o
generator volta a funcionar normalmente.

Não consigo automatizar isso da minha cadeira — exige que o QA feche e
abra a sessão. Em sessões longas com múltiplos subagents Playwright, vale
preventivamente fechar/reabrir entre planner e generators.

## Checklist de 1 minuto pra decidir

1. **Quanto tempo o generator tá `running`?**
   - <5min: aguarde.
   - 5-10min: dispare `TaskOutput(block=false)` pra ver se há sinal de vida.
   - 10min: provavelmente travou. Vá pro passo 2.

2. **Houve planner subagent na mesma sessão antes?**
   - Sim, planner durou 5+ min e gravou plano OK → muito provável que é
     este bug. Pivotar pra manual.
   - Não → talvez outra causa (env var, MCP não spawnado, etc). Veja
     `debugar-mcp-playwright-env` antes.

3. **Dispatch foi N=2 ou N≥3 paralelos?**
   - N≥3: era esperado (memória `feedback_parallel_mcp_limit`). Trava
     conhecida.
   - N=1 ou N=2: bug deste skill. Não retry — pivota.

## Anti-patterns

- ❌ **Re-dispatch outro generator depois de TaskStop.** Mesma sessão
  MCP = mesmo estado = mesmo trava.
- ❌ **Reduzir batch de 2 para 1 e re-tentar.** Não resolve se a causa é
  estado acumulado da run anterior, não concorrência.
- ❌ **`sleep` ou wait por mais output.** Não vai vir. Se travou em
  `generator_setup_page` por 10min, vai ficar travado pra sempre.
- ❌ **Esquecer de marcar `TaskCreate` antes de pivotar.** Mantenha
  rastro: tarefa "Generator: gerar specs" continua válida com `[in_progress]`
  enquanto você escreve manualmente.

## Por que esta skill existe

Em 2026-05-11, suíte "Adicionar/editar aba" do projeto widgets — após
planner rodar com sucesso (8min, plano de 296 linhas para 18 testcases),
2 generators paralelos dispatched ficaram running por 1h+ sem output.
Pivot pra escrita manual de 18 specs + .data.ts files levou ~25min e
deu 15/18 passes na 1ª rodada (mais 2 fixme intencionais; só 1 flake).

A memória `feedback_parallel_mcp_limit` cobria N≥3 mas não previa que
N=2 traria-se após uma run longa do planner. Esta skill complementa:
diagnóstico do sintoma + workaround de quando pivotar.

## Quando o workaround NÃO basta

Se você está num CI sem possibilidade de intervenção humana (regression
mode), e o generator trava, **falhe o job e abra issue**. Não tente
auto-pivot pra escrita manual em CI — o LLM no CI não tem o contexto
todo da sessão local pra escrever specs corretos. Melhor falhar visível
e o QA refazer manualmente.
