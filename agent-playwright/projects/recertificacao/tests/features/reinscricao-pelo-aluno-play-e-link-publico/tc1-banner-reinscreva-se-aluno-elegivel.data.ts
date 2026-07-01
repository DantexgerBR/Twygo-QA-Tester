/**
 * Dados específicos do TC1 — "Botão 'Reinscreva-se' aparece no banner do Play
 * para aluno elegível".
 *
 * Pré-condição declarada no MD (suite 06):
 *  - Feature flag `:recertificacao` ATIVA (assumido ON em staging-base-de-conhecimento)
 *  - Curso com `has_recertification = true`
 *  - Aluno elegível (progresso 100% OU certificado expirado)
 *
 * REVISAR-SEED: `eventIdCursoElegivel` aponta para um curso fixo do seed
 * em staging-base-de-conhecimento (orgId 37007). Validar id antes da primeira
 * execução via recon live; se inválido, o teste falha em `goToPlay` e
 * fica claro o que ajustar.
 *
 * NOTA sobre persona: o spec faz switch para perfil Aluno via UI (skill
 * `trocar-perfil-twygo`). Mesmo usuário admin acessa o Play como aluno —
 * Twygo não usa credenciais separadas por persona.
 */
export const tc1Data = {
  // Curso pré-existente em staging-base-de-conhecimento com
  // has_recertification=true e participant do user admin com progress=100%.
  // REVISAR-SEED: validar id real via recon live.
  eventIdCursoElegivel: 1,
} as const;
