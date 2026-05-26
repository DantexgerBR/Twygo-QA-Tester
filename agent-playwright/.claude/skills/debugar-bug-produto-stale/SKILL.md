---
name: debugar-bug-produto-stale
description: Diagnosticar spec marcado FAILING-BY-PRODUCT-BUG (ou equivalente) que continua red. Antes de cobrar dev, revalidar via API direta / MCP / curl que o sintoma documentado ainda acontece. Se sumiu (bug foi corrigido sem reabrir o spec), re-investigar — a causa atual pode ser outra. Vale também pra `test.fixme` legítimo "spec/XML desatualizado": o produto pode ter entregue a feature ausente desde o último audit.
version: 1.1.0
---

# debugar-bug-produto-stale

## Quando usar

Sempre que um spec com comentário `// FAILING-BY-PRODUCT-BUG`, `// BLOCKED-BY-PRODUCT-BUG`, `// BUG:` ou similar continuar vermelho numa rodada. Vale também pra `test.fixme` legítimo "seed ausente"/"flag off" — seed/flag podem ter sido criados sem ninguém abrir o spec de volta.

## Por que existe

Caso real Twygo widgets, 2026-05-11 → 2026-05-13:

- TC3 do `inativar-painel-associado-modal.spec.ts` tinha bloco grande documentando bug Rails: `app/models/use_mode_item.rb#title_for` → NoMethodError → GET /linked_menus 500. Comentário citava commit, runtime e payload — alta confiança.
- Entre 11/05 e 13/05 o servidor corrigiu silenciosamente. `GET /api/v1/o/{orgId}/panels/{panelId}/linked_menus` passou a responder 200.
- O spec continuou red, mas em fase diferente: agora era modal "Modelo de página duplicado" no `beforeAll`.
- Sem revalidar, o time gastaria tempo cobrando dev de um bug já fechado.

Caso real Twygo base-de-conhecimento, 2026-05-19 → 2026-05-24 (mais sutil — vale `test.fixme`, não só `FAILING-BY-PRODUCT-BUG`):

- TC1 e TC2 da suite "Extração de dados de repositórios" tinham `test.fixme` documentando: "botão Exportar não existe na listagem (confirmado live 2026-05-19 via chrome-devtools-mcp em /o/37007/knowledge_repositories)" e "filtro Categoria não existe no drawer (apenas Bases sem fontes e Bases sem recursos como filtros padrão)".
- 5 dias depois, **ambos os bloqueios sumiram**: o botão apareceu com label diferente do AT ("Extrair dados" + ícone `ios_share`, não "Exportar"), e o filtro Categoria virou acessível via modo "Novo" do drawer (uma das 8 colunas filtráveis em "Opções de filtro").
- Se ninguém tivesse rodado a skill, os TCs ficariam yellow em silêncio — o `fixme` "BLOCKED-BY-PRODUCT-BUG" gera barulho zero no relatório (Anti-pattern F enviezado: aqui o `fixme` era legítimo *na época*, mas virou stale).
- Bônus que apareceu na re-auditoria: `data-test-id="filter-control-open-button"` foi removido do produto entre as duas datas; POM atualizado pra `#open-filter`. Audit stale captura esse tipo de drift colateral que jamais aparece num relatório porque nenhum spec quebrou em verde.

## Checklist de diagnóstico

1. **Releia o comentário do spec.** Anote: endpoint citado, sintoma observável, payload/error esperado.
2. **Reproduza o endpoint direto** (não pelo Playwright). Use `curl`, MCP do navegador, ou Rails console — o que for mais barato:
   - `curl -H "Cookie: ..." https://<host>/api/v1/.../linked_menus -i` → confirma status code atual.
   - `mcp__plugin_chrome-devtools-mcp_chrome-devtools__list_network_requests` se já está com o navegador aberto.
3. **Compare**: status e payload reais bate com o que o comentário descreve?
   - Bate → bug ainda vivo. Reabra ticket, anexe o trace atual, mantenha spec red.
   - Não bate → bug corrigido. Vá pro passo 4.
4. **Reproduza só o spec failing** (não a suíte inteira) com `--headed --trace on` e capture a NOVA fase em que ele quebra. Comum: o cleanup/seed mudou, outro modal apareceu, payload mudou de shape.
5. **Atualize o comentário** do spec: nova data de validação, novo veredito (corrigido + nova causa, se houver). Se a nova causa é spec, conserte o spec. Se é outro bug, abra outro ticket.
6. **Não use `test.describe.fixme`** pra "esconder" enquanto investiga — comentário no topo + spec red é o ciclo que documenta o problema (Anti-pattern F do CLAUDE.md).

## Próximos passos

Se o diagnóstico revelar um padrão (ex.: spec ficou red por modal não previsto), considere:

- Adicionar gotcha em §7.5 do `agent-playwright/CLAUDE.md`.
- Adicionar race-handler no Page Object correspondente.
- Atualizar skill correspondente (ex.: `seletores-twygo-app`, `fechar-modais-twygo`).

## Anti-patterns

- ❌ Reabrir ticket de produto sem revalidar — barulho pro dev de produto.
- ❌ `test.fixme` em spec que era `FAILING-BY-PRODUCT-BUG` "só pra parar de chiar". Esconde do relatório.
- ❌ Apagar comentário antigo sem registrar o que mudou. A história do bug é parte da documentação operacional.
