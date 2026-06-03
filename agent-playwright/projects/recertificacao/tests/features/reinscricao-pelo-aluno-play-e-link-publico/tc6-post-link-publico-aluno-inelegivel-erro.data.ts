/**
 * Dados específicos do TC6 — "POST em link público com `recertification=true`
 * para aluno inelegível retorna erro sem criar participant".
 *
 * Pré-condição declarada no MD (suite 06):
 *  - Mesmo pacote do TC5 com link público
 *  - Aluno INELEGÍVEL (em andamento, sem certificado expirado)
 *
 * RN 15: backend retorna HTTP 422 com mensagem de erro do
 * `CheckReenrollmentEligibilityUseCase`; nenhum participant criado.
 *
 * REVISAR-SEED: aluno em "em andamento" no curso do pacote. Pode ser o
 * mesmo aluno do TC5 EM ESTADO DIFERENTE, OU outro aluno distinto.
 * Recomendado distinto para evitar acoplamento entre TCs.
 */
export const tc6Data = {
  packageSlug: 'pacote-recertificacao-staging',
  publicLinkUrl:
    '/play/pacote-recertificacao-staging/course_registrations?recertification=true',
  ineligibleStudent: {
    email: 'aluno.inelegivel@teste.twygo.com',
    name: 'Aluno Play Inelegível',
    cpf: '98765432100',
  },
  // Mensagem de erro esperada do CheckReenrollmentEligibilityUseCase.
  // REVISAR-FIGMA: wording exato ainda não confirmado — regex amplo cobre
  // variações ("não está elegível", "em andamento", "sem expiração").
  expectedErrorPattern: /elegível|elegivel|andamento|expira|reinscri/i,
} as const;
