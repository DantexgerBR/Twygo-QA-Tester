# Retrabalho 19961 — P3 [Novo Estúdio] Mobile não usa as 3 abas no rodapé previstas

PR validada: https://github.com/Twygo/twyg-app/pull/10666 "tabs de rodapé no mobile do Estúdio (RN 54.2)" (merged 2026-06-11)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533, aba Atividades (?tab=studio)
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Em 360x740 a barra fixa de 3 abas aparece no rodapé (Atividades · Pré-visualização · Copiloto) e a alternância funciona com um toque: aba Pré-visualização mostra o preview, aba Copiloto abre o copiloto, aba Atividades volta pra lista — com aria-current acompanhando a aba ativa e o contexto preservado (a lista volta exatamente como estava, sem precisar do "Voltar"). Em 767px (limite superior do mobile) a barra também está presente e visível no rodapé.
:: Obs ::
Observação de escopo: a barra de rodapé renderiza abaixo de 768px (breakpoint isMobile do código). Na faixa 768–1365px o Estúdio usa o layout compacto de coluna única com drill-down + "Voltar" (sem as abas) — esse intervalo é objeto do card 19813, que segue reprovado (ver laudo daquele card).
:: Evidência(s) ::
- 01-360-aba-lista.png (barra no rodapé, aba Atividades ativa)
- 02-360-aba-preview.png (preview ativo via aba)
- 03-360-aba-copiloto.png (copiloto ativo via aba)
- 04-360-volta-lista.png (retorno à lista com contexto preservado)
- 05-767-barra-rodape.png (barra presente em 767px)
- resultado.json (estado da barra, aria-current e visibilidade das áreas em cada passo)
- validar-retrabalho-19961.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19961
```
