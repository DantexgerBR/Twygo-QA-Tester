import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const selecionarCategoriaImportacaoData = {
  sourcePanelName: `Painel Origem Categoria ${Date.now()}`,
  destPanelName: `Painel Destino Categoria ${Date.now() + 1}`,
  tabXName: 'Aba X',
  tabXWidgets: ['activity_summary', 'in_progress_contents'] satisfies WidgetId[],
  defaultCategory: 'Aprendizagem',
} as const;
