---
name: recon-visual
description: Reconhecimento visual opt-in via playwright-mcp para extrair textos literais de protótipos navegáveis (Figma, FigJam, qualquer URL pública renderizável). NÃO acessa ambiente Stage — recon de Stage é responsabilidade do agent-playwright durante execução. Gera output/recon-visual.md consumido pelo /generate-md-canonical para preencher os catálogos do MD canônico (textos literais, modais, dropdowns). Use quando o projeto tem protótipo navegável — opcional mas reduz drasticamente // REVISAR-FIGMA na AT.
disable-model-invocation: true
allowed-tools: Read Write Bash Glob Grep
---

# Recon Visual — extrai textos literais de protótipos navegáveis

## Escopo (decisão 2026-05-19)

Esta skill cobre **apenas protótipos navegáveis** (Figma, FigJam, etc.).
Recon de ambiente **Stage real** é responsabilidade do `agent-playwright`
durante a execução (skill `twygo-recon`).

**Por quê separar**: ATs podem ser produzidas ANTES do projeto estar em
Stage apto para testes. A AT precisa ser baseada em documentação +
protótipo (fonte autoritativa de design), não em implementação em
construção.

## Quando usar

Use SEMPRE que o projeto tem **protótipo navegável** (URL pública ou
acessível sem login):
- Figma Make / Figma Embed
- FigJam públicos
- POCs hospedadas (Vercel, GitHub Pages, etc.)
- Qualquer protótipo HTML/JS renderizável no Chrome

**Pular o recon** leva a AT com `// REVISAR-FIGMA` nos catálogos, o que
faz o agent-playwright marcar `// REVISAR` durante geração e exige
intervenção manual. Recon prévio reduz isso para ~zero.

## Pré-requisitos

- `.mcp.json` do agent-at declara `playwright` MCP server com flag
  **`--headless`** (regra dura — janela visível não pode abrir)
  ```json
  "args": ["-y", "@playwright/mcp@latest", "--headless"]
  ```
- Chrome instalado (o `@playwright/mcp` usa por baixo)
- Node 20+ (já necessário pelo agent-playwright)
- URL do protótipo no `project.config.json` (campo `figmaPrototype`)

**Headless é obrigatório** — feedback do usuário 2026-05-19: janela
visível durante automação rouba foco e atrapalha. Confirmação na skill
[`feedback_browser_headless`](../../../../shared/twygo-platform.md)
(memória persistente).

## Onde no fluxo

Etapa **2.5** do `/analyze-test` (entre `read-docs` e o planejamento da
estrutura). Pode rodar isoladamente: `/recon-visual --project <slug>`.

## Fluxo da skill

### 1. Identificar fontes disponíveis

Ler `projects/<slug>/project.config.json`:
- Campo `figmaPrototype` (URL do protótipo) — obrigatório para esta skill
- Se não houver: abortar com mensagem clara e pular para próxima etapa
  do `/analyze-test`

### 2. Capturar protótipo

```
mcp__playwright__browser_navigate(url=<figmaPrototype>)
mcp__playwright__browser_wait_for(time=8)  # Figma SPA precisa carregar JS
mcp__playwright__browser_snapshot()  # accessibility tree completa
```

A `browser_snapshot` retorna árvore com todos `role` + `name` + `text`
visíveis. Salvar em buffer.

**Para múltiplas telas/frames do protótipo**:
- Usar `browser_click` em links/botões de navegação interna do
  protótipo (se houver indicação de fluxo)
- Usar `browser_press_key` para `ArrowRight` / `ArrowLeft` se o
  protótipo for slideshow-style
- Capturar `browser_snapshot` de cada tela navegável
- Tentar `browser_take_screenshot` em paralelo para anexar evidência
  visual

**Limites conhecidos**:
- Figma Make tem SPA pesada — esperar ≥ 8s antes do primeiro snapshot
- Algumas telas podem estar atrás de hover/click — explorar até cobrir
  os fluxos da planilha QA
- Se snapshot vier vazio ou parcial após esperas razoáveis: documentar
  como falha do recon e seguir com `// REVISAR-FIGMA` no MD canônico
- Não loga em nada — protótipo não exige autenticação

### 3. Capturar telas-chave (lista mínima para CRUD Twygo típico)

