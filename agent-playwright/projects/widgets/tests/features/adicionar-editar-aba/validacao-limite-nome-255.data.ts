// XML documenta limite de 255; DOM real tem maxLength=250 (observado live).
// REVISAR no produto: alinhar XML com app (250) ou app com XML (255).
export const validacaoLimiteNomeData = {
  domMaxLength: 250,
  name256Chars: 'a'.repeat(256),
  name250Chars: 'a'.repeat(250),
} as const;
