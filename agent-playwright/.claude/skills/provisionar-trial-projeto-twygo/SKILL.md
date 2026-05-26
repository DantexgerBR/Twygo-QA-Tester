---
name: provisionar-trial-projeto-twygo
description: Playbook interativo Claude+executor para provisionar 1 organização Trial dedicada (ICP "Outros" / coluna `icp5`) ao iniciar suite Trial num projeto Twygo. Sequência de 8 passos com 4 pausas manuais (DB update na `organization_icps.icp5`, email unlock, feature flags, contrato) e 1 etapa automatizada Claude (criação via /new/register/steps com intenção "Outros"). Produz `projects/<slug>/data/trial-env.json` com URL + email + ref a senha. Substitui a tentativa anterior de 5 envs Trial compartilhados (inviável porque a exclusão zera o env) e a de 5 Trials por projeto (custo alto por valor marginal — 1 Trial por projeto basta). Use ao iniciar QUALQUER suite Trial nova num projeto.
version: 1.0.0
---

# provisionar-trial-projeto-twygo

## Por que esta skill existe

**Iteração 1** (descartada): 5 envs Trial compartilhados em
`config/environment.json` (`trial-agentsqa-{employee,coursesale,customer,partner,other}`)
reusados por todos os projetos. Inviável — a suite de exclusão (ver
[[testar-exclusao-dados-trial-twygo]]) zera o env; próximo projeto a
rodar Trial encontra tabula rasa.

**Iteração 2** (descartada): provisionar 5 Trials por projeto, uma por
ICP. Custo alto (5× criação + 5× unlock + 5× verificação de flags) por
valor marginal — o teste de exclusão valida o **mesmo fluxo** independente
do ICP. Variação por ICP é interessante mas não vale o overhead em todo
projeto.

**Iteração 3** (adotada): **1 Trial por projeto**, ICP fixo **"Outros"**
(coluna `icp5` na tabela `organization_icps`). Cada projeto provisiona
sua única Trial, copia dados da org principal do projeto, roda suite,
deixa o env consumido (pode re-provisionar quando precisar).

## Quando rodar

- **Início de qualquer suite Trial** num projeto novo (primeira vez que
  Trial é testado no projeto).
- **Refresh** quando a Trial do projeto envelhece, foi zerada pela própria
  suite de exclusão, ou ninguém recriou após run anterior.
- **NÃO rodar mid-suite** — provisionamento é caro (4 pontos manuais);
  rodar de novo no meio de uma suite sobrescreve `trial-env.json` e quebra
  runs em andamento.

## Pré-requisitos

- Executor com acesso a: (a) DB do Twygo (write na coluna `icp5` da tabela
  `organization_icps`), (b) caixa de email usada na criação da Trial,
  (c) Super Admin (pra conferir contrato e feature flags).
- `project.config.json` do projeto alvo aponta para a `environment`
  principal (a org cujos dados serão copiados pra Trial).
- `.env` do projeto tem `TWYGO_<PROJECT>_TRIAL_PASSWORD` vazio pronto
  para preenchimento (executor preenche após Passo 8).

## Fluxo canônico — 8 passos

> Skill é **interativa**: Claude pausa em **4 pontos** aguardando
> confirmação manual do executor. Não automatizável fim-a-fim porque
> (a) DB write exige acesso direto que Claude não tem, (b) email unlock
> chega na caixa do executor, (c) feature flags/contrato são gated por
> Super Admin. Manter manual é seguro.

### Passo 1 — Claude solicita update na `organization_icps.icp5`

Claude imprime no prompt instrução clara, identificando projeto e org base:

> **Provisionamento Trial — Passo 1/8**
>
> Antes de criar a Trial, atualize a tabela `organization_icps` em
> banco. Na **coluna `icp5`** (ICP "Outros"), insira o id da **org
> principal do projeto `<slug>`** (orgId `<id>`, host `<baseUrl>`).
>
> Por quê: quando a Trial nova é criada via wizard com intenção de uso
> **"Outros"**, o produto **copia dados** da org configurada em
> `organization_icps.icp5` para a Trial recém-criada. Sem esta
> atualização, a Trial copiaria da org base padrão (genérica), e os
> specs do projeto encontrariam env sem os dados esperados.
>
> Não preciso de update nas demais colunas (`icp1`..`icp4`) — apenas
> `icp5` é usada por este fluxo.
>
> **Responda "ok" / "aplicado" / "confirmado" quando feito.**

