# Recon — QA 1.12 "Renderizar versão publicada de forma assíncrona" (#R12)

**Data**: 2026-06-09 · **Org**: 37061 (`staging-novo-estudio`) · **Curso**: 807533
"Construindo times de alta performance" (23 itens: 12 top-level + sub) ·
**Modo**: read-only (NÃO clicou "Publicar" — evita render real no curso
compartilhado).

## Pergunta do recon

A suíte 1.12 (12 TCs) parte toda de **"clicar 'Publicar alterações' dispara
job assíncrono"**. Existe esse gatilho na UI do Estúdio?

## Achado: o gatilho de publicação NÃO existe na UI

Varredura exaustiva (botões + links + menuitems, por texto E `aria-label`,
mais busca de texto em qualquer nó do DOM):

| Verificação | Resultado |
|---|---|
| `getByText(/Publicar/i)` em qualquer nó | **0 ocorrências** |
| `role=button "Publicar altera…"` | 0 |
| `getByText("Salvar como novo")` (#R16) | **0** |
| `getByText("Visualizar como aluno")` | 1 ✅ |
| `getByText(/\bSalvar\b/)` | 1 (save do form de atividade) |
| texto "renderiz…" na página | 0 |

A AT (catálogo, linha ~90) esperava **4 botões no topo** do Estúdio: "Salvar",
"Publicar alterações", "Salvar como novo", "Visualizar como aluno". Só
**"Visualizar como aluno"** existe. Botões reais encontrados: abas do curso,
"Adicionar", "Recolher lista", "Ir", "Concluir geração com IA" (preview),
"Recalcular progresso", "Recalcular pontuação", "Visualizar como aluno".

Screenshot: `outputs/novo-estudio/recon-1.12-estudio.png`.

## Corroboração

- **"Salvar": 1 / "Publicar": 0** → consistente com build de **save direto**
  (sem ciclo rascunho→publicar). O form de atividade salva na hora; não há
  etapa de publicação de versão.

## Ressalva honesta (não fechada por recon read-only)

O recon NÃO prova que o botão não apareceria **após uma edição pendente**
(gating por dirty-state). Contra-indício: já há 10 atividades com badge de
pendência e 11 "Bloqueada" no curso, e ainda assim 0 "Publicar" — mas
`pending-artifacts` (geração IA incompleta) e `status-locked` não são o mesmo
que "conteúdo editado aguardando publicação". A confirmar com o dev se existe
gating por edição não coberto aqui.

## Veredito (a alinhar com João Miguel Gorski — solicitante)

**#R12 sem affordance de publicação na UI da 37061 em 2026-06-09.** Os 12 TCs
da suíte são inexecutáveis por ausência do gatilho — **não implementado nesta
entrega** (NÃO é bug). #R12 é P2 no Discovery, e a RN 46.1 prevê render mesmo
sem #R8 — portanto a ausência não se explica pela dependência de #R8; a causa
fica com o dev. TC10 (logs) já estava ⛔ bloqueado na própria AT.
