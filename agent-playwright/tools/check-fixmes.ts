/**
 * Pre-flight check — bloqueia execução se algum spec contiver `test.fixme`
 * ou `test.skip` sem justificativa registrada.
 *
 * **Forma correta** (captura `skipReason` no JSON reporter → relatório
 * mostra "Por que foi ignorado"):
 *   test('Title', async ({ page }) => {
 *     test.fixme(true, 'razão clara aqui');
 *     // ...
 *   });
 *
 * **Forma proibida** (Playwright marca como fixme mas SEM mensagem; o
 * relatório fica com "ignorado sem justificativa registrada"):
 *   test.fixme('Title', async () => { ... });   // declarativa
 *   test.fixme(true);                            // 1 arg só
 *   test.fixme(true, '');                        // razão vazia
 *
 * Roda como `npm run agent:check` (e é invocado pelo orchestrator antes do
 * `playwright test`).
 *
 * Exit code: 0 OK, 1 violações encontradas.
 */

import * as ts from 'typescript';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

type Violation = {
  file: string;
  line: number;
  col: number;
  callee: string;
  reason: string;
  snippet: string;
};

const SKIP_DIRS = new Set(['node_modules', 'outputs', '.git', '.claude']);

function listSpecs(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP_DIRS.has(entry.name) || entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listSpecs(full));
    } else if (entry.isFile() && /\.spec\.ts$/.test(entry.name)) {
      out.push(full);
    }
  }
  return out;
}

function isTestFixmeOrSkip(node: ts.CallExpression): { method: 'fixme' | 'skip' } | null {
  const expr = node.expression;
  if (!ts.isPropertyAccessExpression(expr)) return null;
  // Suporta `test.fixme(...)` e `test.skip(...)` e similar — NÃO `test.fixme.something()`.
  if (!ts.isIdentifier(expr.expression)) return null;
  // O objeto pode ser `test` (mais comum) ou outros aliases que terminam em test
  // (ex.: `myTest.fixme`). Aceito qualquer identifier.expression de membro `fixme`/`skip`.
  const method = expr.name.text;
  if (method !== 'fixme' && method !== 'skip') return null;
  return { method: method as 'fixme' | 'skip' };
}

/**
 * Avalia se um node ts.Expression é uma string não-vazia (ou expressão que
 * produz uma string não-vazia). Aceita:
 * - StringLiteral / NoSubstitutionTemplateLiteral / TemplateExpression
 *   com texto > 0 após trim
 * - Concatenação `'a' + 'b'` ou `\`a\` + b` (ambos lados strings/templates)
 * - PropertyAccessExpression (`Data.reason`) — tratamos como aceitável (não
 *   podemos resolver valor sem type-check completo)
 * - Identifier (`reason`) — aceito (var importada)
 * - BinaryExpression de concatenação com qualquer dos acima
 */
function isNonEmptyStringExpr(node: ts.Expression): boolean {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    return node.text.trim().length > 0;
  }
  if (ts.isTemplateExpression(node)) {
    // Tem expressões → produz string não-vazia (template head ou parts)
    return true;
  }
  if (ts.isBinaryExpression(node) && node.operatorToken.kind === ts.SyntaxKind.PlusToken) {
    return isNonEmptyStringExpr(node.left) || isNonEmptyStringExpr(node.right);
  }
  if (ts.isIdentifier(node) || ts.isPropertyAccessExpression(node) || ts.isCallExpression(node)) {
    // Não conseguimos resolver estaticamente; aceitamos como provável-string.
    return true;
  }
  return false;
}

/**
 * Classifica a chamada como válida ou inválida:
 * - `test.fixme('title', fn)` → INVÁLIDA (forma declarativa, sem reason)
 * - `test.fixme(true)` ou `test.fixme(condition)` → INVÁLIDA
 * - `test.fixme(condition, 'reason' não-vazia)` → VÁLIDA
 * - `test.fixme()` sem args → INVÁLIDA (skipa toda a suíte sem motivo)
 */
