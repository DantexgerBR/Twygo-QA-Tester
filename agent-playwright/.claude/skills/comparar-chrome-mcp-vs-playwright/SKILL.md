---
name: comparar-chrome-mcp-vs-playwright
description: Fluxo de auditoria pra quando um spec Playwright Twygo falha. Reproduz o mesmo cenário via chrome-devtools-mcp (que simula humano via CDP — clique físico, mouse real, sem state shared) e compara passo-a-passo com o que o Playwright fez. Heurística canônica categoriza a falha em flakiness/bug-produto/spec-errado/ok antes de tocar no código. Use no triage de testes vermelhos antes de pedir healer pra "consertar".
version: 1.0.0
---

# comparar-chrome-mcp-vs-playwright

## Quando usar

- Spec Playwright falhou — antes de pedir healer pra consertar, **valide
  primeiro se é o produto ou o spec**.
- Triage batch — listou 8 testes vermelhos, precisa categorizar quais
  são bug, quais são flakiness, quais são seed errado.
- Bug intermitente — passou local, falhou CI, ou alterna. Sem
  comparação com chrome-mcp você nunca sabe se é o ambiente, a rede ou
  o spec.

## Por que existe

chrome-devtools-mcp simula um QA humano via CDP: mouse físico, clique
real, sem `storageState` herdado, sem reuso de browser context. **É a
ground truth do que um usuário enxerga AGORA, no ambiente real.**

Playwright roda em browser headless (ou headed) gerenciado pelo runner,
com fixtures, retries, storage compartilhado. **É o que o robô do CI
enxerga sob as condições do test runner.**

Quando os dois divergem, o sintoma diz qual lado está mentindo.

Caso real Twygo widgets, 2026-05-13 (`outputs/widgets/debug-cobertura-vs-playwright.md`):
3 testes vermelhos. Sem chrome-mcp, o reflexo seria "consertar os 3
seletores". Com chrome-mcp, descobriu-se:

- 1 era spec errado (assert acoplado a count do seed)
- 2 eram flakiness (render + rede) — produto OK, suite OK, só re-rodar

Conclusão: dos 3, **só 1 precisava de fix de código**. Os outros 2
seriam falsos positivos se o healer mexesse.

## Heurística canônica

| chrome-mcp | Playwright | Veredito | Ação |
|---|---|---|---|
| ✅ | ✅ | OK — passou | Nada a fazer |
| ✅ | ❌ | **Flakiness** OU **seletor frágil** OU **spec errado** (sub-categorize) | Re-rodar 3× isolado. Persistiu? Aplicar [`criar-spec-resiliente-twygo`](../criar-spec-resiliente-twygo/SKILL.md) ou healer |
| ❌ | ❌ | **Bug produto** OU **seletor desatualizado** OU **seed inviável** | [`debugar-via-network-e-console`](../debugar-via-network-e-console/SKILL.md) pra confirmar causa raiz. Marcar como FAILING-BY-PRODUCT-BUG ou abrir issue de seed |
| ❌ | ✅ | **Raro** — Playwright passando por seletor frágil que casa visual mas caminho real do humano não funciona | Investigar prosa do XML + DOM live. Geralmente seletor antigo está casando sem querer |

### Sub-categorização do quadrante `chrome-mcp ✅ + Playwright ❌`

Esse é o quadrante mais comum e o que exige mais cuidado. Sub-categorias:

| Sintoma Playwright | Provável causa | Skill / fix |
|---|---|---|
| `Timeout` em `waitFor` de elemento que chrome-mcp confirma "está lá" | Timing pós-hydration React | Princípio 2 de [`criar-spec-resiliente-twygo`](../criar-spec-resiliente-twygo/SKILL.md): `timeout: 60_000` |
| `net::ERR_*` no goto | Flakiness de rede | Princípio 3: garantir Page Object → safeGoto. Re-rodar |
| `expect(X).not.toEqual(Y)` falha mas chrome-mcp confirma estados iguais | Spec acoplado a count exato do seed | Princípio 1: reescrever como invariante |
| `click` cai em overlay; chrome-mcp confirma overlay não existe agora | Modal oportunista (NPS Sofia, etc) — apareceu em runner, não em mcp | [`fechar-modais-twygo`](../fechar-modais-twygo/SKILL.md) |
| `getByRole(...)` não encontra mas DOM tem elemento equivalente | Seletor desatualizado | Healer (`browser_generate_locator`) |

### Sub-categorização do quadrante `chrome-mcp ❌ + Playwright ❌`

