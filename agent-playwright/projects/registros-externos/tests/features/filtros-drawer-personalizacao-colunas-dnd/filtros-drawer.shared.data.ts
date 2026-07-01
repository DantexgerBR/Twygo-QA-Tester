/**
 * Dados compartilhados pela suíte "Filtros via drawer e personalização de
 * colunas (DnD)" (TC1–TC10) na tela Admin "Aprendizagem > Registros".
 *
 * Seletores/labels validados em recon ao vivo 2026-06-23 — ver
 * `inputs/recon-filtros-drawer-personalizacao-colunas-dnd.md`.
 */

/** Mensagem de fixme reutilizada nos TCs gated pela ausência dos filtros padrão/salvos. */
export const DEFAULT_FILTERS_ABSENT =
  'AT desatualizada / feature não entregue no BETA: o grupo "Filtros padrão" do ' +
  'drawer não possui os radios Válidos/Expirados/Pendentes/Recusados (exibe "Não há ' +
  'filtros nessa seção."; radioCount=0 no recon 2026-06-23). Sem eles, este cenário ' +
  'não é exercível. Destinatário: AT / QA Lead (rever RN 63–66 vs build registrosf2).';

export const filtrosDrawerData = {
  /** Empty state literal exibido em TODOS os 3 grupos do drawer (build atual). */
  emptyGroupText: 'Não há filtros nessa seção.',

  /** Copy que a AT esperava nos grupos compartilhados/meus (divergente do build). */
  atExpectedSharedEmpty: 'Em breve — filtros criados pela equipe vão aparecer aqui.',
  atExpectedMyEmpty: 'Em breve — filtros que você criar ou duplicar ficam aqui.',

  /** Colunas exercidas no toggle (TC7): desmarcar uma default-ON, marcar uma default-OFF. */
  toggleOffColumn: 'provider', // Provedor (default ON)
  toggleOnColumn: 'progress_score', // Progresso (default OFF) — AT cita "Website", mas Website já é default-ON

  /** DnD (TC8): mover "Carga horária" para antes de "Origem". */
  dndSourceColumn: 'workload_seconds', // Carga horária
  dndTargetColumn: 'origin', // Origem
} as const;
