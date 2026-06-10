# Recon — Listar atividades de cards, badges de etapa e scroll infinito

> Gerado por recon ao vivo (storageState do global-setup) em 2026-06-03 contra
> a org principal **novo-estudio** (orgId 37061). Consumido pelo
> `playwright-test-planner`/`generator` para pular exploração ao vivo.

## ⚠️ Rota real diverge da AT

A AT (`test-analysis.md`, catálogo `Rotas`) declara
`rotaEstudio: /o/{org}/events/:id/edit/studio`. **A rota real do Estúdio é
outra**:

- Curso/atividade abre em **`/o/{org}/contents/{contentId}/edit`** (não `/events/`).
- A lista de atividades (aba "Atividades") é **`?tab=studio`** →
  `/o/{org}/contents/{contentId}/edit?tab=studio`.
- Aba Identificação = `?tab=identification`.

> Discrepância a corrigir no MD canônico via agent-at (CONTRACT.md: edição só no MD).
> Specs devem usar a rota REAL (`/contents/{id}/edit?tab=studio`).

## Pré-condições confirmadas

- Flag `creation_studio` (Flipper) está **HABILITADA** na org 37061 (tela única
  do Estúdio renderiza — `creation-studio-three-column-shell` presente).
- Login coberto por global-setup (storageState). Não logar no spec.

## Curso de recon

- **`contentId: 807533`** — "Construindo times de alta performance".
- **12 atividades** (top-level), 3 delas com sub-atividades (`-toggle-children`).
- Todas COMPLETAS → sem badges de pendência (bom para TC8; ruim para TCs de badge).
- IDs internos de atividade observados: 9288189..9288199 (`aria-rowcount="12"`).

## Catálogo de test-ids (data-test-id — atributo `data-test-id` com hífen)

### Layout / lista
| test-id | Papel | TCs |
|---|---|---|
| `creation-studio-three-column-shell` | shell 3 colunas | (suite 2) |
| `content-form-studio-tab` | painel da aba Atividades | — |
| `creation-studio-activities-list` | container da lista | geral |
| `creation-studio-activities-list-title` | título + contagem → "Atividades (12)" | TC25 |
| `creation-studio-activities-list-scroll` | área scrollável (scroll infinito) | TC12 |
| `creation-studio-activities-list-collapse` | botão recolher lista | TC26 |
| `creation-studio-activity-add-button` | "Adicionar atividade" | TC16, TC17 |
| `creation-studio-activities-jump-to-input` | input "Ir para" numérico | TC14, TC15, TC27 |
| `creation-studio-activities-jump-to-submit` | botão "Ir para" | TC14, TC15, TC27 |

### Card-rich (por atividade) — 12 instâncias de cada
| test-id | Papel | TCs |
|---|---|---|
| `creation-studio-activity-card-{id}` | card raiz (role=button, aria-label="N Conteúdo N", aria-rowindex, aria-rowcount) | TC1 |
| `creation-studio-activity-card-sortable-{id}` | wrapper dnd-kit sortable | TC11, TC21, TC22 |
| `creation-studio-activity-card-drag-handle` | alça de arrastar (aria-label="Arrastar atividade") | TC11, TC21, TC22 |
| `creation-studio-activity-card-position` | posição numérica (1,2,3...) | TC1, TC20 |
| `creation-studio-activity-card-checkbox` | checkbox de seleção (Chakra) | TC23, TC33 |
| `creation-studio-activity-card-title` | nome da atividade | TC1 |
| `creation-studio-activity-card-type` | tipo da atividade | TC1 |
| `creation-studio-activity-card-status-released` | status visual "Liberada" | TC34 |
| `creation-studio-activity-card-toggle-children` | expande/recolhe sub-atividades (3 cards) | TC29 |
| `creation-studio-activity-card-sub-activities` | container de sub-atividades | TC29 |
| `creation-studio-activity-children-{id}` | filhos de um card específico | TC29 |

### Preview (coluna central)
| test-id | Papel |
|---|---|
| `creation-studio-preview-toggle-status` | toggle de status no preview |

## Lacunas de seed (badges)

Os badges de etapa (Pendente/Pronto, 5 badges Lesson, cores verde/cinza/laranja,
popover, tooltip) **NÃO renderizam** no curso 807533 (tudo completo). Para os TCs
2-7, 9, 10, 30, 31, 32 é necessária uma atividade Lesson/Page com **etapa
pendente** — provisionável via `beforeAll` (criar Lesson e deixar etapa
"Imagens" incompleta) seguindo skill `provisionar-seed`. Test-ids de badge a
catalogar quando o estado pendente existir.

## Lacunas de seed (volume) — AVISAR QA

- **TC12** (scroll infinito, ≥100 atividades) e **TC13** (performance, 3000+
  atividades) exigem curso de alto volume — inviável via UI. Curso de recon tem 12.
  → Bloqueio sinalizado ao QA; depende de seed em massa (API/DB).
