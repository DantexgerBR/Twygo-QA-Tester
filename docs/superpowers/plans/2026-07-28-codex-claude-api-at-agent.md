# Trocar motor headless de AT (Claude CLI → Codex CLI + API Anthropic) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o `runClaudeSkill` (`spawn('claude', ['-p', ...], {'--permission-mode': 'bypassPermissions'})`, que viola os Consumer ToS da Anthropic quando automatizado sem API key) pelos 2 motores headless ToS-seguros descritos em `docs/superpowers/specs/2026-07-28-codex-claude-api-at-agent-design.md`: **Codex CLI** (`codex exec`, padrão) e **API oficial da Anthropic** (fallback manual, via `ANTHROPIC_API_KEY`). Os endpoints `/api/at-plan`/`/api/at-build` continuam com o mesmo contrato SSE — só troca o motor por baixo.

**Architecture:** Novo módulo `agent-ui/agent-at-engine.mjs` expõe `runAtAgent(promptKey, opts)` com a mesma assinatura de retorno do antigo `runClaudeSkill` (`{ ok, costUsd, usageIn, usageOut, model, timedOut }`), despachando pra `runCodexAgent` (spawn `codex exec --json`, parse JSONL) ou `runClaudeApiAgent` (loop de tool-use real contra a Messages API via `fetch`, 3 tools client-side — `read`/`write`/`bash` — escopadas ao `cwd` do projeto). Os prompts (novo `agent-ui/agent-at-prompts.mjs`) são adaptados das skills `analyze-test-plan`/`analyze-test` só na "casca" (sem sintaxe `/comando`, sem recon de protótipo via MCP) — o conteúdo real (convenções, schema do MD canônico, validação) **não é duplicado**: o agente tem tools de leitura/bash e lê os `.claude/skills/*.md` originais direto do disco (`cwd = agent-at/`).

**Tech Stack:** Node.js stdlib (`child_process`, `node:fs/promises`, `fetch` global) — zero dependência nova, mesmo padrão de `ai-engine.mjs`/`claude-cli.mjs` já existentes.

---

## Contexto que quem for implementar precisa saber

