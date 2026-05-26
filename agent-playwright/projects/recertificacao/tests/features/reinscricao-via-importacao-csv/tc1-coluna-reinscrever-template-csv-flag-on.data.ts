/**
 * Dados específicos do TC1 — "Coluna 'Reinscrever' aparece no template CSV
 * com flag ON".
 *
 * Pré-condição declarada no MD (Suite 04):
 *  - Feature flag `:recertificacao` ATIVA (assumido em
 *    staging-base-de-conhecimento, ver decisão locked do QA — Suite 01).
 *  - Curso com `has_recertification = true` pré-existente.
 *
 * REVISAR-SEED: `eventId` aponta para um curso fixo do seed em
 * staging-base-de-conhecimento (orgId 37007). Validar o id antes da
 * primeira execução; se inválido, o teste falha em `goToImport` e fica
 * claro o que ajustar.
 */
export const tc1Data = {
  // Curso com has_recertification = true. Reutiliza o curso usado pelo TC3
  // da suite "Configuração de Conteúdo" — após cleanup, este id pode estar
  // OFF; este TC só lê o template (não altera o curso), então `has_recertification`
  // não é pré-requisito direto: basta a flag :recertificacao estar ON na org.
  eventId: 2,
  expectedColumnName: 'Reinscrever',
} as const;
