---
name: debugar-via-network-e-console
description: Ao diagnosticar qualquer bug/erro de UI Twygo, abrir DevTools Network + Console ANTES de chutar causa. Filtro por endpoint + status. Frontend Twygo frequentemente engole respostas 4xx/5xx silenciosamente — sintoma é "click sem efeito" mas o servidor já gritou na network. Skill define ritual e checklist.
version: 1.0.0
---

# debugar-via-network-e-console

## Quando usar

Sempre que aparecer um destes sintomas durante teste manual OU automated:

- "Click no botão/switch não faz nada"
- "Formulário não submete"
- "Tela mostra dado antigo após save"
- "Spec falha em poll esperando state mudar"
- "Toast/modal não aparece quando deveria"
- "Tela em branco após navegação"

O reflexo errado: chutar locator/timing/seletor. O reflexo certo: **abrir Network + Console antes de tocar no código**.

## Por que existe

Caso real Twygo widgets, 2026-05-13:

- TC1/TC2/TC4 falhavam em `toggleActiveByName` — switch "Ativo?" click não mudava state.
- Hipóteses iniciais sem network: banner BETA sobreposto, React onChange quebrou, Chakra Switch hidden, viewport, storage state divergente, painel órfão sem associação.
- Tempo gasto investigando essas hipóteses: ~1h.
- Quando o usuário abriu Network e mandou o payload:

  ```
  PATCH /api/v1/o/{orgId}/panels/{panelId}/change_status
  Status: 422 Unprocessable Content
  Body: {"message":"A validação falhou: Descrição não pode ficar vazio(a)"}
  ```

  Causa raiz **gritou** em 5 segundos. Backend exigia description, painel criado sem description, frontend engolia 422 silencioso.

- Custo de NÃO ter checado Network primeiro: 1h de hipóteses erradas.
- Custo de ter checado: 5s.

A regra é dura: **suspeita de bug de UI Twygo? Network + Console PRIMEIRO. Sempre. Não passa do segundo minuto sem ter olhado.**

## Checklist canônico de diagnóstico

Quando o sintoma aparece, execute na ordem (não pula passos):

### Passo 1 — Abrir DevTools

- F12 ou Ctrl+Shift+I
- Tab **Network** + tab **Console** abertos simultaneamente
- Network: filtra por **Fetch/XHR** (não HTML/CSS/JS — esses só poluem)
- Console: filtra severidade `Error` + `Warning` (esconde info/log)

### Passo 2 — Reproduzir a ação com Network gravando

- Ação humana: clica no botão, submete form, etc
- Olha a Network: que request saiu?
- Status do request: 2xx? 4xx? 5xx? **Sem request?**
- Se NÃO saiu request → frontend não disparou onChange/onClick. Diagnóstico: locator/event handler problem (clip-0×0, overlay, pointer-events:none).
- Se saiu request 2xx → backend OK, problema é UI não reagindo ao response. Diagnóstico: state management, cache stale, response shape mudou.
- Se saiu request 4xx/5xx → **backend rejeitou**. Diagnóstico: payload, validação, permissão. **Frontend Twygo engole essas respostas frequentemente.**
- Se saiu request **pending** que nunca completa → backend travou ou request cancelado. Cheque se houve `net::ERR_ABORTED` (ctx.close prematuro).

### Passo 3 — Para cada request relevante: ver payload e response

- Click no request → tab **Response** ou **Preview**
- Anote: URL completa, método, status code, body JSON
- Especialmente para 4xx/5xx: **leia a mensagem de erro**. Backend Twygo retorna PT-BR útil:
  - `{"message": "Validation failed: ..."}` ou `{"errors": {"field": ["..."]}}`
  - Se mensagem é específica (ex: "Descrição não pode ficar vazio(a)"), causa raiz está no payload mandado.

### Passo 4 — Cross-check com console

- Console mostra erros JS que UI engoliu?
- `Unhandled promise rejection`?
- Erros de hidration React? Cors?
- Warnings de prop-types ou validação form?

