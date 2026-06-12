# QA 1.16 (card 19720) — Duplicar curso a partir do Estúdio — REVALIDAÇÃO 12/06

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reexecutado em 12/06 (org 37061, curso 807533): a suíte (12 TCs) parte do botão "Salvar como novo" no menu secundário do topo do Estúdio. A varredura completa de botões/links/menuitems do Estúdio retornou 0 ocorrências de "Salvar como novo", "Duplicar" ou "Publicar" — o topo segue só com Voltar/Visualizar como aluno/Abrir copiloto + ações por atividade. Sem o gatilho, os 12 TCs continuam inexecutáveis (0 TCs passando).
:: Obs ::
Mesma situação de 10/06 — duplicação a partir do Estúdio segue ausente; nenhuma PR de "Salvar como novo" foi encontrada no twyg-app até esta data (#R16 era P3 "se der tempo" no Discovery). Não é bug — funcionalidade não entregue; alinhar com João se sai do escopo ou entra em sprint futura. Obs: existe a PR aberta 10683 "Clone completo de organização" (outra coisa — clone de org, não duplicação de curso no Estúdio).
:: Evidência(s) ::
- 01-topo-estudio.png (topo do Estúdio em 12/06, sem menu de duplicação)
- recon.json (varredura de botões: matches = [])
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa116
```
