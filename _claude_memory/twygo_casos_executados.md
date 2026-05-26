---
name: twygo-casos-executados
description: "Estado dos casos de teste Twygo já rodados pela automação — status, bugs encontrados e impactos colaterais na atividade compartilhada 9280032."
metadata: 
  node_type: memory
  type: project
  originSessionId: 016ef769-3cce-4a90-a74c-e8e60b0da3a4
---

Histórico de casos do TestLink já executados pelo repo `~/playwright-tests` na org de stage. Atualizar conforme novos casos forem rodando.

**Why:** vários casos compartilham a MESMA atividade `9280032` (evento `787696` — "Construindo times de alta performance"). Casos anteriores podem deixar a config em estado inesperado. Sempre confirmar o estado da config antes de rodar um caso novo.

**How to apply:** quando o usuário pedir pra rodar um caso novo, consultar esta tabela pra saber:
- Em que estado a atividade ficou após o último caso
- Quais bugs já têm retrabalho aberto (não reportar de novo)
- Onde estão os scripts/docs persistidos

## Casos executados

### T-1594 — Desmarcar marca d'água no vídeo (Desktop)
- **Status:** ✅ Passou (parcial — o caso original) → mas o ato de "salvar com checkbox desmarcado" **deixou a atividade 9280032 sem marca d'água**.
- **Impacto:** casos seguintes precisaram re-habilitar marca d'água antes de rodar.
- **Doc:** `~/playwright-tests/docs/casos/marca_dagua_video_desmarcar.md` (formato antigo, anterior à convenção T-XXXX.md)
- **Teste pytest:** `tests/marca_dagua/test_desmarcar_marca_dagua_video.py`

### T-1595 — Marca d'água "Em movimento" no Aprender (Desktop)
- **Status:** ❌ FALHOU — retrabalho **já aberto pelo time**. Com tipo "Em movimento", a estampa permanece estática (mesmas 6 posições em grade 3×2). Vídeo de teste tem 11s — pode ser que ciclo de animação seja >11s e nosso intervalo não detecte, mas o time confirmou que é bug.
- **Doc:** `~/playwright-tests/docs/casos/T-1595.md`
- **Teste pytest:** `tests/marca_dagua/test_t1595_marca_em_movimento.py`
- **Scripts:** `scripts/setup_t1595.py` (config) + `scripts/run_t1595.py` (ad-hoc)
- **Evidências:** https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/T-1595

