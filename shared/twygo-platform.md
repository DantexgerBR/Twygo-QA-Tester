# Twygo Platform — Gotchas Cross-Agente

> Este documento captura **características do produto Twygo** que afetam
> testes de qualquer agente automatizado (UI, API, DB, Pentest, futuros).
> Vive na raiz do monorepo porque agentes não enxergam um ao outro — mas
> todos podem ler aqui via path relativo (`../shared/twygo-platform.md`).

> **O que vai aqui**: convenções, padrões, comportamentos peculiares do
> produto Twygo (URLs estruturais, sufixos semânticos, modais, gotchas
> de UI/DOM).
>
> **O que NÃO vai aqui**: valores concretos sensíveis ou que variam por
> projeto — hosts reais, orgIds numéricos, credenciais, emails, slugs
> internos de Flipper de cada projeto. Esses vivem em `.env` (gitignored)
> referenciados pelos `environment.json` / `database.config.yaml` de cada
> agente, ou no MD canônico do projeto (`agent-at/projects/<slug>/output/test-analysis.md`).
>
> **Por quê**: este documento é versionado em git e cross-agente. Valores
> que mudam por projeto vazariam contexto privado e ficariam desatualizados.

> **Manutenção**: quando um comportamento novo do produto for descoberto
> (modal novo, mudança de URL estrutural, gotcha de DOM), atualizar este
> documento. Cada agente que consome deve linkar pra cá.

---

## 1. Convenção de ambientes

### 1.1 Onde vivem os valores concretos

| Tipo de valor | Onde |
|---|---|
| Hosts reais (URLs de stage/prod) | `.env` de cada agente (gitignored), referenciado em `agent-<nome>/config/environment.json` via `${VAR}` |
| orgIds reais | idem |
| Emails/senhas de usuários de teste | idem |
| Mapeamento `<env-slug> → host/orgId` (estrutura, não valores) | `agent-<nome>/config/environment.json` (versionado, mas só com placeholders `${VAR}`) |
| Template de variáveis necessárias | `agent-<nome>/.env.example` (versionado) |

Este documento descreve apenas **convenção de naming** e **semântica de
sufixos** — nunca os valores em si.

### 1.2 Convenção de naming

- **Ambiente principal de um projeto**: `staging` (default) ou
  `staging-<slug-projeto>` quando o projeto precisa de instância dedicada.
- **Ambiente secundário pareado**: `<principal>-<sufixo>` — instância
  separada para testar cenários alternativos sem contaminar o principal.

### 1.3 Sufixos canônicos (semântica)

| Sufixo | Semântica | Quando usar |
|---|---|---|
| _(sem sufixo)_ | Ambiente principal do projeto | Fluxo padrão / happy path |
| `-without-credits` | Org com saldo de IA zerado | Specs de bloqueio por créditos |
| `-disabled` | Módulo/funcionalidade desligada (feature flag ou contrato) | Specs de bloqueio por flag/contrato |
| `-trial` | Org no ciclo Trial (ICP "Outros") | Specs de fluxo Trial / exclusão de dados |

Sufixos novos entram aqui quando uma família semântica nova surge — não a
cada projeto. Slug-de-projeto não é sufixo.

### 1.4 Como adicionar env novo

1. Definir valores reais em `.env` local (não commitar)
2. Adicionar variáveis correspondentes em `.env.example` com placeholder
3. Atualizar `agent-<nome>/config/environment.json` referenciando as `${VAR}` novas
4. Se o sufixo é semântico novo (não só de projeto), adicionar nesta seção §1.3
5. Documentar em qual `.env.example` foi adicionado (pra QA copiar)

---

## 2. Login e autenticação

### 2.1 URLs e elementos do form (fatos do produto)

- **URL de login**: `/users/login` (não `/login`)
- **Labels do form**: `Login` (campo email) e `Senha` (campo senha)
- **Botão de submit**: `Entrar`
- **Pós-login**: redireciona para `/play?menu_id=play` (não `/dashboard_students`)
- **Pegadinha de seletor**: `getByLabel(/e-?mail/i)` bate em checkbox
  `send_copy` da tela de compartilhamento. Use seletor pelo nome exato
  `Login` ou `getByRole('textbox', { name: 'Login' })`.

