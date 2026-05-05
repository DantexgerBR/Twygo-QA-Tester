---
name: db-report-generator
description: Consolida métricas de validações em output/{slug}_{ts}/ produzindo report.json (máquina-legível, consumível por agentes upstream), report.html (Jinja2, com expanders para queries e linhas divergentes) e evidence/*.csv (top-N de registros divergentes por validação).
---

# Skill: db-report-generator

> **Esqueleto** — conteúdo será populado após validação da estrutura pelo usuário.

## Responsabilidade

Renderizador final: recebe métricas brutas do `db-test-executor` e produz
artefatos versionáveis para auditoria.

## Saídas

```
output/{slug}_{ts}/
├── report.json          # contrato estável p/ agente AT consumir
├── report.html          # human-friendly, baseado em templates/
├── evidence/
│   ├── {validation}_diverging_rows.csv
│   └── {validation}_query.sql
└── summary.txt          # resumo 1-tela para CI
```

## Templates (a popular)

- `templates/report.html.j2` (estilo herdado do migration-validator)
- `templates/summary.txt.j2`

## Pendências

- [ ] Definir schema do `report.json` (versionado, ex.: `schema_version: 1`)
- [ ] Decidir se mantemos compatibilidade com formato do `migration-validator`
      ou criamos schema novo
- [ ] Implementar export para Allure (opcional, para integrar com agent-playwright)
