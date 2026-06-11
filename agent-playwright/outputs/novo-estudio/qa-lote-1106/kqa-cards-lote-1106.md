# Comentários KQA — lote de retrabalhos validado em 11/06/2026

Org 37061 (novoestudio.stage) · curso 807533 · viewports testados no responsivo:
1024×600, 768×1024, 767×800, 360×740. Card 19812 validado em testedemigracao
(org 19653, sem a flag). Evidências nas subpastas desta pasta.

Placar: 6 ✅ (19847, 19846, 19826, 19821, 19812, 19809) · 3 ❌ (19961, 19813, 19814).

---

## Card 19847 — [P3] Ctrl+J abre o copiloto mas não fecha (PR 10616)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reproduzido ao vivo em 11/06 (Estúdio do curso 807533, org 37061): Ctrl+J abriu o
drawer do copiloto e Ctrl+J novamente FECHOU — o toggle funciona nos dois sentidos.
:: Evidência(s) ::
- qa_lote_1106_desktop/19847-ctrlj-abriu.png
- qa_lote_1106_desktop/19847-ctrlj-fechou.png
Evidência no link: (commit)
```

---

## Card 19821 — [P3] Drawer do copiloto fora do padrão (PR 10639)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Medido ao vivo em 11/06 (viewport 1366): o drawer abre com exatos 683px = 50% da
largura, e o botão de expandir existe e leva a 1366px = 100%. Comportamento
idêntico ao padrão confirmado com o dev em 05/06.
:: Evidência(s) ::
- qa_lote_1106_desktop/19821-drawer-aberto.png (50%)
- qa_lote_1106_desktop/19821-drawer-expandido.png (100%)
Evidência no link: (commit)
```

---

## Card 19826 — [P3] Lista do Estúdio não reflete o nome customizado do tipo (PR 10615)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reproduzi o passo a passo em 11/06 na atividade 9288190: troquei "Texto exibido
para o aluno" de "PDF Estampado" para "Aula Customizada QA", salvei e a LISTA do
Estúdio passou a exibir "Aula Customizada QA" no card (1.1 Material de apoio).
Campo restaurado para "PDF Estampado" ao final (estado original preservado).
:: Evidência(s) ::
- qa_lote_1106_desktop/19826-form-salvo.png
- qa_lote_1106_desktop/19826-lista.png
Evidência no link: (commit)
```

---

## Card 19846 — [P0] Editar uma atividade Página apaga o conteúdo publicado

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Validado em 11/06 (curso 807533): criei uma Página com conteúdo, salvei e REABRI o
formulário 5 VEZES — o editor carregou o conteúdo nas 5 (no bug original carregava
em ~1 de 5). Cliquei em Salvar SEM alterar nada e o conteúdo foi preservado
(reaberto e conferido). A atividade de teste foi excluída ao final.
:: Obs ::
Card não tinha PR vinculado, mas o comportamento esperado está comprovado no
ambiente — possivelmente corrigido junto ao PR 10544 (narrator_script) ou outro.
Como o defeito era intermitente, recomendo manter atenção em regressivo.
:: Evidência(s) ::
- qa19846_pagina_conteudo/01-form-preenchido.png
- qa19846_pagina_conteudo/02-reabertura-1.png (conteúdo carregado)
- qa19846_pagina_conteudo/03-pos-save-sem-alterar.png (preservado)
Evidência no link: (commit)
```

---

## Card 19809 — [P0] "Criar curso com IA" bloqueado mesmo com IA ativa e saldo

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reproduzi o passo a passo em 11/06 (org 37061): clique em "Criar curso com IA" em
Aprendizagem » Conteúdos NÃO exibe mais o toast de bloqueio e navega para
/contents/new_with_ai com o assistente aberto (opções "Assistente de criação" e
"Importar arquivo"). Não prossegui no assistente (não consumir créditos da org).
:: Obs ::
Card sem PR vinculado; comportamento esperado comprovado no ambiente.
:: Evidência(s) ::
- qa_lote_1106_desktop/19809-criar-com-ia.png
Evidência no link: (commit)
```

---

## Card 19812 — [P2] Sem feature flag: aba "Atividades" aparecendo na criação (PR 10601)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Validado em 11/06 no ambiente do incidente (testedemigracao, org 19653, SEM a
flag do Estúdio): o formulário de criação de curso (/contents/new?kind=course e
?kind=0) exibe somente as abas legadas — Identificação, Acesso, Banner, Aprovação,
Cobrança, Localização, Dashboard, Compartilhar. A aba "Atividades" NÃO aparece em
nenhum momento da criação.
:: Evidência(s) ::
- qa19812_aba_sem_flag/criacao-contents-new-kind-course.png
- qa19812_aba_sem_flag/criacao-contents-new-kind-0.png
Evidência no link: (commit)
```

