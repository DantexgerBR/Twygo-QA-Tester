# Evidência decisiva — link do e-mail gerado após o fix (org "Stage 10")

Export novo disparado nesta validação (logado como `evertongambeta@gmail.com`) → e-mail
"Exportação de anexos concluída" recebido na caixa e repassado pelo Dante (QA).

## Antes (bug — screenshot original do card, `clip_20260703_163950.png`)

```
http://stage10.stage.twygoead.com/attachments-exports/<token>/download/0
```
Expira em 08/07/2026 14:15 → e-mail gerado ~01/07/2026, código PRÉ-fix. Scheme **http** →
navegador tratava o download como inseguro / clique não disparava.

## Depois (código atual do stage — e-mail fresco de hoje)

```
https://stage10.stage.twygoead.com/attachments-exports/eyJfcmFpbHMiOnsibWVzc2FnZSI6Ik1UQXki...--be1a2ba5.../download/0
```
Texto do e-mail: "Os links abaixo expiram em 10 de julho de 2026, 17:12."

Mesmo host, mesmo endpoint, mesmo template de e-mail — **só o scheme mudou: `http` → `https`**,
exatamente o que o PR #10983 força (`protocol: 'https'` em `build_download_urls`).

## Cross-check do token (decodificado, não suposto)

Payload base64 do token assinado:
```json
{"_rails":{"message":"MTAy","exp":"2026-07-10T20:12:18.883Z",
 "pur":"subscription_attachments_export/attachments_export_download"}}
```
- `pur` = `subscription_attachments_export/attachments_export_download` → é de fato o link de
  download de exportação de anexos (não outro recurso).
- `message` = `MTAy` = base64 de **102** → id do attachments_export.
- `exp` = `2026-07-10T20:12:18Z` (UTC) = 17:12 BRT → bate com o "expiram em 10 de julho de 2026,
  17:12" do e-mail. Expiração de 7 dias ⇒ e-mail gerado hoje (03/07/2026) pelo código atual do
  stage. Confirma que é o link pós-fix, não um resquício antigo.

## Conclusão

Fix confirmado em vigor no stage: o link de download no e-mail agora sai `https://`. ✅
