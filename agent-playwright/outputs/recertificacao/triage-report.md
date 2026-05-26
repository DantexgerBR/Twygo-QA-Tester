# Triage Report — Recertificação — 2026-05-26 11:05

**Escopo**: Testsuite: Configuração de Conteúdo (Switch "Habilitar reinscrição") · **Ambiente**: `staging-recertificacao`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 5 | 0 | 0 | 5 | 0 erros · 0 warnings · 0 info |

> **Janela única de revisão.** Marque ☑ em UMA categoria por item.
> Notas em PT-BR. Commit este arquivo após triagem.
> Categorias: `Bug produto` / `Comportamento esperado` / `Spec/seed errado` / `Flakiness`.

---

## ✅ Sem falhas pra triagem

Suite rodou limpa. Revise apenas a seção de exploratórios e skips abaixo (se houver).

---

## ⊘ Skips legítimos pra revalidação periódica

> Items com `test.fixme` + reason. Se o motivo já não vale (seed criado, bug corrigido), abrir e re-rodar. Ver skill `debugar-bug-produto-stale`.

| TC | Tipo | Motivo |
|---|---|---|
| TC1 — Switch "Habilitar reinscrição" aparece com flag ON na edição de curso | fixme | createCurso via UI bloqueado por HTTP 422 no env staging-base-de-conhecimento (memo project-recertificacao-seed-blocker). Mesmo com perfil Administrador ativo via popover, POST /e é rejeitado. Validar |
| TC2 — Switch "Habilitar reinscrição" NÃO aparece com flag OFF (regressão) | fixme | requer toggle runtime da flag :recertificacao — assumido ON em staging-base-de-conhecimento. Validar manualmente OFF. |
| TC3 — Ativar e salvar o switch persiste `has_recertification = true` | fixme | createCurso via UI bloqueado por HTTP 422 no env staging-base-de-conhecimento (memo project-recertificacao-seed-blocker). Validar manualmente permissão do user ou usar bypass via API REST. |
| TC4 — Desativar o switch em curso com participants reinscritos é permitido sem aviso | fixme | createCurso via UI bloqueado por HTTP 422 no env staging-base-de-conhecimento (memo project-recertificacao-seed-blocker). Validar manualmente permissão do user ou usar bypass via API REST. |
| TC5 — Paridade do switch entre formulário HAML e formulário React (facelift) | fixme | createCurso via UI bloqueado por HTTP 422 no env staging-base-de-conhecimento (memo project-recertificacao-seed-blocker). Validar manualmente permissão do user ou usar bypass via API REST. |

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
