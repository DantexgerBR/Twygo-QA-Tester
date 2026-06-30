# Relatório de Execução — Twygo QA

**Projeto:** Registros de Aprendizagem · **Ambiente:** `staging-registros-externos` · **Browsers:** chromium · **Gerado em:** 25/06/2026, 17:15:01

> **Escopo:** Apenas testsuite contendo "Avaliar registro externo pendente (Aprovar/Recusar com justificativa)"

> ❌ **4 caso(s) com falha precisam de atenção (4 críticos)**
>
> - 🔴 Crítico [TC1 · Validar disponibilidade do "Avaliar" como item primário do menu](tests.md#validar-disponibilidade-do-avaliar-como-item-primario-do-menu) — Error: RN50: Externo Pendente não deve ter Editar/Excluir (achou: edit
> - 🔴 Crítico [TC2 · Validar form em modo avaliação (banner, campos e rodapé)](tests.md#validar-form-em-modo-avaliacao-banner-campos-e-rodape) — O elemento esperado não apareceu na tela (locator: getByText(/Avaliação pendente/i).first()).
> - 🔴 Crítico [TC3 · Validar obrigatoriedade do Tipo de experiência ao Aprovar](tests.md#validar-obrigatoriedade-do-tipo-de-experiencia-ao-aprovar) — O elemento esperado não apareceu na tela (locator: locator('.chakra-form-control').filter({ has: locator('label').filter({ hasText: /^Tipo de experiência/ }) }).first().getByText(/Campo obrigatório/i).first()).
> - 🔴 Crítico [TC6 · Validar fluxo completo de recusa e visibilidade da justificativa](tests.md#validar-fluxo-completo-de-recusa-e-visibilidade-da-justificativa) — O elemento esperado não apareceu na tela (locator: locator('.chakra-modal__content, [role="dialog"]').filter({ hasText: /Histórico/i }).first()).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 9 | 4 | 4 | 1 | 234.4s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Avaliar registro externo pendente (Aprovar/Recusar com justificativa)** | 9 | `[█████████✗✗✗✗✗✗✗✗✗⊘⊘]` 4/4/1 | 44% | 4 | 1 | — | 234.4s |

## Bug Reports prontos pra task

_4 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **4** inconclusivo

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 · Validar disponibilidade do "Avaliar" como item primário do menu](bug-reports/avaliar-registro-externo-pendente-aprovar-recusar-com-justificativa__validar-disponibilidade-do-avaliar-como-item-primario-do-menu.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Validar form em modo avaliação (banner, campos e rodapé)](bug-reports/avaliar-registro-externo-pendente-aprovar-recusar-com-justificativa__validar-form-em-modo-avaliacao-banner-campos-e-rodape.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC3 · Validar obrigatoriedade do Tipo de experiência ao Aprovar](bug-reports/avaliar-registro-externo-pendente-aprovar-recusar-com-justificativa__validar-obrigatoriedade-do-tipo-de-experiencia-ao-aprovar.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC6 · Validar fluxo completo de recusa e visibilidade da justificativa](bug-reports/avaliar-registro-externo-pendente-aprovar-recusar-com-justificativa__validar-fluxo-completo-de-recusa-e-visibilidade-da-justificativa.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

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
