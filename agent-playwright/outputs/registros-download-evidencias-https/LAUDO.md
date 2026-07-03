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

## Veredito

**❌ Falhou (bloqueado)** — não foi possível confirmar se o link gerado pelo mailer nesta org
("Stage 10", sem domínio SSL, a mesma do bug) vem como `https://` ou ainda `http://`. Todas as
vias de leitura do e-mail renderizado sem acessar a caixa de correio real (letter_opener,
`/rails/mailers`, notificação in-app, resposta da API de export) foram tentadas e não expõem o
conteúdo do mailer. Fica pendente: (a) acesso à caixa `evertongambeta@gmail.com`, ou (b)
confirmação via `rails runner` pelo dev (mesmo método usado para validar o PR), ou (c) liberar
letter_opener/mailer preview neste stage.

## Comentário KQA (pronto pra colar no Artia)

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage (stage10.stage.twygoead.com, org "Stage 10" / id 36602 — mesmo tenant do 19653
acessado via testedemigracao.stage.twygoead.com)
:: Validação ::
Disparei uma exportação real de Evidências nos Registros da org "Stage 10" (a mesma do print
original do bug) — API confirmou 201/"Exportação de anexos iniciada com sucesso" e o pipeline
assíncrono concluiu (notificação in-app "Acesse o e-mail para baixar os arquivos"). O critério
do PR #10983 é o scheme do link GERADO NO E-MAIL (http→https via `protocol: 'https'` forçado
no mailer) — não se a URL de download funciona quando colada manualmente, isso é o paliativo e
funcionava também no build quebrado. Tentei ler o HTML renderizado do mailer por 3 vias sem
depender da caixa de e-mail: letter_opener (404), preview /rails/mailers (404) e resposta da
API de export (não inclui a URL final, só metadados do job). Testei também num host de
controle (registrosf2.stage.twygoead.com) para descartar peculiaridade da org — mesmas rotas
também 404 lá, confirmando que letter_opener/preview não estão disponíveis em nenhum destes
stages.
:: Obs ::
Não crei um falso ✅ a partir do paliativo (colar o link em outra aba), porque isso não
discrimina entre o build corrigido e o quebrado. Sem acesso à caixa evertongambeta@gmail.com
(fora do escopo de automação local), não há via observável neste stage para ler o scheme real
do link. Peço uma das opções: (a) acesso/print do e-mail recebido, (b) confirmação via `rails
runner` pelo dev (mesmo método citado na validação do PR), ou (c) habilitar letter_opener/
mailer preview neste ambiente.
:: Evidência(s) ::
- 01-login-preenchido.png
- 02-pos-login.png
- 03-org-context-stage10.png
- 04-registros-listagem.png
- 05-drawer-extracao-aberto.png
- 06-drawer-evidencias-selecionado.png
- 07-export-disparado.png
- 08-notificacao-exportacao-concluida.png
- 09/10/11-tentativa-stage10...(letter_opener / rails mailers) — todas 404
- 12/13/14-tentativa-registrosf2...(mesmas rotas, host de controle) — todas 404
- 15-sidekiq-dashboard.png
- resultado.json (payload bruto da API de export + status de cada tentativa)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/commit/090abb360499029ec1d4d6bc11ccec4ba4dcc4a0
```
