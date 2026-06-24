# Relatório de Execução — Twygo QA

**Projeto:** Registros de Aprendizagem · **Ambiente:** `staging-registros-externos` · **Browsers:** chromium · **Gerado em:** 23/06/2026, 16:46:06

> **Escopo:** Apenas testsuite contendo "Extração de dados e evidências (assíncrona com modal de atenção)"

> ❌ **5 caso(s) com falha precisam de atenção (4 críticos)**
>
> - 🔴 Crítico [TC4 · Validar extração de dados CSV com toast de variação](tests.md#validar-extracao-de-dados-csv-com-toast-de-variacao) — Um elemento que deveria estar oculto continuou visível.
> - 🔴 Crítico [TC5 · Validar modal de Atenção para evidências faltantes](tests.md#validar-modal-de-atencao-para-evidencias-faltantes) — O elemento esperado não apareceu na tela (locator: locator('[role="alertdialog"], [role="dialog"]').filter({ hasText: /n[ãa]o t[êe]m evid[êe]ncia anexada|ser[ãa]o ignorados na extra/i })).
> - 🔴 Crítico [TC6 · Validar extração de evidências sem faltantes (modal não aparece)](tests.md#validar-extracao-de-evidencias-sem-faltantes-modal-nao-aparece) — O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada/i }).first()).
> - 🔴 Crítico [TC7 · Validar entrega assíncrona: e-mail e notificação no sino](tests.md#validar-entrega-assincrona-e-mail-e-notificacao-no-sino) — O elemento esperado não apareceu na tela (locator: locator('.chakra-toast').filter({ hasText: /Extra[çc][ãa]o iniciada: CSV com \d+ registros \(filtro atual · colunas do filtro\)\./i }).first()).
> - 🟡 Normal [TC9 · Validar reset do drawer ao reabrir](tests.md#validar-reset-do-drawer-ao-reabrir) — Error: expect(received).toBe(expected) // Object.is equality

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 9 | 3 | 5 | 1 | 148.3s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Extração de dados e evidências (assíncrona com modal de atenção)** | 9 | `[███████✗✗✗✗✗✗✗✗✗✗✗⊘⊘]` 3/5/1 | 33% | 5 | 1 | — | 148.3s |

## Bug Reports prontos pra task

_5 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **5** inconclusivo

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC4 · Validar extração de dados CSV com toast de variação](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-extracao-de-dados-csv-com-toast-de-variacao.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC5 · Validar modal de Atenção para evidências faltantes](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-modal-de-atencao-para-evidencias-faltantes.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC6 · Validar extração de evidências sem faltantes (modal não aparece)](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-extracao-de-evidencias-sem-faltantes-modal-nao-aparece.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC7 · Validar entrega assíncrona: e-mail e notificação no sino](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-entrega-assincrona-e-mail-e-notificacao-no-sino.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC9 · Validar reset do drawer ao reabrir](bug-reports/extracao-de-dados-e-evidencias-assincrona-com-modal-de-atencao__validar-reset-do-drawer-ao-reabrir.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (5)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
