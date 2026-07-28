# AGENTS.md — twygo-agents-qa

> Vale para todos os sub-agentes deste monorepo. Cada sub-agente é
> autossuficiente e tem seu próprio `AGENTS.md` técnico — este arquivo
> traz convenções operacionais que valem em todos.
>
> **Agentes ativos**: `agent-at/` (Python — análise de teste),
> `agent-playwright/` (TypeScript + Playwright — E2E **UI e API**),
> `agent-db/` (Python — validações em banco; esqueleto).
>
> **Agentes planejados** (entram conforme maturidade): `agent-tasks-qa`
> (quebra de atividades), `agent-pentest` (testes de segurança),
> `agent-docs-qa` (documentação de usabilidade). Ver §Mapa do ecossistema
> abaixo.
>
> **Nota histórica**: `agent-api` foi avaliado e descartado em 2026-05-27
> (CONTRACT.md §16). Testes de API rodam no `agent-playwright` via
> `request` fixture em `tests/api/`.

## Mapa do ecossistema

Os agentes se organizam em **4 categorias** por papel no fluxo de QA:

| Categoria | Agentes | Operação |
|---|---|---|
| **Upstream** (produzem para outros) | `agent-tasks-qa` (futuro), `agent-at` | Recebem entrada humana (docs Discovery, Spike, planilhas), produzem artefato canônico para downstream |
| **Executor primário** (1 por suíte) | `agent-playwright` (UI **e API**), `agent-db`, `agent-pentest` (futuro) | Cada suíte na AT declara qual é executor. Roda CLI próprio. Pode invocar validadores secundários |
| **Validador acionável** (modo sub-rotina) | `agent-db` | DB invocado por subprocess+filesystem quando spec PW declara validação secundária. API valida **inline** no próprio spec PW (sem IPC) |
| **Produtor de docs de usabilidade** | `agent-docs-qa` (futuro) | Produz documentação para usuário final do produto |

Topologia visual:

```
            docs (Discovery + Spike)
                    │
                    ▼
            agent-tasks-qa            [V3 — quebra atividades]
                    │
                    ▼
            agent-at                  [canônica = MD; deriva XMind + XML TestLink]
                    │
   ┌────────────────┼────────────────┐
   ▼                ▼                ▼
agent-playwright              agent-db        agent-pentest
(UI E2E + API)                (DB validation) (segurança/OWASP — futuro)
   │                             │                 │
   │ tests/features/   API inline│                 │
   │ tests/api/        (request) │                 │
   │                             │                 │
   │  (validação secundária via filesystem + CLI)  │
   └────────────────────►◄───────┘                 │
        agent-db pode ser invocado                 │
        como sub-rotina por executor primário      │
                                                   │
   ────────────────────────────────────────────────┘

agent-docs-qa   [independente; produz docs de usabilidade do produto;
                 input/output a definir quando criar]

Nota: agent-api foi descartado em 2026-05-27 (CONTRACT.md §16). API
testing vive em agent-playwright/tests/api/ usando request fixture.
```

> **Detalhes do contrato entre agentes**: [CONTRACT.md](CONTRACT.md).

## Contrato AT → consumidores

Tudo o que `agent-at` produz e os demais agentes consomem segue o
[**CONTRACT.md**](CONTRACT.md) na raiz. Resumo:

- **MD canônico** (`test-analysis.md`) é a **única fonte de verdade**.
  Vive em `agent-at/projects/<slug>/output/`.
- **XMind** e **XML TestLink** são **derivados** gerados automaticamente
  pelo `agent-at` a partir do MD. XMind serve à visualização QA; XML
  importa no TestLink para fluxo manual.
- Consumidores (Playwright, DB, [futuro] Pentest) leem **apenas o MD**.
- **Edições manuais** são autorizadas **apenas no MD** — XMind e XML são
  regenerados.
- **Executor primário** (`playwright`/`db`/`pentest`) é declarado no
  frontmatter da suíte no MD. Não aparece no XMind/XML — fluxo manual é
  agnóstico de agente automatizado. **Suítes de API são executadas pelo
  `agent-playwright`** (em `tests/api/`) — não há valor de enum `api`.

Quando este AGENTS.md ou qualquer AGENTS.md de agente divergir do
CONTRACT.md, o **CONTRACT.md vence** — abrir PR de alinhamento.

## Skills primeiro

Antes de implementar/gerar código em qualquer sub-agente, leia
`<sub-agente>/.Codex/skills/*/SKILL.md` daquele agente. As skills
capturam padrões já validados pelo usuário, fluxos canônicos, convenções
de Twygo, anti-patterns proibidos e diagnósticos de bugs comuns.

