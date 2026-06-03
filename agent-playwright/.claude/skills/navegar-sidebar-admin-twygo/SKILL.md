---
name: navegar-sidebar-admin-twygo
description: Padrão canônico de navegação no sidebar admin Twygo — escopar com `#menu` (sidebar duplica desktop/mobile), `dispatchEvent('click')` em parent expanders sem href (Aprendizagem, Configurações, Processos, Skills), e rota `/o/{orgId}/dashboard` em vez de `/play` que é dashboard Aluno.
when_to_use: |
  - Spec falha com strict-mode "resolved to 2 elements" em link de sidebar
  - Spec falha esperando expandir item parent (Aprendizagem, Configurações)
  - Spec falha em `/play` esperando ver sidebar admin
  - AT (test-analysis.md) escreve "Acessar /play" em TC admin
  - Antes de adicionar/editar Page Object que navega via sidebar
triggers:
  - "sidebar"
  - "strict mode violation"
  - "menu lateral"
  - "Aprendizagem"
  - "Configurações"
  - "/play"
  - "/o/{orgId}/dashboard"
  - "resolved to 2 elements"
  - "#menu"
  - "dispatchEvent"
  - "parent expander"
---

# Navegar sidebar admin Twygo

Skill consolidada (2026-06-01) que fundiu 3 anteriores:
- `clicar-parent-expander-sem-href-twygo`
- `escopar-sidebar-menu-twygo`
- `navegar-admin-dashboard-twygo`

Razão: as 3 cobrem aspectos do mesmo container (`#menu`) — leitor
precisava abrir 3 arquivos pra ter contexto completo.

## Os 3 problemas do sidebar Twygo

### 1. Dashboard Aluno vs Admin (`/play` ≠ `/o/{orgId}/dashboard`)

Após login, Twygo redireciona pra `/play?menu_id=play` por default
(perfil Aluno landing). **Esse dashboard NÃO tem sidebar admin** —
não tem "Aprendizagem", "Usuários", "Configurações", etc.

Sintoma:
```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log: waiting for locator('#menu a#learning')
```

Causa: tela mostra dashboard Aluno (cards "Meus Cursos / Comunidades").
Sidebar admin só aparece em `/o/{orgId}/...`.

✅ **Padrão**: `safeGoto(page, /o/${getOrgId()}/dashboard)` — admin direto.

`/play` é correto APENAS para: tests de visão Aluno, fluxo de login,
ou switch de perfil via popover (vide [[trocar-perfil-twygo]]).

### 2. Sidebar duplicado (desktop + mobile) → strict-mode

Twygo renderiza sidebar em **duas versões simultâneas no DOM** com o
**mesmo id**:
- Desktop: dentro de `#menu`
- Mobile/colapsado: fora de `#menu`

Sintoma:
```
Error: strict mode violation: getByRole('link', { name: /Modelos de conteúdo/ })
  resolved to 2 elements:
    1) <a id="content_models" href="/o/37007/content_models">...</a>
    2) <a id="content_models" href="/o/37007/content_models">...</a>
```

✅ **Padrão**: SEMPRE escopar com `#menu`:
```ts
await page.locator('#menu a#content_models').click();
```

❌ **Anti-pattern** `.first()`: pega primeiro no DOM (geralmente desktop),
mas frágil se ordem mudar. E esconde o sinal informativo "tem
duplicidade aqui".

### 3. Parent expanders sem `href` (Aprendizagem, Configurações, ...)

Items parent do sidebar são `<a id="learning">` **SEM atributo href**:

```html
<a id="learning" name="learning" class="item-submenu-flex">
  <span>school</span>
  Aprendizagem
</a>
```

Implicações:
- **ARIA não considera link**: `<a>` sem href é `role="generic"`, não
  `role="link"`. `getByRole('link')` falha.
- **Twygo intercepta o click** via JS pra expandir submenu. Click
  padrão Playwright trava (overlay invisível / state machine).

Sintomas:
```
1) TimeoutError: getByRole('link', { name: /Aprendizagem/ }) — locator não encontra
2) locator resolved + click trava em 30s
```

✅ **Padrão**: `dispatchEvent('click')`:
```ts
await page.locator('#menu a#learning').dispatchEvent('click');
await expect(page.locator('#menu a#content_models')).toBeVisible({ timeout: 10_000 });
```

`dispatchEvent` despacha evento sintético direto no elemento — React
handler escuta normalmente. Não passa por hit-test do browser.

