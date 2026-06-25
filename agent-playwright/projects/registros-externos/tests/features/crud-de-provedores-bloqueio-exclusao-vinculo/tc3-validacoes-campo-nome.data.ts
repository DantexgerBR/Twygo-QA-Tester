/** Matriz do campo obrigatório "Nome" do provedor (categorias A/B/C/D). */
export const tc3NomeMatrix = [
  { cenario: 'Vazio', input: '', accepted: false },
  { cenario: 'Só espaços', input: '   ', accepted: false },
  { cenario: '1 caractere', input: 'X', accepted: true },
  { cenario: 'Acentos', input: 'Fundação Getúlio Vargas', accepted: true },
  { cenario: 'Emoji', input: '🎓 Provedor', accepted: true },
  { cenario: 'Script tag', input: '<script>alert(1)</script>', accepted: true },
  { cenario: 'SQL injection', input: "'; DROP TABLE providers;--", accepted: true },
] as const;

export const tc3AcceptedNames = tc3NomeMatrix.filter((r) => r.accepted).map((r) => r.input);

// Inclui também os inputs "bloqueados" (Vazio/Só espaços): o produto NÃO valida
// Nome obrigatório e acaba criando provedores de nome vazio — precisam ser
// limpos no cleanup mesmo "não devendo" ter sido criados.
export const tc3AllInputs = tc3NomeMatrix.map((r) => r.input);
