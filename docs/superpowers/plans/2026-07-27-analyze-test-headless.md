# Gerar AT (Análise de Teste) headless pelo app — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Trazer o `/analyze-test` (skill Claude Code de 8 fases, gera `test-analysis.md` + `.xmind` + `.xml` TestLink) pro `agent-ui`, com um gate de revisão humana entre "propor estrutura de suítes" e "escrever os casos de teste", disparando `claude -p` headless a partir do server.

**Architecture:** A skill existente é dividida em duas: `analyze-test-plan` (novas, fases 1-3, propõe estrutura e para) e `analyze-test` (ajustada, pula a Etapa 3 quando já existe uma estrutura aprovada, roda fases 5-8). O `server.mjs` orquestra as duas via `child_process.spawn('claude', ['-p', ...])`, fazendo parse do `--output-format stream-json` linha a linha e repassando como SSE (mesmo padrão que `/api/run` já usa pro Playwright). A UI ganha um painel de 2 botões em `#/at`.

**Tech Stack:** Node.js stdlib (`node:child_process`, `node:http`), CLI `claude` (já instalado, `2.1.220`), `node --test` pros testes de parsing puro.

---

## Contexto verificado antes de escrever este plano

- Rodei `claude -p "diga apenas OK" --output-format stream-json --permission-mode bypassPermissions --verbose` de verdade e capturei o formato real dos eventos (não é suposição):
  - `{"type":"assistant","message":{"model":"claude-sonnet-5","content":[{"type":"text","text":"OK"}]}}` — texto
  - `{"type":"assistant","message":{"content":[{"type":"tool_use","name":"Read","input":{"file_path":"..."}}]}}` — chamada de ferramenta
  - `{"type":"result","is_error":false,"total_cost_usd":0.1579698,"usage":{"input_tokens":2,"output_tokens":4,...}}` — resultado final, com custo REAL (não precisa estimar por tabela de preço)
  - `--verbose` é **obrigatório** junto com `-p --output-format stream-json` (o CLI recusa sem ele).
- `agent-at/.claude/skills/analyze-test/SKILL.md` já existe, 248 linhas, 8 etapas. A Etapa 3 ("Definição da estrutura de suítes") termina com "Apresentar estrutura ao usuário e perguntar se deseja ajustar antes de prosseguir." — é esse o ponto que vira o gate de 2 passos.
- `server.mjs` já tem `const AAT` (linha 27) apontando pra `agent-at/`, e já tem o padrão SSE completo em `/api/run` (linha 347) — banners de fase via regex em texto, `send()` via `res.write('data: '...)`, `done` no fechamento do processo.
- `server.mjs` já tem `appendUsage`/`readUsage`/`loadPrices` (ledger de custo, linhas 93-99) e `/api/cost` (linha 515) que hoje SEMPRE recalcula USD a partir de tokens × tabela de preço — precisa mudar pra usar o `total_cost_usd` real quando disponível (senão o custo do Claude sai errado, já que cache tokens têm preço diferente de tokens normais e não estão na tabela).
- `index.html` já tem `renderAt()` (linha 1485) com um painel "Gerar AT por IA" simplificado — o painel novo entra ao lado dele, sem remover o existente.

## Desvios do design original (spec de 2026-07-27) — e por quê

- **A spec descrevia 1 endpoint `POST /api/at-build` recebendo a estrutura no corpo.** Virou 2: `POST /api/at-approve` (grava a estrutura aprovada, sem rodar nada) + `GET /api/at-build` (SSE, dispara o `claude -p`). Motivo técnico: `EventSource` (usado pro SSE, igual ao `/api/run` já faz) só suporta GET — não dá pra mandar um corpo grande de markdown nele. O mesmo padrão "POST salva, GET/SSE roda" já existe no app (`/api/conn` salva, `/api/run` roda).
- **A spec falava em "reaproveitar o mesmo padrão da tela Execução"** — reaproveitei o formato de evento SSE (`start`/`phase`/`log`/`done`) e o uso de `EventSource`, mas a UI em si é um log de texto simples (sem o stepper visual de 3 caixas que a Execução tem) — menor diff, e o conteúdo aqui é nomes de ferramenta (`Read`, `Bash`...) e texto livre, não um número fixo de fases visuais como o Playwright tem.

---

## Task 1: `claude-cli.mjs` — parsing puro do stream-json (TDD)

**Files:**
- Create: `agent-ui/claude-cli.mjs`
- Test: `agent-ui/test/claude-cli.test.mjs`

- [ ] **Step 1: Escrever o teste (vai falhar — o módulo ainda não existe)**

Crie `agent-ui/test/claude-cli.test.mjs`:

