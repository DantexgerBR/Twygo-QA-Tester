import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const cancelarEdicaoComAlteracoesData = {
  panelName: `Painel Cancelar Alteracoes ${Date.now()}`,
  widget: 'activity_summary' satisfies WidgetId,
} as const;
