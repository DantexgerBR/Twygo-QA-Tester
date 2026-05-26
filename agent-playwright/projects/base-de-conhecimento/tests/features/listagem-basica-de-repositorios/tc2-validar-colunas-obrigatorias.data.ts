// Dados do TC2 — Validar colunas obrigatórias da listagem.
//
// Colunas confirmadas em execução live (2026-05-19): Nome, Descrição,
// Categoria, Classificação. Recon innerText do container mostrava
// 'NomeDescriçãoCategoria Classificaç...', batendo com essas 4.
//
// Colunas "Criado em" e "Atualizado em" (inferidas do AT) NÃO existem
// no produto — primeira execução do TC2 falhou ao procurá-las. Removidas
// porque o MD canônico marcou-as como REVISAR-FIGMA (confirmação live
// invalidou a inferência).
export const tc2Data = {
  // Colunas reais confirmadas via chrome-devtools-mcp (run 2026-05-19) — 8 colunas.
  // O MD inferiu "Criado em / Atualizado em" (não existem) → labels reais são
  // "Última atualização" + "Criado por" + colunas extras de fontes/recursos.
  colunasObrigatorias: [
    'Nome',
    'Descrição',
    'Categoria',
    'Classificação',
    'Fontes de conhecimento',
    'Recursos de mídia',
    'Última atualização',
    'Criado por',
  ] as const,
} as const;
