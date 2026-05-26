# Relatório de Execução — Twygo QA

**Projeto:** Recertificação · **Ambiente:** `staging-recertificacao` · **Browsers:** chromium · **Gerado em:** 26/05/2026, 15:52:34

> **Escopo:** Apenas testsuite contendo "Configuração de Conteúdo (Switch "Habilitar reinscrição")"

> ❌ **4 caso(s) com falha precisam de atenção**
>
> -  [TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso](tests.md#tc1-switch-habilitar-reinscricao-aparece-com-flag-on-na-edicao-de-curso) — A condição esperada não se tornou verdadeira dentro do tempo limite — a UI não chegou ao estado aguardado.
> -  [TC3 — Ativar e salvar o switch persiste `has_recertification = true`](tests.md#tc3-ativar-e-salvar-o-switch-persiste-has-recertification-true) — A condição esperada não se tornou verdadeira dentro do tempo limite — a UI não chegou ao estado aguardado.
> -  [TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso](tests.md#tc4-desativar-o-switch-em-curso-com-participants-reinscritos-e-permitido-sem-aviso) — A condição esperada não se tornou verdadeira dentro do tempo limite — a UI não chegou ao estado aguardado.
> -  [TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)](tests.md#tc5-paridade-do-switch-entre-formulario-haml-e-formulario-react-facelift) — O elemento esperado não apareceu na tela (locator: getByRole('checkbox', { name: /Habilitar reinscrição/i })).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 0 | 4 | 1 | 55.9s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Configuração de Conteúdo (Switch "Habilitar reinscrição")** | 5 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗⊘⊘⊘⊘]` 0/4/1 | 0% | 4 | 1 | — | 55.9s |

## Bug Reports prontos pra task

_4 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **3** spec-fragil · **1** inconclusivo

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc1-switch-habilitar-reinscricao-aparece-com-flag-on-na-edicao-de-curso.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC3 — Ativar e salvar o switch persiste `has_recertification = true`](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc3-ativar-e-salvar-o-switch-persiste-has-recertification-true.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc4-desativar-o-switch-em-curso-com-participants-reinscritos-e-permitido-sem-aviso.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc5-paridade-do-switch-entre-formulario-haml-e-formulario-react-facelift.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

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
