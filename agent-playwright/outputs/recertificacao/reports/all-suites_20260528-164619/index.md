# Relatório de Execução — Twygo QA

**Projeto:** Recertificação · **Ambiente:** `staging-recertificacao` · **Browsers:** chromium · **Gerado em:** 28/05/2026, 16:46:19

> **Escopo:** Todas as testsuites (modo padrão)

> ❌ **6 caso(s) com falha precisam de atenção (4 críticos)**
>
> - 🔴 Crítico [TC1 · Switch "Habilitar reinscrição" aparece com flag ON na edição de curso](tests.md#tc1-switch-habilitar-reinscricao-aparece-com-flag-on-na-edicao-de-curso) — Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\outputs\recertificacao\test-artifacts\.playwright-artifacts-0\traces\e050204b338df394c0ba-b5dabc3a5064
... [truncado, 257 chars total]
> - 🔴 Crítico [TC3 · Ativar e salvar o switch persiste `has_recertification = true`](tests.md#tc3-ativar-e-salvar-o-switch-persiste-has-recertification-true) — Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\outputs\recertificacao\test-artifacts\.playwright-artifacts-1\traces\ba81cb6a8ed721d18cdd-a3dc2048d10f
... [truncado, 257 chars total]
> - 🔴 Crítico [TC4 · Desativar o switch em curso com participants reinscritos é permitido sem aviso](tests.md#tc4-desativar-o-switch-em-curso-com-participants-reinscritos-e-permitido-sem-aviso) — Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open 'C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\outputs\recertificacao\test-artifacts\.playwright-artifacts-2\traces\2ab4896513641b86a513-385b09b41406
... [truncado, 257 chars total]
> - 🔴 Crítico [TC1 · Aluno reinscrito tem progress/score/attendance zerados na nova inscrição](tests.md#tc1-aluno-reinscrito-tem-progress-score-attendance-zerados-na-nova-inscricao) — Quantidade fora do esperado: deveria ser menor a < 400, mas obteve 422. Isso geralmente indica que a ação que deveria popular a tela (listagem/filtro/busca) ficou vazia ou retornou menos itens que o necessário.
> -  [TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false](tests.md#tc4-botao-reinscrever-fica-visivel-mas-desabilitado-quando-event-has-recertification-false) — TimeoutError: locator.innerText: Timeout 30000ms exceeded.
> -  [TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva](tests.md#tc2-recertificacao-de-user-nao-aprovado-retorna-422-com-mensagem-descritiva) — Quantidade fora do esperado: deveria ser maior a > 0, mas obteve 0. Isso geralmente indica que a ação que deveria popular a tela (listagem/filtro/busca) ficou vazia ou retornou menos itens que o necessário.

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 64 | 6 | 6 | 52 | 225.4s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 9 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Configuração de Conteúdo (Switch "Habilitar reinscrição")** | 5 | `[✗✗✗✗✗✗✗✗✗✗✗✗⊘⊘⊘⊘⊘⊘⊘⊘]` 0/3/2 | 0% | 3 | 2 | — | 0.0s |
| **Reinscrição Individual pelo Admin** | 6 | `[✗✗✗⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/1/5 | 0% | 1 | 5 | — | 31.9s |
| **Reinscrição em Massa pelo Admin** | 6 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/6 | 0% | 0 | 6 | — | 0.0s |
| **Reinscrição via Importação CSV** | 7 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/7 | 0% | 0 | 7 | — | 0.0s |
| **Reinscrição via API V2** | 3 | `[█████████████✗✗✗✗✗✗✗]` 2/1/0 | 67% | 1 | 0 | — | 2.3s |
| **Reinscrição pelo Aluno (Play e Link Público)** | 7 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/7 | 0% | 0 | 7 | — | 7.2s |
| **Cascade de Reinscrição em Trilhas** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Ciclo de Vida do Certificado Substituído** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Filtro Avançado Status Substituído** | 4 | `[████████████████████]` 4/0/0 | 100% | 0 | 0 | — | 158.8s |
| **E-mail Diferenciado de Reinscrição** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Isolamento de Progresso, Score e Attendance por Inscrição** | 4 | `[✗✗✗✗✗⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/1/3 | 0% | 1 | 3 | — | 25.2s |
| **Comportamento da Feature Flag :recertificacao** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Auditoria via Triggers PostgreSQL** | 4 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/4 | 0% | 0 | 4 | — | 0.0s |
| **Isolamento em Ambientes Adicionais** | 2 | `[⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘⊘]` 0/0/2 | 0% | 0 | 2 | — | 0.0s |

## Bug Reports prontos pra task

_6 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **5** inconclusivo · **1** spec-fragil

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 · Switch "Habilitar reinscrição" aparece com flag ON na edição de curso](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc1-switch-habilitar-reinscricao-aparece-com-flag-on-na-edicao-de-curso.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC3 · Ativar e salvar o switch persiste `has_recertification = true`](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc3-ativar-e-salvar-o-switch-persiste-has-recertification-true.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC4 · Desativar o switch em curso com participants reinscritos é permitido sem aviso](bug-reports/configuracao-de-conteudo-switch-habilitar-reinscricao__tc4-desativar-o-switch-em-curso-com-participants-reinscritos-e-permitido-sem-aviso.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC1 · Aluno reinscrito tem progress/score/attendance zerados na nova inscrição](bug-reports/isolamento-de-progresso-score-e-attendance-por-inscricao__tc1-aluno-reinscrito-tem-progress-score-attendance-zerados-na-nova-inscricao.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC4 — Botão "Reinscrever" fica visível mas DESABILITADO quando event.has_recertification = false](bug-reports/reinscricao-individual-pelo-admin__tc4-botao-reinscrever-fica-visivel-mas-desabilitado-quando-event-has-recertification-false.md) | 🧪 spec-fragil | media | baixa | Timeout sem HTTP error — possível wait/seletor frágil. Confirmar via chrome-mcp |
| [TC2 — Recertificação de user não-aprovado retorna 422 com mensagem descritiva](bug-reports/reinscricao-via-api-v2__tc2-recertificacao-de-user-nao-aprovado-retorna-422-com-mensagem-descritiva.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (6)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