| Sintoma chrome-mcp | Provável causa | Ação |
|---|---|---|
| Backend retorna 4xx/5xx visível em Network | Bug produto | Comentário FAILING-BY-PRODUCT-BUG no topo do spec + link issue. Deixar vermelho |
| Tela não tem o elemento esperado (UI mudou) | XML desatualizado | `test.fixme` com mensagem "XML desatualizado" → AT/QA Lead |
| Seed do tenant não tem o estado necessário (ex: painel inativo + menu vinculado) | Seed ausente | `test.fixme` com mensagem "seed ausente: <especificação>" → QA Lead |
| Feature flag/contrato desligado num env errado | Config DevOps | `test.fixme` com ticket DevOps |

## Roteiro de auditoria — 5 passos

Use quando triagem precisa categorizar 1 teste vermelho. Tempo médio:
5-10 minutos por teste.

### Passo 1 — Identificar TC que falhou no triage

Do `outputs/<slug>/playwright-summary.md` ou
`outputs/<slug>/reports/<runId>/index.md`, anote:

- **Nome do TC** (= `test()` title = testcase name do XML)
- **Arquivo do spec** (`projects/<slug>/tests/features/.../<tc>.spec.ts`)
- **Erro exato** (linha + mensagem)
- **error-context.md** do `test-artifacts/` (screenshot + trace)

### Passo 2 — Abrir spec e extrair fluxo

Leia o spec. Anote em prosa simples:

1. **Pré-condições**: storageState? env? data fixture?
2. **Steps**: cada `allure.step()` ou Page Object call em ordem
3. **Asserções**: cada `expect(...)` que aparece

Exemplo (do TC F1 — paginação):

```
Pré: storageState staging-widgets, org 36988
Steps:
  1. paineis.goToList() → goto /o/36988/use_modes?tab=panels-tab
  2. paineis.getCardCount() → captura count antes
  3. paineis.goToNextPage() → click no botão "2"
  4. paineis.getPageButton(2).waitFor() → espera ativo
  5. paineis.getCardCount() → captura count depois
Asserções:
  - expect(cardsAfter).not.toEqual(cardsBefore)
```

### Passo 3 — Reproduzir no chrome-mcp passo a passo

**Sequência canônica de tools** (chamadas via `mcp__plugin_chrome-devtools-mcp__*`):

```
1. mcp.new_page({ url: '<env-baseUrl>/users/login' })  // ou state secundário
2. mcp.fill_form([{ name: 'Login', value: '...' }, { name: 'Senha', value: '...' }])
3. mcp.click({ text: 'Entrar' })
4. mcp.navigate_page({ url: '<rota-do-spec>' })
5. Pra cada step do spec: mcp.click / mcp.fill / mcp.wait_for
6. Após cada step: mcp.take_snapshot() pra capturar DOM e validar estado
7. Pra asserções: mcp.evaluate_script() ou inspeção do snapshot
```

**Validações cruzadas obrigatórias**:

- `mcp.list_network_requests({ resourceTypes: ['xhr', 'fetch'] })`
  — alguma 4xx/5xx escondida? (ver [`debugar-via-network-e-console`](../debugar-via-network-e-console/SKILL.md))
- `mcp.list_console_messages()` — erros JS engolidos?
- `mcp.take_screenshot()` — pra evidência no triage report

### Passo 4 — Comparar resultado de cada passo

Tabela mental (ou markdown se for triage formal):

| Step do spec | Playwright resultado | chrome-mcp resultado | Diverge? |
|---|---|---|---|
| goToList | ❌ Timeout em tab "Painéis" | ✅ tab visível 2s | **SIM** |
| getCardCount before | (não chegou) | 25 rows | — |
| goToNextPage | (não chegou) | botão "2" ativo após click | — |
| getCardCount after | (não chegou) | 25 rows | — |
| expect not.toEqual | (não chegou) | 25 == 25 (falharia) | **SIM** |

**Lê a coluna "Diverge"**: em quais steps Playwright e chrome-mcp
divergiram?

- Divergência em **step de navegação/waitFor** → timing/render
- Divergência em **step de assert** que ambos chegariam → spec errado
- Divergência em **step de click** → modal/overlay ou seletor frágil

### Passo 5 — Categorizar via heurística + atualizar triage

Aplique a heurística:

- Olha as colunas finais (último step que cada lado chegou)
- Cruza com a tabela canônica acima
- Categoriza

Para o exemplo F1:
- Playwright falhou em step 5 (`expect not.toEqual`)
- chrome-mcp completaria step 5 com mesmo veredito (25 == 25 = falha)
- Quadrante: **ambos falhariam no assert** → categoria "Spec errado"
- Sub: assert acoplado a count exato do seed
- Fix: Princípio 1 de [`criar-spec-resiliente-twygo`](../criar-spec-resiliente-twygo/SKILL.md)

Registra no triage:

