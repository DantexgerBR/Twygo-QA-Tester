# Triage Report — Modelos de conteúdo — 2026-05-21 18:07

**Escopo**: Regressão (todos os testsuites) · **Ambiente**: `staging-base-de-conhecimento`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 67 | 48 | 8 | 11 | 0 erros · 0 warnings · 0 info |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ❌ Falhas pra triagem

### [F1] Ações Duplicar e Drag and Drop · "Duplicar modelo com cópia profunda"

- **Arquivo**: `projects/modelos/tests/features/acoes-duplicar-e-drag-and-drop/tc01-duplicar-modelo-copia-profunda.spec.ts`
- **Status**: failed · **Duração**: 28.5s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\acoes-duplicar-e-drag-and-drop\tc01-duplicar-modelo-copia-profunda.spec.ts:41`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: locator('.chakra-toast').filter({ hasText: 'duplicado com sucesso' }).first()
Expected: visible
Timeout: 15000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem de modelos | ✅ |
| 2 | 2. Clicar Duplicar (icon content_copy) do 1º modelo | ❌ |

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

### [F2] Criação de Modelo - Aba Estilo do Conteúdo · "Botão "Adicionar mais dados" exibe menu com 6 opções"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-estilo-do-conteudo/tc01-adicionar-mais-dados-menu-6-opcoes.spec.ts`
- **Status**: failed · **Duração**: 45.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:162`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-eff58-dos-exibe-menu-com-6-opções-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-eff58-dos-exibe-menu-com-6-opções-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-eff58-dos-exibe-menu-com-6-opções-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="content-models-style-add-more-data-button"]')
    - locator resolved to <button disabled type="button" aria-haspopup="menu" aria-expanded="false" id="menu-button-:r1j:" aria-controls="menu-list-:r1j:" data-test-id="content-models-style-add-more-data-button" class="chakra-button chakra-menu__menu-button css-7vf75e">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir modelo seedado na aba Estilo | ✅ |
| 2 | 2. Clicar "Adicionar mais dados" e validar 6 opções no menu | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): click não foi acionável — possível elemento hidden/coberto/aria-disabled

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F3] Criação de Modelo - Aba Estilo do Conteúdo · "Adicionar campo Idade via menu"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-estilo-do-conteudo/tc02-adicionar-campo-idade.spec.ts`
- **Status**: failed · **Duração**: 45.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelEditPage.ts:162`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-d9836-cionar-campo-Idade-via-menu-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-d9836-cionar-campo-Idade-via-menu-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-d9836-cionar-campo-Idade-via-menu-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="content-models-style-add-more-data-button"]')
    - locator resolved to <button disabled type="button" aria-haspopup="menu" aria-expanded="false" id="menu-button-:r1j:" aria-controls="menu-list-:r1j:" data-test-id="content-models-style-add-more-data-button" class="chakra-button chakra-menu__menu-button css-7vf75e">…</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is not enabled
    - retrying click action
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir modelo seedado na aba Estilo | ✅ |
| 2 | 2. Abrir menu "Adicionar mais dados" | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): click não foi acionável — possível elemento hidden/coberto/aria-disabled

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [ ] **Spec / seed errado** — XML/data.ts desatualizado. Especificar: ____________________
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: ____________________________________________________________

**Ticket relacionado** (opcional): ____________

---

### [F4] Criação de Modelo - Aba Estrutura do Conteúdo · "Carga horária obrigatória bloqueia salvamento"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc04-carga-horaria-obrigatoria-bloqueia-save.spec.ts`
- **Status**: failed · **Duração**: 20.4s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-modelo-aba-estrutura-do-conteudo\tc04-carga-horaria-obrigatoria-bloqueia-save.spec.ts:27`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-26232-gatória-bloqueia-salvamento-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-26232-gatória-bloqueia-salvamento-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-26232-gatória-bloqueia-salvamento-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  locator('.chakra-toast').filter({ hasText: /sucesso/i })
Expected: 0
Received: 3
Timeout:  3000ms

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Estrutura sem carga horária preenchida | ✅ |
| 2 | 2. Clicar Salvar e validar bloqueio (sem redirect/sem toast sucesso) | ❌ |

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

### [F5] Criação de Modelo - Aba Estrutura do Conteúdo · "Switch "Incluir questionários" exibe configurações básicas"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-estrutura-do-conteudo/tc06-switch-incluir-questionarios.spec.ts`
- **Status**: failed · **Duração**: 15.5s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-modelo-aba-estrutura-do-conteudo\tc06-switch-incluir-questionarios.spec.ts:32`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-ca9a9-exibe-configurações-básicas-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Configurações avançadas', { exact: true })
Expected: visible
Error: strict mode violation: getByText('Configurações avançadas', { exact: true }) resolved to 2 elements:
    1) <div class="css-yljlks">Configurações avançadas</div> aka getByText('Configurações avançadas').first()
    2) <div class="css-yljlks">Configurações avançadas</div> aka getByText('Configurações avançadas').nth(1)

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Estrutura com seção "Questionários ao longo do conteúdo" | ✅ |
| 2 | 2. Ativar switch "Incluir questionários" e validar configurações expostas | ❌ |

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

### [F6] Criação de Modelo - Aba Imagem · "Default "Sem imagens, somente textos""

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-imagem/tc03-default-sem-imagens.spec.ts`
- **Status**: failed · **Duração**: 14.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-modelo-aba-imagem\tc03-default-sem-imagens.spec.ts:19`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-fb2c4-Sem-imagens-somente-textos--chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(received).toBe(expected) // Object.is equality

Expected: true
Received: false
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir aba Imagem em modelo seedado | ✅ |
| 2 | 2. Validar radio-0 ("Sem imagens, somente textos") marcado por padrão | ❌ |

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

### [F7] Filtros e Busca - Modelos · "Filtrar modelos por Situação via drawer"

- **Arquivo**: `projects/modelos/tests/features/filtros-e-busca-modelos/tc02-filtrar-por-situacao-via-drawer.spec.ts`
- **Status**: failed · **Duração**: 10.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:101`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-40575-los-por-Situação-via-drawer-chromium\error-context.md`

**Erro** (truncado):

```
Error: esperava ao menos 1 cards, encontrei 0

