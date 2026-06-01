---
name: twygo-triage-report
description: Gera um único `outputs/<slug>/triage-report.md` com cada falha estruturada para revisão batch do QA — XML diz X, helper tentou Y, parou em Z, screenshot inline, checkboxes "bug produto / comportamento esperado / spec errado / flakiness". Substitui ciclos de pergunta turn-by-turn por uma janela única de triagem. Decisão do QA persiste em arquivo versionado e vira input pra próxima rodada do agente.
when_to_use: |
  - Após `agent:run` terminar com 1+ falha, antes do agente sair "consertando"
  - QA Lead precisa categorizar batch de TCs vermelhos em bug/spec/flakiness
  - Antes de delegar healer — produz arquivo decisório versionado
triggers:
  - "triage-report.md"
  - "agent:triage"
  - "bug produto / comportamento / spec errado / flakiness"
  - "decisão QA Lead"
  - "categorizar fails"
version: 1.0.0
---

# twygo-triage-report

## Quando usar

Logo após `npm run agent:run -- --suite <X>` (ou regressão) terminar com
1+ falha, antes de o agente sair "consertando" sem direção. A triagem é
o passo que separa **bug produto** de **spec/seed errado** de
**flakiness** — decisão que só o QA Lead toma.

```bash
npm run agent:triage                       # default: per-suite da última run
npm run agent:triage -- --suite "<nome>"   # explícito
npm run agent:triage -- --regression       # full regression
```

Output: `outputs/<slug>/triage-report.md` (sobrescrito a cada chamada,
salvo `--keep-history` que arquiva em `outputs/<slug>/triage/<ts>.md`).

## Por que existe

Antes desta skill, ciclo típico era:

1. Agente roda suite
2. 1+ TC falha
3. Agente abre trace, lê error-context, **chuta** se é bug produto ou
   spec errado
4. Aplica fix baseado no chute
5. QA descobre depois que o chute era errado

Anti-pattern: agente decidindo o que QA deveria decidir. Spec marca
`fixme` quando é bug produto (anti-pattern F do CLAUDE.md), ou
"conserta" o spec quando o produto é que tem bug.

Esta skill quebra o ciclo: gera um documento Markdown com **toda a
evidência mastigada** e **checkboxes prontos**. QA passa 15-30min, marca
escolhas, escreve notas curtas, commita. O agente lê na próxima sessão e
aplica decisões corretas.

## Categorias de triagem

Cada falha cai em uma destas 5 categorias (mutuamente exclusivas):

| Categoria | Significado | Ação do agente na próxima rodada |
|---|---|---|
| **Bug produto — IMPEDITIVO** | UI/backend bloqueia fluxo, sem workaround viável. Spec não consegue cobrir comportamentos vizinhos. | Mantém spec RED. Documenta comentário no topo com ticket. Não usa `fixme`. |
| **Bug produto — não-impeditivo** | UI/backend tem bug, mas há workaround temporário viável (criar dado com campo X, evitar fluxo Y, etc) que permite a suite continuar cobrindo os comportamentos vizinhos. | Aplica workaround mínimo + comentário `// WORKAROUND-BUG-NAO-IMPEDITIVO: <ticket>` no spec/helper. Spec passa. Quando ticket fechar, remover workaround. |
| **Comportamento esperado** | Produto faz o certo. Spec ou helper precisa adaptar (race-handle modal extra, esperar toast, etc). | Patch no helper / Page Object. Sem mudança no XML. |
| **Spec / seed errado** | Prosa XML desatualizada, IDs do data file errados, pré-condição inviável. | Atualiza spec/data.ts. Marca `fixme` se for caso legítimo das 4 categorias do CLAUDE.md §7.6.F. |
| **Flakiness** | Falha não-determinística (network glitch, race condition de fixture). | Re-rodar 3× isolado. Se ainda flaky → investigar root cause. Não tratar com retries cegos. |

### Por que separar impeditivo vs não-impeditivo

Quando o bug é impeditivo (ex.: switch não toggle de jeito nenhum, sem
caminho alternativo), suite trava ali. Vermelho honesto, dev resolve.

Quando o bug é não-impeditivo (ex.: backend exige description em
`/change_status`, mas você pode criar painel COM description e seguir
testando paginação, ordenação, busca, persistência...), travar a suite
inteira desperdiça cobertura. O QA marca "não-impeditivo", o agente
aplica o workaround mínimo (criar painel com description default), a
suite continua exercitando os outros casos, e o ticket fica registrado
pra dev backend resolver.

**Regra**: ao aplicar workaround, **sempre** marcar o spec/helper com
`// WORKAROUND-BUG-NAO-IMPEDITIVO: <ticket>` + 1 linha de razão. Quando
o ticket fechar, agente futuro (via skill `debugar-bug-produto-stale`)
revalida e remove o workaround.

## Conteúdo gerado

Estrutura do `triage-report.md`:

```markdown
# Triage Report — <projectName> — <YYYY-MM-DD HH:MM>

**Suite**: <nome> · **Browsers**: chromium · **Ambiente**: <env>

## Sumário

| Total | ✅ | ❌ | ⊘ | Findings exploratórios |
|---:|---:|---:|---:|---:|
| 5 | 1 | 4 | 0 | 12 (3 erros, 9 warnings) |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.

---

## ❌ Falhas

### [TC1] Ativar / Inativar painel · "Ativar um painel previamente inativo"

- **Arquivo**: `projects/widgets/tests/features/.../ativar-painel-inativo.spec.ts:49`
- **Status**: failed · **Duração**: 14.7s
- **Erro**: `Timeout 5000ms exceeded` em `toggleActiveByName` (poll de toggle/modal)
- **Local**: `PaineisListPage.ts:498`
- **Última URL observada**: `<baseUrl-do-env>/o/{orgId}/use_modes?tab=panels-tab`
- **Última tela**: `./test-artifacts/.../test-failed-1.png`
- **Trace**: `./test-artifacts/.../trace.zip` (abrir com `npx playwright show-trace`)

**Steps executados**:
| # | Step | Status | Erro |
|---|---|---|---|
| 1 | Acessar aba Painéis | ✅ | — |
| 2 | Click no switch Ativo | ❌ | timeout esperando state mudar ou modal |

**XML diz**: "Acessar Painéis → click switch Ativo → painel fica ativo"
**Helper tentou**: `paineis.toggleActiveByName(panelName)` clicando `label.chakra-switch` da row
**Diagnóstico do agente** (palpite, NÃO decisão): produto não respondeu ao click — nem PATCH backend nem modal. Possíveis: banner BETA sobreposto, React onChange não-wired, NPS modal reapareceu.

**QA decide** (marque UM):
- [ ] **Bug produto — IMPEDITIVO** — sem workaround. Spec fica RED. Escalar. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — workaround viável. Aplicar + seguir cobrindo vizinhos. Workaround: ____________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK; helper precisa de race-handle/dismiss extra. Especificar: __________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: __________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [TC2] ...
```

E ao final:

```markdown
## ⊘ Skips legítimos pra revalidação periódica

(items com `test.fixme` + reason — QA deve revalidar se reason ainda
vale; ver skill `debugar-bug-produto-stale`)

| TC | Motivo | Última revalidação |
|---|---|---|
| Reativar menu painel inativo | seed ausente | — |

## 🐛 Findings exploratórios não-fatais (informativo)

Console errors, HTTP 5xx, axe critical agrupados por testsuite. Não
bloqueiam, mas merecem leitura — podem indicar bug latente.
```

## Princípios do formato

- **1 linha de cabeçalho** + **1 tabela** + **1 grupo de checkboxes**
  por falha. Sem prosa solta. QA lê em 30s por item.
- **Screenshot inline via path relativo** — VSCode/GitHub renderiza.
- **Trace path** disponível mas opcional — QA abre só se for fundo.
- **Diagnóstico do agente vem PRÉ-FIXADO como palpite, NÃO decisão**.
  Reduz viés do QA. Frase canônica: "Diagnóstico do agente (palpite,
  NÃO decisão)".
- **Checkbox único por categoria** — não permite ambiguidade. Forçar
  decisão.
- **Campo "Notas"** sempre presente — QA escreve em PT-BR. Vira input
  pra IA na próxima rodada (auto-extracted via regex simples).

## Como o agente consome o report depois

Em `npm run agent:run -- --apply-triage` (não implementado v1; v2):

1. Lê `outputs/<slug>/triage-report.md`
2. Pra cada falha, procura o checkbox marcado
3. Aplica patch correspondente:
   - **Bug produto** → mantém RED, atualiza comentário do spec com data + ticket
   - **Comportamento esperado** → segue prompt "Notas QA" como instrução pra fix do helper
   - **Spec / seed errado** → atualiza spec/data.ts conforme notas
   - **Flakiness** → re-roda 3× isolado, se passar marca como suspeita-resolved
4. Re-roda suite
5. Gera novo `triage-report.md` (sobrescreve) se ainda houver falhas

V1 (agora): gerador + skill. Apply-triage = próxima iteração.

## Boundaries

- **NÃO** decide categoria automaticamente. Sempre QA marca.
- **NÃO** modifica `outputs/test-results.json` ou outros artefatos.
  Lê-only deles.
- **NÃO** apaga reports antigos sem `--keep-history` flag.
- **NÃO** envia pra Linear/GitHub automaticamente — só gera arquivo
  local pra commit.

## Integração com infra existente

Reusa:

- `outputs/<slug>/test-results.json` — Playwright JSON reporter
- `outputs/<slug>/exploratory-findings.json` — twygo-exploratory-validator
- `outputs/<slug>/test-artifacts/<test>/error-context.md` — snapshot a11y
- `outputs/<slug>/test-artifacts/<test>/test-failed-*.png` — screenshot
- `outputs/<slug>/test-artifacts/<test>/trace.zip` — trace

Não duplica nada. Apenas agrega + adiciona UI de triagem em Markdown.

## Anti-patterns

- ❌ Gerar relatório HTML interativo — Markdown renderiza em todo lugar
  (VSCode, GitHub Web, Obsidian, etc) e é diff-friendly. Mesma decisão
  do `twygo-report-generator` (skill irmã).
- ❌ Categorias com mais de 4 opções — decision fatigue. 4 mutuamente
  exclusivas força foco.
- ❌ Pré-marcar checkbox baseado no palpite do agente — viesa QA. Sempre
  vazio na geração; só QA marca.
- ❌ Re-rodar testes dentro da skill — separação de responsabilidades.
  Skill consome artefatos da última run, ponto.
