---
name: twygo-agents-qa-repo
description: "Repositório oficial de QA da Twygo em ~/twygo-agents-qa (TypeScript + Playwright). Substitui ~/playwright-tests como ambiente canônico de automação. Branch ativa: project/recertificacao."
metadata: 
  node_type: memory
  type: project
  originSessionId: 7e2530b2-085d-4f07-bc91-78292c5ac775
---

Repositório oficial: `~/twygo-agents-qa` — branch `project/recertificacao`.
Stack principal: **TypeScript + Playwright** (não Python).

**Why:** Usuário confirmou que este é o repo oficial do time de QA Twygo. O repo `~/playwright-tests` (Python) foi usado antes mas é o workspace pessoal anterior — o canônico é este.

**How to apply:** Toda automação nova deve ser feita aqui. Ler o CLAUDE.md raiz + CLAUDE.md do sub-agente antes de qualquer ação.

---

## Estrutura (4 agentes)

| Agente | Pasta | Stack | Status |
|---|---|---|---|
| Tasks-QA (quebra de atividades) | `agent-tasks-qa/` | Python + Claude Code | ✅ Ativo |
| AT (Análise de Teste) | `agent-at/` | Python + Claude Code | ✅ Ativo |
| Playwright (E2E) | `agent-playwright/` | TypeScript + Playwright + Claude Code | ✅ Ativo |
| DB (validação banco) | `agent-db/` | Python + SQLAlchemy | 🚧 Esqueleto |

---

## Convenções críticas do agent-playwright

### Auth
- **Login URL:** `/users/login` (não `/login`)
- **Form:** campo `Login` (email), campo `Senha`, botão `Entrar`
- **Seletor:** `getByRole('textbox', { name: 'Login' })` — NÃO `getByLabel(/e-?mail/i)` (bate em checkbox `send_copy`)
- **Pós-login:** redireciona para `/play?menu_id=play` (não `/dashboard_students`)
- **storageState global:** `tests/setup/global-setup.ts` faz login 1× e salva `outputs/.auth/storage.json`. Specs NÃO fazem login — `playwright.config.ts` já consume `use.storageState`
- **Admin context:** navegar direto para `/o/{orgId}/...` (não precisa trocar perfil via UI)

### Test-IDs
- Atributo: `data-test-id` (com hífen), NÃO `data-testid`
- Já configurado em `playwright.config.ts` via `use.testIdAttribute: 'data-test-id'`

### Navegação
- **NUNCA** usar `page.goto(url)` direto em Page Objects Twygo
- **SEMPRE** usar `safeGoto(page, url)` de `agent-playwright/src/utils/modals.ts`
- `safeGoto` = `goto({ waitUntil: 'domcontentloaded' })` + `dismissCommonModals(page)`
- Modais oportunistas (NPS Sofia, "Continuar mesmo assim", "Modelo de página duplicado") bloqueiam o evento `load` se não tratados

### Dados e arquivos
- Constantes de domínio em `<test-case>.data.ts` adjacente ao spec — NUNCA inline no `.spec.ts`
- Page Objects em `projects/<slug>/pages/` (específico) ou `src/pages/` (genérico Twygo)
- Allure facade: `import * as allure from 'allure-js-commons'` (NÃO `allure-playwright`)
- `Locator` type: `import type { Locator } from '@playwright/test'`

### Regras duras
- `waitForTimeout` é proibido — sempre esperas baseadas em condição
- CSS/XPath só como último recurso com comentário justificando
- Cada `test()` independente — sem side-effect entre testes
- Credenciais só via `${VAR}` em `config/environment.json`

---

## Fluxo per-suite (dia-a-dia)

```bash
cd ~/twygo-agents-qa/agent-playwright
npm run agent:run -- --project <slug> --suite "<nome literal da suíte>"
```

## Skills disponíveis (agent-playwright)

Principais:
- `twygo-test-orchestrator` — orquestra planner/generator/healer
- `twygo-recon` — discovery de UI antes de gerar specs
- `fechar-modais-twygo` — safeGoto + dismissCommonModals
- `testar-filtro-drawer-twygo` — drawer Chakra com filtros
- `testar-toast-chakra-twygo` — toast Chakra empilhado
- `interagir-switch-chakra-twygo` — toggle/switch Chakra
- `provisionar-seed` — beforeAll/afterAll para dados de teste
- `limpar-dados-de-teste-twygo` — cleanup de estado persistente
- `gerar-bug-report-de-tc-red` — bug report estruturado por TC red
- `debugar-via-network-e-console` — diagnóstico por Network antes de chutar causa

Ver também: [[playwright-twygo-repo]], [[twygo-app-facts]]
