---
name: twygo-report-generator
description: Consolida o JSON de resultados do Playwright em um relatório HTML Twygo-branded com resumo, detalhes por cenário e links para screenshots/traces.
version: 1.0.0
---

# twygo-report-generator

## Quando usar

Após a execução dos testes, para transformar `outputs/test-results.json` em
um `outputs/test-report.html` legível por stakeholders não técnicos.

## Entrada

- `outputs/test-results.json` (gerado pelo reporter JSON do Playwright).
- `templates/report-template.html` como template base.

## Saída

- `outputs/test-report.html` — relatório estático, auto-contido.

## Execução manual

```bash
npm run agent:report
```

## Observações

- O relatório HTML do Playwright (`outputs/html-report/`) é **complementar** e
  permanece disponível via `npm run test:report`.
- Este gerador existe para entregar um sumário enxuto e branded para
  stakeholders — não substitui o relatório nativo.
