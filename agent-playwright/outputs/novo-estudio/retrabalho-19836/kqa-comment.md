# Retrabalho 19836 — P1 [Novo estúdio de criação] Reorganização de atividades não funciona corretamente no front

PR validada: https://github.com/Twygo/twyg-app/pull/10650 (merged 2026-06-10)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533, aba Atividades (?tab=studio)
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Arrastei a atividade "Conteúdo 1" da posição 1 para a posição 3 (soltando na borda inferior do card da posição 3). A nova ordem refletiu IMEDIATAMENTE no front, sem recarregar a página (posições renumeradas 1,2,3), e o PATCH /activities/reorder foi disparado na hora com {"activity_id":9288189,"new_parent_id":null,"position":3}, retornando 200. Após reload a ordem se manteve, confirmando que front e back ficaram consistentes.
:: Obs ::
Restaurei a ordem original do curso ao final (drag de volta pra posição 1, também com atualização imediata e PATCH 200). A correção trocou o dnd-kit por drag-and-drop HTML5 nativo com atualização otimista da lista.
:: Evidência(s) ::
- 01-ordem-inicial.png (Conteúdo 1 na posição 1)
- 02-apos-drag-sem-reload.png (ordem nova refletida no front sem reload — Conteúdo 1 na posição 3)
- 03-apos-reload.png (ordem persistida no back)
- 04-apos-restauracao.png (ordem original restaurada)
- resultado.json (ordens antes/depois + PATCH com payload e status)
- validar-retrabalho-19836.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19836
```
