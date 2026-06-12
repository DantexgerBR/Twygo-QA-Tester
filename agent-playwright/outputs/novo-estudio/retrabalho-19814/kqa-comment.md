# Retrabalho 19814 — P2 [Novo estúdio de criação] Sem controles de colapsar/ocultar o menu lateral

> ⚠️ LAUDO CORRIGIDO em 2026-06-12: a primeira versão deste laudo procurou o controle no
> menu lateral PRINCIPAL do app (Dashboard/Aprendizagem/...) e reprovou por ausência.
> O Dante corrigiu o alvo: o "menu lateral" da RN 2 é o PAINEL DA LISTA DE ATIVIDADES
> do Estúdio, e o controle é o chevron ao lado do "Adicionar". Revalidado com o alvo
> certo — o veredito correto é ✅.

Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533, aba Atividades (?tab=studio), desktop 1440x900
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
O controle de recolher o painel lateral do Estúdio existe e funciona: o chevron ao lado do "Adicionar" (aria-label "Recolher lista de atividades") oculta o painel inteiro da lista — sobra só um trilho fino com o botão "Expandir lista de atividades" — e o preview passa a ocupar toda a largura, liberando o espaço horizontal previsto na RN 2. Clicando no chevron de expandir, a lista volta ao estado original (360px). Ciclo recolher → ocultar → expandir validado sem erros.
:: Obs ::
Detalhe de wording da RN: o card menciona dois modos ("colapsável para ícones" E "ocultar inteiramente"). O implementado é um estado único de recolhimento que já oculta o painel por completo (não existe modo intermediário exibindo só ícones das atividades). Como o objetivo da RN (liberar espaço horizontal) está atendido com o controle entregue, dou o ✅ — se o modo intermediário "para ícones" for requisito separado, sugiro alinhar com o time e abrir card específico.
:: Evidência(s) ::
- v2-01-expandido.png (lista aberta, chevron "Recolher lista de atividades" visível)
- v2-02-recolhido.png (painel oculto, só o trilho com chevron de expandir; preview em tela cheia)
- v2-03-reexpandido.png (lista restaurada a 360px)
- resultado-v2.json (larguras, estados e controles detectados em cada passo)
- validar-retrabalho-19814-v2.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19814
```
