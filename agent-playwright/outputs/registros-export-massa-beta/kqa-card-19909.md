# Validação — Card Artia 19909 (BETA/Launch) — Registro de treinamentos externos + exportação em massa de certificados [Registros F2]

**Ambiente**: `https://registrosf2.stage.twygoead.com` (org 37079) — login manual (dante.tavares@twygo.com)
**PRs de referência (AC)**: #10575 (export em massa de anexos), #10986 (caso vazio → só mensagem),
#10983 (link de download em https), #10978 (ação em massa: toast + notificação).

## A) Exportação em massa de certificados/evidências (foco — deep)

| # | Aspecto | AC (PR) | Resultado |
|---|---|---|---|
| 1 | "Extrair dados" abre drawer "Configurações da extração" com select **Tipo de extração** (Dados/Evidências) | #10575 | ✅ |
| 2 | Branch **Dados**: Formato (CSV/PDF) + Dados linhas (Filtro atual/Todos) + Colunas | #10575 | ✅ |
| 3 | Branch **Evidências**: Escopo (Filtro atual/Todos) + nota assíncrona ("e-mail e notificação no sino… links expiram em 7 dias") | #10575 | ✅ |
| 4 | Disparo → toast "Extração iniciada… você receberá uma notificação quando estiver pronta" | #10575 | ✅ |
| 5 | `POST /api/v1/o/37079/subscription_attachments_exports` → **201** `{export_id, status:processing, total_parts}` | #10575 | ✅ |
| 6 | Notificação in-app (sino) na conclusão: "Exportação de anexos concluída — acesse o e-mail para baixar" | #10575 | ✅ |
| 7 | E-mail de conclusão com link **https** de download | #10983 | ✅ (screenshot Dante) |
| 8 | Link expira em **7 dias** (disparo 03/07 → expira 10/07) | #10575 | ✅ (screenshot Dante) |
| 9 | Download do zip → **certificados dos usuários presentes/corretos** (escopo "Todos" = multi-estado) | #10575 | ✅ (Dante baixou e confirmou) |
| 10 | Caso vazio (sem evidências/certificados) → só mensagem, sem notificação/registro failed | #10986 | ⨯ não exercitado ao vivo (ver Obs) |

## B) Demais metades (smoke ao vivo nesta sessão)

| # | Aspecto | AC | Resultado |
|---|---|---|---|
| 11 | **Ordenação** de coluna: ciclo `person asc → person desc → reset (created_at desc)` (via params order_by/order_type) | card 20283 | ✅ |
| 12 | **Ação em massa**: drawer com Ação (Aprovar/Recusar/Excluir registros) + Opção de envio (Selecionados/Todos do filtro atual) + validação "Ação é obrigatório" | #10978 | ✅ |
| 13 | **Matriz** enforçada: confirmação "Somente registros externos pendentes serão aprovados. Os demais serão ignorados"; resultado "0 registros serão aprovados (3 ignorados por não atender aos critérios)" — 3 linhas já-Aprovado corretamente ignoradas (sem mutação de dado) | #10978 | ✅ |
| 14 | **Mensagem/notificação** da ação em massa: toast "Aprovação dos registros em andamento — Ação em massa em andamento — …" | #10978 (card 20488) | ✅ |

## Descoberta técnica (mecânica do escopo da exportação)
Payload do POST = `{"event_ids":[], "filter_options":[...]}`. O escopo "Filtro atual" envia os
**filtros do drawer** (ex.: `situation=rejected`), **não** a busca textual da caixa de pesquisa
nem a seleção por checkbox das linhas. Uma busca textual que zera a listagem **não** zera o
escopo da exportação.

## Veredito

**✅ Passou** — o BETA/Launch de Registros de treinamentos externos está funcional nas frentes
verificadas ao vivo: a exportação em massa de certificados/evidências funciona fim-a-fim (drawer com
os dois tipos, escopo e nota assíncrona; disparo 201/processing com toast; conclusão notificada no
sino e por e-mail com link **https** e TTL de 7 dias; zip baixado contém os certificados dos usuários
corretamente — confirmado ao vivo pelo Dante). Smoke das demais metades também OK: ordenação
(ciclo 3 cliques), ação em massa (Aprovar/Recusar/Excluir + matriz correta ignorando não-elegíveis)
e mensagens/notificação da ação em massa.

## Obs
- **Caso vazio (PR #10986) não foi exercitado ao vivo**: não foi possível construir um escopo sem
  nenhum certificado nem evidência pela UI de filtros padrão nesta org populada — os 4 filtros padrão
  (Certificados válidos/expirados = têm certificado; Aguardando confirmação / Recusados = têm
  evidência; "Recusados" confirmado retornando 201/processing) sempre têm anexo. O único estado sem
  anexo (Interno + "Em andamento") não é filtro padrão e o construtor de filtro customizado não foi
  acessível via automação. É um guard **de backend** já coberto pelo teste do próprio PR #10986
  (rails runner) — **não bloqueia o launch**; fica registrado como lacuna de cobertura ao vivo.
- A ação em massa "Aprovar" foi executada apenas sobre 3 registros **já Aprovado** (fora do critério),
  portanto **0 mutações** — usada só para observar a mensagem/matriz sem alterar dados.

## Evidências
- 01-listagem-baseline.png
- 02-drawer-extrair-dados.png (Tipo=Dados)
- 03-drawer-evidencias.png (Tipo=Evidências: escopo + nota 7 dias)
- 05-toast-extracao-iniciada.png
- 06-listagem-final.png
- 07-sort-cycle-reset.png
- 08-acoes-massa-drawer.png
- 09-acao-massa-toast-ignorados.png
- 10-email-export-concluida-https-ttl7d.png (screenshot Dante — https + TTL 7d + Pacote 1)
- api-evidence.md (payload/response do POST + notificação do sino + toasts)
