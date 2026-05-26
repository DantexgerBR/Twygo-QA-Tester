# Triage Report — Modelos de conteúdo — 2026-05-25 11:15

**Escopo**: Regressão (todos os testsuites) · **Ambiente**: `staging-base-de-conhecimento`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 78 | 24 | 37 | 17 | 0 erros · 0 warnings · 0 info |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ❌ Falhas pra triagem

### [F1] Ações Duplicar e Drag and Drop · "Duplicar modelo com cópia profunda"

- **Arquivo**: `projects/modelos/tests/features/acoes-duplicar-e-drag-and-drop/tc01-duplicar-modelo-copia-profunda.spec.ts`
- **Status**: failed · **Duração**: 22.8s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\acoes-duplicar-e-drag-and-drop\tc01-duplicar-modelo-copia-profunda.spec.ts:30`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-test-id="content-models-page"] p.css-1mjnzuf').filter({ hasText: 'Modelo Seed Ativo' }).locator('xpath=ancestor::div[contains(@class, "css-fuvrtk")][1]').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem de modelos | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F2] Criação de Design de Página · "Auto-preenchimento ao selecionar tipo "Capa""

- **Arquivo**: `projects/modelos/tests/features/criacao-de-design-de-pagina/tc03-autofill-tipo-capa.spec.ts`
- **Status**: failed · **Duração**: 33.7s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-design-de-pagina\tc03-autofill-tipo-capa.spec.ts:22`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-8db40-to-ao-selecionar-tipo-Capa--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-8db40-to-ao-selecionar-tipo-Capa--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-8db40-to-ao-selecionar-tipo-Capa--chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('0 / 500').first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir tela de criação Página | ✅ |
| 2 | 2. Validar contadores zerados ANTES de selecionar Tipo | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F3] Criação de Modelo - Aba Estrutura do Conteúdo · "Carga horária exibe 5 opções literais"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc05-carga-horaria-5-opcoes.spec.ts`
- **Status**: failed · **Duração**: 19.4s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-modelo-aba-estrutura-do-conteudo\tc05-carga-horaria-5-opcoes.spec.ts:20`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-62b2e-ria-exibe-5-opções-literais-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-62b2e-ria-exibe-5-opções-literais-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-62b2e-ria-exibe-5-opções-literais-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(received).toEqual(expected) // deep equality

