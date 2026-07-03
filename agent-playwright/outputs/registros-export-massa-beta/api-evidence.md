# Evidência de API/rede — Export em massa de anexos (org 37079)

Capturado ao vivo via browser MCP (Network), sessão 2026-07-03.

## POST criar exportação
`POST /api/v1/o/37079/subscription_attachments_exports`

**Request body** (Evidências, Escopo "Filtro atual", sem filtro ativo):
```json
{"event_ids":[],"filter_options":[]}
```

**Response 201**:
```json
{"data":{"export_id":93,"status":"processing","total_parts":1},
 "message":"Exportação de anexos iniciada com sucesso","status":201,"errors":[]}
```

> Observação importante: o payload NÃO inclui o `search_query` da caixa de
> pesquisa. O escopo "Filtro atual" da exportação = `filter_options` (filtros do
> drawer) + `event_ids` (seleção por checkbox), **não** a busca textual. Uma
> busca textual que zera a listagem NÃO zera o escopo da exportação.

## Toast imediato (ao clicar Extrair)
> "Extração iniciada — Sua extração está sendo processada. Você receberá uma
> notificação quando estiver pronta."

## Notificação in-app (sino) na conclusão
Serviço: `GET https://chat-staging.twygo.com.br/v1/notificates/all`
```json
{"title":"Exportação de anexos concluída",
 "content":"Sua exportação está pronta. Acesse o e-mail para baixar os arquivos.",
 "link_to_read":"/o/37079/records","is_read":false,
 "created_at":"2026-07-03T19:52:05.352Z"}
```
> O sino confirma a conclusão mas NÃO carrega o link de download — remete ao
> e-mail. O link de download (https, TTL 7d) vem no e-mail (PR #10983 / #10575).

## E-mail de conclusão (screenshot do Dante — clip 16:41)
- "Exportação de anexos concluída ... processada com sucesso"
- Botão "Pacote 1"
- Link: `https://registrosf2.stage.twygoead.com/attachments-exports/<token>/download/0` (https ✅)
- "Os links abaixo expiram em 10 de julho de 2026" (TTL 7 dias ✅)
