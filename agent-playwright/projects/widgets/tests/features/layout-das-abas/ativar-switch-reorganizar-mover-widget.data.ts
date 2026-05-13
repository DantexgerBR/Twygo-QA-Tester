import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const ativarSwitchReorganizarMoverWidgetData = {
  panelName: `Painel Reorganizar Mover ${Date.now()}`,
  widgets: ['activity_summary', 'ranking'] satisfies WidgetId[],
} as const;
