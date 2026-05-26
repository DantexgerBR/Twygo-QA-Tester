// Dados do TC1 — Criar repositório com dados válidos
// Nome é gerado em runtime (worker-isolated) para evitar colisão em runs paralelos.
// Categoria/Classificação: react-select creatable — qualquer valor digitado vira
// uma opção nova (criada na hora). Org nova sem opções pré-existentes.
// Toast text confirmado live 2026-05-19: "Repositório de conhecimento criado com sucesso".
export const tc1Data = {
  descricao: 'Repositório de teste automatizado',
  categoria: 'Geral',
  classificacao: 'Interno',
  toastSucesso: 'Repositório de conhecimento criado com sucesso',
} as const;
