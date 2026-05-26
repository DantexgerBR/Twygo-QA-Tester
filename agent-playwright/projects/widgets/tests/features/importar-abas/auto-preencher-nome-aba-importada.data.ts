import { PainelFormPage } from '../../../pages/PainelFormPage.js';

type WidgetId = keyof typeof PainelFormPage.WIDGET_IDS;

const NAME_255 = 'A'.repeat(255);
const NAME_256 = 'A'.repeat(256);

export const autoPreencherNomeAbaImportadaData = {
  sourcePanelName: `Painel Origem AutoNome ${Date.now()}`,
  destPanelName: `Painel Destino AutoNome ${Date.now() + 1}`,
  tabXName: 'Aba X',
  tabYName: 'Aba Y',
  tabXWidgets: ['activity_summary', 'in_progress_contents'] satisfies WidgetId[],
  tabYWidgets: ['activity_summary', 'in_progress_contents', 'ranking'] satisfies WidgetId[],
  newTabName: 'Aba Importada',
  name255Chars: NAME_255,
  name256Chars: NAME_256,
} as const;