- [ ] Submenu/menu lateral (com o item da feature visível)
- [ ] Tela de listagem completa (colunas, botões, filtros)
- [ ] Tela vazia / empty state (se o protótipo simular)
- [ ] Formulário de criação — TODAS as abas se houver
- [ ] Formulário de edição (se diferente do criação)
- [ ] Drawer de filtros (se aplicável)
- [ ] Cada modal único (confirmar exclusão, alterações pendentes, etc.)
- [ ] Estados de erro/validação (campo obrigatório vazio etc.)
- [ ] Estados de sucesso (toast visível) — se protótipo simular

### 4. Estruturar `output/recon-visual.md`

Formato canônico (consumido por `/generate-md-canonical`):

```markdown
# Recon Visual — <Nome do Projeto>

> Gerado por /recon-visual em <ISO-8601>.
> Fonte: <figma_url>
> Tela(s) capturada(s): <N>
> Limitações: <listadas>

## 1. Hierarquia de navegação
- Menu lateral: "<X>" → submenu "<Y>"
- Breadcrumb: "<A> > <B> > <C>"

## 2. Textos literais por tela

### Listagem
- Título da página: "..."
- Botão de criação: "..."
- Botão filtros: "..."
- Botão exportar: "..."
- Colunas: ["...", "...", ...]
- Ações por linha: ["Editar", "Excluir", ...]
- Empty state: "..."

### Formulário — Aba <Nome>
- Campos:
  | Label | Tipo | Obrigatório | Limite | Placeholder |
  |---|---|---|---|---|
  | Nome | input | Sim | 255 | "..." |
- Botões: "Salvar", "Cancelar"

[... outras telas]

## 3. Modais detectados

### "Confirmar exclusão"
- Header: "..."
- Body: "..."
- Botões: "Cancelar" / "Excluir"

[... outros]

## 4. Toasts e mensagens

### Sucesso
- "Repositório criado com sucesso"

### Erro
- "Nome é obrigatório"

## 5. Opções de dropdowns

### Campo "Categoria"
- "Opção A"
- "Opção B"

## 6. Notas e limitações do recon

- Tela X não foi capturada — protótipo não tinha navegação para ela.
- Modal Y mencionado na Discovery mas não aparece no protótipo — flagar.
- Strings em <idioma> — confirmar i18n.

## 7. Divergência protótipo vs Discovery

| Item | Discovery diz | Protótipo mostra | Resolução |
|---|---|---|---|
| ... | ... | ... | Seguir protótipo (mais recente) |
```

### 5. Validação pós-recon

- Conferir que cobre as suítes principais da planilha QA
- Cada catálogo do MD canônico (Textos literais, Modais, Dados de teste)
  consegue ser preenchido com base no recon
- Se há gaps grandes: documentar e seguir; `/generate-md-canonical`
  marcará `// REVISAR-FIGMA` apenas onde recon não cobriu

## Boas práticas

- **Não interagir com Stage real** — fora de escopo. Stage é problema
  do `agent-playwright/.claude/skills/twygo-recon/`
- **Não modificar estado do protótipo** — só ler (não exportar do
  Figma, não logar em conta Figma, não baixar arquivos)
- **Capturar screenshots além do accessibility snapshot** (
  `browser_take_screenshot`) — útil para anexar como evidência visual
  do recon
- **Encerrar o browser ao final** (`browser_close`) — libera recursos
- **Limitar tempo** — se recon não progride após 5 telas tentadas,
  documentar e parar

## O que esta skill NÃO faz

- Não acessa Stage / ambiente real (responsabilidade do
  `agent-playwright`)
- Não gera o MD canônico (isso é `/generate-md-canonical`)
- Não testa nem valida funcionalidade (isso é agent-playwright)
- Não preserva estado entre execuções — re-roda do zero a cada
  invocação
- Não substitui `/read-docs` (Discovery + planilha continuam fontes
  primárias; recon visual é complemento de detalhamento UI)

## Referências

- [CONTRACT.md §4-5](../../../../CONTRACT.md) — catálogos do MD canônico
- [.mcp.json](../../../.mcp.json) — registro do playwright-mcp
- [agent-playwright/.claude/skills/twygo-recon/SKILL.md](../../../../agent-playwright/.claude/skills/twygo-recon/SKILL.md) — skill análoga no Playwright (para Stage durante execução de specs)
