# Retrabalho 19818 — P4 [Novo estúdio de criação] Acessibilidade dos botões de pendentes

PR validada: https://github.com/Twygo/twyg-app/pull/10637 (merged 2026-06-10)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533, aba Atividades (?tab=studio)
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Criei uma atividade do tipo Página (nasce com badge "3 pendentes"), abri o popover pelo botão do badge e inspecionei os 3 itens. O título "Clique em um item pendente para gerar com o copiloto:" aparece e cada item é um <button> com aria-label no formato esperado: "Roteiro, pendente. Clique para gerar com o copiloto.", "Conteúdo, pendente. Clique para gerar com o copiloto." e "Imagem, pendente. Clique para gerar com o copiloto." — 3/3 itens com aria-label correto, legível por leitores de tela.
:: Obs ::
A atividade criada para o teste foi excluída ao final (curso restaurado). Detalhe de wording: o card pedia "conteúdo da página pendente" e "imagens pendente"; o rótulo implementado usa "Conteúdo" e "Imagem" (singular) — o aria-label segue exatamente o rótulo visível do item, então a semântica de acessibilidade está atendida.
:: Evidência(s) ::
- 01-card-com-badge-pendentes.png (card da Página com badge "3 pendentes")
- 02-popover-aberto.png (popover com título e os 3 itens)
- 03-apos-cleanup.png (curso sem a atividade de teste)
- resultado.json (aria-label capturado de cada um dos 3 botões)
- validar-retrabalho-19818.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19818
```
