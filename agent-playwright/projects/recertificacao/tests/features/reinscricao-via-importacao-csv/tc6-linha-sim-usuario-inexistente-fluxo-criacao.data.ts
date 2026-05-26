/**
 * Dados específicos do TC6 — "Linha com `Reinscrever=SIM` para usuário
 * INEXISTENTE cai no fluxo normal de criação (sem reinscrição)".
 *
 * Pré-condição declarada no MD (Suite 04 / TC6):
 *  - Curso com `has_recertification = true`.
 *
 * Convenção do e-mail: gerado dinamicamente no spec via timestamp para
 * garantir que o usuário NÃO existe na org antes do upload (idempotência
 * por run). O .data.ts traz apenas o template/prefixo — o spec preenche o
 * sufixo único.
 */
export const tc6Data = {
  eventId: 2,
  // Template de email único por run. Spec substitui `{ts}` antes do upload.
  novoAlunoEmailPrefix: 'novo-aluno-tc6',
  novoAlunoEmailDomain: 'example.com',
  novoAlunoNome: 'Novo Aluno TC6',
  csvFileName: 'participants-novo-aluno-tc6.csv',
} as const;

/**
 * Helper para construir o conteúdo CSV com e-mail único.
 * Mantido aqui (não inline no spec) para que o spec consuma somente DADOS,
 * não LÓGICA. Anti-pattern C diz "não inline helpers" mas helper de DADOS
 * é parte natural do .data.ts.
 */
export function buildTc6Csv(uniqueTs: number): {
  csvContent: string;
  email: string;
} {
  const email = `${tc6Data.novoAlunoEmailPrefix}-${uniqueTs}@${tc6Data.novoAlunoEmailDomain}`;
  const csvContent = `Nome,Email,Reinscrever
${tc6Data.novoAlunoNome},${email},SIM`;
  return { csvContent, email };
}
