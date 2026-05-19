---
name: generate-xml-testlink
description: Gera o arquivo .xml TestLink (derivado) a partir do MD canônico (test-analysis.md). Use após generate-md-canonical. O XML segue o schema TestLink padrão e é importável diretamente no TestLink Web sem ajustes manuais. Não inclui campos `executor`/`playbooks` (decisão CONTRACT.md — XML é agnóstico de agente automatizado, voltado ao fluxo manual).
disable-model-invocation: true
allowed-tools: Read Write Bash
---

# Geração do XML TestLink derivado

## Objetivo

Emitir `Analise_Teste_<NomeLegivel>.xml` em `projects/<slug>/output/` com
o XML TestLink padrão a partir do MD canônico.

Este arquivo é derivado — **regenerar sempre** que o MD canônico mudar.
Não editar manualmente.

## Pré-requisito

- `projects/<slug>/output/test-analysis.md` existe e é válido (parseável)

## Execução

Rodar o script Python `scripts/md_to_testlink.py`:

```bash
cd agent-at
python scripts/md_to_testlink.py \
  projects/<slug>/output/test-analysis.md \
  projects/<slug>/output/Analise_Teste_<NomeLegivel>.xml
```

Onde `<NomeLegivel>` é o nome do projeto sem espaços e sem acentos
(ex: `Paineis_Widgets`, `Creditos_Fase02`).

## Como o gerador funciona

Detalhe em [scripts/md_to_testlink.py](../../scripts/md_to_testlink.py):

1. Parseia o MD canônico via `md_canonical_parser.py`
2. Renderiza usando template Jinja2 `scripts/testlink.xml.j2`
3. Mapeia campos do MD → XML:

| MD canônico | XML TestLink |
|---|---|
| Frontmatter de suíte `suite:` | `<testsuite name="...">` |
| `## TC<N> — <título>` | `<testcase name="...">` |
| `### Objetivo` | `<summary>` |
| Frontmatter de suíte `preconditions:` | `<preconditions>` (juntadas em prosa) |
| `**Prioridade**: critical/high/medium/low` | `<importance>3/2/2/1</importance>` |
| `**Tipo**: ui/api/db` | `<execution_type>2</execution_type>` (Automated) |
| `**Tipo**: mixed` ou ausente | `<execution_type>1</execution_type>` (Manual) |
| Passos | `<step><step_number/><actions/><expectedresults/></step>` |

## O que NÃO vai no XML

Por decisão registrada em [CONTRACT.md §13](../../../../CONTRACT.md):

- **NÃO** inclui campo `executor` (XML é agnóstico de agente automatizado)
- **NÃO** inclui campo `playbooks` (idem)
- **NÃO** inclui `org` do MD (chave simbólica não faz sentido em fluxo manual)
- **NÃO** inclui catálogos (Textos literais, Modais, Endpoints, Dados de teste)
  — esses são contexto pra consumidores automatizados; TestLink manual recebe
  apenas suítes/TCs/passos

O XML preserva fluxo manual da Twygo (importação no TestLink Web) intacto.

## Validação pós-geração

1. **XML well-formed**:
   ```bash
   python -c "import xml.etree.ElementTree as ET; ET.parse('projects/<slug>/output/Analise_Teste_<NomeLegivel>.xml')"
   ```

2. **Contar testcases** bate com `totals.test_cases` do MD:
   ```bash
   grep -c "<testcase " projects/<slug>/output/Analise_Teste_<NomeLegivel>.xml
   ```

3. **Importar no TestLink Web** (validação manual quando entregar):
   - Admin → Projeto → Test Specification → Import
   - Selecionar arquivo XML
   - Conferir que todas as suítes/TCs apareceram

## Compatibilidade TestLink

Schema TestLink padrão (validado 2026-05-18). Importação preserva todos os
campos sem warnings. Se o TestLink do time tiver custom fields, eles serão
ignorados silenciosamente (sem quebra).

## Após gerar

Imprimir:
- Caminho do XML gerado
- Total de suítes e testcases
- Recomendar validação manual de import no TestLink Web na primeira execução