❌ **Anti-pattern** `click({ force: true })`: também trava em alguns
casos. Force ignora actionability check mas ainda envia evento de
mouse real — handler sensível a coordenadas/hit-test pode falhar.

## Catálogo de IDs do sidebar admin (validados live)

| Item | id | href | É parent expander? |
|---|---|---|---|
| Dashboard | `dashboard` | `/o/{orgId}/dashboard` | Não |
| **Aprendizagem** | `learning` | (sem href) | **SIM** — `dispatchEvent` |
| Conteúdos | (TBD) | `/o/{orgId}/events?tab=events` | Não |
| Modelos de conteúdo | `content_models` | `/o/{orgId}/content_models` | Não |
| Base de conhecimento | (TBD) | `/o/{orgId}/knowledge_repositories` | Não |
| Usuários | (TBD) | `/o/{orgId}/users` | Não |
| **Configurações** | (TBD) | (sem href provável) | **SIM** — `dispatchEvent` |
| Aparência | (TBD) | `/o/{orgId}/appearance` | Não |
| **Skills** (BETA) | (TBD) | (sem href provável) | **SIM** — `dispatchEvent` |
| **Processos** | (TBD) | (sem href provável) | **SIM** — `dispatchEvent` |

Expandir conforme novos projetos cobrirem áreas do sidebar.

## Page Object pattern unificado

```ts
// projects/<slug>/pages/<Page>.ts (ou src/pages/TwygoSidebar.ts genérico)
async gotoAdminDashboard(): Promise<void> {
  await safeGoto(this.page, `/o/${getOrgId()}/dashboard`);
}

async expandSidebarSection(parentId: 'learning' | 'configuracoes' | 'skills' | 'processos'): Promise<void> {
  await this.page.locator(`#menu a#${parentId}`).dispatchEvent('click');
}

async clickSidebarItem(itemId: string): Promise<void> {
  await this.page.locator(`#menu a#${itemId}`).click();
}

async navigateToArea(area: string): Promise<void> {
  // Atalho: skip sidebar, vai direto pra rota admin.
  await safeGoto(this.page, `/o/${getOrgId()}/${area}`);
}
```

## Implicação pro AT

Quando AT escreve:
> "1. Acessar a URL `/play` → Dashboard padrão é exibido"

em TC ADMIN, **patchar o AT** pra refletir realidade:
> "1. Acessar a URL `/o/{orgId}/dashboard` → Dashboard admin é exibido"

CONTRACT.md: MD canônico é fonte de verdade.

## Quando NÃO usar esta skill

- Spec testa **visão Aluno** (Meus Cursos, Cursos, dashboard de
  aluno) → `/play` é correto.
- Spec testa **fluxo de login** (`tests/auth/`) → `/play` é correto
  como destino pós-login.
- Spec testa **alternância de perfil** via popover (canto superior
  direito) → ver [[trocar-perfil-twygo]].

## Anti-patterns

### A. `getByRole('link', { name: /Aprendizagem/ })`
❌ ARIA não considera `<a>` sem href como link. Falha em parent
expanders.

### B. `getByText('Aprendizagem')` sem `#menu` ancestor
❌ Duplica entre desktop/mobile, strict-mode violation.

### C. `.first()` pra resolver strict-mode
❌ Esconde sinal informativo. Frágil a reorders. Usar `#menu` ancestor.

### D. `click({ force: true })` em parent expander
❌ Trava em vários casos. `dispatchEvent('click')` é o canônico.

### E. Hardcode de `nth(0)` / `nth(1)` em items duplicados
❌ Frágil a reorders no DOM.

## Histórico

- **2026-05-13**: descoberta inicial — projeto Modelos AT inferiu
  `/play` em TC admin. Spec falhou. Fix em Page Object.
- **2026-05-20**: catalogada estrutura completa do sidebar admin
  durante recon do projeto Modelos.
- **2026-06-01**: 3 skills fundidas em uma (audit do monorepo
  identificou cluster sobreposto).

## Cross-links

- [[criar-spec-resiliente-twygo]] — princípios anti-flakiness
- [[debugar-via-network-e-console]] — antes de inferir "click silenciou"
- [[trocar-perfil-twygo]] — alternar perfil via UI no popover
- [[evitar-reinventar-resolvidos-twygo]] — antes de mexer em TwygoSidebar Page Object
