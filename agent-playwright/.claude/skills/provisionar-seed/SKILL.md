---
name: provisionar-seed
description: Quando um TC Playwright declara pré-condição como "curso pré-existente", "aluno matriculado", "participant com progresso 100", "trilha com 3 cursos filhos", etc, o spec NÃO pode marcar `test.fixme(true, 'seed inválido')` nem depender de IDs hardcoded em `.data.ts` placeholder. Em vez disso, o spec é auto-suficiente — `beforeAll` cria os recursos via UI admin (rotas canônicas validadas live: `/contents/new?kind=N` facelift React para Curso/Trilha/Pacote; `/users/new` Haml legado para Usuário; matrícula via lista→more_vert→"Inscrição"→drawer→"Adicionar"; NUNCA `/events/new` Haml deprecated nem `/contents/{id}/learning_students` que retorna 404), `afterAll` deleta tudo via variant `*_safe` do Page Object (link com [[limpar-dados-de-teste-twygo]]). Skill define o padrão canônico, catálogo de helpers `create<Recurso>` esperados com mapping kind→Recurso validado live + form de usuário Haml com captura de ID via busca por email + matrícula via drawer client-side (URL não muda), naming worker-isolated, integração com fixture custom, e quando `fixme` por seed ainda é legítimo (DB-only/mailer/Flipper toggle). Use ao gerar/revisar QUALQUER spec novo que tenha pré-condição "X existe no env" — converter a pré-condição em ação automatizada no `beforeAll`.
version: 1.3.0
---

# provisionar-seed

## Por que existe

**Incidente 2026-05-26 — projeto Recertificação**: 25 dos 26 TCs com
falhas vermelhas foram marcados `test.fixme(true, 'seed inválido —
eventId placeholder. Validar manualmente no env staging-base-de-conhecimento
e atualizar o .data.ts.')`. Diagnóstico: o env não tinha cursos com os
IDs assumidos nos `.data.ts` (placeholders `eventId: 1, 2, 3, 4`).
Network capturou `GET /o/.../events/{N} → 404`.

**O erro**: marcar `test.fixme` "seed inválido" como **categoria
legítima §7.6 F** ("validação secundária manual hoje"). Não era. A
pré-condição "curso pré-existente" é **provisionável via UI admin** —
basta `beforeAll` que faz a navegação Aprendizagem → Conteúdos →
"+ Adicionar" → Curso, preenche form, salva, captura o contentId
real de `page.url()`, e usa esse ID nos steps do test. `afterAll` deleta.

**Erro secundário descoberto em 2026-05-26 (v1.0 da skill ainda usava)**:
apontar rota `/o/{orgId}/events/new` (Haml legado) como rota canônica de
criar curso. Submit retorna **HTTP 422 "The change you wanted was
rejected"** silencioso. **Rota canônica é `/o/{orgId}/contents/new?kind=N`**
(facelift React, validado live no env staging-recertificacao 37048
criando content ID 806852). Ver §Anti-pattern (rota errada) abaixo.

**Lição**: spec auto-suficiente é invariante do código de teste. Se o
recurso é criável via UI admin, crie via UI no `beforeAll`. Só marque
`fixme` por seed quando o recurso **não tem caminho UI** (worker async,
Flipper toggle, DB write direto, env adicional config).

## Pré-condições para qualquer createX

Antes de chamar qualquer `create<Recurso>`:

1. **storageState válido** com user logado. `global-setup.ts` resolve.
2. **Perfil ativo = Administrador**. User loga em "Colaborador G" por
   padrão; sem switch, navegação a `/contents/new?kind=N` retorna
   **"Você não tem permissão para acessar esta página"** (mesmo URL
   navegado direto). Switch via popover de perfil (canto sup direito
   do header) → "Administrador". Skill canônica
   [[trocar-perfil-twygo]] cobre. POM: `ProfileSwitcher.switchTo('Administrador')`.
3. **Env tem pelo menos 1 "Tipo de experiência" cadastrado**. O form
   facelift exige selecionar 1 das opções existentes — não aceita
   "criar nova" inline. Se env zerado, criar 1 via `/o/{orgId}/content_models`
   ANTES do primeiro `createX`. No env Recertificação (37048) existe
   "Suite Everton CSV" pré-cadastrada — `SeedAdminPage.createCurso`
   pode aceitar `tipoExperiencia` opcional com default desse valor.

## Quando usar

**SEMPRE** que gerar ou revisar spec que declare pré-condição com
"existe X no env", "X pré-existente", "aluno com Y", "curso com Z",
"trilha com N filhos". Conferir:

1. O recurso é provisionável via rota UI admin?
2. Se sim: `beforeAll` cria, `afterAll` deleta. Sem fixme.
3. Se não (DB write direto, worker assíncrono, Flipper toggle): `fixme`
   legítimo categoria §7.6 F + motivo específico.

## Mapping `kind` → Recurso (validado live 2026-05-26)

Rota canônica facelift React: **`/o/{orgId}/contents/new?kind={N}`**

| Recurso | kind | URL final após save | Validação |
|---|---|---|---|
| **Curso** | `0` | `/contents/{id}/edit` | ✅ Live MCP — content 806852 |
| **Trilha** | `3` | `/contents/{id}/edit` | ✅ Live MCP — content 806853 |
| **Pacote** | `4` | `/contents/{id}/edit` | ✅ Live MCP — content 806854 |

**Surpresas aprendidas:** kind=1 e kind=2 **NÃO** estão expostos pelo
menu UI (provavelmente Webinar legado / outros tipos retirados). NÃO
inferir kind=1 como Trilha — Trilha é kind=3.

**NÃO existem mais rotas separadas para Pacote** (`/contents/packages/new`,
`/events/new?kind=learning_path`). Todas convergiram em `/contents/new?kind=N`
no facelift.

## Catálogo de pré-condições Twygo (atualizado)

