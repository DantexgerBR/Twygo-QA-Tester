# CLAUDE.md — twygo-agents-qa

> Vale para os 3 sub-agentes deste monorepo: `agent-at/` (Python — análise
> de teste), `agent-playwright/` (TypeScript + Playwright — E2E),
> `agent-db/` (Python — validações em banco). Cada sub-agente é
> autossuficiente e tem seu próprio `CLAUDE.md` técnico — este arquivo
> traz convenções operacionais que valem em todos.

## Skills primeiro

Antes de implementar/gerar código em qualquer sub-agente, leia
`<sub-agente>/.claude/skills/*/SKILL.md` daquele agente. As skills
capturam padrões já validados pelo usuário, fluxos canônicos, convenções
de Twygo, anti-patterns proibidos e diagnósticos de bugs comuns.

A "lei" técnica de cada sub-agente vive em `<sub-agente>/CLAUDE.md`. Este
arquivo (raiz) é só a regra meta sobre **como skills são criadas/atualizadas**
no decorrer do uso.

## Regra: feedback corretivo ⇒ proposta de skill

Quando o usuário corrigir um padrão que você usou ("não faz assim", "essa
abordagem tá errada", "use o que já existe em X", "esse seletor é frágil",
"reusa o helper X em vez de duplicar"), **antes de continuar a tarefa**:

1. Identifique o padrão correto que ele indicou (frequentemente apontando
   um lugar do código que já faz daquele jeito).
2. Verifique se já existe skill em `<sub-agente>/.claude/skills/` cobrindo
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
| "consulta read-only sempre passa por `bindparams`" | atualiza/cria skill em `agent-db/.claude/skills/db-query-builder` |

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
   em `.claude/skills/` do sub-agente afetado).
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
contradiz `.claude/prose-patterns.md`, um spec gerado violando algum
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
   `<sub-agente>/.claude/skills/`. Padrões de nome sugeridos:
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

## Não duplicar — tudo é por sub-agente

- **Não criar arquivos na raiz** além deste `CLAUDE.md` e o `README.md`. A
  "regra de isolamento" do README é dura — `package.json`, `playwright.config.ts`,
  `requirements.txt` etc. ficam dentro de `agent-*/`.
- **Não compartilhar skill entre sub-agentes** copiando — se duas skills
  começam a parecer iguais, ou a) o conceito é genérico e vai num doc
  externo (ou no README raiz), ou b) é só uma coincidência e os dois
  contextos são diferentes mesmo. Não force.
- **Não editar `outputs/`/`output/`** — são gerados; estão no `.gitignore`.

## Branches por finalidade

- `master` — base estável, cumulativa de projetos.
- `project/<slug>` — trabalho de QA num projeto Twygo específico (ex:
  `project/widgets`). Convém. Documentado em
  [agent-playwright/.claude/PROJECT_BOOTSTRAP.md](agent-playwright/.claude/PROJECT_BOOTSTRAP.md).
- `fix/<slug>` ou `chore/<slug>` — correções na infra dos agentes.
- `feature/<slug>` — feature nova num agente (ex: nova skill, novo subagent).

## Suporte

- Dúvidas operacionais: pergunte no canal do time de QA.
- Bugs: issue no repositório `Twygo/twygo-agents-qa`.
- Skill nova proposta: documente o caso de uso, leve ao QA Lead, abra PR
  com `feature/skill-<nome>`.
