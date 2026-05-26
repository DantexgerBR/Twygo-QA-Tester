/**
 * Dados do TC3 — Validar botão de criação na listagem.
 *
 * Texto do botão confirmado pelo recon (snapshot 2026-05-19):
 *   - role=button, name="Adicionar" (sem o "+" prefixado descrito no AT v1).
 *   - O recon também registra role=link, name="Adicionar" — o Page Object
 *     `getAddButton()` usa `getByRole('button', { name: /Adicionar/i })`, que
 *     bate no button. Se o app mudar para link, atualizar POM.
 *
 * URL de criação: padrão Twygo Rails-like `/o/{orgId}/knowledge_repositories/new`.
 * Marcado como REVISAR — o recon não navegou até a tela de criação.
 *
 * Aba ativa na tela de criação: "Identificação" (do AT; confirmar via REVISAR
 * na asserção `aria-selected`).
 */
export const tc3Data = {
  /** Padrão de URL esperado após clicar em Adicionar. */
  urlCriacaoPattern: /knowledge_repositories\/new/,

  /**
   * Texto visível do botão de criação.
   * Confirmado no recon: role=button, name="Adicionar".
   */
  textoBotaoCriacao: 'Adicionar',

  /**
   * Nome da aba ativa na tela de criação.
   * REVISAR: inferido do AT — confirmar ao vivo na primeira execução.
   */
  abaAtivaCriacao: 'Identificação',
} as const;
