/**
 * Dado fixo do TC10. Range arbitrário grande para garantir que pelo menos
 * o filtro renderiza e aplica (não dependendo de seed específica). Formato
 * ISO YYYY-MM-DD (formato esperado por `<input type="date">` Chakra).
 */
export const filtrarColunaDataCriacaoData = {
  dateFrom: '2024-01-01',
  dateTo: '2027-12-31',
} as const;
