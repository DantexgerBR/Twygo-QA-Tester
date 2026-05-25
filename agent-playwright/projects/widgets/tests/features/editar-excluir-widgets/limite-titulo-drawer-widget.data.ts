export const limiteTituloDrawerWidgetData = {
  panelName: `Painel Limite Titulo ${Date.now()}`,
  widgetId: 'activity_summary',
  widgetTitle: 'Resumo de atividades',
  maxLength: 255,
  overflowTitle: 'A'.repeat(256),
} as const;
