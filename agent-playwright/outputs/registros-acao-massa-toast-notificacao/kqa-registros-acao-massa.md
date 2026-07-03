# Validação — Ação em massa em Registros (toast + notificação) — PR #10978 (P2)

**PR**: https://github.com/Twygo/twyg-app/pull/10978 — **MERGED** (base `feature/registros-externos`).
**Ambiente**: Stage `registrosf2.stage.twygoead.com`, org **37079**, perfil Administrador. **2026-07-03**.

## O que o card pede

Nas 3 ações em massa de Registros (Aprovar / Recusar / Excluir), ajustar (a) a **toast**
azul "em andamento" de 3 linhas (mesmo padrão/cor/fonte do "Inscrever em curso", só o texto
muda) e (b) a **notificação** de conclusão. Importante 1: clicar na notificação leva à
listagem de registros. Importante 2: a 3ª linha da toast avisa quantos itens serão executados
e quantos serão ignorados (por não atenderem à regra).

## Como foi testado (ao vivo, via browser)

Para cada ação montei uma seleção com registros **válidos + ignorados** e executei o fluxo
real (Ações em massa → escolher ação → Executar → Confirmar), capturando a toast e a
notificação, e cruzando com a **mutação real** dos dados e os contadores da tela.

Regras confirmadas (dialog de confirmação + resultado): Aprovar/Recusar valem só p/ **Externo +
Aguardando confirmação**; Excluir vale p/ **Externo + não-pendente**; os demais são ignorados.

## Resultado — bate 100% com o card nas 3 ações

### Toasts (3 linhas, azul `info`, fonte Lato — capturado do DOM)

| Ação | Texto capturado ao vivo |
|---|---|
| **Aprovar** | `Aprovação dos registros em andamento` / `Ação em massa em andamento` / `2 registros serão aprovados (2 ignorados por não atender aos critérios).` |
| **Recusar** | `Recusas dos registros em andamento` / `Ação em massa em andamento` / `3 registros serão recusados (5 ignorados por não atender aos critérios).` |
| **Excluir** | `Exclusão dos registros em andamento` / `Ação em massa em andamento` / `2 registros serão excluídos (2 ignorados por não atender aos critérios).` |

Estilo da toast comprovado programaticamente: `data-status="info"`, `background rgb(190,227,248)`
(azul), `font Lato`, **3 linhas** (`preserveLineBreaks`) — exatamente "nosso padrão, mesma cor e
fonte", só o texto muda.

### Notificações (todas com título "Ação em massa concluída")

| Ação | Subtítulo |
|---|---|
| **Aprovar** | `Aprovação dos registros realizadas` |
| **Recusar** | `Recusas dos registros realizadas` |
| **Excluir** | `Exclusão dos registros realizadas` |

As 3 apareceram juntas no painel de Notificações (evidência `08-notificacoes-3-acoes.png`).

### Importante 1 — clique da notificação → listagem
Confirmado ao vivo: a notificação é um link e, estando em outra página (`/events`), o clique
abriu **`/o/37079/records`** (listagem de registros).

### Contagem válidos × ignorados — confirmada por mutação real
- Aprovar: 2 Aguardando → Aprovado (contador "aguardando" 66→64).
- Recusar: 3 Aguardando → Recusado (recusados 24→27, aguardando 64→61); 5 ignorados intactos.
- Excluir: 2 registros QA116 removidos da listagem; 2 Interno ignorados.

## Observações (não impedem o PASSOU)

1. **Processamento é assíncrono**, apesar do PR body dizer "síncrono": o worker
   `RecordsMassActionWorker.perform_async` faz o trabalho real; a contagem da toast vem de um
   `dry_run: true` separado. Não é bug — é coerente com "em andamento" + notificação de
   conclusão, e na prática as contagens bateram.
2. **A listagem não auto-atualiza mais** após a ação (`records` foi removido de
   `MODELS_WITH_LIST_REFRESH`) — o usuário passa a depender da notificação. Coerente com o async.
3. **Recusar exige Justificativa** (campo obrigatório no drawer) — não citado no card, mas é
   comportamento correto.

## Veredito

**✅ Passou** — as 3 toasts (3 linhas, azul/Lato) e as 3 notificações batem exatamente com o
card, o clique da notificação leva à listagem, e a contagem válidos/ignorados foi confirmada
por mutação real dos dados. Comprovado ao vivo no Stage `registrosf2` (org 37079).

## Comentário KQA (colar no Artia)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage (registrosf2.stage.twygoead.com, org 37079)
:: Validação ::
Validadas ao vivo as 3 ações em massa de Registros (Aprovar/Recusar/Excluir). Toast azul
"em andamento" de 3 linhas com os textos exatos do card em cada ação (ex.: "Aprovação dos
registros em andamento / Ação em massa em andamento / 2 registros serão aprovados (2 ignorados
por não atender aos critérios)."), mesmo padrão/cor(info)/fonte(Lato), só o texto muda.
Notificação de conclusão "Ação em massa concluída" com o subtítulo por ação ("Aprovação/
Recusas/Exclusão dos registros realizadas"). Clicar na notificação leva à listagem de registros
(/o/:org/records) — confirmado. Contagem válidos × ignorados confere: comprovada pela mutação
real (Aprovar 2 pendentes→Aprovado; Recusar 3→Recusado, recusados 24→27; Excluir 2 removidos)
e pelos ignorados intactos.
:: Obs ::
O processamento ficou ASSÍNCRONO (worker), apesar do texto do PR dizer "síncrono" — não é bug
(coerente com "em andamento" + notificação de conclusão). Efeito colateral correto: a listagem
não auto-atualiza mais após a ação, o usuário depende da notificação. Recusar exige campo
Justificativa obrigatório (não citado no card, comportamento correto).
:: Evidência(s) ::
- 00-listagem-baseline.png
- 01-aprovar-selecao-linhas.png
- 02-aprovar-drawer-acao.png
- 03-aprovar-confirmacao.png
- 04-aprovar-notificacao.png
- 05-recusar-confirmacao.png
- 06-recusar-listagem-recusados.png
- 07-excluir-confirmacao.png
- 08-notificacoes-3-acoes.png
- resultado.json (textos exatos de toast/notificação + estilo + mutação por ação)
Evidência no link: <preencher com a URL do commit após push>
```
