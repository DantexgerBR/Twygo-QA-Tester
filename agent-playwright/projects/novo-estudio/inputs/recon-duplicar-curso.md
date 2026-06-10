# Recon — QA 1.16 "Duplicar curso a partir do Estudio" / "Salvar como novo" (#R16)

**Data**: 2026-06-09 · **Org**: 37061 · **Curso**: 807533 · **Card**: 19720 ·
**Modo**: read-only.

## Achado: o gatilho "Salvar como novo" NÃO existe na UI

| Verificação | Resultado |
|---|---|
| `getByText("Salvar como novo")` | **0** |
| `getByText("Publicar")` | 0 |
| `getByText("Duplicar")` | 0 |
| "menu secundário" no topo do Estúdio | inexistente (só abas + "Voltar" + "Abrir copiloto") |

Controles do topo: itens do sidebar + abas do curso (Identificação…Atividades)
+ "Voltar" + "Abrir copiloto". Nenhum botão/menu de duplicação. (As 2
ocorrências de "cópia" são títulos de atividades, não um controle.)

Screenshot: `outputs/novo-estudio/recon-1.16-estudio.png`.

## Veredito (a alinhar com João — solicitante)

**#R16 não implementado nesta entrega** (não é bug) — #R16 é **P3 "se der
tempo"** no Discovery. Todos os 12 TCs partem do botão "Salvar como novo",
inexistente → suíte inteira inexecutável. Coerente com o #R12 (mesma ausência
de "Publicar alterações"/menu secundário do topo). 12 specs gerados em
`test.fixme [feature-ausente]`; quando o botão existir, remover o fixme.
**Execução**: 12 skipped.
