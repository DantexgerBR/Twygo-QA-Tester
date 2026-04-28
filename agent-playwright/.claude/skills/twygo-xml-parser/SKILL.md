---
name: twygo-xml-parser
description: Converte arquivos XML de análise de teste (exportados do XMind) em JSON estruturado, validando a estrutura contra um schema XSD.
version: 1.0.0
---

# twygo-xml-parser

## Quando usar

Use esta skill sempre que o agente receber um arquivo XML em `inputs/test-analysis.xml`
e precisar transformá-lo em uma estrutura JSON consumível pelo
`twygo-test-executor`.

## Entradas

- **Obrigatório:** caminho para o XML (default: `inputs/test-analysis.xml`).
- **Opcional:** caminho do schema XSD (default: `templates/xml-schema.xsd`).

## Saídas

- JSON estruturado gravado em `outputs/test-analysis.parsed.json`.
- Código de saída `0` em sucesso, `1` em falha de validação.

## Formato do JSON de saída

```json
{
  "project": "Twygo Frontend - Módulo de Autenticação",
  "version": "1.0",
  "date": "2026-04-24",
  "scenarios": [
    {
      "id": "SC001",
      "name": "Autenticação de Usuários",
      "description": "...",
      "testCases": [
        {
          "id": "TC001",
          "name": "Login com credenciais válidas",
          "preconditions": ["..."],
          "steps": [
            { "id": "S001", "action": "navigate", "target": "login_page", "description": "..." }
          ],
          "assertions": [
            { "id": "R001", "type": "url_contains", "value": "/dashboard", "description": "..." }
          ]
        }
      ]
    }
  ]
}
```

## Execução manual

```bash
npm run agent:parse
# ou
tsx skills/twygo-xml-parser/parser.ts inputs/test-analysis.xml
```
