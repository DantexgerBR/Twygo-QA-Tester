# Retrabalhos — QA 1.8 (Versionar conteúdo via rascunho) — formato Artia

> Ambiente: 🧪 Stage org 37061, curso 807533. TC1 (banco) PASSOU; só o TC2 falhou.

---

## P0 [Novo estúdio de criação] Editar uma atividade Página apaga o conteúdo publicado (TC2)

:: Incidente identificado ::
Editar uma atividade do tipo Página no Estúdio APAGA o conteúdo publicado: ao reabrir o formulário de edição, o editor (Slate) vem vazio (não carrega o conteúdo salvo) e qualquer Salvar persiste o vazio — o aluno que via o conteúdo passa a ver a página em branco (perda de conteúdo publicado). Isolado com "salvar sem alterar nada": o defeito é no carregamento do conteúdo no form. Reproduzido em 5 execuções (carregamento intermitente em 1 delas, o que torna a perda imprevisível).
[Prioridade P0: o doc de prioridades lista "perda de dados" como P0. Rebaixar para P1 se o time escopar como restrito ao estúdio em desenvolvimento.]

:: Passo a passo para reprodução ::
» Logar como administrador e abrir o Estúdio do curso 807533
» Criar uma atividade "Página", digitar texto no editor de conteúdo e Salvar
» Liberar a atividade e conferir como aluno inscrito que o conteúdo aparece no player (/e/807533/learn)
» Voltar como admin e REABRIR o formulário de edição da Página
» Observar: o editor está VAZIO (conteúdo salvo não carregado)
» Clicar em Salvar SEM alterar nada
» Conferir como aluno: a página que tinha conteúdo agora está em branco (conteúdo publicado perdido)

:: Comportamento esperado ::
Ao reabrir o formulário, o editor deve carregar o conteúdo salvo; salvar (com ou sem alterações) deve preservar o conteúdo. Sem perda de conteúdo publicado.

:: Evidência(s) ::
- Form reaberto vazio: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-17-reabrir1.png
- Após Salvar sem alterar — conteúdo apagado: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-18-reabrir2-pos-save.png
- Aluno via o conteúdo e passou a ver vazio: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-13-aluno-pos-edicao.png

---

## TC1 — sem retrabalho (PASSOU)
TC1 [db] validado read-only: `event_contents` não tem `is_draft`/`parent_event_content_id` → rascunho descartado, regressão ok.