### 2.2 Usuários de teste

- Valores reais (email/senha) ficam em `.env` (gitignored) de cada agente
- `.env.example` documenta as variáveis necessárias com placeholders
- `environment.json` resolve `${VAR}` para valor concreto em runtime
- **Pré-requisito do user de teste**: deve ter perfil "Administrador" na
  organização do teste, OU o teste deve assumir o perfil necessário via
  playbook `perfil-switch`

### 2.3 Convenções de auth

- **Não trocar perfil via UI** quando precisar de Admin — basta navegar
  para `/o/{orgId}/...` ou `/admin` direto. O app abre o contexto admin.
- Para testar visão de **outro perfil** (Aluno, Gestor, Instrutor), trocar
  via popover de perfil no canto superior direito — é navegação
  client-side, não exige credencial nova nem storageState separado.
- **StorageState** (em automação Playwright): gerado por `globalSetup` e
  reutilizado entre specs. Specs novos NÃO fazem login. Detalhe em
  `agent-playwright/CLAUDE.md §7.5`.

---

## 3. Test-IDs no DOM (relevante para agentes que tocam UI)

### 3.1 Atributo customizado

Twygo usa **`data-test-id`** (com hífen) como atributo de identificação,
não `data-testid` padrão.

Agentes que automatizam UI precisam configurar leitura desse atributo:

- **Playwright**: já configurado em `playwright.config.ts` via `use.testIdAttribute: 'data-test-id'`
- **Outros frameworks**: equivalente do que cada um exponha

### 3.2 Renderização condicional

**Test-IDs de sub-fields aparecem só quando o toggle pai está habilitado.**

Exemplo (Indexação): campos como `Período`, `Tipo`, `Situação`, `Exceções`
só renderizam quando o toggle mestre "Habilitar indexação" está ON. Teste
que interage com sub-field sem ligar o toggle vai falhar com
"elemento não visível".

**Implicação para AT**: descrever o passo de ligar o toggle ANTES de
referenciar sub-fields.

---

## 4. Sync alert na Indexação

### 4.1 O que é

Quando uma operação de indexação está em curso, o app exibe um alert no
topo do form: `[role="alert"][data-status="warning"]`. Esse alert **bloqueia
clicks normais** porque deixa o container `aria-disabled`.

### 4.2 Como afeta testes

- Click "normal" em qualquer elemento do form vai falhar com timeout
- **Solução em UI**: `.click({ force: true })` OU verificar
  `editPage.isSyncBlocking()` e branch
- **Solução em API/DB**: sem bloqueio (não passa pela UI)

### 4.3 Quando aparece

Após um save com mudança real na configuração de indexação. NÃO dispara
em saves sem mudança.

---

## 5. Super Admin

### 5.1 Acesso

- **Base URL**: `/admin`
- **Pré-requisito**: usuário em perfil "Administrador". User de teste do
  `.env` deve ter esse perfil. Detalhe em §2.2.
- **Não trocar perfil via UI** — basta acessar a rota direto.

### 5.2 Caminhos canônicos (estruturais — não mudam por env)

| Operação | Rota direta |
|---|---|
| Entrada Super Admin | `/admin` |
| Tabela de preços (todas) | `/admin/subscription_plans` |
| Editar contrato da organização | `/admin/edit_sys_subscription_settings/{orgId}` |
| Pesquisar org → Editar/Visualizar | `/admin` → busca → seleciona org |
| Feature flags (Flipper) | `/admin/manage/features/<flag>` |

`{orgId}` resolvido em runtime via helper do agente (`getOrgId()` no
Playwright; equivalente em outros).

### 5.3 Tabela de preços é COMPARTILHADA

Alterar a tabela ativa afeta TODAS as organizações daquele banco. Se um
teste muda a tabela ativa:
- **Revert obrigatório no final** (idealmente via `afterEach`/`afterAll`
  no Playwright; equivalente no agente que estiver mexendo)
