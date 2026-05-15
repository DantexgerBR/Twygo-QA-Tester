# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 14/05/2026, 12:09:42

> **Escopo:** Apenas testsuite contendo "Modo de uso - Painéis do usuário"

> ❌ **2 caso(s) com falha precisam de atenção (1 crítico)**
>
> - 🟡 Normal [TC2 · Listar painéis disponíveis no campo 'Espaço'](tests.md#listar-paineis-disponiveis-no-campo-espaco) — Error: expect(received).toBe(expected) // Object.is equality
> - 🔴 Crítico [TC1 · Selecionar 'Painéis do usuário' como modelo de página no modo de uso](tests.md#selecionar-paineis-do-usuario-como-modelo-de-pagina-no-modo-de-uso) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: locator('[id^="react-select-"][id$="-option-0"]').first()).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 3 | 0 | 2 | 1 | 65.7s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Modo de uso - Painéis do usuário** | 3 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗⊘⊘⊘⊘⊘⊘⊘]` 0/2/1 | 0% | 2 | 1 | — | 65.7s |

## Bug Reports prontos pra task

_2 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** inconclusivo · **1** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC2 · Listar painéis disponíveis no campo 'Espaço'](bug-reports/modo-de-uso-paineis-do-usuario__listar-paineis-disponiveis-no-campo-espaco.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC1 · Selecionar 'Painéis do usuário' como modelo de página no modo de uso](bug-reports/modo-de-uso-paineis-do-usuario__selecionar-paineis-do-usuario-como-modelo-de-pagina-no-modo-de-uso.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (2)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
