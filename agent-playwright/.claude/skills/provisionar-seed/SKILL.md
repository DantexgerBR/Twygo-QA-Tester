---
name: provisionar-seed
description: Quando um TC Playwright declara pré-condição como "curso pré-existente", "aluno matriculado", "participant com progresso 100", "trilha com 3 cursos filhos", etc, o spec NÃO pode marcar `test.fixme(true, 'seed inválido')` nem depender de IDs hardcoded em `.data.ts` placeholder. Em vez disso, o spec é auto-suficiente — `beforeAll` cria os recursos via UI admin (rota `/o/{orgId}/events/new`, etc), `afterAll` deleta tudo via variant `*_safe` do Page Object (link com [[limpar-dados-de-teste-twygo]]). Skill define o padrão canônico, anti-pattern (o erro que cometi em 2026-05-26 ao marcar 25 fixmes "seed inválido" no projeto Recertificação), catálogo de helpers `create<Recurso>` esperados, naming worker-isolated, integração com fixture custom, e quando `fixme` por seed ainda é legítimo (DB-only/mailer/Flipper toggle). Use ao gerar/revisar QUALQUER spec novo que tenha pré-condição "X existe no env" — converter a pré-condição em ação automatizada no `beforeAll`.
version: 1.0.0
---

# provisionar-seed

## Por que existe

**Incidente 2026-05-26 — projeto Recertificação**: 25 dos 26 TCs com
falhas vermelhas foram marcados `test.fixme(true, 'seed inválido —
eventId placeholder. Validar manualmente no env staging-base-de-conhecimento
e atualizar o .data.ts.')`. Diagnóstico: o env staging-base-de-conhecimento
(orgId 37007) não tinha cursos/alunos com os IDs assumidos nos `.data.ts`
(placeholders `eventId: 1, 2, 3, 4`). Network capturou `GET /o/37007/events/{N}
→ 404` em todos os casos.

**O erro**: marquei `test.fixme` "seed inválido" como **categoria
legítima §7.6 F** ("validação secundária manual hoje"). Não era. A
pré-condição "curso pré-existente" é **provisionável via UI admin** —
basta `beforeAll` que faz `safeGoto('/o/${orgId}/events/new')`, preenche
form, salva, captura o eventId real do `page.url()`, e usa esse ID nos
steps do test. `afterAll` deleta o curso via variant `*_safe`.

A consequência de não fazer isso: 25 TCs verdes potenciais viraram
amarelos perpétuos. O sinal de regressão dessa feature de produto
**desligou**. A próxima execução vai voltar a amarelar todos esses TCs
até alguém manualmente popular seed — trabalho que se repete a cada
sprint nova.

**Lição**: spec auto-suficiente é invariante do código de teste. Se o
recurso é criável via UI admin, crie via UI no `beforeAll`. Só marque
`fixme` por seed quando o recurso **não tem caminho UI** (REPLACED de
certificado precisa worker; ativação Flipper precisa rota admin/Flipper;
participant pré-deploy precisa migration history).

## Quando usar

**SEMPRE** que gerar ou revisar spec que declare pré-condição com
"existe X no env", "X pré-existente", "aluno com Y", "curso com Z",
"trilha com N filhos". Conferir:

1. O recurso é provisionável via rota UI admin?
2. Se sim: `beforeAll` cria, `afterAll` deleta. Sem fixme.
3. Se não (DB write direto, worker assíncrono, Flipper toggle): `fixme`
   legítimo categoria §7.6 F + motivo específico.

**EM PARTICULAR** ao gerar specs novos onde o catálogo de pré-condições
inclui:

