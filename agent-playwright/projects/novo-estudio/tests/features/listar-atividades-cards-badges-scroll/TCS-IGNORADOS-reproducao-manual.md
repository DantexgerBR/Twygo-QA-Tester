# TCs ignorados (test.fixme) — Suíte "Listar atividades de cards, badges de etapa e scroll infinito"

> Projeto: **novo-estudio** · Atualizado em 2026-06-05.
> RNs: [`inputs/[Discovery] Novo Estúdio de Criação - v01 06.05.2026.md`](../../../inputs/).
> Companheiro deste doc: [`TCS-FALHAS-reproducao-manual.md`](./TCS-FALHAS-reproducao-manual.md) (TCs reprovados).

## O que são estes TCs

Estes **10 TCs estão marcados `test.fixme`** — o runner os **ignora** (aparecem
como `skipped`/⊘ no report). **Não são falhas nem aprovações**: são TCs que não
puderam ser executados de forma automatizada e confiável porque dependem de uma
**pré-condição que o ambiente atual não tem** (seed de volume), de uma **técnica
de risco** (drag-and-drop dnd-kit que pode corromper o curso compartilhado), ou
estão **fora do escopo do executor Playwright UI** (validação de banco).

Cada um abaixo traz: a **RN do Discovery** que cobre, **por que** foi ignorado, e
**como reproduzir manualmente**.

### Pré-requisitos comuns (todos os TCs de UI)

1. Login admin com permissão de edição de curso.
2. Flag `creation_studio` (Flipper) habilitada para a org.
3. Rota real do Estúdio: `/o/{orgId}/contents/{contentId}/edit?tab=studio`
   (recon: org `37061`, curso `807533`). ⚠️ A AT diz `/events/:id/edit/studio`
   (desatualizada).

---

## Grupo A — exigem curso de ALTO VOLUME (seed via API/DB; inviável via UI)

> O curso de recon (807533) tem ~12 atividades. Estes TCs exigem dezenas a
> milhares — destinatário: **QA Lead** (criar seed em massa por API/DB/bulk).

### TC12 — Scroll infinito carrega próxima página de 50 atividades
- **RN 16** — lista usa scroll infinito real; backend pagina 50/página; ao rolar
  ao fim, próxima leva carrega automaticamente.
- **Por que ignorado:** precisa de **≥100 atividades** para disparar a 2ª página.
- **Reproduzir manual:**
  1. Em um curso com **100+ atividades**, abra a aba Atividades.
  2. Role a lista (`creation-studio-activities-list-scroll`) até o último card.
  3. **Esperado:** próxima página de 50 carrega sozinha (sem clique); a lista
     passa a exibir até 100 cards.

### TC13 — Performance da lista com 3000+ atividades
- **RN 16.1** — suporta clientes Enterprise com 3000+ atividades sem comprometer
  a performance percebida.
- **Por que ignorado:** precisa de **3000+ atividades** — impossível semear via UI.
- **Reproduzir manual:**
  1. Em curso com **3000+ atividades**, abra o Estúdio.
  2. **Esperado:** 1ª página (50) carrega sem travar.
  3. Role continuamente até 500+ carregadas → scroll fluido, API dentro do aceitável.

### TC14 — Botão "Ir para atividade X"
- **RN 17 / 17.1** — botão "Ir para atividade X" no topo da lista; input aceita o
  número da posição; backend retorna a página que contém a posição e o front rola até o card.
- **Por que ignorado:** AT exige **200+ atividades** e jump para a posição **150**
  (o componente em si é coberto, verde, pelo TC27).
- **Reproduzir manual:**
  1. Em curso com **200+ atividades**, localize o componente "Ir para" no topo.
  2. Preencha **150** e confirme.
  3. **Esperado:** o backend retorna a página da posição 150 e a lista rola até esse card.

### TC15 — Jump-to rola até o card correto
- **RN 17.1** — ao confirmar a posição, a lista rola até o card.
- **Por que ignorado:** AT exige **100+ atividades** e jump para a posição **75**.
- **Reproduzir manual:**
  1. Em curso com **100+ atividades**, preencha "Ir para" com **75** e confirme.
  2. **Esperado:** a lista rola até a posição 75; o card fica visível no viewport
     (eventualmente com destaque).

### TC28 — Footer informativo da lista (paginação visual)
- **RN 16** — paginação do scroll infinito (a info de "Mostrando X de Y" e a dica
  de carregar mais só aparecem quando há mais de uma página).
- **Por que ignorado:** com ~12 atividades não há paginação → o footer
  "Mostrando N de M / Role até o fim para carregar mais" não renderiza.
