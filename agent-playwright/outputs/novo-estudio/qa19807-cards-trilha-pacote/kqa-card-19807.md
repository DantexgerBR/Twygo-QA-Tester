# Card 19807 — [P1] Cards Trilha/Pacote abrem o formulário de CURSO (retrabalho R1)

Validado em 11/06/2026 · org 37061 (novoestudio.stage) · PR do fix twyg-app#10599
("cards Trilha e Pacote abrem o fluxo correto (kind numérico)", mergeado 08/06).

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reproduzi o passo a passo do incidente ao vivo em 11/06 (org 37061, página
"O que você quer criar?"). Os 3 cards agora enviam kind NUMÉRICO e abrem o fluxo
correto: Trilha → /contents/new?kind=3 com form "Nova trilha" (breadcrumb
"Conteúdos > Adicionar trilha"); Pacote → /contents/new?kind=4 com form
"Novo pacote"; Curso (regressão) → /contents/new?kind=0 com form "Novo curso".
Idêntico ao fluxo atual do baseline (org 36675) usado na abertura do bug.
:: Obs ::
Detalhe pré-existente (NÃO é desvio do fix): o campo Nome do form "Nova trilha"
usa placeholder "Nome do curso" — cruzei com o baseline do fluxo atual (org 36675,
07-destino-trilha.png) e o placeholder é o mesmo lá; quirk legado do form, fora do
escopo deste retrabalho.
:: Evidência(s) ::
- 01-pagina-cards.png (página "O que você quer criar?")
- 02-destino-trilha.png (kind=3 → "Nova trilha")
- 03-destino-pacote.png (kind=4 → "Novo pacote")
- 04-destino-curso.png (kind=0 → "Novo curso", regressão ok)
Evidência no link: (preencher com commit)
```
