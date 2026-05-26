---
name: playwright-twygo-repo
description: Repositório de testes Playwright (Python) para a plataforma Twygo em ~/playwright-tests — automatiza casos manuais com padrão estrito (docstring + comentários por passo) e bug report customizado.
metadata: 
  node_type: memory
  type: project
  originSessionId: 016ef769-3cce-4a90-a74c-e8e60b0da3a4
---

Repositório em `~/playwright-tests/` (Python + pytest-playwright) que automatiza casos de teste manuais da Twygo.

**Why:** O usuário tem casos de teste manuais no formato Twygo (Objetivo / Pré-condições / Passos numerados com Resultado Esperado, ex: TestRail-like). Quer rastreabilidade 1:1 entre o caso manual e o código automatizado, e um formato específico de bug report quando algo falha.

**How to apply:**
- Rules completas estão em `~/playwright-tests/CLAUDE.md` — sempre ler ao abrir o repo.
- Skill global `twygo-test` em `~/.claude/skills/twygo-test/SKILL.md` cobre o fluxo (gerar teste a partir do caso manual + reportar falha no formato `:: Incidente identificado ::`).
- Antes de QUALQUER `pytest`, perguntar via `AskUserQuestion` (um campo por pergunta): URL da org, e-mail/senha do admin, e-mail/senha do aluno → sobrescrever `.env`.
- Template de teste é inegociável: docstring com transcrição literal + cada passo manual marcado com `# Passo N — ação` + `# Esperado: resultado`. Nenhum seletor solto no teste — tudo via Page Object em `pages/`.
- Org de stage referenciada: `https://twygo1772627238.stage.twygoead.com/`.
- Primeiro caso implementado: marca d'água em vídeo (`tests/marca_dagua/test_desmarcar_marca_dagua_video.py`). Seletores foram best-guess por rótulo PT-BR — marcados com `# TODO confirmar seletor`. Esperado refinar quando rodar a primeira vez.

Ver também: [[twygo-test-skill]]
