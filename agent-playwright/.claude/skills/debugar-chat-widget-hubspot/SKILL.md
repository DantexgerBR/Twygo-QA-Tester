---
name: debugar-chat-widget-hubspot
description: O widget HubSpot Chat (`<iframe id="hubspot-conversations-iframe" data-test-id="chat-widget-iframe">` num container `widget-align-right` no canto inferior direito) ocasionalmente intercepta clicks em botões do app — mesmo botões longe do canto. O error log mostra `<iframe ... id="hubspot-conversations-iframe"> from <div role="region" class="widget-align-right" aria-label="Widget de chat" id="hubspot-messages-iframe-container">...subtree intercepts pointer events`. Use quando spec falhar com timeout em click e o trace mencionar `hubspot-messages-iframe-container` ou `chat-widget-iframe` no subtree de interceptação.
when_to_use: |
  - Spec falha com `locator.click: Timeout` e trace cita `hubspot-conversations-iframe`
  - Call log mostra `subtree intercepts pointer events` apontando `widget-align-right`
  - Click em botão distante do canto inferior direito falha sem motivo aparente
triggers:
  - "hubspot-conversations-iframe"
  - "chat-widget-iframe"
  - "hubspot-messages-iframe-container"
  - "widget-align-right"
  - "Widget de chat"
  - "subtree intercepts pointer events"
  - "HubSpot Chat"
version: 1.0.0
---

# debugar-chat-widget-hubspot

## Sintoma canônico

Click em botão do app trava 30s com call log apontando o iframe HubSpot como
interceptor:

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('[data-test-id="panel-layout-save-button"]')
    - locator resolved to <button type="button" data-test-id="panel-layout-save-button">Salvar Layout</button>
  - attempting click action
    2 × waiting for element to be visible, enabled and stable
      - element is visible, enabled and stable
      - scrolling into view if needed
      - done scrolling
      - <iframe ... id="hubspot-conversations-iframe" data-test-id="chat-widget-iframe"
              src="https://app.hubspot.com/conversations-visitor/...">
        from <div role="region" class="widget-align-right" aria-label="Widget de chat"
              id="hubspot-messages-iframe-container">…</div> subtree intercepts pointer events
    - retrying click action (× 48 times)
