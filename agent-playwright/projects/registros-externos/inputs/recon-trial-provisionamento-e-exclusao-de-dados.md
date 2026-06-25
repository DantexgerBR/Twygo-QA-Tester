# Recon — suíte Trial (provisionamento e exclusão de dados)

> Recon live 2026-06-25 via Playwright MCP contra `trial-registros-externos`
> (org **37078**, host `registrostrial.stage.twygoead.com`). Login real
> `richard.sebold@twygo.com`. **Não-destrutivo** — nenhum "Excluir" confirmado.

## Estado da Trial

- Trial **já provisionada e operante** (banner: "Você ainda tem 362 dias
  para testar a Twygo"). Contém seed completo da SophiaTech.
- **Feature "Registros de Aprendizagem" presente e operante** — item de
  menu lateral "Registros BETA" → `/o/37078/records`.

## TC1 — feature Registros via URL (runnable)

Rota admin: `/o/37078/records`.

- Tabs: **`Registros`** (selected) e **`Provedores`** — `getByRole('tab', { name: 'Registros' })` / `'Provedores'`.
- Faixa de KPI cards: **Emitidos 76 · Expirados 0 · Pendentes 12 · Recusados 0** (`Carga horária total: 76 horas`).
- Seed SophiaTech presente — registros de `vanessa@sophia.tech.com.br`,
  `carla@sophia.tech.com.br`, `julia@sophia.tech.com.br` (origem "Interno").
- Ações da listagem: **`+ Adicionar`** (`/o/37078/records/new`), `Filtro`,
  `ios_share Extrair dados`, `Ações em massa`, busca
  "Pesquise por pessoa, conteúdo ou provedor".

> Reuso: o fluxo "criar registro Externo" e o POM de Registros já estão
> cobertos por suítes existentes do projeto (ex.: `RegistrosAdminPage`,
> `data/records-api.ts`). TC1 = navegar + validar feature + criar 1 registro.

## TC3 / TC4 — exclusão via widget Sophia (DESTRUTIVO)

Entry point confirmado em **`/dashboard_students`** (NÃO aparece em
`/records` nem `/play` — só HubSpot chat no canto inf. direito nessas rotas).

Widget Sophia (popover "Oi, eu sou a Sophia. Posso ajudar?") expõe as opções:
`Primeiros passos`, `Configurar aparência`, `Criar curso`,
`Cadastrar usuários`, `Ativar recursos de IA`, `Academia Twygo`,
`Fale com a gente`, `Falar via chat`, `Agendar demonstração`,
`Contratar a Twygo`, **`Excluir informações`** ← alvo TC3/TC4.

Seletores canônicos em skill `testar-exclusao-dados-trial-twygo` §Seletores
(modal com 4 checkboxes: SophiaTech / Admin-conteúdo / Admin-usuários / Tudo;
botões `Excluir` vermelho + `Cancelar`).

**⚠️ Destrutivo e irreversível**: confirmar "Excluir" zera a Trial. Há **1
única** Trial do projeto; re-provisionar exige passos manuais (DB `icp5`,
unlock de email) — fora do alcance do agent-playwright. Por isso a execução
da exclusão é gate de decisão do usuário, não automática.

## TC2 — via API (fora do escopo Playwright)

`Tipo: api`. Pré-condição da AT exige "Credenciais/token para a API de
onboarding disponíveis no `.env`" — **ausente** no `.env`. Território do
`agent-api` (não existe ainda) + validação de banco. → `test.fixme`
legítimo (§7.6 F — dependência externa / executor errado).

## Gotchas

- Login da Trial: `getByRole('textbox', { name: 'Login' })` + `getByRole('textbox', { name: 'Senha' })` + `getByRole('button', { name: 'Entrar' })`. globalSetup NÃO cobre a Trial — login explícito no `beforeAll` (exceção autorizada ao Anti-pattern A, ver skill).
- Modal "Me ajude a saber o que você quer assistir" abre oportunamente em `/play` — usar `dismissCommonModals`/`safeGoto`.
- Schema real = `events/*` (não `learning_*`) — ver memory `registros-externos-schema-real-events`. Afeta o passo DB do TC4.
