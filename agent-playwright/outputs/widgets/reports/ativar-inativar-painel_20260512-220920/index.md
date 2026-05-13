# Relatório de Execução — Twygo QA

**Projeto:** Widgets · **Ambiente:** `staging-widgets` · **Browsers:** chromium · **Gerado em:** 12/05/2026, 22:09:20

> **Escopo:** Apenas testsuite contendo "Ativar / Inativar painel"

> ❌ **5 caso(s) com falha precisam de atenção (4 críticos)**
>
> - 🔴 Crítico [Ativar um painel previamente inativo](tests.md#ativar-um-painel-previamente-inativo) — Error: aguardando toggle ou modal após click no switch de "Painel Ativar TC2 w0-1778634466987"
> - 🔴 Crítico [Inativar um painel não associado a nenhum modo de uso](tests.md#inativar-um-painel-nao-associado-a-nenhum-modo-de-uso) — Error: aguardando toggle ou modal após click no switch de "Painel Inativar TC1 w1-1778634466989"
> - 🔴 Crítico [Tentar inativar painel associado a um ou mais modos de uso](tests.md#tentar-inativar-painel-associado-a-um-ou-mais-modos-de-uso) — A página não navegou para a URL esperada dentro do tempo limite.
> - 🔴 Crítico [Tentar reativar modo de uso vinculado a um painel inativo](tests.md#tentar-reativar-modo-de-uso-vinculado-a-um-painel-inativo) — A página não navegou para a URL esperada dentro do tempo limite.
> - 🟡 Normal [Verificar persistência do estado Ativo após reload](tests.md#verificar-persistencia-do-estado-ativo-apos-reload) — Error: aguardando toggle ou modal após click no switch de "Painel Persistencia TC5 w4-1778634492195"

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 5 | 0 | 5 | 0 | 23.3s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Ativar / Inativar painel** | 5 | `[✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 0/5/0 | 0% | 5 | 0 | — | 23.3s |

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