A "lei" técnica de cada sub-agente vive em `<sub-agente>/AGENTS.md`. Este
arquivo (raiz) é só a regra meta sobre **como skills são criadas/atualizadas**
no decorrer do uso.

## Regra: feedback corretivo ⇒ proposta de skill

Quando o usuário corrigir um padrão que você usou ("não faz assim", "essa
abordagem tá errada", "use o que já existe em X", "esse seletor é frágil",
"reusa o helper X em vez de duplicar"), **antes de continuar a tarefa**:

1. Identifique o padrão correto que ele indicou (frequentemente apontando
   um lugar do código que já faz daquele jeito).
2. Verifique se já existe skill em `<sub-agente>/.Codex/skills/` cobrindo
   esse padrão.
3. Se **não existe**: proponha criar uma nova skill com nome curto e
   descritivo, descrevendo (a) o padrão certo, (b) o anti-padrão que você
   cometeu, (c) onde o padrão certo já é usado no codebase. Pergunte se o
   usuário quer que você crie a skill antes de prosseguir.
4. Se **existe** mas estava incompleta/desatualizada: proponha atualizar —
   destaque o que falta. Pergunte antes de mexer.
5. Só siga com a tarefa depois que o usuário confirmar (ou recusar) — assim
   a próxima sessão (e o próximo QA) não repete o erro.

A ideia: cada correção repetida é sinal de que falta documentação
operacional. Skills curam isso. **Não crie skill silenciosamente** —
sempre pergunte, porque o usuário decide o que vira convenção persistente.

### Exemplos típicos neste monorepo

| Correção do usuário | Skill candidata |
|---|---|
| "não usa `data-testid`, esse app é `data-test-id`" | `seletores-twygo-app` (padrão; pode existir) |
| "não copia constantes pro spec, joga num `.data.ts`" | atualiza `twygo-test-orchestrator` ou cria `dados-por-teste-playwright` |
| "no XMind, marcador de prioridade é `★` não `!`" | atualiza `twygo-qa-conventions` |
| "consulta read-only sempre passa por `bindparams`" | atualiza/cria skill em `agent-db/.Codex/skills/db-query-builder` |

## Regra: problema vivenciado ⇒ proposta de skill

Quando o usuário relatar um problema/bug/erro ("não funciona", "tá
travado", "deu pau", "por que não X") e você **resolver** (ou diagnosticar
a causa raiz junto com ele), **antes de fechar a conversa**:

1. Reflita: a causa raiz era óbvia pelo código ou exigiu investigação
   não-trivial (logs cruzados, env var faltando, storage corrompido, sync
   alert bloqueando click, ordem de boot, MCP indisponível, etc)?
2. Se foi não-trivial, considere se o **diagnóstico** (sintoma → causa →
   fix) vale virar skill — mesmo que a correção em si tenha sido pequena.
   O ganho está em **acelerar o diagnóstico** da próxima vez, não em
   automatizar o fix.
3. Verifique se já existe skill cobrindo esse fluxo de diagnóstico (busca
   em `.Codex/skills/` do sub-agente afetado).
4. Se **não existe**: proponha uma skill com nome `debugar-X` ou
   `diagnosticar-X` (ex: `debugar-globalSetup-storage`,
   `diagnosticar-mcp-playwright-offline`), descrevendo o sintoma, a
   sequência de checagens, e o fix. Pergunte antes de criar.
5. Se **existe** mas faltou cobrir esse caso específico: proponha
   atualizar. Pergunte antes.
6. Só feche o assunto depois que o usuário confirmar (ou recusar) —
   problemas que vencem 30min de debug merecem virar conhecimento
   estruturado.

A ideia complementa a regra anterior: feedback corretivo cura padrão de
implementação, problema vivenciado cura padrão de diagnóstico/operação.
Ambos viram skill quando o usuário quiser.

## Regra: erro próprio reconhecido ⇒ propor skill ou melhoria de código

Diferente das duas regras acima (que dependem do usuário corrigir ou
relatar), esta é **auto-reflexiva**: você (agente) reconhece sozinho que
errou — pode ser um teste que rodou e quebrou, um seletor que você
escolheu e o Playwright recusou, uma query que você montou e o banco
rejeitou, uma tradução PT-BR → Playwright que você emitiu mas que
contradiz `.Codex/prose-patterns.md`, um spec gerado violando algum
anti-pattern de §7.6 sem que ninguém tenha apontado.

**Antes de só corrigir e seguir**, pause e ofereça ao usuário uma de duas
saídas:

