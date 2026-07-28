// Fixture: stub de `codex exec --json` que termina com sucesso (code 0).
const lines = [
  { msg: { type: 'agent_message', message: 'ola mundo' } },
  { msg: { type: 'exec_command_begin', command: ['ls', 'projects'] } },
  { msg: { type: 'task_complete', last_agent_message: 'pronto' } },
];
for (const l of lines) process.stdout.write(JSON.stringify(l) + '\n');
// sai com code 0 (default) — nao chama process.exit() pra nao truncar o stdout em pipes no Windows
