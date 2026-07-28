// Fixture: imprime um result "is_error:false" mas sai com code != 0 (crash apos o result).
// Regressao do issue #1: ok final deve ser false mesmo com is_error:false no result.
process.stdout.write(JSON.stringify({ type: 'result', is_error: false, total_cost_usd: 0.02, usage: { input_tokens: 1, output_tokens: 1 } }) + '\n');
process.exitCode = 1;
