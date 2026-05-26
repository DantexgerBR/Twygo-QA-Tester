# Dashboard - Visão do aluno

Switch de perfil para Aluno é feito via popover canto superior direito
(`ProfileSwitcher.switchToViaUrl('Aluno')`) — **não** requer credencial
nova nem storageState secundário. O mesmo user admin alterna entre
perfis. Ver skill [`trocar-perfil-twygo`](../../../../../.claude/skills/trocar-perfil-twygo/SKILL.md).

## Status dos 8 TCs (atualizado 2026-05-14)

| TC | Status esperado | Notas |
|---|---|---|
| Renderizar widget 'Resumo das atividades' | ✅ passa | Widget default do `/dashboard_students` |
| Renderizar widget 'Ranking' | ✅ passa | Widget default + heading "TOP 5 Pontos de experiência" |
| Renderizar widget 'Conteúdos em andamento' | ✅ passa | Widget default |
| Renderizar widget 'Meus certificados' | ✅ passa | Widget default |
| Renderização de widget sem customização | ✅ passa | Asserta default title visível + custom title hidden |
| Aluno acessa painel sem widgets | ✅ passa | Asserta empty-state admin não aparece em Aluno |
| Renderização de widget com customização | ❌ red intencional | **BLOCKED-BY-PRODUCT-BUG** `feedback_panel_layout_save_no_persist` |
| Exibição de um widget por aba | ❌ red intencional | **BLOCKED-BY-PRODUCT-BUG** `feedback_panel_layout_save_no_persist` |

## Os 2 TCs red (bug-produto, não bug-spec)

`widget-customizacoes-aplicadas` e `exibir-widget-por-aba` têm
`beforeAll` que **exercita o fluxo admin completo** (criar painel +
adicionar widget + customizar título/ícone OU 5 abas com widgets cada +
Salvar Layout + associar ao Modo de uso Aluno). Validado live via
chrome-devtools-mcp 2026-05-14 que **todos os clicks executam mas
"Salvar Layout" não dispara POST/PATCH** ao backend — abas/widgets
ficam só em React state e somem.

Consequência: spec entra no perfil Aluno via switch, clica no menu item
do painel customizado, painel renderiza vazio → asserção falha vermelha.
**Isso é o signal correto pro dev de produto** (Anti-pattern F do
CLAUDE.md §7.6 categoria "bug servidor"). Quando o bug for corrigido,
ambos passam sem mudança no spec.

Bug-report consolidado: `outputs/widgets/bug-reports/<gerado por agent:bug-reports>.md`.

## Cleanup

Cada TC tem `afterAll` que desassocia o menu item + deleta painel via
variants `*_safe` (idempotentes — no-op se já limpou). Cada TC tem
`afterEach` que reverte perfil pra Administrador via
`ProfileSwitcher.revertToAdminSafe()` (no-op se nunca navegou).
