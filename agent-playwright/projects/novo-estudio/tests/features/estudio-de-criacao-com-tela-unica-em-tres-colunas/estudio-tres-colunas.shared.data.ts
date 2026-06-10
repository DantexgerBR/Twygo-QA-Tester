// Dados compartilhados da suíte "Estúdio de Criação com tela única em três colunas"
// (QA 1.2 — Artia 19706, RN 2). Curso seed pré-existente na org descoberto em
// recon 2026-06-05 (12 atividades com sub-atividades — bom pra lista/preview).
export const estudioData = {
  courseId: 807533,
  courseName: 'Construindo times de alta performance',
  // AT: "/o/{org}/events/:id/edit/studio" → 404 em recon. Rota real implementada:
  rotaRealRegex: /\/contents\/\d+\/edit\?tab=studio/,
  // AT TC7 — larguras esperadas do drawer do copiloto (% da viewport)
  larguraDrawer: { padraoPct: 30, expandidoPct: 50, toleranciaPct: 10 },
  viewports: {
    otimizada: { width: 1366, height: 720 },
    menor: { width: 1024, height: 600 },
  },
} as const;
