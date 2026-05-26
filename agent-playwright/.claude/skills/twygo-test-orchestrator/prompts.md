# twygo-test-orchestrator — prompt templates

Templates de prompt que o orchestrator injeta nos subagents oficiais
(`playwright-test-planner`, `playwright-test-generator`, `playwright-test-healer`).

Separados da SKILL.md pra facilitar manutenção do prompt sem precisar re-ler
todo o fluxo. Quando atualizar, garanta que SKILL.md ainda referencia este
arquivo nas Etapas correspondentes.

## Convenção

Cada bloco abaixo é um template literal. Variáveis no formato `<nome>` são
substituídas pelo orquestrador antes da invocação. Não editar a estrutura
sem entender o impacto no agent — ver SKILL.md Etapas 2/4/8 para contexto.

## Planner — Etapa 2

Invocado **uma vez por testcase** no escopo. Variáveis:

| Variável | Origem |
|---|---|
| `<nome da testsuite>` | `<testsuite name>` do XML |
| `<nome do testcase>` | `<testcase name>` do XML |
| `<summary>` | `<summary>` do testcase no XML |
| `<preconditions>` | `<preconditions>` do testcase no XML |
| `<step.actions>` / `<step.expectedResults>` | `<actions>` / `<expectedresults>` de cada step |

Template canônico:

```text
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

**Carregamento de contexto adicional** que o orchestrator deve incluir antes
do prompt acima:

1. Conteúdo de `.claude/prose-patterns.md` (tradução PT-BR → Playwright).
2. Conteúdo de `outputs/<slug>/recon-cache/<slug-suite>.md` se existir
   (catálogo de test-ids/labels da área — corta exploração live). É um cache
   regenerável com TTL (7 dias default): verifique o `generatedAt` no header
   de metadados (bloco `<!-- recon-cache ... -->` no topo) — se stale ou
   ausente, regenere via `npm run agent:recon -- --suite "<nome>"` antes de
   consumir, ou deixe o planner explorar live. Ver skill `roadmap-recon-cache`.
3. Lista de Page Objects existentes em `src/pages/` + `projects/<slug>/pages/`
   com seus métodos públicos (pra reuso).

**Saída esperada**: o planner grava `projects/<slug>/specs/<slug-suite>-plan.md`
via `planner_save_plan`. Validar que cobre todos os steps do XML antes de
seguir pra Etapa 4.

## Generator — Etapa 4

O prompt do generator inclui:

1. O plano da Etapa 2 (carregado por path).
2. Lista de Page Objects + métodos disponíveis (do passo "Carregamento de
   contexto" da Etapa 2).
3. Os 5 **anti-patterns A-E** transcritos de CLAUDE.md §7.6 — esses ficam
   inline na SKILL.md Etapa 4 porque mudam juntos com a regra canônica e a
   redundância evita drift.

Quando atualizar os anti-patterns A-E:
- **Fonte de verdade**: CLAUDE.md §7.6
- **Cópia operacional**: SKILL.md Etapa 4 (transcrição que vai pro prompt)

Mantenha os dois sincronizados. Se a transcrição precisar virar template
parametrizado (ex: anti-pattern com slug do projeto), mover pra cá como
seção "Generator — Etapa 4 (anti-patterns)".

## Healer — Etapa 8

Hoje o orquestrador **não injeta prompt customizado** no healer — usa o
system prompt default do `playwright-test-healer.md` (upstream Microsoft,
não-forkado).

A skill [`validar-heal-diff`](../validar-heal-diff/SKILL.md) (Etapa 8.1) faz
o gate estático que compensa a ausência de injeção customizada — bloqueia
mudanças de intenção do teste antes de qualquer commit.

Se no futuro virar necessário injetar contexto custom no healer (ex: passar
gotchas §7.5 explicitamente, ou travar healer pra usar só `data-test-id`
com hífen como o Twygo), adicionar template aqui como seção "Healer —
Etapa 8".

## Referências

- SKILL.md (Etapas 2/4/8 deste skill)
- CLAUDE.md §5 (tradução de prosa) e §7.6 (anti-patterns A-E)
- `.claude/prose-patterns.md` (tabelas de mapeamento PT-BR → Playwright)
- `validar-heal-diff/SKILL.md` (gate estático que cobre Etapa 8.1)
