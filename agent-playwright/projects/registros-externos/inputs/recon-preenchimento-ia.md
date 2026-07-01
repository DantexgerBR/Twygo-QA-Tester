# Recon — QA 1.15 Preenchimento com IA e crédito (PARCIAL — continuar)

> Recon ao vivo 2026-06-26 contra **staging-registros-edu** (org 37093).
> **Pré-requisito resolvido pelo usuário**: a funcionalidade de IA foi habilitada
> via menu "Controle de IA" — antes o card "Preencher com IA" NÃO renderizava no
> form (gated). Agora renderiza.

## Confirmado

- **Card de IA no form** `/o/{org}/records/new` (e edição de Externo): presente.
  - Botão **"Preencher com IA"** → `getByTestId('records-form-ai-autofill-button')`.
    Nasce **disabled** (sem upload). Habilita após upload da evidência.
  - Disclaimer "A IA pode cometer erros, verifique as informações" presente no card.
- **Upload de evidência**: campo rotulado **"Evidência de aprendizagem"**
  (⚠️ AT diz "Comprovação de aprendizagem" — divergência). `input[type=file]` presente.
- **Habilitar/desabilitar IA** (TC5): aba **Configurações** de `/o/{org}/ai_consumption_analysis?tab=settings`
  → switch `getByTestId('ai-consumption-analysis-settings-ai-access-switch-37093')`
  (`data-checked=""` = ON). "Acesso de IA ativo" / "Herdar configurações do principal".
  Para TC5 (IA desabilitada): desligar esse switch (com revert no afterAll).
- **Controle de IA** tem tabs: Extrato, Configurações, Política de créditos de IA, Glossário.
  Sistema de crédito presente (pacote de créditos, saldo descontado).

## EM ABERTO (continuar recon antes de gerar)

1. **Sparkle de crédito na TopBar (TC6)**: NÃO localizado nesta sessão — não há
   ícone sparkle/auto_awesome no header nem testid `credit`/`spark`. Investigar:
   pode aparecer só após reload com IA ligada, ou em página específica, ou ser
   afordância de stage não presente nesta org. **Bloqueia TC6 e o controle
   com/sem crédito de TC3/TC4.** Alternativa se não houver sparkle: controlar
   crédito via Controle de IA (Política/Configurações) ou Super Admin.
2. **Fluxo de preenchimento (TC2)**: upload → botão habilita → clicar → preenche
   "Tipo de experiência" + "Categorias" → toast verde "Campos preenchidos pela IA"
   ("Tipo de experiência e Categorias foram sugeridos... Revise antes de salvar.",
   ~3500ms). **Consome crédito real de IA** — cuidado ao rodar repetido.
3. **Endpoint de preenchimento IA** (TC8 erro, TC9 403): capturar via Network ao
   clicar "Preencher com IA" (provável `POST .../records/ai_autofill` ou similar).
4. **Modais sem crédito** (TC3 Admin / TC4 Aluno): "Limite de créditos atingido".
   - Admin: corpo longo + botão "Contato" (roxo) + X. (top-center)
   - Aluno: corpo curto "Todos os créditos disponíveis foram utilizados." + botão "Fechar".
   Capturar estrutura real quando houver como zerar crédito.
5. **Toast IA desabilitada** (TC5): "Essa funcionalidade não foi habilitada para
   esse ambiente. Ative ou consulte o responsável... menu de Créditos de IA."
6. **Perfis Aluno vs Admin**: TC1/TC4/TC7 exigem visão Aluno. Ver skill
   `trocar-perfil-twygo` (troca via popover de perfil, sem credencial nova).

## Arquivo de evidência

TC2/3/4/5/8 fazem upload de "certificado_ia.pdf". Precisa existir um fixture de
PDF no repo (ex. `projects/registros-externos/data/fixtures/certificado_ia.pdf`)
ou gerar um PDF mínimo em runtime. Definir ao gerar.

---

