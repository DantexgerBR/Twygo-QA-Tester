export const limiteNomeAbaData = {
  panelName: `Painel Limite Nome Aba ${Date.now()}`,
  maxLength: 255,
  name255Chars: 'a'.repeat(255),
  name256Chars: 'a'.repeat(256),
} as const;