- **Reproduzir manual:**
  1. Em curso com **>50 atividades** (com 2ª página), role até o fim da janela carregada.
  2. **Esperado:** footer "Mostrando 6 de 16 módulos na lista." + "Role até o fim
     para carregar mais." + a dica "Arraste uma atividade sobre outra para criar
     sub-atividades".

---

## Grupo B — drag-and-drop (dnd-kit): risco de corromper o curso compartilhado

> O `dragTo` simples não funciona (PointerSensor); a **zona** de drop decide a
> semântica (**centro de um card = aninha/reparenta**, borda = reordena). Um drop
> impreciso corrompe a estrutura para os demais specs. Precisam de **helper de
> drag robusto + sandbox de atividades descartáveis** (ou reset de DB) antes de
> automatizar contra o seed. Destinatário: **QA (agent-playwright)**.

### TC11 — Reorder API disparada ao soltar drag-and-drop
- **RN 15** — a reordenação via drag dispara uma chamada de API **ao soltar**
  (não em batch); o sucesso atualiza a posição visualmente.
- **Por que ignorado:** o drag funciona (validado via MCP: dispara PATCH), mas
  um drop no centro de um card **aninha** em vez de reordenar e corrompe o curso.
- **Reproduzir manual:**
  1. Em curso com ≥3 atividades, arraste a atividade da **posição 1 para a 3** (solte na borda entre cards, não no centro).
  2. Monitore a aba Network ao soltar.
  3. **Esperado:** **PATCH** de reorder disparado imediatamente; posições atualizam (1,2,3…).

### TC20 — Recálculo automático de posição numérica após reorder
- **RN 13.3** (posição calculada automaticamente, sem campo editável) + **RN 15**.
- **Por que ignorado:** exige curso com **≥5 atividades top-level** (o recon tem 4)
  + drag robusto.
- **Reproduzir manual:**
  1. Em curso com ≥5 atividades, arraste a da **posição 5 para a 2**.
  2. **Esperado:** posições recalculam automaticamente para 1,2,3,4,5 (sem buracos,
     sem campo editável).

### TC21 — Drag-and-drop restrito à janela carregada
- **RN 16.2** — reordenação em curso **parcialmente carregado** mantém a hierarquia
  correta (não permite mover para fora da janela carregada).
- **Por que ignorado:** exige **200 atividades com só 50 carregadas** (volume) + drag.
- **Reproduzir manual:**
  1. Em curso com 200 atividades (50 carregadas), tente arrastar a posição 1 para
     além do último card visível.
  2. **Esperado:** o drag **não** permite soltar fora da janela carregada.
  3. Carregue mais via scroll → agora é possível arrastar para o novo range.

### TC22 — Reparentação livre (filho movido para fora do pai)
- **RN 16.2** (hierarquia pai-filho) + comportamento "Arraste uma atividade sobre
  outra para criar sub-atividades" (footer, TC28).
- **Por que ignorado:** reparent = drop no centro/sobre outro card; impreciso
  corrompe a estrutura compartilhada (validado: aninhou "Conteúdo 1" por engano).
- **Reproduzir manual:**
  1. Em uma atividade pai com 3 filhas, arraste a **filha da posição 2 para fora** do pai.
  2. Monitore a Network.
  3. **Esperado:** a filha vira atividade de 1º nível (ou de outro pai); o **PATCH**
     inclui `{ activity_id, new_parent_id, position }`.

---

## Grupo C — fora do escopo do executor Playwright UI (validação de banco)

### TC24 — Logs da reorder API (`Tipo: db`)
- **RN 48.3** — logs estruturados em `postgres_logs` para investigação (+ RN 15, a
  reorder que gera o log).
- **Por que ignorado:** é validação de **banco/logs**, não de UI — pertence ao
  **agent-db** (ou a um TC de API em `tests/api/` consumindo o endpoint de logs).
- **Reproduzir manual (via DB):**
  1. Com acesso ao `postgres_logs` do Stage, arraste uma atividade para nova posição.
  2. Consulte `postgres_logs` filtrando pelo endpoint de reorder.
  3. **Esperado:** log com `activity_id`, `new_parent_id`, `position` e `trace_id`.

---

## Resumo / encaminhamento

| Grupo | TCs | Destinatário | Desbloqueio |
|---|---|---|---|
| A — Volume | TC12, TC13, TC14, TC15, TC28 | QA Lead | Seed em massa (100–3000+ atividades) via API/DB. |
| B — Drag dnd-kit | TC11, TC20, TC21, TC22 | QA (agent-playwright) | Helper de drag robusto + sandbox de atividades descartáveis (drop na borda, não no centro). TC20 também precisa ≥5 top-level. |
| C — Banco | TC24 | agent-db | Validar `postgres_logs` (subprocess) ou TC de API em `tests/api/`. |