1. **Skill nova/atualizada** — quando o erro indica que falta
   conhecimento estruturado pra próxima vez (anti-pattern não documentado,
   gotcha de UI Twygo, sequência de checagens de diagnóstico, padrão de
   teste recorrente). Proponha nome + 1 parágrafo do que cobriria.
2. **Melhoria de código** — quando o erro indica que o código atual
   permite o erro acontecer (helper que deveria existir mas não existe,
   validação que falta no boot, seletor frágil herdado, tipo TS que
   permite estado inválido, função que faz dois trabalhos). Proponha o
   refactor concreto: arquivo, função, mudança específica.

**Como propor**:

> Reconheci um erro próprio: <descreva sintoma e causa em 1 linha>.
> Antes de seguir, sugiro [skill nova `<nome>` cobrindo X | atualizar
> skill `<existente>` adicionando Y | refactor em `<path:linha>` que
> elimina a classe do erro]. Posso prosseguir com a correção do erro
> sozinho e te mostrar a proposta no fim, ou paramos agora pra você
> decidir? **Sua escolha.**

Não crie skill nem aplique refactor silenciosamente — sempre proponha e
espere. A diferença das outras duas regras é só a origem do gatilho
(você, não o usuário); o ritual de aprovação é o mesmo.

**Quando NÃO disparar esta regra**:
- Erro foi típico de tentativa-e-erro de exploração (ex: experimentou um
  seletor antes do recon, descartou, achou outro). Isso é processo
  normal, não falta de conhecimento.
- Erro veio do produto Twygo (bug do app, não seu). Nesse caso o teste
  estava certo — relate como bug, não como skill.
- Erro foi causado por estado de máquina (deps não instaladas, .env
  vazio). Aí já existe a skill `configurar-ambiente`; só aponte ela.

A intuição: se um QA sênior, lendo o erro, diria "isso já era pra estar
documentado/automatizado", **é caso de skill ou melhoria**. Se diria
"normal, faz parte", deixa pra lá.

## Regra: novo tipo de teste ⇒ skill de "como testar"

Específica deste monorepo (não existe no workspace pai porque ele é de
produto, não de QA).

Quando você gerar um teste novo (via `agent-at/analyze-test`,
`agent-playwright/twygo-test-orchestrator`, ou um caso de DB em
`agent-db`) que cobre um **tipo de fluxo Twygo ainda não documentado**
(ex: bloqueio de funcionalidade por contrato, fluxo de webhook, geração
de relatório com pivô, validação de FK em deleção lógica), **antes de
considerar o teste pronto**:

1. Pergunte: "esse teste é de um tipo que vai se repetir? (login,
   CRUD-listagem, webhook, permissão por perfil, blob async, etc)"
2. Se sim, busque skill correspondente em
   `<sub-agente>/.Codex/skills/`. Padrões de nome sugeridos:
   `testar-<tipo>-twygo` (ex: `testar-login-twygo`,
   `testar-crud-listagem`, `testar-webhook-callback`,
   `testar-bloqueio-contrato`).
3. Se não existe e o padrão é claro, **proponha criar a skill** —
   incluindo: pré-condições, seletores estáveis canônicos, cenários
   obrigatórios, anti-patterns a evitar, exemplo já validado no
   codebase. Pergunte antes de criar.
4. Se existe mas não cobre o caso recém-gerado, proponha atualizar.
5. Só feche o teste depois da confirmação.

**Por quê**: o gap principal hoje deste monorepo é justamente este — a
maioria das skills cobre **ferramentas** (parser, recon, orchestrator,
report-generator) e não **padrões de teste**. O resultado é que cada
spec novo redescobre seletores e cenários do zero. A regra acima é o que
fecha o gap.

## Regra: `page.goto` + `dismissCommonModals` ⇒ obrigatório pareados

Aplica em **agent-playwright** (extrapola pra agent-db/agent-at se algum
fluxo navegar via Playwright). Vale pra todo Page Object e fixture.

**Sintoma**: spec esgota 30s em `page.goto(...)` mesmo com Twygo carregado
visivelmente. NPS Sofia, banner "Continuar mesmo assim", "Modelo de página
duplicado" e outros modais oportunistas aparecem DURANTE o load e BLOQUEIAM
o evento `load` de firar. O default do Playwright é esperar `load` —
modal trava o ciclo.

**Regra dura**:

1. **NUNCA chamar `page.goto(url)` direto** em Page Objects Twygo.
   Sempre usar `safeGoto(page, url)` exportado de
   `agent-playwright/src/utils/modals.ts`.
