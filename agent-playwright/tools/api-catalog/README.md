# tools/api-catalog/

Utilitários **Python** auxiliares para projetos com cobertura de API. **Não são** parte do runtime de teste do agent-playwright — rodam ad-hoc quando um QA precisa catalogar endpoints ou comparar versões da API Twygo.

## Origem

Extraídos de `C:\Cursor\API` (POC pessoal de catalogação da API V1→V2 Twygo, 2026-05) durante a consolidação de testes de API no agent-playwright (CONTRACT.md §16, v1.2). O resto do projeto C:\Cursor\API foi arquivado fora do monorepo.

## Conteúdo

| Arquivo | Linhas | Propósito |
|---|---|---|
| `parse_testlink_xml.py` | 194 | Lê XML exportado do TestLink → produz JSON catálogo `data/testlink-full-catalog.json` (suítes, casos, steps com prosa). Útil pra bootstrapar `schemas/` e `data/` num projeto API novo |
| `v1_v2_comparator.py` | 638 | Compara comportamento dos endpoints `/api/v1/users` vs `/api/v2/users` no staging Twygo. Faz requests reais em ambas versões e gera diff de shape + status. Útil em projetos de migração API |
| `requirements.txt` | — | Deps Python (apenas `requests`) |

## Status — código importado, **não-adaptado**

⚠️ Estes scripts foram copiados literalmente de `C:\Cursor\API`. Eles têm **paths hardcoded** anchored à estrutura original do projeto (`automation/`, `data/`, `test-assets/testlink/xml/`). **Não rodam aqui sem adaptação**.

O que precisa ser adaptado quando você for usar:

| Arquivo | Adaptação necessária |
|---|---|
| `parse_testlink_xml.py` | Trocar `PROJECT_ROOT = Path(__file__).resolve().parents[2]` e os defaults de `DEFAULT_XML` / `OUTPUT_JSON` para paths do projeto target. Suporta `--xml` e `--output` via argparse |
| `v1_v2_comparator.py` | Depende de `CONFIG_PATH = ROOT / "config" / "test-config.json"` no formato do C:\Cursor\API. Refatorar pra ler config do `.env` do agent-playwright OU portar `config/test-config.json` pra cá |

## Quando usar

| Cenário | Tool | Resultado |
|---|---|---|
| Bootstrar `schemas/` num projeto API novo a partir de TestLink XML existente | `parse_testlink_xml.py` | JSON catálogo que você lê pra inferir shape de payload/response e gerar JSON Schemas |
| Migração V1→V2 de endpoint Twygo | `v1_v2_comparator.py` | Report HTML/JSON comparando responses; ajuda a popular `## Endpoints (referência)` no MD canônico do AT |
| TC `Tipo: api` regular sem migração V1↔V2 | nenhum dos dois | Use o pipeline padrão (skill `testar-api-twygo` + helper Ajv em `src/utils/schema.ts`) |

## Setup

```bash
# Na pasta tools/api-catalog/
python -m venv .venv
source .venv/Scripts/activate   # ou .venv/bin/activate no Linux/Mac
pip install -r requirements.txt
```

## Uso (após adaptação)

```bash
# Parse de TestLink XML → JSON catálogo
python parse_testlink_xml.py --xml caminho/para/exportado.xml --output catalog.json

# Comparação V1↔V2 (requer config adaptada)
python v1_v2_comparator.py
```

## Por que Python e não TS

Estas tools são utilitários offline com forte uso de:
- `xml.etree.ElementTree` (parsing XML)
- `requests` (HTTP síncrono)
- `unicodedata` (normalização PT-BR)
- Comparação textual

Python tem ergonomia melhor para esses casos do que TS+Node. Como rodam offline (não são parte do runtime de teste), o stack split é aceitável. Mesmo precedente do `agent-at` (Python) coexistindo com `agent-playwright` (TS) no monorepo.

## Roadmap

Estas tools são úteis mas frágeis (paths hardcoded). Possíveis evoluções:
1. **Generalizar `parse_testlink_xml.py`** — argparse completo, sem PROJECT_ROOT assumido, output configurável. Custo: ~2h
2. **Adaptar `v1_v2_comparator.py`** para ler `.env` do agent-playwright (`API_BASE_URL`, `API_TOKEN`) e collection Postman opcional. Custo: ~4h
3. **Portar para TS** — eliminaria o stack split. Custo: ~8h. Vale só se essas tools virarem core do fluxo (improvável)

Hoje rodam só quando alguém precisa. Não há automação CI que dependa delas.

## Referências

- [CONTRACT.md §16](../../../CONTRACT.md) — Consolidação de API no agent-playwright (v1.2)
- Skill principal: [`testar-api-twygo`](../../.claude/skills/testar-api-twygo/SKILL.md)
- Skill complementar: [`validar-schema-api-twygo`](../../.claude/skills/validar-schema-api-twygo/SKILL.md)
