// Fixture: stub de `claude -p ... --output-format stream-json` que termina com sucesso (code 0).
// Usado por claude-cli.test.mjs no lugar do binario real `claude`.
const lines = [
  { type: 'assistant', message: { model: 'claude-sonnet-5', content: [{ type: 'tool_use', id: 'toolu_1', name: 'Read', input: { file_path: 'x.md' } }] } },
  { type: 'assistant', message: { model: 'claude-sonnet-5', content: [{ type: 'text', text: 'ola mundo' }] } },
  { type: 'result', is_error: false, total_cost_usd: 0.05, usage: { input_tokens: 10, output_tokens: 20 } },
];
for (const l of lines) process.stdout.write(JSON.stringify(l) + '\n');
// sai com code 0 (default) — nao chama process.exit() pra nao truncar o stdout em pipes no Windows
