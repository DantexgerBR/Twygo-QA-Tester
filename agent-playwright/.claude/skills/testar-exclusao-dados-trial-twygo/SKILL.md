---
name: testar-exclusao-dados-trial-twygo
description: Como testar o fluxo "Excluir informações" do widget Sophia em orgs Trial Twygo — ícone Sophia (canto inferior esquerdo) → popover → "Excluir informações" → modal com 4 opções de exclusão (SophiaTech / Admin / Usuários / Tudo) → Excluir. Spec único por projeto rodando contra 1 Trial dedicada (ICP "Outros", provisionada via `provisionar-trial-projeto-twygo`). Cada projeto tem sua própria Trial porque a exclusão zera o env — não há como compartilhar entre projetos. Use sempre que um projeto Twygo precisar validar reset/exclusão de dados em org Trial — repete-se em quase todo projeto porque trial é o ciclo de vida típico do produto.
version: 1.3.0
---

# testar-exclusao-dados-trial-twygo

## Quando usar esta skill

Sempre que um spec/testsuite precisar validar:

- **Exclusão remove dados pré-definidos** da SophiaTech (cursos seed, trilhas
  seed, comunidades seed que vêm com toda Trial nova).
- **Exclusão remove dados criados pelo Admin** (cursos/trilhas/conteúdos
  cadastrados manualmente pelo usuário durante a Trial).
- **Exclusão remove usuários cadastrados** pelo Admin.
- **Exclusão "Todas as informações"** zera tudo (pré-definidas + admin).
- **Reset de org Trial** entre runs/projetos (cleanup global, não por TC).

Este fluxo aparece em **quase todo projeto Twygo** porque toda feature
nova precisa ser validada no ciclo de vida típico do cliente: começa em
Trial, cria/usa, decide se assina, e na decisão "não" o operador limpa
os dados pra que outro prospect use o mesmo env. Trial é o palco.

## 1 Trial por projeto — ICP "Outros" (`icp5`)

Cada projeto Twygo tem **sua própria Trial dedicada** com intenção de
uso **"Outros"** (corresponde à coluna `icp5` da tabela
`organization_icps`). Não há matriz de ICPs — 1 Trial basta para validar
o fluxo de exclusão, que é o mesmo independente de ICP.

Provisionamento é feito pela skill irmã [[provisionar-trial-projeto-twygo]]
(playbook interativo Claude+executor de 8 passos: DB update na `icp5`
→ criação via wizard com intenção "Outros" → unlock email → conferência
feature flags → gravação de `trial-env.json`).

**A skill atual assume**: spec Trial carrega URL/credenciais de
`projects/<slug>/data/trial-env.json` (gerado pela skill irmã) e roda
contra essa única Trial.

Os 5 envs `trial-agentsqa-*` em `config/environment.json` são **legacy**
(da iteração 1 da abordagem) — mantidos como referência da infra de QA,
NÃO consumidos por specs de projeto.

### Por que não 5 ICPs

- Tentativa anterior (iteração 2 da skill `provisionar-*`): 5 Trials por
  projeto, uma por ICP. Descartada porque o teste de exclusão valida o
  **mesmo fluxo de UI** independente do ICP do tenant — variar por
  persona não traz signal adicional que justifique o custo (5× criação +
  5× unlock + 5× verificação manual de flags).
- Se um teste futuro precisar exercitar especificamente um ICP que não
  seja "Outros" (ex: validar feature flag específica de ICP Partner),
  é caso pra skill separada (ex: `testar-bloqueio-por-icp-twygo`), NÃO
  pra inflar esta.

## Fluxo canônico (3 passos)

1. **Pré**: logado em org Trial alvo (storageState do ICP). Navegar para
   qualquer rota que renderize a sidebar/dashboard padrão (ex:
   `/dashboard_students` ou `/play?menu_id=play`). O widget Sophia aparece
   em **todas** as rotas autenticadas, no canto **inferior esquerdo**.

