/**
 * Dados compartilhados pela suíte QA 1.16 "Escopo do Líder, pessoas inativadas
 * e origem Compartilhado".
 *
 * Veredito ATUALIZADO pelo recon "modo de uso" (2026-06-30, ver
 * `inputs/recon-escopo-lider-modo-uso.md`) — corrige o recon §9
 * (`inputs/recon-escopo-lider.md`). TC5 (Admin E Líder) e TC1-Admin são verdes.
 * Os demais são `fixme` por SEED (não por feature ausente), destinatário QA
 * Lead/infra — nunca escondendo bug de produto (Anti-pattern F).
 *
 * Fatos duros (não hardcodar orgId — sempre `getOrgId()`):
 *  - Stats `/api/v1/o/{org}/records/stats`: `by_status` + `total_general` +
 *    `workload_total_seconds`. TC5 compara `total_general` (invariante) com a lista.
 *  - Origens presentes: SÓ `external` + `internal`. `shared_events` (Concedidos/
 *    Recebidos) = 0 entries ⇒ origem `Compartilhado` inexistente ⇒ TC6/TC7/TC10 sem seed.
 *  - CORREÇÃO §9: o escopo de Líder É aplicado — a visão do líder NÃO é o popover
 *    (que cai em `/dashboard_students`), e sim o modelo de página do modo de uso
 *    "Lider de equipe" (`use_mode` 70340): "Gestão de Time > Registros externos"
 *    em `/o/{org}/team/records?menu_id=registros-externos`, com stats escopado
 *    `/records/stats?in_use_mode_layout=true&team_scope=true`. Os 3 escopos diferem
 *    (Admin > Colaborador `?in_use_mode_layout=true` > Time `&team_scope=true`).
 *    Este líder (team_leader 4301564) tem 1 liderado e 0 registros ⇒ TC1-Líder/
 *    TC2/TC3 ficam `fixme` por SEED de liderados-com-registros, não por feature.
 */
export const escopoLiderData = {
  suiteName: 'Escopo do Líder, pessoas inativadas e origem Compartilhado',
  epic: 'Twygo - Registros de Aprendizagem',
} as const;
