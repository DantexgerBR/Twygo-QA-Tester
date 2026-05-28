# Relatório de Execução — Twygo QA

**Projeto:** Recertificação · **Ambiente:** `staging-recertificacao` · **Browsers:** chromium · **Gerado em:** 27/05/2026, 15:30:38

> **Escopo:** Apenas testsuite contendo "Isolamento de Progresso, Score e Attendance por Inscrição"

> ❌ **1 caso(s) com falha precisam de atenção (1 crítico)**
>
> - 🔴 Crítico [TC1 · Aluno reinscrito tem progress/score/attendance zerados na nova inscrição](tests.md#tc1-aluno-reinscrito-tem-progress-score-attendance-zerados-na-nova-inscricao) — Quantidade fora do esperado: deveria ser menor a < 400, mas obteve 422. Isso geralmente indica que a ação que deveria popular a tela (listagem/filtro/busca) ficou vazia ou retornou menos itens que o necessário.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 4 | 0 | 1 | 3 | 28.8s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 0 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Isolamento de Progresso, Score e Attendance por Inscrição** | 4 | `[✗✗✗✗✗⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/1/3 | 0% | 1 | 3 | — | 28.8s |

## Bug Reports prontos pra task

_1 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **1** inconclusivo

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 · Aluno reinscrito tem progress/score/attendance zerados na nova inscrição](bug-reports/isolamento-de-progresso-score-e-attendance-por-inscricao__tc1-aluno-reinscrito-tem-progress-score-attendance-zerados-na-nova-inscricao.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (1)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