2. **Abrir popover Sophia → escolher "Excluir informações"**:
   - O ícone Sophia é um botão flutuante (mascote coruja) no canto inferior
     esquerdo. Aparece em **todo** ambiente Trial; **não** aparece em envs
     não-Trial (ver "Diferença Trial vs não-Trial" abaixo).
   - Click abre popover com 4 opções: "Primeiros passos", "Fale com a
     gente", "Contratar a Twygo", **"Excluir informações"** ← alvo.
   - Click em "Excluir informações" abre modal central.

3. **Modal "Excluir informações" — escolher checkbox(es) e confirmar**:
   - Header: "Excluir informações" (com X de fechar no canto sup direito).
   - Texto: "Escolha quais informações você deseja excluir:".
   - **4 checkboxes** (mutuamente independentes — pode marcar 1, alguns, ou todos):
     1. **Todas as informações pré-definidas da SophiaTech** — apaga cursos/trilhas/comunidades/usuários que vieram com a Trial (seeds).
     2. **Cursos, Trilhas e Conteúdos criados pelos administradores** — apaga apenas conteúdo criado manualmente.
     3. **Usuários cadastrados pelos administradores** — apaga apenas usuários manualmente cadastrados.
     4. **Todas informações (pré-definidas e criadas pelos administradores)** — equivale a marcar 1+2+3 juntos.
   - Aviso: "Ao confirmar esta ação você irá excluir permanentemente todas as informações selecionadas."
   - Botões: **Excluir** (vermelho, confirma) | **Cancelar** (verde, fecha modal).

## Seletores canônicos

> Validados live 2026-05-15 em env Trial via screenshots fornecidos.
> Generator deve confirmar via recon/Playwright MCP antes de gerar specs.
> Se algum seletor mudar, atualizar esta tabela junto com o spec.

| Elemento | Seletor preferido | Fallback |
|---|---|---|
| Ícone Sophia (canto inf esquerdo) | `getByRole('button', { name: /sofia/i })` | `.chakra-icon` dentro do container do widget (descobrir testId) |
| Popover header "Oi, eu sou a Sophia." | `getByText('Oi, eu sou a Sophia.')` | `getByRole('dialog').filter({ hasText: 'Sophia' })` |
| Botão fechar popover (X) | dentro do popover, `getByRole('button', { name: /fechar|close/i })` | — |
| Opção "Primeiros passos" | `getByRole('button', { name: 'Primeiros passos' })` | — |
| Opção "Fale com a gente" | `getByRole('button', { name: 'Fale com a gente' })` | — |
| Opção "Contratar a Twygo" | `getByRole('button', { name: 'Contratar a Twygo' })` | — |
| **Opção "Excluir informações"** | `getByRole('button', { name: 'Excluir informações' })` | — |
| Modal de exclusão | `getByRole('dialog').filter({ hasText: 'Excluir informações' })` | — |
| Checkbox "Todas SophiaTech" | `getByRole('checkbox', { name: /Todas as informações pré-definidas da SophiaTech/i })` | — |
| Checkbox "Cursos/Trilhas/Conteúdos Admin" | `getByRole('checkbox', { name: /Cursos, Trilhas e Conteúdos criados pelos administradores/i })` | — |
| Checkbox "Usuários Admin" | `getByRole('checkbox', { name: /Usuários cadastrados pelos administradores/i })` | — |
| Checkbox "Todas (pré + admin)" | `getByRole('checkbox', { name: /Todas informações \(pré-definidas e criadas pelos administradores\)/i })` | — |
| Botão Excluir (confirmar) | `getByRole('dialog').getByRole('button', { name: 'Excluir', exact: true })` | — |
| Botão Cancelar | `getByRole('dialog').getByRole('button', { name: 'Cancelar', exact: true })` | — |

**Atenção**: o produto NÃO usa `data-test-id` no widget Sophia (validado nas
3 imagens — só `chakra-icon css-na1ls4` no ícone). Por isso a tabela usa
`getByRole` em vez de `getByTestId`. Se a infra de Trial adicionar testIds
no futuro (improvável), atualizar pra preferir testId conforme §2.3 do
[agent-playwright/CLAUDE.md](../../../CLAUDE.md).

## Page Object proposto: `SophiaWidget` (compartilhado)

O widget Sophia é **genérico Twygo** (não acoplado a um projeto), então o
Page Object vai em `src/pages/SophiaWidget.ts`. Specs de qualquer projeto
importam.