- Testes que apenas leem (asserções) não precisam de revert

### 5.4 Helpers canônicos (Playwright)

`agent-playwright/src/pages/SuperAdminPage.ts` expõe métodos para as
operações da §5.2. Agentes futuros que precisam de Super Admin (API, DB)
devem implementar equivalentes na sua stack — não inventar acesso direto
ao banco/admin sem helper.

---

## 6. Modais oportunistas

Modais que aparecem **em cima da UI principal** e bloqueiam interações se
não tratados. Devem ser race-handled em qualquer agente que automatiza UI.

### 6.1 NPS Sofia ("Em uma escala de 1 a 10")

- **Quando aparece**: aleatoriamente, baseado em frequência da Sofia
- **Como tratar**: dispensar com botão "Cancelar" ou similar
- **Impacto**: bloqueia `page.load` quando aparece durante navegação — daí
  a regra `safeGoto` (CLAUDE.md raiz)

### 6.2 "Continuar mesmo assim" (banner de sessão duplicada)

- **Quando aparece**: usuário já logado em outra sessão
- **Como tratar**: clicar "Continuar mesmo assim"
- **Impacto**: bloqueia ações até dispensar

### 6.3 "Modelo de página duplicado"

- **Quando aparece**: ao salvar item de menu (`/o/{orgId}/use_modes/{useModeId}/use_mode_itens/new`) com `page_model` duplicado no useMode
- **Header**: "Modelo de página duplicado"
- **Body**: "Esta página já foi adicionada na lista de menus deste modo de uso. Deseja adicioná-la novamente?"
- **Botões**: "Salvar" (confirma duplicação e prossegue) / "Cancelar" (mantém na rota /new)

### 6.4 Modal RN37 "Processo de indexação de conteúdo"

- **Quando aparece**: após clicar Salvar com mudança real em config de indexação
- **Importante**: NÃO dispara em save sem mudança — não force
  `expect(modal).toBeVisible()` sem mudar estado antes

### Helpers canônicos (Playwright)

`agent-playwright/src/utils/modals.ts` expõe:
- `dismissCommonModals(page)` — varre e dispensa NPS, sessão duplicada, etc.
- `safeGoto(page, url)` — `goto` + `dismissCommonModals` em sequência
  (OBRIGATÓRIO em Page Objects, ver skill `fechar-modais-twygo`)

---

## 7. Cenários de bloqueio (env secundário)

Twygo tem 2 famílias de bloqueio testáveis via env secundário pareado:

| Família | Sufixo do env secundário | Quando testar |
|---|---|---|
| **Saldo de IA zerado** | `-without-credits` | UI de bloqueio quando org não tem créditos pra IA |
| **Módulo desligado** | `-disabled` | UI de bloqueio quando feature flag/contrato está OFF |

### Como o globalSetup do Playwright decide (referência)

1. Match direto: `<principal>-without-credits` ou `<principal>-disabled`
2. Fallback: primeiro env diferente do principal terminando em qualquer
   sufixo conhecido.

### Implicação para AT

Se a suíte testa bloqueio, declarar no MD canônico:

```yaml
env: <slug-do-env-secundario>          # ou usar campo env_secondary
preconditions:
  - Ambiente sem créditos / módulo desligado (conforme caso)
  - Usuário logado como Admin
```

---

## 8. Feature flags (Flipper)

### 8.1 Onde gerenciar

`/admin/manage/features/<flag>` (Super Admin → Flipper UI)

### 8.2 Toggle por organização

Adicionar/remover actor `Organization;<orgId>` no Flipper-UI. **NUNCA**:
- ❌ Fully Enable (afeta todas as orgs do banco)
- ❌ Disable (idem)
- ❌ Delete (idem)

### 8.3 Catálogo de flags

Flags concretas usadas por projetos específicos NÃO ficam neste documento
— são particulares ao projeto. Cada projeto declara suas flags nas
**pré-condições da suíte** no MD canônico (`agent-at/projects/<slug>/output/test-analysis.md`).
Ver [CONTRACT.md §4.2](../CONTRACT.md).

