// Dados compartilhados pela suíte "Gerar conteudo de aula e pagina via IA em
// sequencia fixa" (novo-estudio).
//
// contentId do curso de recon "Construindo times de alta performance" na org
// principal (37061). Ver inputs/recon-gerar-conteudo-ia.md.
export const suiteData = {
  contentId: 807533,
  suiteName: 'Gerar conteudo de aula e pagina via IA em sequencia fixa',
  projectEpic: 'Twygo - Novo Estúdio de Criação',
  // Ordem fixa das etapas por tipo (linhas do popover de pendências).
  lessonStages: ['roteiro', 'slides', 'imagem', 'audio', 'render'] as const,
  pageStages: ['roteiro', 'conteudo_pagina', 'imagem'] as const,
} as const;
