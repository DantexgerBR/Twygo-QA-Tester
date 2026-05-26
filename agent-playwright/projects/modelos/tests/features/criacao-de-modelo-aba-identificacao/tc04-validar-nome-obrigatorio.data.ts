// Matriz A-D do TC4 (skill cenarios-negativos-twygo). Cada linha vira
// uma iteração no spec. esperaBloqueio=true significa que o modelo NÃO
// deve ser criado (URL permanece em /new).
//
// IMPORTANTE: todas as entradas que CRIAM modelo usam o prefix MATRIX_PREFIX
// abaixo. afterAll do spec deleta todos os modelos com esse prefix via
// deleteAllByNamePrefix — evita contaminação do env em runs regressivas.

export const MATRIX_PREFIX = 'TC4MATRIX-';

const longName256 = 'A'.repeat(256);
const ts = Date.now();

export const tc04NomeMatrixData = {
  prefix: MATRIX_PREFIX,
  matrix: [
    {
      categoria: 'A',
      descricaoEntrada: '(vazio) — Nome obrigatório',
      entrada: '',
      esperaBloqueio: true,
    },
    {
      categoria: 'B',
      descricaoEntrada: '"A" (1 caractere) — sem mínimo declarado',
      entrada: `${MATRIX_PREFIX}A-${ts}`,
      esperaBloqueio: false,
    },
    {
      categoria: 'B',
      descricaoEntrada: '256 caracteres — acima do limite máximo 255',
      entrada: longName256,
      esperaBloqueio: true,
    },
    {
      categoria: 'C',
      descricaoEntrada: 'acentos + especiais "Modelo @çãõ#$%"',
      entrada: `${MATRIX_PREFIX}@çãõ#-${ts}`,
      esperaBloqueio: false,
    },
    {
      categoria: 'D',
      descricaoEntrada: 'XSS literal "<script>alert(1)</script>"',
      entrada: `${MATRIX_PREFIX}<script>${ts}`,
      esperaBloqueio: false,
    },
    {
      categoria: 'D',
      descricaoEntrada: 'SQL injection "\'; DROP TABLE--"',
      entrada: `${MATRIX_PREFIX}sql-${ts}`,
      esperaBloqueio: false,
    },
  ],
} as const;
