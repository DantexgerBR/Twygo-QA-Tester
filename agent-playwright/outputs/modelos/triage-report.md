# Triage Report — Modelos de conteúdo — 2026-05-22 09:13

**Escopo**: Todas as suítes · **Ambiente**: `staging-base-de-conhecimento`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 67 | 49 | 7 | 11 | 0 erros · 0 warnings · 0 info |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ❌ Falhas pra triagem

### [F1] Ações Duplicar e Drag and Drop · "Duplicar modelo com cópia profunda"

- **Arquivo**: `projects/modelos/tests/features/acoes-duplicar-e-drag-and-drop/tc01-duplicar-modelo-copia-profunda.spec.ts`
- **Status**: failed · **Duração**: 89.1s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\pages\ContentModelsListPage.ts:34`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-81805-r-modelo-com-cópia-profunda-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Modelos de conteúdo' })
Expected: visible
Timeout: 60000ms
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

### [F2] Ações Duplicar e Drag and Drop · "Drag and drop reorder designs"

- **Arquivo**: `projects/modelos/tests/features/acoes-duplicar-e-drag-and-drop/tc03-drag-drop-reorder-designs.spec.ts`
- **Status**: failed · **Duração**: 59.2s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\acoes-duplicar-e-drag-and-drop\tc03-drag-drop-reorder-designs.spec.ts:31`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-39e1a-ag-and-drop-reorder-designs-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-39e1a-ag-and-drop-reorder-designs-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-39e1a-ag-and-drop-reorder-designs-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.dragTo: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="modelos-de-conteudo-design-card-warning"] [data-test-id="modelos-de-conteudo-design-card-drag-handle"]').first()

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar aba Design com pelo menos 2 designs | ✅ |
| 2 | 2. Arrastar 2º design pra primeira posição via drag handle | ❌ |

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

### [F3] Criação de Design de Aula · "Salvar Aula com dados válidos"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-design-de-aula/tc02-salvar-aula-dados-validos.spec.ts`
- **Status**: failed · **Duração**: 60.3s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-design-de-aula\tc02-salvar-aula-dados-validos.spec.ts:32`
- **🌐 Reproduzir manualmente**: [https://basedeconhecimento.stage.twygoead.com/o/37007/content_models/7/[7mtemplate_designs/new[27m?kind=lesson](https://basedeconhecimento.stage.twygoead.com/o/37007/content_models/7/[7mtemplate_designs/new[27m?kind=lesson)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/content_models/7/[7mtemplate_designs/new[27m?kind=lesson`
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-f0989-lvar-Aula-com-dados-válidos-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-f0989-lvar-Aula-com-dados-válidos-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-f0989-lvar-Aula-com-dados-válidos-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(page).not.toHaveURL(expected) failed

Expected pattern: not /template_designs\/new/
Received string: "https://basedeconhecimento.stage.twygoead.com/o/37007/content_models/7/template_designs/new?kind=lesson"
Timeout: 10000ms

Call log:
  - Expect "not toHaveURL" with timeout 10000ms
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Abrir tela de criação Aula | ✅ |
| 2 | 2-4. Preencher Nome + Tipo "Introdução" + Sequência | ✅ |
| 3 | 5. Salvar e validar redirect pra aba Design da Aula | ❌ |

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

### [F4] Criação de Design de Página · "Salvar Página retorna para aba Design do Modelo"

- **Arquivo**: `projects/modelos/tests/features/criacao-de-design-de-pagina/tc07-salvar-pagina-retorna-design-modelo.spec.ts`
- **Status**: failed · **Duração**: 57.5s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\criacao-de-design-de-pagina\tc07-salvar-pagina-retorna-design-modelo.spec.ts:44`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-7970b-a-para-aba-Design-do-Modelo-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-7970b-a-para-aba-Design-do-Modelo-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-7970b-a-para-aba-Design-do-Modelo-chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Design TC7 w4-1779451715441', { exact: true }).first()
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Criar Página até aba Design | ✅ |
| 2 | 2. Clicar Salvar (Design) e validar retorno pra aba Design do Modelo | ✅ |
| 3 | 3. Validar listagem atualizada com o novo Design | ❌ |

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

### [F5] Criação de Modelo - Aba Imagem · "Default "Sem imagens, somente textos""

- **Arquivo**: `projects/modelos/tests/features/criacao-de-modelo-aba-imagem/tc03-default-sem-imagens.spec.ts`
- **Status**: failed · **Duração**: 24.3s
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

### [F6] Listagem e Menu de Modelos · "Coluna Descrição truncada com tooltip completo (visão Lista)"

- **Arquivo**: `projects/modelos/tests/features/listagem-e-menu-de-modelos/tc04-descricao-truncada-tooltip.spec.ts`
- **Status**: failed · **Duração**: 22.9s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\modelos\tests\features\listagem-e-menu-de-modelos\tc04-descricao-truncada-tooltip.spec.ts:34`
- **🌐 URL aproximada (NÃO precisa)**: [https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard](https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard)
  - URL crua (copiar): `https://basedeconhecimento.stage.twygoead.com/o/37007/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-modelos-tests-fea-9f639-oltip-completo-visão-Lista--chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: locator('[role="tooltip"]')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar listagem em formato Lista e filtrar por modelo com descrição longa | ✅ |
| 2 | 2. Localizar célula de Descrição truncada (texto com "...") | ✅ |
| 3 | 3. Hover na célula e validar tooltip com texto completo | ❌ |

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

### [F7] Preview de Modelos e Designs · "Conteúdo de cada item do carrossel"

- **Arquivo**: `projects/modelos/tests/features/preview-de-modelos-e-designs/tc02-conteudo-carrossel.spec.ts`
- **Status**: failed · **Duração**: 25.3s
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
