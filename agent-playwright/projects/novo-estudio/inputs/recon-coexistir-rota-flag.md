# Recon — QA 1.15 "Coexistir com tela antiga via rota nova e feature flag" (#R15)

**Data**: 2026-06-09 · **Org**: 37061 · **Curso**: 807533 · **Card**: 19719 ·
**Modo**: read-only (NÃO togglou flag nem contrato — blast radius na org principal).

## Achado central: a premissa de gating por Flipper NÃO se confirma

| Verificação | Resultado |
|---|---|
| Flipper `/admin/manage/features/creation_studio` | **`Disabled`** — "No actors enabled, 0% of actors, 0% of time" |
| Estúdio na rota nova com a flag OFF | **Funciona** (`?tab=studio` → shell do Estúdio) |
| Rota antiga `/o/{org}/events/:id/edit/activities` | **404** |
| `/o/{org}/contents/{id}/edit` | Página única de edição com abas; aba "Atividades" (`tab-studio`) = Estúdio |

**Conclusão**: o gate real do Estúdio **não é** a flag Flipper `creation_studio`
(ela está OFF e o Estúdio funciona). Provável gate por **contrato**
(`sys_subscription_functionalities` — a suíte 1.18 cita essa tabela; o Super
Admin da org tem abas "Contratos"/"Features" não exploradas) ou feature
**promovida/sem gate**. **Não existe "coexistência por URL distinta"**: é uma
página única, aba Atividades = Estúdio.

> ❓ **PERGUNTA AO DEV (João):** qual é o gate real do Estúdio hoje? (flag
> promovida? contrato? outra flag?). Sem isso, os TCs de roteamento-por-flag e
> de estado-OFF não são testáveis como a AT especifica.

## Skill desatualizada a corrigir

`testar-estudio-criacao-twygo` afirma: *"Feature flag creation_studio (Flipper)
… na 37061 já está ON. Se OFF, o produto cai na tela antiga `/edit/activities`."*
O recon **falsificou as 3 afirmações** (flag OFF, Estúdio funciona, /edit/
activities = 404). Também o comentário do spec `criacao-via-cards…` ("creation_
studio ON validada em recon") está contradito. Propor atualização (regra
CLAUDE.md: divergência reconhecida ⇒ propor update de skill).

## Veredito por TC (suíte de 11)

| TC | Veredito | Nota |
|---|---|---|
| TC1 Flag habilitada → nova rota | ✅ (affordance) | aba "Atividades" → Estúdio carrega; REVISAR premissa de flag + URL `?tab=studio` |
| TC2 Flag desabilitada → rota antiga | fixme | premissa divergente (flag já OFF e Estúdio funciona) |
| TC3 Habilitar flag via Flipper | fixme | toggle da flag não altera o gating |
| TC4 Rota nova acessível | ✅ | `?tab=studio` carrega o Estúdio |
| TC5 Rota antiga acessível | fixme | `/edit/activities` = 404 (rota inexistente) |
| TC6 Aluno multi-origem | fixme | publicar via Estúdio ausente (1.12) + sem rota antiga |
| TC7 [Regressão] tela antiga sem features novas | fixme | sem caminho para a tela antiga |
| TC8 Rollback sem perda de dados | fixme | desligar gate (blast radius) + publicar ausente |
| TC9 EventContent é o mesmo | fixme | parte db (agent-db) + sem rota antiga |
| TC10 [Manual] Métrica CS | fixme | dashboard CS externo |
| TC11 Transição de flag em sessão | fixme | desligar gate em runtime (blast radius) |

**Execução**: 2 passed (TC1, TC4), 9 skipped (fixme). Evidências:
`outputs/novo-estudio/recon-1.15-flipper.png`, `-contrato.png`, `-events-edit.png`.

## Laudo (a alinhar com João — solicitante)

Rota nova do Estúdio **acessível e funcional** (TC1/TC4 ✅). PORÉM a mecânica
central da suíte — gating/coexistência via flag Flipper `creation_studio` — **não
se confirma**: a flag está OFF e o Estúdio funciona; não há rota antiga distinta
(/edit/activities = 404). **Headline para o dev: qual é o gate real do Estúdio?**
Não cravado como bug (projeto em andamento) — divergência de premissa a alinhar.
