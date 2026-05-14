# Triage Report — Widgets — 2026-05-14 08:25 (atualizado pós-fix 2026-05-14 13:23)

**Escopo**: Testsuite: Importar abas · **Ambiente**: `staging-widgets`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 11 | 6 → **10** | 4 → **0** | 1 | 0 erros · 0 warnings · 0 info |

> **Pós-triagem**: 4/4 fails categorizados como **Spec/seed errado** após auditoria via chrome-devtools-mcp.
> Patches aplicados em `PainelFormPage.ts` (3 helpers novos) + 4 specs. Suite re-rodada 10/10 verde.
> Skill `criar-spec-resiliente-twygo` v1.1.0 com Princípio 6 (testId em void element + escopo strict-mode).

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ❌ Falhas pra triagem

### [F1] Importar abas · "Auto-preencher 'Nome da nova aba' com nome original e validar limite de 255 caracteres"

- **Arquivo**: `projects/widgets/tests/features/importar-abas/auto-preencher-nome-aba-importada.spec.ts`
- **Status**: failed · **Duração**: 45.5s
- **Local do erro**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\auto-preencher-nome-aba-importada.spec.ts:98`
- **🌐 URL aproximada (NÃO precisa)**: [https://widgets.stage.twygoead.com/o/36988/dashboard](https://widgets.stage.twygoead.com/o/36988/dashboard)
  - URL crua (copiar): `https://widgets.stage.twygoead.com/o/36988/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium\attachments\step-01-1-Criar-Painel-Origem-com-Aba-X-seedada-e-abrir-modal-de-imp-712f6f7df7e1110fa34e77f72e432b16bc184816.png`
