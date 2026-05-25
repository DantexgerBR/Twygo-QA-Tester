import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const visualizarPreviewAbaData = {
  sourcePanelName: `Painel Origem Preview ${Date.now()}`,
  destPanelName: `Painel Destino Preview ${Date.now() + 1}`,
  tabXName: 'Aba X',
  tabYName: 'Aba Y',
  tabXWidgets: ['activity_summary', 'in_progress_contents'] satisfies WidgetId[],
  tabYWidgets: ['activity_summary', 'in_progress_contents', 'ranking'] satisfies WidgetId[],
} as const;
