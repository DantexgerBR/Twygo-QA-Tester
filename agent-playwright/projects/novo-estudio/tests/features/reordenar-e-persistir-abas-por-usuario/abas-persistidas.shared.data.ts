// Dados compartilhados da suíte "Reordenar e persistir abas por usuário,
// renomear 'Gerenciar' e 'Editar'" (QA 1.3 — Artia 19707, RN 3).
export const abasData = {
  courseId: 807533,
  courseName: 'Construindo times de alta performance',
  // AT TC1: ação esperada na listagem no lugar do antigo "Gerenciar curso"
  acaoEsperada: 'Editar curso',
  // ordem default observada em recon 2026-06-05 (users A e B idênticos)
  ordemDefault: [
    'tab-identification', 'tab-modelo', 'tab-access', 'tab-banner', 'tab-approval',
    'tab-charge', 'tab-location', 'tab-dashboard', 'tab-share', 'tab-studio',
  ],
} as const;
