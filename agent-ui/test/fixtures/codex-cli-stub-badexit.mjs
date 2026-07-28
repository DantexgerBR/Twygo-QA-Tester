// Fixture: imprime um task_complete mas sai com code != 0 (crash apos o evento).
process.stdout.write(JSON.stringify({ msg: { type: 'task_complete', last_agent_message: 'pronto' } }) + '\n');
process.exitCode = 1;