### T-1600 — Retrocompatibilidade: atividade de vídeo legada (proxy via desmarcar marca)
- **Status:** ✅ Passou — 4 passos (aluno acessa curso, abre player, reproduz sem marca, admin vê checkbox desmarcado).
- **Limitação:** stage atual não tem atividade legada real. `scripts/setup_t1600.py` desmarca marca em 9280032 antes do teste — comportamento de UX equivalente à legada (checkbox off, player sem overlay).
- **Achado tipográfico**: 9187421 ("Conteúdo 1" em 787697) NÃO serve como proxy de legada porque é **vídeo externo** (media_type=external, content[external_type]=external_video, URL https://vz-81383159-e0d.b-cdn.net/.../playlist.m3u8). Vídeo externo NÃO suporta marca d'água por design — o checkbox nem aparece no form de edição. Vídeos internos (upload .mp4) são `media_type=video` e sempre mostram a seção de marca d'água.
- **Doc:** `~/playwright-tests/docs/casos/T-1600.md`
- **Teste pytest:** `tests/marca_dagua/test_t1600_atividade_legada.py` (2 testes: aluno + admin)
- **Setup obrigatório:** `scripts/setup_t1600.py` desmarca → roda T-1600 → próximo caso de marca habilitada rerodar seu setup_t<N>.py
- **Evidências:** https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/T-1600

### T-1599 — Compartilhamento controlado (espelho) entre orgs (e2e, com ressalva no passo 4)
- **Status:** ⚠️ PASSOU COM RESSALVA — passos 1, 2, 3 ✅ (origem `twygo1772627238` envia em modo Controlado via Ambiente externo + token → destinatária `danteshare` (org 37018) recebe, aceita, curso espelhado aparece como evento 806235 e atividade espelhada referencia o MESMO data-id da origem 9280032). Passo 4 NÃO validável pelo form de edição: em modo Controlado, `/e/{evento_destino}/contents/{atividade}/edit` retorna `{"status":"error","msg":"Você não tem permissão para realizar essa ação."}` — propagação da config é por design (destinatária referencia, não duplica).
- **UI mapeada (origem):** `/e/{evento}/edit?tab=share` → `#shared-events-add-button` → `/e/{evento}/shared_events/new`. Campos: `input[name=consumer_type]` (0=Interno/1=Externo), `input[role=combobox]` (Ambientes — react-select interno), `#external_environment_token` (token externo), `#shared-events-terms-checkbox` (termos), `input[name=shared_type]` (0=Cópia livre/1=Controlado), `#save-shared-events-form-button`.
- **UI mapeada (destinatária):** `/o/{org}/integrations` aba **Token** gera o token externo (pode ficar bloqueado por plano — se sim, pedir liberação). `/o/{org}/shared_events` tab **Recebidos** lista shares com badges Pendente/Aceito; click no span material-symbols `edit` da linha → `/o/{org}/shared_events/{share_id}/accept_shared_content` → botão Aceitar/Recusar.
- **Particularidades:** (a) origem NÃO expõe deletar share por linha — backend bloqueia duplicidade com alert "Conteúdo já compartilhado com esse ambiente"; (b) dropdown Ambiente interno EXCLUI orgs que já receberam share desse curso; (c) destinatária loga em `/dashboard_students` e precisa de switch para Admin via `/o/{ORG}/events?tab=events&profile=admin`; (d) atividade espelhada na destinatária usa o MESMO data-id da origem; (e) toast pós-Salvar empilha 3× — usar `.first` no locator.
- **Doc:** `~/playwright-tests/docs/casos/T-1599.md`
- **Teste pytest:** `tests/marca_dagua/test_t1599_compartilhamento_preserva_marca.py` (test_compartilhamento_controlado_propaga_para_destinataria)
- **Page Objects:** `pages/admin/compartilhar_curso_page.py` + `pages/admin/shared_events_recebidos_page.py`
- **Fixture:** `admin_destinataria_logado` em `conftest.py` (depende de `BASE_URL_DESTINATARIA`, `ADMIN_DESTINATARIA_EMAIL`, `ADMIN_DESTINATARIA_PASSWORD`, `ORG_DESTINATARIA_ID`, `TOKEN_DESTINATARIA` no .env)
- **Evidências:** https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/T-1599

### T-1602 — Marca d'água oculta para tipos não-vídeo no form de edição (admin)
- **Status:** ✅ Passou (9 testes: 8 tipos do caso + 1 sanity check). Para `media_type` em `text/page/lesson/pdf/external/questions/scorm/games`, o checkbox `#water-mark-video-enabled` NÃO aparece. Para `media_type=video` aparece (sanity).
- **Estratégia sem-side-effects**: abre `/e/787696/contents/9280032/edit` e itera o radio `media_type` clicando cada valor. React/Chakra re-renderiza o form. Não salva — estado da 9280032 fica intacto.
- **Achado importante**: tipo `pdf` (PDF Estampado) tem feature paralela "Habilitar marca d'água NO ARQUIVO" (checkbox distinto, com config própria). Teste valida ausência específica do checkbox de VÍDEO. Não invalida a feature de marca-arquivo.
- **Mapping PT → media_type**: Texto=text, Página=page, Aula=lesson, PDF Estampado=pdf, Vídeo=video, Vídeo Externo=external, Arquivos=other, Questionário=questions, Scorm=scorm, Games=games. 9 valores no radio, 10 labels visíveis (Vídeo/Vídeo Externo separados).
- **Doc:** `~/playwright-tests/docs/casos/T-1602.md`
- **Teste pytest:** `tests/marca_dagua/test_t1602_marca_dagua_oculta_em_outros_tipos.py` (parametrizado)
- **Evidências:** https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/T-1602
- **Limitação stage**: rodar os 9 testes em sequência (~3 min, login por teste) ocasionalmente dá timeout no fixture `admin_logado` (networkidle no /dashboard_students). Re-rodar individualmente sempre passa.

### T-1601 — Cor da fonte com 0% de transparência (totalmente transparente) no Aprender
- **Status:** ✅ Passou (3 passos). Com `fontColor=#FFFFFF00` (RGB+alpha hex, alpha=00) a marca não é renderizada perceptivelmente (`alpha_max=0` em sonda DOM + screenshot do player limpo).
- **Descoberta de UI**: input `#water-mark-video-font-color` (Chakra, type=text, placeholder `#000000FF`, maxlength=9) aceita `#RRGGBBAA` direto. Popover da swatch tem slider Chakra `aria-label="Alpha"` 0-100%, mas escrever no input texto + Tab é mais robusto. Caso interpreta "0% de transparência" como "totalmente transparente" (alpha=00).
- **Doc:** `~/playwright-tests/docs/casos/T-1601.md`
- **Teste pytest:** `tests/marca_dagua/test_t1601_cor_transparente.py`
- **Setup:** `scripts/setup_t1601.py` (habilita marca + grava `#FFFFFF00`)
- **Evidências:** https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/T-1601

### T-1596 — Marca d'água em viewport Mobile
- **Status:** ❌ FALHOU — **bug confirmado** pelo investigation. Em viewport mobile (360×740), a marca d'água NÃO é renderizada sobre o vídeo. Container do overlay (`<div z-index=99999>` filho do `.plyr`) permanece com `childCount=0` no mobile, enquanto em desktop tem 6 children pintando "CPF :" + "E-MAIL: ...".
- **Causa provável:** módulo de marca d'água verifica `plyr--is-touch` ou breakpoint e decide não renderizar. Frame nativo do `<video>` (canvas drawImage) NÃO contém marca em nenhum dos contextos — confirma que é overlay HTML, não server-side.
- **Doc:** `~/playwright-tests/docs/casos/T-1596.md`
- **Teste pytest:** `tests/marca_dagua/test_t1596_marca_mobile.py`
- **Scripts:** `scripts/setup_t1596.py` (config) + `scripts/run_t1596.py` (ad-hoc)
- **Evidências:** https://github.com/DantexgerBR/twygo-playwright-tests/tree/main/evidencias/T-1596

## Estado atual da atividade 9280032

Após T-1601 (que rodou por último em 2026-05-21):
- Marca d'água: **HABILITADA** + cor `#FFFFFF00` (totalmente transparente — invisível).
- Para próximos casos que exigem cor opaca/visível, ampliar setup do caso pra resetar `fontColor` (atualmente nenhum setup_t<N>.py reseta cor — só os campos que cada caso usa).
- Para casos que querem enabled=False (legada), rodar `setup_t1600.py`.

Se o próximo caso exigir outro estado, criar `scripts/setup_t<numero>.py` ANTES de rodar pra garantir as pré-condições.

## Convenção de naming

- `docs/casos/T-XXXX.md` — formato T-XXXX como nome do arquivo (não slug do título)
- `tests/marca_dagua/test_t<numero>_<slug>.py` — slug curto e descritivo
- `scripts/setup_t<numero>.py` — sempre presente; configura a atividade ANTES do run
- `scripts/run_t<numero>.py` — execução ad-hoc fora do pytest

Ver também: [[playwright-twygo-repo]], [[twygo-app-facts]], [[twygo-test-skill]]
