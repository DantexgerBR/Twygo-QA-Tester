# Validação — Card Artia 20480 (P2) — Registros: download de evidências não funciona ao clicar no link do e-mail

**PR a validar**: [Twygo/twyg-app#10983](https://github.com/Twygo/twyg-app/pull/10983)
**Origem**: `agent-playwright` (monorepo `twygo-agents-qa`), branch `project/registros-sort-revalidacao`.

## Oracle (o que o PR corrige)

Mudança de 1 linha em `app/mailers/export_attachments_notification_mailer.rb`:
`build_download_urls` passa a forçar `protocol: 'https'`. Antes, o protocolo vinha de
`@organization_domain.has_ssl?` — orgs sem domínio SSL (caso da org **Stage 10**, a mesma do
print original do bug) geravam link `http://`, que o navegador tratava como inseguro e o clique
não disparava o download. O paliativo do cliente (copiar/colar o link cru em outra aba)
funcionava tanto no build quebrado quanto no corrigido — **não discrimina** entre os dois; só o
scheme do link **gerado no e-mail** discrimina.

## O que foi testado

1. Login em `https://stage10.stage.twygoead.com/users/login` (domínio dedicado da org do card,
   confirmado como o MESMO tenant acessado via `testedemigracao.stage.twygoead.com/o/19653` —
   mesma lista de cursos). Nome da org confirmado na sidebar/Configurações: **"Stage 10"**
   (bate com o nome citado no e-mail do bug original).
2. Troca de perfil Aluno → Administrador via dropdown (a rota direta
   `/o/{orgId}/events?tab=events&profile=admin` retorna "Você não tem permissão" nesta org —
   documentado no script).
3. Navegação até Aprendizagem > Registros (org id real: 36602).
4. Disparo de uma exportação **nova e real** de Evidências (`POST
   /api/v1/o/36602/subscription_attachments_exports` → `201`, `export_id: 104`,
   `"Exportação de anexos iniciada com sucesso"`).
5. Confirmação independente de que o pipeline assíncrono processa e conclui: a mesma ação
   (export anterior, `export_id: 103`) gerou notificação in-app "Exportação de anexos
   concluída — Sua exportação está pronta. Acesse o e-mail para baixar os arquivos." (capturada
   via sino de notificações).
6. Tentativas de ler o **HTML do e-mail renderizado** (única fonte fiel do scheme, por ser
   exatamente o código que o PR mexe):
   - `/letter_opener` no host alvo (`stage10.stage.twygoead.com`) → **404**
   - `/rails/mailers` e `/rails/mailers/export_attachments_notification_mailer` no host alvo →
     **404**
   - Mesmas 3 rotas testadas num **host de controle** (`registrosf2.stage.twygoead.com`, onde
     havia evidência antiga de um e-mail com link `https://` visto manualmente) → **também 404**,
     confirmando que letter_opener/mailer preview **não estão montados em nenhum destes stages**
     (ambiente roda em modo produção-símile), não é peculiaridade da org do card.
   - Sidekiq (`/sidekiq`) acessível (200) e confirma o pipeline assíncrono ativo, mas não expõe
     o HTML renderizado do mailer nem a URL final construída.
7. Sem acesso à caixa de e-mail `evertongambeta@gmail.com` (fora do escopo de automação local),
   não há como ler o link cru realmente entregue.

## Por que não foi dado ✅ pelo paliativo

O critério do PR é o **scheme do link gerado no e-mail**, não se a URL de download funciona
quando colada manualmente — isso funcionava também no build quebrado (é literalmente o
paliativo citado no card). Cravar ✅ nessa base seria falso positivo.

## Desbloqueio (2026-07-03) — link do e-mail obtido

O export disparado nesta validação gerou um e-mail fresco na caixa `evertongambeta@gmail.com`,
repassado pelo Dante. O link cru veio:

```
https://stage10.stage.twygoead.com/attachments-exports/<token>/download/0
```

**`https://`** — contra o `http://` do screenshot original do bug. Mesmo host, mesmo endpoint,
mesmo template; só o scheme mudou. Token decodificado confirma que é de fato um link de
download de exportação de anexos (`pur: subscription_attachments_export/attachments_export_download`,
id 102) e que expira em 10/07/2026 17:12 BRT → gerado hoje, pelo código atual do stage (não é
resquício antigo). Detalhe em `16-email-link-https-recebido.md`.

## Veredito

**✅ Passou** — o link de download da exportação de evidências no e-mail, gerado pelo código
atual do stage para a org "Stage 10" (a mesma org sem domínio SSL do bug original), agora vem
como `https://`, exatamente o que o PR #10983 força (`protocol: 'https'` em `build_download_urls`).
No bug o mesmo link vinha `http://` (screenshot original), o que fazia o navegador tratar o
download como inseguro e o clique não disparar. Critério discriminante confirmado pela fonte de
verdade (o link realmente entregue no e-mail), não pelo paliativo.

## Comentário KQA (pronto pra colar no Artia)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage (stage10.stage.twygoead.com, org "Stage 10" / id 36602 — mesmo tenant do 19653
acessado via testedemigracao.stage.twygoead.com)
:: Validação ::
Disparei uma exportação real e nova de Evidências nos Registros da org "Stage 10" (a mesma do
print original do bug, org sem domínio SSL) — API 201 "Exportação de anexos iniciada com
sucesso", pipeline assíncrono concluiu. O e-mail "Exportação de anexos concluída" gerado por
esse export trouxe o link de download como https://stage10.stage.twygoead.com/attachments-exports/
<token>/download/0 — contra o http:// do bug original (mesmo host, mesmo endpoint, mesmo
template; só o scheme mudou), exatamente o que o PR #10983 força (protocol: 'https' em
build_download_urls). Token decodificado confirma que é o link de download de exportação de
anexos (pur subscription_attachments_export/attachments_export_download, id 102) e expira em
10/07/2026 17:12 → gerado hoje pelo código atual do stage.
:: Obs ::
Critério validado pela FONTE DE VERDADE (o link realmente entregue no e-mail, repassado da
caixa evertongambeta@gmail.com), não pelo paliativo de colar a URL em outra aba — esse último
funcionava tanto no build quebrado quanto no corrigido e não discriminaria o fix. Uma 1ª
tentativa ficou bloqueada porque letter_opener/mailer preview não estão montados neste stage
(evidências 09-15, preservadas) e não há acesso direto ao Gmail; destravado com o e-mail
repassado pelo Dante.
:: Evidência(s) ::
- 16-email-link-https-recebido.md (link https do e-mail + decode do token + comparação com o bug)
- 01-login-preenchido.png
- 02-pos-login.png
- 03-org-context-stage10.png
- 04-registros-listagem.png
- 05-drawer-extracao-aberto.png
- 06-drawer-evidencias-selecionado.png
- 07-export-disparado.png
- 08-notificacao-exportacao-concluida.png
- 09/10/11-tentativa-stage10 letter_opener / rails mailers (histórico do bloqueio; 404)
- 12/13/14-tentativa-registrosf2 mesmas rotas, host de controle (histórico; 404)
- 15-sidekiq-dashboard.png
- resultado.json (payload bruto da API de export)
Evidência no link: <preencher com a URL do commit final após push>
```
