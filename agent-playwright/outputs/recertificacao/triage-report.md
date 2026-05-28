# Triage Report — Recertificação — 2026-05-27 19:11

**Escopo**: Testsuite: Reinscrição em Massa pelo Admin · **Ambiente**: `staging-recertificacao`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 6 | 0 | 0 | 6 | 0 erros · 0 warnings · 0 info |

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
| TC1 — Ação "Reinscrição em massa" aparece no drawer quando todas as condições atendidas | fixme | seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc1-acao-aparece-drawer-condicoes-atendidas.data.ts. |
| TC2 — Ação "Reinscrição em massa" NÃO aparece em evento do tipo pacote | fixme | seed inválido — pacoteIdRecertOn=4 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc2-acao-nao-aparece-evento-pacote.data.ts. |
| TC3 — Disparar reinscrição em massa enfileira worker e processa todos os alunos elegíveis | fixme | seed inválido — cursoIdRecertOn=3 não existe (404). Validar no env staging-base-de-conhecimento e atualizar tc3-disparar-reinscricao-massa-enfileira-worker.data.ts. |
| TC4 — Worker é idempotente: alunos já reinscritos na mesma janela são pulados | fixme | requer execução do worker Sidekiq + validação direta no banco. Cobertura UI cobre dispatch; idempotência é DB-pure. Validar manualmente. |
| TC5 — Erro em aluno individual não interrompe o lote | fixme | requer monitoramento do worker + validação de DLQ/logs. Validar manualmente. |
| TC6 — Disparo de reinscrição em massa com flag OFF retorna HTTP 422 `feature_disabled` | fixme | requer toggle runtime da flag :recertificacao OFF — assumido ON em staging-base-de-conhecimento. Validar manualmente HTTP 422. |

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
