import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const switchDesativadoTentarArrastarData = {
  panelName: `Painel Switch Off ${Date.now()}`,
  widget: 'activity_summary' satisfies WidgetId,
} as const;
