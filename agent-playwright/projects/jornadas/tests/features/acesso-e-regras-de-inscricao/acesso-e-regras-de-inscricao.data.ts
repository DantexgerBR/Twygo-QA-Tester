export type ResultadoEmail =
  /** Campo aceita: sem aria-invalid e sem "E-mail inválido". */
  | 'aceita'
  /** aria-invalid=true + "E-mail inválido" — validação acontece no BLUR neste campo. */
  | 'invalido';

export type CasoEmail = {
  cenario: string;
  categoria: 'A' | 'B' | 'C' | 'D' | 'E';
  input: string;
  esperado: ResultadoEmail;
};

export const acessoData = {
  ambiente: 'staging-marca-dagua',
  emailValido: 'qa.jornadas@example.com',
  /** Seções que a aba Acesso expõe (headings medidos em 03/08). */
  secoes: ['Contato', 'Inscrição', 'Acesso', 'Anexos'],
} as const;

/**
 * Matriz de e-mail da AT (TC11). Comportamento de CADA linha medido ao vivo em 03/08 antes de
 * escrever o spec — nenhuma expectativa aqui é dedução do recon.
 *
 * Nota sobre a categoria C: a AT dizia "rejeita formato não suportado sem quebrar a codificação".
 * Medido: `ações@example.com` é REJEITADO com "E-mail inválido" e o valor é preservado como digitado
 * (nenhuma mangled encoding). As duas metades da expectativa se confirmam.
 */
export const CASOS_EMAIL: readonly CasoEmail[] = [
  { cenario: 'Vazio opcional', categoria: 'B', input: '', esperado: 'aceita' },
  { cenario: 'Formato válido', categoria: 'B', input: 'qa.jornadas@example.com', esperado: 'aceita' },
  { cenario: 'Acentos', categoria: 'C', input: 'ações@example.com', esperado: 'invalido' },
  { cenario: 'Script', categoria: 'D', input: '<script>@example.com', esperado: 'invalido' },
  { cenario: 'Sem domínio', categoria: 'E', input: 'email-invalido', esperado: 'invalido' },
] as const;