```js
import assert from 'node:assert/strict';
import test from 'node:test';

import { injectApproved, parseStreamJsonLine } from '../claude-cli.mjs';

test('parseStreamJsonLine reconhece tool_use como fase', () => {
  const line = '{"type":"assistant","message":{"model":"claude-sonnet-5","content":[{"type":"tool_use","id":"toolu_1","name":"Read","input":{"file_path":"x.md"}}]}}';
  assert.deepEqual(parseStreamJsonLine(line), { type: 'phase', name: 'Read', model: 'claude-sonnet-5' });
});

test('parseStreamJsonLine reconhece texto como log', () => {
  const line = '{"type":"assistant","message":{"model":"claude-sonnet-5","content":[{"type":"text","text":"=== Fase 2: Leitura de documentacao ==="}]}}';
  assert.deepEqual(parseStreamJsonLine(line), { type: 'log', line: '=== Fase 2: Leitura de documentacao ===', model: 'claude-sonnet-5' });
});

test('parseStreamJsonLine extrai custo e tokens do result final', () => {
  const line = '{"type":"result","is_error":false,"total_cost_usd":0.1579698,"usage":{"input_tokens":2,"output_tokens":4}}';
  assert.deepEqual(parseStreamJsonLine(line), { type: 'result', ok: true, costUsd: 0.1579698, usageIn: 2, usageOut: 4 });
});

test('parseStreamJsonLine marca result com erro', () => {
  const line = '{"type":"result","is_error":true,"total_cost_usd":0.01,"usage":{"input_tokens":1,"output_tokens":1}}';
  assert.deepEqual(parseStreamJsonLine(line), { type: 'result', ok: false, costUsd: 0.01, usageIn: 1, usageOut: 1 });
});

test('parseStreamJsonLine ignora ruido (hooks, rate limit, JSON invalido)', () => {
  assert.equal(parseStreamJsonLine('{"type":"system","subtype":"hook_started"}'), null);
  assert.equal(parseStreamJsonLine('{"type":"rate_limit_event","rate_limit_info":{}}'), null);
  assert.equal(parseStreamJsonLine('nao e json'), null);
  assert.equal(parseStreamJsonLine(''), null);
});

test('injectApproved troca aprovada: false por true', () => {
  const md = '---\naprovada: false\nproject: x\n---\n\n# Proposta\n';
  assert.match(injectApproved(md), /^aprovada: true$/m);
});

test('injectApproved e idempotente quando ja aprovada', () => {
  const md = '---\naprovada: true\nproject: x\n---\n\n# Proposta\n';
  assert.equal(injectApproved(md), md);
});

test('injectApproved insere o campo quando o frontmatter nao tem aprovada', () => {
  const md = '---\nproject: x\n---\n\n# Proposta\n';
  const out = injectApproved(md);
  assert.match(out, /^aprovada: true$/m);
  assert.match(out, /project: x/);
});
```

- [ ] **Step 2: Rodar e confirmar que falha (módulo não existe)**

Run: `cd agent-ui && node --test test/claude-cli.test.mjs`
Expected: `Cannot find module '../claude-cli.mjs'` (ou similar erro de import)

- [ ] **Step 3: Criar `agent-ui/claude-cli.mjs`**

```js
// claude-cli.mjs — invoca skills do Claude Code headless (claude -p) e faz parse do stream-json.
// Isolado do server.mjs (mesmo motivo do ai-engine.mjs): lógica pura, testável sem subir servidor.
import { spawn } from 'node:child_process';

// Uma linha de --output-format stream-json vira um evento, ou null (ruído: hooks, rate_limit_event, etc).
export function parseStreamJsonLine(line) {
  let o;
  try { o = JSON.parse(line); } catch { return null; }
  if (o.type === 'assistant') {
    const blocks = (o.message && o.message.content) || [];
    for (const b of blocks) {
      if (b.type === 'tool_use') return { type: 'phase', name: b.name, model: o.message.model };
      if (b.type === 'text' && b.text) return { type: 'log', line: b.text, model: o.message.model };
    }
    return null;
  }
  if (o.type === 'result') {
    return {
      type: 'result',
      ok: !o.is_error,
      costUsd: o.total_cost_usd || 0,
      usageIn: (o.usage && o.usage.input_tokens) || 0,
      usageOut: (o.usage && o.usage.output_tokens) || 0,
    };
  }
  return null;
}

// Roda uma skill headless (claude -p "/skill --args") em `cwd`, repassando progresso via `send()`.
// Resolve com o resultado final (ok/custo/tokens/modelo) quando o processo termina.
export function runClaudeSkill(prompt, { cwd, send, timeoutMs = 20 * 60 * 1000 }) {
  return new Promise((resolve) => {
    const child = spawn('claude', ['-p', prompt, '--output-format', 'stream-json', '--permission-mode', 'bypassPermissions', '--verbose'], { cwd });
    let buf = '';
    let result = { ok: false, costUsd: 0, usageIn: 0, usageOut: 0, model: '' };
    const timer = setTimeout(() => { try { child.kill(); } catch {} }, timeoutMs);
    const onLine = (line) => {
      if (!line.trim()) return;
      const ev = parseStreamJsonLine(line);
      if (!ev) return;
      if (ev.type === 'result') { result = { ok: ev.ok, costUsd: ev.costUsd, usageIn: ev.usageIn, usageOut: ev.usageOut, model: result.model }; return; }
      if (ev.model) result.model = ev.model;
      send(ev.type === 'phase' ? { type: 'phase', name: ev.name } : { type: 'log', line: ev.line });
    };
    child.stdout.on('data', (chunk) => {
      buf += chunk.toString();
      let i;
      while ((i = buf.indexOf('\n')) >= 0) { onLine(buf.slice(0, i)); buf = buf.slice(i + 1); }
    });
    child.stderr.on('data', (d) => send({ type: 'log', line: '[stderr] ' + d.toString() }));
    child.on('close', () => { clearTimeout(timer); if (buf.trim()) onLine(buf); resolve(result); });
    child.on('error', (e) => { clearTimeout(timer); send({ type: 'log', line: 'erro ao iniciar claude: ' + e }); resolve(result); });
  });
}

// Marca a estrutura proposta como aprovada (frontmatter `aprovada: true`) — idempotente.
export function injectApproved(mdText) {
  if (/^aprovada:\s*true\s*$/m.test(mdText)) return mdText;
  if (/^aprovada:\s*false\s*$/m.test(mdText)) return mdText.replace(/^aprovada:\s*false\s*$/m, 'aprovada: true');
  if (/^---\s*$/m.test(mdText)) return mdText.replace(/^---\s*$/m, '---\naprovada: true');
  return `---\naprovada: true\n---\n\n${mdText}`;
}
```

