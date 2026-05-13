import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const importarAbaHappyPathData = {
  sourcePanelName: `Painel Origem Happy ${Date.now()}`,
  destPanelName: `Painel Destino Happy ${Date.now() + 1}`,
  tabXName: 'Aba X',
  tabXWidgets: ['activity_summary', 'in_progress_contents'] satisfies WidgetId[],
  importedTabName: 'Aba Importada',
  expectedWidgetTitles: ['Resumo de atividades', 'Conteúdos em andamento'] as const,
} as const;
