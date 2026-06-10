# Recon — QA 1.14 "Suportar mobile" (#R14)

**Data**: 2026-06-09 · **Org**: 37061 (`staging-novo-estudio`) · **Curso**: 807533 ·
**Card**: 19718 · **Modo**: recon read-only + execução ao vivo dos TCs viáveis.

## Achado: o Estúdio É responsivo, mas a RN 54.2 (tabs no rodapé) não existe

Gotcha de recon: em mobile o shell **às vezes não hidrata** (tela branca) — o
1º recon caiu nisso. Com retry de hidratação + reload (igual `StudioActivities
Page.goto`), os 3 viewports renderizam.

| Viewport | Layout observado | shell | list | preview |
|---|---|---|---|---|
| 360×740 (mobile) | coluna única | ✅ | ✅ | oculto (drill-down) |
| 767×900 (breakpoint) | coluna única | ✅ | ✅ | oculto |
| 768×1024 (tablet) | 2 colunas | ✅ | ✅ | ✅ |

- **Drill-down**: ao tocar uma atividade em mobile, o preview **substitui** a
  lista (`previewVis=true, listVis=false`) — não há barra de tabs.
- **Copiloto**: FAB `copilot-drawer-toggle` (aria "Abrir copiloto"); ao abrir,
  o drawer ocupa a **tela cheia** (RN 54.1 ✅, confirmado em execução).
- **Divergência RN 54.2**: o Discovery especifica lista/preview/copiloto como
  **3 tabs no rodapé**. A UI real NÃO tem tab-bar — usa drill-down + FAB. Como
  #R14 é P3 "mobile minimamente", **a alinhar com João**: decisão consciente ou
  gap? (não cravado como bug).

## Veredito por TC (suíte de 9)

| TC | Descrição | Veredito | Nota |
|---|---|---|---|
| TC1 | Acessar em mobile 360 | ✅ | shell+list visíveis, preview colapsado |
| TC2 | Drawer copiloto tela cheia (RN 54.1) | ✅ | drawer ocupa o viewport |
| TC3 | 3 tabs no rodapé (RN 54.2) | ❌ | divergência — drill-down + FAB; alinhar João |
| TC4 | Alternar tabs no rodapé | ❌ | depende de TC3 (tab-bar inexistente) |
| TC5 | Drag&drop touch handle ampliado (RN 54.3) | fixme | touch-dnd em curso compartilhado (risco) |
| TC6 | IA disponível em mobile (RN 55) | fixme | geração real cara; copiloto coberto por TC2 |
| TC7 | Edição inline mobile (RN 56) | fixme | editor Plate/Fabric fora do recon |
| TC8 | <768px aplica layout mobile | ✅ | 767 = coluna única |
| TC9 | Tablet 768 intermediário | ✅ | 2 colunas |

**Resultado da execução**: 4 passed (TC1/2/8/9), 5 skipped (fixme). Evidências:
`outputs/novo-estudio/recon-1.14-{mobile-360,breakpoint-767,tablet-768}.png`.

## Laudo (a alinhar com João — solicitante)

Mobile **suportado minimamente** (renderiza, responsivo, copiloto tela cheia).
**Único achado relevante**: RN 54.2 (tabs no rodapé) não implementada como
especificada — produto usa drill-down + FAB. Retrabalho/alinhamento, não bug
cravado (P3 "minimamente").