- **Trace**: `test-artifacts\projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-widgets-tests-fea-03512-ar-limite-de-255-caracteres-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Criar Painel Origem com Aba X seedada e abrir modal de importar do Painel Destino | ✅ |
| 2 | 2. Verificar preview exibido e botão "Importar aba" habilitado | ✅ |
| 3 | 3. Verificar auto-preenchimento de "Nome da nova aba" com nome original (Aba X) | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [x] **Spec / seed errado** — seletor encadeado inválido: `data-test-id` está no próprio `<input>` (void element); `.getByTestId(X).getByPlaceholder(Y)` busca descendente em void → `element(s) not found`
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: Auditado via chrome-devtools-mcp 2026-05-14. UI renderiza normal, value="Aba X" auto-preenchido OK. Fix: helper `painelForm.getImportTabNameInput()` retorna testId direto. Spec verde após patch. Skill `criar-spec-resiliente-twygo` atualizada com Princípio 6.

**Ticket relacionado** (opcional): —

---

### [F2] Importar abas · "Editar aba importada"

- **Arquivo**: `projects/widgets/tests/features/importar-abas/editar-aba-importada.spec.ts`
- **Status**: failed · **Duração**: 70.7s
- **Local do erro**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\editar-aba-importada.spec.ts:73`
- **🌐 URL aproximada (NÃO precisa)**: [https://widgets.stage.twygoead.com/o/36988/dashboard](https://widgets.stage.twygoead.com/o/36988/dashboard)
  - URL crua (copiar): `https://widgets.stage.twygoead.com/o/36988/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-widgets-tests-fea-fbe87-r-abas-Editar-aba-importada-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-widgets-tests-fea-fbe87-r-abas-Editar-aba-importada-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-widgets-tests-fea-fbe87-r-abas-Editar-aba-importada-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.fill: Timeout 30000ms exceeded.
Call log:
  - waiting for getByTestId('import-tab-modal-tab-name-input').getByPlaceholder('Digite o nome da aba')

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Setup — Painel Origem + Painel Destino + importar Aba X como "Aba Importada" | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): mensagem genérica — abra o trace pra diagnosticar

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [x] **Spec / seed errado** — mesma causa raiz de F1 (seletor encadeado em void element); `locator.fill: Timeout 30000ms` porque elemento "filho" nunca existe
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: Mesmo fix de F1 — `painelForm.getImportTabNameInput()`. Spec verde após patch.

**Ticket relacionado** (opcional): —

---

### [F3] Importar abas · "Selecionar Categoria na importação"

- **Arquivo**: `projects/widgets/tests/features/importar-abas/selecionar-categoria-importacao.spec.ts`
- **Status**: failed · **Duração**: 33.2s
- **Local do erro**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\selecionar-categoria-importacao.spec.ts:81`
- **🌐 URL aproximada (NÃO precisa)**: [https://widgets.stage.twygoead.com/o/36988/dashboard](https://widgets.stage.twygoead.com/o/36988/dashboard)
  - URL crua (copiar): `https://widgets.stage.twygoead.com/o/36988/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium\attachments\step-01-1-Setup-Painel-Origem-Painel-Destino-Aba-X-selecionada-no-mo-765f072bf8ffb730b8dea1002f1d39b1997886f2.png`
- **Trace**: `test-artifacts\projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-widgets-tests-fea-98f94-nar-Categoria-na-importação-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByRole('combobox')
Expected: visible
Error: strict mode violation: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByRole('combobox') resolved to 3 elements:
    1) <input value="" type="text" tabindex="0" role="combobox" autocorrect="off" autocomplete="off" spellcheck="false" aria-haspopup="true" autocapitalize="none" aria-expanded="false" aria-autocomplete="list" aria-activedescendant="" id="react-select-3-input" class="select-field__input"/> aka locator('#r …
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Setup — Painel Origem + Painel Destino + Aba X selecionada no modal | ✅ |
| 2 | 2. Verificar dropdown 'Categoria' visível com 'Aprendizagem' selecionado por padrão | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [x] **Spec / seed errado** — locator amplo: `modal.getByRole('combobox')` matcha 3 elementos (2 react-select inputs panel/tab + 1 `<select>` HTML categoria) → strict-mode violation
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: Auditado via chrome-mcp 2026-05-14. Categoria renderiza como `<select>` HTML único, value="0", opção "Aprendizagem". Fix: helper `painelForm.getImportCategorySelect()` = `modal.locator('select')`. Spec verde após patch.

**Ticket relacionado** (opcional): —

---

### [F4] Importar abas · "Visualizar preview da aba selecionada"

- **Arquivo**: `projects/widgets/tests/features/importar-abas/visualizar-preview-aba.spec.ts`
- **Status**: failed · **Duração**: 39.7s
- **Local do erro**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\importar-abas\visualizar-preview-aba.spec.ts:116`
- **🌐 URL aproximada (NÃO precisa)**: [https://widgets.stage.twygoead.com/o/36988/dashboard](https://widgets.stage.twygoead.com/o/36988/dashboard)
  - URL crua (copiar): `https://widgets.stage.twygoead.com/o/36988/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium\attachments\step-01-1-Criar-Painel-Origem-com-Aba-X-e-Aba-Y-seedadas-86d52b526bb5d5e84b520db10ff4cd945f17d469.png`
- **Trace**: `test-artifacts\projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-widgets-tests-fea-42643--preview-da-aba-selecionada-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByText('Aba X', { exact: true })
Expected: visible
Error: strict mode violation: getByRole('dialog').filter({ hasText: 'Adicionar nova aba' }).getByText('Aba X', { exact: true }) resolved to 2 elements:
    1) <p class="chakra-text css-qqfgvy">Aba X</p> aka getByTestId('import-tab-modal-tab-select').getByText('Aba X', { exact: true })
    2) <p class="chakra-text css-qqfgvy">Aba X</p> aka getByText('Aba X').nth(2)

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Criar Painel Origem com Aba X e Aba Y seedadas | ✅ |
| 2 | 2. Criar Painel Destino e selecionar Painel Origem no modal de importar aba | ✅ |
| 3 | 3. Selecionar Aba X e verificar preview da aba no modal | ❌ |

**Diagnóstico do agente** (palpite, NÃO decisão): elemento esperado não apareceu — possível mudança de seletor, render condicional faltando ou estado pré-condição inválido

**QA decide** (marque UM):

- [ ] **Bug produto — IMPEDITIVO** — sem workaround viável. Spec fica RED. Escalar dev. Ticket: ____________
- [ ] **Bug produto — não-impeditivo** — registrar issue + aplicar workaround temporário no spec/helper pra suite SEGUIR cobrindo comportamentos vizinhos. Workaround sugerido: ____________________ · Ticket: ____________
- [ ] **Comportamento esperado** — produto OK. Helper/spec precisa adaptar. Especificar: ____________________
- [x] **Spec / seed errado** — locator amplo: `modal.getByText('Aba X', { exact: true })` matcha 2 elementos (label do tab-select "Aba X 2 Widgets" + preview "Nome: Aba X") → strict-mode violation
- [ ] **Flakiness** — re-rodar 3× isolado antes de decidir

**Notas QA**: Auditado via chrome-mcp 2026-05-14. Preview block renderiza corretamente (Nome/Widgets/Widgets inclusos). Fix: helper `painelForm.getImportPreviewBlock()` escopa `<div>` que contém "Preview da aba". Spec verde após patch.

**Ticket relacionado** (opcional): —

---

## ⊘ Skips legítimos pra revalidação periódica

> Items com `test.fixme` + reason. Se o motivo já não vale (seed criado, bug corrigido), abrir e re-rodar. Ver skill `debugar-bug-produto-stale`.

| TC | Tipo | Motivo |
|---|---|---|
| Importar aba com painel sem abas disponíveis | fixme | Spec/XML desatualizado: o env staging-widgets não permite painel "sem abas" — todo painel já é criado com a aba padrão "Nova aba". A aba padrão não aparece como opção no dropdown "Aba disponível", ent |

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
