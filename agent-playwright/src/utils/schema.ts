import Ajv, { type AnySchema, type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

/**
 * Valida `data` contra um JSON Schema (draft-2020-12) usando Ajv.
 *
 * **Quando usar**: em specs de `tests/api/` para validar o corpo da response
 * contra schema definido em `projects/<slug>/schemas/<endpoint>.schema.json`.
 * Substitui asserts frágeis tipo `expect(body.data.results[0].email).toBe('...')`
 * que quebram a cada renomeação de campo no backend.
 *
 * **Quando NÃO usar**: em specs UI (`tests/features/`) — esses validam
 * comportamento via DOM, não via shape de JSON. Schema validation é
 * complementar, não substituto, do que o `request` fixture já oferece
 * (`response.status()`, `response.ok()`, etc).
 *
 * **Comportamento**:
 * - Compila o schema na primeira chamada e cacheia por referência (JSON Schemas
 *   importados como módulos são objetos estáveis — cache funciona)
 * - Reporta TODOS os erros (não falha no primeiro) — `allErrors: true`
 * - Formatos `email`, `uri`, `date-time`, `uuid`, etc disponíveis via `ajv-formats`
 * - Lança `Error` com mensagem agregada legível quando falha
 *
 * @param data - Payload a validar (geralmente `await response.json()`)
 * @param schema - JSON Schema importado de `projects/<slug>/schemas/*.schema.json`
 * @param context - Opcional. String descritiva para a mensagem de erro
 *                  (ex: 'POST /api/v2/users/mass response')
 *
 * @example
 * ```ts
 * import schema from '../../schemas/mass-enrollment-response.schema.json';
 * import { validateAgainstSchema } from '../../../../src/utils/schema';
 *
 * test('TC1', async ({ request }) => {
 *   const response = await usersClient.createMass(payload, headers);
 *   expect([200, 207]).toContain(response.status());
 *   validateAgainstSchema(await response.json(), schema, 'POST /users/mass');
 * });
 * ```
 */
export function validateAgainstSchema<T = unknown>(
  data: unknown,
  schema: AnySchema,
  context = 'response',
): asserts data is T {
  const validate = getValidator(schema);
  const isValid = validate(data);
  if (!isValid) {
    throw new Error(formatSchemaErrors(validate.errors ?? [], context));
  }
}

// ---------------------------------------------------------------------------
// Implementação interna
// ---------------------------------------------------------------------------

const ajv = new Ajv({
  allErrors: true,
  strict: false,
  validateFormats: true,
});
addFormats(ajv);

const validatorCache = new WeakMap<object, ValidateFunction>();

function getValidator(schema: AnySchema): ValidateFunction {
  if (typeof schema !== 'object' || schema === null) {
    // Schema booleano (true/false) ou inválido — compila on-the-fly sem cache.
    return ajv.compile(schema);
  }
  const cached = validatorCache.get(schema as object);
  if (cached) return cached;
  const compiled = ajv.compile(schema);
  validatorCache.set(schema as object, compiled);
  return compiled;
}

function formatSchemaErrors(errors: ErrorObject[], context: string): string {
  const lines = errors.map((err, idx) => {
    const path = err.instancePath || '(root)';
    const detail = err.message ?? 'invalid';
    const params = err.params ? ` — ${JSON.stringify(err.params)}` : '';
    return `  ${idx + 1}. ${path}: ${detail}${params}`;
  });
  return [
    `Schema validation failed for ${context} (${errors.length} error${errors.length === 1 ? '' : 's'}):`,
    ...lines,
  ].join('\n');
}
