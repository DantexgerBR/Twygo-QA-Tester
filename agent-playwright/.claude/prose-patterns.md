# Padrões de prosa TestLink → Playwright

A prosa em `<actions>` e `<expectedresults>` do XML TestLink é interpretada
pelo planner + generator do plugin oficial Playwright. Esta página documenta
os padrões PT-BR canônicos que a QA da Twygo usa, para que a geração seja
consistente entre executores.

> **Quando consultar**: o orquestrador (`twygo-test-orchestrator`) carrega
> esta página via Read antes de invocar o planner/generator. As regras aqui
> têm a mesma força das regras do `CLAUDE.md`.

## 1. Padrões de ação (prosa em `<actions>` → Playwright)

| Padrão de prosa | Playwright |
|---|---|
| "Acessar [URL]" / "Tentar acessar [URL]" | `await page.goto(url)` |
| "Acessar o menu/submenu '<X>'" | navegação via UI: `getByRole('menuitem', { name: 'X' }).click()` |
| "Clicar em / no / na '<X>'" (botão) | `getByRole('button', { name: 'X' }).click()` |
| "Clicar em / no / na '<X>'" (link) | `getByRole('link', { name: 'X' }).click()` |
| "Clicar [em/no/na] aba '<X>'" | `getByRole('tab', { name: 'X' }).click()` |
| "Preencher [campo] com '<valor>'" | `getByLabel('campo').fill('valor')` |
| "Selecionar '<opção>' em [dropdown]" | `getByLabel(...).selectOption('opção')` |
| "Marcar [checkbox/radio]" | `.check()` |
| "Fazer upload de '<arquivo>' em [campo]" | `.setInputFiles('arquivo')` |
| "Aguardar [tela/evento]" | `await expect(...).toBeVisible()` ou `waitForURL` — **nunca** `waitForTimeout` |

## 2. Padrões de asserção (prosa em `<expectedresults>` → Playwright)

| Padrão de prosa | Playwright |
|---|---|
| "[Elemento] é exibido / está visível" | `await expect(locator).toBeVisible()` |
| "[Elemento] NÃO é exibido / está oculto" | `await expect(locator).toBeHidden()` |
| "[Tela/Container] contém N [items]" | `await expect(locator).toHaveCount(N)` |
| "Sistema redireciona para [tela/URL]" | `await expect(page).toHaveURL(/.../) ` |
| "Mensagem '<X>' é exibida" | `await expect(getByText('X')).toBeVisible()` |
| "[Aba/Item] está selecionado / ativo" | `await expect(locator).toHaveClass(/active|selected/)` ou `.toHaveAttribute('aria-selected', 'true')` |
| "Texto contém '<X>'" | `await expect(locator).toContainText('X')` |
| "Coluna '<X>' é exibida com [conteúdo]" | duas asserções: header + amostra do conteúdo |

## 3. Quando a prosa é ambígua

Se o planner não consegue decidir entre dois mapeamentos plausíveis (ex.:
"Verificar a coluna 'Nome'" — verificar se existe? se tem dado? se está
ordenada?), aplique:

1. Optar pela **interpretação literal mais simples** (presença do header).
2. Adicionar comentário `// REVISAR: prosa ambígua "<texto original>"` no spec.
3. Marcar a annotation Allure: `await allure.tag('REVIEW_NEEDED')`.

Não invente asserções extras nem omita asserções por insegurança.

## 3.5. Padrões Super Admin (área `/admin`)

A prosa frequentemente diz "no Super Admin", "em Super Admin", "acessar Super
Admin", "tabela de preços", "editar contrato" — esses padrões se traduzem para
operações na rota `/admin` (validado em 2026-05-05). Pré-requisito: usuário
do `environment.json` precisa estar logado **e** em perfil "Administrador" da
organização. O `globalSetup` já cobre isso quando o user tem o perfil — não é
necessário trocar perfil pela UI.

| Padrão de prosa | Caminho / Helper canônico |
|---|---|
| "Acessar Super Admin" / "Em Super Admin" | `await page.goto('/admin')` ou `superAdminPage.openSuperAdmin()` |
| "Acessar a tabela de preços" / "Editar tabela de preços ativa" | `await page.goto('/admin/subscription_plans')` ou `superAdminPage.openSubscriptionPlans()`. Na lista, identificar a tabela com coluna "Ativo" = Sim e clicar em "Editar". |
| "Editar o contrato da organização <X>" | `await page.goto('/admin/edit_sys_subscription_settings/{orgId}')` ou `superAdminPage.openEditContract(orgId)`. orgId resolvido via `getOrgId()` ou `getEnvByName(<slug>).orgId` (valores em `.env`, referenciados por `environment.json`). |
| "Pesquisar pela organização" → "Editar/Visualizar" → "Aba Contratos" → "Editar contrato vigente" | `superAdminPage.navigateToOrgSubscriptions(orgIdOrName)` quando a prosa exige passar pela UI; caso contrário usar deep-link `openEditContract(orgId)`. |

