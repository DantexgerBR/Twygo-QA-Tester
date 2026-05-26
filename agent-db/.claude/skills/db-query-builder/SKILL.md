---
name: db-query-builder
description: Converte caso de teste declarativo (XML/JSON/MD em inputs/) em SQL parametrizado seguro. Carrega templates de queries por domínio, faz merge com parâmetros do caso, valida que nenhum operador de mutação foi injetado e devolve um objeto (sql, bindparams, mode) pronto para o db-test-executor.
---

# Skill: db-query-builder

> **Esqueleto** — conteúdo será populado após validação da estrutura pelo usuário.

## Responsabilidade

Tradutor caso-de-teste → SQL parametrizado. Nunca devolve SQL com valores
inline; sempre `text()` + bindparams nomeados.

## Quando ativa

- Antes de qualquer execução: o `db-test-executor` invoca esta skill por
  caso de teste para obter o `(sql, params, mode)`.
- Também usada standalone para "preview" de queries (modo dry-run).

## Templates (a popular)

- `src/queries/integridade/fk_not_null.sql.j2`
- `src/queries/creditos_ia/view_definition.sql.j2`
- `src/queries/indexacao/log_count_by_window.sql.j2`
- `src/queries/agente_atendimento/log_presence.sql.j2`

## Pendências

- [ ] Definir DSL declarativa para casos (tabela, coluna, operador, esperado)
- [ ] Implementar `MutationGuard` (regex + parser) que rejeita SQL não-SELECT
- [ ] Catálogo inicial de templates Jinja2 cobrindo os 8 tipos de validação
