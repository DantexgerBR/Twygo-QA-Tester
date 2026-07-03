# Validação — Card Artia 20488 (P2) — Mensagens e notificação da ação em massa [Registros F2]

**PR a validar**: https://github.com/Twygo/twyg-app/pull/10978 — **MERGED** (base `feature/registros-externos`).
**Ambiente**: Stage `https://registrosf2.stage.twygoead.com`, org **37079**, perfil Administrador.
**Login**: `dante.tavares@twygo.com` (credencial confirmada por Dante — as credenciais do `.env`
usadas numa tentativa anterior não autenticavam nessa org; ver histórico abaixo).
**Data**: 2026-07-03.

## Histórico — 1ª tentativa bloqueada, depois destravada com a credencial certa

Uma primeira tentativa (evidências `01`-`04`, preservadas abaixo) usou as credenciais do
`.env` (`TWYGO_STAGING_RECERTIFICACAO`/`TWYGO_STAGING_MARCA_DAGUA`) contra
`registrosf2.stage.twygoead.com` (org 37079) e nenhuma autenticou — inclusive uma delas foi
rejeitada até no próprio host de origem, indicando credencial morta/rotacionada. Isso gerou um
veredito de bloqueio (❌, sem avaliar o mérito do PR). Com a credencial correta indicada por
Dante (`dante.tavares@twygo.com` / org 37079), o acesso foi liberado e o card foi validado por
completo ao vivo — evidências `05` em diante, laudo abaixo **substitui** o veredito de bloqueio.

## O que o card pede

Nas 3 ações em massa de Registros (Aprovar / Recusar / Excluir), ajustar (a) a **toast** azul
"em andamento" de 3 linhas (mesmo padrão/cor/fonte do "Inscrever em curso", só o texto muda) e
(b) a **notificação** de conclusão. Importante 1: clicar na notificação leva à listagem de
registros. Importante 2: a 3ª linha da toast avisa quantos itens serão executados e quantos
serão ignorados (por não atenderem à regra).

## Como foi testado (ao vivo, via browser)

Para cada ação, montei uma seleção com registros **válidos + ignorados** (lote misto) e
executei o fluxo real (Ações em massa → escolher ação → Executar → Confirmar), capturando a
tela de confirmação e a notificação por screenshot, e o texto exato da toast via leitura ao
vivo do DOM (`evaluate` no elemento do toast Chakra — a toast é transitória e some rápido demais
pra garantir screenshot no frame certo; texto foi lido programaticamente do próprio elemento
renderizado, não suposto). Cruzei tudo com a **mutação real** dos dados (contadores da tela
antes/depois) e com os diálogos de confirmação, que também descrevem a regra de elegibilidade.

Regras de elegibilidade confirmadas (via diálogo de confirmação + resultado real): Aprovar e
Recusar valem só para **Externo + Aguardando confirmação**; Excluir vale para **Externo +
não-pendente**; os demais tipos/situações são ignorados.

## Resultado — bate 100% com o card nas 3 ações

### Toasts (3 linhas, azul `info`, fonte Lato — texto lido ao vivo do DOM)

| Ação | Texto capturado ao vivo |
|---|---|
| **Aprovar** | `Aprovação dos registros em andamento` / `Ação em massa em andamento` / `2 registros serão aprovados (2 ignorados por não atender aos critérios).` |
| **Recusar** | `Recusas dos registros em andamento` / `Ação em massa em andamento` / `3 registros serão recusados (5 ignorados por não atender aos critérios).` |
| **Excluir** | `Exclusão dos registros em andamento` / `Ação em massa em andamento` / `2 registros serão excluídos (2 ignorados por não atender aos critérios).` |

Estilo do toast comprovado programaticamente: `data-status="info"`, `background rgb(190,227,248)`
(azul), `font Lato`, **3 linhas** (`preserveLineBreaks`) — "mesmo padrão, mesma cor e fonte", só
o texto muda, conforme pedido no card.

### Notificações (todas com título "Ação em massa concluída")

| Ação | Subtítulo |
|---|---|
| **Aprovar** | `Aprovação dos registros realizadas` |
| **Recusar** | `Recusas dos registros realizadas` |
| **Excluir** | `Exclusão dos registros realizadas` |

As 3 apareceram juntas no painel de Notificações (evidência `13-notificacoes-3-acoes.png`).

### Importante 1 — clique da notificação → listagem
Confirmado ao vivo: a notificação é um link; estando em outra página (`/events`), o clique abriu
**`/o/37079/records`** (listagem de registros).

### Contagem válidos × ignorados — confirmada por mutação real dos dados
- **Aprovar**: seleção Lider Runner (Externo/Aprovado, ignorado) + EXPIRACAO (Interno, ignorado)
  + 2x QA11 TC3 (Externo/Aguardando, válidos) → contador "aguardando" 66→64. Diálogo de
  confirmação: "Aprovar 4 registro(s) selecionado(s)? Somente registros externos pendentes
  serão aprovados. Os demais serão ignorados." — 2 processados + 2 ignorados bate com a toast.
- **Recusar**: 3 Aguardando → Recusado (recusados 24→27, aguardando 64→61); 5 ignorados
  intactos (Aprovados/Internos na seleção de 8).
