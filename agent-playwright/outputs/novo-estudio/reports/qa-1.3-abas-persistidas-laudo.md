# Laudo QA 1.3 — Reordenar e persistir abas por usuário, renomear "Gerenciar" e "Editar"

- **Atividade Artia**: 19707 — [Novo estúdio de criação - 3.Desenvolvimento] QA 1.3 (RN 3)
- **Solicitante**: João Miguel Gorski
- **Ambiente**: 🧪 Stage — novoestudio.stage.twygoead.com (org 37061), flag `creation_studio` ON
- **Curso seed**: 807533 "Construindo times de alta performance" (nome restaurado ao final — cleanup ok)
- **Execuções**: recon abrangente (2 passadas) + 3 runs de spec em 05/06/2026, todos consistentes
- **Multi-usuário**: testado com 2 usuários (agents.qa + dante.tavares) — regra multi-usuário aplicada
- **Suíte**: `projects/novo-estudio/tests/features/reordenar-e-persistir-abas-por-usuario/` + POM `CourseEditTabsPage.ts`

## Resultado: 3 ✅ · 9 ❌ (REVERIFICADO 05/06; TC1 ✅ pelo critério de função)

> Reverificação 05/06: hover na aba "Modelo" → **0 ícones** de drag, attr `draggable` nulo;
> drag manual Modelo→Banner → ordem **inalterada** (sem request de persistência); clicar
> "Banner", sair e voltar → abre em **tab-identification** (last-tab não restaurada).
>
> **Atualização 08/06 — TC12 EXECUTADO em banco (read-only):** com acesso direto ao MySQL
> `twygo_db_rc` (org 37061 e curso 807533 confirmados no mesmo banco), a tabela
> `user_course_preferences` **existe** (campos `tab_order` JSON + `last_tab` varchar(255),
> conforme a AT) mas está **100% VAZIA — 0 linhas para qualquer usuário**. Isso corrobora
> pela fonte de verdade que o front não persiste nada (nenhuma escrita chega ao banco).
> Achados de schema (DDL): **não há coluna `event_id`/`course_id`** e há **`UNIQUE(user_id)`**
> → no máximo 1 linha por usuário. Logo `last_tab` (1 varchar/linha) é estruturalmente
> **por-usuário-global** (não dá pra ser por curso — diverge do TC6); já `tab_order` (JSON)
> **pode** codificar a ordem por curso dentro do JSON — **indecidível com a tabela vazia**,
> confirmar design com produto. De todo modo, o `WHERE user_id = X AND event_id = Y` do TC12
> é impossível (não existe `event_id`).

| TC | Caso | Veredito |
|---|---|---|
| TC1 | Renomeação "Gerenciar curso" → "Editar curso" | ✅ ("Gerenciar curso" não existe mais em lugar nenhum; ação "Editar" é o padrão atual do produto e o breadcrumb diz "Editar curso") |
| TC2 | Reordenar abas via drag and drop | ❌ (funcionalidade ausente) |
| TC3 | Ícone de drag no hover | ❌ (ausente) |
| TC4 | Persistência da ordem após reload | ❌ (bloqueado por TC2) |
| TC5 | Persistência por usuário (A x B) | ❌ (bloqueado por TC2; A/B veem o mesmo default) |
| TC6 | Restauração da última aba aberta | ❌ |
| TC7 | Aba "Identificação" travada | ❌ (sem objeto: nada se move) |
| TC8 | Arrastar "Identificação" sem efeito | ❌ (bloqueado por TC2) |
| TC9 | Salvamento independente por aba | ✅ |
| TC10 | Confirmação ao trocar de aba com alterações | ✅ (política = descarte) |
| TC11 | Persistência em banco (não storage) | ❌ (bloqueado por TC2/TC6) |
| TC12 | [Manual] registros em `user_course_preferences` | ❌ (validado em banco read-only 08/06: tabela existe mas está VAZIA — 0 linhas; sem coluna `event_id` + `UNIQUE(user_id)`, então o filtro `event_id` do TC12 é impossível) |

## ❌ Núcleo da RN 3 ausente no ambiente

**Reordenação de abas via drag & drop NÃO está implementada** na org 37061:
- Abas são Chakra tabs **sem** atributos de drag (`draggable`/`aria-roledescription` nulos, sem lib de sortable);
- Hover sobre "Modelo" **não exibe ícone de drag** (TC3);
- Drag manual (mouse down → movimento de ativação → alvo → up, padrão anti-no-op de
  dnd) **não altera a ordem** e **não dispara nenhuma request** de persistência (Network
  monitorado — TC2);
