# Gerar AT (Análise de Teste) com rigor completo, pelo app — design

**Data:** 2026-07-27
**Pedido original:** a gestora quer que a geração de AT (não só a execução de testes) seja feita pelo `agent-ui`, com o mesmo rigor do `/analyze-test` (validação de anti-pattern, derivados `.xmind`/`.xml`, gate de revisão da estrutura) — não a versão simplificada de 1 tiro que já existe em `#/at` (`/api/at-generate`).

## Contexto

`/analyze-test` é uma skill Claude Code de 8 fases, hoje pensada pra sessão interativa (`agent-at/.claude/skills/analyze-test/SKILL.md`):

1. Identificação do projeto
2. `/read-docs` — extrai requisitos de `projects/<slug>/docs/`
3. `/recon-prototipo` (automática se `prototypeUrl` setado; fallback gracioso se MCP/login/timeout falhar)
4. **Definição da estrutura de suítes — PAUSA e pergunta ao usuário se quer ajustar**
5. Criação dos casos de teste (convenções `twygo-qa-conventions`)
6. `/generate-md-canonical` + validação obrigatória (`md_canonical_parser.py`, `validate_md_canonical.py`)
7. `/generate-xmind` + `/generate-xml-testlink` (derivados)
8. Validação cruzada (contagens batem) + entrega

Busquei "analyze-test" em todo o org Twygo via `gh api search/code` — **não existe repo separado**; tudo isso já vive em `agent-at/`, já clonado neste monorepo. O que falta é só a orquestração headless.

**Por que isso não foi feito antes:** rodar via app significa disparar uma sessão Claude Code inteira (não um script), com custo real de token, e lidar com o gate humano da Etapa 4 sem um humano na sessão.

## Decisões já tomadas (confirmadas com o Dante)

1. **Gate de revisão em 2 passos no app** (não 1 passo automático): o app dispara a proposta de estrutura, o QA revisa/edita na UI, só depois dispara a escrita dos casos.
2. **Mecanismo de invocação:** `child_process.spawn('claude', [...])` — CLI já instalado nesta máquina (`2.1.220`), zero dependência nova. Confirmei que o CLI suporta exatamente o que precisamos:
   - `-p`/`--print` (não-interativo)
   - `--output-format stream-json` → NDJSON com eventos de tool-use/texto/resultado final (inclui `total_cost_usd` e `usage` de tokens)
   - `--permission-mode bypassPermissions` → necessário pois a skill usa Read/Write/Bash/Glob/Grep autonomamente, sem humano pra aprovar cada chamada

## Arquitetura

### 1. Dividir a skill (`agent-at/.claude/skills/`)

- **Nova skill `analyze-test-plan`**: Etapas 1, 2, 2.5, 3 do fluxo atual — lê docs, roda recon (com o mesmo fallback gracioso já existente), propõe estrutura de suítes (nome, executor, playbooks, org alvo, pré-condições) e grava `projects/<slug>/output/estrutura-proposta.md`. **Não escreve casos de teste.** Sai ao final (sem pausa — é o fim do fluxo desta skill).
- **`/analyze-test` existente, ajustada**: passa a checar se existe `estrutura-proposta.md` com um marcador `aprovada: true` no frontmatter. Se sim, **pula a Etapa 3** (usa a estrutura do arquivo em vez de propor de novo) e roda direto Etapas 5-8 (escreve casos → MD canônico → valida → deriva xmind/xml → valida cruzado → entrega). Se não existir o arquivo aprovado, cai no comportamento atual (interativo) — **retrocompatível**, continua funcionando igual quando alguém roda manual dentro de uma sessão Claude Code normal.

Isso reaproveita 100% da lógica/convenções já escritas (nenhuma duplicação de prompt), só decompõe onde a pausa acontece.

### 2. Novos endpoints em `server.mjs`

Seguindo o mesmo padrão SSE que `/api/run` já usa pro Playwright (banners de fase, log ao vivo, `done` no final):

- **`POST /api/at-plan?project=<slug>`** (SSE): spawna `claude -p "/analyze-test-plan --project <slug>" --output-format stream-json --permission-mode bypassPermissions` com `cwd: AAT` (agent-at). Faz parse do NDJSON (cada linha = 1 JSON: tool_use, text, ou result final) e repassa como eventos SSE (`phase`/`log`/`done`). Ao terminar, lê `estrutura-proposta.md` e devolve o conteúdo pro front.
- **`POST /api/at-build?project=<slug>`** body `{ estrutura: "<md editado pelo QA>" }`: grava a estrutura (com `aprovada: true` no frontmatter) de volta em `estrutura-proposta.md`, depois spawna `claude -p "/analyze-test --project <slug>"` (mesmos flags), streama progresso via SSE igual, e ao terminar devolve os caminhos dos 3 arquivos gerados + resumo (suítes/casos totais).
- **Custo:** extrai `total_cost_usd` e `usage` (tokens in/out) do evento `result` final do `stream-json` e grava no ledger existente (`state/usage.json`), ação `gerar-at-plan` / `gerar-at-build`.

### 3. UI (`index.html`, tela `#/at`)

- Painel novo (ou reformar o existente "Gerar AT por IA"): botão **"1. Propor estrutura"** → chama `/api/at-plan`, mostra progresso (reaproveita o componente de steps/log que a tela Execução já tem) → ao terminar, mostra a estrutura num textarea editável.
- Botão **"2. Gerar AT completa"** (habilitado só depois do passo 1) → chama `/api/at-build` com o texto (possivelmente editado) → progresso ao vivo de novo → ao terminar, mostra resumo + links pros 3 arquivos + eventuais erros/warnings do validador.
- **Nunca sobrescreve a AT publicada** — mesma convenção já usada em `/api/at-generate` (grava em `output/`, publicação pro `agent-playwright` continua manual, via botão/cópia existente).

### 4. Riscos conhecidos (com mitigação já prevista)

- **Recon de protótipo em modo headless:** o `.mcp.json` do `agent-at` configura o MCP do Playwright; em `-p` headless pode não conseguir aprovar/carregar o MCP na primeira vez. **Já coberto**: a skill tem fallback gracioso nativo pra "MCP não disponível" → skip + warning, não trava o fluxo.
- **Duração:** rodar as 8 fases pode levar minutos (é uma sessão de agente real). SSE mantém a conexão viva com heartbeats de log, igual ao `/api/run` já faz pra suítes longas.
- **Retrocompatibilidade:** ninguém que já usa `/analyze-test` manualmente dentro do Claude Code é afetado — o comportamento antigo (pausa interativa) permanece se não houver `estrutura-proposta.md` aprovada.

## Fora de escopo desta rodada

- Rodar em paralelo múltiplos projetos (1 de cada vez, como o `/api/run` de suítes já assume).
- Editor estruturado da proposta (campo por campo) — v1 é textarea de markdown livre, igual ao padrão já usado no resto do app.
