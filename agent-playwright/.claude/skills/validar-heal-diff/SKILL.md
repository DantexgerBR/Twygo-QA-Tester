---
name: validar-heal-diff
description: Valida estaticamente que o diff produzido pelo `playwright-test-healer` respeita a regra dura #11 (healer só toca seletor/timing/asserção, nunca intenção). Roda entre Etapa 8 (heal aceito pelo QA) e Etapa 8.5 (auto-PR opcional) do twygo-test-orchestrator. Bloqueia mudanças que indicam drift de intenção do teste.
when_to_use: |
  - Orchestrator pós-healing, antes de auto-PR ou commit
  - Validar que heal não fez assertion polarity flip / step reorder / fixme add
  - Auditoria automática de PR aberto pelo healer
triggers:
  - "validar-heal-diff"
  - "regra dura #11"
  - "assertion polarity flip"
  - "drift de intenção"
  - "healer diff"
  - "BLOQUEADO PERMITIDO REVISAR"
version: 1.0.0
---

# validar-heal-diff

Skill **automática** invocada pelo `twygo-test-orchestrator` na Etapa 8.1
(entre Etapa 8 — Healing e Etapa 8.5 — Auto-PR). Não é invocada
diretamente por humano.

## Por que existe

Regra dura #11 do CLAUDE.md proíbe o healer de mudar intenção do teste.
Hoje essa regra é enforced **só por prosa** no system prompt do healer —
nada impede o agente de drift silencioso ("achei que era melhor checar
toBeHidden em vez de toBeVisible") quando ele acha que faz sentido.

Esta skill faz **gate estático** sobre o diff antes de qualquer commit
ou PR: parseia as mudanças, classifica cada hunk como **PERMITIDO**,
**REVISAR** ou **BLOQUEADO**, e devolve veredito ao orchestrator.

## Entrada

- Lista de arquivos modificados pelo healer (caminhos absolutos)
- Diff completo (`git diff --no-color`)

## Saída (formato estruturado)

```jsonc
{
  "verdict": "passed" | "needs_review" | "blocked",
  "summary": "1 selector swap (passed) + 1 toBeHidden→toBeVisible (BLOCKED)",
  "hunks": [
    {
      "file": "projects/widgets/tests/features/.../foo.spec.ts",
      "category": "selector_swap" | "wait_change" | "timeout_tweak" | "assertion_polarity_flip" | "test_title_change" | "describe_title_change" | "import_change" | "step_reorder" | "code_outside_locator" | "other",
      "verdict": "passed" | "needs_review" | "blocked",
      "before": "<linha removida>",
      "after": "<linha adicionada>",
      "reason": "..."
    }
  ]
}
```

## Categorias e veredito

### PERMITIDO (auto-passa)

Mudanças que claramente **não tocam intenção**:

| Categoria | Padrão regex no diff | Exemplo |
|---|---|---|
| `selector_swap` | `getByTestId\(`, `getByRole\(`, `getByLabel\(`, `locator\(`, `getByPlaceholder\(`, `getByText\(` | `getByTestId('btn-x')` → `getByTestId('btn-y')` |
| `wait_change` | `waitFor\(`, `waitForLoadState\(`, `waitForURL\(`, `waitForSelector\(` | `waitForLoadState('networkidle')` → `waitForLoadState('domcontentloaded')` |
| `timeout_tweak` | `timeout:\s*\d+`, `\.timeout\(\d+\)` | `timeout: 10000` → `timeout: 15000` |
| `force_click_added` | `\.click\(\{[^}]*force:\s*true` | `.click()` → `.click({ force: true })` (gotcha §7.5 sync alert) |

### REVISAR (humano confirma)

Mudanças que **podem** ser legítimas mas merecem olho:

| Categoria | Sinal | Por que revisar |
|---|---|---|
| `assertion_target_change` | mesma asserção (`.toBeVisible()`), mas sobre locator diferente | Pode ser o mesmo elemento renomeado **ou** o teste passou a checar outra coisa |
| `code_outside_locator` | linha mudou que não casa com nenhum padrão de seletor/wait/timeout | Healer pode ter editado lógica de fluxo |
| `step_text_change` | argumento de `allure.step("...", ...)` mudou | Texto de step Allure deveria espelhar XML — se mudou, ou o XML foi atualizado (legítimo) ou o healer reescreveu (drift) |

### BLOQUEADO (rejeita o heal)

Mudanças que **definitivamente** indicam drift de intenção:

| Categoria | Sinal | Por que bloqueia |
|---|---|---|
| `assertion_polarity_flip` | `toBeVisible` ↔ `toBeHidden`, `toBeEnabled` ↔ `toBeDisabled`, `toHaveText` ↔ `not.toHaveText`, `toHaveCount(N)` com N diferente | Inverteu o que o teste valida |
| `test_title_change` | argumento de `test('...', ...)` mudou | Título do teste = nome do testcase no XML (regra §7.5). Se mudou, healer reinterpretou o caso |
| `describe_title_change` | argumento de `test.describe('...', ...)` mudou | Título do describe = nome da testsuite. Mesma lógica |
| `step_reorder` | linhas movidas entre steps (heurística: `await allure.step(...)` em ordem diferente) | Ordem dos passos vem do XML — healer não tem licença pra reordenar |
| `import_change_business_logic` | import novo de Page Object não-existente OU import de `loginPage` removido com adição de `getByLabel('Login')` | Mudança estrutural de fluxo, não correção de seletor |
| `test_fixme_added_or_removed` | `test.fixme(true,` adicionado/removido | Healer não tem licença pra marcar/desmarcar testes — fixme só vem de pré-condição não satisfeita na geração |

## Algoritmo (passo-a-passo)

### 1. Capturar diff

```bash
git diff --no-color --unified=0 -- 'tests/' 'src/pages/' 'projects/'
```

`--unified=0` reduz contexto e facilita parsing por regex.

### 2. Parsear por arquivo + hunk

Cada hunk começa com `@@`, seguido de linhas `-` (removida) e `+`
(adicionada). Para cada par `(linha removida, linha adicionada)`:

```bash
# pseudo-código
for hunk in diff:
  for (before, after) in pairs(hunk):
    category = classify(before, after)
    verdict  = verdictMap[category]
    record(file, hunk, before, after, category, verdict)
```

### 3. `classify(before, after)`

Aplica regex em ordem (primeiro match vence):

```ts
// Pseudo — implementação real em bash/node depende de quem invoca a skill
const RULES = [
  { pattern: /\.(toBeVisible|toBeHidden|toBeEnabled|toBeDisabled)\(\)/, kind: 'assertion_target_change',
    detector: (b, a) => polarityFlipped(b, a) ? 'assertion_polarity_flip' : 'assertion_target_change' },
  { pattern: /test\.fixme\(true,/, kind: 'test_fixme_added_or_removed' },
  { pattern: /test\.describe\(['"`]/, kind: 'describe_title_change' },
  { pattern: /\btest\(['"`]/, kind: 'test_title_change' },
  { pattern: /(getByTestId|getByRole|getByLabel|getByText|getByPlaceholder|locator)\(/, kind: 'selector_swap' },
  { pattern: /waitFor(LoadState|URL|Selector)?\(/, kind: 'wait_change' },
  { pattern: /timeout:\s*\d+|\.timeout\(\d+\)/, kind: 'timeout_tweak' },
  { pattern: /force:\s*true/, kind: 'force_click_added' },
  { pattern: /allure\.step\(/, kind: 'step_text_change' },
  { pattern: /^import /, kind: 'import_change' },
  // fallback
  { pattern: /.*/, kind: 'code_outside_locator' },
];
```

### 4. Detectar `step_reorder`

Heurística adicional cross-hunk: se um arquivo tem N pares
`(linha removida = await allure.step("...", ...))` cujo conteúdo das
strings é o mesmo conjunto antes e depois mas em ordem diferente,
classificar como `step_reorder`.

### 5. Agregar veredito

```
verdict_global = max severity { hunk.verdict for hunk in all_hunks }
                 onde severity: passed < needs_review < blocked
```

### 6. Retornar para o orquestrador

Saída JSON estruturada (ver acima). O orchestrator decide:

- `passed` → segue pra Etapa 8.5 (auto-PR) ou commit local.
- `needs_review` → mostra ao QA cada hunk classificado como tal, pede confirmação por hunk; se rejeitar qualquer, escala pra `blocked`.
- `blocked` → reverte heal (`git checkout -- <arquivos>`), abre relatório explicando hunks bloqueados, pede ao QA pra atualizar XML do AT (caminho legítimo pra mudar intenção).

## Casos de borda

### Healer adicionou comentário `// REVISAR: prosa ambígua`

Não é mudança de código — é annotation. **Permitido**, classificar como `comment_added` (categoria implícita: passa).

### Healer mudou só whitespace/indentação

Permitido (`whitespace_only`).

### Healer apagou um `test()` inteiro

**Bloqueado** — healer não tem licença pra remover casos. Se o caso ficou
inviável (ex: feature foi removida do produto), o XML do AT deve ser
atualizado e regenerar.

### Healer adicionou um `test()` novo

**Bloqueado** — fonte única de verdade é o XML.

### Healer modificou Page Object (`src/pages/`)

Categorizar igual a spec, mas critério mais permissivo:
- `selector_swap` em método existente: passa
- Método novo: revisar (pode ser refactor legítimo de seletor frágil)
- Método removido: bloquear (rompe outros specs)

## Implementação sugerida (não inclusa nesta skill)

Esta SKILL.md descreve o **algoritmo**. A implementação concreta pode
ser:

1. **Subagent dedicado** (mais simples) — orchestrator invoca um
   subagent com `subagent_type: validar-heal-diff` que executa o
   algoritmo via Read/Bash e retorna JSON.
2. **Script TypeScript** (mais determinístico) — `tsx
   .claude/skills/validar-heal-diff/validator.ts` parseia o diff
   localmente e imprime JSON. Orchestrator consome via stdout.

Quando alguém implementar a versão TypeScript, mover este SKILL.md pra
`.claude/skills/validar-heal-diff/SKILL.md` + `validator.ts` (mesma
pasta). Estrutura igual à de `twygo-recon` (recon.ts + SKILL.md).

## Por que não é "perfeito"

Heurísticas de regex em diff têm falsos positivos/negativos
inevitáveis. Ex: um diff que muda `getByTestId('save')` →
`getByRole('button', { name: 'Salvar' })` é tecnicamente
`code_outside_locator` se a regex não casar, mas é correção legítima.
Por isso a categoria `needs_review` existe — quando dúvida, o humano
decide.

A meta da skill **não é** validar 100% automaticamente; é capturar os
erros óbvios (assertion polarity flip, title change) que hoje passam
batidos. Um falso positivo ocasional força revisão humana — aceitável.
Um falso negativo deixa drift entrar — inaceitável. Por isso a tabela
BLOQUEADO é estrita.

## Referências

- CLAUDE.md regra dura #11 (escopo do healer)
- CLAUDE.md §7.6 (anti-patterns A–E)
- `twygo-test-orchestrator` Etapa 8 (Healing) e 8.5 (Auto-PR)
- `playwright-test-healer.md` (subagent oficial Microsoft que ESTA skill audita)