function classify(node: ts.CallExpression, method: 'fixme' | 'skip'): { ok: true } | { ok: false; reason: string } {
  const args = node.arguments;
  if (args.length === 0) {
    return { ok: false, reason: `\`test.${method}()\` sem argumentos pula toda a suíte/test sem justificativa.` };
  }
  if (args.length === 1) {
    // Pode ser declarativo `test.fixme('title')` OU `test.fixme(condition)` runtime
    if (ts.isStringLiteral(args[0]) || ts.isNoSubstitutionTemplateLiteral(args[0]) || ts.isTemplateExpression(args[0])) {
      return { ok: false, reason: `Forma declarativa \`test.${method}('title')\` não permite registrar razão. Use \`test('title', async (...) => { test.${method}(true, 'razão'); ... })\`.` };
    }
    return { ok: false, reason: `\`test.${method}(condition)\` sem segundo argumento — razão obrigatória.` };
  }
  // 2+ args
  const first = args[0];
  const second = args[1];
  // Forma declarativa `test.fixme('title', fn)` — title é string, fn é arrow/function
  const firstIsString =
    ts.isStringLiteral(first) ||
    ts.isNoSubstitutionTemplateLiteral(first) ||
    ts.isTemplateExpression(first);
  const secondIsFn = ts.isArrowFunction(second) || ts.isFunctionExpression(second);
  if (firstIsString && secondIsFn) {
    return {
      ok: false,
      reason: `Forma declarativa \`test.${method}('title', fn)\` NÃO captura razão no JSON reporter — o relatório fica com "ignorado sem justificativa registrada". Substitua por \`test('title', async (...) => { test.${method}(true, 'razão'); ... })\`.`,
    };
  }
  // Runtime form `test.fixme(condition, reason)` — valida reason
  if (!isNonEmptyStringExpr(second)) {
    return { ok: false, reason: `Segundo argumento (razão) está vazio ou não é uma string reconhecível.` };
  }
  return { ok: true };
}

function checkFile(file: string): Violation[] {
  const src = readFileSync(file, 'utf-8');
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
  const violations: Violation[] = [];
  function visit(node: ts.Node): void {
    if (ts.isCallExpression(node)) {
      const match = isTestFixmeOrSkip(node);
      if (match) {
        const verdict = classify(node, match.method);
        if (!verdict.ok) {
          const { line, character } = sf.getLineAndCharacterOfPosition(node.getStart(sf));
          const snippet = src.slice(node.getStart(sf), Math.min(node.getEnd(), node.getStart(sf) + 140)).replace(/\s+/g, ' ');
          violations.push({
            file,
            line: line + 1,
            col: character + 1,
            callee: `test.${match.method}`,
            reason: verdict.reason,
            snippet,
          });
        }
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sf);
  return violations;
}

function main(): void {
  const specs = listSpecs(ROOT);
  const all: Violation[] = [];
  for (const spec of specs) {
    all.push(...checkFile(spec));
  }
  if (all.length === 0) {
    console.log(`✅ Nenhuma violação encontrada — ${specs.length} spec(s) verificado(s). Todos os \`test.fixme\` / \`test.skip\` registram justificativa.`);
    process.exit(0);
  }
  console.error(`❌ ${all.length} violação(ões) de "fixme/skip sem justificativa" em ${new Set(all.map((v) => v.file)).size} arquivo(s):\n`);
  for (const v of all) {
    console.error(`  ${relative(ROOT, v.file)}:${v.line}:${v.col}`);
    console.error(`    Callee: \`${v.callee}\``);
    console.error(`    Snippet: ${v.snippet}${v.snippet.length >= 140 ? '...' : ''}`);
    console.error(`    Motivo:  ${v.reason}`);
    console.error('');
  }
  console.error(
    'Forma correta:\n' +
      "  test('Title', async ({ page, step }) => {\n" +
      "    test.fixme(true, 'razão clara — dependência X não implementada');\n" +
      '    // ...\n' +
      '  });\n',
  );
  console.error('Regra: CLAUDE.md §regra dura "test.fixme/test.skip sem justificativa é PROIBIDO".');
  process.exit(1);
}

main();
