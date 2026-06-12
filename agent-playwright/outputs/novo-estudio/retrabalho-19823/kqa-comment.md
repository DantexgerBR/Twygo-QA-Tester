# Retrabalho 19823 — P0 [Novo estúdio de criação] Reordenação e persistência de abas não existem

PR validada: https://github.com/Twygo/twyg-app/pull/10676 "Preferências de abas por usuário" (merged 2026-06-11)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533 (Conteúdos » Editar)
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
RN 3 implementada e funcional nos 4 pontos: (1) hover na aba "Modelo" exibe o ícone de arrastar (aria-label "Arrastar aba"), e "Identificação" segue travada — sem ícone e sem atributo draggable; (2) arrastar "Modelo" até "Banner" reordena as abas e dispara PATCH /api/v1/o/37061/studio/courses/807533/user_preferences com o tab_order completo (200); (3) ao reabrir o curso a ordem personalizada se mantém; (4) cliquei em "Banner", voltei pra listagem de Conteúdos e reabri o curso sem ?tab na URL — abriu direto na aba "Banner" (última aba usada). Testei também com um 2º usuário (dante.tavares): ele vê a ordem padrão e abre em "Identificação", confirmando que ordem e última aba são POR USUÁRIO.
:: Obs ::
Persistência por usuário x curso confirmada via endpoint user_preferences (tab_order/last_tab), conforme a RN. Ao final restaurei a ordem original e a aba "Identificação" do usuário de teste.
:: Evidência(s) ::
- 01-hover-modelo-icone-drag.png (ícone de drag visível no hover da aba Modelo)
- 02-apos-drag-modelo-banner.png (ordem reordenada após o drag)
- 03-apos-reload-ordem-persistida.png (ordem mantida ao reabrir)
- 04-retorno-abre-ultima-aba.png (retorno sem ?tab abre na aba Banner)
- 05-user-b-ordem-propria.png (2º usuário com ordem default e aba Identificação)
- 06-apos-cleanup.png (ordem original restaurada)
- resultado.json (atributos das abas, ordens, PATCH user_preferences com payload e status)
- validar-retrabalho-19823.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19823
```
