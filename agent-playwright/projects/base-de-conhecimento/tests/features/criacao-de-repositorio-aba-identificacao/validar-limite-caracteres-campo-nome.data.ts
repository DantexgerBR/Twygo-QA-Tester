// Dados do TC4 — Validar limite de caracteres do campo Nome
//
// Audit chrome-devtools-mcp 2026-05-21:
// - Input #knowledge-repositories-form-name-input NÃO tem atributo maxlength
//   (frontend não trunca client-side).
// - Frontend valida via schema (Yup/Zod) e renderiza inline error:
//   "O nome deve ter no máximo 255 caracteres" + aria-invalid="true" no input.
// - Click em Salvar com nome > 255 chars NÃO dispara request — form bloqueado
//   client-side (Save fica no-op).
// - Backend valida idem (PUT/POST com 256+ chars → 422 com
//   "Name é muito longo (máximo: 255 caracteres)") — fallback caso UI mude.
//
// Estratégia: spec valida mensagem inline + aria-invalid (o que o usuário
// realmente vê). Não depende do POST acontecer.
//
// Constantes geradas aqui; nunca inline no spec (Anti-pattern E).
export const tc4Data = {
  /** String que excede o limite (256 chars). */
  nomeAcimaDoLimite: 'A'.repeat(256),
  /** Descrição válida para isolar a validação no campo Nome. */
  descricaoValida: 'Descrição auxiliar — TC4 valida apenas limite do Nome.',
  /** Mensagem exata do inline error mostrado pelo frontend (confirmada live 2026-05-21). */
  mensagemErroInline: 'O nome deve ter no máximo 255 caracteres',
} as const;

// Verificação de sanidade (lida em code-review):
// tc4Data.nomeAcimaDoLimite.length === 256  ✓
