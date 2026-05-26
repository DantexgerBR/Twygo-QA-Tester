export const exibirWidgetPorAbaData = {
  expectedTabsCount: 5,
  alunoUseModeId: 70078,
  /**
   * Sequência de abas que o beforeAll cria. A primeira ("Nova aba") já
   * existe por default ao criar painel — só renomear não vale; manter o
   * nome default mantém compat com `getTabChip`. As 4 seguintes são
   * adicionadas via `addTab`. Cada aba recebe 1 widget distinto (4 widget
   * types disponíveis → 5ª aba repete activity_summary).
   */
  tabsExtras: ['Aba 2', 'Aba 3', 'Aba 4', 'Aba 5'] as const,
  widgetPerTab: [
    'activity_summary',
    'in_progress_contents',
    'ranking',
    'my_certificates',
    'activity_summary',
  ] as const,
} as const;
