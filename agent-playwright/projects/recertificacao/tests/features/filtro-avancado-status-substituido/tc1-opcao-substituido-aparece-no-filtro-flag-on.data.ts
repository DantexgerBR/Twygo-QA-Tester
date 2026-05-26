/**
 * Dados específicos do TC1 — "Opção 'Substituído' aparece no filtro avançado
 * de Status do certificado com flag ON".
 *
 * Pré-condição declarada no MD (suite 09):
 *  - Feature flag `:recertificacao` ATIVA
 *  - Pelo menos 1 aluno com certificado VALID/REPLACED/EXPIRED/PENDING
 *  - Lista de aprendizagem em "/learning_students" para um curso pré-existente
 *
 * `eventId` aponta para um curso pré-existente no env
 * `staging-base-de-conhecimento` (orgId 37007) que tenha learning_students
 * habilitado e participants em diferentes certificate_status.
 *
 * REVISAR-SEED: validar id real via recon live ou consulta SQL:
 *   `SELECT e.id FROM events e WHERE e.organization_id = 37007 LIMIT 1;`
 * Quando o seed do env for re-criado, atualizar este valor.
 */
export const tc1Data = {
  eventId: 1,
  optionLabel: 'Substituído',
} as const;
