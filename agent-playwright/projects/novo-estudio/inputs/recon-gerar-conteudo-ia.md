# Recon — Gerar conteúdo de aula e página via IA em sequência fixa

> Recon ao vivo (storageState do global-setup) em 2026-06-05, org **novo-estudio**
> (37061), curso `807533` ("Construindo times de alta performance"), flag
> `creation_studio` ON. Consumido pelos specs da suíte
> `gerar-conteudo-ia-sequencia-fixa`.

## ⚠️ Descoberta crítica — click no item pendente DISPARA geração real

Clicar numa linha do popover de pendências (`studio-pending-artifacts-row-*`)
**NÃO** mostra um passo "confirmar antes de gerar". O copiloto, de forma
autônoma, **verifica pré-requisitos e DISPARA a geração imediatamente**:

> "Perfeito! 🚀 Disparei a geração do **roteiro** para a atividade ... A task
> foi enfileirada e está sendo processada. ... Após a aprovação do roteiro, os
> demais artefatos (slides, imagem, áudio e renderização) ficarão disponíveis."

Implicações para os specs (decisão do usuário 2026-06-05: **affordances +
fixme nos longos**):

- A **ordem da sequência fixa** (TC1/TC2) é asserível pelas linhas do popover
  **SEM disparar geração** (roteiro → slides → imagem → áudio → render para
  Lesson; roteiro → conteúdo da página → imagem para Page).
- As ações **Aprovar/Regerar/Rejeitar** (TC9/10/11) só existem no card de
  validação, que aparece **após** o disparo. Affordance = disparar roteiro
  (geração de texto, barata), asserir que os 3 botões aparecem e **NÃO aprovar**
  (aprovar cascateia para slides/imagem/áudio = caro). Cada teste desses limpa
  a atividade-seed no afterEach.
- Geração completa de slides/imagem/áudio/render, regerar imagem por slide,
  invalidação de áudio, modos automático/assistente e bulk → `test.fixme`
  (categoria geração-IA-longa / não-determinística / seed-ausente).

## Catálogo de test-ids novos (atributo `data-test-id`)

### Copiloto (drawer)
| test-id | Papel |
|---|---|
| `copilot-drawer` | container do drawer "Copiloto do Estúdio" |
| `copilot-drawer-close` | botão "X" (fecha o drawer). **Obrigatório fechar antes de mexer na lista** — o portal `aui-thread-viewport` intercepta clicks nos cards |
| `copilot-open-thread-list` | abre lista de conversas (histórico) |

### Card de validação de geração (aparece após disparo)
| test-id | Papel | TC |
|---|---|---|
| `studio-copilot-validation-message-{uuid}` | wrapper da mensagem de validação | — |
| `studio-copilot-validation-card` | card de validação da etapa | TC9/10/11 |
| `studio-copilot-validation-header` | cabeçalho do card | — |
| `studio-copilot-validation-body-{stage}` | corpo por etapa (`roteiro`, …) | TC23/32 |
| `studio-copilot-validation-approve` | botão **Aprovar** | TC9 |
| `studio-copilot-validation-regenerate` | botão **Regerar** | TC10 |
| `studio-copilot-validation-reject` | botão **Rejeitar e descartar** | TC11 |

### Popover de pendências (já parcialmente catalogado)
| test-id | Papel |
|---|---|
| `studio-pending-artifacts-badge` | badge consolidado "N pendentes" |
| `studio-pending-artifacts-popover` | popover (1 por card; mirar `:visible`) |
| `studio-pending-artifacts-row-{key}` | Lesson: `roteiro/slides/imagem/audio/render`; Page: `roteiro/conteudo_pagina/imagem` |

### Barra de ações do preview (selecionar atividade abre o preview central)
| test-id | Papel | TC |
|---|---|---|
| `creation-studio-preview-pane` | painel de preview | — |
| `creation-studio-preview-title` | título da atividade no preview | — |
| `creation-studio-preview-points-tag` | tag de pontos | — |
| `creation-studio-preview-complete-with-ai` | botão **"Concluir geração com IA"** (aria-label "Concluir geração com inteligência artificial") | TC20 |
| `creation-studio-preview-edit` | botão Editar | TC7/8 |
| `creation-studio-preview-toggle-status` | botão **"Bloquear atividade"** (toggle) | TC21 |
| `creation-studio-preview-delete` | botão Excluir | cleanup |
| `creation-studio-preview-body` | corpo do preview | — |

## Lacunas / divergências a reportar

- **Seletor de modo (Assistente por etapas / Automático pela IA — TC12/13/14)**:
  NÃO observado na entrada de geração. O copiloto dispara autonomamente sem
  oferecer escolha de modo no ponto de disparo via popover. → `// REVISAR` /
  `fixme`; pode existir por outro caminho (chat livre, bulk) — reportar ao agent-at.
- **Rota na AT** (`/o/{org}/events/:id/edit/studio`) desatualizada → real
  `/o/{org}/contents/{id}/edit?tab=studio`. Já registrado para agent-at.
- **TC6 / TC24** são `Tipo: db` → fora do escopo agent-playwright (CONTRACT.md),
  encaminhar ao agent-db.
- **Badges por letra/cor (R/S/I/U) e "badge cinza-claro opcional"** (TC4/5/8/17/18)
  → modelo SUPERSEDED (PO 2026-06-05). Specs validam o modelo consolidado.
- O curso 807533 tem seeds externos (`seed-video-59641`, `Titulo para pagina`,
  `Atividade do tipo aula`) de outras sessões — **não deletar** no cleanup.
  Filtrar órfãs por naming próprio (`IA-TC*`).
