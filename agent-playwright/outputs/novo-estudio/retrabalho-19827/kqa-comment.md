# Retrabalho 19827 — P1 [Novo estúdio de criação] Botão "Editar" do preview nunca habilita

PR: nenhuma vinculada ao card (validado live em 2026-06-12 — corrigido em alguma entrega recente)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Repeti exatamente o cenário do card: cliquei na atividade pai "Conteúdo 1" e na sub-atividade "Material de apoio". Nos dois casos o botão "Editar" do preview está HABILITADO e, ao clicar, abre o formulário de edição da atividade (rota /o/37061/studio/activities/{id}/edit?type={tipo}&eventId=807533 — a mesma que antes só era acessível por URL direta). O caminho pela interface para editar atividade existente está funcionando.
:: Obs ::
O card está sem PR vinculada — o fix entrou em alguma das entregas recentes do Estúdio. Validado com os dois alvos da evidência original (pai e sub-atividade).
:: Evidência(s) ::
- 01-pai-selecionado-editar.png (pai aberto, Editar habilitado)
- 02-form-aberto-pai.png (form de edição aberto via botão)
- 03-sub-selecionada-editar.png + 04-form-aberto-sub.png (mesmo fluxo na sub-atividade)
- resultado.json (estado do botão e URLs dos forms)
- validar-retrabalho-19827.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19827
```