| Pré-condição comum Twygo | Via UI? | Skill aplicável |
|---|---|---|
| Curso pré-existente (`KIND_COURSE`) | ✅ `/o/{orgId}/events/new` | Esta skill |
| Trilha pré-existente (`KIND_LEARNING_PATH`) | ✅ `/o/{orgId}/events/new?kind=learning_path` | Esta skill |
| Pacote pré-existente (`ContentKind.package`) | ✅ `/o/{orgId}/contents/packages/new` | Esta skill |
| Aluno matriculado num curso | ✅ via listagem `/o/{orgId}/events/{id}/learning_students` + "Adicionar aluno" | Esta skill |
| Usuário aluno cadastrado | ✅ via `/o/{orgId}/users/new` | Esta skill |
| Painel pré-existente (widgets) | ✅ `/o/{orgId}/panels/new` | Esta skill (ver exemplo `PaineisListPage.createPanel`) |
| Modo de uso pré-existente | ✅ `/o/{orgId}/use_modes/new` | Esta skill |
| Participant com `progress_score=100` | ⚠️ Parcial — criar matrícula via UI, mas progresso vem de Sidekiq cron | Misto: criar matrícula via UI + `fixme` parcial pro progresso ou usar API/console pra setar progress |
| Certificado VALID emitido | ⚠️ Worker `IssuesCertificates` | `fixme` legítimo (DB/worker) |
| Certificado REPLACED | ❌ Worker + reinscrição cascade | `fixme` legítimo |
| Feature flag ON | ⚠️ via `/admin/manage/features/<flag>` (Flipper) | [[testar-feature-flag-twygo]] (NÃO esta skill) |
| Contrato com feature | ⚠️ via Super Admin | [[alterar-funcionalidade-contrato-twygo]] (NÃO esta skill) |

## Anti-pattern (proibido)

```ts
// ❌ ERRADO — depende de seed externo
import { tc1Data } from './tc1.data.js';

test('TC1 — Switch aparece na edição do curso', async ({ page }) => {
  await page.goto(`/o/${getOrgId()}/events/${tc1Data.cursoExistenteId}/edit`);
  // Se cursoExistenteId não existe no env, GET retorna 404 → spec vermelho
  // → marca test.fixme(true, 'seed inválido') → spec amarelo perpétuo
});
```

E o `.data.ts`:

```ts
// ❌ ERRADO — placeholder REVISAR-SEED que nunca vira valor real
export const tc1Data = {
  cursoExistenteId: 1, // REVISAR-SEED: validar no env
} as const;
```

## Padrão canônico

```ts
// ✅ CERTO — spec auto-suficiente
import { ContentEditPage } from '../../../pages/ContentEditPage.js';
import { SeedAdminPage } from '../../../pages/SeedAdminPage.js';

test.describe('Configuração de Conteúdo (Switch)', () => {
  let cursoId: number;
  const cursoName = `Curso Recertificação TC1 w${test.info().workerIndex}-${Date.now()}`;

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    const seed = new SeedAdminPage(page);
    cursoId = await seed.createCurso({
      name: cursoName,
      hasRecertification: false, // estado inicial conhecido
    });
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    const seed = new SeedAdminPage(page);
    await seed.deleteCursoByIdSafe(cursoId);
    await context.close();
  });

  test('TC1 — Switch aparece na edição do curso', async ({ page }) => {
    await page.goto(`/o/${getOrgId()}/events/${cursoId}/edit`);
    // ... resto do test
  });
});
```

E **nenhum `.data.ts` com placeholder**. O ID real vive em variável de
escopo do describe, capturada do `beforeAll`.

## Catálogo de helpers `create<Recurso>` esperados

Page Object dedicado: `projects/<slug>/pages/SeedAdminPage.ts` (ou
estender Page Object existente quando faz sentido, ex.: `PaineisListPage.createPanel`).

### Twygo geral (todos projetos)

```ts
// SeedAdminPage.ts
export class SeedAdminPage extends BasePage {
  /**
   * Cria curso via UI admin. Retorna o eventId capturado de page.url()
   * após o save (URL canônica `/e/{id}/edit` ou `/contents/{id}/edit`).
   */
  async createCurso(data: {
    name: string;
    hasRecertification?: boolean;
    description?: string;
  }): Promise<number> {
    await safeGoto(this.page, `/o/${getOrgId()}/events/new`);
    await this.page.getByLabel('Nome').fill(data.name);
    if (data.description) await this.page.getByLabel('Descrição').fill(data.description);
    if (data.hasRecertification !== undefined) {
      // toggle "Habilitar reinscrição" (skill interagir-switch-chakra-twygo)
      const sw = this.page.getByRole('checkbox', { name: 'Habilitar reinscrição' });
      const isOn = await sw.getAttribute('data-checked').then(v => v !== null);
      if (isOn !== data.hasRecertification) {
        await sw.locator('xpath=ancestor::label[1]').click({ force: true });
      }
    }
    await this.page.getByRole('button', { name: /salvar/i }).click();
    await this.page.waitForURL(/\/(e\/\d+\/edit|contents\/\d+\/edit)/);
    const m = this.page.url().match(/\/(e|contents)\/(\d+)\/edit/);
    if (!m) throw new Error(`Falha capturando eventId após criar curso. URL atual: ${this.page.url()}`);
    return Number(m[2]);
  }

  /** Variant *_safe: aceita ID inexistente, faz delete idempotente. */
  async deleteCursoByIdSafe(id: number): Promise<void> {
    try {
      await safeGoto(this.page, `/o/${getOrgId()}/events/${id}/edit`);
      await this.page.getByRole('button', { name: /excluir/i }).click({ timeout: 5000 });
      await this.page.getByRole('button', { name: /confirmar/i }).click();
      await this.page.waitForURL(/\/o\/\d+\/events(\?|$)/);
    } catch {
      // já deletado ou nunca existiu — ok
    }
  }

  async createTrilha(data: { name: string; cursosFilhos?: number[] }): Promise<number> { /* ... */ }
  async createPacote(data: { name: string; cursos: number[] }): Promise<number> { /* ... */ }
  async criarAlunoMatriculado(data: {
    eventId: number;
    email: string;
    name: string;
    cpf?: string;
  }): Promise<{ participantId: number; userId: number }> { /* ... */ }
  async criarUsuarioAluno(data: { email: string; name: string; cpf?: string; locale?: string }): Promise<number> { /* ... */ }
}
```

