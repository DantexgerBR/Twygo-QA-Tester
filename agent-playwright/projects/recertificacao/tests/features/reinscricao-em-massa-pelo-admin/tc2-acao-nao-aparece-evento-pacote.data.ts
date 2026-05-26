/**
 * Dados do TC2 — "Ação 'Reinscrição em massa' NÃO aparece em evento do
 * tipo pacote" (Suite 03, MD §460).
 *
 * Pré-condição MD §470: pacote "Pacote Recertificação w{workerIndex}"
 * com `has_recertification = true` e ao menos 3 alunos.
 *
 * RN 8: mesmo com flag ON e has_recertification=true, eventos do tipo
 * `ContentKind.package` NÃO permitem reinscrição em massa.
 *
 * REVISAR-SEED: `pacoteIdRecertOn` aponta para pacote pré-existente
 * no seed de staging-base-de-conhecimento. Trocar quando o seed for
 * re-criado ou descobrir id real via recon live.
 */
export const tc2Data = {
  // ID do pacote (ContentKind.package) com has_recertification=true.
  // REVISAR-SEED: confirmar id real no env.
  pacoteIdRecertOn: 4,
  studentsToSelect: 3,
} as const;
