# Retrabalho 19814 — P2 [Novo estúdio de criação] Sem controles de colapsar/ocultar o menu lateral

PR: nenhuma vinculada ao card
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533, aba Atividades (?tab=studio), desktop 1440x900
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Com o Estúdio aberto, varri o menu lateral principal (240px de largura, itens Dashboard/Aprendizagem/Usuários etc.): todos os 75 elementos clicáveis dele são itens de navegação ou expansores de submenu — não existe nenhum botão de recolher para ícones nem de ocultar o menu, nem mesmo no hover da borda. A RN 2 (menu colapsável + opção de ocultar para liberar espaço horizontal pro Estúdio) segue ausente.
:: Obs ::
Funcionalidade ausente nesta entrega — o card está sem PR vinculada, coerente com a ausência. Os únicos controles de recolher/ocultar que existem são internos do Estúdio ("Recolher lista de atividades" e "Ocultar sub-atividades"), que não atendem a RN 2 (referem-se à lista de atividades, não ao menu lateral principal). Como o projeto segue em desenvolvimento, vale confirmar com o time se a RN 2 está no escopo de alguma entrega futura antes de reabrir prioridade.
:: Evidência(s) ::
- 01-estudio-sidebar-sem-controles.png (Estúdio aberto, menu lateral sem nenhum controle)
- 02-hover-borda-sidebar.png (hover na borda do menu — nenhum controle aparece)
- resultado.json (varredura: candidatos a controle + botões dentro do menu = nenhum)
- validar-retrabalho-19814.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19814
```