### Passo 5 — Só agora, formular hipótese

Com payload + response em mãos, hipótese vira diagnose. Sem isso, vira chute.

## Como aplicar em testes automated

### Playwright

Tem 3 ferramentas built-in que automatizam essa skill:

1. **`page.on('request')` + `page.on('response')`** — captura tudo, log no terminal:
   ```ts
   page.on('response', (r) => {
     if (r.status() >= 400) console.warn(`[HTTP ${r.status()}] ${r.url()}`);
   });
   ```
2. **Trace viewer**: `npx playwright show-trace outputs/.../trace.zip` → tab Network mostra tudo. Use sempre antes de chutar fix.
3. **Fixture exploratória do agente** (`src/fixtures/exploratory-fixture.ts`): já grava HTTP 4xx/5xx automaticamente em `exploratory-findings.json`. **CHECAR esse arquivo é parte do diagnóstico.**

### chrome-devtools-mcp

Tem ferramentas correspondentes:

- `list_network_requests({ resourceTypes: ['xhr', 'fetch'] })` — lista todos os XHR
- `get_network_request({ url: '...' })` — detalhes de 1 request
- `list_console_messages()` — console errors

**Uso típico ao debugar live**:
```
1. mcp.navigate_page(...)
2. mcp.click(<botao>)
3. mcp.list_network_requests({ resourceTypes: ['xhr', 'fetch'] })
4. mcp.list_console_messages()
5. Decide hipótese
```

## Gotchas Twygo conhecidos via Network

Padrões recorrentes que esta skill ajuda a pegar rápido:

| Sintoma UI | Network mostra | Causa | Fix front/back |
|---|---|---|---|
| Switch não toggle | `PATCH .../change_status → 422 "Descrição não pode ficar vazio(a)"` | Backend valida description global no update | Backend: dedicate `change_status` sem validar description geral. Workaround front: criar painel sempre com description default. |
| Botão Salvar engole click | `POST /panels → 500 NoMethodError nil.title` | Bug em `use_mode_item#title_for` translations | Backend fix. Comentar spec como `FAILING-BY-PRODUCT-BUG` com link da issue. |
| Indexação não muda | sync alert visível na tela + `PATCH /environments/:id → 200 sem mudança` | Sync alert deixa container aria-disabled mas backend recebe e descarta | Aguardar sync terminar OU usar `.click({ force: true })` |
| Modal "Nada por aqui" | `GET /panels/:id/linked_menus → 500` | Bug servidor `title_for` (caso histórico — corrigido 2026-05-13) | Backend fix. |

Esses 4 padrões cobrem ~70% dos bugs vistos em diagnóstico de QA Twygo nos últimos meses. **Sempre olhe Network primeiro.**

## Anti-patterns

- ❌ "O click não funcionou, vou trocar de seletor" — sem checar Network. 50% das vezes o seletor está OK; o problema é o response 4xx engolido.
- ❌ Confiar em screenshot do `error-context.md` apenas — screenshot é estado final, não mostra o que o backend disse.
- ❌ Ignorar logs do `exploratory-findings.json` — o agente já gravou HTTP 4xx/5xx ali. **Sempre cheque.**
- ❌ "Bug intermitente" sem capturar 1 ocorrência com Network — sem evidência de payload, qualquer fix vira chute.
- ❌ Acreditar que `status 200` significa "deu certo" — Rails `update` (não bang) volta 200 mesmo com validação falhada. **Leia o body.**

## Ritual em 1 frase

> **Antes de chutar causa de bug de UI, abre DevTools. Network + Console. 5 segundos olhando body do request. Aí sim formula hipótese.**

## Skills relacionadas

- `debugar-bug-produto-stale` — quando comentário FAILING-BY-PRODUCT-BUG do spec já existe, revalidar via API/Network se sintoma ainda ocorre
- `twygo-triage-report` — Network findings entram no relatório de triagem batch
