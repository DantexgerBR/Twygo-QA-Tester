---
name: twygo-input-parser
description: Dispatcher unificado para o passo de parse (Fase 2 do orchestrator). Detecta o formato do arquivo de entrada (.md canônico ou .xml TestLink legado) e delega ao parser correspondente. Output JSON segue mesma forma estrutural, permitindo coexistência sem flag-day durante a migração para o MD canônico (CONTRACT.md v1).
version: 1.0.0
---

# twygo-input-parser (dispatcher)

## Quando usar

Sempre — substitui o entry-point antigo `agent:parse` que era hardcoded
para XML. Agora:

```bash
npm run agent:parse                    # auto-detect .md ou .xml
npm run agent:parse -- inputs/foo.md   # explícito
npm run agent:parse -- inputs/foo.xml  # explícito
```

Para forçar parser específico (debug):

```bash
npm run agent:parse-md                 # força MD parser
npm run agent:parse-xml                # força XML parser
```

## Heurística de detecção

Em ordem:

1. **Extensão do arquivo**:
   - `.md` → `twygo-md-parser`
   - `.xml` → `twygo-xml-parser`
2. **Conteúdo inicial** (fallback se extensão não casa):
   - Começa com `---` → MD
   - Começa com `<?xml` ou `<testsuite` → XML
3. **Falha explícita**: se nenhuma heurística casar, erro com mensagem
   clara.

## Auto-detecção do arquivo de entrada (sem flag)

Resolução:

1. Argumento posicional CLI: `npm run agent:parse -- caminho/foo.md`
2. Campo `testAnalysisFile` em `projects/<slug>/project.config.json`
3. Auto-detect na pasta `inputs/`:
   - Preferência: `inputs/test-analysis.md` se existir
   - Fallback: `inputs/test-analysis.xml`
4. Erro explícito: nenhum dos acima encontrado

## Output

Idêntico ao dos parsers individuais: `outputs/<slug>/test-analysis.parsed.json`.

Quando o input foi XML, os campos extras do MD (executor, playbooks, org,
catalogs) ficam `undefined`. Orchestrator trata isso.

## Coexistência durante migração

| Estado do projeto | Input | Parser usado |
|---|---|---|
| Novo (AT regerada pelo agent-at v1+) | `test-analysis.md` | md-parser |
| Antigo (não migrou ainda) | `Analise_Teste_<NomeLegivel>.xml` | xml-parser |
| Misto (raro — durante transição) | Ambos presentes | md-parser (preferência) |

Quando um projeto for migrado:
1. Rodar agent-at para regerar AT no formato canônico
2. Copiar `agent-at/projects/<slug>/output/test-analysis.md` para
   `agent-playwright/projects/<slug>/inputs/test-analysis.md`
3. Atualizar `project.config.json` apontando `testAnalysisFile` para o `.md`
4. Opcional: deletar `inputs/Analise_Teste_*.xml` (não obrigatório — o
   dispatcher prefere o `.md` se ambos existirem)

## Dependências

- `twygo-md-parser/parser.ts` (CONTRACT.md v1)
- `twygo-xml-parser/parser.ts` (legado, mantido)
- Helpers de `src/utils/environment.ts`

## Validação

- Após parse, roda `validateAnalysis()` específica do parser usado (ambos
  garantem mesmas invariantes: pelo menos 1 testcase, todos os TCs com
  nome e steps).
- Falha rápida e explícita se schema violado.
