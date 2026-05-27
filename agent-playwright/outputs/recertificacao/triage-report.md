# Triage Report — Recertificação — 2026-05-27 01:45

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
- **Status**: failed · **Duração**: 0.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\src\pages\ProfileSwitcher.ts:52`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-d835b--flag-ON-na-edição-de-curso-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.innerText: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button.menu-target')

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

### [F2] Configuração de Conteúdo (Switch "Habilitar reinscrição") · "TC3 — Ativar e salvar o switch persiste `has_recertification = true`"

- **Arquivo**: `projects/recertificacao/tests/features/configuracao-de-conteudo-switch-habilitar-reinscricao/tc3-ativar-e-salvar-persiste.spec.ts`
- **Status**: failed · **Duração**: 0.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\src\pages\ProfileSwitcher.ts:52`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-ccb33-e-has-recertification-true--chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.innerText: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button.menu-target')

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
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\src\pages\ProfileSwitcher.ts:52`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-ad265-ritos-é-permitido-sem-aviso-chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.innerText: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button.menu-target')

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
- **Status**: failed · **Duração**: 0.0s
- **Local do erro**: `C:\Claude\Recertificação\twygo-agents-qa\agent-playwright\src\pages\ProfileSwitcher.ts:52`
- **🌐 URL**: _não capturada_ (abrir trace pra inspecionar)
- **Última tela**: `test-artifacts\projects-recertificacao-te-254b9--formulário-React-facelift--chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-254b9--formulário-React-facelift--chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-254b9--formulário-React-facelift--chromium\error-context.md`

**Erro** (truncado):

```
TimeoutError: locator.innerText: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('button.menu-target')

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