- Repo do pipeline: `D:\Estudo\Programação\cursor\twygo-work\Twygo-QA-Tester\` (não confundir com o docs-driver em `D:\Trabalho\Twygo\Projetos\Dev\QA Tester\`, onde só ficam `PLAN.md`/`CLAUDE.md`). Todos os caminhos de arquivo abaixo são relativos a esse repo do pipeline.
- `agent-ui/server.mjs` é um único arquivo grande, zero framework (ponytail deliberado, ver comentário na linha 3). Seguir o padrão existente, não introduzir camadas novas.
- `agent-ui/agent-at-engine.mjs` (novo) espelha o estilo de `agent-ui/claude-cli.mjs` (módulo isolado, lógica pura + I/O, testável sem subir servidor).
- Testes: `node --test test/*.test.mjs` (rodar de dentro de `agent-ui/`). Sem framework de teste — só `node:test`/`node:assert/strict`, seguir os arquivos existentes (`test/claude-cli.test.mjs`, `test/ai-engine.test.mjs`) como referência de estilo.
- `agent-at/` (raiz do agente de AT, `cwd` de ambos os motores) contém `.claude/skills/{read-docs,twygo-qa-conventions,generate-md-canonical,generate-xmind,generate-xml-testlink}/SKILL.md` e `CONTRACT.md` — são a fonte de verdade das convenções; os prompts novos **referenciam** esses arquivos em vez de duplicar o conteúdo.
- `state/settings.json` já tem `{ model, engine }` (motor "IA" pra geração simples). O novo `atEngine` é um campo **separado** no mesmo arquivo — não reaproveitar `engine` (semânticas diferentes: um é completion de 1 tiro, outro é agente autônomo com bash/arquivo).
- `ai-prices.json` já tem a linha `claude-sonnet-5: { in: 3.00, out: 15.00 }` — não precisa mexer nela.

## Scope Check

Este plano cobre um único subsistema coeso (motor headless de AT) com 3 pontos de integração (server.mjs, claude-cli.mjs, index.html) — não há subsistemas independentes pra separar em planos distintos.

---

## File Structure

| Arquivo | Ação | Responsabilidade |
|---|---|---|
| `agent-ui/agent-at-prompts.mjs` | criar | Prompts (system+user) dos 2 motores, adaptados das 2 skills — puro, sem I/O. |
| `agent-ui/agent-at-engine.mjs` | criar | `runAtAgent` (dispatcher) + `runCodexAgent` + `runClaudeApiAgent` + helpers de config/engine. |
| `agent-ui/test/agent-at-prompts.test.mjs` | criar | Testa os prompts (conteúdo esperado, sem sintaxe de skill). |
| `agent-ui/test/agent-at-engine.test.mjs` | criar | Testa parser Codex, os 2 motores (via stub/fetch mock), guarda de path. |
| `agent-ui/test/fixtures/codex-cli-stub-{ok,badexit,error,hang}.mjs` | criar | Stubs do binário `codex` pros testes de `runCodexAgent`. |
| `agent-ui/server.mjs` | modificar | Import novo, `atEngine()`/`anthropicKey()`/`atConfigured()`, endpoint `/api/at-engine`, troca as chamadas em `/api/at-plan`/`/api/at-build`. |
| `agent-ui/claude-cli.mjs` | modificar | Remove `parseStreamJsonLine`/`runClaudeSkill` (sem uso); mantém `injectApproved`/`costOf`. |
| `agent-ui/test/claude-cli.test.mjs` | modificar | Remove os testes do que saiu; mantém os de `injectApproved`/`costOf`. |
| `agent-ui/test/fixtures/claude-cli-stub-{ok,badexit,hang}.mjs` | deletar | Só eram usados pelos testes de `runClaudeSkill`, removidos acima. |
| `agent-ui/index.html` | modificar | Seletor de motor (Codex CLI/API do Claude) na tela `#/at`. |

---

## Task 1: Prompts dos 2 motores (`agent-at-prompts.mjs`)

**Files:**
- Create: `agent-ui/agent-at-prompts.mjs`
- Test: `agent-ui/test/agent-at-prompts.test.mjs`

- [ ] **Step 1: Escrever o teste (falha por módulo inexistente)**

```javascript
// agent-ui/test/agent-at-prompts.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';

import { buildBuildPrompt, buildPlanPrompt, buildPrompt } from '../agent-at-prompts.mjs';

test('buildPlanPrompt referencia o projeto e o formato exato de estrutura-proposta.md', () => {
  const { system, user } = buildPlanPrompt('recertificacao');
  assert.match(user, /Projeto: recertificacao\./);
  assert.match(user, /aprovada: false/);
  assert.match(user, /NÃO escreva casos de teste/);
  assert.doesNotMatch(system, /\/analyze-test/);
  assert.match(system, /MCP playwright NÃO está disponível/);
});

test('buildBuildPrompt referencia a estrutura já aprovada e a validação obrigatória', () => {
  const { system, user } = buildBuildPrompt('recertificacao');
  assert.match(user, /aprovada: true/);
  assert.match(user, /md_canonical_parser\.py/);
  assert.match(user, /validate_md_canonical\.py/);
  assert.match(system, /generate-md-canonical\/SKILL\.md/);
});

test('buildPrompt despacha por promptKey (default = plan)', () => {
  assert.deepEqual(buildPrompt('plan', 'x'), buildPlanPrompt('x'));
  assert.deepEqual(buildPrompt('build', 'x'), buildBuildPrompt('x'));
  assert.deepEqual(buildPrompt('outro', 'x'), buildPlanPrompt('x'));
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run (dentro de `agent-ui/`): `node --test test/agent-at-prompts.test.mjs`
Expected: FAIL — `Cannot find module '../agent-at-prompts.mjs'`

- [ ] **Step 3: Criar `agent-ui/agent-at-prompts.mjs`**

```javascript
// agent-at-prompts.mjs — prompts (system+user) dos 2 motores headless de AT (codex-cli/claude-api).
// Adaptado de agent-at/.claude/skills/{analyze-test-plan,analyze-test}/SKILL.md: sem sintaxe de
// invocação de skill do Claude Code (é prosa, não "/comando --args") e sem recon de protótipo via
// MCP (nenhum dos 2 motores novos tem esse MCP — cai sempre no fallback SKIP+warning que a skill já
// documenta). O resto do conteúdo (convenções, schema do MD canônico, validação, xmind/xml) NÃO é
// duplicado aqui — o agente tem tools de leitura/bash e lê os .claude/skills/*.md originais (cwd é
// agent-at/), então uma única fonte de verdade continua valendo pro Claude Code interativo e pros
// 2 motores headless.

const INTRO = [
  'Você é o agente de Análise de Teste (AT) da Twygo, rodando headless (sem humano na sessão).',
  'cwd = agent-at/. Antes de agir, leia os arquivos de convenção abaixo (relativos ao cwd) e siga-os à risca — não resuma de memória, leia o conteúdo real:',
  '- .claude/skills/read-docs/SKILL.md',
  '- .claude/skills/twygo-qa-conventions/SKILL.md',
  'Recon de protótipo via MCP playwright NÃO está disponível neste motor. Se projects/<slug>/project.config.json tiver prototypeUrl/figmaPrototype preenchido, registre em texto um aviso ("recon de protótipo pulado — MCP indisponível neste motor") e continue sem ele. Nunca trave por causa disso — é o mesmo fallback gracioso que a skill original documenta pra MCP ausente.',
].join('\n');

export function buildPlanPrompt(project) {
  const system = INTRO;
  const user = [
    `Projeto: ${project}.`,
    '',
    'Faça a FASE 1 (proposta de estrutura) do fluxo de Análise de Teste — NÃO escreva casos de teste ainda:',
    `1. Confirme que projects/${project}/docs/ tem arquivos. Se estiver vazia, PARE e informe isso — não invente estrutura a partir do nada.`,
    `2. Leia e interprete todos os arquivos de projects/${project}/docs/ conforme .claude/skills/read-docs/SKILL.md, gravando projects/${project}/output/requisitos_extraidos.md com tudo consolidado.`,
    '3. Com base nos requisitos extraídos, proponha a estrutura de suítes: se houver planilha de quebra de atividades, filtre as do tipo "Execução de testes" (1 atividade = 1 suíte); senão, agrupe pela lógica da documentação; se houver só 1 atividade, crie 1 suíte única. Títulos descritivos, sem prefixos tipo "[Projeto] QA X.X -". Para cada suíte decida: executor primário (playwright/api/db/pentest), playbooks Twygo aplicáveis, org alvo (principal/secundario/trial-<projeto>), pré-condições (dados/flags/perfil).',
    `4. Grave projects/${project}/output/estrutura-proposta.md EXATAMENTE neste formato:`,
    '',
    '```markdown',
    '---',
    'aprovada: false',
    `project: ${project}`,
    'generated_at: <ISO timestamp>',
    'docs_lidos: [<arquivo1>, <arquivo2>, ...]',
    'docs_pulados: [<arquivo3 — motivo>, ...]',
    '---',
    '',
    '# Proposta de Estrutura — <Nome do Projeto>',
    '',
    '## Suíte: <Nome da suíte 1>',
    '- **Executor:** playwright',
    '- **Playbooks:** <lista ou "nenhum">',
    '- **Org:** principal',
    '- **Pré-condições:**',
    '  - <pré-condição em prosa>',
    '```',
    '',
    'O campo `aprovada` deve ficar SOZINHO na linha, exatamente `aprovada: false` (sem comentários ou texto extra) — um parser downstream depende de um match exato dessa linha pra aprovar a proposta depois. `docs_pulados` fica `[]` se nenhum doc foi pulado.',
    '5. Ao terminar, informe em texto (sem chamar mais nenhuma ferramenta depois): quantidade de suítes propostas + caminho do arquivo gravado. PARE aqui — a escrita de casos é uma etapa separada.',
  ].join('\n');
  return { system, user };
}

export function buildBuildPrompt(project) {
  const system = [
    INTRO,
    'Leia também estes arquivos antes de gerar os artefatos finais — é onde estão o schema e as regras exatas (não invente formato):',
    '- .claude/skills/generate-md-canonical/SKILL.md',
    '- .claude/skills/generate-xmind/SKILL.md',
    '- .claude/skills/generate-xml-testlink/SKILL.md',
    '- CONTRACT.md (schema do MD canônico, §6 executores/playbooks)',
  ].join('\n');
  const user = [
    `Projeto: ${project}.`,
    '',
    `1. Leia projects/${project}/output/estrutura-proposta.md — já foi aprovada pelo QA (frontmatter \`aprovada: true\`). Use essa estrutura de suítes TAL COMO ESTÁ, não gere outra.`,
    `2. Consulte projects/${project}/output/requisitos_extraidos.md pra textos literais e regras de negócio (se não existir, rode a leitura de projects/${project}/docs/ de novo conforme .claude/skills/read-docs/SKILL.md).`,
    '3. Para cada suíte, crie os casos de teste seguindo .claude/skills/twygo-qa-conventions/SKILL.md: NÃO se limite à coluna "descrição" — cubra caminho feliz E cenários de falha/validação/tentativas de forçar erro. Toda AÇÃO usa verbo canônico ("Clicar no botão \'X\'", "Preencher o campo \'X\' com \'Y\'"). Todo RESULTADO ESPERADO é assertável (texto literal entre aspas + elemento alvo).',
    `4. Gere projects/${project}/output/test-analysis.md seguindo .claude/skills/generate-md-canonical/SKILL.md e o schema do CONTRACT.md. Este é o artefato mais importante — xmind e xml são derivados dele.`,
    '5. Valide OBRIGATORIAMENTE antes de prosseguir (rode via bash):',
    '   ```bash',
    `   python scripts/md_canonical_parser.py projects/${project}/output/test-analysis.md`,
    `   python scripts/validate_md_canonical.py projects/${project}/output/test-analysis.md`,
    '   ```',
    '   Se o parser falhar (erro de schema) ou o validador reportar ERROS (não apenas warnings), corrija o MD e repita antes de continuar. Não prossiga com erros pendentes.',
    `6. Gere os derivados a partir do MD canônico (nunca hardcoded/manual): projects/${project}/output/Analise_Teste_<NomeLegivel>.xmind (.claude/skills/generate-xmind/SKILL.md) e projects/${project}/output/Analise_Teste_<NomeLegivel>.xml (.claude/skills/generate-xml-testlink/SKILL.md).`,
    '7. Validação cruzada: confirme que a contagem de casos de teste bate entre test-analysis.md (`## TC`) e o .xml (`<testcase `).',
    '8. Ao terminar, informe: caminhos dos 3 arquivos gerados, total de suítes e casos de teste, distribuição de casos por suíte.',
  ].join('\n');
  return { system, user };
}

export function buildPrompt(promptKey, project) {
  return promptKey === 'build' ? buildBuildPrompt(project) : buildPlanPrompt(project);
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test test/agent-at-prompts.test.mjs`
Expected: PASS (3 testes)

- [ ] **Step 5: Commit**

```bash
git add agent-ui/agent-at-prompts.mjs agent-ui/test/agent-at-prompts.test.mjs
git commit -m "feat(agent-ui): prompts dos motores headless de AT (codex-cli/claude-api)"
```

---

## Task 2: Parser de eventos do Codex CLI + config de motor (`agent-at-engine.mjs`, parte 1)

**Files:**
- Create: `agent-ui/agent-at-engine.mjs` (início)
- Test: `agent-ui/test/agent-at-engine.test.mjs` (início)

- [ ] **Step 1: Escrever os testes do parser + config (falha por módulo inexistente)**

```javascript
// agent-ui/test/agent-at-engine.test.mjs
import assert from 'node:assert/strict';
import test from 'node:test';

import {
  AT_ENGINES,
  atEngineConfigStatus,
  atEngineLabel,
  normalizeAtEngine,
  parseCodexJsonLine,
} from '../agent-at-engine.mjs';

test('normalizeAtEngine so aceita claude-api explicito, resto cai pra codex-cli', () => {
  assert.equal(normalizeAtEngine('claude-api'), AT_ENGINES.CLAUDE_API);
  assert.equal(normalizeAtEngine('codex-cli'), AT_ENGINES.CODEX_CLI);
  assert.equal(normalizeAtEngine(''), AT_ENGINES.CODEX_CLI);
  assert.equal(normalizeAtEngine('surpresa'), AT_ENGINES.CODEX_CLI);
});

test('atEngineLabel', () => {
  assert.equal(atEngineLabel('codex-cli'), 'Codex CLI');
  assert.equal(atEngineLabel('claude-api'), 'API do Claude');
});

test('atEngineConfigStatus: codex-cli depende do binario, claude-api depende da chave', () => {
  assert.deepEqual(atEngineConfigStatus({ engine: 'codex-cli', codexCliAvailable: true }), { configured: true, needsKey: false });
  assert.deepEqual(atEngineConfigStatus({ engine: 'codex-cli', codexCliAvailable: false }), { configured: false, needsKey: false });
  assert.deepEqual(atEngineConfigStatus({ engine: 'claude-api', hasKey: true }), { configured: true, needsKey: true });
  assert.deepEqual(atEngineConfigStatus({ engine: 'claude-api', hasKey: false }), { configured: false, needsKey: true });
});

test('parseCodexJsonLine reconhece agent_message como log', () => {
  assert.deepEqual(parseCodexJsonLine(JSON.stringify({ msg: { type: 'agent_message', message: 'oi' } })), { type: 'log', line: 'oi' });
});

test('parseCodexJsonLine reconhece exec_command_begin como fase', () => {
  assert.deepEqual(parseCodexJsonLine(JSON.stringify({ msg: { type: 'exec_command_begin', command: ['ls', '-la'] } })), { type: 'phase', name: 'ls -la' });
});

test('parseCodexJsonLine reconhece task_complete como resultado ok', () => {
  assert.deepEqual(parseCodexJsonLine(JSON.stringify({ msg: { type: 'task_complete', usage: { input_tokens: 5, output_tokens: 7 } } })), { type: 'result', ok: true, usageIn: 5, usageOut: 7 });
});

test('parseCodexJsonLine reconhece error como resultado falho', () => {
  assert.deepEqual(parseCodexJsonLine(JSON.stringify({ msg: { type: 'error', message: 'falha' } })), { type: 'result', ok: false, usageIn: 0, usageOut: 0 });
});

test('parseCodexJsonLine ignora ruido/JSON invalido', () => {
  assert.equal(parseCodexJsonLine('nao e json'), null);
  assert.equal(parseCodexJsonLine(JSON.stringify({ msg: { type: 'reasoning' } })), null);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test test/agent-at-engine.test.mjs`
Expected: FAIL — `Cannot find module '../agent-at-engine.mjs'`

- [ ] **Step 3: Criar `agent-ui/agent-at-engine.mjs` (início — engines + parser)**

```javascript
// agent-at-engine.mjs — motor headless de AT (Análise de Teste): codex-cli (padrão) ou claude-api
// (ANTHROPIC_API_KEY). Substitui o antigo runClaudeSkill (claude-cli.mjs) — ver
// docs/superpowers/specs/2026-07-28-codex-claude-api-at-agent-design.md (motivo: os Consumer ToS da
// Anthropic pra Claude Pro/sessão pessoal proíbem automação sem API key; os 2 motores aqui não têm
// esse problema — Codex CLI é oficialmente suportado pra automação, e a Messages API cai na exceção
// explícita do ToS).
import { spawn } from 'node:child_process';
import { StringDecoder } from 'node:string_decoder';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

import { buildCodexPrompt } from './ai-engine.mjs';
import { buildPrompt } from './agent-at-prompts.mjs';

export const AT_ENGINES = { CODEX_CLI: 'codex-cli', CLAUDE_API: 'claude-api' };

export function normalizeAtEngine(value) {
  return String(value || '').trim().toLowerCase() === AT_ENGINES.CLAUDE_API ? AT_ENGINES.CLAUDE_API : AT_ENGINES.CODEX_CLI;
}

export function atEngineLabel(engine) {
  return normalizeAtEngine(engine) === AT_ENGINES.CLAUDE_API ? 'API do Claude' : 'Codex CLI';
}

// Pura (sem I/O) — usada tanto pelo GET /api/at-engine (status dos 2 motores) quanto em testes.
export function atEngineConfigStatus({ engine, codexCliAvailable = false, hasKey = false } = {}) {
  if (normalizeAtEngine(engine) === AT_ENGINES.CLAUDE_API) return { configured: !!hasKey, needsKey: true };
  return { configured: !!codexCliAvailable, needsKey: false };
}

// --- Motor codex-cli: `codex exec --json` via stdin, JSONL no stdout. ---

// ponytail: schema do --json do Codex CLI não pôde ser confirmado nesta sessão (sem o binário
// disponível — ver riscos no design doc). Cobre os tipos de evento conhecidos (agent_message,
// exec_command_begin, task_complete, error); se o Codex real emitir formato diferente, o fallback
// pelo exit code do processo (em runCodexAgent) ainda decide ok/not-ok corretamente. Ajustar aqui
// quando confirmado numa máquina com o binário `codex` real.
export function parseCodexJsonLine(line) {
  let o; try { o = JSON.parse(line); } catch { return null; }
  const msg = o.msg || o;
  const type = msg.type;
  if (type === 'agent_message' && msg.message) return { type: 'log', line: msg.message };
  if (type === 'exec_command_begin') return { type: 'phase', name: Array.isArray(msg.command) ? msg.command.join(' ') : String(msg.command || 'comando') };
  if (type === 'task_complete') return { type: 'result', ok: true, usageIn: msg.usage?.input_tokens || 0, usageOut: msg.usage?.output_tokens || 0 };
  if (type === 'error') return { type: 'result', ok: false, usageIn: 0, usageOut: 0 };
  return null;
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test test/agent-at-engine.test.mjs`
Expected: PASS (7 testes) — os 2 imports não usados ainda (`runCodexAgent` etc.) entram nas próximas tasks, este arquivo já é válido standalone.

- [ ] **Step 5: Commit**

```bash
git add agent-ui/agent-at-engine.mjs agent-ui/test/agent-at-engine.test.mjs
git commit -m "feat(agent-ui): parser de eventos + status de config dos motores de AT"
```

---

## Task 3: Motor `codex-cli` (`runCodexAgent`)

**Files:**
- Modify: `agent-ui/agent-at-engine.mjs`
- Create: `agent-ui/test/fixtures/codex-cli-stub-ok.mjs`, `codex-cli-stub-badexit.mjs`, `codex-cli-stub-error.mjs`, `codex-cli-stub-hang.mjs`
- Modify: `agent-ui/test/agent-at-engine.test.mjs`

- [ ] **Step 1: Criar os 4 fixtures (stubs do binário `codex`)**

```javascript
// agent-ui/test/fixtures/codex-cli-stub-ok.mjs
// Fixture: stub de `codex exec --json` que termina com sucesso (code 0).
const lines = [
  { msg: { type: 'agent_message', message: 'ola mundo' } },
  { msg: { type: 'exec_command_begin', command: ['ls', 'projects'] } },
  { msg: { type: 'task_complete', last_agent_message: 'pronto' } },
];
for (const l of lines) process.stdout.write(JSON.stringify(l) + '\n');
// sai com code 0 (default) — nao chama process.exit() pra nao truncar o stdout em pipes no Windows
```

```javascript
// agent-ui/test/fixtures/codex-cli-stub-badexit.mjs
// Fixture: imprime um task_complete mas sai com code != 0 (crash apos o evento).
process.stdout.write(JSON.stringify({ msg: { type: 'task_complete', last_agent_message: 'pronto' } }) + '\n');
process.exitCode = 1;
```

```javascript
// agent-ui/test/fixtures/codex-cli-stub-error.mjs
// Fixture: emite um evento de erro explicito mas sai com code 0 — ok deve ficar false mesmo assim.
process.stdout.write(JSON.stringify({ msg: { type: 'error', message: 'falha simulada' } }) + '\n');
```

```javascript
// agent-ui/test/fixtures/codex-cli-stub-hang.mjs
// Fixture: ignora SIGTERM (simula um processo que nao morre limpo do kill()).
// Tem uma rede de seguranca (auto-exit em 1.5s) pra nao deixar um processo orfao rodando pra sempre.
process.on('SIGTERM', () => {});
setTimeout(() => process.exit(0), 1500); // mantem o processo vivo (e o event loop) ate o auto-exit
```

- [ ] **Step 2: Adicionar os testes de `runCodexAgent` (falha por função inexistente)**

Adicionar ao final de `agent-ui/test/agent-at-engine.test.mjs`:

```javascript
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCodexAgent } from '../agent-at-engine.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const fixture = (name) => path.join(here, 'fixtures', name);

test('runCodexAgent resolve ok:true e repassa fases/logs via send()', async () => {
  const events = [];
  const result = await runCodexAgent('plan', {
    project: 'x', cwd: here, send: (ev) => events.push(ev),
    codexBin: process.execPath, args: [fixture('codex-cli-stub-ok.mjs')], timeoutMs: 5000,
  });
  assert.equal(result.ok, true);
  assert.equal(result.usageIn, 0);
  assert.deepEqual(events, [
    { type: 'log', line: 'ola mundo' },
    { type: 'phase', name: 'ls projects' },
  ]);
});

test('runCodexAgent marca ok:false quando o processo sai com code != 0 mesmo com task_complete', async () => {
  const result = await runCodexAgent('plan', {
    project: 'x', cwd: here, send: () => {},
    codexBin: process.execPath, args: [fixture('codex-cli-stub-badexit.mjs')], timeoutMs: 5000,
  });
  assert.equal(result.ok, false);
});

test('runCodexAgent marca ok:false quando um evento de erro explicito aparece mesmo com exit code 0', async () => {
  const result = await runCodexAgent('plan', {
    project: 'x', cwd: here, send: () => {},
    codexBin: process.execPath, args: [fixture('codex-cli-stub-error.mjs')], timeoutMs: 5000,
  });
  assert.equal(result.ok, false);
});

test('runCodexAgent resolve rapido e marca timedOut quando o processo nunca termina', async () => {
  const start = Date.now();
  const result = await runCodexAgent('plan', {
    project: 'x', cwd: here, send: () => {},
    codexBin: process.execPath, args: [fixture('codex-cli-stub-hang.mjs')], timeoutMs: 300,
  });
  const elapsed = Date.now() - start;
  assert.equal(result.ok, false);
  assert.equal(result.timedOut, true);
  assert.ok(elapsed < 2000, `esperava resolver perto do timeoutMs, levou ${elapsed}ms`);
});
```

- [ ] **Step 3: Rodar e confirmar que falha**

Run: `node --test test/agent-at-engine.test.mjs`
Expected: FAIL — `runCodexAgent is not a function` (ou import undefined)

- [ ] **Step 4: Adicionar `runCodexAgent` ao final de `agent-ui/agent-at-engine.mjs`**

```javascript
export function runCodexAgent(promptKey, {
  project,
  cwd,
  send = () => {},
  timeoutMs = 20 * 60 * 1000,
  codexBin = process.env.CODEX_CLI_BIN || 'codex',
  args = ['exec', '--sandbox', 'workspace-write', '--json', '--cwd', cwd, '-'],
} = {}) {
  const { system, user } = buildPrompt(promptKey, project);
  const prompt = buildCodexPrompt({ system, user });
  const safeSend = (ev) => { try { send(ev); } catch { /* falha do caller nao pode derrubar o parser */ } };
  return new Promise((settle) => {
    const child = spawn(codexBin, args, { cwd });
    const decoder = new StringDecoder('utf8');
    let buf = '';
    let settled = false;
    // ok:null = nenhum evento de resultado reconhecido ainda -> decide pelo exit code no 'close'.
    let result = { ok: null, usageIn: 0, usageOut: 0 };
    const finish = (final) => { if (settled) return; settled = true; clearTimeout(timer); settle(final); };
    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
      try { child.unref(); } catch {} // se o processo (ou um filho dele) ignorar o sinal, nao prende quem chamou
      finish({ ok: false, usageIn: result.usageIn, usageOut: result.usageOut, model: '', timedOut: true });
    }, timeoutMs);
    const onLine = (line) => {
      if (!line.trim()) return;
      const ev = parseCodexJsonLine(line);
      if (!ev) return;
      if (ev.type === 'result') { result = { ok: ev.ok, usageIn: ev.usageIn, usageOut: ev.usageOut }; return; }
      safeSend(ev.type === 'phase' ? { type: 'phase', name: ev.name } : { type: 'log', line: ev.line });
    };
    child.stdout.on('data', (chunk) => {
      buf += decoder.write(chunk); // StringDecoder guarda sequencias UTF-8 parciais entre chunks (acentos/emoji nos logs)
      let i;
      while ((i = buf.indexOf('\n')) >= 0) { onLine(buf.slice(0, i)); buf = buf.slice(i + 1); }
    });
    child.stderr.on('data', (d) => safeSend({ type: 'log', line: '[stderr] ' + d.toString() }));
    child.on('close', (code) => {
      buf += decoder.end();
      if (buf.trim()) onLine(buf);
      const ok = result.ok === null ? code === 0 : (result.ok && code === 0);
      finish({ ok, usageIn: result.usageIn, usageOut: result.usageOut, model: '', timedOut: false });
    });
    child.on('error', (e) => {
      safeSend({ type: 'log', line: 'erro ao iniciar codex: ' + e });
      finish({ ok: false, usageIn: 0, usageOut: 0, model: '', timedOut: false });
    });
    child.stdin.end(prompt);
  });
}
```

- [ ] **Step 5: Rodar e confirmar que passa**

Run: `node --test test/agent-at-engine.test.mjs`
Expected: PASS (11 testes no total)

- [ ] **Step 6: Commit**

```bash
git add agent-ui/agent-at-engine.mjs agent-ui/test/agent-at-engine.test.mjs agent-ui/test/fixtures/codex-cli-stub-*.mjs
git commit -m "feat(agent-ui): motor codex-cli pro agente de AT (runCodexAgent)"
```

---

## Task 4: Motor `claude-api` (`runClaudeApiAgent`)

**Files:**
- Modify: `agent-ui/agent-at-engine.mjs`
- Modify: `agent-ui/test/agent-at-engine.test.mjs`

- [ ] **Step 1: Adicionar os testes (falha por função inexistente)**

Adicionar ao final de `agent-ui/test/agent-at-engine.test.mjs`:

```javascript
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolveInCwd, runClaudeApiAgent } from '../agent-at-engine.mjs';

