# schemas/

JSON Schemas (draft-2020-12) para validação de responses dos endpoints testados em `../tests/api/`.

## Convenções

- 1 arquivo por endpoint/resposta: `<recurso>-<acao>-response.schema.json`
  - Ex: `attendees-create-response.schema.json`, `event-participants-response.schema.json`
- Schemas seguem JSON Schema **draft-2020-12** (suportado por Ajv 8+)
- Campos obrigatórios em `required: [...]`. Permitir `additionalProperties: true` para tolerar campos novos do backend (anti-pattern: `additionalProperties: false` quebra a cada release do backend)
- Validação no spec via `validateAgainstSchema(body, schema)` (helper canônico em `src/utils/schema.ts`)

## Como gerar a partir de exemplo

1. Capturar uma response real (Postman, curl, ou `console.log(await response.json())` num spec dummy)
2. Usar https://www.jsonschema.net/ ou helper TS para inferir schema
3. Revisar manualmente: marcar `required`, ajustar tipos, deixar `additionalProperties: true`
4. Salvar como `<recurso>-<acao>-response.schema.json`

## Exemplo (shape REAL validada live 2026-05-28)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Attendees create response (POST /api/v2/attendees)",
  "type": "object",
  "additionalProperties": true,
  "required": ["participants", "errors"],
  "properties": {
    "participants": {
      "type": "object",
      "properties": {
        "success": {
          "type": "object",
          "additionalProperties": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["email"],
              "properties": {
                "email": { "type": "string" },
                "cpf": { "type": "string" }
              }
            }
          }
        },
        "error": {
          "type": "object",
          "additionalProperties": {
            "type": "array",
            "items": {
              "type": "object",
              "required": ["email"],
              "properties": {
                "email": { "type": "string" },
                "cpf": { "type": ["string", "null"] },
                "error": { "type": "array", "items": { "type": "string" } }
              }
            }
          }
        }
      }
    },
    "errors": {
      "oneOf": [
        { "type": "string" },
        { "type": "array" }
      ]
    }
  }
}
```

## Referências

- [JSON Schema draft-2020-12](https://json-schema.org/draft/2020-12/release-notes)
- [Ajv docs](https://ajv.js.org/)
- Skill `validar-schema-api-twygo`
