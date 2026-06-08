# Laudo QA 1.8 — Versionar conteúdo via rascunho (regressão)

- **Atividade Artia**: 19712 — [Novo estúdio de criação - 3.Desenvolvimento] QA 1.8 (RN 8 — descartada; suíte é de REGRESSÃO)
- **Solicitante**: João Miguel Gorski
- **Ambiente**: 🧪 Stage — novoestudio.stage.twygoead.com (org 37061), curso 807533
- **Execuções**: 5 execuções em 05/06/2026 (3 técnicas de edição + experimento de isolamento "salvar sem alterar")
- **Cobertura**: 2 TCs (auditada na AT canônica — suíte completa)
- **Cleanup**: todas as 5 atividades temporárias de Página criadas nos testes foram excluídas; lista de volta ao estado original

## Resultado: 1 ✅ · 1 ❌ (TC1 validado em banco read-only 08/06)

| TC | Caso | Veredito |
|---|---|---|
| TC1 | [db] Schema sem coluna is_draft/parent_event_content_id | ✅ (validado em banco read-only 08/06: `event_contents` tem 65 colunas, **nenhuma** de rascunho/versão — `is_draft`/`parent_event_content_id` ausentes → rascunho NÃO implementado, regressão ok) |
| TC2 | [ui] Edição em produção é imediata (sem rascunho) | ❌ **BUG GRAVE encontrado no caminho do teste** |

## ❌ TC2 — BUG: editar uma Página apaga o conteúdo publicado

O TC2 (regressão: admin edita conteúdo de atividade "Página" → aluno vê a alteração
imediatamente) **não pôde ser confirmado porque a edição de Página está quebrada**:

**Sequência comprovada (5 execuções, 05/06):**
1. Criar atividade Página no Estúdio + digitar conteúdo + Salvar → **funciona** (3/3);
2. Liberar a atividade → **aluno inscrito vê o conteúdo no player** (`/e/807533/learn`) → ✓
   prova de que o conteúdo foi salvo e publicado;
3. **REABRIR o form de edição da Página → o editor de conteúdo (Slate) vem VAZIO** — o
   conteúdo salvo não é carregado (reproduzido inclusive SEM nenhuma edição prévia, no
   experimento de isolamento);
4. Qualquer "Salvar" a partir daí **persiste o editor vazio e APAGA o conteúdo** — inclusive
   o publicado: o aluno que via o conteúdo passou a ver a página vazia (perda de dado
   publicado, comprovada com 2 usuários).

Isolamento da causa: no experimento final, criamos a página, salvamos o conteúdo,
reabrimos o form **sem tocar em nada** → editor vazio; clicamos Salvar **sem alterar nada**
→ conteúdo apagado. Ou seja: o defeito está no **carregamento do conteúdo salvo no form de
edição** (e o save subsequente persiste o estado vazio). Obs: o carregamento aparenta ser
intermitente (numa das 5 execuções o conteúdo chegou a carregar), o que agrava — o usuário
não tem como prever quando vai perder conteúdo.

**Consequência pro TC2 da regressão**: impossível validar "edição refletida imediatamente"
— a edição destrói o conteúdo antes. O comportamento legado de edição direta NÃO está
preservado neste fluxo.

## Evidências (GitHub)

- Aluno vendo o conteúdo publicado (antes da edição): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-11-aluno-v1.png
- Form reaberto com editor VAZIO (sem nenhuma edição prévia): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-17-reabrir1.png
- Após "Salvar" sem alterar nada — conteúdo apagado: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-18-reabrir2-pos-save.png
- Aluno que via o conteúdo passou a ver página vazia: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-13-aluno-pos-edicao.png

## Comentário KQA (para o Artia 19712)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Suíte de regressão "Versionar conteúdo via rascunho" (2 TCs — RN 8 descartada) na org
37061, curso 807533, com 2 usuários (admin + aluno inscrito). TC1 (banco) ✅ — `event_contents`
não tem `is_draft`/`parent_event_content_id` (rascunho descartado, regressão ok). TC2 ❌ —
bug grave no caminho do teste, tratado no retrabalho abaixo.
:: Obs ::
Retrabalho criado:
1) P0 [Novo estúdio de criação] Editar uma atividade Página APAGA o conteúdo publicado: ao
reabrir o form de edição, o editor vem vazio (não carrega o conteúdo salvo) e qualquer Salvar
persiste o vazio — o aluno que via o conteúdo passa a ver a página em branco (PERDA de
conteúdo publicado). Isolado com "salvar sem alterar nada": o defeito é no carregamento do
conteúdo no form. Reproduzido em 5 execuções (carregamento intermitente em 1 delas).
[Prioridade P0: o doc lista "perda de dados" como P0; rebaixar pra P1 se o time escopar só
ao estúdio em dev.]
Link: 
TC1 validado em banco (read-only): `event_contents` sem colunas de rascunho — sem pendência.
Obs: a parte "publicação inicial é imediata" funciona (criar página → liberar → aluno vê
na hora, sem rascunho intermediário) — o problema é exclusivamente a REedição.
:: Evidência(s) ::
- Form reaberto vazio (sem edição prévia):
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-17-reabrir1.png
- Salvar sem alterar → conteúdo apagado:
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-18-reabrir2-pos-save.png
- Aluno via o conteúdo e passou a ver vazio:
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-13-aluno-pos-edicao.png
- Aluno vendo o conteúdo publicado antes:
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-11-aluno-v1.png
```

## Retrabalho pronto (formato Artia)

```
TÍTULO: P0 [Novo estúdio de criação] Editar uma atividade Página apaga o conteúdo publicado

:: Incidente identificado ::
Editar uma atividade do tipo Página no Estúdio APAGA o conteúdo publicado — o form de edição reabre com o editor vazio (não carrega o conteúdo salvo) e qualquer Salvar persiste o vazio

    :: Passo a passo para reprodução ::
» Passo 1: Logar como administrador e abrir o Estúdio do curso 807533 (aba Atividades)
» Passo 2: Criar uma atividade do tipo "Página", digitar um texto no editor de conteúdo e Salvar
» Passo 3: Liberar a atividade e conferir como aluno inscrito que o conteúdo aparece no player (/e/807533/learn)
» Passo 4: Voltar como admin e REABRIR o formulário de edição da Página (aba Conteúdo)
» Passo 5: Observar: o editor está VAZIO — o conteúdo salvo não foi carregado
» Passo 6: Clicar em "Salvar" SEM alterar nada
» Passo 7: Conferir como aluno: a página que tinha conteúdo agora está em branco (conteúdo publicado perdido)

    :: Comportamento esperado ::
Ao reabrir o formulário de edição, o editor deve carregar o conteúdo salvo da Página; salvar (com ou sem alterações) deve preservar o conteúdo. Impacto: perda de conteúdo publicado — o instrutor que reabrir uma página para um ajuste perde tudo o que os alunos estavam vendo. Observação: em 1 de 5 execuções o conteúdo chegou a carregar (intermitente), o que torna o defeito imprevisível para o usuário.

    :: Informações ::
url: https://novoestudio.stage.twygoead.com/o/37061/contents/807533/edit?tab=studio
login: agents.qa@claude.com
senha: 123456
org_id: 37061

    :: Evidência(s) ::
- Form reaberto com editor vazio (sem edição prévia): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-17-reabrir1.png
- Após Salvar sem alterar nada — conteúdo apagado: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-18-reabrir2-pos-save.png
- Aluno que via o conteúdo passou a ver página vazia: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-13-aluno-pos-edicao.png
- Aluno vendo o conteúdo publicado antes da reedição: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa18-11-aluno-v1.png
```
