# Recon "modo de uso" — QA 1.16 (Escopo do Líder) — 2026-06-30

> **Corrige o `recon-escopo-lider.md` §9.** O recon anterior concluiu que "o
> escopo de Líder NÃO é aplicado a /records neste BETA". Essa conclusão estava
> **errada por metodologia**: ele só exercitou o **popover de perfil** (que cai
> em `/dashboard_students`) e o `/records` do Admin. A visão escopada do líder é
> um **modelo de página do modo de uso**, alcançada por menu — nunca foi testada.
>
> Org: `staging-registros-edu` (37093). Executado via specs Playwright
> autenticados (`_recon-modo-uso{,2,3}.spec.ts`, já removidos).

## TL;DR

- **O escopo de Líder EXISTE e funciona.** Há 3 escopos distintos da MESMA tela
  de Registros, cada um com seu `/records/stats`:

  | Persona / modo de uso | Rota | Endpoint de stats | `total_general` (obs.) |
  |---|---|---|---|
  | **Admin** (org inteira) | `/o/{org}/records` | `/records/stats` | **232** |
  | **Colaborador** (Meu histórico) | `/o/{org}/my-history` | `/records/stats?in_use_mode_layout=true` | **38** |
  | **Líder / Time** (Gestão de Time → Registros externos) | `/o/{org}/team/records?menu_id=registros-externos` | `/records/stats?in_use_mode_layout=true&team_scope=true` | **0** |

  Três números diferentes (232 > 38 > 0) = prova de que o escopo é aplicado.
- O líder de teste (`team_leader` id **4301564**) tem **1 liderado** e esse
  liderado tem **0 registros** → por isso o time mostra 0. **Gap de seed, não de
  feature.**
- **Compartilhado**: `granted_shared_events` e `received_shared_events` = **0
  entries**; badges de origem só `external`/`internal`. Origem "Compartilhado"
  realmente não existe → TC6/TC7/TC10 seguem bloqueados por seed.
- **Multi-org**: nenhum seletor de troca de org na sessão; sem env de "org Y" →
  TC8/TC9 seguem bloqueados por infra.

## Por que o §9 errou (lição de método)

O perfil **"Lider de equipe"** desta org usa a classe de link **`new-item-aluno`**
e `href=/dashboard_students` — é o perfil **aluno/colaborador renomeado** pelo
admin. Trocar para ele no popover leva a `/dashboard_students` (visão aluno),
e o `/records` admin reverte para Administrador. O §9 viu isso e concluiu
"escopo não aplicado".

O que faltou: **a visão do líder não é o popover, é o menu do modo de uso.**
A API `/api/v1/o/{org}/use_modes` mostra o `use_mode` **"Lider de equipe"** (id
70340, `scoped_id` 3) com os itens, entre outros:

- `Meu histórico` (item 370016) → `/o/{org}/my-history`
- `Gestão de Time` (370017) → submenu contendo:
  - **`Registros externos` (370886, ícone `rule`)** → `/o/{org}/team/records?menu_id=registros-externos` ← **a visão escopada**
- `Equipe` (370012) → `/team_leaders/4301564/users` (os liderados)

## Veredito por TC (reconciliado)

| TC | Status agora | Antes (§9) | O que destrava |
|---|---|---|---|
| **TC1-Admin** | ✅ verde | ✅ | — |
| **TC1-Líder** (lista + dropdown Pessoa) | ⊘ fixme **seed** | "feature ausente" ❌ | ≥2 liderados COM registros sob 4301564 |
| **TC2** (403 fora de escopo) | ⊘ fixme **seed + recon API** | "feature ausente" ❌ | liderado + não-liderado com registro; rota de aprovação |
| **TC3** (preservação pós-hierarquia) | ⊘ fixme **seed** | "feature ausente" ❌ | liderado com registro aprovável + remoção via tela Equipe |
| **TC4** (sumiço inativado) | ⊘ fixme **seed** | seed ✓ | pessoa inativável (3 Emitidos+1 Pendente) + rota users |
| **TC5-Admin** | ✅ verde | ✅ | — |
| **TC5-Líder** | ✅ **verde (novo)** | "feature ausente" ❌ | — (invariante escopo/coerência, `TeamRecordsPage`) |
| **TC6** (menu Compartilhado) | ⊘ fixme **seed** | seed ✓ | org parceira + registro Compartilhado replicado |
| **TC7** (PATCH/DELETE Compartilhado 403) | ⊘ fixme **seed** | seed ✓ | idem TC6 (id de registro Compartilhado) |
| **TC8** (multi-org Aluno) | ⊘ fixme **infra** | seed ✓ | 2ª org Y com mesmo aluno + env novo |
| **TC9** (multi-org Admin) | ⊘ fixme **infra** | seed ✓ | idem TC8 |
| **TC10** (permanência pós-inativação org) | ⊘ fixme **seed + produto** | seed ✓ | seed Compartilhado + confirmar política (destrutivo) |

## Seletores / contrato estáveis (para os POMs)

- KPI cards (em TODOS os escopos): `records-kpi-card-{emitted|expired|awaiting_confirmation|rejected}` + `records-kpi-count-*`.
- Tab da lista: `tab-records-tab`. Linha vazia: "Não há dados para exibir".
- Switch p/ líder: popover `button.menu-target` → `a.new-item-aluno` (NÃO assertir
  rótulo "Aluno" — o trigger mostra "Lider de equipe").
- Visão de time implementada em `pages/TeamRecordsPage.ts`.
- `use_modes` admin: `/o/{org}/use_modes`; API `/api/v1/o/{org}/use_modes`.
- Compartilhamento: `/o/{org}/shared_events` (abas `tab-granted-tab` / `tab-received-tab`);
  APIs `granted_shared_events` / `received_shared_events`.
