export const informacaoLiteralData = {
  panelName: `Painel Info Literal ${Date.now()}`,
  widgets: [
    {
      id: 'activity_summary' as const,
      title: 'Resumo de atividades',
      description: 'Exibe um resumo completo das atividades de aprendizagem',
    },
    {
      id: 'in_progress_contents' as const,
      title: 'Conteúdos em andamento',
      description: 'Exibe os conteúdos que o usuário está cursando',
    },
    {
      id: 'ranking' as const,
      title: 'Ranking',
      description: 'Exibe para o usuário a sua posição do ranking',
    },
    {
      id: 'my_certificates' as const,
      title: 'Meus certificados',
      description: 'Exibe todos os certificados que o usuário conquistou',
    },
  ],
} as const;
