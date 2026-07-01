---
name: testar-kpi-cards-twygo
description: Padrão canônico de teste dos KPI cards de Registros de Aprendizagem (Twygo) — faixa de 4 cards (Emitidos/Expirados/Pendentes/Recusados) com donut em <canvas>, que funcionam como filtro de status clicável (visão Aluno) ou dashboard estático (visão Admin/Líder). Cobre seletores estáveis, a técnica de validar cor do donut (canvas, não introspectável) via border do card ativo, asserção por invariante contra /records/stats, faixa permanente, poll de transição Chakra e as divergências produto×AT já mapeadas. Use ao gerar/healear specs de QUALQUER suíte de KPI cards de Registros (Aluno, Admin/Líder, tempo real).
version: 1.1.0
---

# testar-kpi-cards-twygo

## Quando usar

Ao gerar ou healear specs Playwright de qualquer suíte de **KPI cards de
Registros de Aprendizagem** do Twygo:

- "KPI cards como filtro de status (Aluno)" ← primeira implementada (referência)
- "KPI cards como dashboard estático (Admin/Líder)"
- "Atualização de KPIs em tempo real (ações, expiração e batch)"
- qualquer TC cujo "Resultado esperado" fale em card de status, donut,
  contagem por status, ou faixa de KPIs.

O padrão se repete entre suítes — não redescubra seletores nem a técnica de
cor a cada vez.

## A tela (visão Aluno = "Meu Histórico")

- **Rota**: `/o/${getOrgId()}/records?in_use_mode_layout=true`
  (sidebar id `my_history-menu`, label "Meu Histórico BETA").
- **Persona**: nesta org (`registros-externos`) o aluno é rotulado
  **"Colaborador"** (popover usa class `new-item-aluno`) e o user do
  globalSetup já cai nele. A rota com `in_use_mode_layout=true` renderiza o
  layout do aluno **independentemente do perfil ativo** → NÃO precisa trocar
  perfil pela UI (ver [[trocar-perfil-twygo]] só se o TC exigir o popover).
- **Visão Admin/Líder**: breadcrumb "Aprendizagem > Registros" — mesma
  anatomia de cards, mas cards são **dashboard estático** (não filtram) e a
  contagem cobre a org/equipe, não o próprio usuário. Confirmar seletores
  live antes (podem repetir os `records-kpi-*`).

## Seletores estáveis (data-test-id)

| Elemento | testId |
|---|---|
| Tab da tela | `tab-records-tab` |
| Card (role=button) | `records-kpi-card-{emitted,expired,pending,rejected}` |
| Número da contagem | `records-kpi-count-{emitted,expired,pending,rejected}` |
| Label carga horária | `records-total-workload` |
| Botão abrir drawer filtro | `filter-control-open-button` |

Endpoint de contagem: `GET /api/v1/o/<org>/records/stats?in_use_mode_layout=true`
→ `{ data: { by_status: { emitted, expired, pending, rejected }, total_general, workload_total_seconds } }`.
`by_status` traz só os 4 status com card; `total_general` é a soma dos **6**
status (inclui Substituído e "Em andamento", que não têm card).

POM de referência: `projects/registros-externos/pages/MeuHistoricoPage.ts`.
Specs de referência: `projects/registros-externos/tests/features/kpi-cards-filtro-status-aluno/`.

## ⚠️ REGRESSÃO 2026-06-29 — produto renomeou status `pending` → `awaiting_confirmation`

Recon ao vivo (org 37093, Aluno E Admin) confirmou que o produto **trocou o
testid e os labels** dos cards. O POM/skill antigo usa `pending` e os labels
curtos — **está desatualizado e quebra o carregamento** (`expectLoaded` espera
`records-kpi-card-pending`, que não existe mais → 60s timeout).

| Antes (POM atual) | Agora (produto, 2026-06-29) |
|---|---|
| testid `records-kpi-card-pending` / `records-kpi-count-pending` | `...-awaiting_confirmation` |
| `/stats` `by_status.pending` | `by_status.awaiting_confirmation` |
| label "Emitidos" | "Certificados emitidos" |
| label "Expirados" | "Certificados expirados" |
| label "Pendentes" | "Registros aguardando confirmação" |
| label "Recusados" | "Registros recusados" |