---

## Card 19961 — [P3] Mobile não usa as 3 abas no rodapé previstas (PR 10666)

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Validado em 11/06 (curso 807533). A barra de 3 abas no rodapé FOI implementada e
aparece em 360px e 767px ("Atividades · Pré-visualização · Copiloto"), sem scroll
horizontal; alternar Atividades ↔ Pré-visualização funciona. PORÉM a aba
"Copiloto" está INACESSÍVEL em 360px: o balão do chat de suporte (iframe
HubSpot, canto inferior direito) fica sobreposto à aba e intercepta o toque —
testei 2 pontos da aba (centro e borda esquerda) e em ambos o
document.elementFromPoint retorna o IFRAME do chat; o clique não abre o copiloto.
:: Obs ::
O núcleo do retrabalho foi entregue (RN 54.2); o que falta é pontual: em mobile, o
widget de chat precisa ser reposicionado/z-index ajustado (ou a tab bar ganhar
margem) para a 3ª aba ser tocável. Sem isso o usuário não tem como abrir o
copiloto no celular. Sugestão: rebote focado na sobreposição, não reabertura do
escopo todo.
:: Evidência(s) ::
- qa_lote_1106_responsivo/estudio-360x740.png (abas presentes; chat sobre a 3ª)
- qa_lote_1106_responsivo/360-tab-preview.png (alternância funcionando)
- qa_lote_1106_responsivo/360-tab-copiloto-clique-fisico.png (toque interceptado)
- qa_lote_1106_responsivo/360-tab-copiloto-clique-esquerda.png
Evidência no link: (commit)
```

---

## Card 19813 — [P2] Sem layout mobile abaixo de 1366px (PR 10644)

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Validado em 11/06 nos 4 viewports. O responsivo chegou para mobile/tablet: 360px e
767px com as 3 abas no rodapé e sem scroll horizontal; 768px em layout de colunas
sem scroll. PORÉM na resolução EXATA do passo a passo do card (1024×600) o Estúdio
segue com layout desktop espremido E scroll horizontal, sem as abas — a faixa
769–1365px continua sem tratamento responsivo.
:: Obs ::
Fix parcial: cobriu ≤768px e deixou de fora a faixa tablet-landscape/notebook
pequeno (769–1365px) que era justamente o cenário reportado. Reabrir/rebotar para
estender o breakpoint.
:: Evidência(s) ::
- qa_lote_1106_responsivo/estudio-1024x600.png (desktop espremido + scroll)
- qa_lote_1106_responsivo/estudio-768x1024.png (ok)
- qa_lote_1106_responsivo/estudio-360x740.png (ok)
Evidência no link: (commit)
```

---

## Card 19814 — [P2 Rebote] Sem controles de colapsar/ocultar o menu lateral

```
⇝ QA ⇜
:: Teste ::
❌ Falhou
:: Ambiente ::
🧪 Stage
:: Validação ::
Reverificado em 11/06 (Estúdio do 807533): o menu lateral principal (Dashboard,
Aprendizagem, Usuários…) segue SEM nenhum controle de recolher para ícones ou de
ocultar. Varredura por aria-label/título/texto em todos os botões visíveis só
encontra controles da LISTA DE ATIVIDADES ("Recolher lista de atividades") e de
sub-atividades — nada para o menu lateral.
:: Obs ::
Card sem PR vinculado — fix aparentemente ainda não desenvolvido (coerente com o
resultado). RN 2 prevê colapsar para ícones E ocultar inteiramente.
:: Evidência(s) ::
- qa_lote_1106_desktop/19814-menu-lateral.png
Evidência no link: (commit)
```