Expected: ArrayContaining ["Micro", "Curto", "Médio", "Estendido", "Longo"]
Received: ["Selecione", "Micro (30 segundos a 5 minutos)", "Curto (5 a 15 minutos)", "Médio (15 a 30 minutos)", "Estendido (30 a 60 minutos)", "Longo (1 a 2 horas)"]
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Estrutura | ✅ |
| 2 | 2. Ler options de "Carga horária" e validar as 5 esperadas | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F4] Criação de Modelo - Aba Estrutura do Conteúdo · "Switch "Incluir questionários" exibe configurações básicas"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc06-switch-incluir-questionarios.spec.ts`
- **Status**: failed · **Duração**: 39.4s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:185`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#play-interest-search')

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Estrutura com seção "Questionários ao longo do conteúdo" | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F5] Criação de Modelo - Aba Estrutura do Conteúdo · "Switch "Configurações avançadas" exibe campos adicionais"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc07-switch-configuracoes-avancadas.spec.ts`
- **Status**: failed · **Duração**: 38.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:185`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-8c90b-das-exibe-campos-adicionais-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-8c90b-das-exibe-campos-adicionais-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-8c90b-das-exibe-campos-adicionais-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#play-interest-search')

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Estrutura | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F6] Criação de Modelo - Aba Estrutura do Conteúdo · "Switch "Incluir prova final""

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc08-switch-incluir-prova-final.spec.ts`
- **Status**: failed · **Duração**: 41.2s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:185`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-27d82-Switch-Incluir-prova-final--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-27d82-Switch-Incluir-prova-final--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-27d82-Switch-Incluir-prova-final--chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#play-interest-search')

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Estrutura com seção "Prova final" | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F7] Criação de Modelo - Aba Identificação · "Criar modelo com dados válidos"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-identificacao/tc01-criar-modelo-com-dados-validos.spec.ts`
- **Status**: failed · **Duração**: 36.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:31`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-bd73d-ar-modelo-com-dados-válidos-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-bd73d-ar-modelo-com-dados-válidos-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-bd73d-ar-modelo-com-dados-válidos-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('tab', { name: 'Identificação', exact: true })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir tela de criação | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F8] Criação de Modelo - Aba Identificação · "Badge "Dica" aparece somente na criação"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-identificacao/tc02-badge-dica-aparece-na-criacao.spec.ts`
- **Status**: failed · **Duração**: 39.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:31`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-29bba--aparece-somente-na-criação-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-29bba--aparece-somente-na-criação-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-29bba--aparece-somente-na-criação-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('tab', { name: 'Identificação', exact: true })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir tela de criação | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F9] Criação de Modelo - Aba Identificação · "Badge "Dica" NÃO aparece na edição"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-identificacao/tc03-badge-dica-nao-aparece-na-edicao.spec.ts`
- **Status**: failed · **Duração**: 67.8s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-218f9--Dica-NÃO-aparece-na-edição-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-218f9--Dica-NÃO-aparece-na-edição-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-218f9--Dica-NÃO-aparece-na-edição-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem com pelo menos 1 modelo seedado | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F10] Criação de Modelo - Aba Identificação · "Validações negativas do campo Nome (matriz A-D)"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-identificacao/tc04-validar-nome-obrigatorio.spec.ts`
- **Status**: failed · **Duração**: 40.6s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:31`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-b0887-s-do-campo-Nome-matriz-A-D--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-b0887-s-do-campo-Nome-matriz-A-D--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-b0887-s-do-campo-Nome-matriz-A-D--chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('tab', { name: 'Identificação', exact: true })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | [A] "(vazio) — Nome obrigatório" | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F11] Criação de Modelo - Aba Identificação · "Validações negativas do campo Descrição (matriz B-D)"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-identificacao/tc05-limite-500-chars-descricao.spec.ts`
- **Status**: failed · **Duração**: 38.2s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:31`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-bb490-campo-Descrição-matriz-B-D--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-bb490-campo-Descrição-matriz-B-D--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-bb490-campo-Descrição-matriz-B-D--chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('tab', { name: 'Identificação', exact: true })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | [B] 500 caracteres (limite máximo) | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F12] Criação de Modelo - Aba Identificação · "Switch "Usar designs sugeridos" exibido somente na criação"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-identificacao/tc06-switch-usar-designs-somente-criacao.spec.ts`
- **Status**: failed · **Duração**: 36.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:31`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-383a1--exibido-somente-na-criação-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-383a1--exibido-somente-na-criação-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-383a1--exibido-somente-na-criação-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('tab', { name: 'Identificação', exact: true })
Expected: visible
Timeout: 30000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir tela de criação e validar switch visível + ativo | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F13] Criação de Modelo - Aba Identificação · "Defaults dos switches na criação"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-identificacao/tc07-defaults-switches-criacao.spec.ts`
- **Status**: timedOut · **Duração**: 120.0s
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Trace**: `test-artifacts\projects-modelos-tests-fea-9e86f-lts-dos-switches-na-criação-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-9e86f-lts-dos-switches-na-criação-chromium\error-context.md`

**Erro** (truncado):