| Pré-condição comum Twygo | Provisionável via UI? | Como |
|---|---|---|
| Curso pré-existente | ✅ | `/o/{orgId}/contents/new?kind=0` — `SeedAdminPage.createCurso` |
| Trilha pré-existente | ✅ | `/o/{orgId}/contents/new?kind=3` — `SeedAdminPage.createTrilha` |
| Pacote pré-existente | ✅ | `/o/{orgId}/contents/new?kind=4` — `SeedAdminPage.createPacote` |
| Aluno matriculado num curso/trilha/pacote | ✅ | **Lista `/events?tab=events` → row do conteúdo → more_vert → "Inscrição"** abre drawer "Lista de Participantes" → click "Adicionar" → form (E-mail/Nome/Sobrenome) → Salvar. App reusa user existente quando email bate. URL **NÃO muda** — drawer client-side. Detalhes em §"Matrícula de aluno (Inscrição)" |
| Usuário aluno cadastrado | ✅ | `/o/{orgId}/users/new` — **form Haml legado**, NÃO facelift. `SeedAdminPage.criarUsuarioAluno` validado live (v1.2). Detalhes em §"Form de Novo Usuário" |
| Painel pré-existente (widgets) | ✅ | `/o/{orgId}/panels/new` — ver `PaineisListPage.createPanel` |
| Modo de uso pré-existente | ✅ | `/o/{orgId}/use_modes/new` |
| Tipo de experiência cadastrado | ✅ | `/o/{orgId}/content_models` (precondição pra createCurso/Trilha/Pacote) |
| Participant com `progress_score=100` | ⚠️ Parcial | Matricular via UI funciona; progresso depende de worker — `fixme` parcial pro score |
| Certificado VALID emitido | ⚠️ Worker `IssuesCertificates` | `fixme` legítimo (DB/worker) |
| Certificado REPLACED | ❌ Worker + cascade | `fixme` legítimo |
| Feature flag ON | ⚠️ via `/admin/manage/features/<flag>` | [[testar-feature-flag-twygo]] (NÃO esta skill) |
| Contrato com feature | ⚠️ via Super Admin | [[alterar-funcionalidade-contrato-twygo]] (NÃO esta skill) |

## Campos obrigatórios do form facelift (validado live)

### Curso (kind=0) e Trilha (kind=3)

Mesmo conjunto de obrigatórios:

| Campo | Tipo de input | Como preencher |
|---|---|---|
| **Nome** * | textbox | `.getByLabel('Nome *').fill(value)` |
| **Tipo de experiência** * | combobox autocomplete | Click → escolher 1 opção da listbox (env precisa ter ao menos 1) |
| **Situação** * | combobox | Default "Em desenvolvimento" — não mexer salvo necessário |
| **Quem pode ver (visualização)** * | combobox | Default "Usuários" — não mexer salvo necessário |
| **Descrição** * | rich-text dentro de `<iframe>` | `frameLocator('iframe[title^="Editor de Rich Text"]').locator('body').fill(value)` |

Tabs do Curso: Identificação (única habilitada inicialmente), Acesso,
Banner, Aprovação, Cobrança, Localização, Dashboard, Compartilhar.

Tabs da Trilha: idênticas às do Curso menos Dashboard.

### Pacote (kind=4)

**Diferente do Curso/Trilha em 2 pontos**:

| Campo | Tipo de input | Obrigatório? |
|---|---|---|
| **Nome** * | textbox | ✅ |
| **Tipo de experiência** * | combobox autocomplete | ✅ |
| **Descrição** * | rich-text iframe | ✅ |
| Situação | combobox | ❌ (sem asterisco; default "Em desenvolvimento") |
| Quem pode ver | combobox | ❌ (sem asterisco; default "Usuários") |
| Classificação | combobox autocomplete | ❌ |
| Categorias | combobox autocomplete | ❌ |

Tabs do Pacote: Identificação, Acesso, **Conteúdos** (único do Pacote),
Banner, **Inscrições** (único do Pacote), Compartilhar. Sem Aprovação,
Cobrança, Localização, Dashboard.

## Form de Novo Usuário (rota Haml legado)

Diferente de Curso/Trilha/Pacote, **a tela de criar usuário ainda usa
form Haml legado** — não foi migrada pro facelift React. Validado live
2026-05-26 no env staging-recertificacao (orgId 37048): submit funciona
sem 422 (a rota Haml `/users/new` está ativa; apenas `/events/new` foi
desligada).

### Características que diferem do facelift

| Aspecto | Form facelift (Curso/Trilha/Pacote) | Form Haml (Usuário) |
|---|---|---|
| Layout | Tabs (Identificação, Acesso, ...) | Sem tabs, scroll vertical |
| Asterisco `*` | No accessible name do textbox (`Nome *`) | Em StaticText adjacente — `getByLabel('Nome')` exato funciona |
| Validação | Client-side React | Server-side (response HTML com erro renderizado) |
| Redirect pós-save | `/contents/{id}/edit` | **`/o/{orgId}/users` (listagem)** — NÃO captura ID via URL |
| Botão extra | (só Salvar) | "Salvar" + "Salvar e Novo" |

### Campos obrigatórios

| Campo | Tipo | Como preencher |
|---|---|---|
| **E-mail** * | textbox | `page.getByLabel('E-mail').fill(email)` |
| **Nome** * | textbox | `page.getByLabel('Nome', { exact: true }).fill(firstName)` |
| **Sobrenome** * | textbox | `page.getByLabel('Sobrenome').fill(lastName)` |

Tudo mais é opcional: CPF, Telefone, endereço completo (CEP/Endereço/
Número/Complemento/Bairro/Cidade/Estado), País (default "Brasil"),
Empresa, Ramo de atuação, Nº colaboradores, Site, Cargo, Área, Funções
de negócio, perfil de acesso (checkboxes Administrador / Instrutor /
Gestor de turma — sem marcar nenhum = **Aluno default**), Modo de uso.

### Estratégia para capturar `userId` (sem URL pós-save)

3 opções, em ordem de robustez:

**(A) Buscar por email único na listagem + extrair ID do link Editar** (recomendado)

