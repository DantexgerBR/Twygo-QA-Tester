// Fixture: emite um evento de erro explicito mas sai com code 0 — ok deve ficar false mesmo assim.
process.stdout.write(JSON.stringify({ msg: { type: 'error', message: 'falha simulada' } }) + '\n');