- **Última aba não é restaurada** (TC6): usar "Banner", sair e voltar → abre em
  "Identificação". Reproduzido em recon + 3 runs.
- Consequência: TC4/TC5/TC7/TC8/TC11 ficam sem objeto de teste (bloqueados).
- Cross-check multi-usuário (TC5 via recon): usuários A e B veem a mesma ordem default —
  consistente com a funcionalidade inexistente.

**Hipóteses**: build com a RN 3 ainda não deployado na org 37061 / flag adicional /
entrega parcial. **Confirmar com o solicitante antes de tratar como bug de produto.**

**Leitura cruzada (QA 1.2/1.4/1.6, mesmo ambiente, mesmo dia)**: as RNs irmãs ESTÃO
presentes neste build — Estúdio 3 colunas com test-ids ricos (RN 2), campos de IA
persistindo (RN 4), displayLabel/icon picker persistindo (RN 6). Ou seja, a org 37061
NÃO está com build defasado do projeto: **a ausência é específica da RN 3**
(reordenação/persistência/last-tab). Isso direciona a confirmação: é mais provável
escopo não entregue (rotear pra dev) do que problema de deploy/infra.

## 🗄️ TC12 — validação em banco (read-only, 08/06/2026)

Acesso direto ao MySQL `twygo_db_rc` (twygo-rc, 8.0.45) via script Python read-only
(`SET SESSION TRANSACTION READ ONLY`, apenas `SELECT`). Banco confirmado como o correto:
`organizations.id=37061` = "novoestudio" e `events.id=807533` = "Construindo times de alta
performance" presentes.

**Schema real de `user_course_preferences`:**

| coluna | tipo | nulo |
|---|---|---|
| `id` | bigint | NO |
| `user_id` | int | NO |
| `tab_order` | json | YES |
| `last_tab` | varchar(255) | YES |
| `created_at` | datetime(6) | NO |
| `updated_at` | datetime(6) | NO |

**Resultado:** `SELECT COUNT(*) FROM user_course_preferences` = **0**. Tabela vazia para
qualquer usuário/curso → nada é persistido → confirma, pela fonte de verdade, que o front
não dispara escrita (consistente com o Network monitorado nos TC2/TC6).

**Divergência de design vs AT (rotear pra AT/produto):** o DDL mostra `UNIQUE(user_id)` e
**nenhuma coluna `event_id`/`course_id`** → no máximo 1 linha por usuário.
- **Fato:** o `WHERE user_id = X AND event_id = Y` do TC12 é **impossível** no schema atual — `event_id` não existe.
- **Fato:** `last_tab` é 1 `varchar` por usuário → estruturalmente **por-usuário-global** (não consegue lembrar "última aba" por curso) — diverge do TC6.
- **Indecidível com a tabela vazia:** `tab_order` é JSON e **pode** estar codificando a ordem por curso *dentro* do JSON (ex.: `{"807533": [...]}`) — não dá pra ver a forma sem dados.

**Critério (definido pelo solicitante em 08/06): vale a RN documentada** — persistência
**por usuário × curso** em banco. Logo o back-end **não cumpre a RN**: (1) não persiste nada
(0 linhas) e (2) o schema atual não comporta `last_tab` por curso (1 varchar por usuário).
Vira **retrabalho**, não pergunta em aberto. Ressalva técnica honesta: `tab_order` é JSON e
poderia, em tese, codificar a ordem por curso — mas como nada é gravado, é irrelevante para
o veredito (a RN não está atendida de qualquer forma). Ajuste paralelo na AT: o TC12 deve
consultar a estrutura real (não a coluna `event_id`, que não existe).

Evidência crua: `Twygo-QA-Tester/agent-db/evidencias/tc12-user_course_preferences.txt`
· GitHub: https://github.com/DantexgerBR/Twygo-QA-Tester/blob/project/novo-estudio/agent-db/evidencias/tc12-user_course_preferences.txt

## ✅ TC1 — renomeação validada pelo critério de função

- **"Gerenciar curso" não existe mais em lugar nenhum** (verificado nas duas orgs) — o
  objetivo da renomeação está cumprido.
