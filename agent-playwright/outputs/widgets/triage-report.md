# Triage Report — Widgets — 2026-05-15 09:59

**Escopo**: Testsuite: Feature flag · **Ambiente**: `staging-widgets`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 5 | 2 | 0 | 3 | 0 erros · 0 warnings · 0 info |

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
| Feature flag habilitada com painéis criados - menu do aluno acessível | fixme | seed ausente: requer credencial de perfil Aluno. Ver dashboard-visao-do-aluno/_README.md. |
| Menu marcado como 'Padrão' com flag desabilitada | fixme | seed ausente: requer menu marcado como 'Padrão' + transição flag on→off no mesmo env. Mesmo bloqueio de transicao-flag-on-off-com-paineis.spec.ts. |
| Transição: flag habilitada -> desabilitada com painéis aplicados | fixme | seed ausente: requer painel + menu vinculado pré-criados na org 36989 (staging-widgets-disabled) E perfil Aluno via ProfileSwitcher. Toggle de flag em si já está destravado por testar-feature-flag-twy |

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