2. `safeGoto` faz `goto({ waitUntil: 'domcontentloaded' })` + roda
   `dismissCommonModals(page)` imediatamente após. App segue carregando
   em background sem travar o spec.
3. Caso o spec **precise** do modal NPS aparecer (test da própria
   pesquisa NPS): use `safeGoto(page, url, { dismiss: false })`.
4. Tests em `tests/auth/` que validam fluxo de login: podem usar
   `page.goto` direto, NPS não aparece antes do login completar.
5. **Quando adicionar um modal novo** descoberto live (ex: "Modelo de
   página duplicado" foi adicionado 2026-05-13), **atualizar**
   `dismissCommonModals` em `modals.ts` E a §7.5 do
   `agent-playwright/AGENTS.md`. Skill `fechar-modais-twygo` documenta
   o padrão.

**Por que esta regra é meta-monorepo e não só agent-playwright**: a
combinação `goto + dismiss` é tão fundamental que precisa estar visível
em qualquer agente novo que faça automação web em Twygo. agent-db não
faz UI, mas se alguém criar `agent-cypress` ou `agent-puppeteer` no
futuro, deve herdar esta regra.

**Caso real do monorepo (2026-05-13)**: TC da listagem de painéis falhou
porque `goToList()` chamava `page.goto(...)` simples. NPS Sofia abriu
durante o load → load nunca completou → 30s timeout. `dismissCommonModals`
nunca rodou porque era a linha SEGUINTE ao goto que falhou. Fix: trocar
por `safeGoto`. Skill `debugar-via-network-e-console` cobre o lado de
diagnóstico — esta regra cobre o lado de prevenção.

## Regra: diagnóstico de bug/erro ⇒ Network + Console primeiro

Sintoma de "click não fez nada", "form não submete", "spec falha esperando
state mudar", "modal não abre", "tela mostra dado antigo" — **NUNCA chutar
causa antes de olhar Network + Console**.

Custo de checar Network: 5 segundos. Custo de NÃO checar: horas chutando
hipótese errada. Caso real do monorepo (2026-05-13): TC1/2/4 de widgets
falharam por backend retornar `422 "Descrição não pode ficar vazio(a)"`
em `PATCH /panels/:id/change_status`. Frontend engolia 422 silencioso.
1h gasta investigando seletor/timing/viewport antes do payload Network
aparecer e o diagnóstico cair em 5s.

**Ritual obrigatório quando o sintoma aparece** (em qualquer sub-agente):

1. Abre DevTools — tab Network filtra Fetch/XHR, tab Console filtra Error/Warning.
2. Reproduz a ação (click humano OR replay do spec). Olha o que saiu na Network.
3. **Sem request** → frontend não disparou handler. Diagnóstico: locator/event/overlay.
4. **2xx mas UI não atualizou** → response shape mudou ou state mgmt quebrado.
5. **4xx/5xx** → backend rejeitou. Lê o body. Mensagem geralmente é PT-BR útil.
6. **Pending sem completar** → backend travou OU ctx fechou antes (net::ERR_ABORTED).
7. Só agora formula hipótese.

Cada sub-agente tem ferramenta pra esse ritual:

- **agent-playwright**: fixture exploratória já grava HTTP 4xx/5xx em
  `outputs/<slug>/exploratory-findings.json`. CHECAR esse arquivo é parte
  do diagnóstico antes de mexer no spec. Em debug live, use chrome-devtools-mcp
  (`list_network_requests`, `list_console_messages`). Detalhe em
  [agent-playwright/.Codex/skills/debugar-via-network-e-console/SKILL.md](agent-playwright/.Codex/skills/debugar-via-network-e-console/SKILL.md).
- **agent-db**: bug de query? Log SQL primeiro. Sem isso vira chute.
- **agent-at**: erro na geração do MD canônico ou nos derivados (XMind/XML)? Valida o `test-analysis.md` cru antes de inferir bug nos geradores de derivados.

Quando uma regressão de UI Twygo for diagnosticada **só** porque alguém
abriu Network, é sinal de que essa regra valeu a economia. Quando alguém
gastar 30min sem abrir Network, é sinal de que essa regra foi ignorada —
documenta o caso na skill `debugar-via-network-e-console` (atualiza
tabela de "Gotchas conhecidos via Network").

## Anatomia de um agente novo

Quando criar um agente novo do monorepo (ex.: `agent-tasks-qa`,
`agent-pentest`), seguir a **estrutura mínima canônica** abaixo. Não
inventar arquitetura — clonar do `agent-playwright` (referência madura) e
adaptar à stack escolhida.

```
agent-<nome>/
├── AGENTS.md                       # propósito + princípios + regras duras + skills + comandos
├── README.md                       # onboarding pra QA novo
├── .env.example                    # template das vars necessárias
├── projects/                       # 1 subpasta por projeto Twygo (NUNCA mono-projeto)
│   └── <slug>/
│       ├── project.config.json
│       ├── inputs/                 # do agent-at (test-analysis.md copiado)
│       └── outputs/                # gerado (gitignored com exceções por agente)
├── src/                            # infra compartilhada entre projetos (genérico Twygo)
├── .Codex/
│   └── skills/                     # skills locais do agente
└── (config/, templates/, scripts/) # conforme stack
```

**Obrigações por categoria** (ver §Mapa do ecossistema):

| Categoria | O que o agente novo precisa | Onde olhar |
|---|---|---|
| **Upstream** | Estrutura `projects/<slug>/{docs,output}/`. Output canônico segue padrão definido pelo CONTRACT.md (MD) ou contrato próprio | `agent-at/` como referência |
| **Executor primário** | Estrutura `projects/<slug>/{inputs,outputs}/`. Consome `test-analysis.md`. Gera report self-contained em `outputs/<slug>/reports/<runId>/` | `agent-playwright/` como referência |
| **Validador acionável** | Além de executor primário: aceitar invocação por subprocesso com input path como flag, escrever output em path absoluto fornecido. [V2 do CONTRACT.md] | `agent-db/` (esqueleto) como referência |
| **Produtor de docs de usabilidade** | Estrutura definida quando `agent-docs-qa` for criado | TBD |

**Checklist mínimo para abrir PR de agente novo**:

- [ ] `AGENTS.md` com seções: Propósito, Princípios fundamentais, Arquitetura, Fluxo, Skills, Regras duras, Anti-patterns, Comandos, Referências
- [ ] `README.md` para QA novo (onboarding em ≤ 10 minutos)
- [ ] `.env.example` com variáveis comentadas
- [ ] `projects/` existente (mesmo vazia) — para enforçar mono-projeto
- [ ] Pelo menos 1 skill em `.Codex/skills/` (orquestração interna)
- [ ] Linkar `shared/twygo-platform.md` no AGENTS.md
- [ ] Linkar [CONTRACT.md](CONTRACT.md) no AGENTS.md (se consome AT)
- [ ] Atualizar este AGENTS.md raiz movendo o agente de "planejado" para "ativo"
- [ ] Atualizar tabela do README.md raiz
- [ ] Atualizar topologia visual desta seção

## Não duplicar — tudo é por sub-agente

- **Arquivos na raiz** permitidos: este `AGENTS.md`, `README.md`,
  [`CONTRACT.md`](CONTRACT.md) (contrato cross-agente), e `shared/` para
  documentos de fatos do produto Twygo cross-agente (atualmente
  [`shared/twygo-platform.md`](shared/twygo-platform.md)). Demais
  artefatos de agente (`package.json`, `playwright.config.ts`,
  `requirements.txt`, etc.) ficam dentro de `agent-*/`.
- **`shared/` é só para fatos do produto Twygo** — URLs, IDs de orgs,
  comportamentos peculiares que afetam testes de qualquer agente. NÃO é
  para código compartilhado nem skills. Cada agente continua isolado em
  termos de runtime/código.
- **Não compartilhar skill entre sub-agentes** copiando — se duas skills
  começam a parecer iguais, ou a) o conceito é genérico e vai em `shared/`
  ou no CONTRACT.md, ou b) é só uma coincidência e os dois contextos são
  diferentes mesmo. Não force.
- **Não editar `outputs/`/`output/`** — são gerados; estão no `.gitignore`
  (com exceções definidas por agente).

## Branches por finalidade

- `master` — base estável, cumulativa de projetos.
- `project/<slug>` — trabalho de QA num projeto Twygo específico (ex:
  `project/widgets`). Convém. Documentado em
  [agent-playwright/.Codex/PROJECT_BOOTSTRAP.md](agent-playwright/.Codex/PROJECT_BOOTSTRAP.md).
- `fix/<slug>` ou `chore/<slug>` — correções na infra dos agentes.
- `feature/<slug>` — feature nova num agente (ex: nova skill, novo subagent).

## Suporte

- Dúvidas operacionais: pergunte no canal do time de QA.
- Bugs: issue no repositório `Twygo/twygo-agents-qa`.
- Skill nova proposta: documente o caso de uso, leve ao QA Lead, abra PR
  com `feature/skill-<nome>`.
