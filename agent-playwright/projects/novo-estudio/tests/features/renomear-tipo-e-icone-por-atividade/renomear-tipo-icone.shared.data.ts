// Dados compartilhados da suíte "Renomear tipo e ícone por atividade"
// (QA 1.6 — Artia 19710, RN 6). Atividade folha do curso seed usada nos TCs
// de edição (AT pede tipo "Lesson"; o seed não tem Aula — usamos a folha PDF,
// divergência registrada no laudo).
export const renomearData = {
  eventId: 807533,
  atividade: { id: 9288190, type: 'pdf', titulo: 'Material de apoio', labelOriginal: 'PDF Estampado', iconeOriginal: 'picture-as-pdf' },
  novoTipo: { slug: 'video', labelDefault: 'Vídeo upload' },
  scorm: { slug: 'scorm', labelDefault: 'SCORM' },
  labelCustomizado: 'Aula Customizada',
  iconeCustomizado: 'school',
} as const;