test('resolveInCwd bloqueia caminho fora do diretorio do projeto', () => {
  assert.throws(() => resolveInCwd('/tmp/projeto', '../../etc/passwd'));
  assert.throws(() => resolveInCwd('/tmp/projeto', '/etc/passwd'));
  assert.doesNotThrow(() => resolveInCwd('/tmp/projeto', 'output/test-analysis.md'));
});

test('runClaudeApiAgent sem apiKey resolve ok:false sem chamar fetch', async () => {
  const originalFetch = globalThis.fetch;
  let called = false;
  globalThis.fetch = async () => { called = true; throw new Error('nao deveria chamar'); };
  try {
    const result = await runClaudeApiAgent('plan', { project: 'x', cwd: here, send: () => {} });
    assert.equal(result.ok, false);
    assert.equal(called, false);
  } finally { globalThis.fetch = originalFetch; }
});

test('runClaudeApiAgent roda um tool_use de write e depois termina em end_turn', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'at-claude-api-'));
  const originalFetch = globalThis.fetch;
  let call = 0;
  globalThis.fetch = async () => {
    call++;
    if (call === 1) {
      return { ok: true, json: async () => ({
        stop_reason: 'tool_use',
        usage: { input_tokens: 10, output_tokens: 5 },
        content: [{ type: 'tool_use', id: 't1', name: 'write', input: { path: 'output/nota.md', content: 'ok' } }],
      }) };
    }
    return { ok: true, json: async () => ({ stop_reason: 'end_turn', usage: { input_tokens: 3, output_tokens: 2 }, content: [{ type: 'text', text: 'pronto' }] }) };
  };
  try {
    const events = [];
    const result = await runClaudeApiAgent('plan', { project: 'x', cwd: dir, apiKey: 'sk-ant-teste', send: (ev) => events.push(ev) });
    assert.equal(result.ok, true);
    assert.equal(result.usageIn, 13);
    assert.equal(result.usageOut, 7);
    assert.equal(await readFile(path.join(dir, 'output', 'nota.md'), 'utf8'), 'ok');
    assert.ok(events.some((e) => e.type === 'phase' && e.name === 'write'));
  } finally { globalThis.fetch = originalFetch; await rm(dir, { recursive: true, force: true }); }
});

