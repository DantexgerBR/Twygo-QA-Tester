/**
 * Dados compartilhados pela suíte "Extração de dados da Evidência (export em
 * massa de anexos)" (RN79).
 *
 * Suíte de natureza majoritariamente MANUAL/backend: valida a estrutura interna
 * do ZIP gerado pelo job de export assíncrono (pasta por pessoa, log de falhas,
 * split, TTL, mirrors). A única superfície automatizável por UI é o DISPATCH do
 * job de export — coberto pela TC1. Demais TCs são `test.fixme` legítimo
 * (verificação manual + seed/infra ausente, matriz §7.6-F).
 *
 * Sem cleanup (convenção do projeto registros-externos): disparar um export não
 * muta a listagem nem deixa orphan.
 */
export const exportMassaData = {
  suiteName: 'Extração de dados da Evidência (export em massa de anexos)',
  epic: 'Twygo - Registros de Aprendizagem',

  /**
   * Endpoint real do job de export de anexos (confirmado no recon da suíte irmã,
   * 2026-06-23): o submit de "Evidências" posta aqui e retorna 201. É a
   * precondição de toda a suíte — sem este POST, nenhum ZIP é gerado.
   */
  exportEndpoint: /\/subscription_attachments_exports\b/i,
} as const;