- [ ] **Step 4: Rodar os testes e confirmar que passam**

Run: `cd agent-ui && node --test test/claude-cli.test.mjs`
Expected: `# pass 8` (todos os testes acima), `# fail 0`

- [ ] **Step 5: Rodar a suíte inteira (não quebrou o `ai-engine.test.mjs` existente)**

Run: `cd agent-ui && node --test test/*.test.mjs`
Expected: `# pass 16` (8 do ai-engine + 8 novos), `# fail 0`

- [ ] **Step 6: Commit**

```bash
git add agent-ui/claude-cli.mjs agent-ui/test/claude-cli.test.mjs
git commit -m "agent-ui: adiciona claude-cli.mjs (parse do stream-json de claude -p headless)"
```

---

## Task 2: Nova skill `analyze-test-plan` (fases 1-3, propõe estrutura e para)

**Files:**
- Create: `agent-at/.claude/skills/analyze-test-plan/SKILL.md`

- [ ] **Step 1: Criar o arquivo**

```markdown
---
name: analyze-test-plan
description: Primeira metade do fluxo de Análise de Teste (AT) — lê documentação do projeto, roda recon de protótipo (se configurado) e propõe a estrutura de suítes, SEM escrever casos de teste ainda. Grava projects/<slug>/output/estrutura-proposta.md pra revisão humana antes de continuar com /analyze-test. Use quando o agent-ui disparar a Fase 1 (proposta de estrutura) do fluxo headless de AT.
disable-model-invocation: true
allowed-tools: Read Write Edit Bash Glob Grep
---

# Análise de Teste (AT) — Fase 1: Proposta de Estrutura

Você é o agente de AT da Twygo. Esta skill faz a PRIMEIRA METADE do fluxo
completo de `/analyze-test` — pára depois de propor a estrutura de suítes,
SEM escrever casos de teste. Alguém (humano, via o agent-ui) vai revisar
essa proposta antes de continuar com `/analyze-test`, que completa o resto.

**Convenção de progresso**: sempre que uma etapa abaixo tiver uma linha
`=== Fase N: ... ===`, escreva essa linha EXATA como texto da sua resposta
(sozinha, antes de agir na etapa) — não a omita e não parafraseie. Um
sistema de progresso ao vivo no `agent-ui` lê essas linhas.

## Etapa 1: Identificação do projeto

=== Fase 1: Identificação do projeto ===

1. Identificar o slug do projeto:
   - Flag `--project <slug>` (se invocado por script)
   - Variável `PROJECT=<slug>`
   - Auto-detect: se há exatamente 1 projeto em `projects/`, usar ele
   - Erro explícito: listar projetos disponíveis e parar (não adianta
     pedir input interativamente — esta skill roda headless)
2. Verificar se `projects/<slug>/docs/` contém arquivos. Se vazia, PARAR
   e informar que precisa depositar docs antes de continuar.
3. Criar `projects/<slug>/output/` se não existir.

## Etapa 2: Leitura e interpretação dos documentos

=== Fase 2: Leitura de documentação ===

Invocar a skill `/read-docs` pra ler e interpretar todos os arquivos de
`projects/<slug>/docs/`. Ao final, `projects/<slug>/output/requisitos_extraidos.md`
terá todas as informações consolidadas.

## Etapa 2.5: Recon de protótipo (se configurado)

=== Fase 3: Recon de protótipo ===

Igual à Etapa 2.5 do `/analyze-test` completo (ver
`../analyze-test/SKILL.md`): se `project.config.json` tem
`prototypeUrl`/`figmaPrototype` preenchido, invocar `/recon-prototipo`.
Fallback gracioso se MCP indisponível, login exigido ou timeout — NUNCA
travar esta skill por causa do recon (rodando headless, é ainda mais
provável que o MCP não esteja disponível — trate como skip normal).

## Etapa 3: Proposta de estrutura de suítes

=== Fase 4: Proposta de estrutura ===

Com base nos requisitos extraídos (e no recon, se houver):

1. Se houver planilha de quebra de atividades: filtrar atividades do tipo
   "Execução de testes". Cada atividade = 1 suíte.
2. Se não houver planilha: criar suítes baseadas nos agrupamentos lógicos
   da documentação.
3. Se houver apenas uma atividade: criar uma suíte única.
4. Títulos das suítes devem ser descritivos, sem prefixos como
   "[Projeto] QA X.X -".

Para cada suíte, decidir (mesmos critérios do CONTRACT.md §6 usado pelo
`/analyze-test` completo):
- **Executor primário** (`playwright`/`api`/`db`/`pentest`)
- **Playbooks Twygo** aplicáveis
- **Org alvo** (`principal`/`secundario`/`trial-<projeto>` etc.)
- **Pré-condições** (estado de ambiente, dados, feature flags, perfil)

**NÃO escrever casos de teste individuais nesta fase** — só a estrutura.

## Etapa 4: Gravar a proposta

=== Fase 5: Gravando proposta ===

Gravar `projects/<slug>/output/estrutura-proposta.md` neste formato exato
(o campo `aprovada` sempre começa `false` — vira `true` quando o QA aprovar
pelo agent-ui):

```markdown
---
aprovada: false
project: <slug>
generated_at: <ISO timestamp>
---