```
Test timeout of 120000ms exceeded while setting up "context".
```

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F14] Criação de Modelo - Aba Identificação · "Validação do campo Kit de marca obrigatório (matriz A)"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-identificacao/tc09-validar-kit-de-marca-obrigatorio.spec.ts`
- **Status**: timedOut · **Duração**: 120.0s
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Trace**: `test-artifacts\projects-modelos-tests-fea-c578d-marca-obrigatório-matriz-A--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-c578d-marca-obrigatório-matriz-A--chromium\error-context.md`

**Erro** (truncado):

```
Test timeout of 120000ms exceeded while setting up "context".
```

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F15] Criação de Modelo - Aba Imagem · "Aba Imagem exibe título e subtítulo literais"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-imagem/tc01-aba-imagem-titulo-subtitulo.spec.ts`
- **Status**: failed · **Duração**: 46.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:265`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-2ff59-título-e-subtítulo-literais-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-2ff59-título-e-subtítulo-literais-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-2ff59-título-e-subtítulo-literais-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.evaluate: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="content-models-page"] [id*="-edit-element-"]').first()

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir modelo seedado na aba Imagem | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F16] Criação de Modelo - Aba Imagem · "Opções de padrão de imagem disponíveis"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-imagem/tc02-opcoes-padrao-imagem.spec.ts`
- **Status**: failed · **Duração**: 44.7s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:265`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-ad913-adrão-de-imagem-disponíveis-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-ad913-adrão-de-imagem-disponíveis-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-ad913-adrão-de-imagem-disponíveis-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.evaluate: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="content-models-page"] [id*="-edit-element-"]').first()

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Imagem | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F17] Criação de Modelo - Aba Imagem · "Default "Sem imagens, somente textos""

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-imagem/tc03-default-sem-imagens.spec.ts`
- **Status**: failed · **Duração**: 38.7s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:265`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.evaluate: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="content-models-page"] [id*="-edit-element-"]').first()

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Imagem em modelo seedado | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F18] Filtros e Busca - Modelos · "Buscar modelo por nome"

- **Arquivo**: `projects/modelos/tests/features/filtros-e-busca-modelos/tc01-buscar-modelo-por-nome.spec.ts`
- **Status**: failed · **Duração**: 67.9s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-58924-elos-Buscar-modelo-por-nome-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-58924-elos-Buscar-modelo-por-nome-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-58924-elos-Buscar-modelo-por-nome-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem com múltiplos modelos | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F19] Filtros e Busca - Modelos · "Filtrar modelos por Situação via drawer"

- **Arquivo**: `projects/modelos/tests/features/filtros-e-busca-modelos/tc02-filtrar-por-situacao-via-drawer.spec.ts`
- **Status**: failed · **Duração**: 70.3s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem e abrir drawer de filtros | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F20] Filtros e Busca - Modelos · "Aplicar filtro padrão Modelos próprios"

- **Arquivo**: `projects/modelos/tests/features/filtros-e-busca-modelos/tc03-aplicar-filtro-padrao-modelos-proprios.spec.ts`
- **Status**: failed · **Duração**: 68.4s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-5260f-tro-padrão-Modelos-próprios-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-5260f-tro-padrão-Modelos-próprios-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-5260f-tro-padrão-Modelos-próprios-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem e abrir drawer com 4 filtros padrão visíveis | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F21] Filtros e Busca - Modelos · "Limpar filtros aplicados"

- **Arquivo**: `projects/modelos/tests/features/filtros-e-busca-modelos/tc04-limpar-filtros-aplicados.spec.ts`
- **Status**: failed · **Duração**: 73.2s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-7b8fa-os-Limpar-filtros-aplicados-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-7b8fa-os-Limpar-filtros-aplicados-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-7b8fa-os-Limpar-filtros-aplicados-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Aplicar filtro padrão Modelos ativos | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F22] Filtros e Busca - Modelos · "Combinação de filtros + busca textual"

- **Arquivo**: `projects/modelos/tests/features/filtros-e-busca-modelos/tc05-combinar-filtros-busca-textual.spec.ts`
- **Status**: failed · **Duração**: 69.7s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-bfc66-ão-de-filtros-busca-textual-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-bfc66-ão-de-filtros-busca-textual-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-bfc66-ão-de-filtros-busca-textual-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem com múltiplos modelos | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F23] Listagem de Designs (aba Design do Modelo) · "Listagem exibe elementos obrigatórios por design"

- **Arquivo**: `projects/modelos/tests/features/listagem-de-designs-aba-design-do-modelo/tc01-colunas-obrigatorias.spec.ts`
- **Status**: failed · **Duração**: 38.8s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:185`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-aaf1b-tos-obrigatórios-por-design-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-aaf1b-tos-obrigatórios-por-design-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-aaf1b-tos-obrigatórios-por-design-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#play-interest-search')

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Design do modelo | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F24] Listagem de Designs (aba Design do Modelo) · "Ações da listagem de designs"