test('runClaudeApiAgent devolve ok:false quando a API responde erro HTTP', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: false, status: 401, json: async () => ({ error: { message: 'chave invalida' } }) });
  try {
    const events = [];
    const result = await runClaudeApiAgent('plan', { project: 'x', cwd: here, apiKey: 'sk-ant-teste', send: (ev) => events.push(ev) });
    assert.equal(result.ok, false);
    assert.ok(events.some((e) => e.line && e.line.includes('chave invalida')));
  } finally { globalThis.fetch = originalFetch; }
});
```

`readFile` já precisa estar importado no topo do teste (`import { readFile } from 'node:fs/promises';`) — adicionar junto dos outros imports do arquivo.

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test test/agent-at-engine.test.mjs`
Expected: FAIL — `resolveInCwd`/`runClaudeApiAgent` não exportados

- [ ] **Step 3: Adicionar o motor `claude-api` ao final de `agent-ui/agent-at-engine.mjs`**

```javascript
// --- Motor claude-api: Messages API da Anthropic com tool-use real (read/write/bash), sem CLI nenhum. ---

export function resolveInCwd(cwd, p) {
  const full = resolve(cwd, String(p || ''));
  const rel = relative(cwd, full);
  if (rel.startsWith('..') || isAbsolute(rel)) throw new Error(`caminho fora do projeto: ${p}`);
  return full;
}

const ANTHROPIC_VERSION = '2023-06-01';
const CLAUDE_API_TOOLS = [
  { name: 'read', description: 'Lê o conteúdo de um arquivo de texto dentro do diretório do projeto.', input_schema: { type: 'object', properties: { path: { type: 'string', description: 'caminho relativo ao diretório do projeto' } }, required: ['path'] } },
  { name: 'write', description: 'Escreve (cria ou sobrescreve) um arquivo de texto dentro do diretório do projeto. Cria diretórios intermediários se preciso.', input_schema: { type: 'object', properties: { path: { type: 'string' }, content: { type: 'string' } }, required: ['path', 'content'] } },
  { name: 'bash', description: 'Roda um comando de shell dentro do diretório do projeto (ex.: os scripts Python de validação).', input_schema: { type: 'object', properties: { command: { type: 'string' } }, required: ['command'] } },
];

// bash sem allowlist de comando na v1 — mesmo nível de confiança que `codex exec --sandbox
// workspace-write` já tem (ver design doc, riscos). Guarda de path (nunca sair de `cwd`) é a única
// barreira aqui; allowlist de comando fica pra depois se algum dia isso rodar fora da máquina do Dante.
function runBash(command, cwd, timeoutMs) {
  return new Promise((settle) => {
    const child = spawn(command, [], { cwd, shell: true, timeout: timeoutMs });
    let out = '';
    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (out += d));
    child.on('close', (code) => settle(`[exit ${code}]\n${out}`.slice(0, 20000)));
    child.on('error', (e) => settle(`erro ao rodar comando: ${e}`));
  });
}

