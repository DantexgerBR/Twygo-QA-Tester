---
name: feedback-autonomia-criacao
description: "Preferência do usuário: criar dados de teste autonomamente durante inspeção/reprodução de bugs, sem pedir permissão"
metadata: 
  node_type: memory
  type: feedback
  originSessionId: 7e2530b2-085d-4f07-bc91-78292c5ac775
---

Quando não há dados existentes na funcionalidade a ser testada (listas vazias, sem registros), criar os dados necessários autonomamente (ex: clicar em "Adicionar", preencher com nomes genéricos como "TESTE", "TESTE_AUTOMACAO", etc.) para poder prosseguir com a inspeção/reprodução do bug.

**Why:** O usuário quer ritmo contínuo de investigação — parar para pedir permissão para criar dados de teste quebra o fluxo desnecessariamente.

**How to apply:** Em scripts de inspeção (inspect_*.py) e em scripts de reprodução de incidentes, sempre incluir lógica para criar dados de suporte quando a listagem está vazia. Usar nomes óbvios ("TESTE_AUTOMACAO", "TESTE_BUG_<slug>") para fácil identificação/limpeza posterior. Aplicar tanto ao criar repositórios, cursos, atividades, usuários de teste, quanto qualquer outro entidade que o teste precise.
