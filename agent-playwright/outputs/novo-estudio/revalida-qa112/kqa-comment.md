# QA 1.12 (card 19716) — Renderizar versão publicada de forma assíncrona — REVALIDAÇÃO 12/06

Veredito anterior (10/06): ❌ por ausência do gatilho "Publicar alterações".
Revalidado: o fluxo de render assíncrono FOI entregue — com outro nome (D15 / PR 10429 + fixes 10609/10682).

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
E2E completo na aula GENTMP (curso 807533): no editor da Aula (aba Conteúdo) existem "Salvar como rascunho" (estado is_draft) e "Salvar e regerar" — este último dispara a renderização ASSÍNCRONA da versão publicada: o POST retorna 200 na hora, o admin volta ao Estúdio e continua trabalhando, o preview da atividade mostra badge "Renderizando..." e um banner global "Há 1 atividade do tipo aula sendo renderizada no seu ambiente. Tempo estimado restante: 2 minutos"; ~54s depois o badge vira "Pronto" sem reload manual. Núcleo da RN 12 (render assíncrono com status visível e trabalho não bloqueado) comprovado.
:: Obs ::
Correção de AT: a suíte parte do botão "Publicar alterações" no topo do Estúdio — o gatilho real implementado é "Salvar como rascunho"/"Salvar e regerar" dentro do editor da Aula, com status no preview + banner global. Sugiro o agent-at atualizar a suíte pra nomenclatura/fluxo entregue. TC10 (logs) segue bloqueado na própria AT (logging não implementado).
:: Evidência(s) ::
- 01-editor-inicial.png (botões do editor da Aula)
- 04-apos-disparo-render.png (volta ao Estúdio após o disparo)
- 05-preview-status-inicial.png (badge "Renderizando..." + banner global com tempo estimado)
- 06-preview-status-final.png (badge "Pronto" ~54s depois)
- resultado.json (timeline + POSTs save_activity_by_type 200)
Evidência no link: https://github.com/DantexgerBR/Twygo-QA-Tester/tree/project/novo-estudio/agent-playwright/outputs/novo-estudio/revalida-qa112
```