**Shape sugerido** (generator confirma na hora de criar):

```ts
// src/pages/SophiaWidget.ts
import type { Locator, Page } from '@playwright/test';

export type DeleteOption =
  | 'sophiatech'        // pré-definidas SophiaTech
  | 'admin-content'     // Cursos/Trilhas/Conteúdos do Admin
  | 'admin-users'       // Usuários do Admin
  | 'all';              // tudo

export class SophiaWidget {
  constructor(private readonly page: Page) {}

  getIcon(): Locator { return this.page.getByRole('button', { name: /sofia/i }); }
  getPopover(): Locator { return this.page.getByRole('dialog').filter({ hasText: 'Sophia' }); }
  getDeleteInfoOption(): Locator { return this.getPopover().getByRole('button', { name: 'Excluir informações' }); }
  getDeleteModal(): Locator { return this.page.getByRole('dialog').filter({ hasText: 'Excluir informações' }); }
  getConfirmDeleteButton(): Locator { return this.getDeleteModal().getByRole('button', { name: 'Excluir', exact: true }); }
  getCancelButton(): Locator { return this.getDeleteModal().getByRole('button', { name: 'Cancelar', exact: true }); }

  async openDeleteModal(): Promise<void> {
    await this.getIcon().click();
    await this.getDeleteInfoOption().click();
    await this.getDeleteModal().waitFor({ state: 'visible' });
  }

  async checkOption(opt: DeleteOption): Promise<void> {
    const cb = this.getDeleteModal().getByRole('checkbox').nth(/* índice por opt */ 0);
    if (!(await cb.isChecked())) await cb.click();
  }

  async confirmDelete(): Promise<void> {
    await this.getConfirmDeleteButton().click();
    // Aguardar conclusão — TODO: confirmar com QA se há toast de "Dados excluídos"
    // ou redirect; do contrário, esperar `getDeleteModal()` ficar hidden.
  }
}
```

**Observação**: o método `checkOption` precisa de mapeamento `DeleteOption →
índice|seletor`. Generator decide se mapeia por índice (frágil se ordem dos
checkboxes mudar) ou por filtro de texto (preferível). Use seletor de texto
da tabela acima.

## Gotcha crítico — exclusão é JOB ASSÍNCRONO

Validado live via chrome-devtools-mcp em 2026-05-15: a exclusão **não é
síncrona**. Após click no botão "Excluir" do modal:

1. Modal fecha imediatamente.
2. Backend agenda um job de exclusão e responde 2xx.
3. UI **continua pollando** o endpoint `/api/v1/o/{orgId}/trial_deletion_progress`
   pra mostrar progresso.
4. **Listagens (painéis, cursos, usuários, etc.) só refletem o resultado
   após o job completar** — varia com volume de dados (8s wall-clock em
   Trial pequena, pode ser bem maior).

**Implicação no spec**: o assert imediato após `confirmDelete()` encontra
dados ainda na DB. Sintoma típico — Playwright vermelho `toHaveCount(0)
received 1` ou `received 5` em runs com painéis admin pré-criados.

**Padrão canônico no `confirmDelete()` (SophiaWidget POM)**:

```ts
async confirmDelete(): Promise<void> {
  await this.getConfirmDeleteButton().click();
  await this.getDeleteModal().waitFor({ state: 'hidden', timeout: 60_000 });
  // Espera o polling do trial_deletion_progress estabilizar.
  await this.page.waitForLoadState('networkidle', { timeout: 60_000 });
}
```

**Padrão canônico no spec — asserção pós-exclusão**:

```ts
// Default timeout do toHaveCount é 5s — insuficiente. Use 60s + invariante.
await expect(paineis.getRowByName(panelName)).toHaveCount(0, {
  timeout: 60_000,
});

// OU pra invariantes mais complexas (contagem relativa): expect().toPass:
await expect(async () => {
  await page.reload();
  const finalCount = await paineis.getRowCount();
  expect(finalCount).toBeLessThan(initialCount);
}).toPass({ timeout: 60_000 });
```

**Anti-pattern (cometi e corrigi neste fluxo)**:

