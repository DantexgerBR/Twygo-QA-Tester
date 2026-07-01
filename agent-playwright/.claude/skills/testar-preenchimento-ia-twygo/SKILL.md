---
name: testar-preenchimento-ia-twygo
description: Padrão canônico para testar o card "Preencher com IA" (autofill) no form de registro externo do Twygo. Cobre o card gated por feature flag de IA (some quando desligada), upload de evidência via dropzone (input[type=file].last, não filechooser), o endpoint assíncrono /records/ai_fill (responde 204, processa depois — NÃO é 403 síncrono), como capturar o contrato SEM gastar crédito (interceptação+abort), o custo real de crédito por fill, e as divergências AT×produto já mapeadas. Use ao gerar/healear specs de Preenchimento com IA / crédito de IA, ou qualquer TC que acione autofill por IA num form.
version: 1.0.0
---

# testar-preenchimento-ia-twygo

## Quando usar

Ao gerar/healear specs do form "Adicionar registro de aprendizagem" que
envolvam o card **"Facilite seu trabalho com nossa IA"** / botão **"Preencher
com IA"** — suíte "Preenchimento com IA e crédito de IA" e afins.

## A tela e os seletores (recon live 2026-06-29, org 37093)

- Rota: `/o/${getOrgId()}/records/new` (heading "Novo conteúdo externo").
- Card de IA: título "Facilite seu trabalho com nossa IA"; disclaimer "A IA
  pode cometer erros, verifique as informações". **Use `getByText(..., { exact:
  false })`** — o título NÃO é um nó de texto isolado (card é um bloco único);
  `exact: true` não casa nada (erro comum que gera falso-vermelho).
- Botão: `getByTestId('records-form-ai-autofill-button')`, nasce **disabled**;
  habilita só após upload de evidência.
- POM de referência: `projects/registros-externos/pages/AiAutofillPage.ts`;
  switch de IA: `AiSettingsPage.ts`.

## Upload de evidência (dropzone — NÃO usa filechooser)

A "Evidência de aprendizagem" é uma dropzone ("Arraste o arquivo ou clique
para selecionar"). O `page.waitForEvent('filechooser')` **NÃO dispara** no
click. Há 2 `input[type=file]` na página: o 1º é o chat (`message_attachments`);
o **último** é a evidência. Padrão canônico:

```ts
await page.locator('input[type=file]').last().setInputFiles(pdfPath);
await expect(autofillButton).toBeEnabled({ timeout: 30_000 }); // store_archive é async
```

Fixture: `projects/registros-externos/data/fixtures/certificado_ia.pdf` (PDF
mínimo válido). Endpoint do upload: `POST /api/v1/o/{org}/records/store_archive`.

## O endpoint de IA é ASSÍNCRONO (gotcha central)

`POST /api/v1/o/{org}/records/ai_fill` body `{ archive_ids:[...], website }`
responde **204 (aceito)** — NÃO 403/200 síncrono. O processamento (LLM) roda
depois e é **lento e não-determinístico** (recon: >70s ainda em loading com PDF
sintético). Implicações:

- **NÃO** asserça preenchimento visual de campos + toast verde como sinal
  load-bearing — vira flaky (viola "confiança por minuto"). Asserça o contrato
  determinístico: click → `waitForResponse(ai_fill)` → `status < 300`. Deixe o
  outcome visual em `test.fixme` (addressee dev/infra: latência da IA stage).
- O modelo da AT de "403 síncrono quando sem feature/crédito" **não existe**
  neste build → `fixme` (reconciliar AT×produto, matriz F).

## Capturar o contrato SEM gastar crédito

Em recon/probe, intercepte e **aborte** a chamada — você lê URL/método/payload
e o back nunca processa (zero crédito):

```ts
await ctx.route('**/records/ai_fill', r => r.abort());
```

Para o caminho de **erro** (TC de timeout/erro), mocke com 500 — também sem
custo: `page.route('**/records/ai_fill', r => r.fulfill({ status: 500, body: '{}' }))`.
Toast de erro REAL do produto: **"Não foi possível preencher os campos com IA"**
/ "Houve uma instabilidade momentânea. Você pode completar os campos
manualmente ou tentar novamente em instantes." (a AT dizia outro texto).

## Gating por feature de IA

Switch em `/o/{org}/ai_consumption_analysis?tab=settings`:
`getByTestId('ai-consumption-analysis-settings-ai-access-switch-' + getOrgId())`
(`data-checked` presente = ON). Estado persistente compartilhado → **togglar
sempre com revert no `afterAll`** (contexto fresco, [[limpar-dados-de-teste-twygo]]).

**Comportamento real com IA OFF**: o card de IA é **gated off** — some inteiro
do form (NÃO "card visível com botão desabilitado", como a AT modelava). Asserça
ausência: `expect(cardTitle()).toHaveCount(0)`.

Não há afordância no admin da org para **zerar crédito** (a aba "Política de
créditos de IA" é só tabela informativa) nem **sparkle de crédito na TopBar**
(não existe neste build) → TCs de "sem crédito"/"sparkle" são `fixme`
(addressee QA Lead/infra/produto).

## Custo de crédito — rodar com parcimônia

Cada fill REAL consome 1 crédito. Use `test.describe.configure({ retries: 0 })`
e rode 1× só. Recon/diagnóstico deve usar abort/mock (zero crédito). Nunca
coloque um fill real em loop ou em teste que faz retry.

## Anti-patterns (resumo)

- ❌ `getByText(titulo, { exact: true })` → use `exact: false`.
- ❌ `waitForEvent('filechooser')` no dropzone → use `input[type=file].last()`.
- ❌ asserir 403 síncrono / preenchimento visual determinístico → é 204 async.
- ❌ assumir perfil "Aluno" no popover (org 37093 só tem Administrador + Lider
  de equipe) → `fixme` por credencial ausente se o TC exige visão Aluno.
