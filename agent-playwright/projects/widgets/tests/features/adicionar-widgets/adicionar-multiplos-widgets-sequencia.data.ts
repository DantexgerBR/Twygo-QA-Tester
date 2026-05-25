export const multiplosWidgetsData = {
  panelName: `Painel Multi Widgets ${Date.now()}`,
  widgets: [
    { id: 'activity_summary' as const, title: 'Resumo de atividades' },
    { id: 'in_progress_contents' as const, title: 'Conteúdos em andamento' },
    { id: 'ranking' as const, title: 'Ranking' },
    { id: 'my_certificates' as const, title: 'Meus certificados' },
  ],
} as const;