```
TC F1 — Paginação:
  Categoria: SPEC ERRADO (assert frágil acoplado a count do seed)
  Evidência: chrome-mcp confirma pág 2 com 25 rows (= pág 1)
  Fix: asserir nome do 1º row mudou (não count)
  Owner: healer (aplicar Princípio 1)
```

## Exemplo concreto — F1/F2/F3 da listagem-de-paineis

Evidência completa em [`outputs/widgets/debug-cobertura-vs-playwright.md`](../../../outputs/widgets/debug-cobertura-vs-playwright.md).

### F1 — Paginação

| Passo | Playwright | chrome-mcp |
|---|---|---|
| 1. Abrir listagem | ✅ | ✅ — 25 rows, paginação `1 2 3 4 5` |
| 2. Click "página 2" | ✅ | ✅ — firstRow mudou pra "Painel Pesquisa Widget 1778687712208" |
| 3. Contar rows pág 2 | 25 | 25 (não 5 como spec assumia) |
| 4. Assert `not.toEqual(25, 25)` | ❌ falha | ❌ falharia também |

**Quadrante**: chrome-mcp ❌ + Playwright ❌ no assert
**Sub-categoria**: spec errado (acoplado a seed). Cobertura real do
teste é boa, só o assert quebra.
**Fix**: Princípio 1.

### F2 — Validar colunas

| Passo | Playwright | chrome-mcp |
|---|---|---|
| 1. goto + safeGoto | ✅ DOMContentLoaded | ✅ |
| 2. Esperar tab "Painéis" | ❌ Timeout 30s | ✅ visível + selected aria-selected=true em ~2s |
| 3. Validar 5 colunas | (não chegou) | ✅ 5 `<th>` confirmados |

**Quadrante**: chrome-mcp ✅ + Playwright ❌ no waitFor
**Sub-categoria**: timing pós-hydration (React Twygo hidrata tab
tardiamente)
**Fix**: Princípio 2 (`timeout: 60_000`).

### F3 — Validar componentes

| Passo | Playwright | chrome-mcp |
|---|---|---|
| 1. goto | ❌ `net::ERR_NETWORK_CHANGED` | ✅ |
| 2-5. Verificar componentes | (não chegou) | ✅ todos os 7 componentes presentes |

**Quadrante**: chrome-mcp ✅ + Playwright ❌ no goto
**Sub-categoria**: flakiness de rede (sem relação com cobertura)
**Fix**: garantir Page Object → safeGoto (já retenta). Re-rodar.

## Anti-patterns

- ❌ **Pedir healer pra "consertar" sem antes comparar com chrome-mcp.**
  Healer pode trocar seletor que estava correto e mascarar a causa raiz
  (timing/rede/seed).
- ❌ **Concluir "é flakiness" só porque re-rodou e passou.** Sem
  chrome-mcp você não sabe se foi o ambiente que melhorou ou se foi
  sorte do scheduler.
- ❌ **Não checar Network do chrome-mcp.** Mesma regra de
  [`debugar-via-network-e-console`](../debugar-via-network-e-console/SKILL.md):
  4xx/5xx engolidos só aparecem na Network.
- ❌ **Usar chrome-mcp com storageState reciclado do Playwright.** Não
  faz sentido — chrome-mcp deve simular usuário fresco. Login real,
  sem state pré-carregado.
- ❌ **Aceitar o quadrante "raro" (chrome-mcp ❌ + Playwright ✅) sem
  investigar.** Geralmente significa que o seletor antigo casa visual
  mas o caminho real do humano não funciona. Spec passa por engano.

## Quando NÃO usar esta skill

- Smoke test do login que sempre passa — overhead desnecessário
- Teste local antes do primeiro commit — usa só Playwright + dev
  inspecionando manualmente
- Spec novo recém-gerado que nunca rodou — primeiro rode 1× pra ver o
  output. Se passar de primeira, segue. Se falhar, aí sim entra essa
  skill no triage.

## Skills relacionadas

- [`criar-spec-resiliente-twygo`](../criar-spec-resiliente-twygo/SKILL.md)
  — princípios pra evitar os 3 padrões de flakiness em primeiro lugar
- [`debugar-via-network-e-console`](../debugar-via-network-e-console/SKILL.md)
  — Network + Console como camada complementar pra confirmar bug produto
- [`twygo-triage-report`](../twygo-triage-report/SKILL.md) — formato de
  saída do triage com a categorização
- [`fechar-modais-twygo`](../fechar-modais-twygo/SKILL.md) — sub-categoria
  comum do quadrante `chrome-mcp ✅ + Playwright ❌`
- [`debugar-bug-produto-stale`](../debugar-bug-produto-stale/SKILL.md) —
  pra validar se um FAILING-BY-PRODUCT-BUG antigo ainda é bug ou já
  foi corrigido
