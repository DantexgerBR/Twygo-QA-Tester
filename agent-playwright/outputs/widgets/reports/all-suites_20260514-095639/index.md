# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 14/05/2026, 09:56:39

> **Escopo:** Todas as testsuites (modo padrão)

> ❌ **3 caso(s) com falha precisam de atenção (1 crítico)**
>
> - 🟡 Normal [TC9 · Cancelar edição com alterações não salvas](tests.md#cancelar-edicao-com-alteracoes-nao-salvas) — Não foi possível clicar o elemento — ele não ficou disponível em 30s (locator: getByTestId('panel-layout-cancel-button')).
> - 🔴 Crítico [TC8 · Salvar layout pela barra de rodapé](tests.md#salvar-layout-pela-barra-de-rodape) — Error: expect(locator).toHaveCount(expected) failed
> - ⚪ Menor [TC10 · Toolbar permanece fixa ao rolar a área de layout](tests.md#toolbar-permanece-fixa-ao-rolar-a-area-de-layout) — TimeoutError: page.goto: Timeout 30000ms exceeded.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 11 | 8 | 3 | 0 | 889.4s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 2 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Layout das abas** | 11 | `[███████████████✗✗✗✗✗]` 8/3/0 | 73% | 3 | 0 | — | 889.4s |

## Bug Reports prontos pra task

_3 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **3** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC9 · Cancelar edição com alterações não salvas](bug-reports/layout-das-abas__cancelar-edicao-com-alteracoes-nao-salvas.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC8 · Salvar layout pela barra de rodapé](bug-reports/layout-das-abas__salvar-layout-pela-barra-de-rodape.md) | 🧪 spec-fragil | alta | baixa | Locator bate em N elementos — seletor não-único |
| [TC10 · Toolbar permanece fixa ao rolar a área de layout](bug-reports/layout-das-abas__toolbar-permanece-fixa-ao-rolar-a-area-de-layout.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (3)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