```

O HubSpot Chat é um produto de terceiros injetado no Twygo (carregado via
script `hs-script-loader`) que renderiza um botão fixo no canto inferior
direito. Em alguns layouts, o container `widget-align-right` se expande
visualmente além do botão e intercepta pointer events de áreas inesperadas.

## Por que acontece (causa raiz)

1. **HubSpot injeta tarde**: o script carrega após `DOMContentLoaded` e
   inicializa o iframe ~2-5s depois. Specs rápidos clicam antes do iframe
   estabilizar, mas Playwright detecta a presença e tenta evitar overlap.
2. **`hubspot-messages-iframe-container` tem z-index alto**: `position:
   fixed; z-index: 1000000` (literal). Cobre **qualquer** botão que coincida
   pelo bbox, mesmo invisível.
3. **Auto-expand em hover**: ao hover ou load, o container pode expandir
   pra ~400×600px ocupando mais área que o botão visual.

## Workarounds (em ordem de preferência)

### 1. `force: true` no click crítico (recomendado pra spec específico)

```ts
// projects/widgets/tests/features/.../some.spec.ts
await step("Clicar 'Salvar Layout'", async () => {
  await painelForm.waitForToastsToClear();
  await painelForm.getSaveLayoutButton().click({ force: true });
});
```

`force: true` bypassa actionability check (incluindo overlap com iframe).
Tradeoff: perde a verificação de "elemento realmente clicável" — use só
quando você sabe que o overlap é falso positivo (botão visível, alvo
correto).

### 2. Route block no domínio HubSpot (recomendado pra ambiente CI/regressão)

```ts
// tests/setup/global-setup.ts (ou em beforeAll do spec se isolado)
await context.route(/.*hubspot\.com.*|.*hs-scripts\.com.*/, (route) => route.abort());
```

Bloqueia o load do script HubSpot — o iframe nunca renderiza, nenhum overlap.
Tradeoff: testes não validam que o app convive com HubSpot ativo. Pra CI
isolado é fine; pra QA exploratório que valida UI real, evite.

### 3. Aguardar HubSpot estabilizar antes de interagir

```ts
async waitForHubSpotReady(timeout = 5000): Promise<void> {
  const chatBtn = this.page.locator('[data-test-id="chat-widget-iframe"]');
  await chatBtn.waitFor({ state: 'attached', timeout }).catch(() => {});
}
```

Espera o iframe existir no DOM. Não previne o overlap, mas reduz a janela
onde o HubSpot ainda está layoutando.

## Detecção rápida

Em qualquer falha de click com timeout, busque `hubspot` no error context:

```bash
grep -l "hubspot-messages-iframe-container\|hubspot-conversations-iframe" \
  outputs/<slug>/test-artifacts/*/error-context.md 2>/dev/null
```

Se aparece em ≥2 specs no mesmo run, considere route block global.

## Anti-patterns

- ❌ **`page.locator('#hubspot-messages-iframe-container').click()` pra
  fechar o chat antes de clicar no botão real** — abre o chat (ironicamente).
- ❌ **`page.evaluate(() => document.getElementById('hubspot-messages-iframe-container').remove())`** —
  funciona, mas fragil: HubSpot pode re-injetar após timeout, e modifica DOM
  do app (poluição de teste).
- ❌ **CSS hack `[id^="hubspot"] { display: none !important }`** via
  `page.addStyleTag` — works, mas é "esconder problema do produto". Se
  HubSpot tá no canto fixo do design, esconder distorce o teste E2E real.
- ❌ **Re-tentar o click N vezes sem `force:true`** — Playwright já tenta
  retry interno (48× no exemplo). Mais retries = mais tempo, mesmo resultado.

## Quando o workaround NÃO basta

Se `force:true` resolve mas o spec valida algo no canto inferior direito
(ex.: botão "Voltar ao topo", footer flutuante), a sobreposição é REAL e o
teste precisa lidar:

1. Reportar como **bug do produto** (issue Twygo): HubSpot z-index muito alto
   ou container expandindo demais.
2. Skill `fechar-modais-twygo` cobre modais oportunistas — HubSpot poderia
   ganhar uma entrada lá se o time decidir adicionar dismiss via "X" do
   chat na rotina.

## Padrões observados em Twygo

- **Frequência**: HubSpot intercepta em ~5% dos clicks na suíte
  "Editar/Excluir widgets" (1 de 6 testcases, mas reprodutível).
- **Específico de project**: envs `staging-widgets` e
  `staging-without-credits` carregam HubSpot. O `staging` principal varia.
- **Botões mais afetados**: "Salvar Layout" (canto superior direito do
  painel form — bbox pode tocar o container HubSpot expandido), "Voltar
  ao topo" se existir.

## Por que esta skill existe

2026-05-11, suíte "Editar/Excluir widgets" do projeto widgets — TC5
("Excluir widget") falhou com 30s timeout no click "Salvar Layout". O
error log apontou o iframe HubSpot como interceptor (não o toast Chakra que
também estava presente — esse era 2º na cadeia). Fix: `force:true` no click
crítico, evitar o overlap.

Sem esta skill, o próximo QA que ler o trace vai gastar ~10min descobrindo
que o overlap é com HubSpot e não com algum elemento Twygo. Com a skill,
direto pro workaround (`force:true` + comentário WHY). Diagnóstico em ~1min.

## Anti-pattern relacionado (CLAUDE.md §7.6)

Quando você adiciona `click({force:true})` por causa do HubSpot, **adicione
comentário WHY** (anti-pattern D inverso — esse comentário tem motivo):

```ts
// Toast "Widget adicionado" + chat HubSpot interceptam click — usar force.
await painelForm.getSaveLayoutButton().click({ force: true });
```

Sem comentário, healer futuro pode remover o `force:true` ("parece
desnecessário"), reintroduzindo a falha.