# Proposta de Estrutura — <Nome do Projeto>

## Suíte: <Nome da suíte 1>
- **Executor:** playwright
- **Playbooks:** flipper
- **Org:** principal
- **Pré-condições:**
  - Feature flag `:exemplo` ativa
  - Pelo menos 1 curso pré-existente

## Suíte: <Nome da suíte 2>
...
```

Ao terminar, informar em texto simples (sem pausar esperando resposta):
quantidade de suítes propostas + caminho do arquivo gravado. **Esta skill
TERMINA aqui** — não continua pra escrita de casos (isso é o
`/analyze-test`, disparado separadamente quando a proposta estiver
aprovada).
```

- [ ] **Step 2: Commit**

```bash
git add agent-at/.claude/skills/analyze-test-plan/SKILL.md
git commit -m "agent-at: nova skill analyze-test-plan (fases 1-3 do AT, propoe estrutura e para)"
```

---

## Task 3: Ajustar `/analyze-test` — pular Etapa 3 quando já aprovada + banners de fase

**Files:**
- Modify: `agent-at/.claude/skills/analyze-test/SKILL.md`

- [ ] **Step 1: Adicionar a convenção de banner logo no início do arquivo**

Encontre esta linha (topo do arquivo, logo após o frontmatter):

```markdown
Você é o agente de AT da Twygo. Siga este fluxo ao ser invocado.
```

Substitua por:

```markdown
Você é o agente de AT da Twygo. Siga este fluxo ao ser invocado.

**Convenção de progresso**: sempre que uma etapa abaixo tiver uma linha
`=== Fase N: ... ===`, escreva essa linha EXATA como texto da sua resposta
(sozinha, antes de agir na etapa) — não a omita e não parafraseie. Um
sistema de progresso ao vivo no `agent-ui` lê essas linhas.
```

- [ ] **Step 2: Adicionar banners nas Etapas 1, 2 e 2.5**

Encontre:

```markdown
## Etapa 1: Identificação do projeto

1. Identificar o slug do projeto:
```

Substitua por:

```markdown
## Etapa 1: Identificação do projeto

=== Fase 1: Identificação do projeto ===

1. Identificar o slug do projeto:
```

Encontre:

```markdown
## Etapa 2: Leitura e interpretação dos documentos

Invocar a skill `/read-docs`
```

Substitua por:

```markdown
## Etapa 2: Leitura e interpretação dos documentos

=== Fase 2: Leitura de documentação ===

Invocar a skill `/read-docs`
```

Encontre:

```markdown
## Etapa 2.5: Recon de protótipo (CONTRACT.md v1.1: AUTOMÁTICA)

A partir de `contract_version: 1.1`, esta etapa é
```

Substitua por:

```markdown
## Etapa 2.5: Recon de protótipo (CONTRACT.md v1.1: AUTOMÁTICA)

=== Fase 3: Recon de protótipo ===

A partir de `contract_version: 1.1`, esta etapa é
```

- [ ] **Step 3: Adicionar a checagem de estrutura aprovada + banner na Etapa 3**

Encontre este bloco completo (Etapa 3 inteira, do header até o final da
etapa):

```markdown
## Etapa 3: Definição da estrutura de suítes

Com base nos requisitos extraídos:
```

Substitua por:

```markdown
## Etapa 3: Definição da estrutura de suítes

=== Fase 4: Definição da estrutura ===

**Antes de propor a estrutura**: checar se
`projects/<slug>/output/estrutura-proposta.md` existe E tem
`aprovada: true` no frontmatter. Se sim, **pular todo o resto desta
etapa** — usar a estrutura de suítes descrita nesse arquivo tal como
está (não gerar outra, não perguntar nada) e ir direto pra Etapa 4. Se
não existir, ou existir mas `aprovada: false`/ausente, seguir o fluxo
normal abaixo.

Com base nos requisitos extraídos:
```

Encontre (final da Etapa 3):

```markdown
Apresentar estrutura ao usuário e perguntar se deseja ajustar antes de
prosseguir.
```

Substitua por:

