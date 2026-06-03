# Relatório de Execução — Twygo QA

**Projeto:** Recertificação · **Ambiente:** `staging-recertificacao` · **Browsers:** chromium · **Gerado em:** 01/06/2026, 14:31:41

> **Escopo:** Regressivo completo (todas as testsuites)

> ❌ **3 caso(s) com falha precisam de atenção (3 críticos)**
>
> - 🔴 Crítico [TC4 · Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente](tests.md#tc4-certificados-emitidos-no-fluxo-legado-sem-reinscricao-permanecem-valid-indefinidamente) — O elemento esperado não apareceu na tela (locator: locator('tbody tr').filter({ hasText: 'richard.sebold@twygo.com' }).filter({ hasText: /Emitido/i }).first()).
> - 🔴 Crítico [TC3 · Ativar e salvar o switch persiste `has_recertification = true`](tests.md#tc3-ativar-e-salvar-o-switch-persiste-has-recertification-true) — A condição esperada não se tornou verdadeira dentro do tempo limite — a UI não chegou ao estado aguardado.
> - 🔴 Crítico [TC4 · Desativar o switch em curso com participants reinscritos é permitido sem aviso](tests.md#tc4-desativar-o-switch-em-curso-com-participants-reinscritos-e-permitido-sem-aviso) — A condição esperada não se tornou verdadeira dentro do tempo limite — a UI não chegou ao estado aguardado.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 68 | 7 | 3 | 58 | 235.1s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 15 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Configuração de Conteúdo (Switch "Habilitar reinscrição")** | 5 | `[████✗✗✗✗✗✗✗✗⊘⊘⊘⊘⊘⊘⊘⊘]` 1/2/2 | 20% | 2 | 2 | — | 71.7s |
| **Reinscrição Individual pelo Admin** | 6 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/6 | 0% | 0 | 6 | — | 0.0s |
| **Reinscrição em Massa pelo Admin** | 6 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/6 | 0% | 0 | 6 | — | 0.0s |
| **Reinscrição via Importação CSV** | 7 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/7 | 0% | 0 | 7 | — | 0.0s |
| **Reinscrição via API V2** | 7 | `[██████⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 2/0/5 | 29% | 0 | 5 | — | 1.1s |
| **Reinscrição pelo Aluno (Play e Link Público)** | 7 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/7 | 0% | 0 | 7 | — | 5.3s |
| **Cascade de Reinscrição em Trilhas** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Ciclo de Vida do Certificado Substituído** | 4 | `[✗✗✗✗✗⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/1/3 | 0% | 1 | 3 | — | 31.0s |
| **Filtro Avançado Status Substituído** | 4 | `[████████████████████]` 4/0/0 | 100% | 0 | 0 | — | 124.9s |
| **E-mail Diferenciado de Reinscrição** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Isolamento de Progresso, Score e Attendance por Inscrição** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 1.1s |
| **Comportamento da Feature Flag :recertificacao** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Auditoria via Triggers PostgreSQL** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Isolamento em Ambientes Adicionais** | 2 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/2 | 0% | 0 | 2 | — | 0.0s |

## Bug Reports prontos pra task

_3 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** inconclusivo · **2** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC4 · Certificados emitidos no fluxo legado (sem reinscrição) permanecem VALID indefinidamente](bug-reports/ciclo-de-vida-do-certificado-substituido__tc4-certificados-emitidos-no-fluxo-legado-sem-reinscricao-permanecem-valid-indefinidamente.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC3 · Ativar e salvar o switch persiste `has_recertification = true`](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc3-ativar-e-salvar-o-switch-persiste-has-recertification-true.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC4 · Desativar o switch em curso com participants reinscritos é permitido sem aviso](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc4-desativar-o-switch-em-curso-com-participants-reinscritos-e-permitido-sem-aviso.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (3)
- 📊 [Allure (regressivo, com trend histórico)](../../allure-report/index.html) — relatório executivo HTML built-in do Allure

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
