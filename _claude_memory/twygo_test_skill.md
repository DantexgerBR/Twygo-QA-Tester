---
name: twygo-test-skill
description: "Skill global ~/.claude/skills/twygo-test/SKILL.md — dispara em casos de teste Twygo, execução do repo playwright-tests, ou pedido de bug report."
metadata: 
  node_type: memory
  type: reference
  originSessionId: 016ef769-3cce-4a90-a74c-e8e60b0da3a4
---

Skill global em `~/.claude/skills/twygo-test/SKILL.md`.

**Dispara quando:**
- Usuário cola caso de teste no formato Twygo (Objetivo + Pré-condições + tabela de passos com `Ações do Passo` / `Resultados Esperados`).
- Usuário pede para rodar testes em `~/playwright-tests`.
- Usuário menciona "incidente", "reportar falha" ou "bug report" no contexto Twygo.

**O que ela contém:**
- Workflow de transcrição do caso → docs/casos/<slug>.md + tests/<area>/test_<slug>.py + Page Objects.
- Workflow de execução: SEMPRE pedir URL/admin/aluno via AskUserQuestion (um campo por pergunta) antes de `pytest`, sobrescrever `.env`.
- Formato exato do bug report `:: Incidente identificado ::` (definido pelo usuário em 2026-05-20).

Ver também: [[playwright-twygo-repo]]