async function runClaudeApiTool(name, input, cwd, timeoutMs) {
  try {
    if (name === 'read') return await readFile(resolveInCwd(cwd, input.path), 'utf8');
    if (name === 'write') {
      const full = resolveInCwd(cwd, input.path);
      await mkdir(dirname(full), { recursive: true });
      await writeFile(full, String(input.content ?? ''));
      return 'ok';
    }
    if (name === 'bash') return await runBash(String(input.command || ''), cwd, timeoutMs);
    return `tool desconhecida: ${name}`;
  } catch (e) { return `erro: ${e.message}`; }
}

async function claudeApiTurn({ system, messages, model, apiKey }) {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-api-key': apiKey, 'anthropic-version': ANTHROPIC_VERSION },
    body: JSON.stringify({ model, max_tokens: 8192, system, messages, tools: CLAUDE_API_TOOLS }),
  });
  const body = await r.json().catch(() => ({}));
  if (!r.ok) return { ok: false, err: body?.error?.message || `HTTP ${r.status}` };
  return { ok: true, body };
}

async function runClaudeApiAgentLoop(promptKey, { project, cwd, send = () => {}, apiKey, model = 'claude-sonnet-5', maxIterations = 30, timeoutMs = 20 * 60 * 1000 } = {}) {
  if (!apiKey) { send({ type: 'log', line: 'ANTHROPIC_API_KEY não configurada.' }); return { ok: false, usageIn: 0, usageOut: 0, model }; }
  const { system, user } = buildPrompt(promptKey, project);
  const messages = [{ role: 'user', content: user }];
  let usageIn = 0, usageOut = 0;
  for (let i = 0; i < maxIterations; i++) {
    const turn = await claudeApiTurn({ system, messages, model, apiKey });
    if (!turn.ok) { send({ type: 'log', line: 'erro API Anthropic: ' + turn.err }); return { ok: false, usageIn, usageOut, model }; }
    const { body } = turn;
    usageIn += body.usage?.input_tokens || 0;
    usageOut += body.usage?.output_tokens || 0;
    const content = body.content || [];
    for (const b of content) if (b.type === 'text' && b.text) send({ type: 'log', line: b.text });
    const toolUses = content.filter((b) => b.type === 'tool_use');
    messages.push({ role: 'assistant', content });
    if (body.stop_reason !== 'tool_use' || !toolUses.length) return { ok: true, usageIn, usageOut, model };
    const toolResults = [];
    for (const tu of toolUses) {
      try { send({ type: 'phase', name: tu.name }); } catch {}
      const output = await runClaudeApiTool(tu.name, tu.input || {}, cwd, timeoutMs);
      toolResults.push({ type: 'tool_result', tool_use_id: tu.id, content: String(output) });
    }
    messages.push({ role: 'user', content: toolResults });
  }
  send({ type: 'log', line: 'parou: limite de iterações do agente atingido' });
  return { ok: false, usageIn, usageOut, model };
}

// Wrapper com timeout total — não cancela fetch/bash em andamento no timeout (loop simples o
// suficiente pra v1; a chamada some do ponto de vista de quem chamou, mas não tem cross-request
// cancellation). Mesma limitação documentada no design doc pro motor codex-cli via kill() do processo.
export function runClaudeApiAgent(promptKey, opts = {}) {
  const timeoutMs = opts.timeoutMs || 20 * 60 * 1000;
  const model = opts.model || 'claude-sonnet-5';
  return new Promise((settle) => {
    let settled = false;
    const done = (r) => { if (settled) return; settled = true; settle(r); };
    const timer = setTimeout(() => done({ ok: false, usageIn: 0, usageOut: 0, model, timedOut: true }), timeoutMs);
    runClaudeApiAgentLoop(promptKey, opts)
      .then((r) => { clearTimeout(timer); done({ ...r, timedOut: false }); })
      .catch((e) => {
        clearTimeout(timer);
        try { (opts.send || (() => {}))({ type: 'log', line: 'erro inesperado: ' + e }); } catch {}
        done({ ok: false, usageIn: 0, usageOut: 0, model, timedOut: false });
      });
  });
}
```

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test test/agent-at-engine.test.mjs`
Expected: PASS (15 testes no total)

- [ ] **Step 5: Commit**

```bash
git add agent-ui/agent-at-engine.mjs agent-ui/test/agent-at-engine.test.mjs
git commit -m "feat(agent-ui): motor claude-api pro agente de AT (runClaudeApiAgent)"
```

---

## Task 5: Dispatcher `runAtAgent`

**Files:**
- Modify: `agent-ui/agent-at-engine.mjs`
- Modify: `agent-ui/test/agent-at-engine.test.mjs`

- [ ] **Step 1: Adicionar o teste (falha por função inexistente)**

