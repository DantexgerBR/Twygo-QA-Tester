#!/usr/bin/env node
// Hook PreToolUse — bloqueia `git commit`/`git push` quando o working
// directory está `behind > 0` do upstream.
//
// Lê tool_input do stdin (JSON), inspeciona o `command` do Bash, detecta
// `git commit`/`git push`, roda `git fetch` + `git rev-list --left-right
// --count HEAD...@{u}`. Se behind > 0, exit 2 com mensagem em stderr
// (Claude vê e o usuário também).
//
// Bypass: comandos com `--no-verify`, `--force`, `-f`, `--amend` passam
// direto (usuário sabe o que está fazendo).
//
// Skill associada: pull-antes-de-commit-push (v1.0.0).

const { execSync } = require('node:child_process');

function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => (input += c));
  process.stdin.on('end', () => {
    try {
      const parsed = JSON.parse(input);
      const cmd = parsed?.tool_input?.command ?? '';
      if (!shouldGate(cmd)) return process.exit(0);

      const result = gitCheck();
      if (result.ok) return process.exit(0);

      process.stderr.write(formatBlockMessage(result));
      return process.exit(2);
    } catch (err) {
      // Falha do hook não deve bloquear o usuário — abrir caminho.
      process.stderr.write(
        `[pre-git-sync] aviso: hook falhou (${err.message}). Prosseguindo sem checagem.\n`,
      );
      return process.exit(0);
    }
  });
}

/**
 * Detecta `git commit` ou `git push` na linha de comando, excluindo
 * subcomandos com bypass intencional.
 */
function shouldGate(cmd) {
  if (!/\bgit\s+(commit|push)\b/.test(cmd)) return false;
  if (/--no-verify\b/.test(cmd)) return false;
  if (/--amend\b/.test(cmd)) return false;
  if (/--force\b/.test(cmd) || /(?:^|\s)-f(?:\s|$)/.test(cmd)) return false;
  return true;
}

/**
 * Roda fetch + count. Retorna { ok: boolean, ahead, behind, reason? }.
 * `ok: true` se sync (behind === 0) OU se não há upstream configurado.
 */
function gitCheck() {
  try {
    execSync('git rev-parse --abbrev-ref --symbolic-full-name @{u}', {
      stdio: 'pipe',
    });
  } catch {
    return { ok: true, reason: 'sem upstream tracking — sem o que sincronizar' };
  }

  try {
    execSync('git fetch --quiet', { stdio: 'pipe', timeout: 15_000 });
  } catch {
    // Falha de rede não bloqueia — só não conseguimos garantir sync.
    return { ok: true, reason: 'fetch falhou (offline?), prosseguindo' };
  }

  const counts = execSync('git rev-list --left-right --count HEAD...@{u}', {
    encoding: 'utf8',
    stdio: 'pipe',
  }).trim();
  const [ahead, behind] = counts.split(/\s+/).map((n) => parseInt(n, 10));
  if (!Number.isFinite(behind) || behind === 0) {
    return { ok: true, ahead, behind: 0 };
  }
  return { ok: false, ahead, behind };
}

function formatBlockMessage({ ahead, behind }) {
  return [
    '',
    '🛑 Bloqueado pelo hook pre-git-sync (skill pull-antes-de-commit-push):',
    '',
    `   Branch local está ${behind} commit(s) atrás do remoto (e ${ahead} à frente).`,
    '',
    '   Rode antes de commitar/pushar:',
    '     git fetch',
    '     git log --oneline HEAD..@{u}     # ver o que vem',
    '     git pull                          # ou rebase/stash conforme caso',
    '',
    '   Bypass intencional (somente se souber o que está fazendo):',
    '     adicione --no-verify ao comando',
    '',
    '',
  ].join('\n');
}

main();