```ts
// Após save, estamos em /o/{orgId}/users
await this.page.getByPlaceholder('Pesquise aqui').fill(email);
await this.page.waitForResponse(r => r.url().includes('/users') && r.status() === 200);

// Linha do user — abrir menu more_vert pra revelar link "Editar"
const row = this.page.locator('tr', { hasText: email }).first();
await row.getByRole('button', { name: 'more_vert' }).click();
const editLink = this.page.getByRole('link', { name: /editar/i });
const href = await editLink.getAttribute('href');
const m = href?.match(/\/users\/(\d+)\/edit/);
if (!m) throw new Error(`Falha capturando userId. href: ${href}`);
return Number(m[1]);
```

**(B) Inspecionar POST response via `page.waitForResponse()`**

```ts
const [response] = await Promise.all([
  this.page.waitForResponse(r =>
    r.url().endsWith('/users') && r.request().method() === 'POST'
  ),
  this.page.getByRole('button', { name: 'Salvar' }).click(),
]);
// Twygo Haml retorna 302 redirect — Location header tem /users/{id}/edit?
const location = response.headers()['location'];
const m = location?.match(/\/users\/(\d+)/);
return m ? Number(m[1]) : null;
```

Vale validar B em live antes de adotar — Twygo pode redirecionar
direto pra `/users` (lista) sem passar pelo `/users/{id}/edit`,
caso em que (B) não funciona.

**(C) Usar email como chave primária e dispensar `userId`**

Helper retorna `string` (email) em vez de `number`. Cleanup deleta
buscando por email. Funciona se nenhum step do test precisar do
`userId` numérico (ex: spec só verifica que aluno aparece na lista do
curso, não acessa rota `/users/{id}/...`).

```ts
async criarUsuarioAluno(data: {
  email: string;
  firstName: string;
  lastName: string;
}): Promise<string> {  // retorna email, não userId
  // ... preenche e submete ...
  return data.email;
}

async deleteUsuarioByEmailSafe(email: string): Promise<void> {
  try {
    await safeGoto(this.page, `/o/${getOrgId()}/users`);
    await this.page.getByPlaceholder('Pesquise aqui').fill(email);
    // ... clica more_vert → Delete → Confirma
  } catch { /* já deletado */ }
}
```

### Padrão canônico (createUsuarioAluno)

```ts
// SeedAdminPage.ts (continua a classe da §"Padrão canônico" acima)
export class SeedAdminPage extends BasePage {
  // ... createCurso / createTrilha / createPacote ...

  /**
   * Cria usuário aluno (perfil default, sem checkboxes admin/instrutor/gestor).
   * Form Haml legado em /o/{orgId}/users/new — NÃO facelift.
   *
   * Estratégia (A) — captura userId via busca por email + link Editar.
   */
  async criarUsuarioAluno(data: {
    email: string;
    firstName: string;
    lastName: string;
    cpf?: string;
  }): Promise<{ userId: number; email: string }> {
    await safeGoto(this.page, `/o/${getOrgId()}/users/new`);

    // 3 obrigatórios
    await this.page.getByLabel('E-mail').fill(data.email);
    await this.page.getByLabel('Nome', { exact: true }).fill(data.firstName);
    await this.page.getByLabel('Sobrenome').fill(data.lastName);

    if (data.cpf) {
      await this.page.getByLabel('CPF').fill(data.cpf);
    }

    // NÃO marcar checkbox de Administrador/Instrutor/Gestor — aluno default
    await this.page.getByRole('button', { name: 'Salvar', exact: true }).click();
    await this.page.waitForURL(/\/o\/\d+\/users(?:\?|$)/);

    // Estratégia (A): buscar email único + extrair ID
    await this.page.getByPlaceholder('Pesquise aqui').fill(data.email);
    const row = this.page.locator('tr', { hasText: data.email }).first();
    await row.getByRole('button', { name: 'more_vert' }).click();
    const editLink = this.page.getByRole('link', { name: /editar/i });
    const href = await editLink.getAttribute('href');
    const m = href?.match(/\/users\/(\d+)\/edit/);
    if (!m) throw new Error(`Falha capturando userId. href: ${href}`);
    return { userId: Number(m[1]), email: data.email };
  }

  /** Cleanup por email (chave estável). */
  async deleteUsuarioByEmailSafe(email: string): Promise<void> {
    try {
      await safeGoto(this.page, `/o/${getOrgId()}/users`);
      await this.page.getByPlaceholder('Pesquise aqui').fill(email);
      const row = this.page.locator('tr', { hasText: email }).first();
      await row.getByRole('button', { name: 'more_vert' }).click({ timeout: 5000 });
      await this.page.getByRole('menuitem', { name: /excluir|delete/i }).click();
      await this.page.getByRole('button', { name: /confirmar|sim/i }).click();
    } catch {
      // já deletado ou nunca existiu — ok
    }
  }
}
```

### Spec consumindo

```ts
test.describe('TC matrícula aluno', () => {
  let aluno: { userId: number; email: string };

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    await new ProfileSwitcher(page).switchTo('Administrador');
    const seed = new SeedAdminPage(page);
    aluno = await seed.criarUsuarioAluno({
      email: `aluno-tc1-w${test.info().workerIndex}-${Date.now()}@example.com`,
      firstName: 'Aluno',
      lastName: `TC1 w${test.info().workerIndex}`,
    });
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    await new ProfileSwitcher(page).switchTo('Administrador');
    await new SeedAdminPage(page).deleteUsuarioByEmailSafe(aluno.email);
    await context.close();
  });

  test('TC1 — Aluno consegue se inscrever no curso', async ({ page }) => {
    // ... usa aluno.userId e aluno.email conforme necessidade
  });
});
```

## Matrícula de aluno (Inscrição) — drawer client-side

Validado live 2026-05-26 nos 3 tipos (Curso 806852, Trilha 806853, Pacote
806854) no env staging-recertificacao (orgId 37048). Aluno cadastrado:
`aluno-validacao-1779820000@example.com`.

### Caminho canônico (todos os tipos)