Adicionar ao final de `agent-ui/test/agent-at-engine.test.mjs`:

```javascript
import { runAtAgent } from '../agent-at-engine.mjs';

test('runAtAgent despacha pro motor certo por opts.engine', async () => {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = async () => ({ ok: true, json: async () => ({ stop_reason: 'end_turn', usage: { input_tokens: 1, output_tokens: 1 }, content: [] }) });
  try {
    const viaApi = await runAtAgent('plan', { engine: 'claude-api', project: 'x', cwd: here, apiKey: 'sk-ant-teste' });
    assert.equal(viaApi.ok, true);
  } finally { globalThis.fetch = originalFetch; }
  const viaCodex = await runAtAgent('plan', {
    engine: 'codex-cli', project: 'x', cwd: here, codexBin: process.execPath, args: [fixture('codex-cli-stub-ok.mjs')], timeoutMs: 5000,
  });
  assert.equal(viaCodex.ok, true);
});
```

- [ ] **Step 2: Rodar e confirmar que falha**

Run: `node --test test/agent-at-engine.test.mjs`
Expected: FAIL — `runAtAgent is not a function`

- [ ] **Step 3: Adicionar `runAtAgent` (logo após `atEngineConfigStatus`, antes da seção codex-cli) em `agent-ui/agent-at-engine.mjs`**

```javascript
// Ponto de entrada único — mesmo formato de retorno do antigo runClaudeSkill: { ok, costUsd, usageIn, usageOut, model, timedOut }.
export function runAtAgent(promptKey, opts = {}) {
  return normalizeAtEngine(opts.engine) === AT_ENGINES.CLAUDE_API ? runClaudeApiAgent(promptKey, opts) : runCodexAgent(promptKey, opts);
}
```

Nota: como `runAtAgent` referencia `runClaudeApiAgent`/`runCodexAgent` (definidas mais abaixo no arquivo), e todas são `function` declarations (hoisted) ou `export function` (também hoisted), a ordem de declaração no arquivo não importa em tempo de execução — só a ordem de leitura humana. Colocar logo após `atEngineConfigStatus` deixa o dispatcher perto da configuração, antes dos dois motores concretos.

- [ ] **Step 4: Rodar e confirmar que passa**

Run: `node --test test/agent-at-engine.test.mjs`
Expected: PASS (16 testes no total)

- [ ] **Step 5: Commit**

```bash
git add agent-ui/agent-at-engine.mjs agent-ui/test/agent-at-engine.test.mjs
git commit -m "feat(agent-ui): runAtAgent — dispatcher unico pros 2 motores de AT"
```

---

## Task 6: Ligar `server.mjs` ao novo motor + endpoint `/api/at-engine`

**Files:**
- Modify: `agent-ui/server.mjs`

- [ ] **Step 1: Trocar o import (linha 20) e adicionar o novo**

Old (`agent-ui/server.mjs:20`):
```javascript
import { costOf, injectApproved, runClaudeSkill } from './claude-cli.mjs';
```

New:
```javascript
import { costOf, injectApproved } from './claude-cli.mjs';
import {
  AT_ENGINES,
  atEngineConfigStatus,
  atEngineLabel,
  normalizeAtEngine,
  runAtAgent,
} from './agent-at-engine.mjs';
```

- [ ] **Step 2: Adicionar `atEngine()`/`anthropicKey()`/`atConfigured()` logo após `aiConfigured()`**

Local: `agent-ui/server.mjs`, logo depois do fechamento de `async function aiConfigured() { ... }` (linha ~166, antes do comentário `// Chave da IA (Codex) —...` que introduz `codexKey()`).

```javascript
// Motor do agente de AT (Análise de Teste): 'codex-cli' (padrão, sem chave) ou 'claude-api'
// (ANTHROPIC_API_KEY, fallback manual). Separado do seletor "Motor de IA" (aiEngine/aiModel) — ali é
// completion de 1 tiro; aqui é agente autônomo com bash/arquivo (capacidade diferente, não misturar).
async function atEngine() { return normalizeAtEngine(process.env.AT_ENGINE || (await readSettings()).atEngine || AT_ENGINES.CODEX_CLI); }
// Chave da API oficial da Anthropic — cai na exceção do ToS Consumer que proíbe automação sem API key.
// Só env (sem fallback de arquivo — não há uso hoje fora deste motor).
async function anthropicKey() { return process.env.ANTHROPIC_API_KEY || ''; }
async function atConfigured(engine) {
  if (engine === AT_ENGINES.CLAUDE_API) return !!(await anthropicKey());
  return await commandAvailable(process.env.CODEX_CLI_BIN || 'codex');
}
```

- [ ] **Step 3: Atualizar o comentário ponytail desatualizado (linha ~552)**

Old:
```javascript
      // ponytail: claude-* está no ai-prices.json só pra precificar o ledger do runClaudeSkill (AT headless) — não é modelo escolhível pro engine OpenAI/Codex.
```

New:
```javascript
      // ponytail: claude-* está no ai-prices.json só pra precificar o ledger do motor claude-api do agente de AT — não é modelo escolhível pro engine OpenAI/Codex.
```

- [ ] **Step 4: Adicionar o endpoint `/api/at-engine` logo após o bloco `/api/ai-model` (fecha na linha ~561), antes de `/api/cost`**

```javascript
    // Motor do agente de AT (Codex CLI vs API do Claude). GET → estado dos 2; POST {engine} → grava em state/settings.json.atEngine.
    if (url.pathname === '/api/at-engine') {
      if (req.method === 'POST') {
        let data; try { data = JSON.parse((await readBody(req)) || '{}'); } catch { return json(res, 400, { error: 'json inválido' }); }
        const dir = join(__dirname, 'state'); await mkdir(dir, { recursive: true });
        const s = await readSettings(); s.atEngine = normalizeAtEngine(data.engine);
        await writeFile(join(dir, 'settings.json'), JSON.stringify(s, null, 2));
        return json(res, 200, { ok: true, engine: await atEngine() });
      }
      const engine = await atEngine();
      const codexCliAvailable = await commandAvailable(process.env.CODEX_CLI_BIN || 'codex');
      const hasKey = !!(await anthropicKey());
      const engines = [AT_ENGINES.CODEX_CLI, AT_ENGINES.CLAUDE_API].map((id) => ({
        id, label: atEngineLabel(id), ...atEngineConfigStatus({ engine: id, codexCliAvailable, hasKey }),
      }));
      return json(res, 200, { engine, engines, envForced: !!process.env.AT_ENGINE });
    }
```

- [ ] **Step 5: Trocar a chamada dentro de `/api/at-plan`**

Old (`agent-ui/server.mjs`, dentro do handler `/api/at-plan`):
```javascript
    if (url.pathname === '/api/at-plan') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      if (atRunning.has(project)) return json(res, 409, { error: 'já tem uma geração de AT em andamento pra este projeto' });
      atRunning.add(project);
      try {
        res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
        const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
        send({ type: 'start' });
        const r = await runClaudeSkill(`/analyze-test-plan --project ${project}`, { cwd: AAT, send });
        // nunca lança daqui pra cima — headers SSE já foram enviados, um throw aqui vira unhandled rejection
        try { await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at-plan', project, model: r.model || 'claude', in: r.usageIn, out: r.usageOut, usd: r.costUsd }); }
        catch (e) { console.error('appendUsage falhou (gerar-at-plan):', e); }
        let estrutura = '';
        try { estrutura = await readFile(join(AAT, 'projects', project, 'output', 'estrutura-proposta.md'), 'utf8'); } catch {}
        send({ type: 'done', ok: r.ok, timedOut: r.timedOut, estrutura });
        res.end();
      } finally {
        atRunning.delete(project);
      }
      return;
    }
```