- **Arquivo**: `projects/modelos/tests/features/listagem-de-designs-aba-design-do-modelo/tc02-acoes-listagem.spec.ts`
- **Status**: failed · **Duração**: 40.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:185`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-d7a33-ções-da-listagem-de-designs-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-d7a33-ções-da-listagem-de-designs-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-d7a33-ções-da-listagem-de-designs-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#play-interest-search')

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Design do modelo | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F25] Listagem de Designs (aba Design do Modelo) · "Filtrar designs por Tipo (Aula/Página)"

- **Arquivo**: `projects/modelos/tests/features/listagem-de-designs-aba-design-do-modelo/tc03-filtrar-designs-por-tipo.spec.ts`
- **Status**: failed · **Duração**: 57.8s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:185`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Trace**: `test-artifacts\projects-modelos-tests-fea-0ec35-signs-por-Tipo-Aula-Página--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-0ec35-signs-por-Tipo-Aula-Página--chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#play-interest-search')

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Design do modelo | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F26] Listagem de Designs (aba Design do Modelo) · "Combinação de filtros + busca textual na listagem de designs"

- **Arquivo**: `projects/modelos/tests/features/listagem-de-designs-aba-design-do-modelo/tc04-combinar-filtros-busca-designs.spec.ts`
- **Status**: failed · **Duração**: 38.5s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:185`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-1d070-tual-na-listagem-de-designs-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-1d070-tual-na-listagem-de-designs-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-1d070-tual-na-listagem-de-designs-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#play-interest-search')

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Design do modelo | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F27] Listagem e Menu de Modelos · "Acessar listagem via submenu Aprendizagem"

- **Arquivo**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc01-acessar-listagem-via-submenu-aprendizagem.spec.ts`
- **Status**: failed · **Duração**: 68.7s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\listagem-e-menu-de-modelos\tc01-acessar-listagem-via-submenu-aprendizagem.spec.ts:19`
- **🌐 Reproduzir manualmente**: [https://basedeconhecimento.stage.twygoead.com/users/login](https://basedeconhecimento.stage.twygoead.com/users/login)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/users/login`
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-3d814-em-via-submenu-Aprendizagem-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-3d814-em-via-submenu-Aprendizagem-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-3d814-em-via-submenu-Aprendizagem-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /dashboard/
Received string:  "https://basedeconhecimento.stage.twygoead.com/users/login"
Timeout: 60000ms

Call log:
  - Expect "toHaveURL" with timeout 60000ms
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Navegar para dashboard admin e aguardar carregado | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): asserção textual falhou — produto exibe label diferente do esperado pelo XML (verificar prosa)

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F28] Listagem e Menu de Modelos · "Visualização padrão em Cards"

- **Arquivo**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc02-visualizacao-padrao-em-cards.spec.ts`
- **Status**: failed · **Duração**: 68.3s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-ed4ce-isualização-padrão-em-Cards-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-ed4ce-isualização-padrão-em-Cards-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-ed4ce-isualização-padrão-em-Cards-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem e aguardar Cards renderizados | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F29] Listagem e Menu de Modelos · "Alternância entre visualização Cards e Lista"

- **Arquivo**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc03-alternancia-visualizacao-cards-lista.spec.ts`
- **Status**: failed · **Duração**: 68.7s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-36c4f--visualização-Cards-e-Lista-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-36c4f--visualização-Cards-e-Lista-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-36c4f--visualização-Cards-e-Lista-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem em formato Cards | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F30] Listagem e Menu de Modelos · "Coluna Descrição truncada com tooltip completo (visão Lista)"

- **Arquivo**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc04-descricao-truncada-tooltip.spec.ts`
- **Status**: failed · **Duração**: 68.2s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem em formato Lista e filtrar por modelo com descrição longa | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F31] Listagem e Menu de Modelos · "Botão Adicionar redireciona para criação"

- **Arquivo**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc05-botao-adicionar-redireciona-criacao.spec.ts`
- **Status**: failed · **Duração**: 66.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\listagem-e-menu-de-modelos\tc05-botao-adicionar-redireciona-criacao.spec.ts:16`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-81907-ar-redireciona-para-criação-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-81907-ar-redireciona-para-criação-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-81907-ar-redireciona-para-criação-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: locator('#content-models-add-button')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem e validar botão Adicionar visível | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F32] Listagem e Menu de Modelos · "Indicador de cor lateral reflete status ativo/inativo no card"

- **Arquivo**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc06-indicador-cor-status-card.spec.ts`
- **Status**: failed · **Duração**: 66.7s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-83c1a-tatus-ativo-inativo-no-card-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-83c1a-tatus-ativo-inativo-no-card-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-83c1a-tatus-ativo-inativo-no-card-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem em Cards | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F33] Preview de Modelos e Designs · "Abrir Preview de Modelo via card"

