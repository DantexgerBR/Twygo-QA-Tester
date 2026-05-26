// Dados do TC3 — Validar campo Descrição obrigatório
// Descrição intencionalmente ausente — TC valida que form recusa Salvar sem Descrição.
export const tc3Data = {
  nomeRepo: 'Repositório sem descrição',
  // REVISAR: confirmar se 'Geral' e 'Interno' são opções válidas ao vivo
  categoria: 'Geral',
  classificacao: 'Interno',
} as const;
