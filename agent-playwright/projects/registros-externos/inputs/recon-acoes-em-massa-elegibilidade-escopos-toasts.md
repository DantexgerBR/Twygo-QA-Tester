# Reconnaissance — Ações em massa (elegibilidade, escopos e toasts com ratio)

> Capturado ao vivo em 2026-06-23 dirigindo a UI com storageState (Admin, org
> principal 37079). Complementa o recon da suíte de KPIs tempo real
> (`recon-atualizacao-de-kpis-em-tempo-real-...md`), que já tocou o drawer.
> Planners/generators DEVEM consumir este arquivo — ele resolve divergências
> AT × produto que mudam o que "passar" significa em 6 dos 10 TCs.

## Tela e toolbar
- Admin: `/o/37079/records` (tab `tab-records-tab`). Toolbar tem **"Ações em massa"** (visível + habilitado mesmo com 0 linhas marcadas) + "Extrair dados" (`records-extraction-button`) + "Filtro" (`filter-control-open-button`).
- Aluno (layout embarcado): `/o/37079/records?in_use_mode_layout=true` — toolbar **NÃO** tem "Ações em massa" nem "Extrair dados" (só "Adicionar" + "Filtro"). Usado como proxy do TC1 passo 1 (user de teste é Admin; persona Aluno real via [[trocar-perfil-twygo]] não exercida).

## Drawer "Ações em massa" (estrutura real)
- Header: **"Ações em massa"**.
- Campo **"Ação*"**: `<select>` NATIVO. Opções: `["", "Aprovar registros", "Recusar registros", "Excluir registros"]` — **default VAZIO** (sem ação pré-selecionada).
- Grupo **"Opção de envio*"** (AT chama de "Opções"): 2 radios — **"Selecionados"** e **"Todos do filtro atual"**.
  - Com **0 marcados**: "Selecionados" vem **checked (default) e NÃO desabilitado**; nenhum tooltip ao hover.
  - Com **3 marcados**: idem — "Selecionados" checked/default. **Labels NÃO trazem contagem `(N)`/`(M)`** — é texto fixo.
- Footer: **"Cancelar"** / **"Executar"**.
- Ao selecionar **"Recusar registros"**: aparece **textarea "Justificativa*" INLINE no próprio drawer** (placeholder "Informe a justificativa da recusa"). Não há modal separado "Recusar registros" — o botão continua "Executar".
- Header checkbox da tabela: **tri-state** (`indeterminate=true`) com seleção parcial. ✓
- Fechar drawer pelo **X preserva a seleção** das linhas. ✓ (TC9)

## Confirmação + elegibilidade (onde o "ratio" realmente aparece)
Clicar **"Executar"** abre o modal **"Confirmação de ação em massa"** com a regra de elegibilidade embutida no texto:
- Aprovar: *"Aprovar {N} registro(s) selecionado(s)? Somente registros externos pendentes serão aprovados. Os demais serão ignorados. Tem certeza que deseja executar?"*
- Excluir: *"Excluir {N} registro(s) selecionado(s)? Somente registros externos não pendentes serão excluídos. Os demais serão ignorados. Tem certeza que deseja executar?"*
- Botões: **"Cancelar"** / **"Confirmar"**.
Resultado da ação = toast **genérico assíncrono** ("...em andamento" → "Ação em massa concluída"), **sem** o ratio `"{X} aprovados ({Y} ignorados)"`. O efeito real (quantos processados) é observável pelo **delta dos KPIs** / mudança de `situation`, não pelo texto do toast.

## Divergências produto × AT (findings — destinatário AT/QA Lead; NÃO esconder com fixme)
1. **TC2**: AT diz radio "Selecionados" **desabilitado** com 0 marcados + tooltip "Marque registros na tabela pra ativar" + default "Todos do filtro atual". **Produto**: "Selecionados" habilitado, é o default, sem tooltip. Labels sem `(N)`/`(M)`. Grupo é "Opção de envio", não "Opções". Select "Ação" tem default VAZIO.
2. **TC3/TC4**: AT espera toast com ratio (`"4 registros aprovados (3 ignorados...)"`). **Produto**: regra de elegibilidade no modal de confirmação + toast genérico. Validação real = delta de KPI / situação dos registros.
3. **TC5**: AT espera **modal separado** "Recusar registros" com botão homônimo. **Produto**: justificativa **inline no drawer** + "Executar" + modal "Confirmação de ação em massa".
4. **TC6**: AT espera AlertDialog destrutivo vermelho "Esta ação não pode ser desfeita." + "Você está excluindo **{N} registros**.". **Produto**: modal genérico "Confirmação de ação em massa — Excluir {N} registro(s) selecionado(s)? ...".
5. **TC7**: AT espera **banner amarelo** "Nenhum registro no escopo atende aos critérios pra essa ação." quando o escopo não tem elegíveis. **Produto**: banner NÃO existe; elegibilidade só no modal de confirmação. Botão "Aplicar" → na verdade "Executar".
6. Botão batch é **"Executar"** (AT: "Aplicar") + modal de confirmação obrigatório (AT não menciona).

## Massa (recon prévio 2026-06-22, org 37079)
- `by_status`: emitted ~79, pending ~32, expired 0, rejected 0. Pendentes QA11-* + Emitidos suficientes. Sem Expirados/Recusados pré-existentes.
- Setup de Pendentes externos via API: `data/records-api.ts` (`createPendingRecords`). Sem cleanup (convenção [[registros-externos-sem-cleanup-seed-persistente]]); markers únicos por run.
