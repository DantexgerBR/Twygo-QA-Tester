/**
 * Dados compartilhados pela suíte "Adicionar widgets".
 *
 * `panelDescription`: workaround para o bug **32872141** — quando o painel é
 * criado apenas com Nome (sem Descrição), o dirty-flag interno do form não
 * reseta após Salvar. Qualquer transição interna (ex.: click na tab Layouts)
 * dispara o dialog "Tem certeza que deseja sair?" e bloqueia a renderização
 * do `widgets-grid-*`. Passar uma Descrição na criação evita o estado bugado.
 *
 * Remover este workaround quando 32872141 for corrigido em produção.
 */
export const adicionarWidgetsSharedData = {
  panelDescription:
    'Painel criado pela automação de testes (suíte Adicionar widgets).',
} as const;
