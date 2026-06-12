# Retrabalho 19813 — P2 [Novo estúdio de criação] Sem layout mobile abaixo de 1366px

PR validada: https://github.com/Twygo/twyg-app/pull/10644 "Layout responsivo do Estúdio abaixo de 1366px" (merged 2026-06-10) + PR 10666 (abas de rodapé)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533, aba Atividades (?tab=studio)
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reproduzi em 1024x600 e 1280x720. O que melhorou: o Estúdio não fica mais com o desktop espremido — abaixo de 1366px aplica coluna única com drill-down (lista vira preview ao tocar, com "Voltar"). O que ainda reprova o card: (1) o scroll horizontal PERSISTE — em 1024x600 a página rola 104px pro lado e corta conteúdo (em 1280x720 são 83px); (2) as 3 tabs no rodapé NÃO aparecem nessa faixa — elas só renderizam abaixo de 768px.
:: Obs ::
Causa raiz do scroll: não é o shell do Estúdio (ele cabe na tela) — é a fileira de abas superiores do "Editar curso" (componente desktop-tabs): o último botão (tab-studio, "Atividades") estoura a largura do documento em vez de rolar dentro do próprio container. O estouro existe até no desktop 1440x900 (16px). Sobre as tabs de rodapé: o código usa dois breakpoints (isCompact <1366px pra coluna única; isMobile <768px pra barra de abas) — se a faixa 768–1365px com drill-down for decisão de design e não regressão da RN, sugiro alinhar com o time e desmembrar: manter este card só pro scroll horizontal (bug objetivo) e tratar a faixa das abas como definição de produto.
:: Evidência(s) ::
- 01-1024x600-layout-mobile.png (coluna única, sem barra de rodapé)
- probe-1024-scrollado.png (página rolada 104px pro lado — conteúdo cortado à esquerda)
- 02-1280x720-layout-mobile.png · 03-1440x900-desktop-3-colunas.png
- resultado.json (scrollWidth/clientWidth por viewport + presença da barra)
- validar-retrabalho-19813.mjs e probe-overflow2-19813.mjs (scripts: validação + isolamento da causa raiz)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19813
```
