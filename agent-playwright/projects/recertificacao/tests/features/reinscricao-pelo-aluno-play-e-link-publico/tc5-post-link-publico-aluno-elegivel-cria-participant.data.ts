/**
 * Dados específicos do TC5 — "POST em link público com `?recertification=true`
 * para aluno elegível cria participant".
 *
 * Pré-condição declarada no MD (suite 06):
 *  - Pacote pré-existente com link público gerado
 *  - Pacote contém curso com `has_recertification = true`
 *  - Aluno elegível (progresso 100% no curso do pacote, ou expirado)
 *
 * RN 15: POST com `recertification=true` em link público valida elegibilidade
 * e cria participant se elegível.
 *
 * REVISAR-SEED: `packageSlug` precisa ser o slug REAL do pacote público
 * em staging-base-de-conhecimento. Validar via recon live OU consulta SQL:
 *   `SELECT slug FROM packages WHERE organization_id = 37007 AND public_link IS NOT NULL LIMIT 1;`
 *
 * `eligibleStudent`: deve ser um aluno COM participant pré-existente
 * elegível no curso do pacote (não pode ser user inexistente — RN 15 valida
 * via `CheckReenrollmentEligibilityUseCase`, que olha o histórico do user
 * pelo email/CPF).
 *
 * IMPORTANTE: e-mails de teste em ambientes compartilhados devem usar
 * domínio `+test` ou similar pra não vazar pra produção real.
 */
export const tc5Data = {
  // Slug do pacote com link público — REVISAR-SEED.
  packageSlug: 'pacote-recertificacao-staging',
  // URL completa do link público (pode ser usada como atalho).
  publicLinkUrl:
    '/play/pacote-recertificacao-staging/course_registrations?recertification=true',
  // Aluno elegível pré-cadastrado no env — validar via recon live.
  eligibleStudent: {
    email: 'aluno.reinscricao@teste.twygo.com',
    name: 'Aluno Play Reinscrição',
    cpf: '12345678901',
  },
} as const;