Claude **NÃO segue** sem confirmação explícita.

### Passo 2 — Executor confirma DB write

Executor responde com confirmação explícita. Claude valida:
- ✅ "ok" / "aplicado" / "feito" / "confirmado" / "pode seguir" → prossegue.
- ❌ "vou fazer" / "agora" / "1 minuto" → Claude espera, pede de novo
  após N segundos ou no próximo turno: "Confirmou o update da
  `organization_icps.icp5`? Posso seguir?".
- ❌ "deu erro X" → Claude pausa, pede diagnóstico do erro, não inventa
  workaround (escalation pro QA Lead se erro persistir).

### Passo 3 — Claude cria 1 Trial via Playwright MCP

Rota canônica: `https://stage.twygoead.com/new/register/steps`

Claude executa o wizard completo escolhendo **intenção de uso "Outros"**
(corresponde à coluna `icp5` atualizada no Passo 1).

**Dados a preencher** (convenção sugerida — ajustar se projeto tiver outra):

- **Email**: `qa+<slug>-trial@twygo.com` (ex: `qa+widgets-trial@twygo.com`)
- **Senha**: gerada por Claude (12+ chars, mix letras/números/símbolo).
  Salvar em buffer temporário pra Passo 8.
- **Nome da empresa / org**: `Trial QA <Slug>` (ex: `Trial QA Widgets`)
- **Intenção de uso**: select com o rótulo **"Outros"** — único valor
  aceito por este fluxo. Se executor pediu outro ICP, parar e pedir
  esclarecimento (provavelmente engano).
- **Outros campos do wizard**: dados de teste mínimos (nome, telefone
  placeholder, etc).

**Tratamento de erros**:
- Se o wizard falhar (validação rejeita email, captcha, etc), Claude
  reporta no prompt e pergunta: tentar de novo? abortar?
- Se a falha vier de "ICP base não configurado" / dados copiados vazios,
  provavelmente Passo 1 não foi efetivo (DB update não aplicado de fato).

Claude registra em buffer interno: `{ email, password, registeredAt }`.
Ainda **não conhece a URL final** — vem só após o unlock.

### Passo 4 — Claude solicita unlock de email

> **Provisionamento Trial — Passo 4/8**
>
> Criei a conta Trial via wizard. O produto enviou email de
> confirmação/desbloqueio para `qa+<slug>-trial@twygo.com`.
>
> **Por favor**:
> 1. Acesse a caixa de email da QA.
> 2. Clique no link de desbloqueio da Trial.
> 3. Após desbloqueio, o produto redireciona para a URL única da Trial
>    (formato `https://<slug-único>.stage.twygoead.com/`).
> 4. **Me retorne a URL** (cole no prompt).

Claude **espera** — não segue sem a URL.

### Passo 5 — Executor devolve URL

Executor cola a URL no prompt. Claude valida:
- URL casa pattern `^https://[a-z0-9-]+\.stage\.twygoead\.com/?$`.
- É a única URL na resposta (não embaralhada com texto extra).

Se malformada, Claude pergunta especificamente o que está errado e pede
correção — **não advinha**.

### Passo 6 — Claude solicita verificação de feature flags + contrato

> **Provisionamento Trial — Passo 6/8**
>
> URL recebida. Antes de declarar a Trial pronta para os specs, confirme
> manualmente:
>
> 1. **Feature flags esperadas pelo projeto `<slug>` estão ON**.
>    Flags relevantes:
>    - `<flag-1>` — esperada: ON/OFF
>    - `<flag-2>` — esperada: ON/OFF
>    - ...
> 2. **Módulos contratados conferem** (verificar em Super Admin →
>    contrato da org):
>    - `<modulo-1>` — esperado: ativo
>    - `<modulo-2>` — esperado: ativo
>    - ...
>
> **Responda "ok" quando conferiu.** Se houver divergência, me diga qual
> flag/módulo está errado — eu te pergunto antes de seguir.

Claude **espera**.

> **Observação**: a lista de flags/módulos esperados depende do projeto.
> O orchestrator deve carregar esta lista a partir de
> `projects/<slug>/data/trial-expectations.json` (se existir). Se não
> existir, Claude pede pro executor declarar manualmente quais conferir.

