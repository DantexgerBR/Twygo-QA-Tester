// claude-cli.mjs — invoca skills do Claude Code headless (claude -p) e faz parse do stream-json.
// Isolado do server.mjs (mesmo motivo do ai-engine.mjs): lógica pura, testável sem subir servidor.
import { spawn } from 'node:child_process';
import { StringDecoder } from 'node:string_decoder';

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
// `bin`/`args` são só pra teste (stub em vez do binário `claude` real) — produção usa os defaults.
export function runClaudeSkill(prompt, {
  cwd,
  send = () => {},
  timeoutMs = 20 * 60 * 1000,
  bin = 'claude',
  args = ['-p', prompt, '--output-format', 'stream-json', '--permission-mode', 'bypassPermissions', '--verbose'],
} = {}) {
  const safeSend = (ev) => { try { send(ev); } catch { /* falha do caller nao pode derrubar o parser */ } };
  return new Promise((resolve) => {
    const child = spawn(bin, args, { cwd });
    const decoder = new StringDecoder('utf8');
    let buf = '';
    let settled = false;
    let result = { ok: false, costUsd: 0, usageIn: 0, usageOut: 0, model: '' };
    const finish = (final) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(final);
    };
    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
      try { child.unref(); } catch {} // se o processo (ou um filho dele) ignorar o sinal, nao prende quem chamou
      finish({ ...result, ok: false, timedOut: true });
    }, timeoutMs);
    const onLine = (line) => {
      if (!line.trim()) return;
      const ev = parseStreamJsonLine(line);
      if (!ev) return;
      if (ev.type === 'result') { result = { ok: ev.ok, costUsd: ev.costUsd, usageIn: ev.usageIn, usageOut: ev.usageOut, model: result.model }; return; }
      if (ev.model) result.model = ev.model;
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
      finish({ ...result, ok: result.ok && code === 0 }); // um result is_error:false nao vale se o processo saiu != 0
    });
    child.on('error', (e) => {
      safeSend({ type: 'log', line: 'erro ao iniciar claude: ' + e });
      finish({ ...result, ok: false });
    });
  });
}

// Marca a estrutura proposta como aprovada (frontmatter `aprovada: true`) — idempotente.
export function injectApproved(mdText) {
  if (/^aprovada:\s*true\s*$/m.test(mdText)) return mdText;
  if (/^aprovada:\s*false\s*$/m.test(mdText)) return mdText.replace(/^aprovada:\s*false\s*$/m, 'aprovada: true');
  if (/^---\s*$/m.test(mdText)) return mdText.replace(/^---\s*$/m, '---\naprovada: true');
  return `---\naprovada: true\n---\n\n${mdText}`;
}
