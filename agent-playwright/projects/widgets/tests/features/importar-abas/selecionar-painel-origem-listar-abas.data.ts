import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const selecionarPainelOrigemListarAbasData = {
  sourcePanelName: `Painel Origem Importar ${Date.now()}`,
  destPanelName: `Painel Destino Importar ${Date.now() + 1}`,
  tabXName: 'Aba X',
  tabYName: 'Aba Y',
  tabXWidgets: ['activity_summary', 'in_progress_contents'] satisfies WidgetId[],
  tabYWidgets: ['activity_summary', 'in_progress_contents', 'ranking'] satisfies WidgetId[],
} as const;
