---
name: generate-xmind
description: Gera o arquivo .xmind (derivado — visualização opcional para QA) a partir do MD canônico (test-analysis.md). Use após generate-md-canonical. O XMind preserva o template em template/template.xmind como base e substitui apenas o content.json. Não editar manualmente — regenerar sempre que o MD canônico mudar.
disable-model-invocation: true
allowed-tools: Read Write Bash
---

# Geração do XMind derivado

## Objetivo

Emitir `Analise_Teste_<NomeLegivel>.xmind` em `projects/<slug>/output/` como
**derivado do MD canônico** (`test-analysis.md`).

XMind é **opcional para QA visualizar** a estrutura da AT — não é mais
fonte de verdade desde a v1 do CONTRACT.md (2026-05-18). Fonte de
verdade é o `test-analysis.md`.

## Pré-requisitos

- `projects/<slug>/output/test-analysis.md` existe e é válido (parseável)
- `template/template.xmind` existe (compartilhado entre projetos)

## Execução

Rodar o script Python `scripts/md_to_xmind.py`:

```bash
cd agent-at
python scripts/md_to_xmind.py \
  projects/<slug>/output/test-analysis.md \
  projects/<slug>/output/Analise_Teste_<NomeLegivel>.xmind
```

Onde `<NomeLegivel>` é o nome do projeto sem espaços e sem acentos
(ex: `Paineis_Widgets`, `Creditos_Fase02`).

O script aceita `--template <path>` se precisar trocar o template (raro).

## Como o gerador funciona

Detalhe em [scripts/md_to_xmind.py](../../../scripts/md_to_xmind.py):

1. Parseia o MD canônico via `md_canonical_parser.py`
2. Monta dict de tópicos seguindo hierarquia XMind:

| MD canônico | Tópico XMind |
|---|---|
| Frontmatter `project_name` | Tópico central (raiz) |
| Frontmatter de suíte `suite:` | Filho do central |
| `## TC<N> — <título>` | Filho da suíte + nota = `Objetivo + [PRECONDITIONS]` + marker priority |
| Passo `N. <ação>` | Filho do TC |
| `→ <resultado>` (mesmo passo) | Filho do passo |

3. Copia `template/template.xmind` como base (preserva `metadata.json`)
4. Substitui apenas o `content.json` com os novos tópicos
5. Reempacota o ZIP final

## Mapeamento de prioridade

| `**Prioridade**` (MD) | Marker XMind |
|---|---|
| `critical` | `priority-1` |
| `high` | `priority-2` |
| `medium` | `priority-2` |
| `low` | `priority-3` |

## Regras técnicas críticas

1. **Template obrigatório**: SEMPRE usar `template/template.xmind` como
   base. NUNCA criar `.xmind` do zero.
2. **`metadata.json`**: preservado automaticamente pela cópia do template.
   Campo `creator` é objeto `{"name": "...", "version": "..."}` — não
   string simples.
3. **`content.json`**: único arquivo substituído. Contém toda a estrutura
   de tópicos gerada a partir do MD.
4. **IDs únicos**: cada tópico tem ID gerado por `uuid.uuid4()` (já
   implementado no script).
5. **`structureClass`**: `"org.xmind.ui.map.unbalanced"` em todos os
   tópicos.

## Formato das notas (notes)

Geradas automaticamente pelo script a partir do MD:

```json
{
  "notes": {
    "plain": {
      "content": "<objetivo do TC>\n[PRECONDITIONS]\n<pré-condição 1>\n<pré-condição 2>"
    }
  }
}
```

**Notas APENAS no nível do TC**, NUNCA nos passos. Implementado no script.

## Formato dos marcadores (markers)

```json
{
  "markers": [{"markerId": "priority-1"}]
}
```

Apenas no nível do TC.

## Validação pós-geração

1. **Ler o XMind no XMind Desktop**: se abre sem erro e exibe hierarquia
   correta, geração foi bem-sucedida. Erro comum: `metadata.json` com
   `creator` como string em vez de objeto — já resolvido usando o template.

2. **Contar testcases** — script imprime contagem ao final. Deve bater
   com `totals.test_cases` do MD.

## Após gerar

Imprimir:
- Caminho do XMind gerado
- Total de suítes e testcases
- Recomendar abrir no XMind Desktop para conferência visual (opcional)

## Comparação com fluxo legado (antes de v1 CONTRACT.md)

| Antes | Agora |
|---|---|
| Claude gerava `output/generate_xmind.py` com dict Python hardcoded | Script único `scripts/md_to_xmind.py` lê MD canônico |
| Editar XMind = editar o script Python | Editar XMind = editar o MD canônico + regenerar |
| XMind era fonte de verdade | MD é fonte de verdade; XMind é derivado |
| Export para TestLink XML era manual pelo XMind Desktop | XML gerado por `generate-xml-testlink` (paralelo, idem MD) |
