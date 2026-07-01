# Seed playbook — Escopo do Líder (QA 1.16, org 37093)

> Provisionamento da hierarquia líder→liderado para popular o `team_scope` dos
> Registros. Executado via UI/MCP em 2026-06-30. Complementa
> `recon-escopo-lider-modo-uso.md` e `seeds-requeridos-escopo-lider.md`.

## Mecanismo confirmado (cadastro de usuário)

Tela `/o/{org}/users` (perfil Admin) → aba **"Lista de usuários"** → botão **"+"**
→ `/o/{org}/users/new`. Formulário **server-rendered** (Rails, `professional[...]`):

| Campo | Seletor | Observação |
|---|---|---|
| Nome | `#professional_first_name` | — |
| Sobrenome | `#professional_last_name` | — |
| E-mail | `#professional_email` | — |
| **Líder de equipe** (flag) | `#professional_is_manager` (checkbox) | marca o usuário como líder/manager |
| **Responsável** (o líder do colaborador) | `#manager_name` (autocomplete) → `[name="professional[manager_id]"]` (hidden) | digitar nome → clicar **"Associar"** no resultado seta o `manager_id` |
| **Modo de uso (como aluno)** | `#professional_use_mode_id` (select) | opções: `Colaborador` · `asdasd` · `Lider de equipe` |
| Perfis | `user_profile_settings[admin|instructor|manager_class]` | Admin/Instrutor/Gestor de turma |

Salvar: botão **"Salvar"** → redireciona para `/o/{org}/users`.

**Só usuários flagados `is_manager` aparecem no autocomplete de "Responsável".**
(Confirmado: `agents.qa` NÃO é manager; `lider.equipe@twygo.com` é.)

## Restrição dura: usuário novo NÃO tem senha

O formulário **não tem campo de senha** — o usuário criado recebe **convite por
e-mail** e define a senha depois. Consequências:

1. **Não dá pra "logar como o liderado"** para ele lançar o próprio registro →
   o **Admin lança em nome dele** (tela Registros → Adicionar → Pessoa = liderado).
   Mesmo estado de dados final.
2. **A suíte automatizada não consegue logar como o líder dedicado** até alguém
   **definir a senha** dele e colocá-la no `.env`. Esse é o handoff abaixo.

## O que JÁ foi provisionado (2026-06-30)

| Usuário | E-mail | Papel | Config |
|---|---|---|---|
| **QA Lider Escopo** | `qa.lider.escopo@claude.com` | **Líder** (id **4306061**) | `is_manager` ✓, modo de uso "Lider de equipe" |
| **QA Liderado Um** | `qa.liderado1@claude.com` | Liderado | Responsável = 4306061, modo de uso "Colaborador" |

Falta (script abaixo): mais liderados (opcional), **registros** dos liderados e
**aprovação**.

## Passos restantes do seed (reproduzível)

1. **(opcional) Liderado 2** — repetir o cadastro: Responsável = QA Lider Escopo.
2. **Lançar registros dos liderados** (Admin em nome de cada um):
   - Via UI: Registros → **Adicionar** → Pessoa = "QA Liderado Um" → preencher
     provedor/experiência/categoria/conteúdo → Salvar (nasce **Pendente**).
   - Via API (mais rápido): `POST /api/v1/o/37093/records` com
     `record.people=[<id do liderado>]` (ver `data/records-api.ts`
     `buildPendingRecordPayload`; ajustar `people` para o id do liderado e os
     ids de provider/experience/category da org 37093).
   - Distribuição sugerida (cobre TC1-Líder/TC5-Líder): 2–3 Pendentes + aprovar
     alguns p/ virarem Emitidos.
3. **Aprovar** registros pendentes: como Admin (kebab `records-{id}-actions-kebab`
   → "Avaliar") ou como o líder em `/o/{org}/team/records`.
4. **Validar**: logado como o líder, `team_scope` deve refletir os registros dos
   liderados:
   `GET /api/v1/o/37093/records/stats?in_use_mode_layout=true&team_scope=true`
   → `total_general > 0` e a lista de `/o/37093/team/records` coerente
   (TC5-Líder e TC1-Líder ficam verdes — ver `pages/TeamRecordsPage.ts`).

## Handoff (pra fechar o ciclo)

Para a suíte automatizada validar o lado Líder com este líder dedicado:

1. **Definir a senha** de `qa.lider.escopo@claude.com` (confirmar o convite ou
   redefinir senha pelo Admin).
2. Adicionar env em `config/environment.json` (ex. `staging-registros-edu-lider`,
   orgId 37093, mesma baseUrl) + credenciais em `.env`
   (`TWYGO_STAGING_REGISTROS_EDU_LIDER_EMAIL/PASSWORD`).
3. Avisar — eu aponto um storageState do líder e flipo TC1-Líder/TC3 para verdes
   (TC5-Líder já roda por invariante; com massa fica não-trivial de verdade).

## Pendências de outras orgs (Bloqueios C/D — pulados)

TC6/7/10 (Compartilhado) e TC8/9 (multi-org) seguem `fixme` — exigem
credenciais de 37079/37080 no `.env` (ver `seeds-requeridos-escopo-lider.md`).
