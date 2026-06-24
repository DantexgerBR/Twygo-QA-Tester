# [bug-produto] Validar combinação de 2 filtros + busca textual (combinatória mínima) — TC10

> _Categoria confiança: **alta** — gap de feature confirmado por recon ao vivo (3 passadas) + cruzamento com a Discovery (RN 63–66)._
> _Gerado em 2026-06-24T13:26:50Z · commit 9da2a1c_

## Identificação
- **Suite**: Filtros via drawer e personalização de colunas (DnD)
- **TC**: TC10 — Validar combinação de 2 filtros + busca textual (combinatória mínima)
- **Spec**: `projects/registros-externos/tests/features/filtros-drawer-personalizacao-colunas-dnd/tc10-combinacao-2-filtros-mais-busca-textual.spec.ts`
- **RNs cobertas**: 13.3, 64, 70 · **Origem do contrato**: Discovery RN 64 (#R18)
- **Status na execução**: ⊘ ignorado (`test.fixme`) — bloqueado pela ausência do recurso descrito abaixo
- **Prioridade do caso (AT)**: high

## Ambiente
- **Env**: staging-registros-externos (`https://registrosf2.stage.twygoead.com/`)
- **OrgId**: 37079 (org principal)
- **Usuário**: richard.sebold@twygo.com (perfil Administrador)
- **Browser**: chromium
- **Build/commit do agente**: 9da2a1c · **Recon**: 2026-06-23

## Incidente identificado / Descrição
A tela Admin "Aprendizagem > Registros" **não disponibiliza os "Filtros padrão"** no drawer
de filtros. O grupo "Filtros padrão" (que pela Discovery RN 64 deveria ser a view default,
já aberta, com 4 filtros radio) renderiza **vazio**, exibindo o texto genérico
**"Não há filtros nessa seção."** — o mesmo dos grupos "Filtros compartilhados" e
"Meus filtros". `radioCount = 0` (nenhum `[role="radio"]` no `[role="radiogroup"]`).

Como o TC10 valida a **combinatória mínima do contrato 1.1** — interseção de
_filtro padrão_ + _colunas personalizadas_ + _busca textual_ — e o primeiro critério
(aplicar o filtro padrão **"Válidos"**) é impossível, o cenário inteiro fica inexequível.

Isto não é um defeito do spec nem flakiness: é um **gap de entrega** do recurso de
filtros padrão/salvos (RN 63–66) no build atual. Afeta também TC1 (parcial), TC3, TC4 e TC5
da mesma suíte.

## Como reproduzir
**Pré-condições**: logado como Administrador na org 37079 (storageState pré-logado).

1. Acessar `https://registrosf2.stage.twygoead.com/o/37079/records` (Aprendizagem > Registros).
2. Clicar no botão **"Filtro"** da toolbar (`#open-filter`). → Drawer "Lista de filtros" abre à direita.
3. Observar o grupo **"Filtros padrão"** (aberto por default, `#expand-default-filters`).

➡️ **Resultado observado**: o grupo mostra **"Não há filtros nessa seção."** — não há os
radios Válidos/Expirados/Pendentes/Recusados, nem ícone de info, nem botão de duplicar.

(Passos 4+ do TC10 — aplicar "Válidos", desmarcar coluna "Criado por", buscar "Coursera",
"Limpar filtro" — não podem ser executados porque dependem do passo 1.)

- **Taxa de reprodução**: 3/3 passadas de recon (determinístico — empty state deliberado da UI).

## O que era esperado
Pela **Discovery RN 64 (#R18)** e pela AT (TC2/TC10):

- O grupo **"Filtros padrão"** deve vir aberto por default com **4 filtros radio = atalhos dos KPI**:

  | Filtro | Filtra por status | Extras (RN 64) |
  |---|---|---|
  | **Válidos** | Emitido | tooltip info (`FiInfo cursor=help`) + duplicar (`MdContentCopy` → toast "Em breve") |
  | **Expirados** | Expirado | idem |
  | **Pendentes** | Pendente | idem |
  | **Recusados** | Recusado | idem |

- Fluxo esperado do TC10:
  1. Aplicar o filtro padrão **"Válidos"** pelo drawer → lista filtra para registros válidos
     (Emitidos); botão "Filtro" fica sólido com sufixo **"(1)"** (RN 63.1).
  2. Abrir "Filtro rápido", desmarcar a coluna **"Criado por"** e aplicar → tabela some com a
     coluna, mantendo o filtro "Válidos" ativo (RN 70).
  3. Buscar **"Coursera"** → lista exibe apenas registros **Emitidos do provedor "Coursera"**
     (interseção dos 3 critérios); colunas personalizadas permanecem (RN 13.3).
  4. Clicar **"Limpar filtro"** → filtro padrão removido; busca permanece; lista mostra todos
     os registros "Coursera".

- Empty states corretos dos outros grupos (RN 64), que **também divergem** no build:
  - "Filtros compartilhados" → _"Em breve — filtros criados pela equipe vão aparecer aqui."_
  - "Meus filtros" → _"Em breve — filtros que você criar ou duplicar ficam aqui."_
  - (build mostra "Não há filtros nessa seção." nos três.)

## Evidência técnica
- **Recon**: `projects/registros-externos/inputs/recon-filtros-drawer-personalizacao-colunas-dnd.md`
  (seção "Divergências AT × produto") — `radioCount = 0`, empty state literal capturado nas 3 passadas.
- **Seletores verificados**: `#open-filter` abre o drawer; `#expand-default-filters` /
  `#expand-shared-filters` / `#expand-my-filters` presentes, mas com corpo
  `"Não há filtros nessa seção."`; nenhum `[role="radiogroup"] [role="radio"]`.
- **Sem erro de Network/Console** associado — o grupo renderiza o empty state intencional
  (não é falha de fetch); reforça "feature não cabeada", não "dados ausentes".
- **Report da suíte**: `outputs/registros-externos/reports/filtros-via-drawer-e-personalizacao-de-colunas-dnd_20260624-101412/` (TC10 = ⊘).

## Impacto
- **Bloqueia** a cobertura combinatória mínima do contrato 1.1 (TC10).
- Mesma causa-raiz bloqueia **TC3** (busca interna da lista de filtros), **TC4** (pending dos
  radios) e **TC5** (sincronização KPI ↔ drawer) e degrada **TC1** (não dá pra aplicar filtro
  padrão para exercer o estado ativo "(N)").
- O recurso de **filtros por status** segue acessível pela faixa de **KPI cards** (suíte
  "KPI cards como filtro de status (Aluno)") — então é a via do **drawer** que está faltando,
  não o conceito de filtrar por status.

## Próximas ações sugeridas
- **Destinatário**: Time de Produto / Dev (entregar RN 63–66) com validação da AT/QA Lead.
- Confirmar se "Filtros padrão" está fora do escopo desta leva (BETA) ou é regressão; se for
  fora de escopo, alinhar a AT (TC1–TC5, TC10) para refletir o que o build entrega hoje.
- Ao entregar o recurso, os specs já existentes (TC3/TC4/TC5/TC10 hoje `test.fixme` + TC1)
  destravam removendo o `fixme` — a intenção de cada um já está codificada.