```markdown
Se estiver rodando interativamente (sessão normal do Claude Code, não
headless): apresentar estrutura ao usuário e perguntar se deseja ajustar
antes de prosseguir. Se rodando headless (via `claude -p`, sem humano na
sessão): gravar a estrutura decidida em
`projects/<slug>/output/estrutura-proposta.md` (mesmo formato da skill
`analyze-test-plan`) com `aprovada: false`, informar em texto que a
estrutura foi gravada e PARAR aqui — não prosseguir pra Etapa 4 sem
aprovação.
```

- [ ] **Step 4: Adicionar banners nas Etapas 4 a 8**

Encontre:

```markdown
## Etapa 4: Criação dos casos de teste

Para cada suíte, criar casos de teste
```

Substitua por:

```markdown
## Etapa 4: Criação dos casos de teste

=== Fase 6: Criação dos casos de teste ===

Para cada suíte, criar casos de teste
```

Encontre:

```markdown
## Etapa 5: Geração do MD canônico (fonte de verdade)

Invocar a skill `/generate-md-canonical`
```

Substitua por:

```markdown
## Etapa 5: Geração do MD canônico (fonte de verdade)

=== Fase 7: Geração do MD canônico ===

Invocar a skill `/generate-md-canonical`
```

Encontre:

```markdown
## Etapa 6: Geração dos derivados (paralelo)

Invocar em sequência (não importa ordem entre eles):
```

Substitua por:

```markdown
## Etapa 6: Geração dos derivados (paralelo)

=== Fase 8: Geração de XMind e XML TestLink ===

Invocar em sequência (não importa ordem entre eles):
```

Encontre:

```markdown
## Etapa 7: Validação cruzada

Confirmar que os 3 arquivos batem entre si:
```

Substitua por:

```markdown
## Etapa 7: Validação cruzada

=== Fase 9: Validação cruzada ===

Confirmar que os 3 arquivos batem entre si:
```

Encontre:

```markdown
## Etapa 8: Entrega

Informar ao usuário:
```

Substitua por:

```markdown
## Etapa 8: Entrega

=== Fase 10: Entrega ===

Informar ao usuário:
```

- [ ] **Step 5: Commit**

```bash
git add agent-at/.claude/skills/analyze-test/SKILL.md
git commit -m "agent-at: analyze-test pula Etapa 3 quando ja tem estrutura aprovada + banners de fase pro modo headless"
```

---

## Task 4: Endpoints `/api/at-plan`, `/api/at-approve`, `/api/at-build`

**Files:**
- Modify: `agent-ui/server.mjs:11-19` (import), `agent-ui/server.mjs:779` (novos endpoints antes de `/api/at-generate`)

- [ ] **Step 1: Importar o novo módulo**

Em `agent-ui/server.mjs`, encontre:

```js
import {
  AI_ENGINES,
  codexComplete,
  commandAvailable,
  engineLabel,
  normalizeEngine,
  parseJsonResponse,
  stripMarkdownFence,
} from './ai-engine.mjs';
```

Adicione logo abaixo:

```js
import { injectApproved, runClaudeSkill } from './claude-cli.mjs';
```

- [ ] **Step 2: Adicionar os 3 endpoints**

Em `agent-ui/server.mjs`, encontre (linha 779-781):

```js
    // Gera a AT (test-analysis.md) por IA (B). Input: descrição + .md de contexto (docs/ + output/). Salva DRAFT.
    if (url.pathname === '/api/at-generate' && req.method === 'POST') {
```

Insira ANTES desse bloco:

```js
    // Fases 1-3 do /analyze-test: propõe estrutura de suítes (sem casos ainda) via claude -p headless.
    if (url.pathname === '/api/at-plan') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
      const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
      send({ type: 'start' });
      const r = await runClaudeSkill(`/analyze-test-plan --project ${project}`, { cwd: AAT, send });
      await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at-plan', project, model: r.model || 'claude', in: r.usageIn, out: r.usageOut, usd: r.costUsd });
      let estrutura = '';
      try { estrutura = await readFile(join(AAT, 'projects', project, 'output', 'estrutura-proposta.md'), 'utf8'); } catch {}
      send({ type: 'done', ok: r.ok, estrutura });
      res.end();
      return;
    }

    // Grava a estrutura (possivelmente editada pelo QA) como aprovada. Não dispara nada — só salva.
    if (url.pathname === '/api/at-approve' && req.method === 'POST') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
      const estrutura = String(data.estrutura || '').trim();
      if (!estrutura) return json(res, 400, { error: 'estrutura vazia' });
      const dir = join(AAT, 'projects', project, 'output');
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, 'estrutura-proposta.md'), injectApproved(estrutura));
      return json(res, 200, { ok: true });
    }

    // Fases 5-8 do /analyze-test: usa a estrutura já aprovada, escreve os casos + gera os 3 arquivos.
    if (url.pathname === '/api/at-build') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
      const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
      send({ type: 'start' });
      const r = await runClaudeSkill(`/analyze-test --project ${project}`, { cwd: AAT, send });
      await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at-build', project, model: r.model || 'claude', in: r.usageIn, out: r.usageOut, usd: r.costUsd });
      let files = [];
      try { files = (await readdir(join(AAT, 'projects', project, 'output'))).filter((f) => f === 'test-analysis.md' || /^Analise_Teste_.*\.(xmind|xml)$/.test(f)); } catch {}
      send({ type: 'done', ok: r.ok, files });
      res.end();
      return;
    }

```

