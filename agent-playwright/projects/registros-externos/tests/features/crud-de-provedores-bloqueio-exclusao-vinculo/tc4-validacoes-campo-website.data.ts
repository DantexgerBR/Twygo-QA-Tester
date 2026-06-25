/** Matriz do campo opcional "Website" do provedor (categoria E — tipo errado). */
export const tc4WebsiteMatrix = [
  { cenario: 'Vazio', input: '', mustAccept: true },
  { cenario: 'URL válida', input: 'https://alura.com.br', mustAccept: true },
  // Comportamento "consistente": aceita normalizando OU rejeita — não fixamos
  // qual; o spec só exige que NÃO quebre silenciosamente.
  { cenario: 'Sem protocolo', input: 'alura.com.br', mustAccept: false },
  { cenario: 'Texto inválido', input: 'não é url', mustAccept: false },
] as const;