- ❌ Aceitar vermelho como "bug-produto" sem auditar via MCP. Era spec
  frágil (timing async), não bug. Caso real: TC4 sessão 2026-05-15.
  Fluxo correto é a skill [[comparar-chrome-mcp-vs-playwright]] —
  reproduzir via MCP **antes** de categorizar.

## Estrutura do spec — 1 Trial por projeto

O spec roda contra a **única Trial provisionada** do projeto, carregando
URL/credenciais de `projects/<slug>/data/trial-env.json` (gerado pela
skill [[provisionar-trial-projeto-twygo]]):

```ts
// projects/<slug>/tests/features/trial/exclusao-trial.spec.ts
import { test } from '../../../../../src/fixtures/exploratory-fixture.js';
import { SophiaWidget } from '../../../../../src/pages/SophiaWidget.js';
import { TRIAL } from './exclusao-trial.data.js';

test.describe('Exclusão de trial', () => {
  test.use({
    baseURL: TRIAL.url,
    storageState: { cookies: [], origins: [] }, // login explícito no beforeAll
  });

  test.beforeAll(async ({ browser }) => {
    // Login direto na Trial provisionada — globalSetup cobre só env principal+secundário do projeto.
    const ctx = await browser.newContext({ baseURL: TRIAL.url });
    const page = await ctx.newPage();
    await page.goto('/users/login');
    await page.getByRole('textbox', { name: 'Login' }).fill(TRIAL.email);
    await page.getByLabel('Senha').fill(TRIAL.password);
    await page.getByRole('button', { name: 'Entrar' }).click();
    await ctx.storageState({ path: TRIAL.storageStatePath });
    await ctx.close();
  });

  test('exclui dados pré-definidos da SophiaTech', async ({ page, step }) => {
    const sophia = new SophiaWidget(page);
    await step('1. Abrir modal Excluir informações', async () => {
      await page.goto('/dashboard_students');
      await sophia.openDeleteModal();
    });
    await step('2. Marcar SophiaTech e confirmar', async () => {
      await sophia.checkOption('sophiatech');
      await sophia.confirmDelete();
    });
    await step('3. Validar — dados SophiaTech sumiram', async () => {
      // asserção depende do projeto (ex: lista de cursos vazia)
    });
  });
});
```

**`<test-case>.data.ts` canônico** (§3.1 do CLAUDE.md — não inline URL/credencial no spec):

```ts
// exclusao-trial.data.ts
import { resolve } from 'node:path';
import trialEnv from '../../../data/trial-env.json' assert { type: 'json' };

const password = process.env[trialEnv.passwordEnvVar];
if (!password) {
  throw new Error(`${trialEnv.passwordEnvVar} ausente em .env — preencher após provisionamento.`);
}

export const TRIAL = {
  url: trialEnv.url,
  email: trialEnv.email,
  password,
  storageStatePath: resolve(process.cwd(), 'outputs/.auth/storage-trial.json'),
} as const;
```

## Storage state da Trial

NÃO há extensão necessária em `tests/setup/global-setup.ts`. O spec
Trial faz login no `beforeAll` usando credenciais carregadas de
`trial-env.json` + `.env` (ver exemplo `.data.ts` acima).

Anti-pattern A do §7.6 (NUNCA fazer login no spec) **abre exceção
explícita** para spec Trial porque o globalSetup só cobre o env
principal/secundário do projeto — a Trial provisionada vive em
subdomínio próprio e seria caro adicionar mais 1 storageState ao boot
de todo spec do projeto. Login dedicado executa só quando a suite Trial
roda, storage gerado em `outputs/.auth/storage-trial.json`.

> **Onde justificar isso ao revisor**: comentário no `beforeAll`:
> `// Login explícito autorizado para Trial — globalSetup cobre só env principal/secundário do projeto. Ver testar-exclusao-dados-trial-twygo §"Storage state da Trial".`

## Diferença Trial vs não-Trial

Validar via chrome-devtools-mcp em **1 env não-Trial** (ex: `staging-widgets`)
que o widget Sophia **NÃO aparece** — confirma que a feature é gated por
contrato Trial e o teste de exclusão não tem sentido fora desse contexto.

