# Triage Report — Recertificação — 2026-05-26 15:52

**Escopo**: Testsuite: Configuração de Conteúdo (Switch "Habilitar reinscrição") · **Ambiente**: `staging-recertificacao`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 5 | 0 | 4 | 1 | 0 erros · 0 warnings · 0 info |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ❌ Falhas pra triagem

### [F1] Configuração de Conteúdo (Switch "Habilitar reinscrição") · "TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso"

- **Arquivo**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc1-switch-aparece-com-flag-on.spec.ts`
- **Status**: failed · **Duração**: 41.9s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:119`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium\test-finished-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.waitFor: Timeout 5000ms exceeded.
Call log:
  - waiting for getByRole('row', { name: /Curso Recertificação TC1 w0-1779821457369/i }).first().locator('img[alt="Options" i], [role="button"][aria-label*="Options" i], [role="button"][aria-label*="Opções" i]').first() to be visible

```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar a URL "/o/{orgId}/dashboard" | ✅ |
| 2 | 2. Navegar até a listagem de cursos da organização | ✅ |
| 3 | 3. Clicar em "Editar" no menu de ações do curso → página de edição é exibida | ❌ |

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

### [F2] Configuração de Conteúdo (Switch "Habilitar reinscrição") · "TC3 — Ativar e salvar o switch persiste `has_recertification = true`"

- **Arquivo**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc3-ativar-e-salvar-persiste.spec.ts`
- **Status**: failed · **Duração**: 0.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\SeedAdminPage.ts:286`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.waitFor: Timeout 15000ms exceeded.
Call log:
  - waiting for getByRole('textbox', { name: /^Nome \*/ }) to be visible

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

### [F3] Configuração de Conteúdo (Switch "Habilitar reinscrição") · "TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso"

- **Arquivo**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc4-desativar-com-participants.spec.ts`
- **Status**: failed · **Duração**: 0.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\pages\ContentEditPage.ts:212`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.waitFor: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('label.chakra-switch').filter({ has: getByRole('checkbox', { name: /Habilitar reinscrição/i }) }) to be visible

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

### [F4] Configuração de Conteúdo (Switch "Habilitar reinscrição") · "TC5 — Paridade do switch entre formulário HAML e formulário React (facelift)"

- **Arquivo**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc5-paridade-haml-react.spec.ts`
- **Status**: failed · **Duração**: 14.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\projects\recertificacao\tests\features\configuracao-de-conteudo-switch-habilitar-reinscricao\tc5-paridade-haml-react.spec.ts:61`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-recertificacao-te-254b9--formulário-React-facelift--chromium\test-finished-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-254b9--formulário-React-facelift--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-254b9--formulário-React-facelift--chromium\error-context.md`

**Erro** (truncado):

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('checkbox', { name: /Habilitar reinscrição/i })
Expected: visible
Timeout: 10000ms
Error: element(s) not found

Call log:
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Editar o curso na tela HAML, ativar o switch e salvar → has_recertification = true | ❌ |

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
| TC2 — Switch "Habilitar reinscrição" NÃO aparece com flag OFF (regressão) | fixme | requer toggle runtime da flag :recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente OFF. |

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
