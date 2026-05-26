import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const editarAbaImportadaData = {
  sourcePanelName: `Painel Origem Editar ${Date.now()}`,
  destPanelName: `Painel Destino Editar ${Date.now() + 1}`,
  tabXName: 'Aba X',
  tabXWidgets: ['activity_summary', 'in_progress_contents'] satisfies WidgetId[],
  importedTabName: 'Aba Importada',
  editedTabName: 'Aba Renomeada',
  newWidget: 'ranking' satisfies WidgetId,
} as const;
