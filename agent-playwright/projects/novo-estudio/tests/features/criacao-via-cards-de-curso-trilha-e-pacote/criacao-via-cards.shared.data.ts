// Dados compartilhados da suíte "Criação via cards de Curso, Trilha e Pacote"
// Textos literais conforme AT (test-analysis.md) e confirmados em recon live 2026-06-03.
export const cardsData = {
  pergunta: 'O que você quer criar?',
  cards: [
    {
      titulo: 'Curso',
      // trechos sem pontuação final — tolera variação de "." no fim
      descricao: 'Conteúdo único com aulas, atividades e avaliações para uma capacitação específica',
    },
    {
      titulo: 'Trilha',
      descricao: 'Sequência ordenada de cursos para guiar uma jornada completa de aprendizado',
    },
    {
      titulo: 'Pacote',
      descricao: 'Conjunto de cursos e trilhas agrupados para venda ou atribuição em bloco',
    },
  ],
  // AT: "/events/new ou caminho equivalente da nova página dedicada".
  // Recon: rota real implementada é /o/{org}/studio.
  rotaPaginaCards: /\/studio$|\/events\/new/,
  // AT TC6: Estúdio de Criação com URL contendo /edit/studio
  rotaEstudioCriacao: /\/edit\/studio/,
  chamadaIa: 'Criar curso com IA',
  viewports: {
    tablet: { width: 768, height: 1024 },
    mobile: { width: 360, height: 740 },
  },
} as const;