1. Navegar para `/o/{orgId}/events?tab=events` (listagem de Conteúdos)
2. Pesquisar pelo nome do conteúdo no campo "Pesquise aqui"
3. Click no botão `more_vert` da linha do conteúdo
4. Click no menuitem **"Inscrição"** (ícone `how_to_reg`)
5. Drawer "Lista de Participantes" abre **na mesma URL** (client-side)
6. Click no botão **"Adicionar"** (renderizado como StaticText acessível,
   NÃO `role=button` — `getByText('Adicionar')` exato funciona)
7. Form lateral abre: 3 obrigatórios (E-mail*, Nome*, Sobrenome*) +
   campos opcionais incluindo **"Data de expiração"** específico de matrícula
8. Click em "Salvar"
9. Toast inline: `"Participante criado com sucesso."`
10. Counter "Confirmados" incrementa de N → N+1

### Características importantes

| Aspecto | Comportamento validado live |
|---|---|
| URL durante drawer | **Não muda** — fica em `/events?tab=events`. Não capturar via `page.url()` |
| Reuso de user existente | Se email já existe na org, app **só matricula** (não duplica user) |
| Cria novo user inline | Se email é novo, cria user + matricula numa única ação |
| Tipo do botão "Adicionar" | StaticText estilizado como botão. **NÃO `role=button`** — `getByRole('button', { name: 'Adicionar' })` falha. Use `getByText('Adicionar', { exact: true })` |
| Heading do drawer | "Lista de Participantes" (após abrir Inscrição) ou "Adicionar" (depois de clicar +Adicionar) |
| 3 abas no drawer | Confirmados / Pendentes / Cancelados com counter `(N)` cada |
| Form do "Adicionar" | Similar a `/users/new` Haml mas com `Data de expiração` extra |
| Após save | Drawer volta pra "Lista de Participantes" com toast + counter atualizado |

### Paridade Curso vs Trilha vs Pacote

Validado live: menu more_vert tem **"how_to_reg Inscrição"** nos 3 tipos.

| Tipo | Itens no menu more_vert | Diferenças |
|---|---|---|
| **Curso** (kind=0) | 11 menuitems | Padrão completo |
| **Trilha** (kind=3) | 11 menuitems | Idêntico ao Curso |
| **Pacote** (kind=4) | 8 menuitems | Sem "Página" (contact_page), "Gestor de turma" (supervisor_account), "Instrutor" (for_you). "Atividades" (sort) é renomeado para **"Conteúdos"** (`sort Conteúdos`) — semântica de pacote |

**Em todos os 3, o fluxo de matrícula é o mesmo**: more_vert → Inscrição → drawer → Adicionar → form → Salvar.

### Anti-pattern (rotas que NÃO existem)

| Tentativa | Resultado |
|---|---|
| `/o/{orgId}/events/{id}/learning_students` | **404** (rota Haml legada removida) |
| `/o/{orgId}/contents/{id}/learning_students` | **404** |
| Tab "Acesso" no form de edição do conteúdo | Só tem **regras de inscrição** (quem pode se inscrever, dias de acesso, anexos) — NÃO matricula |
| Aguardar `page.url()` mudar após Salvar matrícula | URL **não muda** — drawer client-side. Use `waitForResponse` ou aguardar texto do toast |

### Helper canônico `criarAlunoMatriculado`