**Impacto**: quebra TODA suíte que depende do gate de cards via
`RegistrosAdminPage.goto()`/`MeuHistoricoPage.goto()` →
`expectLoaded`/`waitForCountsHydrated`: KPI Aluno (1.3), KPI Admin/Líder (1.4),
tempo real (1.5), ações em massa (1.12, via `getCount('pending')`). Todas
provavelmente VERMELHAS hoje por isto, sem ninguém ter mexido nelas.

**Correção pendente (refactor dedicado, NÃO feito ainda)**: renomear a chave
`KpiStatus` `pending` → `awaiting_confirmation` em `MeuHistoricoPage.ts`
(+ `KPI_LABEL`, `KPI_COLOR`, `ORDER`), atualizar os labels (toContainText e o
regex `getCardLabelsInOrder`), o tipo `by_status` em `records-api.ts`, e TODAS
as referências literais `'pending'` (~15, em 1.4/1.5/1.12). Depois re-rodar
essas suítes. É um refactor cross-suite — abrir como tarefa própria.

**Contorno aditivo já aplicado (suíte 1.16)**: `RegistrosAdminPage.gotoLight()`
— navega esperando só a tab + a lista (linhas OU empty state), **sem** o gate
dos 4 cards. Use em TCs que precisam só de `/stats` + contagem de linhas
(ex.: invariante KPI×lista), não da anatomia dos cards. Não substitui `goto()`
em suítes que validam os cards.

## Cores canônicas (RN 18) e o truque do donut em canvas

O donut é um **`<canvas>` (Chart.js)** — a cor e a proporção da fatia **não
são introspectáveis no DOM** (`getComputedStyle` não lê pixel de canvas).
NÃO tente assertir a cor do donut diretamente; marque `// REVISAR` se o TC
pedir o pixel.

**Truque validado**: o card ATIVO (após click) adota a MESMA cor de design
no `border`. Então valida-se a cor canônica por aí:

| Status | Cor (RN 18) | `border` do card ativo |
|---|---|---|
| emitted | #38A169 verde | `rgb(56, 161, 105)` |
| expired | #F56565 vermelho | `rgb(245, 101, 101)` |
| pending | #DD6B20 laranja | `rgb(221, 107, 32)` |
| rejected | #718096 cinza | `rgb(113, 128, 150)` |

Card **inativo**: border `rgb(226, 232, 240)`, `box-shadow: none`.
Card **ativo**: border na cor do status + `box-shadow != none` (elevação).
`isActive` robusto = `box-shadow != none` (independe da classe Chakra hasheada).

> Hover puro (sem click) NÃO muda o border (continua cinza). O "dimmed"
> (grayscale + opacidade) dos cards não-ativos é repintado no **canvas** —
> não está no DOM como `filter`/`opacity` → `// REVISAR`.

## Invariantes (não acoplar a seed) — ver [[criar-spec-resiliente-twygo]]

O env staging é compartilhado e a massa do aluno **oscila entre runs** (no
caso real a contagem mudou 0→1 no meio da execução). NUNCA crave count fixo.

- **Contagem (RN 19/20)**: `getCount(status) === stats.data.by_status[status]`
  (o backend já escopa o stats ao próprio aluno). Carga horária:
  `horas exibidas === Math.round(workload_total_seconds / 3600)`.
- **Denominador do donut (RN 23)**: `soma(by_status) <= total_general`
  (a diferença = Substituído + "Em andamento"). A proporção visual = canvas → `// REVISAR`.
- **Faixa permanente (RN 36)**: mesmo a zero, os 4 cards renderizam e a faixa
  NÃO é substituída por empty state. Asserir cards visíveis + `records-total-workload`
  visível — não `count == 0`.

## Filtro por click (visão Aluno, RN 26)

- Click no card → vira ativo (border colorido + elevação) e aplica filtro na
  lista; **só um ativo por vez** (clicar outro desativa o anterior).
- Click de novo no card ativo → desseleciona (RN 26.1).
- Linhas exibidas batem com o número do card; status com 0 → empty state.
- **Lista vazia real** = linha placeholder "Não há dados para exibir".
  Conte linhas de dados com `filter({ hasNotText: 'Não há dados para exibir' })`.

## Poll de transição (causa de falso-vermelho)

Ler `borderColor` / `isActive` logo após o click pega a **transição CSS no
meio**. Sempre `expect.poll(...)` até o valor final (Princípio 7 de
[[criar-spec-resiliente-twygo]]):