**Organizações de referência**: valores reais (hosts, orgIds) vivem em
`.env` (gitignored) referenciados via `${VAR}` em `config/environment.json`.
Estrutura de envs / sufixos semânticos em
[`shared/twygo-platform.md §1`](../../shared/twygo-platform.md). NÃO
hardcodar orgId em spec ou comentário.

> Quando um caso de teste do XML pede operação Super Admin, **importe e use
> `SuperAdminPage`**; não invente seletores nem rotas. Se a prosa fala em
> ajustar a tabela de preços ativa (afeta TODAS as orgs), faça reverso ao
> final do teste — esse banco é compartilhado.

## 3.7. Padrões de API (TCs `Tipo: api` — request fixture)

A partir de CONTRACT.md v1.2 (2026-05-27), testes de API rodam no mesmo
agente em `tests/api/<suite>.spec.ts`, com `playwright test --project=api`
(sem browser). Quando TC declara `**Tipo**: api` no MD canônico, prosa
mapeia para `request` fixture + cliente HTTP em `projects/<slug>/api/`.

### Ações HTTP (prosa em `### Passos` → Playwright)

| Padrão de prosa | Playwright |
|---|---|
| "Preparar payload JSON `{...}`" | declarar constante em `<test-case>.data.ts` (NÃO inline no spec) |
| "Disparar `POST /api/v2/...`" / "Realizar `POST ...`" / "Enviar request POST" | `await client.<metodo>(payload, authHeaders)` (chamar método do `<Recurso>ApiClient`) |
| "Disparar `GET /api/v2/...`" | `await client.<getMethod>(params, authHeaders)` |
| "Autenticado com token de admin" / "Autenticado" | headers vêm de `await getApiAuthHeaders()` no `beforeAll` (skill `provisionar-token-api-twygo`) |
| "Desativar a feature flag `:<flag>` para a organização" (setup de TC api) | `await ensureFlipperActor(browser, {...enabled: false})` no `beforeAll` — `chromium.launch()` manual + `storageStatePath` (skill `testar-feature-flag-twygo`) |
| "Ativar a feature flag `:<flag>` para a organização" | mesma chamada, `enabled: true` |
| "Inspecionar o corpo da resposta" | `const body = await response.json()` + asserções abaixo |

### Asserções HTTP (prosa em `→` → Playwright)

| Padrão de prosa | Playwright |
|---|---|
| "Response retorna HTTP `<código>`" / "Retorna HTTP `<X>`" | `expect(response.status()).toBe(X)` |
| "Response retorna HTTP `<X>` ou `<Y>`" | `expect([X, Y]).toContain(response.status())` |
| "Body valida contra `schemas/<arquivo>.schema.json`" | `validateAgainstSchema<T>(body, schema, '<contexto>')` (skill `validar-schema-api-twygo`) |
| "Body contém [campo] com valor [X]" | `expect(body.<path>).toBe(X)` (após `validateAgainstSchema` — narrow type) |
| "Array de resultados: item A com sucesso, item B com erro" | `find()` por email + `expect(item.status).toBe(...)` por item |
| "Sem `error`" / "Sem erro" | `expect(item.error).toBeUndefined()` |
| "Erro estruturado contendo chave I18n `<key>`" | `expect(JSON.stringify(item.error)).toContain('<key>')` |
| "`participant_id` numérico atribuído" | `expect(item.participant_id).toBeGreaterThan(0)` |
| "Nenhum item com `error` referenciando feature flag" | `expect(JSON.stringify(item.error ?? {}).toLowerCase()).not.toContain('feature_flag')` |

### Imports canônicos

```ts
import { test, expect } from '@playwright/test';
import { <Recurso>ApiClient, type <Recurso>ResponseBody } from '../../api/<Recurso>ApiClient.js';
import { getApiAuthHeaders } from '../../../../src/utils/api-auth.js';
import { validateAgainstSchema } from '../../../../src/utils/schema.js';
import responseSchema from '../../schemas/<arquivo>.schema.json' with { type: 'json' };
import { <suiteSlug>Data as data } from './<suite-slug>.data.js';
```

