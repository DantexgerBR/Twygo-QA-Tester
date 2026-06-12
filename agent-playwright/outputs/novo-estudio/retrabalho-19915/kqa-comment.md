# Retrabalho 19915 — P2 [Novo estúdio de criação] Atividade de Games não vem com "marcar como concluído manualmente" habilitada por padrão

PR validada: https://github.com/Twygo/twyg-app/pull/10645 "player oficial do YouTube e conclusão manual obrigatória (Games/YouTube)" (merged 2026-06-10)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Criei uma atividade do tipo Games e abri a edição: a opção "Permitir marcar atividade como concluída manualmente" já vem ATIVADA por padrão e BLOQUEADA — o switch está desabilitado (disabled + aria-disabled) e o clique não consegue desativá-lo, atendendo à regra de negócio. O backend também grava mark_completed=true na criação de atividades Games (visto no código da PR 10645).
:: Obs ::
A PR 10645 também entrega a mesma trava para o player oficial do YouTube (campo "Player do vídeo" em atividade Externa com a flag youtubePlayerOficialEnabled): ao escolher o player oficial, o markCompleted é forçado a true e bloqueado — não validei o fluxo YouTube nesta rodada porque o card o cita como ainda não implementado; se quiserem, valido em card próprio. A atividade Games criada para o teste foi excluída ao final.
:: Evidência(s) ::
- 02-switch-on-bloqueado.png (switch ativado e desabilitado no form do Games)
- 03-apos-tentativa-desativar.png (após clique, switch permanece ativado)
- resultado.json (estado do switch antes/depois da tentativa de desativar)
- validar-retrabalho-19915.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19915
```
