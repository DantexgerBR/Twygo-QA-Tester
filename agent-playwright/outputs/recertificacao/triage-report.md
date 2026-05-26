# Triage Report — Recertificação — 2026-05-26 10:06

**Escopo**: Testsuite: Isolamento em Ambientes Adicionais · **Ambiente**: `staging-base-de-conhecimento`

## Sumário

| Total | ✅ Passed | ❌ Failed | ⊘ Skipped | Findings exploratórios |
|---:|---:|---:|---:|---|
| 2 | 0 | 0 | 2 | 0 erros · 0 warnings · 0 info |

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
| TC1 — Reinscrição num env não afeta participants no env pareado | fixme | env secundário não configurado em config/environment.json (frontmatter env_secondary: null). Bloqueio de infra — configurar staging-base-de-conhecimento-aditional + senha em .env antes de habilitar es |
| TC2 — Toggle da flag :recertificacao no env principal NÃO afeta env secundário | fixme | env secundário não configurado em config/environment.json (frontmatter env_secondary: null). Bloqueio de infra — configurar staging-base-de-conhecimento-aditional + senha em .env antes de habilitar es |

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