- **Excluir**: seleção com EXPIRACAO (Interno, ignorado) + Ferramentas do time de design
  (Interno, ignorado) + 2 registros QA116 (Externo/Aprovado, válidos) → os 2 QA116 somem da
  listagem pós-ação; os 2 Internos seguem intactos. Diálogo: "Excluir 4 registro(s)
  selecionado(s)? Somente registros externos não pendentes serão excluídos."

## Observações (não impedem o PASSOU)

1. **Processamento é assíncrono**, apesar do corpo do PR mencionar "processamento síncrono": o
   worker `RecordsMassActionWorker.perform_async` faz o trabalho real; a contagem exibida na
   toast vem de um `dry_run: true` calculado à parte. Não é bug — é coerente com "em andamento" +
   notificação de conclusão à parte, e na prática as contagens da toast bateram com o resultado
   real do worker nas 3 ações testadas.
2. **A listagem não auto-atualiza mais** após disparar a ação (`records` foi removido de
   `MODELS_WITH_LIST_REFRESH` no front) — o usuário passa a depender da notificação para saber
   que terminou. Coerente com o processamento assíncrono.
3. **Recusar exige Justificativa** (campo obrigatório no drawer da ação) — não citado no card,
   mas é comportamento correto/esperado para uma recusa.

## Cobertura

- 3 ações testadas (Aprovar, Recusar, Excluir), cada uma com lote misto (itens elegíveis +
  itens ignorados) para exercitar a 3ª linha da toast.
- Estados de registro cobertos: Externo+Aguardando (válido p/ Aprovar/Recusar), Externo+Aprovado
  (válido p/ Excluir; ignorado p/ Aprovar/Recusar), Interno (sempre ignorado).
- Excluir foi executado por último, sobre registros de baixo valor/descartáveis (prefixo QA116),
  dado o caráter irreversível da ação numa org compartilhada.
- Não é um bug de "por usuário" (ex.: desempenho, progresso) — é texto/contagem de uma ação em
  massa sobre registros; a cobertura relevante é por **estado do registro**, não por usuário, e
  isso foi exercitado nas 3 ações.

## Veredito

**✅ Passou** — as 3 toasts (3 linhas, azul/Lato, texto lido ao vivo do DOM) e as 3 notificações
batem exatamente com o card, o clique da notificação leva à listagem, e a contagem
válidos/ignorados foi confirmada tanto pelo diálogo de confirmação quanto pela mutação real dos
dados. Comprovado ao vivo no Stage `registrosf2.stage.twygoead.com` (org 37079).

## Comentário KQA (pronto pra colar no Artia)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage (registrosf2.stage.twygoead.com, org 37079)
:: Validação ::
Validadas ao vivo as 3 ações em massa de Registros (Aprovar/Recusar/Excluir), cada uma com lote
misto (itens elegíveis + itens ignorados). Toast azul "em andamento" de 3 linhas com os textos
exatos do card em cada ação (ex.: "Aprovação dos registros em andamento / Ação em massa em
andamento / 2 registros serão aprovados (2 ignorados por não atender aos critérios)."), mesmo
padrão/cor(info)/fonte(Lato), só o texto muda. Notificação de conclusão "Ação em massa
concluída" com subtítulo por ação ("Aprovação/Recusas/Exclusão dos registros realizadas").
Clicar na notificação leva à listagem de registros (/o/:org/records) — confirmado. Contagem
válidos x ignorados confere: bate com o diálogo de confirmação (regra de elegibilidade descrita
ali) e com a mutação real dos dados (Aprovar 2 pendentes→Aprovado, aguardando 66→64; Recusar
3→Recusado, recusados 24→27; Excluir 2 registros removidos da listagem, ignorados intactos).
:: Obs ::
Processamento ficou ASSÍNCRONO (worker RecordsMassActionWorker), apesar do corpo do PR
mencionar "síncrono" — não é bug (coerente com "em andamento" + notificação de conclusão à
parte); na prática as contagens da toast bateram com o resultado real nas 3 ações. Efeito
colateral correto: a listagem não auto-atualiza mais após a ação, o usuário passa a depender da
notificação. Recusar exige campo Justificativa obrigatório (não citado no card, comportamento
correto). Uma 1ª tentativa com credenciais do .env não autenticou na org 37079 (evidências
01-04, preservadas) — destravada com a credencial confirmada por Dante para essa org.
:: Evidência(s) ::
- 01-registrosf2-login-recertificacao-falhou.png (histórico: credencial do .env rejeitada)
- 02-registrosf2-login-marcadagua-falhou.png (histórico: credencial do .env rejeitada)
- 03-sanity-recertificacao-no-home-36675-falhou.png (histórico: credencial morta na origem)
- 04-sanity-marcadagua-no-home-36675-sucesso.png (histórico: credencial viva, mas org errada)
- 05-listagem-baseline.png
- 06-aprovar-selecao-linhas.png
- 07-aprovar-drawer-acao.png
- 08-aprovar-confirmacao.png
- 09-aprovar-notificacao.png
- 10-recusar-confirmacao.png
- 11-recusar-listagem-recusados.png
- 12-excluir-confirmacao.png
- 13-notificacoes-3-acoes.png
- resultado-toast-notificacao.json (textos exatos de toast/notificação lidos ao vivo do DOM + estilo + mutação por ação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/commit/aa67e043fcc52b407b320029ef698387fbdf5c80
```