### 8.4 Implicação para AT

Se a suíte depende de transição on→off de flag:

```yaml
playbooks: [flipper]
preconditions:
  - Feature flag `<nome_da_flag>` ativa para a organização do teste
```

O playbook `flipper` instrui o agent-playwright a usar `FlipperAdminPage`
+ `ensureFlipperActor` (helper com revert idempotente).

---

## 9. Convenção de URL

### 9.1 Rotas com contexto de organização

Padrão: `/o/{orgId}/<recurso>`

Exemplos (com placeholders — `{orgId}` é resolvido pelo consumidor):
- `/o/{orgId}/dashboard`
- `/o/{orgId}/paineis`
- `/o/{orgId}/ai_consumption_analysis?tab=settings`

**Para AT**: usar placeholder `{orgId}` na prosa (ou nome simbólico
`{defaultOrgId}`/`{trialOrgId}` quando há múltiplas orgs por projeto):

```markdown
1. Acessar a URL "/o/{orgId}/paineis"
   → Listagem é exibida.
```

Consumidor resolve via `getOrgId()` (Playwright) ou equivalente do agente
em runtime.

### 9.2 Rotas sem contexto de organização

Algumas rotas não dependem de orgId:
- `/users/login` — login
- `/play` — pós-login
- `/admin/*` — Super Admin

Podem ficar literais na AT (não precisam de placeholder).

---

## 10. Páginas que disparam `beforeunload` nativo

Forms Twygo com alterações pendentes disparam o **diálogo nativo do browser**
ao tentar fechar/sair sem salvar — NÃO modal Chakra.

Em automação UI, isso afeta clicks em botões "Cancelar"/"Sair"/"Fechar
wizard" — o click fica pendurado até o diálogo nativo ser resolvido.

**Solução em Playwright**: handler que chama `dialog.dismiss()` ou
`dialog.accept()` DENTRO do callback, antes do `click()` retornar. Detalhe
em skill `testar-beforeunload-dialog-twygo`.

**Implicação para AT**: descrever o resultado esperado considerando que o
diálogo aparece. Ex:

```markdown
2. Clicar no botão "Sair" do wizard com alterações pendentes
   → Diálogo "Tem certeza que deseja sair? As alterações não serão salvas."
     é exibido. Confirmar manter na página.
```

Declarar playbook `beforeunload`.

---

## 11. Como referenciar este documento

| Agente | Onde linkar |
|---|---|
| `agent-at` | `CLAUDE.md §10` (já linka) — consulta durante geração da AT |
| `agent-playwright` | `CLAUDE.md §7.5` — manter referência cruzada; específicos PW continuam lá. **Cobre testes UI e API** (a partir de CONTRACT.md v1.2) — auth e convenções de URL aplicáveis a ambos |
| `agent-db` | `CLAUDE.md §3` (quando ativar) — convenções de URL e Super Admin |
| `agent-pentest` (futuro) | seu CLAUDE.md — escopo, contexto Twygo |
| `agent-tasks-qa` (futuro) | seu CLAUDE.md — contexto Twygo pra quebra de atividades |

> **Nota histórica**: `agent-api` (futuro) foi avaliado e descartado em
> 2026-05-27 (CONTRACT.md §16). Testes de API rodam no `agent-playwright`
> via `request` fixture em `tests/api/`.

---

## 12. Histórico de mudanças

| Data | Mudança | Origem |
|---|---|---|
| 2026-05-18 | Documento criado, extraído de `agent-playwright/CLAUDE.md §7.5` | CONTRACT.md v1, decisão de relaxar regra "nada na raiz" |
| 2026-05-18 | Valores concretos (hosts, orgIds, emails) removidos. Documento passa a descrever apenas convenções/sufixos/semântica. Valores reais ficam em `.env`/environment.json | Revisão de segurança — git versionado não deve carregar infra interna |
| 2026-05-27 | Remoção da linha `agent-api (futuro)` na §11. agent-playwright passa a cobrir testes UI e API | CONTRACT.md v1.2 §16 — agent-api descartado em favor de integração no agent-playwright |
