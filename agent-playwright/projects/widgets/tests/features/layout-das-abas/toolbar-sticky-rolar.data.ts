import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

export const toolbarStickyRolarData = {
  panelName: `Painel Toolbar Sticky ${Date.now()}`,
  widgets: ['activity_summary', 'in_progress_contents', 'ranking', 'my_certificates'] satisfies WidgetId[],
} as const;
