/**
 * Dados específicos do TC3 — "Badge 'Substituído' é exibido na coluna de
 * Status para participants com `certificate_status = 4`".
 *
 * Pré-condição declarada no MD (suite 09): ao menos 1 aluno com
 * `certificate_status = 4` (REPLACED) no curso indicado por `eventId`.
 *
 * REVISAR-SEED: `participantIdentifier` é o texto que identifica a linha
 * (e-mail ou nome do aluno REPLACED). Quando o seed for criado/atualizado,
 * substituir aqui. Por ora, o spec aplica o filtro "Substituído" para
 * isolar somente linhas REPLACED e valida o badge na primeira linha
 * resultante — não depende de identificador específico.
 */
export const tc3Data = {
  eventId: 1,
  expectedBadgeLabel: 'Substituído',
  // Identificador (e-mail OU nome) do participant REPLACED. Quando o seed
  // for confirmado, preencher. Vazio = spec usa a primeira linha do filtro.
  participantIdentifier: '',
} as const;