```ts
// SeedAdminPage.ts (continua a classe)
export class SeedAdminPage extends BasePage {
  // ... createCurso / createTrilha / createPacote / criarUsuarioAluno ...

  /**
   * Matricula um aluno num Curso/Trilha/Pacote.
   *
   * App reusa user existente se o email bater; senão cria novo user inline.
   * Em ambos os casos, o aluno aparece em "Confirmados" do conteúdo.
   *
   * URL NÃO muda durante o fluxo — tudo client-side via drawer.
   * Pré-condição: user em perfil Administrador.
   */
  async matricularAluno(data: {
    contentName: string;       // nome exato do conteúdo p/ filtrar lista
    alunoEmail: string;
    alunoFirstName: string;
    alunoLastName: string;
    dataExpiracao?: string;    // opcional, formato DD/MM/AAAA
  }): Promise<void> {
    await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events`);

    // Filtra pra achar a row certa
    await this.page.getByPlaceholder('Pesquise aqui').fill(data.contentName);
    const row = this.page.locator('tr', { hasText: data.contentName }).first();
    await expect(row).toBeVisible({ timeout: 10000 });

    // more_vert → Inscrição
    await row.getByRole('button', { name: 'more_vert' }).click();
    await this.page.getByRole('menuitem', { name: /Inscrição/i }).click();

    // Drawer "Lista de Participantes" abre. Aguardar.
    await expect(this.page.getByRole('heading', { name: 'Lista de Participantes' })).toBeVisible();

    // Click "Adicionar" — é StaticText, não button
    await this.page.getByText('Adicionar', { exact: true }).first().click();

    // Form do participante abre. Aguardar.
    await expect(this.page.getByRole('heading', { name: 'Adicionar' })).toBeVisible();

    // Preencher 3 obrigatórios
    await this.page.getByLabel('E-mail').fill(data.alunoEmail);
    await this.page.getByLabel('Nome', { exact: true }).fill(data.alunoFirstName);
    await this.page.getByLabel('Sobrenome').fill(data.alunoLastName);

    if (data.dataExpiracao) {
      await this.page.getByLabel('Data de expiração').fill(data.dataExpiracao);
    }

    // Salvar (botão "Salvar" — NÃO "Salvar e Novo")
    await this.page.getByRole('button', { name: 'Salvar', exact: true }).click();

    // Confirma sucesso via toast
    await expect(this.page.getByText('Participante criado com sucesso.')).toBeVisible({ timeout: 10000 });
  }

  /**
   * Cancela a matrícula de um aluno por email.
   * Drawer abre via more_vert → Inscrição. Aluno é localizado na aba Confirmados.
   */
  async desmatricularAlunoSafe(data: {
    contentName: string;
    alunoEmail: string;
  }): Promise<void> {
    try {
      await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events`);
      await this.page.getByPlaceholder('Pesquise aqui').fill(data.contentName);
      const row = this.page.locator('tr', { hasText: data.contentName }).first();
      await row.getByRole('button', { name: 'more_vert' }).click();
      await this.page.getByRole('menuitem', { name: /Inscrição/i }).click();

      // No drawer, achar linha do aluno e clicar "Cancelar" daquela row
      const alunoRow = this.page.locator('tr', { hasText: data.alunoEmail }).first();
      await alunoRow.getByRole('button', { name: /cancelar/i }).click({ timeout: 5000 });
      // Confirmar cancelamento se modal aparecer
      await this.page.getByRole('button', { name: /confirmar|sim/i }).click({ timeout: 5000 });
    } catch {
      // já desmatriculado ou drawer fechado — ok
    }
  }
}
```

### Spec consumindo

```ts
test.describe('TC matrícula aluno num curso', () => {
  let cursoId: number;
  let cursoName: string;
  let alunoEmail: string;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    await new ProfileSwitcher(page).switchTo('Administrador');
    const seed = new SeedAdminPage(page);

    cursoName = `Curso TC1 w${test.info().workerIndex}-${Date.now()}`;
    cursoId = await seed.createCurso({ name: cursoName });

    alunoEmail = `aluno-tc1-w${test.info().workerIndex}-${Date.now()}@example.com`;
    await seed.criarUsuarioAluno({
      email: alunoEmail,
      firstName: 'Aluno',
      lastName: `TC1 w${test.info().workerIndex}`,
    });

    await seed.matricularAluno({
      contentName: cursoName,
      alunoEmail,
      alunoFirstName: 'Aluno',
      alunoLastName: `TC1 w${test.info().workerIndex}`,
    });

    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    await new ProfileSwitcher(page).switchTo('Administrador');
    const seed = new SeedAdminPage(page);

    // Ordem inversa: desmatricular → deletar usuário → deletar curso
    await seed.desmatricularAlunoSafe({ contentName: cursoName, alunoEmail });
    await seed.deleteUsuarioByEmailSafe(alunoEmail);
    await seed.deleteConteudoByIdSafe(cursoId);

    await context.close();
  });

  test('TC1 — Aluno matriculado aparece em Confirmados', async ({ page }) => {
    // ... usa cursoId, cursoName, alunoEmail
  });
});
```

## Anti-pattern (rota errada)

```ts
// ❌ ERRADO — rota Haml legada, retorna 422 silencioso
async createCurso(name: string) {
  await safeGoto(this.page, `/o/${getOrgId()}/events/new`);
  await this.page.getByLabel('Nome').fill(name);
  await this.page.getByRole('button', { name: 'Salvar' }).click();
  // POST /e → 422 "The change you wanted was rejected"
}
```

A rota `/o/{orgId}/events/new` **ainda renderiza HTML** (parece OK), mas
o POST `/e` (action do form) está desativado no facelift para admins.
Submit retorna **HTTP 422** com response genérico Rails "The change you
wanted was rejected" — assinatura clássica de CSRF check fail. Mas a
causa real é endpoint deprecated, não CSRF.

**Como detectar este anti-pattern em spec existente:**
- Spec naviga pra `/events/new` ou `/events/{id}/edit` (rotas Haml).
- Spec submete form via `page.getByRole('button', { name: 'Salvar' }).click()`
  e logo após a navegação cai em `/e` (URL truncada).
- Network logger mostra `POST /e [422]` no payload.

**Como migrar**:
1. Trocar `/events/new` por `/contents/new?kind=0` (Curso) ou `kind=3`
   (Trilha) ou `kind=4` (Pacote).
2. Preencher os 5 campos obrigatórios novos (especialmente "Tipo de
   experiência" e "Descrição" via iframe).
3. Após save, URL final é `/contents/{id}/edit` — capturar `{id}` via regex.

## Padrão canônico (form facelift React)

```ts
// projects/<slug>/pages/SeedAdminPage.ts
import type { Page, Locator, FrameLocator } from '@playwright/test';
import { expect } from '@playwright/test';
import { BasePage } from '../../../src/pages/BasePage.js';
import { safeGoto } from '../../../src/utils/modals.js';
import { getOrgId } from '../../../src/utils/environment.js';

export class SeedAdminPage extends BasePage {
  /** Editor rich-text da Descrição vive dentro de um <iframe>. */
  private getDescricaoFrame(): FrameLocator {
    return this.page.frameLocator('iframe[title^="Editor de Rich Text"]');
  }

  /**
   * Cria curso (kind=0) via UI admin do facelift React.
   * Retorna o contentId capturado de page.url() após o save.
   *
   * Pré-condição: user em perfil Administrador. Use
   * `ProfileSwitcher.switchTo('Administrador')` antes se necessário.
   */
  async createCurso(data: {
    name: string;
    tipoExperiencia?: string;  // default: 1ª opção da lista
    descricao?: string;        // default: "Seed automatizado"
    situacao?: 'Em desenvolvimento' | 'Liberado' | 'Suspenso';
    quemPodeVer?: 'Inscritos' | 'Colaborador' | 'Usuários' | 'Público';
  }): Promise<number> {
    return this.createConteudo({ kind: 0, ...data });
  }

  /** Cria trilha (kind=3) via mesma rota /contents/new. */
  async createTrilha(data: {
    name: string;
    tipoExperiencia?: string;
    descricao?: string;
    situacao?: 'Em desenvolvimento' | 'Liberado' | 'Suspenso';
    quemPodeVer?: 'Inscritos' | 'Colaborador' | 'Usuários' | 'Público';
  }): Promise<number> {
    return this.createConteudo({ kind: 3, ...data });
  }

  /**
   * Cria pacote (kind=4). Form sem Situação/Quem-pode-ver obrigatórios.
   */
  async createPacote(data: {
    name: string;
    tipoExperiencia?: string;
    descricao?: string;
  }): Promise<number> {
    return this.createConteudo({ kind: 4, ...data });
  }

  private async createConteudo(data: {
    kind: 0 | 3 | 4;
    name: string;
    tipoExperiencia?: string;
    descricao?: string;
    situacao?: string;
    quemPodeVer?: string;
  }): Promise<number> {
    await safeGoto(this.page, `/o/${getOrgId()}/contents/new?kind=${data.kind}`);

    // 1. Nome (obrigatório)
    await this.page.getByLabel(/^Nome \*/).fill(data.name);

    // 2. Tipo de experiência (obrigatório, combobox autocomplete)
    const tipoCombobox = this.page.getByRole('combobox', { name: /Digite ou selecione o tipo da experiência/i });
    await tipoCombobox.click();
    const tipoOpcao = data.tipoExperiencia
      ? this.page.getByRole('option', { name: data.tipoExperiencia, exact: true })
      : this.page.getByRole('listbox').getByRole('option').first();
    await tipoOpcao.click();

    // 3. Descrição (obrigatório, rich-text iframe)
    const descricaoText = data.descricao ?? 'Seed automatizado';
    await this.getDescricaoFrame().locator('body').fill(descricaoText);

    // 4. Situação (default OK pra Curso/Trilha; opcional pro Pacote)
    if (data.situacao && data.kind !== 4) {
      await this.page.getByLabel(/Situação/).selectOption({ label: data.situacao });
    }

    // 5. Quem pode ver (default OK pra Curso/Trilha; opcional pro Pacote)
    if (data.quemPodeVer && data.kind !== 4) {
      await this.page.getByLabel(/Quem pode ver/).selectOption({ label: data.quemPodeVer });
    }

    // 6. Salvar e capturar ID
    await this.page.getByRole('button', { name: /Salvar/i }).click();
    await this.page.waitForURL(/\/o\/\d+\/contents\/\d+\/edit/);
    const m = this.page.url().match(/\/contents\/(\d+)\/edit/);
    if (!m) throw new Error(`Falha capturando contentId após criar. URL: ${this.page.url()}`);
    return Number(m[1]);
  }

  /**
   * Variant *_safe: aceita ID inexistente, faz delete idempotente.
   * Funciona para Curso/Trilha/Pacote (mesma listagem + same more_vert menu).
   */
  async deleteConteudoByIdSafe(id: number): Promise<void> {
    try {
      // Navegar pra listagem com search pra reduzir DOM
      await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events`);
      // Localizar a linha do content e clicar more_vert
      // (seletor depende do testId que a listagem expõe — a confirmar live)
      const row = this.page.locator(`[data-test-id="content-row-${id}"]`).first();
      await row.getByRole('button', { name: 'more_vert' }).click({ timeout: 5000 });
      await this.page.getByRole('menuitem', { name: /Excluir|Delete/i }).click();
      await this.page.getByRole('button', { name: /Confirmar|Sim, excluir/i }).click();
      await expect(this.page.locator('.chakra-toast').filter({ hasText: /excluído|sucesso/i }).first()).toBeVisible({ timeout: 10000 });
    } catch {
      // já deletado ou nunca existiu — ok
    }
  }
}
```

### Spec consumindo a SeedAdminPage

```ts
import { test, expect } from '../../../../../src/fixtures/exploratory-fixture.js';
import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';
import { ProfileSwitcher } from '../../../../../src/pages/ProfileSwitcher.js';
import { safeGoto } from '../../../../../src/utils/modals.js';
import { getOrgId } from '../../../../../src/utils/environment.js';