Se o widget aparecer também em envs não-Trial (improvável mas possível em
ambientes mal-configurados), atualizar esta skill removendo a restrição
"só Trial" e propor um `test.fixme` em envs não-Trial.

## Anti-patterns

### A. NÃO consumir Trial de outro projeto

- ❌ Spec do projeto `creditos-fase-02` importa `trial-env.json` do
  projeto `widgets`.
- ❌ Hardcode de URL Trial específica de outro projeto
  (`https://abc123.stage.twygoead.com/`).
- ✅ Cada projeto provisiona sua própria Trial via
  [[provisionar-trial-projeto-twygo]] e consome **somente** seu próprio
  `projects/<slug>/data/trial-env.json`.
- **Por quê**: a suite de exclusão zera o env. Se 2 projetos compartilham
  Trial, o que rodar primeiro destrói os dados do segundo. Isolar por
  projeto resolve.
- **Como detectar**: orchestrator pode validar no preflight que
  `trial-env.json` consumido vive em `projects/<slug-atual>/data/` —
  qualquer outro path é violação.

### B. NÃO inflar a skill com matriz de ICPs

- ❌ Re-introduzir `for (const icp of TRIAL_ICPS)` varrendo 5 ICPs.
- ❌ Adicionar campos `icp1`..`icp4` no `trial-env.json`.
- ✅ Manter 1 Trial (ICP "Outros" / `icp5`) por projeto. Se algum cenário
  novo exigir validar comportamento específico de outro ICP, criar
  **skill irmã separada** (ex: `testar-bloqueio-por-icp-twygo`) — não
  inflar esta.
- **Por quê**: a iteração 2 do provisionamento (5 Trials por projeto)
  foi descartada porque o teste de exclusão valida o mesmo fluxo
  independente de ICP. Re-introduzir matriz reverte a simplificação.

### C. NÃO assumir env Trial limpo no início do spec

- ❌ Spec de exclusão começa assumindo "tem 6 cursos seed da SophiaTech, vou
  excluir e validar 0 cursos".
- ✅ Ler estado inicial primeiro (contagem de cursos / lista de IDs), excluir,
  asserir delta. Ou: re-provisionar a Trial (skill irmã) antes da run pra
  forçar estado conhecido.
- **Por quê**: a Trial pode estar parcialmente excluída da run anterior.
  Asserção de "0 cursos" passa por acidente; asserção de "delta = N removidos"
  é robusta.

### D. NÃO hardcodar orgId, hostname ou número de cursos seed da SophiaTech

- ❌ `await page.goto('https://abc123.stage.twygoead.com/dashboard_students')` ou `await expect(courses).toHaveCount(6)`.
- ✅ Usar `TRIAL.url` carregado de `trial-env.json`; contar dinamicamente
  o seed inicial e validar `final < inicial` ou `final === 0` conforme
  caso.
- **Por quê**: SophiaTech atualiza seeds periodicamente. Spec com count
  hardcoded quebra sem mudança no produto — é teste mentindo (§2.1).

### E. NÃO marcar `test.fixme` sem causa raiz declarada (§7.6 F)

- ❌ `test.fixme(true, 'isolamento Trial pendente')` genérico.
- ✅ Quando a decisão de isolamento for tomada, ou destravar o spec (fluxo
  funciona), ou marcar `fixme` com link pra ticket de infra + categoria
  ("seed ausente" / "feature flag off num env"). Ver Anti-pattern F do
  CLAUDE.md §7.6.

### F. NÃO usar comentário WHAT (§7.6 D)

