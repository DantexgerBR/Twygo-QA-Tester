---
name: twygo-app-facts
description: "Fatos descobertos sobre a plataforma Twygo na org de stage que não são óbvios pela leitura do repo — rotas, particularidades do form, particularidades do player."
metadata: 
  node_type: memory
  type: project
  originSessionId: 016ef769-3cce-4a90-a74c-e8e60b0da3a4
---

Fatos sobre a plataforma Twygo (org de stage `https://twygo1772627238.stage.twygoead.com/`) descobertos via discovery em 2026-05-20.

**Why:** evitar refazer 1h de discovery por caso de teste novo. Esses pontos não estão documentados no repo e só apareceram na execução.

**How to apply:** quando for escrever um caso novo no `~/playwright-tests`, partir desses fatos. Confirmar via discovery só o que mudou.

### Rotas

- **Login:** `/users/login` — campos `#user_email`, `#user_password`, botão `#user_submit`. Pós-login redireciona para `/play?menu_id=play` (não `/dashboard_students`). **Seletor correto em Playwright:** `getByRole('textbox', { name: 'Login' })` — `getByLabel(/e-?mail/i)` bate em checkbox `send_copy` de outra tela.
- **Admin — edição de atividade:** `/e/{event_id}/contents/{content_id}/edit`. Renderiza em **Rails clássico** (não Chakra UI como eu pensei inicialmente). Checkboxes HTML simples + radios HTML + react-select para campos multi-valor (posição). Botão salvar: `#button_send_form`.
- **Aluno — Aprender de um curso:** `/e/{event_id}/learn?learn_origin=my-contents`. **NÃO existe** `/aprender/{id}` como rota oficial — ela aceita mas vem vazia. O Aprender real é `/e/{id}/learn`.
- **Listagem de conteúdos do aluno (filtrada por curso):** `/my-contents?event_id={event_id}`.
- **Admin — Compartilhar curso entre orgs:** aba `Compartilhar` em `/e/{event_id}/edit?tab=share` (Chakra Tabs, `button[data-test-id="tab-share"]`). Botão "Adicionar" (`#shared-events-add-button`) navega para `/e/{event_id}/shared_events/new`. Form tem 2 radios `consumer_type` (0=Ambiente interno / 1=Ambiente externo), react-select `Ambientes` (lista orgs internas acessíveis ao admin, filtra as que já receberam), 2 radios `shared_type` (0=Cópia livre / 1=Controlado/espelhado), `#save-shared-events-form-button`. Toast pós-Salvar: "Conteúdo compartilhado com sucesso" (aparece 3× empilhado — usar `.first`).
- **Tipos de mídia da atividade** — form expõe 9 radios `media_type`, mapping para 10 rótulos PT visíveis na bar de tipos (Vídeo/Vídeo Externo separados):
  - `text` (Texto), `page` (Página), `lesson` (Aula), `pdf` (**PDF Estampado** — tem feature paralela "Habilitar marca d'água NO ARQUIVO", server-side), `video` (**Vídeo Interno** — única com `#water-mark-video-enabled` no form), `external` (**Vídeo Externo** — sub-tipos `content[external_type]`: youtube, vimeo, eventials, external_video — nenhum suporta marca por design), `other` (Arquivos), `questions` (Questionário), `scorm` (Scorm), `games` (Games).
  - Só `media_type=video` mostra a seção `#water-mark-video-enabled`. Todos os outros tipos não têm essa opção (validado pelo T-1602).
  - Atividades de vídeo interno conhecidas: 9280032 (em 787696) e 9280224 (em 787697). Atividade `external_video` conhecida: 9187421 em 787697.
- **Admin — Lista de compartilhamentos da org:** `/o/{org_id}/shared_events` com 2 abas: `Concedidos` (que a org enviou) e `Recebidos` (que a org recebeu de outras). Cada linha tem badges de Situação (Pendente/Aceito/Recusado) e Tipo (Cópia livre/Controlado).
- **Admin — Aceitar share recebido:** na aba `Recebidos`, clicar no span material-symbols-outlined `edit` da linha → navega para `/o/{org_id}/shared_events/{share_id}/accept_shared_content`. Form mostra Conteúdo + Tipo + Concedido por + selects Situação/Visualização + botões Aceitar/Recusar. Toast pós-aceite: "Compartilhamento aceito com sucesso. Estamos copiando o conteúdo para o seu ambiente. Isso pode levar alguns minutos."
- **Admin — Token de ambiente externo para receber shares:** `/o/{org_id}/integrations` aba **Token** (ao lado de `Chave de API` e `Autenticação SSO via SAML`). Pode estar bloqueada por plano de assinatura ("Ops! Essa opção não está disponível no seu plano").
- **Modo Controlado (espelho):** destinatária recebe REFERÊNCIA, não cópia — atividade no destino tem o MESMO `data-id` da origem (em vez de novo id como ocorre em Cópia livre). `/e/{evento_destino}/contents/{atividade}/edit` retorna `{"status":"error","msg":"Você não tem permissão para realizar essa ação."}` — destinatária não pode editar o espelho.
- **Multi-org admin — switch de perfil:** após login a Twygo cai sempre em `/dashboard_students`. Para entrar no Admin, navegar para `/o/{org_id}/events?tab=events&profile=admin`. O botão de troca de perfil é `#btn-profile` no canto superior direito; ele abre um menu com `#admin-profile` (href `/o/{org_id}/events?tab=events&profile=admin`) e `#student-profile`.

### Particularidades do player no Aprender

- Usa **Plyr** (`plyr__poster`, `plyr__controls`, `plyr__captions`).
- O atributo `src` do `<video>` é um `blob:` (stream local).
- **Marca d'água é queimada server-side nos frames do vídeo** — não fica no DOM, não em iframe, não em shadow DOM, não em canvas, não em SVG. Verificação programática via seletor é impossível. A única forma de verificar é por screenshots em momentos diferentes da reprodução (validação visual ou OCR).

### Conta dante.tavares@twygo.com

- É **admin + aluno** na mesma conta. A UI mostra um seletor de perfil no canto superior direito (`Administrador` / `Aluno`).
- Está matriculada no curso de `event_id=787696` ("Construindo times de alta performance"). Esse é o curso usado nos casos T-1594 e T-1595.
- ORG_ID = 36675.

### Padrão da feature "marca d'água no vídeo"

- Checkbox "Habilitar marca d'água no vídeo" (HTML simples, label associado por proximidade — `get_by_label` resolve).
- Tipo de exibição: radios **Fixa** / **Em movimento**.
- Posição: react-select multi-valor (classe `select-field`). Para selecionar uma posição diferente: remover a atual via `.select-field__multi-value__remove`, clicar no controle e digitar texto da nova posição + Enter.
- Informações a exibir: react-select multi-valor com tags (CPF, etc).
- **Cor da fonte:** input `#water-mark-video-font-color` é `<input type=text>` Chakra com `placeholder="#000000FF"` e `maxlength=9` — aceita hex `#RRGGBB` (sem alpha = opaco) ou `#RRGGBBAA` (alpha em hex, `00`=transparente, `FF`=opaco). O popover da swatch (botão `[data-test-id="water-mark-video-font-color-color-swatch"]`) abre color picker Chakra com 3 sliders `role=slider`: `aria-label="Color"` (saturação/brilho), `aria-label="Hue"` (0-360) e `aria-label="Alpha"` (0-100%). Mais robusto: `inp.fill("#FFFFFF00") + inp.press("Tab")` ao invés de arrastar slider.

Ver também: [[playwright-twygo-repo]], [[twygo-test-skill]]
