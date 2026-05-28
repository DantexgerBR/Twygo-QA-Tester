# schemas/

JSON Schemas (draft-2020-12) para validação de responses dos endpoints testados em `../tests/api/`.

## Convenções

- 1 arquivo por endpoint/resposta: `<recurso>-<acao>-response.schema.json`
  - Ex: `mass-enrollment-response.schema.json`, `event-participants-response.schema.json`
- Schemas seguem JSON Schema **draft-2020-12** (suportado por Ajv 8+)
- Campos obrigatórios em `required: [...]`. Permitir `additionalProperties: true` para tolerar campos novos do backend (anti-pattern: `additionalProperties: false` quebra a cada release do backend)
- Validação no spec via `validateAgainstSchema(body, schema)` (helper canônico em `src/utils/schema.ts`)

## Como gerar a partir de exemplo

1. Capturar uma response real (Postman, curl, ou `console.log(await response.json())` num spec dummy)
2. Usar https://www.jsonschema.net/ ou helper TS para inferir schema
3. Revisar manualmente: marcar `required`, ajustar tipos, deixar `additionalProperties: true`
4. Salvar como `<recurso>-<acao>-response.schema.json`

## Exemplo

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Mass enrollment response (POST /api/v2/users/mass)",
  "type": "object",
  "additionalProperties": true,
  "required": ["data"],
  "properties": {
    "data": {
      "type": "object",
      "required": ["results"],
      "properties": {
        "results": {
          "type": "array",
          "items": {
            "type": "object",
            "required": ["email", "status"],
            "properties": {
              "email": { "type": "string", "format": "email" },
              "status": { "enum": ["success", "error"] },
              "participant_id": { "type": "integer" },
              "error": { "type": "object" }
            }
          }
        }
      }
    }
  }
}
```

## Referências

- [JSON Schema draft-2020-12](https://json-schema.org/draft/2020-12/release-notes)
- [Ajv docs](https://ajv.js.org/)
- Skill `validar-schema-api-twygo`
