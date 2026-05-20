---
name: navegar-admin-dashboard-twygo
description: `/play` é o dashboard ALUNO do Twygo (Meus Cursos, Cursos, Trilhas) — NÃO tem sidebar admin com "Aprendizagem", "Usuários", "Configurações". Admin context exige navegar pra `/o/{orgId}/dashboard`. AT (test-analysis.md) frequentemente diz "/play" na prosa de TCs admin — isso reflete redirect pós-login default, não o lugar onde admin testa. Use ao gerar/healear spec Twygo que faz fluxo admin (qualquer coisa que precise do sidebar Aprendizagem ou rotas `/o/{orgId}/...`).
version: 1.0.0
---

# navegar-admin-dashboard-twygo

## Sintoma

Spec falha em step "clicar Aprendizagem no menu lateral" com timeout no locator. Screenshot mostra dashboard com cards "Dashboard / Meus Cursos / groups Comunidades / Editar / Cancelar inscrição / Cancelar assinatura" — esse é o **dashboard ALUNO**, não admin.

```
TimeoutError: locator.click: Timeout 30000ms exceeded.
Call log:
  - waiting for locator('#menu a#learning')
```

(Locator `#menu a#learning` não existe na visão Aluno.)

## Causa

- Após login, Twygo redireciona para `/play?menu_id=play` por **default** (perfil Aluno landing).
- Sidebar Aluno tem: Dashboard, Meus Cursos, Cursos, Trilhas, Comunidades, etc. **Sem "Aprendizagem"**.
- Sidebar Admin tem: Dashboard, **Aprendizagem** (Conteúdos, Modelos de conteúdo, ...), Usuários, Configurações, etc. Só acessível em `/o/{orgId}/...`.

Per CLAUDE.md §7.5 (agent-playwright):
> Não precisa "trocar perfil Administrador" via UI — basta navegar direto pra `/o/{orgId}/...`

## Padrão canônico

```ts
// ✅ Certo — admin dashboard
await safeGoto(page, `/o/${getOrgId()}/dashboard`);

// ✅ Certo — direto pra rota admin (skip dashboard)
await safeGoto(page, `/o/${getOrgId()}/content_models`);

// ❌ Errado — leva pra dashboard Aluno, sem Aprendizagem
await safeGoto(page, '/play');
```

## Quando `/play` é correto

- Specs testando o **dashboard de Aluno** (TCs de visão Aluno, widgets de aluno, listagem de cursos publicados).
- Specs testando o **fluxo de login do app** (`tests/auth/`).
- Specs testando navegação entre perfis via popover (skill [[trocar-perfil-twygo]]).

Para TODOS os outros testes admin, use `/o/{orgId}/dashboard` ou rota direta.

## Implicação para o AT

Quando AT (agent-at) escreve prosa do tipo:
> "1. Acessar a URL `/play` → Dashboard padrão é exibido"

Em testes ADMIN, isso reflete **a expectativa do redator** (post-login do user), não o lugar onde o teste deve estar. AT canônico deve preferir:
> "1. Acessar a URL `/o/{orgId}/dashboard` → Dashboard admin é exibido"

Quando o AT divergir, **patchar o AT** (per CONTRACT.md, MD canônico é fonte de verdade).

## Page Object pattern

```ts
// projects/<slug>/pages/SomePage.ts
async gotoAdminDashboard(): Promise<void> {
  await safeGoto(this.page, `/o/${getOrgId()}/dashboard`);
}

async gotoFeatureArea(area: string): Promise<void> {
  await safeGoto(this.page, `/o/${getOrgId()}/${area}`);
}
```

## Como descobrir as rotas admin

Se a URL não é óbvia (ou o AT inferiu errado — ver [[validar-urls-recon-vs-at]]):

1. Navegar pra `/o/{orgId}/dashboard` admin
2. Inspecionar sidebar via recon ou DevTools
3. Capturar `href` dos `<a>` items terminais
4. Catalogar IDs (ver [[escopar-sidebar-menu-twygo]] §Catálogo)

## Histórico do achado

Caso real (2026-05-20, projeto modelos):
- AT inferiu URL `/play` na prosa TC1 "Acessar listagem via submenu Aprendizagem"
- Spec gerado falhou — locator do sidebar Aprendizagem não existe em `/play` (Aluno)
- Fix: trocar `gotoPlay()` pra `goto(`/o/${getOrgId()}/dashboard`)` no Page Object
- AT canônico atualizado pra refletir realidade (4 ocorrências de "/play" → "/o/{orgId}/dashboard")

## Relacionado

- [[escopar-sidebar-menu-twygo]] — sempre escopar com `#menu`
- [[clicar-parent-expander-sem-href-twygo]] — clicar Aprendizagem exige `dispatchEvent`
- [[trocar-perfil-twygo]] — alternar perfil via UI quando spec testa visão Aluno especificamente
- [[validar-urls-recon-vs-at]] — recon deveria validar URLs do AT antes de gastar planner