const STORAGE_PATH = 'outputs/.auth/storage.json';

test.describe('Configuração de Conteúdo — Switch Habilitar reinscrição', () => {
  let cursoId: number;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    const profile = new ProfileSwitcher(page);
    await profile.switchTo('Administrador'); // pré-condição obrigatória
    const seed = new SeedAdminPage(page);
    cursoId = await seed.createCurso({
      name: `Curso Recertificação TC1 w${test.info().workerIndex}-${Date.now()}`,
    });
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    const profile = new ProfileSwitcher(page);
    await profile.switchTo('Administrador');
    const seed = new SeedAdminPage(page);
    await seed.deleteConteudoByIdSafe(cursoId);
    await context.close();
  });

  test('TC1 — Switch aparece com flag ON', async ({ page }) => {
    await safeGoto(page, `/o/${getOrgId()}/contents/${cursoId}/edit`);
    // ... validações do TC
  });
});
```

E **nenhum `.data.ts` com placeholder**. O ID real vive em variável de
escopo do describe, capturada do `beforeAll`.

## Convenção de naming (worker-isolated)

```
<TipoRecurso> <ProjetoSlug> TC<N> w<workerIndex>-<timestamp>
```

Exemplos:
- `Curso Recertificação TC1 w0-1748290800123`
- `Trilha Recertificação TC7 w2-1748290800999`
- `Pacote Recertificação TC4 w0-1748290800123`
- `aluno-tc3-w0-1748290800123@example.com`

**Por quê:** se 2 workers Playwright rodam em paralelo (ou 2 runs
sucessivas no mesmo dia), `workerIndex` + `timestamp` garantem nomes
únicos → zero colisão.

## Integração com fixtures (opcional, mas recomendado)

```ts
// src/fixtures/seed-fixtures.ts
import { test as base } from './exploratory-fixture.js';
import { SeedAdminPage } from '../../projects/<slug>/pages/SeedAdminPage.js';
import { ProfileSwitcher } from '../pages/ProfileSwitcher.js';

const STORAGE_PATH = 'outputs/.auth/storage.json';

