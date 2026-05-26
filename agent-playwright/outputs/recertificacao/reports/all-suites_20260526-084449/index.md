# Relatório de Execução — Twygo QA

**Projeto:** Recertificação · **Ambiente:** `staging-base-de-conhecimento` · **Browsers:** chromium · **Gerado em:** 26/05/2026, 08:44:49

> **Escopo:** Todas as testsuites (modo padrão)

> ✅ **Nenhuma falha registrada** — todos os 65 caso(s) executado(s) foram aprovados.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 65 | 0 | 0 | 65 | 10.0s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 8 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Configuração de Conteúdo (Switch "Habilitar reinscrição")** | 5 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/5 | 0% | 0 | 5 | — | 0.0s |
| **Reinscrição Individual pelo Admin** | 6 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/6 | 0% | 0 | 6 | — | 0.0s |
| **Reinscrição em Massa pelo Admin** | 6 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/6 | 0% | 0 | 6 | — | 0.0s |
| **Reinscrição via Importação CSV** | 7 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/7 | 0% | 0 | 7 | — | 0.0s |
| **Reinscrição via API V2** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Reinscrição pelo Aluno (Play e Link Público)** | 7 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/7 | 0% | 0 | 7 | — | 6.5s |
| **Cascade de Reinscrição em Trilhas** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Ciclo de Vida do Certificado Substituído** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Filtro Avançado Status Substituído** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **E-mail Diferenciado de Reinscrição** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Isolamento de Progresso, Score e Attendance por Inscrição** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 3.5s |
| **Comportamento da Feature Flag :recertificacao** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Auditoria via Triggers PostgreSQL** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Isolamento em Ambientes Adicionais** | 2 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/2 | 0% | 0 | 2 | — | 0.0s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