New:
```javascript
    if (url.pathname === '/api/at-plan') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const engine = await atEngine();
      if (!(await atConfigured(engine))) return json(res, 400, { error: `motor de AT (${atEngineLabel(engine)}) não configurado — veja Conexão/AT.` });
      if (atRunning.has(project)) return json(res, 409, { error: 'já tem uma geração de AT em andamento pra este projeto' });
      atRunning.add(project);
      try {
        res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
        const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
        send({ type: 'start' });
        const r = await runAtAgent('plan', { project, engine, cwd: AAT, send, apiKey: await anthropicKey() });
        // nunca lança daqui pra cima — headers SSE já foram enviados, um throw aqui vira unhandled rejection
        try { await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at-plan', project, model: r.model || engine, in: r.usageIn, out: r.usageOut, usd: r.costUsd }); }
        catch (e) { console.error('appendUsage falhou (gerar-at-plan):', e); }
        let estrutura = '';
        try { estrutura = await readFile(join(AAT, 'projects', project, 'output', 'estrutura-proposta.md'), 'utf8'); } catch {}
        send({ type: 'done', ok: r.ok, timedOut: r.timedOut, estrutura });
        res.end();
      } finally {
        atRunning.delete(project);
      }
      return;
    }
```

- [ ] **Step 6: Trocar a chamada dentro de `/api/at-build`**

Old:
```javascript
    if (url.pathname === '/api/at-build') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      if (atRunning.has(project)) return json(res, 409, { error: 'já tem uma geração de AT em andamento pra este projeto' });
      atRunning.add(project); // add() logo após has(), sem await no meio — trava atômica antes do check de aprovação
      try {
        // Guarda-custo: só dispara o /analyze-test (caro) se a estrutura já foi aprovada via /api/at-approve.
        let estruturaAtual = '';
        try { estruturaAtual = await readFile(join(AAT, 'projects', project, 'output', 'estrutura-proposta.md'), 'utf8'); } catch {}
        if (!/^aprovada:\s*true\s*$/m.test(estruturaAtual)) return json(res, 400, { error: 'nenhuma estrutura aprovada pra este projeto ainda — rode /api/at-plan e aprove primeiro' });
        res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
        const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
        send({ type: 'start' });
        const r = await runClaudeSkill(`/analyze-test --project ${project}`, { cwd: AAT, send });
        // nunca lança daqui pra cima — headers SSE já foram enviados, um throw aqui vira unhandled rejection
        try { await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at-build', project, model: r.model || 'claude', in: r.usageIn, out: r.usageOut, usd: r.costUsd }); }
        catch (e) { console.error('appendUsage falhou (gerar-at-build):', e); }
        let files = [];
        try { files = (await readdir(join(AAT, 'projects', project, 'output'))).filter((f) => f === 'test-analysis.md' || /^Analise_Teste_.*\.(xmind|xml)$/.test(f)); } catch {}
        send({ type: 'done', ok: r.ok, timedOut: r.timedOut, files });
        res.end();
      } finally {
        atRunning.delete(project);
      }
      return;
    }
```

New:
```javascript
    if (url.pathname === '/api/at-build') {
      const project = url.searchParams.get('project');
      if (!safeSlug(project)) return json(res, 400, { error: 'project inválido' });
      const engine = await atEngine();
      if (!(await atConfigured(engine))) return json(res, 400, { error: `motor de AT (${atEngineLabel(engine)}) não configurado — veja Conexão/AT.` });
      if (atRunning.has(project)) return json(res, 409, { error: 'já tem uma geração de AT em andamento pra este projeto' });
      atRunning.add(project); // add() logo após has(), sem await no meio — trava atômica antes do check de aprovação
      try {
        // Guarda-custo: só dispara a geração (cara) se a estrutura já foi aprovada via /api/at-approve.
        let estruturaAtual = '';
        try { estruturaAtual = await readFile(join(AAT, 'projects', project, 'output', 'estrutura-proposta.md'), 'utf8'); } catch {}
        if (!/^aprovada:\s*true\s*$/m.test(estruturaAtual)) return json(res, 400, { error: 'nenhuma estrutura aprovada pra este projeto ainda — rode /api/at-plan e aprove primeiro' });
        res.writeHead(200, { 'content-type': 'text/event-stream; charset=utf-8', 'cache-control': 'no-cache', connection: 'keep-alive', 'x-accel-buffering': 'no' });
        const send = (o) => res.write('data: ' + JSON.stringify(o) + '\n\n');
        send({ type: 'start' });
        const r = await runAtAgent('build', { project, engine, cwd: AAT, send, apiKey: await anthropicKey() });
        // nunca lança daqui pra cima — headers SSE já foram enviados, um throw aqui vira unhandled rejection
        try { await appendUsage({ ts: new Date().toISOString(), action: 'gerar-at-build', project, model: r.model || engine, in: r.usageIn, out: r.usageOut, usd: r.costUsd }); }
        catch (e) { console.error('appendUsage falhou (gerar-at-build):', e); }
        let files = [];
        try { files = (await readdir(join(AAT, 'projects', project, 'output'))).filter((f) => f === 'test-analysis.md' || /^Analise_Teste_.*\.(xmind|xml)$/.test(f)); } catch {}
        send({ type: 'done', ok: r.ok, timedOut: r.timedOut, files });
        res.end();
      } finally {
        atRunning.delete(project);
      }
      return;
    }
```

- [ ] **Step 7: Verificar que o servidor sobe sem erro de sintaxe/import**

Run (dentro de `agent-ui/`): `node --check server.mjs`
Expected: sem output (exit code 0) — confirma que o arquivo parseia; para um smoke test real, `node server.mjs` e checar que loga a porta, depois `Ctrl+C`.

- [ ] **Step 8: Commit**

```bash
git add agent-ui/server.mjs
git commit -m "feat(agent-ui): liga at-plan/at-build ao runAtAgent (codex-cli/claude-api) e adiciona /api/at-engine"
```

---

## Task 7: Remover `runClaudeSkill`/`parseStreamJsonLine` de `claude-cli.mjs`

**Files:**
- Modify: `agent-ui/claude-cli.mjs`
- Modify: `agent-ui/test/claude-cli.test.mjs`
- Delete: `agent-ui/test/fixtures/claude-cli-stub-ok.mjs`, `claude-cli-stub-badexit.mjs`, `claude-cli-stub-hang.mjs`

- [ ] **Step 1: Reescrever `agent-ui/claude-cli.mjs` (mantém só `injectApproved`/`costOf`)**

```javascript
// claude-cli.mjs — helpers usados pelo fluxo de AT: aprovação da estrutura proposta e custo do ledger.
// O motor headless (antes runClaudeSkill/`claude -p`) foi substituído por agent-at-engine.mjs
// (codex-cli/claude-api) — ver docs/superpowers/specs/2026-07-28-codex-claude-api-at-agent-design.md.

// Marca a estrutura proposta como aprovada (frontmatter `aprovada: true`) — idempotente.
export function injectApproved(mdText) {
  if (/^aprovada:\s*true\s*$/m.test(mdText)) return mdText;
  if (/^aprovada:\s*false\s*$/m.test(mdText)) return mdText.replace(/^aprovada:\s*false\s*$/m, 'aprovada: true');
  if (/^---\s*$/m.test(mdText)) return mdText.replace(/^---\s*$/m, '---\naprovada: true');
  return `---\naprovada: true\n---\n\n${mdText}`;
}

// Custo de um evento do ledger: usa o usd real armazenado (Claude, via total_cost_usd) quando presente;
// senão estima por tokens × preço da tabela (fluxo antigo, OpenAI-compatível).
export function costOf(event, price) {
  if (typeof event.usd === 'number') return event.usd;
  return (event.in || 0) / 1e6 * price.in + (event.out || 0) / 1e6 * price.out;
}
```

- [ ] **Step 2: Reescrever `agent-ui/test/claude-cli.test.mjs` (mantém só os testes de `injectApproved`/`costOf`)**

```javascript
import assert from 'node:assert/strict';
import test from 'node:test';

import { costOf, injectApproved } from '../claude-cli.mjs';

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

test('costOf usa o usd armazenado quando presente, senao estima por tabela de preco', () => {
  assert.equal(costOf({ usd: 0.42, in: 100, out: 100 }, { in: 1, out: 1 }), 0.42);
  assert.equal(costOf({ in: 1000000, out: 0 }, { in: 2, out: 0 }), 2);
});

test('costOf respeita usd: 0 (run gratis) em vez de cair pro fallback de tabela de preco', () => {
  assert.equal(costOf({ usd: 0, in: 1000000, out: 1000000 }, { in: 2, out: 2 }), 0);
});
```

