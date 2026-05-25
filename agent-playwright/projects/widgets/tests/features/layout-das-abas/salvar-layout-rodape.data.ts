import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const salvarLayoutRodapeData = {
  panelName: `Painel Salvar Layout ${Date.now()}`,
  widget: 'activity_summary' satisfies WidgetId,
} as const;
