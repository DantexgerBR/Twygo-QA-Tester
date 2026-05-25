/**
 * Dado fixo do TC8. Painéis 6..30 da org 36988 têm descrição
 * "Descrição Painel N". "Painel 6" é uma substring que casa tanto com o
 * nome quanto com a descrição → assert via nome é seguro.
 */
export const filtrarColunaDescricaoData = {
  searchTerm: 'Painel 6',
} as const;
