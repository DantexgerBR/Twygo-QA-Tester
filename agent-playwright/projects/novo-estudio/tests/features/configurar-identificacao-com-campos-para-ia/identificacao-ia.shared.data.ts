// Dados compartilhados da suíte "Configurar identificação do curso com seções
// e campos para IA" (QA 1.4 — Artia 19708, RN 4).
export const identificacaoData = {
  courseId: 807533,
  courseName: 'Construindo times de alta performance',
  // AT espera estas sections; recon 2026-06-05 achou: "Dados básicos", "Público",
  // "Acesso e visibilidade", "Conteúdo", "Notificações", "Chat" (campos IA em "Público")
  sectionsDaAt: ['Básico', 'Caracterização', 'Configurações de IA'],
  tooltipIa: 'Estes campos são usados pela IA na geração de conteúdo. Quanto mais preenchidos, melhor o resultado.',
  valores: {
    idade: '25-35 anos',
    dificuldade: 'Intermediário',
    tomDeVoz: 'Descontraído',
    persistencia: { idade: '30-40 anos', dificuldade: 'Avançado', tomDeVoz: 'Técnico' },
  },
  maxlength: 250,
} as const;
