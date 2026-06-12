# Retrabalho 19855 — P3 [Novo estúdio de criação] Falha na exibição do aviso de "perguntas em modo aleatório" no preview do questionário

PRs: https://github.com/Twygo/twyg-app/pull/10659 (merged 2026-06-10) + https://github.com/Twygo/twyg-app/pull/10665 (rebote do StatusAlert padrão — ainda OPEN no momento da validação)
Ambiente: https://novoestudio.stage.twygoead.com — org 37061, curso 807533, questionário "Avaliação do curso"
Data da validação: 2026-06-12

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
No questionário "Avaliação do curso", configurei "Exibição das Perguntas" = "Exibir perguntas aleatórias" (aba Conteúdo do form da atividade) e abri o preview na coluna central: o aviso aparece corretamente — "Questões em ordem aleatória / As questões irão aparecer em sequência diferente a cada tentativa". Contra-prova: revertendo para "Exibir mesmas perguntas nas tentativas", o aviso some do preview, confirmando que ele reflete a configuração real.
:: Obs ::
A configuração do questionário foi restaurada ao valor original ao final (mutação com revert). Nota: a PR 10665 (refatoração do componente StatusAlert padrão, citada no card como rebote) ainda estava ABERTA no momento desta validação — o aviso em si (PR 10659) já está funcional em stage; quando a 10665 mergear vale um smoke rápido pra confirmar que o alerta não regrediu.
:: Evidência(s) ::
- probe-conteudo-tab.png (onde vive a config "Exibição das Perguntas")
- 04-select-aleatorio.png (config alterada para perguntas aleatórias)
- 05-preview-aviso-aleatorio.png (aviso visível no preview)
- 06-preview-sem-aviso-revertido.png (contra-prova: sem aleatório, sem aviso)
- resultado-v2.json (config original, opções do select, estados do aviso)
- validar-retrabalho-19855-v2.mjs (script da validação)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/retrabalho-19855
```