### Anti-patterns específicos de API (proibidos em specs gerados)

| Anti-pattern | Errado | Certo |
|---|---|---|
| `request.post()` direto no spec | `await request.post('/api/v2/...', { data })` | `await client.<metodo>(data, authHeaders)` (regra dura #16) |
| Hardcodar payload no spec | `await client.create({ email: 'foo@x.com' })` | `await client.create(data.payloadTC1, authHeaders)` |
| Skip schema validation | `expect(response.status()).toBe(200)` + fim | `expect(...) + validateAgainstSchema(body, schema, ...)` (regra dura #15) |
| Hardcodar token | `{ Authorization: 'Bearer eyJ...' }` | `await getApiAuthHeaders()` |
| Misturar UI+API no mesmo TC | `await request.post(...) + await page.goto(...)` no mesmo `test()` | separar em 2 TCs no MD (`Tipo: ui` + `Tipo: api`) — CONTRACT.md §16 |

Skills detalhadas:
- [`testar-api-twygo`](../skills/testar-api-twygo/SKILL.md) (skill principal)
- [`provisionar-token-api-twygo`](../skills/provisionar-token-api-twygo/SKILL.md)
- [`validar-schema-api-twygo`](../skills/validar-schema-api-twygo/SKILL.md)

## 4. Quando a prosa pede algo fora do escopo Playwright puro

| Cenário na prosa | O que fazer |
|---|---|
| "Verificar feature flag" | Não testar a flag em si; assumir o estado descrito em `<preconditions>` e logar a expectativa via `allure.parameter('feature_flag', '...')`. **Em TCs `Tipo: api`** que precisam toggar a flag no setup, ver §3.7 (`ensureFlipperActor`) |
| "Verificar comportamento mobile" | Usar `test.use({ viewport: ... })` + executar contra o viewport apropriado |
| "Verificar via API" | **Mudou em v1.2**: agora em escopo. Se TC marcado `Tipo: api`, ver §3.7. Se TC `Tipo: ui` que precisa consumir API durante o teste (ex: `page.waitForResponse`), opcional validar schema |
| "Verificar comportamento de email/SMS" | Out-of-scope. Asserir no estado da UI imediatamente após o trigger e marcar `allure.tag('NEEDS_INTEGRATION_TEST')` |
| "Verificar via DB" / "Asserir registro no banco" | TCs `Tipo: db` → executor `agent-db` via subprocess (V2 do CONTRACT — manual hoje). TCs `Tipo: mixed` UI+DB → setup UI + invocação `agent-db` para asserção secundária |

## 4.5. Lendo dados do ambiente (host, orgId) — sem hardcode

Specs gerados **nunca** devem hardcodar host, orgId ou credenciais. Importe
de [src/utils/environment.ts](../src/utils/environment.ts):

```ts
import { getBaseUrl, getOrgId, getEnvByName, getEditContractPath } from '../../../../../src/utils/environment.js';

// rota com orgId do env atual
await page.goto(`/o/${getOrgId()}/ai_consumption_analysis?tab=settings`);

// usar baseURL de outro env (ex.: secundário "sem créditos")
test.use({ baseURL: getEnvByName('staging-without-credits').baseUrl });

// path canônico de "editar contrato" no Super Admin
await page.goto(getEditContractPath());
```

**Quando é OK ficar literal**: rotas que não dependem de env nem de org
(`/users/login`, `/play`, `/admin`, `/admin/subscription_plans`). Hosts e
orgIds, **nunca**.

Anti-pattern proibido (CLAUDE.md §7.6 B):
```ts
// ❌ proibido — host e orgId hardcoded
const BASE_URL = 'https://<host-real>.twygoead.com';
await page.goto(`${BASE_URL}/o/<orgId-real>/ai_consumption_analysis?tab=settings`);
```

## 5. Heurística de seletor (resumo da política `data-testid`)

Em ordem de preferência ao escolher seletor para qualquer ação/asserção:

1. `getByTestId('...')` — se o elemento tem `data-testid` no app.
2. `getByRole('...', { name: '...' })` — fallback semântico.
3. `getByLabel('...')`, `getByPlaceholder('...')`, `getByText('...')`.
4. CSS/XPath **apenas** como último recurso, com comentário justificando.

Se a prosa referencia um elemento que **não tem `data-testid`**, abrir
issue/comentário sugerindo PR de adição no código fonte da Twygo. Não
inventar CSS frágil para "fazer passar".
