# Retrabalho 19838 — P1 [Novo estúdio de criação] Mover "atividade filha" para "fora do pai" não funciona

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
Arrastei a filha "Apresentação" (posição 1.2 do pai "Conteúdo 1", que tem 3 filhas) para fora do agrupamento, soltando na borda superior do card "Conteúdo 2" (1º nível). A filha virou atividade de 1º nível imediatamente na UI (posição 2, sem precisar recarregar), o PATCH /api/v1/o/37061/studio/courses/807533/activities/reorder foi disparado com o payload esperado {"activity_id":9288191,"new_parent_id":null,"position":2} e retornou 200, e a mudança persistiu após reload.
:: Obs ::
A PR 10650 trocou o dnd-kit por drag-and-drop HTML5 nativo: a zona onde se solta no card alvo decide a ação (borda superior = antes, borda inferior = depois, centro = vira sub-atividade). Soltar na borda de um card de 1º nível é o que manda a atividade pra raiz. Validei também o caminho inverso (re-aninhar soltando no centro do pai) para restaurar a estrutura original do curso — tudo persistindo corretamente (PATCH 200 em cada movimento).
:: Evidência(s) ::
- 01-antes-do-drag.png (Apresentação como 1.2 dentro de Conteúdo 1)
- 02-apos-drag-pra-fora.png (Apresentação como atividade de 1º nível, posição 2, sem reload)
- 03-apos-reload.png (persistência após recarregar a página)
- 04-apos-restauracao.png (estrutura original restaurada)
- resultado.json (estruturas antes/depois + requests de Network com payloads)
- validar-retrabalho-19838.mjs (script da validação)
Evidência no link: <COMMIT_URL>
```
