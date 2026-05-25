/**
 * Dado fixo do TC2. "Descrição" é prefixo das descrições "Descrição Painel N"
 * (painéis 6..30 da org 36988) e NÃO aparece no nome de nenhum painel — prova
 * a busca server-side está consultando o campo descrição.
 */
export const pesquisarPainelDescricaoData = {
  searchTerm: 'Descrição',
} as const;