## Recon ao vivo 2026-06-29 (continuação — resolve os EM ABERTO)

> Via script Playwright autenticado (storageState edu, org 37093). Endpoint da
> IA capturado por **interceptação + abort** (zero crédito consumido).

### Confirmado nesta sessão

- **Card de IA** no form `/o/{org}/records/new`: título **"Facilite seu trabalho
  com nossa IA"**, corpo "Com base nas informações fornecidas... Quer uma ajuda?",
  disclaimer **"A IA pode cometer erros, verifique as informações"**, botão
  `getByTestId('records-form-ai-autofill-button')` (texto "Preencher com IA",
  nasce **disabled**).
- **Upload de evidência** = dropzone "Arraste o arquivo ou clique para selecionar"
  (seção "Evidência de aprendizagem" → "Arquivo", aceita .pdf/.docx/.xlsx/.csv/
  .jpg/.jpeg/.png, máx 10MB, máx 5). `filechooser` NÃO dispara no click do
  dropzone — usar `page.locator('input[type=file]').last().setInputFiles(pdf)`
  (há 2 inputs: o 1º é o chat `message_attachments`; o **último** é a evidência).
  Após upload o botão "Preencher com IA" **habilita** (`disabled:false`).
- **Endpoints (contrato real)**:
  - Upload: `POST /api/v1/o/{org}/records/store_archive?url=...&filename=...&filesize=...&filetype=...` → devolve `archive_id`.
  - Preenchimento: **`POST /api/v1/o/{org}/records/ai_fill`** body `{"archive_ids":[<id>],"website":<url|null>}`. ← endpoint do TC9 (403) e TC8 (erro).
- **Toggle de IA** (TC5): switch `getByTestId('ai-consumption-analysis-settings-ai-access-switch-37093')` em `/o/{org}/ai_consumption_analysis?tab=settings` (`data-checked` = ON). Desligar p/ TC5 com **revert no afterAll**.
- **Fixture PDF** criado: `projects/registros-externos/data/fixtures/certificado_ia.pdf` (PDF 1.4 mínimo válido, 621 bytes).

### Veredito por TC (testável agora vs fixme)

| TC | Status | Nota |
|---|---|---|
| TC1 — card presente/ausente por modo | ⚠️ parcial | card em add (Aluno+Admin) e edit Externo: testável; ausência em Visualizar/Avaliar exige registro Externo + Pendente seedados |
| TC2 — sucesso (preenche + toast verde) | ✅ testável | **consome 1 crédito real** — rodar 1×, sem retry |
| TC3 — sem crédito Admin (modal "Contato") | ❌ fixme | **sem afordância de zerar crédito** no admin da org (Política = só tabela informativa `ai-credits-policy-*`). Requer Super Admin/backend. Destinatário: QA Lead/infra |
| TC4 — sem crédito Aluno (modal "Fechar") | ❌ fixme | idem TC3 |
| TC5 — IA desabilitada (toast vermelho) | ✅ testável | togglar switch OFF (revert). Validar se botão fica clicável p/ disparar toast ou se o 403 do `ai_fill` é a via |
| TC6 — sparkle de crédito na TopBar | ❌ fixme | **sparkle NÃO existe** neste build (TopBar só tem box/chat/bell/avatar). Destinatário: produto — confirmar se a afordância existe nesta versão |
| TC7 — uso manual não consome | ✅ testável | salvar form preenchido manualmente; assert ausência de `ai_fill` + toast sucesso; **cleanup do registro criado** |
| TC8 — timeout/erro da IA | ✅ testável | `page.route('**/records/ai_fill', r => r.fulfill({status:500}))` → toast "Não foi possível preencher com IA. Tente novamente." (sem custo) |
| TC9 — back 403 sem requisito | ✅ testável | `page.request.post('.../records/ai_fill', {archive_ids,website})` com IA OFF → 403; com crédito esgotado → bloqueado por TC3/TC4 (fixme) |
