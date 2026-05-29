---
name: provisionar-seed
description: Quando um TC Playwright declara pré-condição como "curso pré-existente", "curso com has_recertification=true", "aluno matriculado", "participant com progresso", "aluno com certificado emitido", "trilha com 3 cursos filhos", etc, o spec NÃO pode marcar `test.fixme(true, 'seed inválido')` nem depender de IDs hardcoded em `.data.ts` placeholder. Em vez disso, o spec **declara dependência via fixture canônica** (`cursoSeed`/`cursoLiberadoSeed`/`cursoComRecertificacaoSeed`/`cursoComAtividadesMarcaveisSeed`/`alunoMatriculadoSeed`/`alunoComSenhaSeed`/`alunoAprovadoSeed` em `src/fixtures/seed-fixtures.ts`) — a fixture provê o recurso (criando ou reusando) e faz cleanup automático `afterAll` via variant `*_safe`. Mapping pré-condição→fixture é tabela canônica que generator/healer consultam. Fluxo do seed cobre: criação via UI admin (rotas validadas live `/contents/new?kind=N` facelift React p/ Curso/Trilha/Pacote, `/users/new` Haml legado p/ Usuário), matrícula via lista→more_vert→"Inscrição"→drawer→"Adicionar", matrícula COM SENHA via expand h3 colapsado + scroll progressivo, configuração de curso (publicar via tab Identificação, ligar `has_recertification` via tab Acesso switch Chakra), engajamento do aluno via `/e/{id}/learn` + checkbox "Marcar como concluído" em vídeo/SCORM/Aula configurados no admin, emissão automática de cert validável via `/api/v2/attendees`. Anti-patterns proibidos: `/events/new` Haml deprecated, `/contents/{id}/learning_students` (404), `fixme` por seed quando fixture cobre. Skill define o padrão canônico — catálogo de helpers (`createCurso`/`createTrilha`/`createPacote`/`criarUsuarioAluno`/`matricularAluno`/`matricularAlunoComSenha`/`setHasRecertification`/`publicarCurso`/`completarCursoComoAluno`/`desmatricularAlunoSafe`) + login OAuth do aluno + validar cert via API V2, mapping kind→Recurso, naming worker-isolated, scope worker pra amortizar custo, quando reusar `data/fixed-seed.data.ts` (seed permanente), e quando `fixme` por seed AINDA é legítimo (DB-only/mailer/Flipper toggle). Use ao gerar/revisar QUALQUER spec novo que tenha pré-condição "X existe no env" — converter em ação automatizada via fixture.
version: 1.7.1
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
   * Variante com SENHA — grava password do aluno pra permitir login OAuth
   * (POST /oauth/token grant_type=password). Útil quando o seed precisa
   * autenticar o aluno em context novo (ex: completar curso pelo Play).
   *
   * Características descobertas live (2026-05-28, commit c407914):
   *  - Form Materialize tem seção **Senha** com h3 colapsado (onclick
   *    inline jQuery: `$('.create_password').toggleClass('hidden')`)
   *  - Posição y≈1490px do form → FORA do viewport padrão (~678 altura)
   *  - `state:'visible'` do Playwright FALHA pelo viewport check
   *  - `page.locator('h3', { hasText: /^Senha$/ })` quebra (strict mode
   *    warning); usar CSS `:has-text("Senha")` é mais robusto
   *  - Após click no h3 + scroll, inputs `#password` e
   *    `#password_confirmation` ficam visíveis
   */
  async matricularAlunoComSenha(data: {
    contentName: string;
    alunoEmail: string;
    alunoFirstName: string;
    alunoLastName: string;
    alunoSenha: string;
    dataExpiracao?: string;
  }): Promise<void> {
    await this.ensureAdminProfile();
    await safeGoto(this.page, `/o/${getOrgId()}/events?tab=events&profile=admin`);
    await this.page.getByPlaceholder(/Pesquise aqui/i).fill(data.contentName);
    const row = this.page.locator('tr, [role="row"]')
      .filter({ hasText: data.contentName }).first();
    await row.waitFor({ state: 'visible', timeout: 10_000 });

    const kebab = row
      .locator('[data-test-id^="events-"][data-test-id$="-actions-kebab"]')
      .first();
    await kebab.scrollIntoViewIfNeeded();
    await kebab.click();
    await this.page.getByRole('menuitem', { name: /Inscrição/i }).first().click();

    await this.page
      .getByRole('heading', { name: /Lista de Participantes/i }).first()
      .waitFor({ state: 'visible', timeout: 15_000 });
    const confirmadosBefore = await this.contagemConfirmados();

    await this.page.getByText('Adicionar', { exact: true }).first().click();
    await this.page
      .getByRole('heading', { name: /^Adicionar$/i }).first()
      .waitFor({ state: 'visible', timeout: 10_000 });

    // 3 obrigatórios
    await this.page.getByRole('textbox', { name: /E-?mail\*/i }).first().fill(data.alunoEmail);
    await this.page.getByRole('textbox', { name: /^Nome\*$/i }).fill(data.alunoFirstName);
    await this.page.getByRole('textbox', { name: /^Sobrenome\*$/i }).fill(data.alunoLastName);

    // Scroll progressivo + expand h3 Senha (lazy render no Materialize)
    await this.page.evaluate(async () => {
      const total = document.body.scrollHeight;
      for (let y = 0; y < total; y += 400) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    const senhaH3 = this.page.locator('h3:has-text("Senha")').first();
    await senhaH3.scrollIntoViewIfNeeded();
    await senhaH3.click();
    await this.page.locator('#password').waitFor({ state: 'visible', timeout: 5_000 });
    await this.page.locator('#password').fill(data.alunoSenha);
    await this.page.locator('#password_confirmation').fill(data.alunoSenha);

    await dismissCommonModals(this.page);
    await this.page.getByRole('button', { name: 'Salvar', exact: true }).click();

    await this.page
      .getByRole('heading', { name: /Lista de Participantes/i }).first()
      .waitFor({ state: 'visible', timeout: 15_000 });
    await expect.poll(async () => this.contagemConfirmados(), { timeout: 10_000 })
      .toBeGreaterThan(confirmadosBefore);
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

## Engajamento do aluno (completar curso até cert)

**Specs de referência executáveis** (rodam contra
`staging-recertificacao` orgId 37048, curso 807403):

| Spec | Cobre | Como rodar |
|------|-------|------------|
| `tests/setup/seed-aluno-engajamento.spec.ts` | Cria aluno COM SENHA via UI + valida user_id | `RUN_SEED_ALUNO_ENGAJAMENTO=1 npx playwright test tests/setup/seed-aluno-engajamento.spec.ts` |
| `tests/setup/seed-aluno-engajamento-completo.spec.ts` | Pipeline full (criar + OAuth + login UI + completar curso + cert via API) | `RUN_SEED_ENGAJAMENTO_COMPLETO=1 npx playwright test tests/setup/seed-aluno-engajamento-completo.spec.ts` |

Cert real emitido pelo pipeline em 2026-05-28 (commit 168ea72):
- `attendee_id: 44275031`
- `progress: 60%`
- `certificate_id: 5027067` (`situation: valid`)
- Tempo total: 9.1 min (inclui poll 7×5s pro worker)



Investigação live 2026-05-28 no curso 807403 ("Curso com atividades", 11
atividades de tipos variados):

| Tipo de atividade  | Marca-se completa só com click? | Como avançar via UI                  |
|--------------------|---------------------------------|--------------------------------------|
| Texto              | ✅ Sim (automático)             | Clicar no card                       |
| Página             | ✅ Sim (automático)             | Clicar no card                       |
| Arquivo (PDF/JPG)  | ✅ Sim (automático)             | Clicar no card                       |
| Aula               | ❌ Não — exige assistir         | Config admin "checkmark" + checkbox player |
| Vídeo (arquivo)    | ❌ Não — exige assistir          | Config admin `mark_completed_video` + checkbox |
| Vídeo (externo)    | ❌ Não — exige assistir          | Config admin `mark_completed_external` + checkbox |
| SCORM              | ❌ Não — exige API SCORM         | Config admin `mark_completed_scorm` + checkbox |
| Questionário       | ❌ Não — exige responder         | Responder ≥ acerto-mínimo            |

### Atalho descoberto live (2026-05-28): "Permitir marcar concluído manualmente"

Cada atividade Twygo tem opção admin `Permitir marcar concluído manualmente`
que, quando ativa, expõe checkbox `Marcar como concluído` embaixo do
player do aluno (`/e/{id}/learn`). Isso é **a forma canônica** de
completar atividades vídeo/SCORM/Aula em seeds — não precisa simular
`<video>.ended` nem injetar SCORM API.

**Configurar via admin** (form HAML `/e/{eventId}/contents/{contentId}/edit`):

```js
// Admin context — config single activity
await page.goto(`/e/${eventId}/contents/${activityId}/edit`);
for (const cbid of ['mark_completed_scorm', 'mark_completed_video',
                    'mark_completed_external', 'checkmark']) {
  const cb = await page.$(`#${cbid}`);
  if (cb && !(await cb.isChecked())) {
    await page.locator(`label[for="${cbid}"], label:has(#${cbid})`).click();
  }
}
await page.locator('button[type="submit"]:has-text("Salvar")').click();
```

**Helper `configurarMarcarConcluidoManualmente(activityIds[])`** (proposto — não implementado ainda):

```ts
// SeedAdminPage.ts (futuro helper canônico)
async configurarMarcarConcluidoManualmente(eventId: number, activityIds: number[]): Promise<void> {
  await this.ensureAdminProfile();
  for (const id of activityIds) {
    await safeGoto(this.page, `/e/${eventId}/contents/${id}/edit`);
    for (const cbid of ['mark_completed_scorm', 'mark_completed_video',
                        'mark_completed_external', 'checkmark']) {
      const cb = this.page.locator(`#${cbid}`);
      if ((await cb.count()) > 0 && !(await cb.isChecked())) {
        await this.page.locator(`label[for="${cbid}"]`).click().catch(() => {});
      }
    }
    await this.page.getByRole('button', { name: 'Salvar', exact: true }).click();
    await this.page.waitForURL(/\/e\/\d+\/contents/, { timeout: 10_000 }).catch(() => undefined);
  }
}
```

**Como descobrir os `activityId`** (lista todas as atividades de um curso):

```ts
await page.goto(`/e/${eventId}/contents`);
const ids = await page.evaluate(() =>
  Array.from(document.querySelectorAll('li.dd-item'))
    .filter((li) => li.getAttribute('data-id'))
    .map((li) => ({
      id: Number(li.getAttribute('data-id')),
      title: li.getAttribute('data-title') ?? '',
    })),
);
```

**Aluno marca via player** (após config):

```js
// Já navegado em /e/{id}/learn + clicou no card da atividade
const completoCheckbox = alunoPage.locator(
  'input[type="checkbox"][id*="complet"], label:has-text("Marcar como concluído")'
).first();
if (await completoCheckbox.isVisible({ timeout: 1500 }).catch(() => false)) {
  await completoCheckbox.click({ force: true });
}
```

**Conclusão (atualizada 2026-05-28, cert 5027067 emitido):**

A emissão do certificado **NÃO depende de 100% de progresso** — depende
do critério de aprovação configurado no próprio curso. Validado live no
curso 807403 ("Curso com atividades"):

  - **Critério de aprovação = 60%** (config do curso, ajustável por admin)
  - Aluno clicou 11 atividades → progresso real 60% (texto/página/arquivo
    auto + 2 vídeos via checkbox "marcar manualmente")
  - Modal "Parabéns! Aprovação atingida" disparou
  - **Cert 5027067 emitido** (situation=valid, expira em 10 dias)

Caminhos para garantir aprovação:

1. **Recomendado**: criar curso seed canônico com **só atividades
   simples** (texto/página/arquivo) — todas marcam-se auto. Independe
   de critério (mesmo 100% é trivial).
2. **Atalho via config admin** (validado live): ativar
   `Permitir marcar concluído manualmente` em cada atividade
   vídeo/SCORM/Aula — expõe checkbox no player do aluno.
3. **Ajustar critério do curso**: editar curso → setar % de aprovação
   compatível com seed (ex: 30% = só clicar 3 texto/página).
4. **SeedAdminPage.matricularAlunoComSenha + completar curso pelo Play**
   é a pipeline canônica (validada em `tests/setup/seed-aluno-engajamento-completo.spec.ts`,
   commit 168ea72).

### Fluxo canônico (aluno completa curso via UI)

```ts
// 1. Login OAuth do aluno em context novo (storageState empty)
const alunoCtx = await browser.newContext({ storageState: { cookies: [], origins: [] } });
const alunoPage = await alunoCtx.newPage();
await safeGoto(alunoPage, '/users/login');
await alunoPage.getByRole('textbox', { name: 'Login' }).fill(email);
await alunoPage.getByRole('textbox', { name: 'Senha' }).fill(senha);
await alunoPage.getByRole('button', { name: 'Entrar' }).click();
await alunoPage.waitForURL((url) => !url.pathname.startsWith('/users/login'));

// 2. Acessar curso pelo /e/{id} (rota canônica do facelift)
await safeGoto(alunoPage, `/e/${cursoId}`);

// 3. Aceitar consentimento (se aparecer) + APRENDER
const aceitar = alunoPage.getByRole('button', { name: /^Aceitar$/i }).first();
if (await aceitar.isVisible({ timeout: 3_000 }).catch(() => false)) await aceitar.click();
await alunoPage.getByRole('button', { name: /^APRENDER$/i }).click();
// URL muda pra /e/{id}/learn

// 4. Iterar cards de atividade (h2 na sidebar direita) e clicar cada um.
//    Atividades simples avançam progresso automático. Para vídeo/SCORM/
//    Aula configurados com "marcar concluído manualmente", clicar
//    checkbox abaixo do player.
const activityNames = await alunoPage.evaluate(() =>
  Array.from(document.querySelectorAll('h2'))
    .filter((h) => (h as HTMLElement).offsetParent !== null && (h.textContent || '').length < 50)
    .map((h) => (h.textContent || '').trim()),
);
for (const name of activityNames) {
  await alunoPage.locator(`h2:has-text("${name}")`).first().click();
  await alunoPage.waitForTimeout(2_000);
  // Checkbox "Marcar como concluído" — só aparece em vídeo/SCORM/Aula
  // após admin ativar a config "Permitir marcar manualmente".
  const completoCheckbox = alunoPage.locator(
    'input[type="checkbox"][id*="complet"], label:has-text("Marcar como concluído")'
  ).first();
  if (await completoCheckbox.isVisible({ timeout: 1_500 }).catch(() => false)) {
    await completoCheckbox.click({ force: true });
    await alunoPage.waitForTimeout(1_500);
  }
}

// 5. Quando o critério de aprovação é atingido, modal "Parabéns!
//    Aprovação atingida" interrompe o loop. Fechar com botão "Ok"
//    pra continuar com remanescentes (ou parar — cert já está sendo
//    gerado async).
const aprovacaoModal = alunoPage.getByText(/Aprovação atingida|Parabéns/i).first();
if (await aprovacaoModal.isVisible({ timeout: 2_000 }).catch(() => false)) {
  console.log('🏆 Aprovação atingida — cert será emitido async');
  await alunoPage.getByRole('button', { name: /^Ok$/i }).first().click().catch(() => {});
}

// 6. Validar progresso via página (text "%") ou API V2 (ver §"Validar progresso + certificate via API V2")
const progresso = await alunoPage.evaluate(() => {
  const m = document.body.innerText.match(/(\d+)%/);
  return m ? Number(m[1]) : 0;
});
```

### Login OAuth do aluno (validar senha gravada)

```ts
const ctx = await playwrightRequest.newContext({ baseURL: process.env.API_BASE_URL });
const resp = await ctx.post('/oauth/token', {
  data: { grant_type: 'password', username: alunoEmail, password: alunoSenha },
  headers: { 'Content-Type': 'application/json' },
});
expect(resp.status()).toBe(200);
const { access_token } = await resp.json();
await ctx.dispose();
```

### Validar progresso + certificate via API V2

```ts
// Endpoint canônico (validado live 2026-05-28):
const resp = await ctx.get(`/api/v2/attendees?content_id=${eventId}&user_id=${userId}`, {
  headers: { Authorization: `Bearer ${API_TOKEN}` },
});
const attendee = (await resp.json()).data.attendees[0];
// Campos completos do attendee:
// {
//   attendee_id:                       Number  (event_participants.id)
//   user_id, content_id,
//   content_type:                      'course' | 'learning_path' | 'package'
//   origin_organization_id, origin_organization_name, origin_organization_corporate_name,
//   status:                            'confirmed' | 'pending' | 'cancelled'
//   progress:                          Number (0-100)
//   score:                             Number (0-100)
//   questionary_average:               Number — média das questões respondidas
//   attendance_score:                  Number — % de presença (chamada)
//   approved_at:                       ISO date | null — populado quando atinge critério
//   completed_at:                      ISO date | null — só em 100% (concluiu TUDO)
//   created_at:                        ISO date — quando matriculou
//   certificates: [{                   array vazio até worker emitir
//     certificate_id,
//     certificate_situation:           'valid' | 'expired' | 'replaced' | 'pending'
//     certificate_issuing_date,
//     certificate_expiration_date,    — null se cert não expira
//     certificate_link                 — URL pra baixar cert PDF
//   }]
// }
```

**Distinção importante:**
- `approved_at` populado = critério do curso atingido (≥ % mínima de aprovação)
- `completed_at` populado = TODAS as atividades concluídas (100%)
- `certificates[].certificate_situation = 'valid'` = cert emitido e válido
- Cert pode ter `valid` mesmo com `completed_at: null` (aprovação ≠ conclusão)

**Worker async:** cert é gerado ~30s após `approved_at`. Use poll:

```ts
for (let i = 0; i < 12; i++) {
  const r = await ctx.get(`/api/v2/attendees?...`, {...});
  const att = (await r.json()).data?.attendees?.[0];
  if (att?.certificates?.length > 0) return att;
  await new Promise(r => setTimeout(r, 5_000));
}
```

**Endpoints que NÃO existem (validado 2026-05-28, retornam 404):**
- `/api/v2/contents/{X}/event_participants`
- `/api/v2/events/{X}/learning_students`
- `/api/v2/event_students?event_id={X}&user_id={Y}`

## Catálogo COMPLETO de seeds (implementados + roadmap)

Status de cada helper de seed disponível no projeto Recertificação. Generator/
healer DEVE consultar antes de gerar spec — se há helper canônico, usar;
se está `[NOT_IMPLEMENTED]`, marcar `fixme` legítimo com motivo + ID do
roadmap (ex: `seed-roadmap-pacote-1`).

### Recursos básicos (criação)

| Helper | Status | Local | Notas |
|---|---|---|---|
| `createCurso({ name, ... })` | ✅ implementado | `SeedAdminPage` | Rota facelift `/contents/new?kind=0` |
| `createTrilha({ name, ... })` | ✅ implementado | `SeedAdminPage` | Rota facelift `/contents/new?kind=3` |
| `createPacote({ name, cursosIds?, ... })` | ✅ implementado e validado live (v1.7.0) | `SeedAdminPage` | Rota `/contents/new?kind=4` (igual createCurso facelift). Validado live 2026-05-28 (id 807420 criado em 1.3min). `cursosIds` ainda lança erro (wizard multi-step pra vincular cursos não coberto) |
| `criarUsuarioAluno({ email, firstName, lastName })` | ✅ implementado | `SeedAdminPage` | Rota Haml `/users/new` (não migrada pro facelift) |

### Matrícula

| Helper | Status | Local | Notas |
|---|---|---|---|
| `matricularAluno({ contentName, alunoEmail, ... })` | ✅ implementado | `SeedAdminPage` | Drawer Inscrição. URL não muda |
| `matricularAlunoComSenha({ ..., alunoSenha })` | ✅ implementado | `SeedAdminPage` | Idem + expand h3 Senha + scroll |
| `desmatricularAlunoSafe({ contentName, alunoEmail })` | ✅ implementado | `SeedAdminPage` | Idempotente — cleanup safe |

### Configuração de curso (tabs do edit facelift)

| Helper | Status | Local | Notas |
|---|---|---|---|
| `setHabilitarReinscricao(enabled)` | ✅ implementado | `ContentEditPage` | Tab Acesso, checkbox `#has_recertification` |
| `setHasRecertification(eventId, enabled)` | ✅ implementado | `SeedAdminPage` | Atalho de setup — delega `ContentEditPage.openEditByIdInAcessoTab + setHabilitarReinscricao + save + expectSaveSuccess`. Idempotente. Pré-condição: flag `:recertificacao` ON na org |
| `publicarCurso(eventId)` | ✅ implementado | `SeedAdminPage` | Tab Identificação → Situação=Liberado |
| `expirarCertificadoDoAluno({cursoId, alunoEmail})` | ✅ implementado (v1.7.0) | `SeedAdminPage` | Aprendizagem → kebab linha aluno aprovado (`certState: 'Emitido'`) → "Expirar certificado". Aluno fica em estado "elegível por cert expirado" — Suite 2 TC1 (b) |
| `setCriterioAprovacao(eventId, percentual)` | 🟡 implementado, recon pendente (v1.7.0) | `SeedAdminPage` | Tab Aprovação — input por `getByLabel`/`spinbutton`. Validar live antes do 1º consumidor |
| `setQuemPodeVer(eventId, audiencia)` | 🟡 implementado, recon pendente (v1.7.0) | `SeedAdminPage` | Combobox tab Identificação — `getByLabel` ou 2º combobox autocomplete |
| `setHabilitarChat(eventId, enabled)` | ✅ implementado (v1.7.0) | `SeedAdminPage` | Checkbox `#enable_twygo_chat` na tab Identificação (id validado live 2026-05-28) |
| `setBanner(eventId, imagemPath)` | 🟡 implementado, recon pendente (v1.7.0) | `SeedAdminPage` | `<input type="file">` na tab Banner via `setInputFiles` |
| `setCobranca(eventId, {preco, gatewayName?})` | 🟡 implementado, recon pendente (v1.7.0) | `SeedAdminPage` | Tab Cobrança — exige gateway configurado no env. `getByLabel(/Preço|Valor/)` |
| `setLocalizacao(eventId, {modalidade})` | 🟡 implementado, recon pendente (v1.7.0) | `SeedAdminPage` | Radio ou combobox `Presencial/Online/Híbrido` na tab Localização |
| `setCompartilhamento(eventId, {linkPublico})` | 🟡 implementado, recon pendente (v1.7.0) | `SeedAdminPage` | Switch/checkbox "Link público" na tab Compartilhar |

### Atividades (filhas do curso)

| Helper | Status | Local | Notas |
|---|---|---|---|
| `listarAtividades(eventId)` | ✅ implementado | `SeedAdminPage` | Lê `/e/{id}/contents` — retorna `[{ id, title, sequence }]` |
| `configurarMarcarConcluidoManualmente(eventId, activityIds[])` | ✅ implementado | `SeedAdminPage` | Marca os 4 checkboxes `mark_completed_*` por activity |
| `adicionarAtividadeTexto(eventId, { titulo, conteudo })` | ❌ `[NOT_IMPLEMENTED]` | `SeedAdminPage` | `seed-roadmap-atividade-texto-1`. Wizard de criação no `/e/{id}/contents/new` |
| `adicionarAtividadePagina(eventId, { titulo, conteudo })` | ❌ `[NOT_IMPLEMENTED]` | `SeedAdminPage` | `seed-roadmap-atividade-pagina-1` |
| `adicionarAtividadePDF(eventId, { titulo, arquivoPath })` | ❌ `[NOT_IMPLEMENTED]` | `SeedAdminPage` | `seed-roadmap-atividade-pdf-1`. Upload de PDF |
| `adicionarAtividadeAula(eventId, { titulo, videoUrl })` | ❌ `[NOT_IMPLEMENTED]` | `SeedAdminPage` | `seed-roadmap-atividade-aula-1` |
| `adicionarAtividadeQuestionario(eventId, { titulo, questionListId })` | ❌ `[NOT_IMPLEMENTED]` | `SeedAdminPage` | `seed-roadmap-atividade-questionario-1`. Vincula questionário pré-criado |

### Engajamento do aluno

| Helper | Status | Local | Notas |
|---|---|---|---|
| `completarCursoComoAluno({ browser, cursoId, alunoEmail, alunoSenha })` | ✅ implementado | `SeedAdminPage` | Pipeline 5 fases — login UI → APRENDER → iterar atividades → poll cert |
| `lookupUserIdByEmail({ email, ... })` | ✅ implementado (private) | `SeedAdminPage` | Helper interno via `/api/v2/users` |

### Limpeza (cleanup)

| Helper | Status | Local | Notas |
|---|---|---|---|
| `deleteCursoByIdSafe(id)` | ✅ implementado | `SeedAdminPage` | Idempotente |
| `deleteTrilhaByIdSafe(id)` | ✅ implementado | `SeedAdminPage` | Idempotente |
| `deletePacoteByIdSafe(id)` | ✅ implementado | `SeedAdminPage` | Wrapper safe (mesmo se createPacote não implementado) |
| `deleteUsuarioByEmailSafe(email)` | ✅ implementado | `SeedAdminPage` | Lookup + delete via UI admin |

## Autonomia: fixtures canônicas (orchestrator → fixture → seed automático)

**O agente deve ser autônomo**: quando uma suite identifica pré-condição
"X pré-existente" no MD canônico, NÃO marca `fixme` e NÃO depende de
intervenção manual. O spec **declara dependência via fixture name** e a
fixture provê o recurso (criando ou reusando) + faz cleanup automático.

### Fixtures implementadas (`src/fixtures/seed-fixtures.ts`)

| Fixture | O que provê | Custo aproximado | Reusa de |
|---|---|---|---|
| `cursoSeed` | Curso vazio worker-isolated, criado via UI | ~30s | — |
| `trilhaSeed` | Trilha vazia worker-isolated | ~30s | — |
| `cursoLiberadoSeed` | Curso publicado (Situação=Liberado) — visível pro aluno | ~30s + 10s | `cursoSeed` |
| `cursoComRecertificacaoSeed` | Curso com `events.has_recertification = true` (switch ON tab Acesso) | ~30s + 15s | `cursoSeed` |
| `cursoComAtividadesMarcaveisSeed` | Curso com atividades existentes marcadas como "permitir concluir manualmente" | ~30s + 30s | `cursoSeed` |
| `alunoMatriculadoSeed` | Aluno matriculado num cursoSeed (sem senha) | ~30s + 30s | `cursoSeed` |
| `alunoComSenhaSeed` | Idem + senha gravada (OAuth funciona) | ~30s + 60s | `cursoSeed` |
| `alunoAprovadoSeed` | Idem + completou curso pelo Play até cert emitido | ~30s + 60s + 7min | `alunoComSenhaSeed` |

Cada fixture tem cleanup `afterAll` pareado: ao fim do test, recursos
criados são deletados via variant `*_safe`.

### Spec consumindo (zero código de seed no test)

```ts
import { test, expect } from '../../../../../src/fixtures/seed-fixtures.js';

test('TC — Aluno aprovado vê certificado emitido', async ({
  page,
  alunoAprovadoSeed,
}) => {
  // alunoAprovadoSeed já tem: cursoId + alunoEmail/Senha + attendeeId +
  // certificateId + progress + approvedAt — tudo pronto pra usar.
  expect(alunoAprovadoSeed.certificateId).toBeTruthy();
  expect(alunoAprovadoSeed.progress).toBeGreaterThanOrEqual(60);
  // Spec foca na asserção, não no setup.
});
```

### Mapping pré-condição (MD canônico) → fixture / helper

Quando o `playwright-test-generator` (ou healer/QA) lê a seção
`Pré-condições` de um TC, mapeia pelas tabelas abaixo:

**1. Pré-condições cobertas por fixture (autonomia plena, zero código no test)**

| Texto na pré-condição do MD | Fixture canônica | Setup interno |
|---|---|---|
| "Curso pré-existente" / "Curso disponível" | `cursoSeed` | `createCurso` |
| "Curso publicado" / "Curso liberado pro aluno" | `cursoLiberadoSeed` | + `publicarCurso` |
| "Curso com `has_recertification = true`" / "Curso com reinscrição habilitada" / "Curso elegível para reinscrição" | `cursoComRecertificacaoSeed` | + `setHasRecertification(id, true)` |
| "Aluno matriculado num curso" / "Participant ativo" | `alunoMatriculadoSeed` | `createCurso` + `matricularAluno` |
| "Aluno com credenciais válidas" / "Aluno pode logar" | `alunoComSenhaSeed` | + `matricularAlunoComSenha` |
| "Aluno aprovado" / "Aluno com cert emitido" / "Progresso ≥ X%" | `alunoAprovadoSeed` | + `completarCursoComoAluno` |

**2. Pré-condições cobertas por helper standalone (caller invoca explicitamente em beforeAll)**

| Texto na pré-condição do MD | Helper | Skill |
|---|---|---|
| "Trilha pré-existente" | `SeedAdminPage.createTrilha` | provisionar-seed |
| "Aluno criado (sem matrícula)" | `SeedAdminPage.criarUsuarioAluno` | provisionar-seed |
| "Curso publicado / liberado" | `SeedAdminPage.publicarCurso` | provisionar-seed |
| "Atividade marcável manualmente" / "Vídeo concluível pelo aluno" | `SeedAdminPage.configurarMarcarConcluidoManualmente` | provisionar-seed |
| "Curso com switch 'Habilitar reinscrição' ON" | `ContentEditPage.setHabilitarReinscricao(true)` | configuracao-conteudo |
| "Flag :feature ON na org" | `ensureFlipperActor` | testar-feature-flag-twygo |
| "Funcionalidade no contrato ON" | helpers da `alterar-funcionalidade-contrato-twygo` | mesma |
| "Token API V2 válido" | `getApiAuthHeaders` | provisionar-token-api-twygo |
| "Organização adicional (multi-tenant)" | storageState `ADITIONAL_STORAGE_PATH` | testar-ambientes-adicionais-twygo |

**3. Pré-condições NÃO cobertas (fixme legítimo + ID do roadmap)**

Quando a pré-condição cair em helper marcado `[NOT_IMPLEMENTED]` no
catálogo acima (§"Catálogo COMPLETO"), o spec PODE marcar `test.fixme`
com mensagem padronizada:

```ts
test.fixme(
  true,
  'seed-roadmap-pacote-1: createPacote ainda não implementado (rota não confirmada via recon). Skill provisionar-seed §"Catálogo COMPLETO".',
);
```

Forma `seed-roadmap-<resource>-<n>` permite trackeamento — quando helper
for implementado, busca textual remove todos os fixmes correspondentes.

### Anti-pattern (manter `fixme` por seed quando fixture existe)

```ts
// ❌ ERRADO — fixme manual indo contra autonomia
test.fixme(true, 'seed inválido — eventId placeholder');
test('TC1', async ({ page }) => { ... });

// ✅ CORRETO — fixture cuida do setup
test('TC1', async ({ page, alunoAprovadoSeed }) => {
  // page já está logada como admin, e alunoAprovadoSeed tem tudo pronto
});
```

### Promoção pra `scope: 'worker'` (cache cross-test)

Por default fixtures são `scope: 'test'` (recria pra cada TC). Quando um
spec tem múltiplos TCs que compartilham o mesmo seed (ex: 5 TCs que
validam o mesmo aluno aprovado), promova pra worker:

```ts
// No spec
test.describe.configure({ mode: 'serial' });  // necessário pra worker fixture

const myTest = test.extend({
  alunoAprovadoSeed: [async ({ alunoAprovadoSeed }, use) => {
    await use(alunoAprovadoSeed);
  }, { scope: 'worker' }],  // promove pra worker
});
```

Amortiza ~7min do `alunoAprovadoSeed` por todos os TCs do arquivo.

### Custo do seed e quando reusar `data/fixed-seed.data.ts`

Pra suites cujo TC roda em <10s mas o seed leva 7min (ex: "Filtro
Avançado Status Substituído"), prefira **seed permanente** via
`data/fixed-seed.data.ts` (curso/aluno mantidos no env entre runs) ao
invés de recriar a cada execução. Critério:

- Suite roda <1min total → fixture dinâmica
- Suite roda <10s × N TCs → fixed-seed
- Seed específico do TC só (cert REPLACED, multi-inscrições) → fixed-seed



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

0. **SEMPRE prefira fixture canônica** (`src/fixtures/seed-fixtures.ts`)
   sobre `beforeAll` manual. Generator/healer deve mapear pré-condição
   do MD → fixture pela tabela acima (§"Mapping pré-condição → fixture").
   Só usar `beforeAll` manual quando a fixture não cobre o caso (ex:
   seed composto com 3 alunos em estados distintos).
1. **NUNCA `test.fixme(true, 'seed inválido')`** quando o recurso é
   criável via UI admin OU coberto por fixture canônica. Categoria
   §7.6 F NÃO se aplica.
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

- **v1.7.1 (2026-05-28)**: recon parcial do caminho "kebab Atividades"
  na lista de conteúdos (info nova do usuário). Mudanças:
  - **Caminho confirmado**: lista admin `/o/{org}/events?tab=events&profile=admin`
    → kebab da row (`[data-test-id="events-{id}-actions-kebab"]`) →
    menu com items "Gerenciar / Duplicar / Página / Atividades /
    Aprendizagem / Inscrição".
  - **NOVO bloqueio descoberto**: click em "Atividades" via Playwright
    synthetic event NÃO dispara handler do app — URL fica na lista,
    sem navigation/request/aba nova. Hipótese: Chakra Menu + handler
    React reage só a click "real" (CDP/mouse físico) ou tem proteção
    contra synthetic events. Validado live 2026-05-28 com 15 iterações
    de recon (`tests/setup/recon-wizard-atividade.spec.ts`).
  - **adicionarAtividade* permanecem bloqueados** — precisam:
    1. user reportar URL/wizard manual após clicar Atividades no Twygo
    2. OU recon live via chrome-devtools-mcp (CDP, mouse real)
    3. OU descobrir como fazer Playwright "real click" via
       `page.mouse.click(x, y)` com coordenadas exatas
  - Spec recon preservado em `tests/setup/recon-wizard-atividade.spec.ts`
    (opt-in `RUN_RECON_WIZARD_ATIVIDADE=1`) pra próxima sessão retomar.

- **v1.7.0 (2026-05-28)**: implementação em batch de TODOS os helpers
  do roadmap (pedido do usuário "implementar e testar todos seeds do
  roadmap"). Mudanças:
  - **`LearningStudentsPage.getRowByEmail(email, { certState })`**:
    aceita filtro por badge do certificado (Emitido/Pendente/etc) pra
    desambiguar 2 linhas com mesmo email — resolve state-conflict
    descoberto em v1.6.2 (Suite 2 TC2/TC3).
  - **`expirarCertificadoDoAluno({cursoId, alunoEmail})`**: fluxo UI
    Aprendizagem → kebab participant Emitido → "Expirar certificado".
    Destrava Suite 2 TC1 estado (b) "cert expirado".
  - **`createPacote({name, cursosIds?, ...})`**: implementado baseado
    em createCurso (rota `/contents/new?kind=4`). `cursosIds` ainda
    lança erro (wizard multi-step pra vincular cursos não coberto).
  - **5 setters de tabs do edit do curso**:
    `setCriterioAprovacao`, `setQuemPodeVer`, `setHabilitarChat` (usa
    `#enable_twygo_chat` validado live), `setLocalizacao`,
    `setCompartilhamento`. Delegam novo helper genérico
    `ContentEditPage.goToTab(name)` que cobre as 8 tabs canônicas.
  - **`setBanner`** (upload via `setInputFiles`) + **`setCobranca`**
    (preço + gateway).
  - **5 `adicionarAtividade*` (Texto/Página/PDF/Aula/Questionário)
    BLOQUEADOS** — recon spec falhou em descobrir rota do wizard de
    criar atividade. `/e/{id}/contents` admin retorna view pública;
    rotas alternativas (`/e/{id}/contents/new`, `/o/{org}/events/{id}/contents`,
    `/o/{org}/contents/{id}/contents`, `/e/{id}/manage_contents`) retornam
    404. Próximo passo: recon live MANUAL no Twygo (login UI) pra
    descobrir caminho navegacional → kebab? Menu side de admin? Edit
    inline?
  - **Status dos novos helpers**:
    * ✅ validados live: `createPacote` (id 807420 criado em 1.3min)
    * ✅ implementação validada (typecheck + lógica): `getRowByEmail`,
      `expirarCertificadoDoAluno`, `setHabilitarChat` (id validado live)
    * 🟡 recon pendente: `setCriterioAprovacao`, `setQuemPodeVer`,
      `setLocalizacao`, `setCompartilhamento`, `setBanner`,
      `setCobranca`. Implementação baseada em padrões Twygo conhecidos
      (combobox/checkbox/radio). 1º consumidor precisa validar seletor
      + ajustar conforme recon.

- **v1.6.2 (2026-05-28)**: pipeline alunoAprovadoNoCursoFixoSeed
  destravado parcialmente:
  - **Helper `completarCursoComoAluno` aceita `activityTitles?`**: a
    sidebar do aluno no facelift NÃO renderiza títulos como `h2`
    (cards Chakra com hierarchy `chakra-card > strong/heading bold`).
    A v1.6.1 do helper procurava `h2:has-text(name)` → cards vazios →
    aluno não interagia com nada → progress=0%. Agora caller fornece
    `activityTitles` (obtidos via `listarAtividades` em context admin
    ANTES do login do aluno); helper itera com `getByText(title, exact)`
    + sobe ao card clicável. Validado live 2026-05-28: progress
    SUBIU de 0% → **80%** + cert **5027076** emitido em 3.3min.
  - **Helper cobre questionário** (`responderQuestionarioSeed`):
    detecta botão "Iniciar"/"Iniciar prova", marca primeira alternativa
    em cada pergunta, clica "Próxima/Finalizar". Funciona mesmo com
    score baixo (curso 807403 default = 1000 tentativas).
  - **Helper cobre scroll-to-bottom** pra Texto/Página/PDF (Twygo marca
    como concluído quando aluno visualiza até o fim do conteúdo).
  - **Fixture nova `alunoAprovadoNoCursoFixoSeed`** em
    `src/fixtures/seed-fixtures.ts`: reusa curso fixo 807403 (sugerido
    pelo usuário) — NÃO cria curso novo, NÃO precisa ligar
    `has_recertification`. Cria aluno worker-isolated + matricula +
    completa. Cleanup: desmatricula. Custo ~3-5min (vs ~9min de
    `alunoAprovadoSeed` que cria curso vazio).
  - **NOVO GAP descoberto — TC3 state-conflict**: ao completar engajamento
    no 807403 (`has_recertification=true`), o backend produz 2 linhas
    pro mesmo aluno em `/e/{id}/learning`:
      * Linha 1: participant Pendente, progress 0% (provavelmente
        recertification_number=N+1 criada automaticamente)
      * Linha 2: participant Emitido, progress 80%, cert válido
    `LearningStudentsPage.getRowByEmail(email).first()` pega o Pendente,
    menu kebab sem "Iniciar reinscrição" → TC3 não dispara modal.
    Roadmap pra resolver: `seed-roadmap-tc3-state-conflict` —
    diagnosticar se duplicação vem de `matricularAlunoComSenha` ou da
    auto-recertification do backend; adicionar
    `getRowByEmail({ certState })` ou usar variant de POM por
    recertification_number.
  - **Lição**: pipeline cert-emitido funciona, mas estado-pós-pipeline
    é mais rico (2 participants) do que o estado-esperado-pelo-TC
    (1 participant cert emitido sem reinscrição pendente). Specs
    precisam adaptar ou backend precisa documentar a auto-recertification.

- **v1.6.1 (2026-05-28)**: descoberta validada live executando Suite 2:
  - **Toda a Suite 2 UI (TC1-TC4)** depende do mesmo gap —
    `seed-roadmap-atividade-aula-1`. Razão: o botão "Reinscrever" só
    aparece na linha de aluno ELEGÍVEL (progresso 100% ou cert). Aluno
    recém-matriculado (`alunoMatriculadoSeed` cru) tem progresso 0%,
    nem TC4 ("botão disabled") funciona com ele.
  - TC4 foi temporariamente refatorado em v1.6.0 pra `alunoMatriculadoSeed`
    e reverted após observação live: asserção `expectReinscreverButtonState
    'disabled'` falhou porque o botão simplesmente não aparece na linha
    de aluno não-elegível.
  - **Lição**: pré-condição "ao menos 1 aluno elegível" deve ser lida
    como pré-condição TÉCNICA hard, não soft. Não há TC visual de Suite 2
    que rode sem aluno aprovado.
  - **Próximo destravo**: quando `seed-roadmap-atividade-aula-1` for
    implementado (criar atividade via UI admin no curso seed), criar
    fixture `alunoAprovadoSeedComCurso(cursoConfig)` que aceita
    `{ has_recertification: boolean }` — destrava todos os 4 TCs UI da
    Suite 2 + várias outras suites.

- **v1.6.0 (2026-05-28)**: destrava Suite 2 (Reinscrição Individual) e
  qualquer suíte que dependa de `has_recertification = true`. Mudanças:
  - **Helper novo `SeedAdminPage.setHasRecertification(eventId, enabled)`**:
    atalho que delega `ContentEditPage.openEditByIdInAcessoTab` +
    `setHabilitarReinscricao` + `save` + `expectSaveSuccess`. Não duplica
    locator `#has_recertification` (preserva POM). Idempotente.
  - **Fixture nova `cursoComRecertificacaoSeed`** em `src/fixtures/seed-fixtures.ts`:
    herda `cursoSeed` e liga o switch. Cleanup cascateado de `cursoSeed`.
  - **Mapping pré-condição expandido**: "Curso com `has_recertification = true`"
    / "Curso com reinscrição habilitada" / "Curso elegível para reinscrição"
    → `cursoComRecertificacaoSeed`. Generator deve usar essa fixture em
    vez de marcar `seed-roadmap-recertification-1` (não é roadmap — está
    implementado).
  - **Catálogo de fixtures completo** (antes só listava 4): agora inclui
    `trilhaSeed`, `cursoLiberadoSeed`, `cursoComRecertificacaoSeed`,
    `cursoComAtividadesMarcaveisSeed` que já estavam em `seed-fixtures.ts`
    mas não apareciam na tabela.
  - **Origem**: recon live 2026-05-28 chrome-devtools-mcp tab Acesso do
    facelift React `/contents/{eventId}/edit?tab=access`. Validou que
    switch fica nesta tab (não Identificação nem Aprovação), e que
    `ContentEditPage` já tinha todo o suporte — só faltava expor o
    atalho de setup.

- **v1.5.0 (2026-05-28)**: autonomia completa do agente + catálogo COMPLETO
  de seeds (implementados + roadmap). Mudanças:
  - **Catálogo COMPLETO documentado** com status por helper:
    13 implementados + 14 `[NOT_IMPLEMENTED]` (rastreados via
    `seed-roadmap-<resource>-<n>`). Generator/healer consulta antes de
    `fixme` legítimo.
  - **3 helpers críticos implementados** em `SeedAdminPage`:
    - `listarAtividades(eventId)` → `[{ id, title, sequence }]` lidos
      de `/e/{id}/contents` (`li.dd-item[data-id]`).
    - `configurarMarcarConcluidoManualmente(eventId, activityIds[])` →
      marca os 4 checkboxes `mark_completed_*` por activity (antes
      feito manual via MCP).
    - `publicarCurso(eventId)` → tab Identificação → Situação=Liberado.
  - **`src/fixtures/seed-fixtures.ts` implementado** com 6 fixtures:
    `cursoSeed`, `trilhaSeed`, `cursoLiberadoSeed`,
    `cursoComAtividadesMarcaveisSeed`, `alunoMatriculadoSeed`,
    `alunoComSenhaSeed`, `alunoAprovadoSeed` — todos com cleanup auto
    pareado.
  - **`SeedAdminPage.completarCursoComoAluno` consolidado** (5 fases:
    login UI → /e/{id} → APRENDER → iterar atividades + checkbox manual
    → poll cert via API V2). Extraído do spec one-shot.
  - **Helper privado `lookupUserIdByEmail`** via `/api/v2/users?email=`.
  - **Mapping pré-condição → fixture / helper** com 3 tabelas:
    cobertas por fixture (autonomia plena), por helper standalone
    (caller invoca em beforeAll), e `[NOT_IMPLEMENTED]` (fixme legítimo
    com ID roadmap).
  - **Quando reusar `data/fixed-seed.data.ts`** (seed permanente) vs
    fixture dinâmica: critério por custo do seed vs tempo do TC.
  - **`scope: 'worker'` documentado** pra amortizar seeds caros.
  - **Skill `twygo-test-orchestrator` atualizada** com Anti-pattern F
    (preferir fixture canônica sobre beforeAll manual).
- **v1.4.1 (2026-05-28)**: cross-check pós-validação live + correções de
  documentação. Mudanças:
  - **`matricularAlunoComSenha` implementado em SeedAdminPage real**
    (antes só doc, agora código executável no `projects/recertificacao/pages/SeedAdminPage.ts`).
  - **Código stub completado** na skill (antes terminava com `// ... Salvar + confirmar`).
  - **Corrigida desinformação "seed-via-UI completa até ~60%"** — cert FOI
    emitido em 60% no curso 807403 porque o critério de aprovação do CURSO
    é 60%. Não é limite técnico do seed.
  - **Fluxo aluno** agora documenta modal "Aprovação atingida" + checkbox
    "Marcar como concluído" inline no loop de atividades.
  - **Helper admin `configurarMarcarConcluidoManualmente`** proposto
    (assina 4 checkboxes `mark_completed_*` por activity_id).
  - **Como descobrir activityIds** via `/e/{eventId}/contents` + `li.dd-item[data-id]`.
  - **Campos completos do `/api/v2/attendees`** documentados (incluindo
    `questionary_average`, `attendance_score`, `origin_organization_*`,
    `certificate_situation` enum).
  - **Distinção approved_at vs completed_at** documentada — aprovação ≠
    conclusão; cert pode ser `valid` mesmo com `completed_at: null`.
  - Specs de referência executáveis linkados (`tests/setup/seed-aluno-engajamento.spec.ts`
    e `seed-aluno-engajamento-completo.spec.ts`).
- **v1.4.0 (2026-05-28)**: validado live pipeline completo de engajamento
  do aluno (criar + senha + OAuth + completar curso + cert emitido).
  Mudanças:
  - Nova seção "Engajamento do aluno" com tabela "tipo de atividade ×
    marca-se com click".
  - Variante `matricularAlunoComSenha` (h3 Senha + scroll progressivo)
    — documentação inicial.
  - Atalho `Permitir marcar concluído manualmente` documentado.
  - Helper login OAuth do aluno.
  - Endpoint canônico `/api/v2/attendees` validado live (outros 3 = 404).
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