export const test = base.extend<{
  cursoSeed: { id: number; name: string };
}>({
  cursoSeed: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    await new ProfileSwitcher(page).switchTo('Administrador');
    const seed = new SeedAdminPage(page);
    const name = `Curso Seed w${test.info().workerIndex}-${Date.now()}`;
    const id = await seed.createCurso({ name });
    await context.close();

    await use({ id, name });

    // Cleanup
    const ctxCleanup = await browser.newContext({ storageState: STORAGE_PATH });
    const pageCleanup = await ctxCleanup.newPage();
    await new ProfileSwitcher(pageCleanup).switchTo('Administrador');
    await new SeedAdminPage(pageCleanup).deleteConteudoByIdSafe(id);
    await ctxCleanup.close();
  }, { scope: 'test' }],
});
```

Spec consome:

```ts
test('TC1 — ...', async ({ page, cursoSeed }) => {
  await page.goto(`/o/${getOrgId()}/contents/${cursoSeed.id}/edit`);
  // ...
});
```

## Quando `test.fixme` por seed AINDA é legítimo

Categoria §7.6 F vale **somente** quando o recurso pré-condição:

1. **Exige DB write direto** sem rota UI equivalente (ex.: setar
   `event_participant.progress_score=100` sem rodar o worker que
   computa progresso).
2. **Exige worker assíncrono** que não é triggável via UI admin (ex.:
   `IssuesCertificates`, `ExpiresCertificates`).
3. **Exige Flipper toggle runtime** — usar [[testar-feature-flag-twygo]],
   não esta skill.
4. **Exige Super Admin / DevOps action** — usar
   [[alterar-funcionalidade-contrato-twygo]] ou similar.
5. **Exige env secundário não configurado** — config infra.

Em todos esses casos, mensagem do `fixme` deve apontar **categoria
exata** e **ação concreta** (ex.: "requer worker IssuesCertificates +
DB write em certificates.situation=4 — Sidekiq não triggável via UI
admin").

**Se a pré-condição cair em "criar curso/trilha/pacote/aluno"**, é
SEMPRE caso desta skill — nunca fixme.

## Ordem de operações com dependência

Quando o spec precisa de `participant matriculado num curso`:

1. `createCurso({ name })` → captura `cursoId`
2. `criarUsuarioAluno({ email, name })` → captura `userId`
3. `criarAlunoMatriculado({ cursoId, userId })` → captura `participantId`

`afterAll` reverte na ordem inversa (filho → pai):

1. `deleteParticipantSafe(participantId)` — desinscreve
2. `deleteUsuarioSafe(userId)` — deleta usuário
3. `deleteConteudoByIdSafe(cursoId)` — deleta curso

Sem essa ordem, produto pode bloquear delete do curso com "tem
participants vinculados" (similar a modal "Painel em uso").

## Regras duras

1. **NUNCA `test.fixme(true, 'seed inválido')`** quando o recurso é
   criável via UI admin. Categoria §7.6 F NÃO se aplica.
2. **NUNCA usar `/o/{orgId}/events/new`** como rota de criar curso/trilha/pacote
   no projeto Recertificação (ou outro projeto que rode contra Twygo
   facelift) — rota Haml legada, retorna 422 silencioso. Usar SEMPRE
   `/o/{orgId}/contents/new?kind=N`.
3. **SEMPRE pareado com cleanup** — `afterAll` deletando via variant
   `*_safe` (regra dura §7.6 G + [[limpar-dados-de-teste-twygo]]).
4. **NUNCA nome literal de recurso** (`'Curso Teste'`) — sempre
   worker-isolated.
5. **NUNCA `context.close()` ausente** no beforeAll/afterAll — sem isso,
   o browser context vaza entre testes.
6. **SEMPRE capturar ID real** de `page.url()` após o save — não
   adivinhar / não usar placeholder.
7. **NUNCA mexer em estado de outro spec** — cada spec cria seu próprio
   recurso; zero compartilhamento (worker isolation).
8. **SEMPRE verificar perfil Admin** ativo antes de chamar `createX` —
   `ProfileSwitcher.switchTo('Administrador')` no beforeAll. Sem isso
   `/contents/new?kind=N` retorna "Sem permissão" mesmo com storageState
   válido.

## Anti-patterns a evitar

| Anti-pattern | Por quê |
|---|---|
| `test.fixme(true, 'seed inválido — eventId placeholder')` | É exatamente o caso que esta skill destrava. Não marque fixme — crie o seed. |
| `cursoExistenteId: 1` em `.data.ts` com `REVISAR-SEED` | Placeholder nunca vira valor real. Crie via `beforeAll`. |
| `safeGoto(page, '/o/.../events/new')` em qualquer createX | Rota Haml deprecated; 422. Use `/contents/new?kind=N`. |
| `getByLabel('Nome').fill(...)` sem regex pro asterisco | Form facelift exibe "Nome *" — `getByLabel('Nome')` exato pode dar miss. Use `getByLabel(/^Nome \*/)` ou `getByRole('textbox', { name: /Nome/i })`. |
| Esquecer combobox "Tipo de experiência" obrigatório | Form não submete sem isso. Não está no Haml legado, só no facelift. |
| Preencher Descrição com `page.fill(...)` direto | É iframe rich-text. Precisa `frameLocator()`. |
| Assumir kind=1 pra Trilha | É kind=3. kind=1/2 não estão expostos no menu UI. |
| Skip switch pra Admin no beforeAll | Sem isso, `/contents/new?kind=N` retorna 403 "Sem permissão". |
| Capturar `userId` de `page.url()` após save em `/users/new` | Form Haml redireciona pra `/o/{orgId}/users` (lista), não `/users/{id}/edit`. Use busca por email + link Editar (estratégia A). |
| Esperar `data-testid` no form de Novo Usuário | Form é Haml legado — preferir `getByLabel` exato. Facelift não cobriu essa tela ainda. |
| Navegar pra `/o/{orgId}/events/{id}/learning_students` pra matricular | Rota retorna **404**. Não existe mais. Matrícula vive em drawer client-side via more_vert → Inscrição. |
| `getByRole('button', { name: 'Adicionar' })` no drawer de matrícula | "Adicionar" é renderizado como StaticText (span estilizado), NÃO `role=button`. Use `getByText('Adicionar', { exact: true })`. |
| Aguardar URL mudar após matricular aluno | Drawer client-side — URL não muda. Aguarde o toast `"Participante criado com sucesso."` ou `waitForResponse` no POST. |
| `const cursoName = 'Curso Teste'` | Colisão entre runs. Use `w${workerIndex}-${Date.now()}`. |
| `beforeAll` sem `afterAll` pareado | Lixão cumulativo. Regra §7.6 G + [[limpar-dados-de-teste-twygo]]. |
| Compartilhar curso entre 2 specs (criado num, usado no outro) | Quebra worker isolation. Cada spec cria o seu. |
| Usar `page` do test no beforeAll | `page` do test ainda não existe no beforeAll. Use `browser.newContext()`. |

## Como propagar essa skill aos generators

Quando o orchestrator chamar `playwright-test-generator` para um spec
novo:

1. Generator deve detectar pré-condições do MD (campo
   `preconditions` ou prosa "X pré-existente").
2. Pra cada pré-condição, decidir via tabela "Catálogo de pré-condições
   Twygo" acima: UI? Sim → `beforeAll` + `afterAll`. Não → `fixme`
   legítimo + motivo.
3. Se `SeedAdminPage` não existe no projeto, generator deve criar com
   helpers necessários (`createCurso`, `createTrilha`, `createPacote`,
   `deleteConteudoByIdSafe`, etc) seguindo o padrão acima.
4. Spec final usa fixture custom OU describe-local beforeAll/afterAll.
5. Generator deve incluir `ProfileSwitcher.switchTo('Administrador')`
   no beforeAll se o helper criar via UI admin.

## Skills relacionadas

- [[limpar-dados-de-teste-twygo]] — afterAll/afterEach com variant `*_safe`
- [[trocar-perfil-twygo]] — switch pra Administrador via popover
- [[fechar-modais-twygo]] — `safeGoto` cobre modais oportunísticos
- [[testar-feature-flag-twygo]] — quando pré-condição é flag ON
- [[alterar-funcionalidade-contrato-twygo]] — quando pré-condição é
  feature no contrato
- [[criar-spec-resiliente-twygo]] — princípios gerais que `beforeAll`
  com criação via UI precisa seguir

## Histórico

- **v1.3.0 (2026-05-26)**: validado live matrícula de aluno nos 3 tipos
  (Curso 806852, Trilha 806853, Pacote 806854) no env `staging-recertificacao`.
  Mudanças:
  - Nova seção "Matrícula de aluno (Inscrição) — drawer client-side".
  - **Caminho canônico**: lista `/events?tab=events` → row more_vert →
    "Inscrição" → drawer "Lista de Participantes" → click "Adicionar" →
    form de participante → Salvar. NÃO existe rota direta — tudo via UI da lista.
  - **Rotas que NÃO existem** documentadas como anti-pattern:
    `/o/{orgId}/events/{id}/learning_students`, `/o/{orgId}/contents/{id}/learning_students` — ambas retornam 404. Tab "Acesso" do form de edição
    só tem regras, não matrícula.
  - **Comportamento client-side**: URL não muda durante drawer. Não capturar
    via `page.url()` — use toast `"Participante criado com sucesso."` ou
    `waitForResponse` no POST do backend.
  - **Reuso de user existente**: se email já está cadastrado na org, app só
    matricula. Se é novo, cria user + matricula numa única ação. Ideal pra
    seed automatizado.
  - **Botão "Adicionar" é StaticText**, NÃO `role=button`. `getByRole('button', { name: 'Adicionar' })` falha. Use `getByText('Adicionar', { exact: true })`.
  - **Paridade Curso/Trilha/Pacote** documentada: menu more_vert tem
    "Inscrição" nos 3, mas Pacote tem menu reduzido (8 vs 11 itens — sem
    Página/Gestor/Instrutor, e "Atividades" vira "Conteúdos").
  - Helper canônico `matricularAluno({ contentName, alunoEmail, ... })`.
  - Helper de cleanup `desmatricularAlunoSafe`.
  - Atualizada tabela "Catálogo de pré-condições" com fluxo correto.
- **v1.2.0 (2026-05-26)**: validado live `createUsuarioAluno` no env
  `staging-recertificacao` (orgId 37048). Mudanças:
  - Nova seção "Form de Novo Usuário (rota Haml legado)" — `/users/new`
    NÃO foi migrada pro facelift; ainda Haml mas funciona sem 422.
  - Obrigatórios validados: E-mail*, Nome*, Sobrenome* (3 campos
    separados, não "name" único).
  - Default sem checkbox de perfil = Aluno. Sem switch necessário pro
    user gerado ser aluno.
  - **Diferença crítica**: redirect pós-save vai pra `/o/{orgId}/users`
    (listagem), NÃO pra `/users/{id}/edit`. Helper `criarUsuarioAluno`
    NÃO pode capturar userId via `page.url()`. 3 estratégias
    documentadas (busca por email + link Editar, response.headers
    Location, ou usar email como chave primária).
  - Helper canônico `criarUsuarioAluno` retornando `{ userId, email }`
    via estratégia (A). Cleanup via `deleteUsuarioByEmailSafe(email)`.
  - Tabela comparativa Haml vs facelift (campos, validação, redirect,
    asterisco).
  - Anti-pattern novo: assumir redirect pós-save igual ao Curso quando
    é Usuário.
- **v1.1.0 (2026-05-26)**: corrigida após validação live no env
  `staging-recertificacao` (orgId 37048). Mudanças:
  - Rota canônica corrigida: `/o/{orgId}/contents/new?kind=N` (facelift
    React), NÃO `/o/{orgId}/events/new` (Haml legado, retorna 422).
  - Mapping kind validado live: Curso=0, Trilha=3 (não 1!), Pacote=4
    (não 2!). kind=1/2 não estão expostos.
  - Helper `createCurso` reescrito pro form facelift: Tipo de
    experiência obrigatório (combobox autocomplete), Descrição em
    iframe rich-text, sem field "Habilitar reinscrição" inline (vive
    em tab posterior).
  - Pré-condição perfil Admin explicitada (sem switch, 403).
  - Anti-pattern novo (rota errada) documentado com sintoma.
  - Catálogo de pré-condições atualizado com mapping correto.
- **v1.0.0 (2026-05-26)**: criada após incidente Recertificação. 25
  TCs marcados fixme "seed inválido" quando deveriam ter beforeAll
  criando o curso via UI. Continha rota errada (`/events/new`) que
  causava 422 — corrigido em v1.1.
