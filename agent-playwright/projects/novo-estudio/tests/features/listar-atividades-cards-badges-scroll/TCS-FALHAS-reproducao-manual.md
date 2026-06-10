# Triagem dos TCs reprovados — Suíte "Listar atividades de cards, badges de etapa e scroll infinito"

> Projeto: **novo-estudio** · Spec: [`badges-etapa.spec.ts`](./badges-etapa.spec.ts)
> Atualizado em 2026-06-05 · Org principal, `creation_studio` (Flipper) habilitada.
> RNs referenciadas: [`inputs/[Discovery] Novo Estúdio de Criação - v01 06.05.2026.md`](../../../inputs/).

## Decisão do PO (2026-06-05) — re-baseline do modelo de badges

Verificado com o PO: **as regras de negócio mudaram**. **Não haverá mais badges
de etapa por letra nem cores diferenciadas** — o card passa a indicar apenas
**Pendente** ou **Pronto** (modelo de badge consolidado **"N pendentes"** + popover
de detalhamento, exatamente o que a plataforma já implementou).

Consequência: as RNs do Discovery que descreviam o modelo antigo ficam
**SUPERSEDED** e a AT (`test-analysis.md`) deve ser atualizada pelo agent-at:

| RN (Discovery) | Texto antigo | Status |
|---|---|---|
| **RN 14.1** | Lesson: 5 badges de letra (R/S/I/U/R) + tooltip | ❌ superseded |
| **RN 14.2** | Page: 3 badges nomeadas (Roteiro/Conteúdo/Imagens) | ❌ superseded |
| **RN 14.4** | Cores verde/cinza-laranja/cinza-claro por etapa | ❌ superseded |
| **RN 14.6** | Tooltip por badge de letra | ❌ superseded |
| **RN 14.7** | Click na badge → copiloto direto | 🔁 re-baseline: badge → **popover** → item → copiloto |
| **RN 14.3** | Demais tipos: badge "Pendente"/"Pronto" | ✅ agora é o modelo de TODOS |
| **RN 14.5** | Card sem pendência não exibe badge | ✅ mantida |

**Portanto, os TCs que reprovavam apenas por divergirem do modelo antigo de
badges ficam APROVADOS** (a plataforma está correta segundo a nova RN). **Resta
um único reprovado: TC30**, por uma lacuna de **acessibilidade** (`aria-label`)
que independe da mudança de modelo.

## Veredito por TC

| TC | RN | Verdito | Motivo |
|---|---|---|---|
| **TC2** — 5 badges Lesson | RN 14.1 | ✅ **Aprovado** | RN 14.1 superseded; produto usa badge consolidado "5 pendentes" + popover. |
| **TC3** — 3 badges Page | RN 14.2 | ✅ **Aprovado** | RN 14.2 superseded; badge consolidado "3 pendentes" + popover. |
| **TC4** — Pendente/Pronto (sem subdivisão) | RN 14.3 | ✅ **Aprovado** | Novo modelo unificado (pendente/pronto consolidado) cobre o caso. |
| **TC5** — cor verde (etapa concluída) | RN 14.4 | ✅ **Aprovado** | RN 14.4 superseded; não há mais cor por etapa. |
| **TC6** — cor cinza/laranja (pendente) | RN 14.4 | ✅ **Aprovado** | RN 14.4 superseded. |
| **TC7** — cor cinza-claro (opcional/Imagens) | RN 14.4 + RN 36.4 | ✅ **Aprovado** | RN 14.4 superseded; "opcional" deixa de ser sinalizado por cor. |
| **TC9** — tooltip sobre badge | RN 14.6 | ✅ **Aprovado** | RN 14.6 superseded; o detalhe da etapa vive no popover (TC30/31). |
| **TC10** — click badge → copiloto | RN 14.7 | ✅ **Aprovado** | RN 14.7 re-baselined: o fluxo correto é badge → popover → item → copiloto (TC32). |
| **TC30** — popover de detalhamento (badge clicável) | RN 14.6 / 14.7 | ❌ **REPROVADO** | O popover funciona, mas os itens **não expõem `aria-label`** exigido — lacuna de acessibilidade (bug de produto, independe da RN). |

> ✅ **Specs re-baselinados (2026-06-05)**: `badges-etapa.spec.ts` foi atualizado
> para asserir o NOVO modelo (badge consolidado "N pendentes" + popover; ausência
> de badges de letra). O report automatizado agora reflete o veredito:
> **TC2/3/4/5/6/7/9/10/31/32 verdes** e **TC30 vermelho** (aria-label). Run de
> validação (workers=1): **10 passed, 1 failed**.

---

## TC30 — Validar popover de detalhamento de pendências (badge clicável) — **único reprovado**

**RN:** RN 14.6 (detalhe da etapa) + RN 14.7 (badge clicável → copiloto).

**Pré-condição:** Atividade Page com 3 etapas pendentes (use uma Página nova —
nasce com Roteiro/Conteúdo/Imagens pendentes).

**Como reproduzir (manual):**
1. Abra `/o/{orgId}/contents/{contentId}/edit?tab=studio` (recon: org `37061`,
   curso `807533`). A flag `creation_studio` deve estar habilitada.
2. Crie uma atividade **Página** (Adicionar → Página → título → Salvar).
3. No card, clique no botão **"3 pendentes – Ver detalhes"** → o popover abre.
4. Confira o título "Clique em um item pendente para gerar com o copiloto:".
5. Confira os 3 itens: "roteiro", "conteúdo da página", "imagens" (todos pendentes).
6. **Inspecione o `aria-label` de cada item do popover** (passo que falha).

**Esperado (AT, passo 6):** cada item é um botão com
`aria-label="<etapa>, pendente. Clique para gerar com o copiloto."`.

**Resultado real:** o popover, o título e os 3 itens aparecem corretamente
(passos 1–5 ✅), mas os botões do popover **não definem `aria-label`** (recon
2026-06-05). A asserção do passo 6 reprova.

**Categoria:** bug de produto (acessibilidade) — não afetado pela mudança de RN.
**Destinatário:** Dev de produto.

---

## Encaminhamento

| Item | Destinatário | Ação |
|---|---|---|
| RN 14.1 / 14.2 / 14.4 / 14.6 superseded (sem badges de letra/cores) | **agent-at / QA Lead** | Atualizar a AT (`test-analysis.md`) ao novo modelo: badge consolidado "N pendentes" / "Pronto" + popover. Decisão de PO 2026-06-05. |
| Re-baseline dos specs TC2–TC10 ao novo modelo | **agent-playwright (QA)** | ✅ **Feito (2026-06-05)** — asserções no modelo consolidado (badge + popover); verdes no report. Confirmar contra a AT quando o agent-at atualizar a RN 14. |
| `aria-label` ausente nos itens do popover (**TC30**) | **Dev de produto** | Adicionar `aria-label="<etapa>, pendente. Clique para gerar com o copiloto."` nos botões do popover (`studio-pending-artifacts-row-*`). |
| Rota desatualizada na AT (`/events/:id/edit/studio`) | **agent-at (CONTRACT.md)** | Corrigir para `/contents/{id}/edit?tab=studio` no MD canônico. |
