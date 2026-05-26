// Dados do TC1 — Exportar listagem completa.
//
// Audit chrome-devtools-mcp 2026-05-24 confirmou:
//   - Botão "Extrair dados" (ícone `ios_share`) existe na toolbar — feature
//     entregue entre 2026-05-19 (fixme original) e 2026-05-24.
//   - Click abre modal "Configurações da extração" — NÃO download direto.
//   - Modal exige 3 radios: Formato (CSV/PDF), Dados (Filtro atual/Todos),
//     Colunas (Filtro atual/Todas). Clicar Extrair sem todos resulta em
//     "Dados (linhas) é obrigatório" / "Colunas é obrigatório".
//   - Extração é **ASSÍNCRONA**: após click Extrair, toast "Extração de
//     dados em andamento" aparece. Arquivo chega via notificação no
//     sininho minutos depois (out-of-scope Playwright).
//
// **GAP DO AT**: test-analysis.md §306-321 descreve fluxo síncrono ("Aguardar
// o download concluir → Arquivo está no diretório de downloads do browser"),
// mas o produto é async. QA Lead precisa atualizar AT pra refletir produto.
// Spec valida o que está em escopo Playwright: toast de progresso aparece.
export const tc1Data = {
  // Modal exige Dados=Todos + Colunas=Todas pra exportação completa sem filtro.
  extractOptions: {
    format: 'csv',
    data: 'todos',
    columns: 'todas',
  },
} as const;
