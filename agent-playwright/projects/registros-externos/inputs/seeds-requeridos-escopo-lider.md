# Seeds / infra requeridos — QA 1.16 (Escopo do Líder)

> Para o QA Lead. Cada item destrava TC(s) específicos da suíte
> "Escopo do Líder, pessoas inativadas e origem Compartilhado".
> Base factual: `recon-escopo-lider-modo-uso.md` (2026-06-30, org 37093).
>
> **Status atual:** 3 verdes (TC1-Admin, TC5-Admin, TC5-Líder), 9 fixme.
> Os fixme NÃO são bug de produto — são falta de massa/ambiente.

## Bloqueio A — Liderados COM registros (escopo do Líder)

**Destrava:** TC1-Líder, TC2, TC3 (e reforça TC5-Líder).
**Por quê:** a visão de time já funciona (`/o/{org}/team/records`,
`team_scope=true`), mas o líder de teste (`team_leader` **4301564**) tem 1
liderado e **0 registros** — sem massa, lista/dropdown ficam vazios e não há o
que assertir.

**Pedido ao QA Lead (na org 37093):**
1. Garantir **≥2 liderados diretos** sob o líder 4301564 (tela "Equipe" →
   `/team_leaders/4301564/users`).
2. Criar para esses liderados uma **distribuição conhecida** de registros
   (ex.: liderado A = 2 Emitidos + 1 Pendente; liderado B = 1 Emitido).
3. Garantir **≥1 pessoa FORA da equipe** com ≥1 registro (para o cenário
   negativo do TC2 — ação fora de escopo → 403).

> Com isso, TC1-Líder e TC3 viram verdes; TC2 precisa também do item do
> Bloqueio E (rota de aprovação).

## Bloqueio B — Pessoa inativável com registros (TC4)

**Destrava:** TC4.
**Pedido:** 1 pessoa na org 37093 com distribuição conhecida (ex.: **3 Emitidos
+ 1 Pendente**), **inativável** pela admin de usuários, e confirmar a **rota**
da tela de inativação (`/o/{org}/professionals` veio vazio no recon — a tela de
usuários é outra). Idealmente reversível (o spec re-ativa no cleanup).

## Bloqueio C — Origem "Compartilhado" (TC6, TC7, TC10)

**Destrava:** TC6, TC7, TC10.
**Por quê:** recon confirmou `granted/received_shared_events = 0` e badges só
`external`/`internal` — origem "Compartilhado" não existe na org.
**Pedido:** configurar uma **org parceira P** com compartilhamento ativo para a
37093 e **replicar ≥1 registro Compartilhado** na 37093 (não dá por POST direto
— é o fluxo de compartilhamento entre orgs). Para TC10, confirmar com **produto**
a política de preservação ao inativar a org parceira (Spike S11) antes de
automatizar (passo destrutivo).

## Bloqueio D — Segunda organização com o mesmo usuário (TC8, TC9)

**Destrava:** TC8, TC9.
**Pedido:** uma **2ª organização (org Y)** com o **mesmo usuário** vinculado
(aluno p/ TC8, admin p/ TC9), registros distintos em cada (ex.: 10 na X, 4 na
Y). Depois: adicionar entrada em `config/environment.json` + `.env` (sufixo a
definir, ex. `staging-registros-edu-org-y`).

> Nota: a org `-aditional` (37080) NÃO serve — é par de contrato, não "2 orgs
> independentes com mesmo usuário" (ver recon §2 do recon-escopo-lider).

## Bloqueio E — Recon de API de ação (TC2)

**Destrava:** TC2 (junto com Bloqueio A).
**Pedido:** capturar via Network a rota real de **aprovar** registro
(`PATCH`/`POST .../records/{id}/...`) e o shape do **403** + texto do toast. A
sessão única do Twygo barrou essa captura no recon (modal "Continuar mesmo
assim"). Não é seed — é recon, que faço assim que houver o seed do Bloqueio A.

## Resumo

| Bloqueio | TCs | Dono |
|---|---|---|
| A — liderados com registros | TC1-Líder, TC2, TC3 | QA Lead (seed) |
| B — pessoa inativável | TC4 | QA Lead (seed) |
| C — origem Compartilhado | TC6, TC7, TC10 | QA Lead/infra (+ produto p/ TC10) |
| D — 2ª org mesmo usuário | TC8, TC9 | QA Lead/infra |
| E — recon API de aprovação | TC2 | QA (eu, pós-seed A) |