- A ação no kebab é "Editar" (forma curta padrão do produto, idêntica ao fluxo atual) e o
  breadcrumb da edição exibe "Conteúdos > Editar curso".
- O literal "Editar curso" no item do kebab é detalhe da AT, não falha de função.

## ✅ O que funciona

- **TC9** — aba Identificação tem botão "Salvar" próprio; salvar persiste o "Nome" (verificado
  por reload, não só toast). *Gotcha de teste*: o curso seed tem "Tipo de experiência"
  (obrigatório, react-select `#learningExperience`) vazio — sem preenchê-lo a validação
  client-side barra o submit **silenciosamente** (zero request, zero toast).
- **TC10** — trocar de aba com alterações não salvas **descarta** as alterações (política de
  descarte; não há modal de confirmação — AT aceita "modal OU descarte conforme política").

## Evidências (links públicos no GitHub)

- Hover na aba "Modelo" sem ícone de drag: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-02-hover-modelo.png
- Ordem inalterada após o drag: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-04-apos-drag.png
- Retorno abrindo em Identificação (last-tab não restaurada): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-05-last-tab.png
- Usuário B com a mesma ordem default: https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-06-user-b.png
- Validação silenciosa do Salvar ("Tipo de experiência é obrigatório"): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-08-apos-salvar.png
- Baseline 36675 (kebab "Editar" + breadcrumb "Editar curso"): https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_baseline_trilha_pacote/10-kebab-36675.png · https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_baseline_trilha_pacote/11-destino-editar-36675.png
- Runs Playwright (traces/vídeos): local em `agent-playwright/outputs/novo-estudio/test-artifacts/`

## Comentário KQA (para o Artia 19707)

```
⇝ QA ⇜
:: Teste ::
✅ Passou
:: Ambiente ::
🧪 Stage
:: Validação ::
Execução concluída sem bloqueios — suíte "Reordenar e persistir abas por usuário, renomear
Gerenciar/Editar" (12 TCs) na org 37061, curso 807533, com 2 usuários (regra multi-usuário):
3 ✅ (renomeação — "Gerenciar curso" não existe mais; salvamento independente por aba;
política de descarte ao trocar de aba) e 9 ❌, tratados no retrabalho abaixo.
:: Obs ::
Retrabalhos criados:
1) P1 [Novo estúdio de criação] Abas da edição de curso não reordenam por arraste e não
lembram a última aba aberta: não há drag & drop de abas (sem ícone no hover, sem atributo de
drag, arrastar não reordena e não dispara request de persistência) e a última aba aberta NÃO
é restaurada (volta sempre em Identificação). As demais entregas do estúdio estão presentes
no mesmo build — a ausência é específica desta (rotear pra dev, não pra deploy/infra).
Link: 
2) P1 [Novo estúdio de criação] Ordem das abas e última aba não são salvas no banco (modelo
de dados não suporta escopo por curso): validado read-only no MySQL twygo_db_rc; a tabela
`user_course_preferences` EXISTE (tab_order JSON + last_tab varchar) mas está VAZIA (0 linhas)
→ o front não persiste nada (fonte de verdade, bate com o Network). O back-end também precisa
suportar persistência por usuário × curso, mas o schema atual não tem coluna `event_id` (há
UNIQUE(user_id)) e `last_tab` é 1 valor por usuário. Ajuste paralelo no caso de teste de banco:
a query precisa apontar pra estrutura real (hoje filtra por `event_id`, que não existe).
Gotcha pro dev: no curso seed, "Tipo de experiência" (obrigatório) vazio faz o Salvar falhar
SILENCIOSAMENTE (sem toast de erro global) — vale UX de aviso.
:: Evidência(s) ::
- TC12 banco (schema + COUNT=0 + DDL):
https://github.com/DantexgerBR/Twygo-QA-Tester/blob/project/novo-estudio/agent-db/evidencias/tc12-user_course_preferences.txt
- Hover sem ícone de drag:
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-02-hover-modelo.png
- Ordem inalterada após drag:
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-04-apos-drag.png
- Last-tab não restaurada (volta em Identificação):
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-05-last-tab.png
- Usuário B com ordem default (multi-usuário):
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_recon/qa13-06-user-b.png
- Baseline 36675 (rótulo "Editar" idêntico):
https://github.com/DantexgerBR/twygo-playwright-tests/blob/main/evidencias/novo_estudio_baseline_trilha_pacote/10-kebab-36675.png
```
