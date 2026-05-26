// ESLint flat config — agent-playwright (TypeScript)
// Calibrado pra pegar erros reais (bugs) sem floodar com estilo:
// no-explicit-any e no-unused-vars ficam como WARN (não reprovam o gate).
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
  {
    ignores: [
      'outputs/**',
      'node_modules/**',
      'allure-report/**',
      'allure-results/**',
      'playwright-report/**',
      'test-results/**',
      'templates/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    rules: {
      // Estilo / não-bloqueante (vira aviso): código existente não reprova
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_', caughtErrorsIgnorePattern: '^_' },
      ],
      'no-empty': ['warn', { allowEmptyCatch: true }],
      // no-undef é falso-positivo em TS (globais de browser/node em evaluate) — TS já cobre.
      'no-undef': 'off',
      // regex com control chars normalmente é intencional (limpar ANSI em relatórios).
      'no-control-regex': 'warn',
      // rethrow sem `cause` é best-practice, não bug — não bloqueia.
      'preserve-caught-error': 'warn',
      // Bugs reais ficam como erro (default do recommended) e reprovam o gate.
    },
  },
  {
    // Arquivos CommonJS (.cjs) usam require() legitimamente.
    files: ['**/*.cjs'],
    rules: { '@typescript-eslint/no-require-imports': 'off' },
  },
);
