# inputs/

Esta pasta recebe os artefatos de cada projeto Twygo a ser testado.

> **Convenção de branch**: cada projeto vive na própria branch
> (`project/<slug-do-projeto>`). O `master` mantém esta pasta praticamente
> vazia (apenas este README + `.gitkeep`). Veja
> [`.claude/PROJECT_BOOTSTRAP.md`](../.claude/PROJECT_BOOTSTRAP.md) para o
> ritual completo.

## Arquivos esperados por projeto

| Arquivo | Origem | Consumido por |
|---|---|---|
| `Analise_Teste_<projeto>.xml` | Agente AT (XMind → TestLink XML) | `twygo-xml-parser` |
| `Quebra de atividades - <projeto>.xlsx` | Discovery / Tech Lead | Documentação humana — **não é processado pelo agente Playwright** (esse XLSX é input do agente AT, não deste) |

Outros documentos auxiliares (discovery, spike, activities-breakdown) podem
ser dropados aqui como referência humana, mas nenhuma skill do agente
Playwright os consome.

## Configuração após dropar o XML

1. Renomeie o XML conforme o padrão: `Analise_Teste_<NomeDoProjeto>.xml`.
2. Atualize [`config/project.config.json`](../config/project.config.json):
   - `projectName`: nome literal (ex.: `"Kit de Marca"`).
   - `testAnalysisFile`: caminho do XML (ex.: `"inputs/Analise_Teste_Kit_de_Marca.xml"`).
3. Valide: `npm run agent:parse` (deve produzir
   `outputs/test-analysis.parsed.json` sem erro).
4. Confirme: `npm run agent:suites` (lista as testsuites do projeto).