expect(received).toBeGreaterThanOrEqual(expected)

Expected: >= 1
Received:    0
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem e abrir drawer de filtros | ✅ |
| 2 | 2. Aplicar filtro padrão "Modelos ativos" | ✅ |
| 3 | 3. Validar drawer fechou e #clear-filter ficou visível | ❌ |

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

### [F8] Preview de Modelos e Designs · "Conteúdo de cada item do carrossel"

- **Arquivo**: `projects/modelos/tests/features/preview-de-modelos-e-designs/tc02-conteudo-carrossel.spec.ts`
- **Status**: failed · **Duração**: 23.3s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\preview-de-modelos-e-designs\tc02-conteudo-carrossel.spec.ts:41`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
  - 🚨 **URL não bate com escopo do teste** (nome do TC menciona painel/listagem mas URL é `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`). **Possível causa**: spec configurado em rota errada OU teste navegou pra lugar inesperado. **Verifique**: abrir trace + conferir `goToList()` ou rota usada pelo spec.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-4071c-o-de-cada-item-do-carrossel-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-4071c-o-de-cada-item-do-carrossel-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-4071c-o-de-cada-item-do-carrossel-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[data-test-id="content-models-preview-modal-image"]')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem e abrir Preview | ✅ |
| 2 | 2. Validar elementos do slide: Modelo:, Design:, Tipo:, indicador X de Y | ❌ |

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
| Cancelar criação com alterações pendentes | fixme | — |
| Acesso bloqueado com flag desabilitada | fixme | — |
| Acesso liberado com flag habilitada | fixme | — |
| Transição off → on durante a sessão | fixme | — |
| Alterar Kit de Marca exibe ícone de alerta nos designs | fixme | — |
| Botão "Regerar todos" exibe tooltip correto | fixme | — |
| Clicar "Regerar todos" inicia processo assíncrono | fixme | — |

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
