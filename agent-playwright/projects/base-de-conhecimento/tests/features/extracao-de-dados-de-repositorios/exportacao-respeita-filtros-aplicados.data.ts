// Dados do TC2 — Exportação respeita filtros aplicados.
//
// Audit chrome-devtools-mcp 2026-05-24 confirmou:
//   - Botão "Extrair dados" existe (mesmo do TC1).
//   - Filtro Categoria EXISTE no drawer — modo "Novo" → "Colunas para filtrar"
//     → checkbox "Categoria" → digita valor em "Opções de filtro" (react-select).
//     POM já cobre via `selectCategoryFilter()`.
//   - Extração é ASSÍNCRONA — toast "Extração de dados em andamento"
//     aparece após click Extrair; arquivo via notificação depois.
//   - Bug Rails 500 do TC2 dos Filtros AINDA EXISTE: GET /knowledge_repositories
//     com `filter_cache_key=quick_filter:*` retorna 500 "no implicit conversion
//     of String into Integer". Spec consegue cobrir UI do filtro + abrir modal
//     + asserir toast, mas validação do CONTEÚDO do export está bloqueada
//     pelo bug Rails.
//
// Categorias reais cadastradas no env (confirmado live): "Geral", "Tecnologia",
// "Cat w*-...". "Geral" é a opção canônica (igual à suite Filtros e Busca).
export const tc2Data = {
  categoriaFiltro: 'Geral',
  // Modal exige Dados=Filtro atual + Colunas=Todas pra reflexão do filtro
  // ativo. "Colunas=Todas" porque o teste valida que o filtro de LINHAS é
  // respeitado, sem se importar com filtro de colunas.
  extractOptions: {
    format: 'csv',
    data: 'filtro_atual',
    columns: 'todas',
  },
} as const;