- ❌ `// Clicar no ícone Sophia pra abrir popover`
- ✅ Método `sophia.openDeleteModal()` é auto-explicativo. Comentário só
  vai pra WHY não-óbvio (ex: "Sophia popover não tem testId — usar role
  conforme `testar-exclusao-dados-trial-twygo`").

## Estratégia de isolamento — resolvida em 2026-05-15

**Decisão**: 1 Trial dedicada por projeto, ICP "Outros" (`icp5`),
provisionada via [[provisionar-trial-projeto-twygo]].

- **Reset entre runs**: cada projeto re-provisiona quando sua Trial fica
  stale ou foi zerada pela suite de exclusão. Não há "reset global" — a
  tabula rasa pós-exclusão é esperada e é o próprio sinal de "Trial
  daquele projeto consumida, precisa de novo provisionamento".
- **Qual projeto detém qual Trial**: cada projeto detém A SUA. Sem
  compartilhamento entre projetos — porque a Trial é exclusiva por
  projeto.
- **5 envs `trial-agentsqa-*`** em `config/environment.json`: legacy
  (iteração 1). Permanecem como referência da infra inicial de QA. NÃO
  são consumidos por specs de projeto.

## Atualizar `_README.md` dos specs trial

[`projects/widgets/tests/features/trial/_README.md`](../../../projects/widgets/tests/features/trial/_README.md)
ainda diz "criação/exclusão de trial muda estado Super Admin global" e
mantém os 4 specs em `test.fixme`. Após executar
[[provisionar-trial-projeto-twygo]] no projeto widgets pela primeira
vez:

- Destravar (remover `test.fixme`) os specs `exclusao-trial-dados-sophiatech.spec.ts`
  e `exclusao-trial-dados-admin.spec.ts`. Eles passam a usar
  `SophiaWidget` lendo `data/trial-env.json` (singular).
- O spec `criacao-trial-url-paineis-predefinidos.spec.ts` valida o
  fluxo `/new/register/steps` que o provisionamento já exercita — pode
  ser destravado também, asserção sobre painéis pré-definidos copiados.
- O spec `criacao-trial-api-paineis-predefinidos.spec.ts` (API
  out-of-scope Playwright) fica `fixme` com `executionType: manual` e
  destinatário "teste de API".
- Atualizar o README pra refletir a decisão de isolamento (1 Trial
  per-project, ICP "Outros").

## Por que esta skill existe

Trial é o **ciclo de vida típico do cliente Twygo** — começa com Trial,
explora, decide. Toda feature nova precisa ser validada nesse fluxo. Sem
reset confiável, o env Trial acumula dados de N runs → seed pollution → o
próximo prospect que clicar "iniciar Trial" vê resíduo + os specs ficam
flaky por estado residual.

A exclusão "Excluir informações" é a UI canônica do produto pra esse reset.
Documentar o fluxo, seletores e estrutura do spec **uma vez** evita que
cada projeto novo redescubra: (a) que o ícone Sophia não tem testId,
(b) que existem 4 opções de exclusão com semânticas distintas, (c) que
o env Trial é per-project e a exclusão é destrutiva.

**Caso real** (2026-05-15): suíte Trial do projeto widgets foi pulada em
sessão anterior porque o agente não sabia onde estava a "rotina de
exclusão de Trial". Skill evoluiu em 3 versões no mesmo dia:
- v1.0 documentou o fluxo + propôs 5 envs Trial compartilhados.
- v1.1 trocou pra 5 Trials per-project após identificar que a exclusão
  tornava o env consumível.
- v1.2 (atual) simplificou pra 1 Trial per-project (ICP "Outros") — o
  teste valida o mesmo fluxo independente de ICP; varrer 5 não trazia
  signal proporcional ao custo de provisionar 5 vezes.

## Skills relacionadas

- [[provisionar-trial-projeto-twygo]] — **pré-requisito**. Playbook
  interativo Claude+executor que produz `data/trial-env.json` consumido
  por esta skill. Rodar primeiro.
- [`limpar-dados-de-teste-twygo`](../limpar-dados-de-teste-twygo/SKILL.md) —
  cleanup em `afterAll` de TC isolado. Skill atual é o equivalente de
  **reset de tenant inteiro**, não de TC.
- [`fechar-modais-twygo`](../fechar-modais-twygo/SKILL.md) — popover/modal
  de Sophia podem competir com NPS Sofia oportunista. Generator deve
  plugar `dismissCommonModals` antes de abrir o popover Sophia
  ([[fechar-modais-twygo]]).
- [`trocar-perfil-twygo`](../trocar-perfil-twygo/SKILL.md) — perfis Trial
  podem precisar trocar entre Admin/Aluno pra validar efeito da exclusão
  na visão do aluno ([[trocar-perfil-twygo]]).
