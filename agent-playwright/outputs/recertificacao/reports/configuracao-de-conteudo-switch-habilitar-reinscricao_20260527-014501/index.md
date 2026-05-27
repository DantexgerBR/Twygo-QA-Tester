# Relatório de Execução — Twygo QA

**Projeto:** Recertificação · **Ambiente:** `staging-recertificacao` · **Browsers:** chromium · **Gerado em:** 27/05/2026, 01:45:01

> **Escopo:** Apenas testsuite contendo "Configuração de Conteúdo (Switch "Habilitar reinscrição")"

> ❌ **4 caso(s) com falha precisam de atenção**
>
> -  [TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso](tests.md#tc1-switch-habilitar-reinscricao-aparece-com-flag-on-na-edicao-de-curso) — TimeoutError: locator.innerText: Timeout 30000ms exceeded.
> -  [TC3 — Ativar e salvar o switch persiste `has_recertification = true`](tests.md#tc3-ativar-e-salvar-o-switch-persiste-has-recertification-true) — TimeoutError: locator.innerText: Timeout 30000ms exceeded.
> -  [TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso](tests.md#tc4-desativar-o-switch-em-curso-com-participants-reinscritos-e-permitido-sem-aviso) — TimeoutError: locator.innerText: Timeout 30000ms exceeded.
> -  [TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)](tests.md#tc5-paridade-do-switch-entre-formulario-haml-e-formulario-react-facelift) — TimeoutError: locator.innerText: Timeout 30000ms exceeded.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 0 | 4 | 1 | 0.0s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Configuração de Conteúdo (Switch "Habilitar reinscrição")** | 5 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗⊘⊘⊘⊘]` 0/4/1 | 0% | 4 | 1 | — | 0.0s |

## Bug Reports prontos pra task

_4 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **4** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc1-switch-habilitar-reinscricao-aparece-com-flag-on-na-edicao-de-curso.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC3 — Ativar e salvar o switch persiste `has_recertification = true`](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc3-ativar-e-salvar-o-switch-persiste-has-recertification-true.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc4-desativar-o-switch-em-curso-com-participants-reinscritos-e-permitido-sem-aviso.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc5-paridade-do-switch-entre-formulario-haml-e-formulario-react-facelift.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (4)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