### Passo 7 — Executor confirma flags e contrato

Confirmação explícita. Se executor reportar inconsistência:
- Claude pausa e pergunta: o que fazer?
  - **Opção a)** Re-tentar provisionamento (pode ter sido falha de
    cache / propagação).
  - **Opção b)** Pedir ao executor pra ajustar flag/contrato manualmente
    em Super Admin e re-confirmar.
  - **Opção c)** Abortar provisionamento — algo está fora do esperado
    no infra do projeto, escalar pro QA Lead.

Decisão é do executor — Claude NÃO escolhe sozinho.

### Passo 8 — Claude grava `trial-env.json` + atualiza `.env.example`

**Arquivo gerado**: `projects/<slug>/data/trial-env.json`

```json
{
  "_generated": "2026-05-15T14:32:01-03:00",
  "_baseOrgId": "<orgId do env base, vem de getOrgId() em runtime>",
  "_baseEnvName": "staging-widgets",
  "icp": "other",
  "url": "<url gerada pelo wizard /new/register/steps, ex: https://<slug>.stage.twygoead.com/>",
  "email": "<email de QA dedicado ao Trial>",
  "passwordEnvVar": "TWYGO_WIDGETS_TRIAL_PASSWORD"
}
```

**Campos**:
- `_generated`: ISO 8601 do momento do provisionamento — pra healer/QA
  decidir se Trial está velha (>30d? sugerir refresh).
- `_baseOrgId` / `_baseEnvName`: snapshot do que estava em
  `project.config.json` no provisionamento — pra rastrear de onde os
  dados vieram.
- `icp`: sempre `"other"` neste fluxo. Reservado pra futuro caso o time
  decida exercitar ICPs adicionais.
- `url`, `email`: sem segredo, podem commitar.
- `passwordEnvVar`: NOME da variável em `.env` (não o valor).

**Atualiza `.env.example`**: adiciona linha (sem valor) pra variável de
senha:

```
# Trial provisioned for <slug> on 2026-05-15
TWYGO_WIDGETS_TRIAL_PASSWORD=
```

**Claude pergunta pro executor**:

> Gerei `trial-env.json` e atualizei `.env.example`. **Você precisa
> preencher a senha em `.env`** — eu usei na criação:
>
> ```
> TWYGO_WIDGETS_TRIAL_PASSWORD=<senha>
> ```
>
> **NÃO commitar `.env`** (já está em `.gitignore`). Confirme quando
> aplicado.

Após confirmação final, Claude declara: **Provisionamento concluído.
Suite Trial pronta para rodar.**

## Estrutura de arquivos produzida

```
projects/<slug>/
└── data/
    └── trial-env.json           ← commitar (URL + email + nome de env var)
.env.example                     ← atualizado com 1 var (sem valor)
.env                             ← executor preenche o valor (NÃO commit)
```

Onde os specs consomem (exemplo no `.data.ts`):

```ts
// projects/widgets/tests/features/trial/<spec>.data.ts
import trialEnv from '../../../data/trial-env.json' assert { type: 'json' };

const password = process.env[trialEnv.passwordEnvVar];
if (!password) {
  throw new Error(`${trialEnv.passwordEnvVar} ausente em .env — preencher após provisionamento.`);
}

export const TRIAL = {
  url: trialEnv.url,
  email: trialEnv.email,
  password,
} as const;
```

## Anti-patterns

### A. NÃO compartilhar Trial entre projetos

Cada projeto provisiona **sua própria** Trial. Não existe "trial global".
Trial do projeto `widgets` não serve pro `creditos-fase-02` e vice-versa
— os dados copiados via `organization_icps.icp5` são específicos da org
principal de cada projeto.

### B. NÃO pular Passo 1 (DB update na `icp5`)

Sem update da coluna `icp5`, a Trial copia da org base padrão do produto
(geralmente vazia ou genérica). Specs do projeto encontram env sem os
dados esperados, falham em massa por seed missing. Skill bloqueia: Passo
3 só roda após confirmação explícita do Passo 2.

### C. NÃO usar intenção de uso diferente de "Outros"