### Convenção de naming (worker-isolated)

```
<TipoRecurso> <ProjetoSlug> TC<N> w<workerIndex>-<timestamp>
```

Exemplos:
- `Curso Recertificação TC1 w0-1748290800123`
- `Trilha Recertificação TC7 w2-1748290800999`
- `aluno-tc3-w0-1748290800123@example.com`

**Por quê:** se 2 workers Playwright rodam em paralelo (ou 2 runs
sucessivas no mesmo dia), `workerIndex` + `timestamp` garantem nomes
únicos → zero colisão.

## Integração com fixtures (opcional, mas recomendado)

Em vez de duplicar beforeAll/afterAll em cada spec, exportar fixture
custom:

```ts
// src/fixtures/seed-fixtures.ts
import { test as base } from './exploratory-fixture.js';
import { SeedAdminPage } from '../pages/SeedAdminPage.js';

export const test = base.extend<{
  cursoRecertificacao: { id: number; name: string };
}>({
  cursoRecertificacao: [async ({ browser }, use) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    const seed = new SeedAdminPage(page);
    const name = `Curso Recertificação w${test.info().workerIndex}-${Date.now()}`;
    const id = await seed.createCurso({ name, hasRecertification: true });
    await context.close();

    await use({ id, name });

    // Cleanup
    const ctxCleanup = await browser.newContext({ storageState: STORAGE_PATH });
    const pageCleanup = await ctxCleanup.newPage();
    const seedCleanup = new SeedAdminPage(pageCleanup);
    await seedCleanup.deleteCursoByIdSafe(id);
    await ctxCleanup.close();
  }, { scope: 'test' }],
});
```

Spec consome:

```ts
test('TC1 — ...', async ({ page, cursoRecertificacao }) => {
  await page.goto(`/o/${getOrgId()}/events/${cursoRecertificacao.id}/edit`);
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

**Se a pré-condição cair em "criar curso/trilha/aluno"**, é SEMPRE caso
desta skill — nunca fixme.

## Ordem de operações com dependência

Quando o spec precisa de `participant matriculado num curso`:

1. `createCurso({ name })` → captura `cursoId`
2. `criarUsuarioAluno({ email, name })` → captura `userId`
3. `criarAlunoMatriculado({ eventId: cursoId, userId })` → captura `participantId`

`afterAll` reverte na ordem inversa (filho → pai):

1. `deleteParticipantSafe(participantId)` — desinscreve
2. `deleteUsuarioSafe(userId)` — deleta usuário
3. `deleteCursoByIdSafe(cursoId)` — deleta curso

Sem essa ordem, produto pode bloquear delete do curso com "tem
participants vinculados" (similar a modal "Painel em uso").

## Exemplo end-to-end (aplicado ao caso Recertificação)

Spec ANTES (anti-pattern, o que apliquei errado em 2026-05-26):

```ts
// tc3-ativar-e-salvar-persiste.spec.ts
test.describe('Configuração de Conteúdo', () => {
  test.fixme(true, 'seed inválido — cursoIdParaToggle=2 placeholder. Validar manualmente.');
  test('TC3 — Ativar e salvar persiste has_recertification=true', async ({ page }) => {
    // morto na água — nunca executa
  });
});
```

Spec DEPOIS (auto-suficiente):

```ts
test.describe('Configuração de Conteúdo', () => {
  let cursoId: number;
  const cursoName = `Curso Recertificação TC3 w${test.info().workerIndex}-${Date.now()}`;
  const STORAGE_PATH = 'outputs/.auth/storage.json';

  test.beforeAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    const seed = new SeedAdminPage(page);
    cursoId = await seed.createCurso({ name: cursoName, hasRecertification: false });
    await context.close();
  });

  test.afterAll(async ({ browser }) => {
    const context = await browser.newContext({ storageState: STORAGE_PATH });
    const page = await context.newPage();
    const seed = new SeedAdminPage(page);
    await seed.deleteCursoByIdSafe(cursoId);
    await context.close();
  });

  test('TC3 — Ativar e salvar persiste has_recertification=true', async ({ page }) => {
    const contentEdit = new ContentEditPage(page);
    await safeGoto(page, `/o/${getOrgId()}/events/${cursoId}/edit`);
    await contentEdit.setHabilitarReinscricao(true);
    await contentEdit.save();
    await contentEdit.expectSaveSuccess();

    // Validação: refresh + verifica que switch está ON
    await page.reload();
    await expect(contentEdit.getHabilitarReinscricaoSwitch()).toHaveAttribute('data-checked', '');
  });
});
```

## Regras duras

1. **NUNCA `test.fixme(true, 'seed inválido')`** quando o recurso é
   criável via UI admin. Categoria §7.6 F NÃO se aplica.
2. **SEMPRE pareado com cleanup** — `afterAll` deletando via variant
   `*_safe` (regra dura §7.6 G + [[limpar-dados-de-teste-twygo]]).
3. **NUNCA nome literal de recurso** (`'Curso Teste'`) — sempre
   worker-isolated.
4. **NUNCA `context.close()` ausente** no beforeAll/afterAll — sem isso,
   o browser context vaza entre testes.
5. **SEMPRE capturar ID real** de `page.url()` após o save — não
   adivinhar / não usar placeholder.
6. **NUNCA mexer em estado de outro spec** — cada spec cria seu próprio
   curso/aluno; zero compartilhamento (worker isolation).

## Anti-patterns a evitar

| Anti-pattern | Por quê |
|---|---|
| `test.fixme(true, 'seed inválido — eventId placeholder')` | É exatamente o caso que esta skill destrava. Não marque fixme — crie o seed. |
| `cursoExistenteId: 1` em `.data.ts` com `REVISAR-SEED` | Placeholder nunca vira valor real. Crie via `beforeAll`. |
| `const cursoName = 'Curso Teste'` | Colisão entre runs. Use `w${workerIndex}-${Date.now()}`. |
| `beforeAll` sem `afterAll` pareado | Lixão cumulativo. Regra §7.6 G + [[limpar-dados-de-teste-twygo]]. |
| Compartilhar curso entre 2 specs (criado num, usado no outro) | Quebra worker isolation. Cada spec cria o seu. |
| Usar `page` do test no beforeAll | `page` do test ainda não existe no beforeAll. Use `browser.newContext()`. |

## Como propagar essa skill aos generators

Quando o orchestrator chamar `playwright-test-generator` para um spec
novo:

1. Generator deve detectar pré-condições do MD (campo
   `preconditions` ou prosa "X pré-existente").
2. Pra cada pré-condição, decidir via tabela "Quando usar" acima: UI?
   Sim → `beforeAll` + `afterAll`. Não → `fixme` legítimo + motivo.
3. Se `SeedAdminPage` não existe no projeto, generator deve criar com
   helpers necessários (`createCurso`, etc).
4. Spec final usa fixture custom OU describe-local beforeAll/afterAll.

## Skills relacionadas

- [[limpar-dados-de-teste-twygo]] — afterAll/afterEach com variant `*_safe`
- [[interagir-switch-chakra-twygo]] — necessário pra toggle de
  `has_recertification` no form de criar curso
- [[fechar-modais-twygo]] — `safeGoto` cobre modais oportunísticos
  durante a criação
- [[testar-feature-flag-twygo]] — quando pré-condição é flag ON
- [[alterar-funcionalidade-contrato-twygo]] — quando pré-condição é
  feature no contrato
- [[criar-spec-resiliente-twygo]] — princípios gerais que `beforeAll`
  com criação via UI precisa seguir (timeouts pós-hydration, retry de
  rede via `safeGoto`)

## Histórico

- **v1.0.0 (2026-05-26)**: criada após incidente Recertificação. 25
  TCs marcados fixme "seed inválido" quando deveriam ter beforeAll
  criando o curso via UI.
