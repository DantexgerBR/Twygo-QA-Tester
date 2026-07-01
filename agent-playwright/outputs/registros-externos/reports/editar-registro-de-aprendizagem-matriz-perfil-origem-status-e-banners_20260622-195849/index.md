# Relatório de Execução — Twygo QA

**Projeto:** Registros de Aprendizagem · **Ambiente:** `staging-registros-externos` · **Browsers:** chromium · **Gerado em:** 22/06/2026, 19:58:49

> **Escopo:** Apenas testsuite contendo "Editar registro de aprendizagem (matriz perfil × origem × status e banners)"

> ❌ **8 caso(s) com falha precisam de atenção (8 críticos)**
>
> - 🔴 Crítico [TC1 · Validar disponibilidade do "Editar" para o Aluno (matriz origem × status)](tests.md#validar-disponibilidade-do-editar-para-o-aluno-matriz-origem-status) — Error: menu observado: [Editar, Excluir, Visualizar, Evidências, Histórico]
> - 🔴 Crítico [TC10 · Validar banner verde de registro Emitido](tests.md#validar-banner-verde-de-registro-emitido) — O elemento esperado não apareceu na tela (locator: getByText('Certificado aprovado').first()).
> - 🔴 Crítico [TC2 · Validar disponibilidade do "Editar" para o Admin (matriz origem × status)](tests.md#validar-disponibilidade-do-editar-para-o-admin-matriz-origem-status) — Error: seed: Externo Pendente
> - 🔴 Crítico [TC3 · Validar cabeçalhos do form de edição por perfil](tests.md#validar-cabecalhos-do-form-de-edicao-por-perfil) — O elemento esperado não apareceu na tela (locator: getByText('Editar registro', { exact: true }).first()).
> - 🔴 Crítico [TC4 · Validar pré-população dos campos na edição](tests.md#validar-pre-populacao-dos-campos-na-edicao) — Valor preenchido no campo não bate com o esperado (esperado: /\d{4}-\d{2}-\d{2}/).
> - 🔴 Crítico [TC5 · Validar campo Pessoa desabilitado na edição do Admin](tests.md#validar-campo-pessoa-desabilitado-na-edicao-do-admin) — Error: expect(locator).toBeDisabled() failed
> - 🔴 Crítico [TC8 · Validar presença condicional do botão "Excluir" no rodapé](tests.md#validar-presenca-condicional-do-botao-excluir-no-rodape) — O elemento esperado não apareceu na tela (locator: getByRole('button', { name: 'Excluir', exact: true })).
> - 🔴 Crítico [TC9 · Validar banner vermelho de registro Recusado com justificativa](tests.md#validar-banner-vermelho-de-registro-recusado-com-justificativa) — O elemento esperado não apareceu na tela (locator: getByRole('button', { name: /Histórico/i }).first()).

## Casos de teste (XML)

| Total | ✅ Aprovados | ❌ Falhas | ⊘ Ignorados | Duração |
|---:|---:|---:|---:|---:|
| 10 | 2 | 8 | 0 | 364.1s |

## Validação Exploratória

| ❌ Erros | ⚠️ Avisos | ℹ️ Informativos | Testsuites c/ findings |
|---:|---:|---:|---:|
| 0 | 0 | 0 | 1 |

## Por testsuite

| Testsuite | Total | Distribuição (✅/❌/⊘) | %Pass | ❌ | ⊘ | Findings | Tempo |
|---|---:|---|---:|---:|---:|---|---:|
| **Editar registro de aprendizagem (matriz perfil × origem × status e banners)** | 10 | `[████✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗✗]` 2/8/0 | 20% | 8 | 0 | — | 364.1s |

## Bug Reports prontos pra task

_7 TC(s) red transformados em registro estruturado pronto pra virar issue. Campos `[REVISAR]` precisam de validação humana antes da abertura da task._

**Distribuição**: **7** inconclusivo

| TC | Categoria | Confiança | Severity | Justificativa |
|---|---|---|---|---|
| [TC1 · Validar disponibilidade do "Editar" para o Aluno (matriz origem × status)](bug-reports/editar-registro-de-aprendizagem-matriz-perfil-origem-status-e-banners__validar-disponibilidade-do-editar-para-o-aluno-matriz-origem-status.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC10 · Validar banner verde de registro Emitido](bug-reports/editar-registro-de-aprendizagem-matriz-perfil-origem-status-e-banners__validar-banner-verde-de-registro-emitido.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC2 · Validar disponibilidade do "Editar" para o Admin (matriz origem × status)](bug-reports/editar-registro-de-aprendizagem-matriz-perfil-origem-status-e-banners__validar-disponibilidade-do-editar-para-o-admin-matriz-origem-status.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC3 · Validar cabeçalhos do form de edição por perfil](bug-reports/editar-registro-de-aprendizagem-matriz-perfil-origem-status-e-banners__validar-cabecalhos-do-form-de-edicao-por-perfil.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC4 · Validar pré-população dos campos na edição](bug-reports/editar-registro-de-aprendizagem-matriz-perfil-origem-status-e-banners__validar-pre-populacao-dos-campos-na-edicao.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC5 · Validar campo Pessoa desabilitado na edição do Admin](bug-reports/editar-registro-de-aprendizagem-matriz-perfil-origem-status-e-banners__validar-campo-pessoa-desabilitado-na-edicao-do-admin.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |
| [TC8 · Validar presença condicional do botão "Excluir" no rodapé](bug-reports/editar-registro-de-aprendizagem-matriz-perfil-origem-status-e-banners__validar-presenca-condicional-do-botao-excluir-no-rodape.md) | ❓ inconclusivo | baixa | media | Sem sinal Network in-scope ou padrão de erro conhecido — revisar trace |

> Dados brutos: [`bug-reports.json`](bug-reports.json)

## Onde ir agora

- 📋 [Casos de teste detalhados](tests.md)
- 🐛 [Validação exploratória](exploratory.md)
- 📝 [Bug Reports prontos](#bug-reports-prontos-pra-task) (7)

## Dados brutos (JSON)

- [`summary.json`](summary.json) — totais agregados
- [`tests.json`](tests.json) — Playwright JSON reporter
- [`exploratory.json`](exploratory.json) — findings exploratórios
- [`bug-reports.json`](bug-reports.json) — registros estruturados pra task
- [`run_context.json`](run_context.json) — projectName, environment, browsers, mode, timestamp