O wizard `/new/register/steps` oferece 5 intenções de uso (Treinamento de
colaboradores, Treinamento de clientes, Treinamento de parceiros, Venda
de cursos, Outros). Cada uma lê uma coluna diferente da
`organization_icps` (`icp1`..`icp5`). Este fluxo padroniza em **"Outros"
→ `icp5`** porque é o único que o executor atualiza no Passo 1.

Se o produto pedir outro ICP especificamente pra um teste do projeto,
discutir com QA Lead — pode requerer aditivo no Passo 1 (atualizar
coluna adicional) ou skill irmã.

### D. NÃO automatizar email unlock

Caixa de email é do executor (`qa+...@twygo.com` ou similar). Mesmo se
houvesse API de IMAP, autorização exigiria credenciais de email da
empresa — risco de vazamento e quebra de auditoria. Manter manual.

### E. NÃO seguir sem confirmação explícita

Se executor responde "vou fazer" / "1 minuto" / "talvez" / "depois" /
silêncio — Claude **NÃO segue**. Pede confirmação clara. Seguir
prematuramente faz o Passo seguinte rodar contra estado inconsistente e
o erro vira diagnóstico difícil ("por que falhou? não sei, talvez DB,
talvez timing").

### F. NÃO commitar senha em `trial-env.json`

Senha via `${VAR}` resolvido por `.env` (mesmo padrão dos envs principais
em `environment.json`). JSON commitado mostra só URL + email + nome da
var. `.env` NUNCA vai pro git (já no `.gitignore`).

### G. NÃO re-provisionar sem aviso

Se `trial-env.json` já existe pro projeto, Claude **NÃO sobrescreve em
silêncio**. Mostra ao executor a data do `_generated` atual e pergunta:

> Já existe `trial-env.json` provisionado em `2026-04-20` (25 dias
> atrás). Deseja re-provisionar? (s/N)

Se `s`, prossegue. Se `N` (default), aborta e instrui a usar o JSON
existente.

### H. NÃO inventar SQL pro Passo 1

Claude **NÃO escreve SQL** pro executor. O schema de `organization_icps`
varia (cada coluna `icpN` é um FK pra `organizations.id`? guarda só id
escalar? tem chave composta com tenant?). Executor conhece o schema;
Claude descreve só **o efeito desejado** ("coluna `icp5` deve conter o id
da org `<id>`"), executor traduz pra SQL apropriado.

Se executor pedir SQL pronto, Claude pode oferecer template **com
placeholder de schema** e pedir confirmação antes de aplicar.

## TCs do XML cobertos por este playbook

Em projetos Twygo, o XML TestLink tipicamente inclui 2 TCs de **criação
de Trial** que mapeam diretamente pra este playbook (não viram specs
Playwright executáveis):

| TC do XML | Como o playbook cobre |
|---|---|
| **"Criação de trial via URL com painéis pré-definidos"** | Passo 3 do playbook executa o wizard `/new/register/steps`. As asserções do TC ("Trial criado", "painéis pré-definidos aparecem na lista", "menu acessível como aluno") são side-effects validados pelo executor nos passos 5 (recebe URL) e 7 (confere flags+contrato). Spec correspondente fica `test.fixme` com `executionType: manual` linkando este playbook. |
| **"Criação de trial via API com painéis pré-definidos"** | **Override consciente** — não testamos criação via API. Coberta pelo mesmo wizard do TC anterior. Spec correspondente fica `test.fixme` permanente com mensagem documentando o override (decisão time QA 2026-05-15). |

Como resultado, projetos Twygo executam apenas TC3 (Exclusão SophiaTech)
e TC4 (Exclusão Admin) automatizados; TC1 e TC2 são "manuais
auto-assistidos" via este playbook.

## Skills relacionadas

- [[testar-exclusao-dados-trial-twygo]] — consome `trial-env.json`
  gerado por esta skill pra rodar os specs de exclusão.
- [[fechar-modais-twygo]] — o wizard de `/new/register/steps` pode
  acionar modais oportunistas (cookie banner, NPS); generator deve
  plugar `dismissCommonModals` antes de cada submit do wizard.
- [[trocar-perfil-twygo]] — após provisionar, alguns specs Trial podem
  precisar trocar perfil Admin ↔ Aluno pra validar visão por persona.

## Atualizações em outros artefatos

Quando esta skill rodar pela primeira vez num projeto novo, o agente
deve também:

1. **Atualizar `projects/<slug>/tests/features/trial/_README.md`** — se
   já estiver marcado "isolamento pendente / `fixme`", remover esse
   bloqueio e apontar pro `trial-env.json` gerado.
2. **Destravar specs Trial existentes** que estavam em `test.fixme(...,
   'isolamento Trial pendente')` — agora podem rodar.
3. **NÃO mexer** em `config/environment.json` (a entrada dos 5
   `trial-agentsqa-*` fica como referência legada).

## Por que tantas pausas manuais

A skill tem 4 pontos `aguarda executor` (Passos 2, 5, 7, 8-final). Por
quê não automatizar mais?

| Ponto | Por que não automatiza |
|---|---|
| DB write em `organization_icps.icp5` | Claude não tem credencial DB (e não deveria — separação de privilégios). |
| Email unlock | Caixa de email é do executor; abrir programaticamente exigiria credencial. |
| Feature flags + contrato | Variam por projeto. Sem regra única automatizável. |
| Senha em `.env` | Senha gerada por Claude não deve trafegar via tool result pra histórico do prompt — executor "pega no buffer" significa Claude exibe uma vez, executor copia, conversa segue. |

Cada pausa custa ~30s do executor. Total ~2min de interação humana
distribuída ao longo de ~3-5min de execução. Vale o custo: provisionar
errado uma vez custa horas de re-trabalho.

## Atalho documentado — "legacy-env-reuse" (primeira execução de um projeto)

Quando um projeto vai rodar Trial pela primeira vez e existe um env legacy
`trial-agentsqa-*` em `config/environment.json` **cuja exclusão ainda não
rodou**, é aceitável **pular os Passos 1-7** e gerar `trial-env.json`
direto apontando pro env legacy:

```json
{
  "_provisionedFrom": "legacy-env-reuse",
  "_provisionedFromNote": "Reaproveitando env legacy <nome>. Após primeira run, dados zeram e Trial precisa ser re-provisionada via playbook completo.",
  "icp": "other",
  "url": "<url-do-env-legacy>",
  "orgId": <orgId>,
  "emailEnvVar": "<NOME_DA_VAR_DE_EMAIL_EXISTENTE>",
  "passwordEnvVar": "<NOME_DA_VAR_DE_SENHA_EXISTENTE>"
}
```

**Schema extension**: o campo `emailEnvVar` (em vez de `email` literal) é
suportado APENAS no atalho legacy-reuse — porque envs `trial-agentsqa-*`
já têm email em `.env` via variável, e não vale a pena duplicar como
literal. No fluxo padrão (Passos 1-8), Claude gera email previsível
(`qa+<slug>-trial@twygo.com`) e grava literal no JSON.

**Quando NÃO usar**:
- Todos os envs legacy `trial-agentsqa-*` já foram drenados pela suite
  de exclusão de algum projeto.
- Não existe env legacy compatível (raro — provavelmente o time já
  preferiu provisionamento completo).

**Caso real (widgets, 2026-05-15)**: primeiro projeto a destravar suite
Trial usou este atalho — `trial-agentsqa-other` (orgId 36981) ainda
tinha SophiaTech intacta. Ver
[`projects/widgets/data/trial-env.json`](../../../projects/widgets/data/trial-env.json)
como exemplo committed.

## Caso real / motivação

- **2026-05-15 manhã**: sessão de skill `testar-exclusao-dados-trial-twygo`
  v1.0 deixou aberta a decisão "qual projeto detém os 5 envs Trial".
- **2026-05-15 (mesmo dia)**: usuário identificou que reusar envs entre
  projetos é inviável (a suite de exclusão zera o env). Primeira ideia:
  5 Trials por projeto. Skill `provisionar-trials-projeto-twygo` (plural)
  documentou isso.
- **2026-05-15 (continuação)**: usuário simplificou — não vale o custo
  de 5 Trials por projeto pra validar exclusão. **1 Trial fixa em ICP
  "Outros"** é suficiente. Skill renomeada `provisionar-trial-projeto-twygo`
  (singular). Esta v1.0 é o resultado.
- **2026-05-15 (mais tarde)**: usuário aprovou o atalho "legacy-env-reuse"
  pra primeira execução do widgets — env `trial-agentsqa-other` ainda
  intacto. Atalho documentado acima.
