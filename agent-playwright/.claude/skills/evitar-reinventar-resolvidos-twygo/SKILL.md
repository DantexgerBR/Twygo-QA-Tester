---
name: evitar-reinventar-resolvidos-twygo
description: Pre-flight obrigatório antes de editar Page Object, helper ou utilitário compartilhado — rodar grep por consumidores, verificar se algum é canônico (fixture/seed-helper), e investigar o CONTEXTO de uso que falha antes de mexer no método. Skill nasce de incidente Recertificação 2026-06-01 onde tentei "consertar" `ContentEditPage.openEditReactAccessById` sem perceber que `SeedAdminPage.setHasRecertification` já usava o método com sucesso em fixture — sintoma era state-dependent, não bug do Page Object.
when_to_use: SEMPRE antes de editar método de Page Object, util compartilhado (src/utils/*), fixture (src/fixtures/*), ou helper de seed (`SeedAdminPage`/`ContentEditPage`). Também antes de adicionar `test.fixme` em TC red — verificar se TC irmão da mesma suite passa com path diferente.
---

# Evitar reinventar problemas já resolvidos — Twygo

## Por que esta skill existe

Sessão Recertificação **2026-06-01**: TC3 da Suite "Configuração de
Conteúdo (Switch Habilitar reinscrição)" falhou em `goToAcessoTab` por
timeout. Sintoma: "tab Acesso não fica visible em 20s". Eu (agente)
inferi modal BETA interceptando, adicionei `dismissCommonModals` ao
método do Page Object. Falhei de novo. Iterei mais 3× modificando o
mesmo método.

**O que eu não fiz**:
1. `grep -rn "openEditReactAccessById"` — descobriria que
   `SeedAdminPage.setHasRecertification` (linha 780) USA esse método
   com sucesso em fixture `cursoComRecertificacaoSeed`.
2. Comparar com TC1 da MESMA suite — TC1 passa via `openEditByName`
   (listagem → kebab → Gerenciar). TC3 usa `openEditByIdInAcessoTab`
   (rota direta `/contents/{id}/edit`). Diferentes paths, ambos
   válidos, mas TC1 estava verde.

**Custo do erro**: 6 iterações no mesmo método, modificações em
`ContentEditPage` que NÃO eram necessárias, frustração do usuário ("pq
insiste em retornar em erros e problemas que já contornamos? nosso
trabalho foi para nada?").

**Causa raiz operacional**: salto direto pro código sem inventário de
consumidores nem comparação com TCs verdes adjacentes.

## Quando esta skill DISPARA (obrigatório)

Antes de fazer Edit/Write em qualquer destes paths:

| Path | Razão |
|---|---|
| `src/pages/**` | Page Objects base consumidos por TODOS specs |
| `src/utils/**` | Utils compartilhados (modals, environment, schema) |
| `src/fixtures/**` | Fixtures auto-aplicadas a todos os tests |
| `projects/<slug>/pages/**` | POMs do projeto consumidos por 2+ suítes |
| `projects/<slug>/data/*.data.ts` | Shared seeds (`fixed-seed.data.ts`) |

E SEMPRE antes de adicionar `test.fixme` em TC red — vide §"Anti-pattern A".

## Ritual obrigatório (5 segundos)

### Passo 1 — Inventário de consumidores

```bash
# Para método de Page Object:
grep -rn "openEditReactAccessById" src/ projects/

# Para helper de util:
grep -rn "dismissCommonModals\|safeGoto" src/ projects/

# Para fixture:
grep -rn "alunoAprovadoNoCursoFixoSeed" projects/
```

Se a saída inclui:
- **Fixture canônica** (`src/fixtures/seed-fixtures.ts`)
- **Seed helper** (`SeedAdminPage`, `ContentEditPage` métodos públicos)
- **Outro PO/util** que é amplamente reusado

→ **O método já é validado em outro contexto**. Investigue por que
falha NO CONTEXTO DE USO ATUAL, não mexa no método.

### Passo 2 — TC irmão da mesma suite passa?

```bash
# Lista todos os specs da mesma suite:
ls projects/<slug>/tests/features/<suite-slug>/

# Pra cada TC verde, ver qual abordagem usa (rota, helper, fixture):
grep -E "openEdit|safeGoto|goTo" projects/<slug>/tests/features/<suite-slug>/tc*.spec.ts
```

Se TC irmão usa abordagem A (verde) e TC red usa B (red):
- Primeira ação é trocar B por A no TC red.
- Só se A não bater na semântica do TC red, considerar caminho novo.

### Passo 3 — Skill relacionada documenta o helper?

```bash
ls .claude/skills/ | grep -E "<dominio>"
# Ex: editar curso? skill provisionar-seed
# Ex: dismiss modal? skill fechar-modais-twygo
# Ex: feature flag? skill testar-feature-flag-twygo
```

A skill sempre tem o **helper canônico** documentado. Reuse, não
recrie. Se a skill aponta `setHasRecertification` como canonical, e
seu TC novo precisa ligar `has_recertification`, **chame
`setHasRecertification`** — não duplique a sequência `openEdit +
setHabilitarReinscricao + save` no spec.

### Passo 4 — Network/Console antes de inferir causa

Skill `debugar-via-network-e-console` é regra dura meta-monorepo.
ANTES de inferir "modal X intercepta" via screenshot, abrir Network
e Console:
- Sem request → frontend não disparou handler (locator/event/overlay)
- 2xx mas UI não atualizou → state mgmt
- 4xx/5xx → backend rejeitou (lê o body)
- Pending sem completar → ctx fechou ou backend travou

Inferir causa sem Network/Console é chute. Ver skill canônica.

### Passo 5 — Leia o `trace.zip` ANTES de chrome-devtools-mcp

Quando um spec Playwright falha, o `trace.zip` em
`outputs/<slug>/test-artifacts/<test-folder>/` **já contém**:

- Network completo (requests, payloads, status, timing)
- Console messages (errors, warnings, logs)
- Screenshots por step (todos os snapshots intermediários)
- DOM em cada `expect`/`click`/`waitFor` (timeline)
- Source-mapped stack traces

Abrir com `npx playwright show-trace <path>`. **NÃO ir direto pro
chrome-devtools-mcp** — é mais lento (precisa autenticar, trocar
perfil, navegar) e replica o contexto que o spec já gravou.

Chrome-devtools-mcp é justificado quando:
- O trace mostra "X falhou", mas você quer testar uma HIPÓTESE de
  fix interativamente (ex: "será que `force: true` resolveria?").
- Você precisa ver o DOM DEPOIS da falha (trace para no momento do
  erro; live MCP permite navegar pós-falha).
- Reproduzir em viewport diferente / dispositivo.

Se o trace.zip já mostra a causa, abrir chrome-devtools-mcp é
desperdício de turno + risco de violar fluxo de auth/perfil (vide
§"Anti-pattern F").

## Catálogo de helpers canônicos — Recertificação

Antes de duplicar uma operação no spec, verifique se já existe helper:

| Operação | Helper canônico | Onde |
|---|---|---|
| Criar curso/trilha/pacote via UI | `SeedAdminPage.createCurso/createTrilha/createPacote` | `projects/recertificacao/pages/SeedAdminPage.ts` |
| Criar usuário aluno via Haml | `SeedAdminPage.criarUsuarioAluno` | idem |
| Matricular aluno em curso | `SeedAdminPage.matricularAluno` | idem |
| Matricular com senha (drawer expand) | `SeedAdminPage.matricularAlunoComSenha` | idem |
| Ligar/desligar `has_recertification` | `SeedAdminPage.setHasRecertification` | idem |
| Publicar curso (tab Identificação) | `SeedAdminPage.publicarCurso` | idem |
| Completar curso como aluno | `SeedAdminPage.completarCursoComoAluno` | idem |
| Desmatricular aluno (cleanup) | `SeedAdminPage.desmatricularAlunoSafe` | idem |
| Deletar curso (cleanup) | `SeedAdminPage.deleteCursoByIdSafe` | idem |
| Expirar cert manualmente | `SeedAdminPage.expirarCertificadoDoAluno` | idem |
| Abrir edit curso pela listagem | `ContentEditPage.openEditByName` | `projects/recertificacao/pages/ContentEditPage.ts` |
| Abrir edit + ir tab Acesso | `ContentEditPage.openEditByIdInAcessoTab` | idem |
| Ligar Flipper actor numa org | `ensureFlipperActor` | `src/utils/flipperFlag.ts` |
| Dismiss modais oportunistas | `dismissCommonModals` / `safeGoto` | `src/utils/modals.ts` |
| Auth header API V2 | `getApiAuthHeaders` | `src/utils/api-auth.ts` |
| Validar schema response API | `validateAgainstSchema` | `src/utils/schema.ts` |

**Regra dura**: se a operação está nesta tabela, NÃO duplique no spec.
Importe e chame.

## Catálogo de fixtures canônicas

```
src/fixtures/seed-fixtures.ts:
- cursoSeed                       — curso default (has_recertification=false)
- cursoLiberadoSeed               — curso publicado
- cursoComRecertificacaoSeed      — curso com has_recertification=true (USA setHasRecertification!)
- cursoComAtividadesMarcaveisSeed — curso com atividades pra completar
- alunoMatriculadoSeed            — aluno matriculado (progresso 0)
- alunoComSenhaSeed               — aluno com senha definida
- alunoAprovadoSeed               — aluno aprovado (progresso 100, cert Emitido)
- alunoAprovadoNoCursoFixoSeed    — aluno aprovado no curso 807403 fixo
```

Se TC declara pré-condição "X pré-existente", verifique fixture
correspondente ANTES de marcar `fixme` ou duplicar setup. Ver skill
`provisionar-seed`.

## Anti-patterns

### A. Marcar `test.fixme` em TC red sem checar TC irmão

❌ TC1 da suite passa, TC3 da mesma suite falha → marco fixme em TC3
   "race condition X" sem investigar.
✅ Comparar TC1 vs TC3:
   - Mesma fixture? Mesmo Page Object method?
   - Se diferentes → trocar TC3 pelo path de TC1.
   - Se iguais → o problema é estado entre tests (cleanup, fixture
     contamination), NÃO o código compartilhado.

### B. Editar Page Object pra fazer 1 TC passar

❌ "TC3 falha em `clickTabAcesso` → adiciono `dismissCommonModals` no
   método `clickTabAcesso`."
✅ Inventário primeiro: `grep -rn "clickTabAcesso"`. Se há 5
   consumidores e 4 funcionam, NÃO mexer no método — investigar
   contexto do 5º.

### C. Inferir causa raiz via screenshot sem Network/Console

❌ Screenshot mostra modal X em cima da tela → "modal X intercepta".
✅ Abrir Network: ver requests pendentes/abortados. Abrir Console: ver
   erros JS. Skill `debugar-via-network-e-console` define o ritual.

### D. Não ler skill antes de implementar

❌ "Vou implementar matrícula de aluno via UI no SeedAdminPage."
✅ `ls .claude/skills/ | grep seed` → skill `provisionar-seed`
   documenta `matricularAluno` + variantes. Implementação canonical
   já existe.

### E. Reusar TC red de uma sessão anterior como ponto de partida sem auditar

❌ Continuo a sessão, vejo TC red, parto de "deixa eu tentar arrumar
   o método X" sem revisar histórico de heals anteriores.
✅ `git log -p projects/.../tc*.spec.ts` + `git log -p src/utils/...`:
   ver o que foi tentado, o que voltou atrás, o que ainda não foi
   tentado. Se já passei por isso 3×, mudar de tática (perguntar ao
   usuário, abrir bug-report).

### F. Navegar via chrome-devtools-mcp sem `ensureAdminProfile`

❌ Login via MCP → `goto /o/<orgId>/contents/new?kind=0` direto →
   "Você não tem permissão para acessar esta página."
✅ Twygo serve UI admin SOMENTE quando o user está no perfil
   "Administrador". Spec usa `SeedAdminPage.ensureAdminProfile()`
   (popover de perfil → click "Administrador") ANTES de qualquer
   rota `/o/<orgId>/...` admin. Replicar isso via MCP:
   1. Login normal
   2. No popover canto superior direito → escolher perfil
      "Administrador"
   3. AGORA navegar pra rota admin
   - Skill `trocar-perfil-twygo` documenta o switch.
   - Em código, `SeedAdminPage.ensureAdminProfile()` faz isso.
   - Sintoma de violação: tela "Você não tem permissão para acessar
     esta página" / heading h4. Já vi 2× em 2026-05 e 2026-06-01.

### G. Editar Page Object/util baseado em screenshot sem ler trace.zip

❌ Spec falha → abro screenshot → "modal interceptando" → edito util
   pra dismissar modal.
✅ Spec falha → abro `trace.zip` com `npx playwright show-trace` →
   Network mostra HTTP 403 / Console mostra "permission denied" →
   problema é AUTH/perfil, não modal. Editar util por screenshot é
   inferir causa errada (vide §Passo 5).

## Quando relaxar (deliberadamente)

- Spec novo de TC sem TC irmão verde — não há referência. Aplicar
  ritual reverso: editar com cuidado + adicionar TC irmão verde após.
- Refactor planejado de Page Object (mudança intencional + regressão).
- Edição de comentário/JSDoc — zero impacto runtime.

## Integração com outras skills

- `provisionar-seed` — catálogo de fixtures + helpers de seed.
- `fechar-modais-twygo` — `dismissCommonModals` + `safeGoto`.
- `debugar-via-network-e-console` — ritual Network/Console antes de inferir.
- `regressao-pre-commit-twygo` — gate dinâmico complementar (esta skill
  é o gate ESTÁTICO: antes de editar, verifique).
- `validar-heal-diff` — gate sobre o diff do healer.

## Auto-aplicação pelo agente

Quando você (agente) estiver prestes a fazer Edit/Write em path
sensível (vide §"Quando esta skill DISPARA"), pause e responda:

1. Quais são os consumidores deste método? (rodar `grep`)
2. Algum consumidor é canônico (fixture/seed-helper)?
3. Se sim → problema é state-dependent ou state-contamination, NÃO
   o método. Vou investigar contexto antes de editar.
4. Se não → ok, posso editar — mas rodar regressão (skill
   `regressao-pre-commit-twygo`) após.

Esse mini-checklist substitui o impulso "deixa eu testar editando".
