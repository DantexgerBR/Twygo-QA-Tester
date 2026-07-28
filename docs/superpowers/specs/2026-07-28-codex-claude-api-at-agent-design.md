# Trocar o motor headless da geração de AT (Claude CLI → Codex CLI + API oficial) — design

**Data:** 2026-07-28
**Supersede parcial de:** `2026-07-27-analyze-test-headless-design.md` — só a **Decisão 2** daquele doc (mecanismo de invocação). Tudo o resto (split das skills `analyze-test-plan`/`analyze-test`, os 2 endpoints SSE, a UI de 2 passos, o ledger) já foi implementado como descrito lá e **continua valendo**. Este doc troca só o "como" o agente roda.

## Motivo

O `/api/at-plan`/`/api/at-build` (implementados em 27/07) rodam `child_process.spawn('claude', ['-p', ..., '--permission-mode', 'bypassPermissions'])` — chamando o binário `claude` (Claude Code) de forma automatizada/headless. Isso bateu 4 vezes reais no ledger (projeto scratch), autenticado pela sessão pessoal do Dante (sem `ANTHROPIC_API_KEY` no ambiente do processo).

Os **Consumer Terms of Service** da Anthropic (que cobrem Claude Pro/sessão pessoal — diferente da API comercial) dizem:

> *"Except when you are accessing our Services via an Anthropic API Key or where we otherwise explicitly permit it, users cannot access services through automated means like bots or scripts."*
> *"You may not share your Account login information, Anthropic API key, or Account credentials with anyone else, nor make your account available to others."*

`spawn('claude', ..., bypassPermissions)` sem API key é exatamente esse cenário: automação sem ser via API key. Se isso for pro Electron/executável (plano de distribuição do projeto), cada instalação rodando na sessão pessoal do Dante também bate na segunda cláusula (tornar a conta disponível pra outros).

**Decisão do Dante (28/07):** trocar o mecanismo pra dois motores ToS-seguros — `codex exec` (que a própria OpenAI documenta como **oficialmente suportado pra automação headless/CI**) como padrão, e a **API oficial da Anthropic** (com `ANTHROPIC_API_KEY`, que cai na exceção explícita da cláusula acima) como fallback manual.

## Escopo confirmado

- ✅ Retirar `claude-cli.mjs`/`runClaudeSkill` de uso — **sem** deixar como toggle/fallback (mantê-lo alcançável, mesmo atrás de flag, mantém o risco de TdS vivo).
- ✅ Etapa 2.5 (recon de protótipo via MCP playwright) **não é portada** — cai direto no fallback "SKIP + warning" que a skill já documenta pra quando o MCP não está disponível (nenhum dos 2 motores novos tem esse MCP).
- ✅ Fluxo de UI (plan → aprovar → build) **não muda** — só troca o motor por baixo.
- ✅ Fallback pra API do Claude é **só manual** (seletor na Conexão) — sem retry automático se o Codex falhar no meio de um run. Mais simples de depurar; erro aparece, QA troca o motor e roda de novo.
- ✅ Fallback planejado mesmo sem chave hoje — sem `ANTHROPIC_API_KEY` configurada, aparece como "não configurado" (mesmo padrão que Codex/OpenAI já mostram).
- ❌ Fora de escopo: essa troca não existe no `twygo-qa-ui` (repo do app/Electron) — confirmado no diff entre os 2 `server.mjs`, essa feature de AT-plan/AT-build só existe no monorepo.
- ❌ Fora de escopo: harness de fallback automático multi-motor (rejeitado — só manual, ver acima).

## Arquitetura

### Novo módulo `agent-ui/agent-at-engine.mjs`

Assinatura espelha `runClaudeSkill` de propósito, pra os 2 call-sites em `server.mjs` (`/api/at-plan`, `/api/at-build`) trocarem pouco:

```js
export async function runAtAgent(promptKey, { project, engine, cwd, send, timeoutMs }) { ... }
```

- `promptKey`: `'plan'` ou `'build'` — escolhe qual dos 2 prompts adaptados usar (ver abaixo).
- `engine`: `'codex-cli'` (default) ou `'claude-api'` — lido de `state/settings.json` (`atEngine`), separado do seletor de "Modelo de IA" que já existe (esse é pra completions simples de 1 tiro; aqui é agente autônomo com bash/arquivo — capacidade diferente, não misturar os dois seletores).
- Dispatch interno pra `runCodexAgent(...)` ou `runClaudeApiAgent(...)`, ambos devolvendo o mesmo formato que `runClaudeSkill` já devolve hoje: `{ ok, costUsd, usageIn, usageOut, model, timedOut }` — assim `/api/at-plan`/`/api/at-build` não precisam mudar a lógica de `appendUsage`/`send`.

### Motor `codex-cli` (`runCodexAgent`)

```js
spawn('codex', ['exec', '--sandbox', 'workspace-write', '--json', '--cwd', cwd, '-'], { env })
```

Prompt via stdin (mesmo padrão do `codexComplete` já existente em `ai-engine.mjs`). Parse de eventos `--json` (JSONL) análogo ao `parseStreamJsonLine` de hoje, adaptado pro formato de evento do Codex.

**Itens abertos pra confirmar na implementação** (não tenho o binário `codex` neste ambiente pra checar):
- Valor exato de `--approval-policy` pra "nunca perguntar" (rodar `codex exec --help` na máquina do Dante antes de codar).
- Se o stream `--json` expõe uso de tokens/custo (equivalente ao `total_cost_usd`/`usage` do Claude CLI) — se não expõe, a linha do ledger fica sem `usd` e cai no fallback de preço da tabela (`costOf` já trata isso), ou fica sem custo registrado (decidir na implementação conforme o que o Codex realmente devolve).