- [ ] **Step 3: Verificar sintaxe**

Run: `cd agent-ui && node --check server.mjs`
Expected: sem output (sintaxe OK)

- [ ] **Step 4: Commit**

```bash
git add agent-ui/server.mjs
git commit -m "agent-ui: endpoints /api/at-plan, /api/at-approve, /api/at-build (AT headless via claude -p)"
```

---

## Task 5: `/api/cost` usar o custo real do Claude quando disponível

**Files:**
- Modify: `agent-ui/server.mjs:515-526`

**Por quê:** hoje `/api/cost` sempre recalcula USD a partir de `tokens × ai-prices.json`. Pra eventos do Claude já temos o `total_cost_usd` REAL (via `--output-format stream-json`), que inclui tarifas de cache que a tabela de preço não modela. Sem essa mudança, o custo do AT apareceria errado (provavelmente subestimado, já que `usageIn`/`usageOut` não contam os tokens de cache).

- [ ] **Step 1: Escrever o teste (vai falhar)**

Em `agent-ui/test/claude-cli.test.mjs` (criado no Task 1), encontre a
linha de import no topo:

```js
import { injectApproved, parseStreamJsonLine } from '../claude-cli.mjs';
```

Substitua por:

```js
import { costOf, injectApproved, parseStreamJsonLine } from '../claude-cli.mjs';
```

Adicione ao final do arquivo (esta função é nova, pura, relacionada ao
mesmo módulo):

```js
test('costOf usa o usd armazenado quando presente, senao estima por tabela de preco', () => {
  assert.equal(costOf({ usd: 0.42, in: 100, out: 100 }, { in: 1, out: 1 }), 0.42);
  assert.equal(costOf({ in: 1000000, out: 0 }, { in: 2, out: 0 }), 2);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `cd agent-ui && node --test test/claude-cli.test.mjs`
Expected: falha — `costOf` não existe em `claude-cli.mjs`

- [ ] **Step 3: Adicionar `costOf` em `claude-cli.mjs`**

Em `agent-ui/claude-cli.mjs`, adicione ao final:

```js
// Custo de um evento do ledger: usa o usd real armazenado (Claude, via total_cost_usd) quando presente;
// senão estima por tokens × preço da tabela (fluxo antigo, OpenAI-compatível).
export function costOf(event, price) {
  if (typeof event.usd === 'number') return event.usd;
  return (event.in || 0) / 1e6 * price.in + (event.out || 0) / 1e6 * price.out;
}
```

- [ ] **Step 4: Rodar de novo e confirmar que passa**

Run: `cd agent-ui && node --test test/claude-cli.test.mjs`
Expected: `# fail 0`

- [ ] **Step 5: Usar `costOf` em `/api/cost`**

Em `agent-ui/server.mjs`, encontre:

```js
import { injectApproved, runClaudeSkill } from './claude-cli.mjs';
```

Substitua por:

```js
import { costOf, injectApproved, runClaudeSkill } from './claude-cli.mjs';
```

Encontre:

```js
      const priceOf = (m) => prices[m] || prices._default || { in: 0.15, out: 0.6 };
      let usd = 0, tIn = 0, tOut = 0;
      const enriched = events.map((e) => {
        const p = priceOf(e.model);
        const c = (e.in || 0) / 1e6 * p.in + (e.out || 0) / 1e6 * p.out;
        usd += c; tIn += e.in || 0; tOut += e.out || 0;
        return { ...e, usd: c, brl: fx.rate ? c * fx.rate : null };
      });
```

Substitua por:

```js
      const priceOf = (m) => prices[m] || prices._default || { in: 0.15, out: 0.6 };
      let usd = 0, tIn = 0, tOut = 0;
      const enriched = events.map((e) => {
        const c = costOf(e, priceOf(e.model));
        usd += c; tIn += e.in || 0; tOut += e.out || 0;
        return { ...e, usd: c, brl: fx.rate ? c * fx.rate : null };
      });
```

- [ ] **Step 6: Verificar sintaxe e rodar toda a suíte**

Run: `cd agent-ui && node --check server.mjs && node --test test/*.test.mjs`
Expected: sintaxe OK, `# fail 0`

- [ ] **Step 7: Commit**

```bash
git add agent-ui/claude-cli.mjs agent-ui/test/claude-cli.test.mjs agent-ui/server.mjs
git commit -m "agent-ui: /api/cost usa custo real (total_cost_usd) quando disponivel no ledger"
```

---

## Task 6: UI — painel "Gerar AT completa" em `#/at`

**Files:**
- Modify: `agent-ui/index.html:1504-1510` (painel novo), `agent-ui/index.html` próximo de `$('#at-gen').onclick` (wiring)

- [ ] **Step 1: Adicionar o painel HTML**

Em `agent-ui/index.html`, encontre (dentro de `renderAt()`):

```html
    <div class="db-panel"><h3>Gerar AT por IA <span style="color:var(--faint);font-weight:400;font-size:12px">· 🤖 rascunho no formato canônico</span></h3>
      <textarea id="at-gen-desc" class="db-sel" rows="3" style="width:100%;resize:vertical" placeholder="Descreva a funcionalidade / regras a cobrir. Os .md de docs/ e output/ do projeto entram como contexto automaticamente."></textarea>
      <div class="db-row" style="margin-top:10px"><button class="btn-run" id="at-gen">✨ Gerar AT</button><span id="at-gen-msg" class="form-hint"></span></div>
      <div id="at-gen-out" style="margin-top:12px"></div>
    </div>`;
