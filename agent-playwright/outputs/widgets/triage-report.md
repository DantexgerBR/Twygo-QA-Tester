# Triage Report — Widgets — 2026-05-14 15:49

**Escopo**: Testsuite: Dashboard - Visão do aluno · **Ambiente**: `staging-widgets`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 8 | 6 | 2 | 0 | 0 erros · 0 warnings · 0 info |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ❌ Falhas pra triagem

### [F1] Dashboard - Visão do aluno · "Exibição de um widget por aba"

- **Arquivo**: `projects/widgets/tests/features/dashboard-visao-do-aluno/exibir-widget-por-aba.spec.ts`
- **Status**: failed · **Duração**: 37.3s
- **Local do erro**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\dashboard-visao-do-aluno\exibir-widget-por-aba.spec.ts:99`
- **🌐 URL aproximada (NÃO precisa)**: [https://widgets.stage.twygoead.com/o/36988/dashboard](https://widgets.stage.twygoead.com/o/36988/dashboard)
  - URL crua (copiar): `https://widgets.stage.twygoead.com/o/36988/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium\test-finished-1.png`
- **Trace**: `test-artifacts\projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-widgets-tests-fea-f04e2-ibição-de-um-widget-por-aba-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Item Painel WPA w1-1778784497809' })

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Switch para perfil Aluno via popover | ✅ |
| 2 | 2. Clicar no item de menu "Item Painel WPA w1-1778784497809" | ❌ |

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

### [F2] Dashboard - Visão do aluno · "Renderização de widget configurado com título e ícone customizados"

- **Arquivo**: `projects/widgets/tests/features/dashboard-visao-do-aluno/widget-customizacoes-aplicadas.spec.ts`
- **Status**: failed · **Duração**: 37.3s
- **Local do erro**: `D:\twygo-agents-qa\agent-playwright\projects\widgets\tests\features\dashboard-visao-do-aluno\widget-customizacoes-aplicadas.spec.ts:94`
- **🌐 URL aproximada (NÃO precisa)**: [https://widgets.stage.twygoead.com/o/36988/dashboard](https://widgets.stage.twygoead.com/o/36988/dashboard)
  - URL crua (copiar): `https://widgets.stage.twygoead.com/o/36988/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium\test-finished-1.png`
- **Trace**: `test-artifacts\projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-widgets-tests-fea-acd6f-título-e-ícone-customizados-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for getByRole('link', { name: 'Item Painel WC w0-1778784508756' })

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Switch para perfil Aluno via popover | ✅ |
| 2 | 2. Clicar no item de menu "Item Painel WC w0-1778784508756" | ❌ |

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


## 🐛 Findings exploratórios não-fatais (informativo)

> Console errors, HTTP 5xx, axe critical. Não bloqueiam, mas merecem leitura — podem indicar bug latente.

---

## Próximos passos

1. Marque ☑ em **uma** categoria por falha acima.
2. Preencha "Notas QA" em PT-BR — vira input do agente.
3. Commit este arquivo (`outputs/<slug>/triage-report.md`).
4. Próxima sessão do agente lê o report e aplica patches conforme decisão.

> Categorias mutuamente exclusivas — se duvidar entre duas, escolha a mais conservadora (geralmente "Flakiness" ou "Spec errado").
