---
name: feedback-headless-playwright
description: Usar headless=True no Playwright por padrão — modo visível interfere com controles do sistema do usuário
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7e2530b2-085d-4f07-bc91-78292c5ac775
---

Ao rodar scripts Playwright, usar `headless=True` por padrão. O modo `headless=False` (janela visível) pode interferir com controles do sistema operacional do usuário (ex: volume do fone de ouvido via atalhos do teclado capturados pela janela do Chromium).

**Why:** O usuário reportou que a janela do Chromium aberta pelos testes estava diminuindo o volume do fone de ouvido durante a execução.

**How to apply:** Sempre `headless=True` em scripts de inspeção e reprodução. `slow_mo` pode ser removido também, já que não serve para inspeção headless.
