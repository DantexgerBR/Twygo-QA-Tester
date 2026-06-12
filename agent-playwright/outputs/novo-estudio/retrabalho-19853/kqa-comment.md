# Retrabalho 19853 — P2 [Novo estúdio de criação] Corpo do conteúdo do input de página está sendo cortado ao colar texto grande

PR validada: https://github.com/Twygo/twyg-app/pull/10638 "Scroll interno no editor de conteúdo da aula Página" (merged 2026-06-10)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Criei uma atividade Página descartável, abri a aba Conteúdo e colei um texto longo de 61 parágrafos (primeira linha marcada "INICIO-19853..."). Rolando de volta ao topo, a primeira linha do texto colado fica totalmente visível dentro do editor — sem corte pela borda superior e sem precisar de navegação por teclado. Medição: o início do conteúdo fica 22px abaixo da borda do container (não clipado) e alcançável por scroll natural.
:: Obs ::
A atividade de teste foi excluída ao final, sem salvar conteúdo no curso. Detalhe técnico do fix (PR 10638): o scroll passou a ser interno do próprio editor (overflow no elemento do Slate), eliminando o corte do topo.
:: Evidência(s) ::
- 02-apos-colar-fim-do-texto.png (texto longo colado)
- 03-scroll-no-topo-primeira-linha.png (primeira linha "INICIO-19853..." integral no topo)
- resultado.json (medições de posição/clip)
- validar-retrabalho-19853.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19853
```
