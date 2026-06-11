# QA 1.18 — Descobertas do E2E (10/06/2026, org Trial 37062)

Investigação ao vivo (com créditos de IA liberados) + cruzamento com o banco
read-only `twygo_db_rc`. Objetivo: validar a cascata de exclusão das tabelas
de histórico novas do Estúdio.

## 1. O histórico do copiloto do Estúdio vai pro DynamoDB, não pro MySQL da AT
- Disparei o copiloto do Estúdio na Trial 37062 (curso 807605) — respondeu
  normalmente (créditos OK).
- MySQL `conversations`: última linha é de **2025-12-30** (org 15092);
  `messages`: última de **2025-08-01**. Meu copiloto de hoje **não criou linha**
  nessas tabelas → elas são de uma feature **legada**, não do Estúdio.
- Logo, o histórico do copiloto persiste nas tabelas **DynamoDB** do próprio TC
  (`studio_checkpoints`, `messages`) — fora do alcance read-only MySQL.

## 2. "Sophia → Excluir informações → Tudo" é RESET DE DADOS, não exclusão de org
- Skill `testar-exclusao-dados-trial-twygo`: o fluxo dispara
  `DELETE /api/v1/o/{org}/delete_trial_data` e apaga **dados** (seeds + conteúdo
  admin + usuários admin) — **a organização continua existindo**.
- O TC 1.18 descreve "ao **excluir uma organização**" → provavelmente um caminho
  diferente (Super Admin / exclusão de tenant), com cascata possivelmente distinta.
- Bug conhecido registrado na skill: "Tudo" responde 2xx mas **não remove painéis
  admin** — deleção parcial.

## 3. Tabelas MySQL relevantes — estado real (org 37062)
| Tabela | Existe MySQL | org 37062 | Observação |
|---|---|---|---|
| events (cursos) | sim | 44 | cascata genérica; cairia num reset/exclusão |
| event_contents | sim | 378 | idem (única tabela do TC com dado real aqui) |
| activity_summaries | sim | 0 | gerada por IA (resumo) |
| ai_generation_tasks | sim (NÃO está na AT) | 0 | log de gerações; chat não escreve, geração talvez sim |
| studio_generation_partitions | sim | 0 (vazia global) | feature não escreve aqui (provável DynamoDB) |
| conversations / messages | sim | 0 | LEGADO (sem linha nova desde 2025) |
| user_course_preferences | sim | 0 | escopo só por user_id (sem org/event); populável sem IA |
| org_generation_preferences | **NÃO** | — | não está no MySQL → PostgreSQL |
| studio_checkpoints / messages (Dynamo) | — | — | DynamoDB (fora do alcance) |

## Conclusão
- **Não é executável até o fim neste ambiente** — o histórico novo do Estúdio
  está no DynamoDB (+ 1 tabela em PostgreSQL), inacessíveis read-only daqui.
- O caminho de exclusão disponível (Sophia "Tudo") é reset de dados, não
  exclusão de org — pode não ser o mecanismo do TC.
- **Para fechar de verdade o TC 1.18 é preciso**: (a) acesso a DynamoDB e
  PostgreSQL, (b) confirmar o mecanismo real de "exclusão de organização"
  (vs reset de dados), (c) corrigir a AT — o mapeamento tabela→datastore está
  errado (conversations/messages do copiloto são DynamoDB; org_generation_preferences
  é PostgreSQL; studio_generation_partitions não recebe escrita).
- Crédito de IA **não** era o gargalo (foi liberado e o copiloto funcionou).

## Atualização (mesma sessão, após liberar créditos + ativar o Estúdio)
- **Gate real do Estúdio = outra feature flag Flipper** (confirmado pelo QA/dono do
  ambiente), **não** a `creation_studio` (que está OFF). → responde direto a pergunta
  em aberto da **QA 1.15**.
- Ao **ativar o Estúdio na Trial 37062**, o ambiente **re-semeou/alterou**: o curso
  807605 ("Construindo times…") **deixou de existir** (`SELECT ... WHERE id=807605` → 0)
  e surgiram events novos (807644–807648: "Roxo", "Dashboard", "Aula expositiva"… —
  parecem modelos de página, não cursos).
- Em seguida a **listagem de Conteúdos ficou VAZIA** ("Não há dados para exibir") —
  a Trial ficou **sem nenhum curso**. Sem curso não há Estúdio para abrir → não há
  como disparar geração → `ai_generation_tasks` (org 37062) permaneceu **0**.
- `ai_generation_tasks` (tabela MySQL org-scoped, NÃO listada na AT) existe e seria
  populável por uma geração real; o **chat** do copiloto sozinho não escreve nela.
- **Bloqueio do E2E**: ambiente (Trial sem curso + ativação re-semeando) + a UI do
  Estúdio é frágil para dirigir headless. Para fechar: sessão **interativa** — criar
  um curso → disparar geração (popular ai_generation_tasks) → excluir → reconsultar.

## Veredito 1.18 (mantém)
❌ Falhou — não executável até o fim neste ambiente/sessão. Evidência read-only forte +
descobertas acima. Bloqueios reais para fechar: (a) DynamoDB + PostgreSQL inacessíveis,
(b) mecanismo de "exclusão de organização" (vs reset Sophia) a confirmar, (c) AT com
mapeamento tabela→datastore errado, (d) Trial precisa de curso + geração para popular as
tabelas novas verificáveis no MySQL.

## FECHAMENTO 11/06 — E2E completo executado

Ciclo: curso 807899 → atividade Page 9295604 → geração roteiro via copiloto
(`ai_generation_tasks`=1, completed) → baseline MySQL → Sophia "Todas informações"
(`DELETE /delete_trial_data` → 204, provado na rede) → reconsulta.

**Resultado**: events do usuário + event_contents APAGADOS (cascata ok, UI vazia);
**`ai_generation_tasks` RETIDA e ÓRFÃ** (única tabela MySQL nova que a feature
escreve — não entra na cascata; pode ser retenção intencional p/ auditoria, a
alinhar). Sobram na org 5 events de template do sistema (kinds 7/8/9). Veredito
final ❌ (0/1 TCs) — laudo: `reports/qa-1.18-exclusao-banco-historico-laudo.md`.
