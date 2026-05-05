---
name: db-test-executor
description: Executa validações em banco de dados a partir de casos de teste em inputs/. Lê o input, decide o modo (single ou batch via keyset pagination), chama queries parametrizadas read-only e devolve métricas estruturadas para o report-generator. Ponto de entrada para chamadas externas (CLI ou outros agentes).
---

# Skill: db-test-executor

> **Esqueleto** — conteúdo será populado após validação da estrutura pelo usuário.

## Responsabilidade

Orquestrador de execução: lê input → resolve query → executa → coleta métricas →
emite resultado padronizado.

## Quando ativa

- Quando o agente recebe instrução de "executar validações de banco" ou
  "rodar inputs/" ou um arquivo específico via `--input`.
- Não responsável por gerar SQL (delegado ao `db-query-builder`) nem por
  formatar relatório (delegado ao `db-report-generator`).

## Contrato (a detalhar)

- **Input**: caminho de arquivo em `inputs/` ou diretório completo.
- **Output**: dict com métricas por validação, gravado em
  `output/{slug}_{ts}/raw-metrics.json`.

## Pendências

- [ ] Definir formato canônico do input (XML TestLink? JSON próprio?)
- [ ] Detalhar matriz de validators suportados (ver tabela §5 do CLAUDE.md)
- [ ] Especificar política de retry e fail-fast
