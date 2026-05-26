// Dados do TC2 — Validar campo Nome obrigatório
// Nome intencionalmente ausente — TC valida que form recusa Salvar sem Nome.
export const tc2Data = {
  descricao: 'Teste sem nome',
  // REVISAR: confirmar se 'Geral' e 'Interno' são opções válidas ao vivo
  categoria: 'Geral',
  classificacao: 'Interno',
} as const;
