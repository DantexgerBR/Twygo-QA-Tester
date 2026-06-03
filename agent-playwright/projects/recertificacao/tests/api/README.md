# tests/api/

Specs Playwright para **testes de API** (TCs com `**Tipo**: api` no MD canônico).

## Convenções

- 1 arquivo por suíte de API: `<suite-slug>.spec.ts`
- Imports: clientes HTTP de `../../api/`, schemas de `../../schemas/`
- Cada `test()` valida no mínimo: `response.status()` + `validateAgainstSchema(body, schema)`
- Setup que exige UI (Flipper, Super Admin, contrato) usa POMs de `../../pages/` no `beforeAll`/`afterAll` — combinar é normal

## Execução

```bash
# Todos os specs de API
npx playwright test --project api

# Spec específico
npx playwright test --project api projects/recertificacao/tests/api/<arquivo>.spec.ts
```

## Referências

- [CONTRACT.md §16](../../../../../CONTRACT.md) — Convenção v1.2
- [agent-playwright/CLAUDE.md §7](../../../../CLAUDE.md) — Regras duras 14, 15, 16
- Skills: `testar-api-twygo`, `provisionar-token-api-twygo`, `validar-schema-api-twygo`