### Motor `claude-api` (`runClaudeApiAgent`)

Loop de tool-use real contra a **Messages API** da Anthropic (não CLI nenhum) — o caminho que a própria cláusula do TdS permite explicitamente. 3 tools client-side, executadas em Node, escopadas ao diretório do projeto (`cwd`):

| Tool | Faz | Guarda de segurança |
|---|---|---|
| `read` | lê arquivo | resolve path, confirma que fica dentro de `cwd` antes de abrir |
| `write` | escreve/sobrescreve arquivo | mesma guarda de path; nunca fora de `cwd` |
| `bash` | roda comando | timeout + só dentro de `cwd`; **sem** allowlist de comando na v1 (é o mesmo nível de confiança que o `codex exec --sandbox workspace-write` já tem — quem entra aqui já decidiu confiar no agente pra esse projeto) |

Loop: `system` (adaptado do conteúdo das skills) + `tools` + `messages` → chama `client.messages.create` → se `stop_reason === "tool_use"`, executa a tool localmente e devolve `tool_result`, repete; para em `end_turn` ou num teto de iterações (evita loop infinito custando token). Modelo default: `claude-sonnet-5` (já precificado no `ai-prices.json` desde a rodada de preços de hoje — até agora aquela linha não tinha uso real, essa é a primeira vez que ela some por trás de um custo de verdade em vez do `usd` fixo do Claude CLI).

Chave: `ANTHROPIC_API_KEY` (env). Sem chave → `configured: false`, mesma UX de "não configurado" que Codex/OpenAI.

### Prompts (novo, substitui a invocação `/analyze-test-plan --project X` / `/analyze-test --project X`)

Dois arquivos de texto novos (ex.: `agent-at-engine-prompts.mjs`, ou `.md` ao lado das skills originais — decidir na implementação) adaptados de `agent-at/.claude/skills/{analyze-test-plan,analyze-test}/SKILL.md`, com:
- Sintaxe de invocação de skill do Claude Code removida (não é `/comando --args`, é instrução em prosa — os 2 motores recebem prompt + tools, não skills).
- Referência ao MCP playwright removida — instrução direta: "não há recon de protótipo disponível neste modo; se `prototypeUrl` estiver setado, registre um warning e siga sem recon" (é o fallback que a skill já documenta, só que agora é o caminho único, não a exceção).
- Resto do conteúdo (convenções, formato do MD canônico, validação, geração de xmind/xml, validação cruzada) preservado — é onde está o valor real da skill.

### Endpoints

- `GET/POST /api/at-engine` — espelha `/api/ai-model`: lê/grava `atEngine` em `settings.json`, devolve `{ engine, engines: [...], configured, needsKey }` pros 2 motores (usa `engineConfigStatus`-like check pra cada um).
- `/api/at-plan`, `/api/at-build` — trocam a chamada de `runClaudeSkill(...)` pra `runAtAgent('plan'|'build', { project, engine: await atEngine(), cwd: AAT, send })`. Resto do endpoint (SSE, leitura de `estrutura-proposta.md`, gate de aprovação) não muda.

### UI (`#/at`)

Seletor pequeno perto do painel "1. Propor estrutura" / "2. Gerar AT completa" — dropdown `Codex CLI` / `API do Claude`, com badge "não configurado" no motor sem chave/binário disponível (mesmo padrão visual do seletor de engine que já existe na Conexão).

### Remoção

- `server.mjs`: remove o `import { runClaudeSkill } from './claude-cli.mjs'` e os 2 call-sites.
- `claude-cli.mjs`: `parseStreamJsonLine`/`runClaudeSkill` saem (sem uso); `injectApproved`/`costOf` **ficam** (usados em `/api/at-approve` e `/api/cost`, independentes do motor removido). Decidir na implementação se isso justifica renomear o arquivo (já não é mais "claude cli" específico) ou só deixar como está.

## Riscos & mitigação

- **`bash` client-side no motor `claude-api` sem allowlist de comando** — mesmo nível de confiança que o `workspace-write` do Codex já tem, mas vale registrar explicitamente: é um tool novo que executa o que o modelo mandar, dentro do diretório do projeto. Guarda de path (não sair de `cwd`) é obrigatória; allowlist de comando fica pra depois se algum dia isso rodar fora da máquina do Dante.
- **Custo do motor Codex desconhecido até implementar** — sem o binário aqui pra inspecionar o formato real do `--json`, pode não ter tokens/custo exposto. Não bloqueia o design; só significa que a linha do ledger pode vir sem `usd` real (cai no preço de tabela, que já existe pro `codex-cli` nos outros 4 endpoints).
- **Nenhuma parte disto é testável nesta sessão** — nem `codex` nem `ANTHROPIC_API_KEY` existem neste ambiente. Verificação real (rodar de verdade, confirmar flags do Codex, confirmar chave) só acontece na máquina do Dante.

## Fora de escopo desta rodada

- Fallback automático entre motores (rejeitado — só manual).
- Allowlist de comando pro `bash` client-side do motor `claude-api`.
- Tocar o `twygo-qa-ui` (repo do app) — essa feature não existe lá.
- Portar a etapa de recon de protótipo via MCP pra qualquer um dos 2 motores novos.