```

Substitua por (só adiciona o painel novo, mantém tudo que já tinha):

```html
    <div class="db-panel"><h3>Gerar AT por IA <span style="color:var(--faint);font-weight:400;font-size:12px">· 🤖 rascunho no formato canônico</span></h3>
      <textarea id="at-gen-desc" class="db-sel" rows="3" style="width:100%;resize:vertical" placeholder="Descreva a funcionalidade / regras a cobrir. Os .md de docs/ e output/ do projeto entram como contexto automaticamente."></textarea>
      <div class="db-row" style="margin-top:10px"><button class="btn-run" id="at-gen">✨ Gerar AT</button><span id="at-gen-msg" class="form-hint"></span></div>
      <div id="at-gen-out" style="margin-top:12px"></div>
    </div>
    <div class="db-panel"><h3>Gerar AT completa <span style="color:var(--faint);font-weight:400;font-size:12px">· 🧠 rigor total (analyze-test), 2 passos</span></h3>
      <div class="form-hint">Passo 1 lê os docs e propõe a estrutura de suítes (sem casos ainda). Você revisa/edita. Passo 2 escreve os casos, valida anti-patterns e gera os 3 arquivos (test-analysis.md + xmind + xml). Cada passo dispara uma sessão real do Claude Code — tem custo, aparece em Custo.</div>
      <div class="db-row" style="margin-top:10px"><button class="btn-run" id="at-plan-go">1. Propor estrutura</button><span id="at-plan-msg" class="form-hint"></span></div>
      <div id="at-plan-log" class="form-hint" style="white-space:pre-wrap;max-height:160px;overflow:auto;margin-top:8px"></div>
      <div id="at-plan-review" style="display:none;margin-top:12px">
        <textarea id="at-plan-estrutura" class="db-sel" rows="12" style="width:100%;resize:vertical;font-family:monospace"></textarea>
        <div class="db-row" style="margin-top:10px"><button class="btn-run" id="at-build-go">2. Gerar AT completa</button><span id="at-build-msg" class="form-hint"></span></div>
        <div id="at-build-log" class="form-hint" style="white-space:pre-wrap;max-height:160px;overflow:auto;margin-top:8px"></div>
        <div id="at-build-out" style="margin-top:12px"></div>
      </div>
    </div>`;
```

- [ ] **Step 2: Adicionar o wiring JS**

Em `agent-ui/index.html`, encontre:

```js
    $('#at-gen').onclick = async () => {
      const desc = $('#at-gen-desc').value.trim();
      const btn = $('#at-gen'), msg = $('#at-gen-msg'), out = $('#at-gen-out');
      btn.disabled = true; msg.innerHTML = '<span class="spin"></span> gerando AT…'; out.innerHTML = '';
      try {
        const r = await fetch('/api/at-generate?project=' + encodeURIComponent(project), { method:'POST', headers:{'content-type':'application/json'}, body:JSON.stringify({ description: desc }) });
        const dd = await r.json();
        if (!r.ok) { msg.innerHTML = `<b style="color:var(--coral)">${escapeHtml(dd.error||r.statusText)}</b>`; return; }
        msg.innerHTML = `<span style="color:var(--faint)">${dd.usage.in}+${dd.usage.out} tokens · ${escapeHtml(dd.model)}${dd.usedContext&&dd.usedContext.length?` · contexto: ${escapeHtml(dd.usedContext.join(', '))}`:''}</span>`;
        out.innerHTML = `<div class="db-summary"><span style="color:var(--lime)">✓ rascunho salvo</span><span style="color:var(--faint);font-weight:400;font-size:12px">· ${escapeHtml(dd.saved||'')} · revise antes de publicar</span></div><div class="report-box"><div class="md">${renderMd(dd.md||'', null)}</div></div>`;
      } catch (e) { msg.innerHTML = `<b style="color:var(--coral)">${escapeHtml(e.message)}</b>`; }
      finally { btn.disabled = false; }
    };
```

Adicione logo abaixo (função auxiliar compartilhada pelos 2 botões novos +
os handlers deles):

