# Triage Report — Recertificação — 2026-07-27 13:56

**Escopo**: Testsuite: Filtro Avançado Status Substituído · **Ambiente**: `staging-recertificacao`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 4 | 3 | 1 | 0 | 0 erros · 0 warnings · 0 info |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ❌ Falhas pra triagem

### [F1] Filtro Avançado Status Substituído · "TC2 — Filtrar por "Substituído" exibe apenas alunos com certificate_status = 4"

- **Arquivo**: `projects/recertificacao/tests/features/filtro-avancado-status-substituido/tc2-filtrar-por-substituido-exibe-status-4.spec.ts`
- **Status**: timedOut · **Duração**: 128.9s
- **🌐 URL aproximada (NÃO precisa)**: [https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard](https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard)
  - URL crua (copiar): `https://recertificacao-testeqa.stage.twygoead.com/o/37048/dashboard`
  - ⚠️ **Fonte**: link de sidebar do snapshot residual (Playwright morreu antes de capturar URL real). NÃO é a rota do teste. Abrir trace pra rota exata.
- **Última tela**: `test-artifacts\projects-recertificacao-te-f6b62-os-com-certificate-status-4-chromium\test-failed-1.png`
- **Trace**: `test-artifacts\projects-recertificacao-te-f6b62-os-com-certificate-status-4-chromium\trace.zip` (abrir com `npx playwright show-trace`)
- **Error context**: `test-artifacts\projects-recertificacao-te-f6b62-os-com-certificate-status-4-chromium\error-context.md`

**Erro** (truncado):

```
Test timeout of 120000ms exceeded.
```

**Steps executados**:

| # | Step | Status |
|---:|---|:---:|
| 1 | 1. Acessar a lista de aprendizagem em "/learning_students" → Lista exibe todos os alunos | ✅ |
| 2 | 2. Abrir o filtro avançado de "Status do certificado", marcar APENAS a opção "Substituído" e aplicar → Drawer fecha, listagem refilra | ✅ |
| 3 | 3. Inspecionar as linhas listadas → Apenas alunos com certificate_status = 4 aparecem; demais (VALID, EXPIRED, PENDING) ficam ocultos | ❌ |

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


## 🐛 Findings exploratórios não-fatais (informativo)

> Console errors, HTTP 5xx, axe critical. Não bloqueiam, mas merecem leitura — podem indicar bug latente.

---

## Próximos passos

1. Marque ☑ em **uma** categoria por falha acima.
2. Preencha "Notas QA" em PT-BR — vira input do agente.
3. Commit este arquivo (`outputs/<slug>/triage-report.md`).
4. Próxima sessão do agente lê o report e aplica patches conforme decisão.

> Categorias mutuamente exclusivas — se duvidar entre duas, escolha a mais conservadora (geralmente "Flakiness" ou "Spec errado").
