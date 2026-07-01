# Recon — Extração de dados e evidências (assíncrona com modal de atenção)

> Recon ao vivo 2026-06-23 no env `staging-registros-externos`
> (`registrosf2.stage.twygoead.com`, org 37079, 361 registros:
> 253 emitted / 14 expired / 81 pending / 13 rejected). Usuário = Admin.

## Toolbar (tela Admin `/o/37079/records`)

| Elemento | Seletor estável | Texto |
|---|---|---|
| Botão extrair | `getByTestId('records-extraction-button')` | "ios_share Extrair dados" (ícone + label) |

## Drawer "Configurações da extração" (`.chakra-modal__content.chakra-slide`)

| Elemento | Seletor estável |
|---|---|
| Fechar (X) | `getByTestId('records-extraction-drawer-close')` |
| Select "Tipo de extração" | `getByTestId('records-extraction-type-select')` — `<select>` NATIVO, opções "Dados" / "Evidências" |

### Branch "Dados" (default)
Grupos de radio (inputs sem testid; usar `name`+`value` ou label visível):

| Grupo (label) | `name` | valores (`value` → label) |
|---|---|---|
| Formato* | `exportFormat` | `csv` → "CSV (tabela)" · `pdf` → "PDF (tabela e gráficos)" |
| Dados (linhas)* | `data` | `filtro_atual` → "Filtro atual" · `todos` → "Todos" |
| Colunas* | `columns` | `filtro_atual` → "Filtro atual" · `todas` → "Todas" |

Footer:
| Botão | Seletor estável |
|---|---|
| Cancelar | `#drawer-data-export-cancel` |
| Extrair | `#drawer-data-export-export` (type=submit) |

> ⚠️ **Divergência AT**: TC2 diz Colunas = "Filtro atual" / **"Todos"**; a UI real
> mostra **"Todas"** (feminino, concorda com "Colunas"). Specs assertam o texto real.

### Branch "Evidências"
Selecionar "Evidências" no select substitui Formato/Linhas/Colunas por **um único grupo "Escopo"**:

| Elemento | Seletor estável |
|---|---|
| Escopo "Filtro atual" | `getByTestId('records-extraction-evidences-scope-current')` (value `filtro_atual`) |
| Escopo "Todos" | `getByTestId('records-extraction-evidences-scope-all')` (value `todos`) |
| Cancelar | `getByTestId('records-extraction-evidences-cancel')` |
| Extrair | `getByTestId('records-extraction-evidences-submit')` |

Texto auxiliar no drawer: "Você receberá um e-mail e uma notificação no sino quando a
extração estiver pronta. Os links de download expiram em 7 dias."

## Comportamento real observado (≠ AT — BETA parcialmente implementado)

Validado em 3 passes de recon com a lista hidratada antes de interagir:

1. **Dados → "Extrair" (`#drawer-data-export-export`) é INERTE**: o click é
   registrado (HubSpot rastreia `_hs_element_id=drawer-data-export-export`), mas
   **nenhuma chamada `/api/v1/...` dispara**, **nenhum toast aparece** e o **drawer
   permanece aberto**. Não há flash "Sua extração está sendo processada.". → afeta
   **TC4** e **TC7** (que dispara Dados). Sintoma de handler de submit não conectado
   no frontend (um worker quebrado ainda POSTaria e receberia erro — aqui é zero rede).

2. **Evidências → "Extrair" dispara `201 POST /api/v1/o/37079/subscription_attachments_exports`**
   e **fecha o drawer** — backend OK. Porém **NÃO exibe toast** "Extração iniciada: ..."
   e **NÃO exibe o modal "Atenção"** mesmo com 361 registros no escopo (muitos sem
   evidência anexada, já que evidência é opcional). → afeta **TC5** (modal ausente),
   **TC6** (toast ausente) e **TC7** (toast/sino ausente).

3. **Endpoint real ≠ hipótese AT**: a AT supôs `POST /learning_records/export`; o real
   para evidências é `POST /api/v1/o/{org}/subscription_attachments_exports` (201). O
   endpoint de extração de **dados** não foi observado (botão inerte).

### Consequência para o design da suíte
- **TC1/TC2/TC3/TC9** — UI do drawer existe e é validável (verde esperado).
- **TC4/TC5/TC6** — assertam o comportamento AT (toast/modal). Vão **falhar vermelho**
  com comentário de causa-raiz no topo (Anti-pattern F: não esconder bug de produto
  com `fixme`). O dev lê o vermelho + comentário e sabe o que conectar.
- **TC7** — dispara + tenta achar a notificação no sino (bounded wait); e-mail é etapa
  manual. **TC8** — 100% manual (volume + caixa de e-mail) → `test.fixme` legítimo
  (verificação manual, não bug escondido).
