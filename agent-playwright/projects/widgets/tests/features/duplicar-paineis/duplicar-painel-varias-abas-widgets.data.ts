/**
 * Dados específicos do testcase "Duplicar painel próprio com várias abas e widgets".
 * Convenção: §3.1 do CLAUDE.md.
 *
 * panelName é worker-isolated e gerado com timestamp no beforeAll do spec —
 * não é fixo aqui porque precisa de testInfo.workerIndex em runtime.
 * Os demais campos são constantes de domínio: abas extras e mapeamento de
 * widgets por aba.
 *
 * NOTA TC1.1: XML pede 5 widgets mas Aprendizagem tem apenas 4 IDs disponíveis
 * (activity_summary, in_progress_contents, ranking, my_certificates). O teste
 * usa os 4 disponíveis distribuídos em 3 abas.
 */
export const duplicarPainelVariasAbasWidgetsData = {
  abasExtras: ['Aba 2', 'Aba 3'] as const,
  widgetsPorAba: {
    1: ['activity_summary'],
    2: ['in_progress_contents'],
    3: ['ranking', 'my_certificates'],
  } as const,
} as const;
