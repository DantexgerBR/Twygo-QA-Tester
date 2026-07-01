---
name: debugar-mcp-config-cache
description: Diagnóstico para quando o MCP playwright-test falha em planner_setup_page/generator_setup_page com erro de env/config (ex. "Variável de ambiente X referenciada mas não definida") mesmo depois de você corrigir project.config.json ou .env. O servidor MCP carrega/cacheia a config no boot e NÃO recarrega quando os arquivos mudam — fica "preso" na config antiga e não dá pra reiniciar de dentro da sessão. Use quando setup_page erra de forma idêntica antes e depois da sua correção, ou quando o erro cita um env que você já trocou.
version: 1.0.0
---

# debugar-mcp-config-cache

## Sintoma

`mcp__playwright-test__planner_setup_page` (ou `generator_setup_page`) falha com
algo como `Failed to load config: Variável de ambiente "TWYGO_..._EMAIL"
referenciada em config/environment.json (env "X") mas não definida` — e o erro
sai **byte-idêntico** mesmo depois de você editar `project.config.json` (trocar
o `environment`) ou preencher o `.env`.

## Causa raiz

O servidor MCP `playwright-test` é um **processo longo** que carrega o
`playwright.config.ts` + `project.config.json` **uma vez, no boot**, e cacheia
(há `cachedProjectSlug`/config cache em `src/utils/environment.ts`). Edições
nos arquivos **não** são relidas pelo processo já rodando. E **não há como
reiniciar o MCP de dentro da sessão** (é gerenciado pelo harness).

Diferença diagnóstica chave: **processos frescos funcionam, o MCP não.**

## Checagem (5s)

1. Rode um processo FRESCO com a config nova:
   `PROJECT=<slug> npx playwright test --list` (ou `npm run agent:smoke`).
   - Se passa/erra diferente → sua correção está certa; o problema é só o MCP cacheado.
   - Se erra igual → o problema é a config/.env mesmo (não é cache).
2. Se confirmado cache do MCP: o `setup_page` vai continuar quebrado a sessão
   inteira. Não adianta repetir.

## Fix / contorno

- **Não dá pra reiniciar o MCP de dentro da sessão.** Em vez de insistir no
  planner/generator do MCP:
  - **Recon**: rode um **script Playwright standalone** (`npx tsx script.ts`)
    que usa `chromium.launch()` + `newContext({ storageState })` — processo
    fresco, lê a config nova, autentica pelo storageState do globalSetup.
    Lembre: em script standalone o `getByTestId` usa `data-testid` (sem hífen);
    o app Twygo usa `data-test-id` → use CSS `[data-test-id="..."]`.
  - **Geração de specs**: autore os `.spec.ts`/POMs **à mão** (espelhando uma
    suíte existente) a partir dos achados do recon; valide com `npm run typecheck`.
  - **Execução**: `npx playwright test` (processo fresco) funciona normalmente.
    Veja [[debugar-mcp-playwright-env]] para o caso correlato de env do MCP.
- Para o usuário corrigir de vez: reiniciar a sessão/IDE recarrega o MCP com a
  config nova (mas em geral não vale interromper o trabalho — o contorno acima
  resolve).

## Caso real (2026-06-29)

`project.config.json` do projeto `registros-externos` apontava pro env morto
`staging-registros-externos` (sem creds no `.env`); o real era
`staging-registros-edu`. Corrigi o `project.config.json`, mas o MCP seguiu
errando idêntico (citando `externos`). `npx playwright test --list` fresco já
usava `edu` → confirmou cache do MCP. Segui por script de recon + autoria
manual de specs + execução via `npx playwright test`. As 2 suítes saíram sem
nunca usar o planner/generator do MCP.
