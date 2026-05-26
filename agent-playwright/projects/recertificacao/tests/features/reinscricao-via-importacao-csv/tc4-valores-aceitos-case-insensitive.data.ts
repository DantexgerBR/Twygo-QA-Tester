/**
 * Dados específicos do TC4 — "Valores de `Reinscrever` aceitos
 * (case-insensitive: SIM/sim/true/1)".
 *
 * Matriz declarada no MD (Suite 04 / TC4):
 *  - Aceitos (geram reinscrição): SIM, sim, true, 1
 *  - Ignorados (fluxo normal): NÃO, vazio, "talvez"
 *
 * 7 alunos pré-cadastrados — um por valor. REVISAR-SEED.
 */
export const tc4Data = {
  eventId: 2,
  csvFileName: 'participants-matrix-tc4.csv',
  // 7 linhas — 4 aceitas + 3 ignoradas. Header `Nome,Email,Reinscrever`.
  csvContent: `Nome,Email,Reinscrever
Aluno TC4 SIM,aluno-tc4-sim@example.com,SIM
Aluno TC4 sim,aluno-tc4-sim-lower@example.com,sim
Aluno TC4 true,aluno-tc4-true@example.com,true
Aluno TC4 1,aluno-tc4-one@example.com,1
Aluno TC4 NAO,aluno-tc4-nao@example.com,NÃO
Aluno TC4 vazio,aluno-tc4-vazio@example.com,
Aluno TC4 talvez,aluno-tc4-talvez@example.com,talvez`,
  // Lista dos e-mails que DEVEM aparecer como reinscritos.
  acceptedEmails: [
    'aluno-tc4-sim@example.com',
    'aluno-tc4-sim-lower@example.com',
    'aluno-tc4-true@example.com',
    'aluno-tc4-one@example.com',
  ] as const,
  // Lista dos e-mails ignorados (fluxo normal, NÃO devem aparecer reinscritos).
  ignoredEmails: [
    'aluno-tc4-nao@example.com',
    'aluno-tc4-vazio@example.com',
    'aluno-tc4-talvez@example.com',
  ] as const,
} as const;
