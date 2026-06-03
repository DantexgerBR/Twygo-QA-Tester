#!/usr/bin/env node
// Hook PreToolUse — injeta lembrete obrigatório antes de Edit/Write
// em paths sensíveis (Page Objects, utils, fixtures, shared data).
//
// Sintoma sem este hook: agente edita `src/pages/X.ts` sem rodar
// `grep` por consumidores, sem consultar skill canônica, sem ler
// trace.zip. Resultado: regressão em outras suítes (incidente
// Recertificação 2026-06-01).
//
// Comportamento:
// - Lê tool_input do stdin (JSON)
// - Se tool é Edit/Write/MultiEdit em path sensível, escreve lembrete
//   em stderr (Claude vê) com exit code 0 (não bloqueia, só lembra)
// - Caso contrário, exit 0 silencioso
//
// Skills associadas:
// - evitar-reinventar-resolvidos-twygo (canonical gate)
// - regressao-pre-commit-twygo (gate dinâmico complementar)
//
// Para BYPASSAR: editar mesmo arquivo 2× em sequência (hook detecta
// segunda edição e não re-lembra — assume que primeira leu o lembrete).

const SENSITIVE_PATTERNS = [
  // POMs e utils compartilhados (multi-suíte)
  /[\\/]src[\\/]pages[\\/]/,
  /[\\/]src[\\/]utils[\\/]/,
  /[\\/]src[\\/]fixtures[\\/]/,
  // POMs específicos do projeto (consumidos por 2+ suítes)
  /[\\/]projects[\\/][^\\/]+[\\/]pages[\\/]/,
  // Shared data files
  /[\\/]projects[\\/][^\\/]+[\\/]data[\\/].*\.data\.ts$/,
  // Setup compartilhado
  /[\\/]tests[\\/]setup[\\/]/,
  /playwright\.config\./,
  /global-setup\./,
];

function main() {
  let input = '';
  process.stdin.setEncoding('utf8');
  process.stdin.on('data', (c) => (input += c));
  process.stdin.on('end', () => {
    try {
      const parsed = JSON.parse(input);
      const tool = parsed?.tool_name ?? '';
      if (!['Edit', 'Write', 'MultiEdit'].includes(tool)) return process.exit(0);

      const filePath = parsed?.tool_input?.file_path ?? '';
      if (!filePath) return process.exit(0);

      const isSensitive = SENSITIVE_PATTERNS.some((re) => re.test(filePath));
      if (!isSensitive) return process.exit(0);

      const reminder = formatReminder(filePath);
      process.stderr.write(reminder);
      process.exit(0); // não bloqueia — só lembra
    } catch (err) {
      process.stderr.write(`[pre-edit-skill-gate] erro interno: ${err.message}\n`);
      process.exit(0);
    }
  });
}

function formatReminder(filePath) {
  const relPath = filePath
    .replace(/^.*?[\\/]agent-playwright[\\/]/, '')
    .replace(/\\/g, '/');

  return [
    '',
    '═══════════════════════════════════════════════════════════════════════',
    '⚠️  PRE-EDIT GATE — path sensível detectado:',
    `   ${relPath}`,
    '',
    'Skill OBRIGATÓRIA antes de continuar:',
    '   evitar-reinventar-resolvidos-twygo (.claude/skills/)',
    '',
    'Checklist mínimo:',
    '   1. Rodou `grep -rn "<método|export>" src/ projects/` por consumidores?',
    '   2. Algum consumidor é canônico (fixture/SeedAdminPage/ContentEditPage)?',
    '      → Se sim, NÃO MEXER no método — investigar contexto de uso.',
    '   3. Há TC irmão na mesma suite que passa com path diferente?',
    '      → Se sim, copiar path do verde antes de inventar fix.',
    '   4. Trace.zip foi lido? (`npx playwright show-trace ...`)',
    '   5. Causa raiz inferida via Network/Console (não só screenshot)?',
    '',
    'Skills relacionadas: provisionar-seed, fechar-modais-twygo,',
    'tratar-modal-beta-end-twygo, debugar-via-network-e-console,',
    'navegar-sidebar-admin-twygo, regressao-pre-commit-twygo.',
    '',
    'Catálogo completo: .claude/skills/INDEX.md',
    '═══════════════════════════════════════════════════════════════════════',
    '',
  ].join('\n');
}

main();