```js
    // Roda /api/at-plan ou /api/at-build (SSE) — mostra fase/log ao vivo, resolve com o payload do "done".
    const runAtSSE = (path, logEl) => new Promise((resolve) => {
      logEl.textContent = '';
      const es = new EventSource(`${path}?project=${encodeURIComponent(project)}`);
      es.onmessage = (ev) => {
        const o = JSON.parse(ev.data);
        if (o.type === 'phase') logEl.textContent += `\n▸ ${o.name}\n`;
        else if (o.type === 'log') logEl.textContent += o.line + '\n';
        logEl.scrollTop = logEl.scrollHeight;
        if (o.type === 'done') { es.close(); resolve(o); }
      };
      es.onerror = () => { es.close(); resolve({ ok: false }); };
    });
    $('#at-plan-go').onclick = async () => {
      const btn = $('#at-plan-go'), msg = $('#at-plan-msg'), log = $('#at-plan-log');
      btn.disabled = true; msg.innerHTML = '<span class="spin"></span> propondo estrutura… (pode levar minutos)';
      const o = await runAtSSE('/api/at-plan', log);
      btn.disabled = false;
      if (!o.ok || !o.estrutura) { msg.innerHTML = `<b style="color:var(--coral)">Não deu pra propor a estrutura — ver log acima.</b>`; return; }
      msg.innerHTML = `<span style="color:var(--lime)">✓ estrutura proposta</span>`;
      $('#at-plan-estrutura').value = o.estrutura;
      $('#at-plan-review').style.display = '';
    };
    $('#at-build-go').onclick = async () => {
      const btn = $('#at-build-go'), msg = $('#at-build-msg'), log = $('#at-build-log'), out = $('#at-build-out');
      btn.disabled = true; msg.innerHTML = '<span class="spin"></span> salvando estrutura aprovada…'; out.innerHTML = '';
      try {
        const ar = await fetch(`/api/at-approve?project=${encodeURIComponent(project)}`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ estrutura: $('#at-plan-estrutura').value }) });
        if (!ar.ok) { const ad = await ar.json(); msg.innerHTML = `<b style="color:var(--coral)">${escapeHtml(ad.error || ar.statusText)}</b>`; btn.disabled = false; return; }
      } catch (e) { msg.innerHTML = `<b style="color:var(--coral)">${escapeHtml(e.message)}</b>`; btn.disabled = false; return; }
      msg.innerHTML = '<span class="spin"></span> gerando casos + arquivos… (pode levar minutos)';
      const o = await runAtSSE('/api/at-build', log);
      btn.disabled = false;
      if (!o.ok) { msg.innerHTML = `<b style="color:var(--coral)">Falhou — ver log acima.</b>`; return; }
      msg.innerHTML = `<span style="color:var(--lime)">✓ AT gerada</span>`;
      out.innerHTML = (o.files || []).length ? `<div class="form-hint">Arquivos: ${o.files.map(escapeHtml).join(', ')}</div>` : '<div class="form-hint">Concluído, mas nenhum arquivo esperado foi encontrado — confira o log.</div>';
    };
```

- [ ] **Step 3: Commit**

```bash
git add agent-ui/index.html
git commit -m "agent-ui: painel 'Gerar AT completa' (2 passos) na tela #/at"
```

---

## Task 7: Verificação manual de ponta a ponta (não automatizável — sessão real do Claude Code)

Isso não dá pra automatizar num teste: envolve rodar uma sessão real do
Claude Code contra documentos reais, com custo real. É o mesmo tipo de
verificação manual já feito o resto desta sessão pro Playwright.

- [ ] **Step 1: Escolher um projeto com docs reais em `agent-at/projects/<slug>/docs/`**

Use um que já tenha (ex.: `recertificacao`, `base-de-conhecimento`) — ver
`agent-at/projects/`.

- [ ] **Step 2: Subir o server e abrir a tela AT**

```bash
cd agent-ui && node server.mjs
```

Abrir `http://localhost:4321/#/at`, selecionar o projeto.

- [ ] **Step 3: Clicar "1. Propor estrutura" e observar**

Esperado: log ao vivo mostrando `▸ Read`, `▸ Glob`, etc. e as linhas
`=== Fase N: ... ===`; ao final, a textarea aparece preenchida com a
proposta de estrutura (suítes + executor + playbooks + pré-condições).

- [ ] **Step 4: Editar a estrutura na textarea (testar que o QA pode ajustar)**

Mudar o nome de uma suíte ou adicionar uma pré-condição.

- [ ] **Step 5: Clicar "2. Gerar AT completa" e observar**

Esperado: log ao vivo bem mais longo (fases 6-10), termina com os 3
arquivos listados. Confirmar em disco:

```bash
ls agent-at/projects/<slug>/output/
```

Esperado: `test-analysis.md`, `Analise_Teste_*.xmind`, `Analise_Teste_*.xml`
todos com timestamp recente.

- [ ] **Step 6: Confirmar que a estrutura editada no Passo 4 foi respeitada**

Abrir o `test-analysis.md` gerado e conferir que o nome de suíte /
pré-condição editada aparece (prova que o gate de revisão realmente
influenciou o resultado, não foi ignorado).

- [ ] **Step 7: Confirmar o custo no ledger**

Abrir `http://localhost:4321/#/custo` — devem aparecer 2 linhas novas
(`gerar-at-plan`, `gerar-at-build`) com modelo `claude-sonnet-5` (ou o que
o CLI reportar) e valores em USD/BRL condizentes (não zerados, não
astronomicamente errados).

- [ ] **Step 8: Rodar `validate_md_canonical.py` no resultado (confirma que o rigor foi mantido)**

```bash
cd agent-at && python scripts/validate_md_canonical.py projects/<slug>/output/test-analysis.md
```

Esperado: sem erros bloqueantes (warnings são aceitáveis e esperados
dependendo do conteúdo).

- [ ] **Step 9: Reportar o resultado**

Se tudo passou: a feature está pronta pra uso real. Se algo falhou,
anotar exatamente onde (qual fase, qual mensagem de erro) antes de
prosseguir — não empurrar pra produção com esse teste manual pendente.