- **Arquivo**: `projects/modelos/tests/features/preview-de-modelos-e-designs/tc01-abrir-preview-modelo-via-card.spec.ts`
- **Status**: failed · **Duração**: 66.5s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-b2a65--Preview-de-Modelo-via-card-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-b2a65--Preview-de-Modelo-via-card-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-b2a65--Preview-de-Modelo-via-card-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem de modelos em Cards | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F34] Preview de Modelos e Designs · "Conteúdo de cada item do carrossel"

- **Arquivo**: `projects/modelos/tests/features/preview-de-modelos-e-designs/tc02-conteudo-carrossel.spec.ts`
- **Status**: failed · **Duração**: 66.4s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-4071c-o-de-cada-item-do-carrossel-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-4071c-o-de-cada-item-do-carrossel-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-4071c-o-de-cada-item-do-carrossel-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem e abrir Preview | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F35] Preview de Modelos e Designs · "Navegar entre slides no carrossel"

- **Arquivo**: `projects/modelos/tests/features/preview-de-modelos-e-designs/tc03-navegar-entre-slides.spec.ts`
- **Status**: failed · **Duração**: 66.6s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-dda88-r-entre-slides-no-carrossel-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-dda88-r-entre-slides-no-carrossel-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-dda88-r-entre-slides-no-carrossel-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir Preview do modelo | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F36] Preview de Modelos e Designs · "Preview de Design tipo Página tem zoom com scroll"

- **Arquivo**: `projects/modelos/tests/features/preview-de-modelos-e-designs/tc04-preview-pagina-zoom-scroll.spec.ts`
- **Status**: failed · **Duração**: 66.5s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-57886--Página-tem-zoom-com-scroll-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-57886--Página-tem-zoom-com-scroll-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-57886--Página-tem-zoom-com-scroll-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir Preview do modelo | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F37] Preview de Modelos e Designs · "Preview falha graciosamente quando imagem do design não carrega"

- **Arquivo**: `projects/modelos/tests/features/preview-de-modelos-e-designs/tc05-preview-falha-graciosamente-broken-img.spec.ts`
- **Status**: failed · **Duração**: 66.8s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:29`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-c289b-magem-do-design-não-carrega-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-c289b-magem-do-design-não-carrega-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-c289b-magem-do-design-não-carrega-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('content-models-page')
Expected: visible
Timeout: 60000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem e abrir Preview | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

## ⊘ Skips legítimos pra revalidação periódica

> Items com `test.fixme` + reason. Se o motivo já não vale (seed criado, bug corrigido), abrir e re-rodar. Ver skill `debugar-bug-produto-stale`.

| TC | Tipo | Motivo |
|---|---|---|
| Modelos criados no principal não aparecem no adicional | fixme | — |
| Modelos criados no adicional não aparecem no principal | fixme | — |
| Aba Design da Aula exibe editor padrão com customizações | fixme | — |
| Salvar Aula retorna para aba Design do Modelo | fixme | — |
| Editor Aula — inserir texto via teclado | fixme | — |
| Editor Aula — alternar kit de marca via ferramenta de layout | fixme | — |
| Plate Editor — inserir espaço reservado para IA | fixme | — |
| Plate Editor — inserir logo via toolbar | fixme | — |
| Plate Editor — drag and drop de bloco para reordenar | fixme | — |
| Cancelar criação com alterações pendentes | fixme | — |
| Acesso bloqueado com flag desabilitada | fixme | — |
| Acesso liberado com flag habilitada | fixme | — |
| Transição off → on durante a sessão | fixme | — |
| Alterar Kit de Marca exibe ícone de alerta nos designs | fixme | — |
| Botão "Regerar todos" exibe tooltip correto | fixme | — |
| Clicar "Regerar todos" inicia processo assíncrono | fixme | — |
| Previews regerados carregam visualmente após processo assíncrono | fixme | — |

---

## 🐛 Findings exploratórios não-fatais (informativo)

> Console errors, HTTP 5xx, axe critical. Não bloqueiam, mas merecem leitura — podem indicar bug latente.

---

## Próximos passos

1. Marque ☑ em **uma** categoria por falha acima.
2. Preencha "Notas QA" em PT-BR — vira input do agente.
3. Commit este arquivo (`outputs/<slug>/triage-report.md`).
4. Próxima sessão do agente lê o report e aplica patches conforme decisão.

> Categorias mutuamente exclusivas — se duvidar entre duas, escolha a mais conservadora (geralmente "Flakiness" ou "Spec errado").