- [ ] **Step 3: Remover os fixtures que só serviam pro `runClaudeSkill`**

```bash
rm agent-ui/test/fixtures/claude-cli-stub-ok.mjs agent-ui/test/fixtures/claude-cli-stub-badexit.mjs agent-ui/test/fixtures/claude-cli-stub-hang.mjs
```

- [ ] **Step 4: Rodar toda a suíte e confirmar que passa**

Run (dentro de `agent-ui/`): `npm test`
Expected: PASS em todos os arquivos (`ai-engine.test.mjs`, `agent-at-prompts.test.mjs`, `agent-at-engine.test.mjs`, `claude-cli.test.mjs`)

- [ ] **Step 5: Commit**

```bash
git add agent-ui/claude-cli.mjs agent-ui/test/claude-cli.test.mjs
git rm agent-ui/test/fixtures/claude-cli-stub-ok.mjs agent-ui/test/fixtures/claude-cli-stub-badexit.mjs agent-ui/test/fixtures/claude-cli-stub-hang.mjs
git commit -m "refactor(agent-ui): remove runClaudeSkill/parseStreamJsonLine (substituidos por agent-at-engine)"
```

---

## Task 8: Seletor de motor na UI (`#/at`)

**Files:**
- Modify: `agent-ui/index.html`

- [ ] **Step 1: Buscar o status do motor junto com `/api/at` em `renderAt()`**

Old (`agent-ui/index.html`, dentro de `renderAt()`):
```javascript
  try {
    const d = await api('/api/at?project=' + encodeURIComponent(project));
```

New:
```javascript
  try {
    const [d, eng] = await Promise.all([
      api('/api/at?project=' + encodeURIComponent(project)),
      api('/api/at-engine').catch(() => ({ engine: 'codex-cli', engines: [] })),
    ]);
```

- [ ] **Step 2: Adicionar o seletor no painel "Gerar AT completa"**

Old:
```html
    <div class="db-panel"><h3>Gerar AT completa <span style="color:var(--faint);font-weight:400;font-size:12px">· 🧠 rigor total (analyze-test), 2 passos</span></h3>
      <div class="form-hint">Passo 1 lê os docs e propõe a estrutura de suítes (sem casos ainda). Você revisa/edita. Passo 2 escreve os casos, valida anti-patterns e gera os 3 arquivos (test-analysis.md + xmind + xml). Cada passo dispara uma sessão real do Claude Code — tem custo, aparece em Custo.</div>
      <div class="db-row" style="margin-top:10px"><button class="btn-run" id="at-plan-go">1. Propor estrutura</button><span id="at-plan-msg" class="form-hint"></span></div>
```

New:
```html
    <div class="db-panel"><h3>Gerar AT completa <span style="color:var(--faint);font-weight:400;font-size:12px">· 🧠 rigor total (analyze-test), 2 passos</span></h3>
      <div class="form-hint">Passo 1 lê os docs e propõe a estrutura de suítes (sem casos ainda). Você revisa/edita. Passo 2 escreve os casos, valida anti-patterns e gera os 3 arquivos (test-analysis.md + xmind + xml). Cada passo dispara o motor de IA abaixo — tem custo, aparece em Custo.</div>
      <div class="db-row" style="margin:10px 0;gap:10px;align-items:center">
        <label class="form-hint" style="margin:0">Motor:</label>
        <select id="at-engine" class="db-sel">${(eng.engines || []).map(e => `<option value="${escapeHtml(e.id)}"${e.id === eng.engine ? ' selected' : ''}>${escapeHtml(e.label)}${e.configured ? '' : ' · não configurado'}</option>`).join('')}</select>
        <span id="at-engine-msg" class="form-hint"></span>
      </div>
      <div class="db-row" style="margin-top:10px"><button class="btn-run" id="at-plan-go">1. Propor estrutura</button><span id="at-plan-msg" class="form-hint"></span></div>
```

- [ ] **Step 3: Wire do `onchange` do seletor**

Adicionar logo após `$('#at-gen').onclick = async () => { ... };` (antes do comentário `// Roda /api/at-plan ou /api/at-build (SSE) ...`):

```javascript
    const atEngSel = $('#at-engine');
    if (atEngSel) atEngSel.onchange = async () => {
      const m = $('#at-engine-msg');
      m.textContent = 'salvando…';
      try {
        const r = await api('/api/at-engine', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ engine: atEngSel.value }) });
        m.innerHTML = `<b style="color:var(--lime)">✓ ${escapeHtml(r.engine)}</b>`;
      } catch (e) { m.innerHTML = `<b style="color:var(--coral)">${escapeHtml(e.message)}</b>`; }
    };
```

- [ ] **Step 4: Smoke test manual**

Run: `cd agent-ui && node server.mjs`, abrir `http://localhost:4321/#/at` com um projeto selecionado (precisa ter pelo menos 1 slug em `projects/`).
Expected: painel "Gerar AT completa" mostra o seletor "Motor:" com "Codex CLI" (e "API do Claude · não configurado" se `ANTHROPIC_API_KEY` não estiver setada) — trocar a seleção salva sem erro (mensagem "✓ codex-cli"/"✓ claude-api").

- [ ] **Step 5: Commit**

```bash
git add agent-ui/index.html
git commit -m "feat(agent-ui): seletor de motor (Codex CLI/API do Claude) na tela de AT"
```

---

## Self-Review (feito ao escrever este plano)

**Cobertura do spec:**
- ✅ Remoção do `runClaudeSkill`/ClaudeCode-headless sem toggle — Task 7 (removido de vez, não atrás de flag).
- ✅ Etapa 2.5 (recon MCP) não portada, fallback SKIP+warning — prompts (Task 1) instruem isso explicitamente.
- ✅ Fluxo de UI (plan → aprovar → build) inalterado — Task 6 só troca a chamada interna, mantém SSE/gate de aprovação.
- ✅ Fallback pra `claude-api` só manual (seletor) — Task 8, sem retry automático entre motores.
- ✅ Fallback configurável mesmo sem chave — `atEngineConfigStatus`/`/api/at-engine` (Tasks 2 e 6) mostram "não configurado".
- ✅ Módulo `agent-at-engine.mjs` com assinatura espelhando `runClaudeSkill` — Tasks 2-5.
- ✅ Motor `codex-cli` via `codex exec --json` — Task 3.
- ✅ Motor `claude-api` via Messages API + 3 tools (read/write/bash) escopadas a `cwd` — Task 4.
- ✅ Endpoint `/api/at-engine` espelhando `/api/ai-model` — Task 6.
- ✅ UI: seletor com badge "não configurado" — Task 8.
- ✅ Remoção do import em `server.mjs`, `claude-cli.mjs` mantém `injectApproved`/`costOf` — Tasks 6-7.
- ❌ Fora de escopo (confirmado no design doc, não implementar): fallback automático entre motores, allowlist de comando pro `bash`, tocar `twygo-qa-ui`, portar recon MCP.

**Placeholder scan:** nenhum "TBD"/"implementar depois" — todo step tem código completo. As únicas incertezas explícitas (schema real do `--json` do Codex) estão marcadas com comentário `ponytail:` no próprio código, como o design doc pede, com fallback que não quebra (exit code decide).

**Consistência de tipos:** `runAtAgent`/`runCodexAgent`/`runClaudeApiAgent` sempre devolvem `{ ok, usageIn, usageOut, model, timedOut }` (mais `costUsd` opcional, omitido quando desconhecido — de propósito, pra `costOf()` cair no fallback de tabela em vez de gravar `usd: 0`). `atEngineConfigStatus`/`atEngineLabel`/`normalizeAtEngine` usados de forma consistente entre `agent-at-engine.mjs` e `server.mjs`.

---

## Execution Handoff

Plan complete and saved to `docs/superpowers/plans/2026-07-28-codex-claude-api-at-agent.md`. Two execution options:

1. **Subagent-Driven (recommended)** — dispatch a fresh subagent per task, review between tasks, fast iteration.
2. **Inline Execution** — execute tasks in this session using executing-plans, batch execution with checkpoints.

Which approach?
