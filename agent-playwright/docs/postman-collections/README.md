# Postman Collections — Twygo API (V1, V2, V2 beta)

Fonte de verdade **machine-readable** da API Twygo, exportada do Postman.
Consumidas por specs de `tests/api/` (referência de endpoint, body shape,
auth) e por tools em `tools/api-catalog/` (parser, comparator).

## Arquivos esperados

| Arquivo | Origem | Status |
|---|---|---|
| `twygo-v1.postman_collection.json` | [Postman doc V1 (SWTA9dne)](https://documenter.getpostman.com/view/10208526/SWTA9dne) — API estável V1 (`/api/v1/o/:org_id/...`) | A subir |
| `twygo-v2.postman_collection.json` | [Postman doc V2 (2s9YXmWzny)](https://documenter.getpostman.com/view/10208526/2s9YXmWzny) — API estável V2 (`/api/v2/...`) | A subir |
| `twygo-v2-beta.postman_collection.json` | [Postman doc V2 beta (2sBXqGqMeN)](https://documenter.getpostman.com/view/10208526/2sBXqGqMeN) — V2 atualizada com endpoints novos (suporte a `recertification`) | A subir |

## Como atualizar uma collection

1. No Postman web/desktop, abrir a collection → menu **... → Export → Collection v2.1** → salvar JSON
2. Renomear para o padrão `twygo-<versao>.postman_collection.json` (lowercase, hífen)
3. **AUDITAR** o JSON antes de commitar (ver §Auditoria de segurança abaixo)
4. Substituir o arquivo nesta pasta
5. Commit com mensagem `chore(api-catalog): atualiza collection <versao> (origem: <URL doc>, exported: <data>)`

## Auditoria de segurança — obrigatória antes de commit

Postman collections frequentemente carregam **dados de exemplo reais** dos
exports do dev (emails, senhas, tokens, orgIds). Antes de versionar:

```bash
# Substituir placeholders no JSON antes de commitar
grep -iE '"password"\s*:|"access_token"\s*:|"client_secret"\s*:|@twygo\.com|"username"\s*:' twygo-*.postman_collection.json
```

Para cada match:

| Tipo de dado | Substituir por |
|---|---|
| Email `*@twygo.com` real | `usuario.exemplo@example.com` |
| `"password": "<real>"` | `"password": "<SUA_SENHA>"` |
| `"access_token": "<real>"` | `"access_token": "<TOKEN_OBTIDO_VIA_OAUTH>"` |
| orgId real numérico em URL de exemplo | `:org_id` (placeholder Postman) ou `123456` |
| CPF real | `000.000.000-00` |

**Regra dura**: o `.gitignore` cobre `.env` (gitignored), mas estas
collections são **versionadas**. Credenciais aqui ficam para sempre no
histórico do git (mesmo após deletar). Auditar antes de cada update.

## Como consumidores leem essas collections

| Consumidor | Como referencia |
|---|---|
| Spec em `tests/api/` (humano lendo) | Abre o JSON no Postman desktop OU acessa via doc Postman web pra entender shape do endpoint |
| Skill `testar-api-twygo` (Claude lendo) | Recebe path do arquivo + endpoint alvo → extrai body example + response shape pra montar cliente HTTP + JSON Schema |
| Tool `tools/api-catalog/v1_v2_comparator.py` | Lê 2 collections (V1 e V2) → faz requests reais → compara responses. Pra usar aqui, ajustar paths hardcoded — ver `tools/api-catalog/README.md` |
| AT do agent-at (geração de `## Endpoints (referência)`) | Quando gerar AT nova com TC `Tipo: api`, ler estas collections para popular a seção §5.4 do MD canônico — endpoint, status, body shape |

## Diferenças V1 vs V2 (resumo — detalhes nas próprias collections)

| Aspecto | V1 | V2 |
|---|---|---|
| URL base | `/api/v1/o/:org_id/...` (orgId no path) | `/api/v2/...` (orgId derivado do token) |
| Auth | OAuth password grant (`POST /oauth/token`) → bearer | Token fixo bearer (gerado via Super Admin) OU OAuth password |
| Naming | `students`, `students_events` | `users`, `users/mass`, `events/:id/participants` |
| Mass enrollment | `POST /api/v1/o/:org_id/students/mass` | `POST /api/v2/users/mass` (com suporte a `recertification: true` na V2 beta) |
| Response shape | `{ ...flat... }` (legado) | `{ data: { ... } }` (envelope padrão) |

Detalhes precisos vivem nos próprios JSONs depois de uploaded. Esta tabela
é referência rápida; em caso de divergência, **collection vence**.

## V2 beta vs V2 estável

V2 beta (`2sBXqGqMeN`) introduz endpoints novos de usuários e
atualizações em endpoints existentes (notadamente suporte a
`recertification` no `POST /users/mass`). **O projeto Recertificação consome
V2 beta** — não V2 estável. Quando ambas as collections estiverem aqui,
v2-beta é a referência primária para `tests/api/reinscricao-via-api-v2.spec.ts`.

## Onde NÃO colocar collections novas

| Local | Por que evitar |
|---|---|
| `agent-playwright/projects/<slug>/inputs/` | Collections são genéricas Twygo, não per-projeto |
| `agent-playwright/tools/api-catalog/` | tools/ é pra utilitários executáveis (scripts Python); collections são dados, não tools |
| `shared/postman-collections/` na raiz do monorepo | Só promover pra `shared/` quando ≥2 agentes consumirem (hoje só agent-playwright). CLAUDE.md raiz §"Não duplicar" desaconselha `shared/` prematuro |
| `.gitignored` | Collections SÃO fonte de verdade — versionar. Sensibilidade resolve com auditoria, não com gitignore |

## Referências

- [Postman doc V1](https://documenter.getpostman.com/view/10208526/SWTA9dne)
- [Postman doc V2](https://documenter.getpostman.com/view/10208526/2s9YXmWzny)
- [Postman doc V2 beta](https://documenter.getpostman.com/view/10208526/2sBXqGqMeN)
- Collection V1 de referência (exemplo histórico): `C:\Cursor\API\collection exemplo\Twygo 1.0.postman_collection - exemplo .json`
- AT do Recertificação (consumidor — suite "Reinscrição via API V2"): `agent-at/projects/recertificacao/output/test-analysis.md`
- Spec piloto consumidor: `agent-playwright/projects/recertificacao/tests/api/reinscricao-via-api-v2.spec.ts`
- Skills: [`testar-api-twygo`](../../.claude/skills/testar-api-twygo/SKILL.md) · [`provisionar-token-api-twygo`](../../.claude/skills/provisionar-token-api-twygo/SKILL.md) · [`validar-schema-api-twygo`](../../.claude/skills/validar-schema-api-twygo/SKILL.md)