```ts
await meuHistorico.clickCard('pending');
await expect.poll(() => meuHistorico.getBorderColor('pending'), { timeout: 5_000 })
  .toBe('rgb(221, 107, 32)');
await expect.poll(() => meuHistorico.isActive('emitted'), { timeout: 5_000 })
  .toBe(false); // desativação do card anterior também tem transição
```

## Tooltips: produto CORRETO, doc da AT desatualizada (2026-06-22)

Os tooltips reais do Aluno foram **validados manualmente pelo QA e estão
corretos** — assere o texto REAL (passa), não o da AT:

| Card | Texto real (correto) |
|---|---|
| emitted | "Registros com certificado emitido e válido." |
| expired | "Registros cujo certificado expirou." |
| pending | "Registros aguardando avaliação." |
| rejected | "Registros recusados na avaliação." |

A `test-analysis.md` (RN 18.3.1, tom "você": "Certificados emitidos e dentro
do prazo de validade." etc.) está **desatualizada** — NÃO é bug de produto;
sinalizar p/ a AT alinhar a doc (categoria "XML/MD desatualizado" do §7.6, a
AT é a dona da correção). No `.data.ts`: `tooltipsAlunoReal` (asserir) vs
`tooltipsAlunoDocAT` (referência do gap).

> **Gotcha**: Chakra tooltip tem `closeDelay`. Antes de hoverar o próximo
> card, espere o tooltip anterior sumir (`tooltip().first().waitFor({state:
> 'hidden'})` + `mouse.move(0,0)`), senão lê o texto STALE do card anterior.
> Tooltip via `[role="tooltip"]`.

**Empty state (menor)**: AT diz "Nenhum registro encontrado"; a UI usa o
placeholder genérico de tabela "Não há dados para exibir" → validar o
comportamento e marcar `// REVISAR` na cópia (cópia, não bug).

## Contenção: rodar suítes de Registros ISOLADAS

Twygo permite **1 sessão por user**. Se outra sessão (ex.: outra suíte de
Registros, mesmo user no `globalSetup`) roda em paralelo, ela invalida a sua
e clobbera `outputs/test-results.json` → falsos-vermelhos (ex.: `ENOENT` em
`apiRequestContext`, redirect de login). Rode uma suíte de Registros por vez,
ou provisione 1 user por sessão.

## fixme legítimo conhecido

- **Independência do drawer (RN 28)**: exige APLICAR um filtro do drawer e
  ver o KPI não reagir. No env atual o drawer não tem filtro aplicável
  (Filtros padrão/compartilhados/Meus vazios; sem provedores). `test.fixme`
  legítimo (categoria "seed/config ausente", destinatário QA Lead). A própria
  AT condiciona o passo a "(quando disponível)".

## Cleanup: NÃO limpar seed (convenção do projeto)

Em Registros, **não emitir cleanup** (`afterAll`/`afterEach` que apaga
registros/provedores). Seed e dado de pré-condição criados por uma execução
**ficam persistentes** entre runs — o usuário confirmou que "o normal é
deixar os seeds persistentes" (22/06/2026). Isso **nuancia o Anti-pattern G**
do `CLAUDE.md §7.6` para este projeto. Filtro de card/drawer é estado
client-side (reseta no reload) — não precisa de cleanup nem de persistência.
Ver memory `registros-externos-sem-cleanup-seed-persistente`.

## Anti-patterns

- ❌ Assertir cor/proporção do donut lendo o `<canvas>` — não dá; use o
  border do card ativo (cor) e `// REVISAR` (proporção).
- ❌ `test.fixme(... 'requer credencial Aluno')` — a tela abre pela rota;
  persona "Colaborador" já é o aluno (ver [[trocar-perfil-twygo]]).
- ❌ Cravar `count == <n>` do seed — env compartilhado oscila; asserir contra
  `/records/stats`.
- ❌ Ler border/isActive sem `expect.poll` logo após o click.
- ❌ Contar `table tbody tr` sem excluir a linha "Não há dados para exibir".

## Skills relacionadas

- [[criar-spec-resiliente-twygo]] — invariantes, poll de transição (Princípio 7)
- [[trocar-perfil-twygo]] — só se o TC exigir o popover de perfil
- [[testar-filtro-drawer-twygo]] — drawer de filtros (modos Lista/Edição)
- [[testar-toast-chakra-twygo]] — toasts pós-ação (suítes de atualização em tempo real)
- [[gerar-bug-report-de-tc-red]] — registrar o achado de tooltip como bug
