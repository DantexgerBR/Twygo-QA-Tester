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

## 4. Quando a prosa pede algo fora do escopo Playwright puro

| Cenário na prosa | O que fazer |
|---|---|
| "Verificar feature flag" | Não testar a flag em si; assumir o estado descrito em `<preconditions>` e logar a expectativa via `allure.parameter('feature_flag', '...')` |
| "Verificar comportamento mobile" | Usar `test.use({ viewport: ... })` + executar contra o viewport apropriado |
| "Verificar via API" | Out-of-scope para este agente. Logar `// TODO: API test em outro agente` e seguir |
| "Verificar comportamento de email/SMS" | Out-of-scope. Asserir no estado da UI imediatamente após o trigger e marcar `allure.tag('NEEDS_INTEGRATION_TEST')` |

## 5. Heurística de seletor (resumo da política `data-testid`)

Em ordem de preferência ao escolher seletor para qualquer ação/asserção:

1. `getByTestId('...')` — se o elemento tem `data-testid` no app.
2. `getByRole('...', { name: '...' })` — fallback semântico.
3. `getByLabel('...')`, `getByPlaceholder('...')`, `getByText('...')`.
4. CSS/XPath **apenas** como último recurso, com comentário justificando.

Se a prosa referencia um elemento que **não tem `data-testid`**, abrir
issue/comentário sugerindo PR de adição no código fonte da Twygo. Não
inventar CSS frágil para "fazer passar".
