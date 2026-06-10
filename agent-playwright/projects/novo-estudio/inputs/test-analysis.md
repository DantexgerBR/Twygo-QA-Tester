---
contract_version: '1.2'
at_version: 1
project: novo-estudio
project_name: Novo Estúdio de Criação
generated_at: '2026-06-03T14:52:34Z'
generated_by: agent-at@481870d (testlink_to_md.py — migração reversa)
source_docs:
- docs/Analise_Teste_Novo_Estudio_Criacao.xml
- docs/Analise_Teste_Novo_Estudio_Criacao.xmind
env: staging
totals:
  suites: 21
  test_cases: 295
  steps: 1018
---

# Análise de Teste — Novo Estúdio de Criação

> **AT migrada (migração reversa — 2026-06-03)**: esta análise nasceu
> manual (XMind + XML TestLink, maio/2026) e foi convertida para o MD
> canônico via `scripts/testlink_to_md.py`. A partir desta versão, o MD
> é a fonte única de verdade (CONTRACT.md §2) — XMind e XML passam a ser
> derivados regenerados.
>
> **Escopo**: 21 suítes cobrindo o novo Estúdio de Criação de atividades —
> regressão SEM a feature flag, criação via cards (Curso/Trilha/Pacote),
> tela única em 3 colunas (lista, preview, copiloto), abas persistidas por
> usuário, Identificação com campos para IA, listagem com badges de etapa
> e scroll infinito, renomeação de tipo/ícone por atividade, preview por
> tipo, copiloto IA (histórico, geração em sequência fixa, atividades em
> massa), render assíncrono da versão publicada, criação 100% manual,
> mobile, coexistência com a tela antiga via feature flag, duplicação de
> curso, validações de banco (tabelas novas, logs, exclusão de histórico)
> e Trial.
>
> **Prosa preservada verbatim do XML original** — desvios das convenções
> de escrita (`twygo-qa-conventions`) são apontados pelo
> `validate_md_canonical.py` e tratados em iterações seguintes com
> decisão do QA.
>
> **Executor primário**: todas as suítes declaram `executor: playwright`
> (restrição v1 do CONTRACT.md). TCs de validação de banco declaram
> `Tipo: db` — validação secundária via `agent-db` (subprocess, manual
> hoje). TCs de API declaram `Tipo: api` e rodam em `tests/api/`.

## Dados de teste

### Organizações (chaves simbólicas)
- `org: principal` — default de todas as suítes. Resolvido via `getOrgId()` do consumidor.
- `org: trial` — suíte "Trial" (criação de org Trial via URL pública/API).

> Valores concretos (orgIds, hosts) ficam em `agent-playwright/.env`
> (gitignored), referenciados via `config/environment.json`.

### Feature flag
- `featureFlag`: `creation_studio` (Flipper, escopo por organização) — gate de TODO o Estúdio novo. Suítes de regressão rodam com a flag DESABILITADA; demais com ela HABILITADA.

### Rotas
- `rotaEstudio`: `/o/{org}/events/:id/edit/studio` (rota nova — Estúdio)
- `rotaAtividadesAntiga`: `/o/{org}/events/:id/edit/activities` (tela antiga — fallback quando flag OFF)
- `rotaEdicaoCurso`: `/o/{org}/events/:id/edit`
- `rotaListagemConteudos`: `/o/{org}/events`
- `rotaRegistroTrial`: `/new/register/steps?1`

### Tipos de atividade (cobertos na regressão e na criação manual)
- Texto, Página (Page), Aula (Lesson), PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário, SCORM, Game, Banner

### Tabelas de banco (novas do projeto — validação `Tipo: db`)
- MySQL: `activity_summaries`
- PostgreSQL: `studio_generation_partitions`, `org_generation_preferences`, `user_course_preferences`, `conversations`, `messages`, `event_contents`, `postgres_logs`
- DynamoDB: `studio_checkpoints`, `messages`

### Campos novos de atividade
- `display_label` (nome customizado do tipo — backfill default = nome do tipo)
- `display_icon` (ícone customizado — seletor Google Icons)

## Textos literais

### Toast — sucesso
- "Alterações salvas com sucesso."

### Mensagens de erro
- "Nome é obrigatório" (borda vermelha no campo "Nome")
- "O nome customizado é obrigatório" (texto a confirmar em ambiente — bloqueio de salvamento do `display_label` vazio)

### Labels e botões
- Ação na listagem de Conteúdos: "Editar curso" (renomeada de "Gerenciar curso")
- Botão de criação de atividade: "Adicionar atividade"
- Botões do topo do Estúdio: "Salvar", "Publicar alterações", "Salvar como novo", "Visualizar como aluno"
- Cards de criação (ordem fixa): "Curso", "Trilha", "Pacote"
- Abas internas do cadastro de atividade: "Dados" e "Conteúdo"
- Aba do curso: "Identificação" (sections "Básico", "Caracterização", "Configurações de IA")
- Copiloto: "Abrir copiloto" (atalho Ctrl+J), "Nova conversa", "Enviar"
- Geração IA: "Criar curso com IA", "Concluir geração com IA", "Aprovar", "Regerar imagem"
- Badges de etapa (Lesson): "Roteiro", "Slides", "Imagens", "Áudios", "Render" — estados "Pendente"/"Pronto"

## Modais relevantes

### Seleção de tipos de atividade
- **Quando aparece**: ao clicar em "Adicionar atividade" no Estúdio
- **Conteúdo**: seleção de tipos (modal/drawer) com os tipos de atividade disponíveis

### Cadastro de Lesson
- **Quando aparece**: ao selecionar tipo "Aula" na seleção de tipos
- **Conteúdo**: 2 abas internas — "Dados" e "Conteúdo" (editor Fabric.js)

### Cadastro de Page
- **Quando aparece**: ao selecionar tipo "Página" na seleção de tipos
- **Conteúdo**: 2 abas internas — "Dados" e "Conteúdo" (editor Plate.js)

### Modal de aprovação de atividade
- **Quando aparece**: ao clicar em atividade configurada com aprovação, no Aprender (aluno)
- **Comportamento relevante**: o preview do Estúdio NÃO dispara este modal

### Página de seleção de tipo de conteúdo (NÃO é modal)
- **Quando aparece**: ação "Adicionar" na listagem de Conteúdos
- **Comportamento relevante**: abre página dedicada com 3 cards (Curso, Trilha, Pacote) — sem backdrop de modal nem drawer

## Endpoints (referência)

| Método | URL | Sucesso | Erro |
|---|---|---|---|
| `POST` | `/api/v2/external_onboarding` | 201 Created (body: `organization_id`, `user_id`, `access_token`) | 422 (payload inválido) |

> Endpoint usado pelo TC "Criar trial via API" (suíte Trial). Demais
> validações de rede do Estúdio (jobs de geração IA, render assíncrono)
> são observadas via Network probe — endpoints internos a catalogar em
> recon quando os specs forem gerados.

## Campos e validações

| Campo | Regras |
|---|---|
| "Nome" (atividade) | obrigatório — erro "Nome é obrigatório" com borda vermelha |
| `display_label` | obrigatório quando customizado; default = nome do tipo (backfill) |
| `display_icon` | seleção restrita aos ícones Google Icons disponíveis |
| "Idade" (Identificação) | faixa etária do público-alvo — alimenta contexto da IA |
| "Tom de voz" (Identificação) | alimenta contexto da IA |
| "Dificuldade" (Identificação) | alimenta contexto da IA |

---
suite: Repasse SEM a Feature Flag
executor: playwright
playbooks:
- flipper
- super-admin
- cleanup-dados
preconditions:
- Usuário logado como administrador.
- Feature flag "creation_studio" (Flipper) DESABILITADA para a organização
- Ambiente Stage configurado
- Usuário na listagem de Conteúdos da organização
---

# Repasse SEM a Feature Flag

## TC1 — Validar criação e execução de curso/trilha/pacote
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Repasse SEM a Feature Flag. Importante validar que todos os fluxos SEM a feature continuam funcionando, pois, essa reestruturação de pela pode impactar as funcionalidades já existentes.

### Passos
1. Criar um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos.
   → Verificar no Aprender que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
2. Criar uma TRILHA e vincular um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos na Trilha.
   → Verificar no Aprender que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
3. Criar uma PACOTE e vincular um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos no Pacote.
   → Verificar no Aprender que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.

## TC2 — Validar DUPLICAÇÃO e execução de curso/trilha/pacote
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Repasse SEM a Feature Flag. Importante validar que todos os fluxos SEM a feature continuam funcionando, pois, essa reestruturação de pela pode impactar as funcionalidades já existentes.

### Passos
1. Criar um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) DUPLICAR o curso e realizar a inscrição de alunos.
   → Verificar no Aprender do curso duplicado que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
2. Criar uma TRILHA e vincular um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) DUPLICAR o curso e realizar a inscrição de alunos na Trilha.
   → Verificar no Aprender do curso duplicado que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
3. Criar uma PACOTE e vincular um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) DUPLICAR o curso e realizar a inscrição de alunos no Pacote.
   → Verificar no Aprender do curso duplicado que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.

## TC3 — Validar a CÓPIA DE ATIVIDADES e execução de curso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Repasse SEM a Feature Flag. Importante validar que todos os fluxos SEM a feature continuam funcionando, pois, essa reestruturação de pela pode impactar as funcionalidades já existentes.

### Passos
1. Criar um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) clicar no botão "Cópia de atividades" e realizar a cópia de atividade de outro curso para esse curso que esta sendo editado e realizar a inscrição de alunos.
   → Verificar no Aprender desse curso que todas as atividades desse curso (originais e copiadas) estão sendo exibidas e funcionando para o aluno.

## TC4 — Validar os recursos da "Soph.ia" nas atividades do curso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Repasse SEM a Feature Flag. Importante validar que todos os fluxos SEM a feature continuam funcionando, pois, essa reestruturação de pela pode impactar as funcionalidades já existentes.

### Passos
1. Criar um curso, editar as atividades, clicar no botão "Soph.ia", "Criar atividades" usando a "Soph.ia" e inscrever alunos
   → Verificar no Aprender desse curso que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
2. Criar um curso, editar as atividades, clicar no botão "Soph.ia", "Criar resumo de atividades" usando a "Soph.ia" e inscrever alunos
   → Verificar no Aprender desse curso que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
3. Criar um curso, editar as atividades, clicar no botão "Soph.ia", "Criar roteiro do narrador (script)" usando a "Soph.ia" e inscrever alunos
   → Verificar no Aprender desse curso que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
4. Criar um curso, editar as atividades, clicar no botão "Soph.ia", "Criar questionário" usando a "Soph.ia" e inscrever alunos
   → Verificar no Aprender desse curso que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.

## TC5 — Validar curso/trilha/pacote no compartilhamento CÓPIA
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Repasse SEM a Feature Flag. Importante validar que todos os fluxos SEM a feature continuam funcionando, pois, essa reestruturação de pela pode impactar as funcionalidades já existentes.

### Passos
1. Criar um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos e COMPARTILHAR para outro ambiente em forma de CÓPIA
   → Verificar no Aprender do ambiente consumidor que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
2. Criar uma TRILHA e vincular um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos na Trilha e COMPARTILHAR para outro ambiente em forma de CÓPIA
   → Verificar no Aprender do ambiente consumidor que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
3. Criar uma PACOTE e vincular um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos no Pacote e COMPARTILHAR para outro ambiente em forma de CÓPIA
   → Verificar no Aprender do ambiente consumidor que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.

## TC6 — Validar curso/trilha/pacote no compartilhamento ESPELHO
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Repasse SEM a Feature Flag. Importante validar que todos os fluxos SEM a feature continuam funcionando, pois, essa reestruturação de pela pode impactar as funcionalidades já existentes.

### Passos
1. Criar um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos e COMPARTILHAR para outro ambiente em forma de ESPELHO
   → Verificar no Aprender do ambiente consumidor que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
2. Criar uma TRILHA e vincular um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos na Trilha e COMPARTILHAR para outro ambiente em forma de ESPELHO
   → Verificar no Aprender do ambiente consumidor que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
3. Criar uma PACOTE e vincular um curso, criar várias atividades diferentes (Texto, Página, Aula, PDF Estampado, Vídeo, Vídeo Externo, Arquivos, Questionário e Scorm) nesse curso e realizar a inscrição de alunos no Pacote e COMPARTILHAR para outro ambiente em forma de ESPELHO
   → Verificar no Aprender do ambiente consumidor que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.

## TC7 — Criação de curso pelo estúdio de criação (Criar curso com IA)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Repasse SEM a Feature Flag. Importante validar que todos os fluxos SEM a feature continuam funcionando, pois, essa reestruturação de pela pode impactar as funcionalidades já existentes.

### Passos
1. Gerar um curso com IA criando páginas, aulas, questionários e gerando imagens com IA e inscrever alunos
   → Verificar no Aprender que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
2. Gerar um curso com IA criando páginas, aulas, questionários e gerando imagens com IA e inscrever alunos e COMPARTILHAR para outro ambiente em forma de CÓPIA
   → Verificar no Aprender do ambiente consumidor que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.
3. Gerar um curso com IA criando páginas, aulas, questionários e gerando imagens com IA e inscrever alunos e COMPARTILHAR para outro ambiente em forma de ESPELHO
   → Verificar no Aprender do ambiente consumidor que todas as atividades desse curso estão sendo exibidas e funcionando para o aluno.

---
suite: Criação via cards de Curso, Trilha e Pacote
executor: playwright
playbooks:
- flipper
- filtro-drawer
- cleanup-dados
preconditions:
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Criação via cards de Curso, Trilha e Pacote

## TC1 — Validar abertura da página de seleção de tipo via "Adicionar"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a ação "Adicionar" na listagem de Conteúdos abre uma página dedicada com 3 cards.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Usuário na listagem de Conteúdos da organização.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events"
   → Listagem de Conteúdos é exibida
3. Clicar no botão "Adicionar"
   → Página dedicada (não modal/drawer) é aberta exibindo 3 cards
4. Validar que a URL do navegador contém "/events/new"
   → URL contém "/events/new" ou caminho equivalente da nova página dedicada

## TC2 — Validar ordem fixa dos cards: Curso, Trilha, Pacote
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que os cards aparecem na ordem fixa Curso, Trilha, Pacote (Pacote sempre último).

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Página de seleção de tipo de conteúdo aberta.
   → Estado descrito pré-existe no ambiente.
2. Aguardar a página de seleção de tipo ser exibida
   → 3 cards são exibidos na coluna
3. Verificar a ordem dos cards "Curso", "Trilha" e "Pacote" da esquerda para a direita
   → Ordem exibida: 1º "Curso", 2º "Trilha", 3º "Pacote"
4. Verificar a posição do card "Pacote"
   → Card "Pacote" aparece sempre como último da ordem

## TC3 — Validar conteúdo do card "Curso"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o card "Curso" exibe ícone, título e descrição literais.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Página de seleção de tipo de conteúdo aberta.
   → Estado descrito pré-existe no ambiente.
2. Aguardar a página de seleção de tipo ser exibida
   → Card "Curso" é exibido
3. Verificar o título do card "Curso"
   → Título exibido: "Curso"
4. Verificar o parágrafo descritivo do card "Curso"
   → "Conteúdo único com aulas, atividades e avaliações para uma capacitação específica."
5. Verificar a presença do ícone do card "Curso"
   → Ícone do card "Curso" é exibido

## TC4 — Validar conteúdo do card "Trilha"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o card "Trilha" exibe ícone, título e descrição literais.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Página de seleção de tipo de conteúdo aberta.
   → Estado descrito pré-existe no ambiente.
2. Aguardar a página de seleção de tipo ser exibida
   → Card "Trilha" é exibido
3. Verificar o título do card "Trilha"
   → Título exibido: "Trilha"
4. Verificar o parágrafo descritivo do card "Trilha"
   → "Sequência ordenada de cursos para guiar uma jornada completa de aprendizado".
5. Verificar a presença do ícone do card "Trilha"
   → Ícone do card "Trilha" é exibido

## TC5 — Validar conteúdo do card "Pacote"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o card "Pacote" exibe ícone, título e descrição literais.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Página de seleção de tipo de conteúdo aberta.
   → Estado descrito pré-existe no ambiente.
2. Aguardar a página de seleção de tipo ser exibida
   → Card "Pacote" é exibido
3. Verificar o título do card "Pacote"
   → Título exibido: "Pacote"
4. Verificar o parágrafo descritivo do card "Pacote"
   → "Conjunto de cursos e trilhas agrupados para venda ou atribuição em bloco".
5. Verificar a presença do ícone do card "Pacote"
   → Ícone do card "Pacote" é exibido

## TC6 — Selecionar card "Curso" direciona para o Estúdio de Criação
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que selecionar "Curso" abre o Estúdio com curso vazio.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Página de seleção de tipo de conteúdo aberta.
   → Estado descrito pré-existe no ambiente.
2. Clicar no card "Curso"
   → Sistema redireciona para o Estúdio de Criação
3. Validar que a URL do navegador contém "/edit/studio"
   → URL contém "/edit/studio"
4. Validar a lista de atividades exibida no "Estúdio de criação"
   → Curso aberto está vazio (sem atividades cadastradas)

## TC7 — Selecionar card "Trilha" mantém fluxo atual
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que selecionar "Trilha" segue o caminho atual da plataforma.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Página de seleção de tipo de conteúdo aberta.
   → Estado descrito pré-existe no ambiente.
2. Clicar no card "Trilha"
   → Sistema segue o fluxo atual de criação de Trilha (sem mudanças neste release)

## TC8 — Selecionar card "Pacote" mantém fluxo atual
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que selecionar "Pacote" segue o caminho atual da plataforma.

### Passos
1. Pré-condição: Usuário logado como Instrutor com permissão de edição de curso; Página de seleção de tipo de conteúdo aberta.
   → Estado descrito pré-existe no ambiente.
2. Clicar no card "Pacote"
   → Sistema segue o fluxo atual de criação de Pacote (sem mudanças neste release)

## TC9 — Validar coexistência com "Criar curso com IA" (assistente 4 passos)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o assistente atual de IA continua acessível como caminho alternativo.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Usuário na listagem de Conteúdos.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events"
   → Listagem de Conteúdos é exibida
3. Verificar a presença da chamada complementar para "Criar curso com IA"
   → Ação "Criar curso com IA" é exibida (assistente de 4 passos continua disponível)
4. Clicar em "Criar curso com IA"
   → Assistente de 4 passos é aberto

## TC10 — Validar que a página de cards NÃO é modal nem drawer
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a nova tela é página dedicada (padrão atual do produto).

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Usuário na listagem de Conteúdos.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar"
   → Página dedicada é aberta
3. Verificar que a página "Adicionar" abre dedicada, sem sobreposição de modal ou drawer lateral
   → Página ocupa toda a área principal de conteúdo (não há backdrop de modal nem drawer)
4. Verificar que a URL do navegador mudou para a rota dedicada "/events/new"
   → URL muda para nova rota dedicada

## TC11 — Validar exibição dos 3 cards em viewport Tablet (768x1024)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o layout dos cards mantém responsividade em tablet.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Viewport Tablet (768x1024); Usuário na listagem de Conteúdos.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar"
   → Página dedicada com 3 cards é exibida
3. Verificar o layout dos cards "Curso", "Trilha" e "Pacote" na largura 768px
   → 3 cards são exibidos adaptados à largura de 768px sem cortes

## TC12 — Validar exibição dos 3 cards em viewport Mobile (360x740)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o layout dos cards mantém responsividade em mobile.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Viewport Mobile (360x740); Usuário na listagem de Conteúdos.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar"
   → Página dedicada com 3 cards é exibida
3. Verificar o layout dos cards "Curso", "Trilha" e "Pacote" na largura 360px
   → 3 cards são empilhados verticalmente, adaptados à largura de 360px

---
suite: Estúdio de Criação com tela única em três colunas
executor: playwright
playbooks:
- flipper
- filtro-drawer
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
- Curso de teste previamente cadastrado
---

# Estúdio de Criação com tela única em três colunas

## TC1 — Acessar o Estúdio via rota nova
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a rota nova abre o Estúdio.

### Passos
1. Acessar a URL "/o/{org}/events/:id/edit/studio"
   → Estúdio de Criação é carregado
2. Verificar o título da aba do navegador (tag "title")
   → Título reflete o nome do curso e contexto de edição

## TC2 — Validar layout em 3 colunas (lista, preview, copiloto)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o Estúdio é renderizado com as 3 colunas.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Aguardar o Estúdio ser carregado
   → Layout em 3 colunas é exibido
3. Verificar a coluna esquerda do "Estúdio"
   → Coluna esquerda exibe a lista de atividades
4. Verificar a coluna central do "Estúdio"
   → Coluna central exibe área de preview da atividade selecionada
5. Verificar a coluna direita do "Estúdio"
   → Coluna direita exibe o drawer do copiloto IA

## TC3 — Validar que Estúdio substitui a aba "Atividades" antiga
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a aba "Atividades" do gerenciamento foi substituída pelo Estúdio.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Aguardar o Estúdio ser carregado
   → Estúdio é exibido no lugar da aba "Atividades" antiga
3. Verificar a ausência da aba "Atividades" no menu lateral de edição de curso
   → Não há aba "Atividades" separada; o Estúdio ocupa essa posição

## TC4 — Validar coexistência das demais abas (Identificação, Modelo, Banner, Certificado)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que as demais abas continuam existindo no mesmo nível.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Aguardar o Estúdio ser carregado
   → Estúdio é exibido
3. Verificar as abas "Identificação", "Modelo", "Banner" e "Certificado" no menu lateral de edição de curso
   → Abas "Identificação", "Modelo", "Banner" e "Certificado" são exibidas como irmãs do Estúdio
4. Clicar na aba "Identificação"
   → Aba "Identificação" é exibida com seus campos

## TC5 — Validar menu lateral principal colapsável para ícones
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o menu lateral pode recolher para ícones.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão de colapsar menu lateral
   → Menu lateral principal recolhe exibindo apenas ícones
3. Verificar o espaço horizontal da coluna esquerda do "Estúdio"
   → Coluna esquerda do Estúdio ganha espaço horizontal adicional

## TC6 — Validar menu lateral principal ocultar inteiramente
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o menu lateral pode ser totalmente ocultado.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão de ocultar menu lateral inteiramente
   → Menu lateral principal é ocultado completamente
3. Verificar a área ocupada pelo "Estúdio" na tela
   → Estúdio ocupa toda a largura da tela disponível

## TC7 — Validar drawer do copiloto expansível até ~50%
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o drawer pode ser expandido até ~50% da largura.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Aguardar "drawer do copiloto" ser exibido
   → Drawer ocupa ~30% da largura por padrão
3. Clicar no botão "Expandir" do drawer
   → Drawer expande até ~50% da largura da tela
4. Verificar o layout da coluna central ("Preview") do Estúdio
   → Coluna central de preview reduz proporcionalmente sem quebrar

## TC8 — Validar fechamento do drawer do copiloto
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o drawer pode ser fechado para liberar espaço.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "X" do drawer do copiloto
   → Drawer é fechado
3. Verificar o layout das colunas do "Estúdio"
   → Coluna central de preview expande para ocupar o espaço liberado

## TC9 — Validar que o layout-base NÃO quebra em 1366x720
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o Estúdio é otimizado para 1366x720.

### Passos
1. Pré-condição: Viewport configurado em 1366x720.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events/:id/edit/studio"
   → Estúdio carrega sem scrolls horizontais
3. Verificar as 3 colunas do "Estúdio" na resolução 1366x720
   → Lista, preview e drawer cabem na resolução 1366x720 sem quebras

## TC10 — Validar comportamento em resolução menor que 1366x720
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que resoluções menores caem em comportamento mobile.

### Passos
1. Pré-condição: Viewport configurado em 1024x600.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events/:id/edit/studio"
   → Estúdio aplica layout mobile/tablet (3 tabs no rodapé)

---
suite: Reordenar e persistir abas por usuário, renomear "Gerenciar" e "Editar"
executor: playwright
playbooks:
- flipper
- toast-chakra
- beforeunload
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Reordenar e persistir abas por usuário, renomear "Gerenciar" e "Editar"

## TC1 — Validar renomeação "Gerenciar curso" para "Editar curso"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a ação na listagem foi renomeada.

### Passos
1. Pré-condição: Usuário na listagem de Conteúdos; Pelo menos 1 curso previamente cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events"
   → Listagem de Conteúdos é exibida
3. Localizar a ação correspondente a "Editar curso" no card/linha do curso
   → Ação exibida: "Editar curso" (no lugar do antigo "Gerenciar curso")

## TC2 — Reordenar abas dentro de "Editar curso" via drag and drop
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que as abas internas podem ser reordenadas via drag &amp; drop.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Usuário na tela "Editar curso" do curso.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events/:id/edit"
   → Tela "Editar curso" é exibida com as abas internas
3. Arrastar a aba "Modelo" para a posição da aba "Banner"
   → Aba "Modelo" é movida para a nova posição
4. Verificar a nova ordem das abas em "Editar curso"
   → Ordem das abas reflete a alteração

## TC3 — Validar ícone de drag visível ao passar mouse sobre título da aba
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir feedback visual no hover.

### Passos
1. Pré-condição: Usuário na tela "Editar curso" do curso.
   → Estado descrito pré-existe no ambiente.
2. Passar o mouse (hover) sobre o título de uma aba móvel (ex.: "Modelo")
   → Ícone de drag é exibido ao lado do título da aba
3. Passar o mouse sobre a aba "Identificação"
   → Ícone de drag NÃO é exibido (aba travada)

## TC4 — Validar persistência da ordem após recarregar a página
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a nova ordem fica salva em banco.

### Passos
1. Pré-condição: Usuário na tela "Editar curso" do curso.
   → Estado descrito pré-existe no ambiente.
2. Arrastar a aba "Banner" para a posição final
   → Aba "Banner" é movida
3. Recarregar a página (F5)
   → Ordem das abas é mantida com "Banner" na nova posição
4. Sair do curso e retornar via "Editar curso"
   → Ordem persiste após nova abertura

## TC5 — Validar persistência da ordem por usuário (escopo User x Organization)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que cada instrutor tem sua própria ordem.

### Passos
1. Pré-condição: Dois instrutores distintos cadastrados na organização; Curso de teste compartilhado entre eles.
   → Estado descrito pré-existe no ambiente.
2. Acessar o curso como Administrador A e reordenar abas
   → Ordem do Administrador A é salva
3. Sair e logar como Administrador B no mesmo curso
   → Administrador B vê a ordem padrão (não a ordem do Administrador A)
4. Reordenar abas como Administrador B
   → Nova ordem é salva apenas para Administrador B
5. Logar novamente como Administrador A
   → Ordem do Instrutor A é restaurada (independente da ordem do Administrador B)

## TC6 — Validar restauração da última aba aberta por usuário x curso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que ao abrir o curso, a UI carrega na última aba usada.

### Passos
1. Pré-condição: Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events/:id/edit"
   → Curso abre na aba "Identificação" (default na primeira vez)
3. Clicar na aba "Banner"
   → Aba "Banner" é exibida
4. Sair do curso e retornar via "Editar curso"
   → Curso abre diretamente na aba "Banner" (última aba usada)

## TC7 — Validar que a aba "Identificação" é travada e não permite mover
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a primeira aba não pode ser reordenada.

### Passos
1. Pré-condição: Usuário na tela "Editar curso" do curso.
   → Estado descrito pré-existe no ambiente.
2. Tentar arrastar a aba "Identificação" para outra posição
   → Aba "Identificação" não se move; permanece na primeira posição
3. Recarregar a página
   → Aba "Identificação" continua na primeira posição

## TC8 — Validar que arrastar "Identificação" não tem efeito visual nem persistido
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que tentativa de mover a aba travada não corrompe a ordem.

### Passos
1. Pré-condição: Usuário na tela "Editar curso" do curso.
   → Estado descrito pré-existe no ambiente.
2. Forçar drag &amp; drop sobre "Identificação"
   → Aba não responde ao drag
3. Verificar a ordem das demais abas em "Editar curso"
   → Ordem das demais abas é preservada

## TC9 — Validar salvamento independente por aba
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que cada aba mantém botão Salvar próprio.

### Passos
1. Pré-condição: Usuário na tela "Editar curso" do curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar na aba "Identificação"
   → Aba "Identificação" exibe botão "Salvar" próprio
3. Editar campo "Nome" do curso
   → Campo aceita a edição
4. Clicar no botão "Salvar" na aba "Identificação"
   → Toast exibida: "Alterações salvas com sucesso." (ou texto equivalente)

## TC10 — Validar confirmação ao trocar de aba com alterações não salvas
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que mudança de aba pede confirmação ou descarta alterações.

### Passos
1. Pré-condição: Usuário na tela "Editar curso" do curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar na aba "Identificação"
   → Aba "Identificação" é exibida
3. Editar campo "Nome" do curso (sem salvar)
   → Campo é alterado, não salvo
4. Clicar na aba "Banner"
   → Modal de confirmação é exibido OU alterações são descartadas conforme política

## TC11 — Validar persistência em banco (não em cookie/local storage)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que tab_order e last_tab são persistidos em banco.

### Passos
1. Pré-condição: Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar o Estúdio em um navegador, reordenar abas e clicar em "Banner"
   → Nova ordem e última aba são salvas
3. Limpar cookies e local storage do navegador
   → Storage local é limpo
4. Acessar novamente o curso com a mesma conta
   → Ordem e última aba são restauradas (vieram do banco, não do storage local)

## TC12 — [Validação Manual] Validar registros em "user_course_preferences"
**Prioridade**: low
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir que a tabela armazena tab_order (JSON) e last_tab (string).

### Passos
1. Pré-condição: Acesso ao banco MySQL do ambiente Stage; Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Reordenar abas e clicar em uma aba específica no Estúdio
   → Alterações são salvas via UI
3. Consultar SELECT * FROM user_course_preferences WHERE user_id = X AND event_id = Y
   → Registro contém "tab_order" (JSON array) e "last_tab" (string) preenchidos

---
suite: Configurar identificação do curso com seções e campos para IA
executor: playwright
playbooks:
- flipper
- filtro-drawer
- toast-chakra
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
- Curso de teste previamente cadastrado
---

# Configurar identificação do curso com seções e campos para IA

## TC1 — Acessar aba "Identificação" do curso
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir navegação até a aba.

### Passos
1. Acessar a URL "/o/{org}/events/:id/edit"
   → Tela "Editar curso" é exibida
2. Clicar na aba "Identificação"
   → Aba "Identificação" é exibida com sections

## TC2 — Validar exibição das sections (Básico, Caracterização, Configurações de IA)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a Identificação é organizada em sections.

### Passos
1. Pré-condição: Usuário na aba "Identificação" do curso.
   → Estado descrito pré-existe no ambiente.
2. Aguardar a aba "Identificação" ser exibida
   → Sections são exibidas com cabeçalhos: "Básico", "Caracterização", "Configurações de IA"
3. Verificar que os campos estão agrupados por tema nas sections "Básico", "Caracterização" e "Configurações de IA"
   → Cada section agrupa campos relacionados ao seu tema

## TC3 — Preencher campo "Idade" (faixa etária do público-alvo)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o campo aceita preenchimento.

### Passos
1. Pré-condição: Usuário na aba "Identificação" na section "Configurações de IA".
   → Estado descrito pré-existe no ambiente.
2. Preencher o campo "Idade" com "25-35 anos"
   → Campo aceita o texto
3. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso."

## TC4 — Preencher campo "Dificuldade" (nível esperado)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o campo aceita seleção.

### Passos
1. Pré-condição: Usuário na aba "Identificação" na section "Configurações de IA".
   → Estado descrito pré-existe no ambiente.
2. Selecionar "Intermediário" no dropdown "Dificuldade"
   → Opção "Intermediário" é selecionada
3. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso."

## TC5 — Preencher campo "Tom de voz"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o campo aceita preenchimento.

### Passos
1. Pré-condição: Usuário na aba "Identificação" na section "Configurações de IA".
   → Estado descrito pré-existe no ambiente.
2. Preencher o campo "Tom de voz" com "Descontraído"
   → Campo aceita o texto
3. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso."

## TC6 — Validar tooltip da section "Configurações de IA"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir texto literal do tooltip.

### Passos
1. Pré-condição: Usuário na aba "Identificação".
   → Estado descrito pré-existe no ambiente.
2. Passar o mouse sobre o ícone de informação da section "Configurações de IA"
   → Tooltip exibida: "Estes campos são usados pela IA na geração de conteúdo. Quanto mais preenchidos, melhor o resultado."

## TC7 — Validar campos existentes preservados
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que os campos atuais continuam disponíveis.

### Passos
1. Pré-condição: Usuário na aba "Identificação".
   → Estado descrito pré-existe no ambiente.
2. Aguardar a aba "Identificação" ser exibida
   → Campos "Nome", "Descrição", "Idioma" são exibidos
3. Editar o campo "Nome" com "Curso de Teste Automatizado"
   → Campo aceita a edição
4. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso."

## TC8 — Salvar e recarregar - persistência dos novos campos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que os campos novos persistem após reload.

### Passos
1. Pré-condição: Usuário na aba "Identificação" na section "Configurações de IA".
   → Estado descrito pré-existe no ambiente.
2. Preencher o campo "Idade" com "30-40 anos"
   → Campo aceita o texto
3. Selecionar "Avançado" no dropdown "Dificuldade"
   → Opção selecionada
4. Preencher o campo "Tom de voz" com "Técnico"
   → Campo aceita o texto
5. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso."
6. Recarregar a página (F5)
   → Campos "Idade", "Dificuldade" e "Tom de voz" mantêm os valores "30-40 anos", "Avançado" e "Técnico"

## TC9 — Validar copiloto isolado na aba Identificação (não manipula formulário)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o copiloto na Identificação é apenas sugestão.

### Passos
1. Pré-condição: Usuário na aba "Identificação".
   → Estado descrito pré-existe no ambiente.
2. Clicar no ícone do copiloto
   → Drawer do copiloto é exibido
3. Solicitar "Sugira uma descrição para este curso"
   → Copiloto retorna texto sugerido no chat (sem alterar o campo "Descrição")
4. Verificar campo "Descrição"
   → Campo "Descrição" NÃO foi alterado automaticamente pela IA

## TC10 — Copiar manualmente sugestão do copiloto para o campo "Descrição"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o usuário copia/cola manualmente.

### Passos
1. Pré-condição: Usuário na aba "Identificação" com drawer do copiloto aberto e sugestão de descrição exibida.
   → Estado descrito pré-existe no ambiente.
2. Selecionar texto sugerido no chat do copiloto e copiar (Ctrl+C)
   → Texto é copiado para área de transferência
3. Clicar no campo "Descrição" e colar (Ctrl+V)
   → Texto é colado no campo "Descrição"
4. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso."

## TC11 — Validar cabeçalhos e tooltips de cada section
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que cada section tem cabeçalho identificável.

### Passos
1. Pré-condição: Usuário na aba "Identificação".
   → Estado descrito pré-existe no ambiente.
2. Verificar a section "Básico"
   → Cabeçalho "Básico" é exibido
3. Verificar a section "Caracterização"
   → Cabeçalho "Caracterização" é exibido
4. Verificar a section "Configurações de IA"
   → Cabeçalho "Configurações de IA" é exibido

## TC12 — Validar limites de caracteres dos novos campos
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir validação de limites.

### Passos
1. Pré-condição: Usuário na aba "Identificação" na section "Configurações de IA".
   → Estado descrito pré-existe no ambiente.
2. Preencher o campo "Idade" com texto excedendo o limite máximo definido
   → Campo não permite caracteres além do limite OU exibe mensagem de validação
3. Preencher o campo "Tom de voz" com texto excedendo o limite máximo definido
   → Campo não permite caracteres além do limite OU exibe mensagem de validação

## TC13 — Tentar salvar a Identificação com campos obrigatórios vazios
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir mensagens de validação para campos obrigatórios.

### Passos
1. Pré-condição: Usuário na aba "Identificação".
   → Estado descrito pré-existe no ambiente.
2. Limpar o campo "Nome" do curso
   → Campo fica vazio
3. Clicar no botão "Salvar"
   → Borda vermelha no campo "Nome". Mensagem de erro exibida: "Nome é obrigatório"

## TC14 — Validar toast de sucesso ao salvar a Identificação
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir mensagem de sucesso.

### Passos
1. Pré-condição: Usuário na aba "Identificação".
   → Estado descrito pré-existe no ambiente.
2. Preencher todos os campos obrigatórios com valores válidos
   → Campos aceitam valores
3. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso." (ou texto equivalente)

---
suite: Listar atividades de cards, badges de etapa e scroll infinito
executor: playwright
playbooks:
- flipper
- filtro-drawer
- toast-chakra
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
- Curso de teste previamente cadastrado
- Acessar a URL "/o/{org}/events/:id/edit/studio"
---

# Listar atividades de cards, badges de etapa e scroll infinito

## TC1 — Validar exibição completa do card-rich da atividade
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que cada atividade na lista exibe checkbox, drag handle, posição, tipo, nome e badges.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Aguardar a coluna esquerda da lista de atividades ser exibida
   → Cards das atividades são renderizados
3. Verificar os componentes do "card-rich" da atividade
   → Card exibe: checkbox de seleção, drag handle (mãozinha + ícone), posição numérica (1, 2, 3...), tipo da atividade, nome da atividade e badges de etapa

## TC2 — Validar 5 badges em atividade do tipo Lesson
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que Lesson exibe as 5 badges com tooltips do nome completo.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade do tipo "Lesson" na lista
   → Card da atividade é exibido
3. Verificar as 5 badges de etapa ("R", "S", "I", "U", "R") exibidas no card
   → 5 badges exibidas com letras curtas: "R" (Roteiro), "S" (Slides), "I" (Imagens), "U" (Áudios), "R" (Renderização)
4. Passar o mouse sobre cada badge
   → Tooltip exibe o nome completo da etapa para cada letra

## TC3 — Validar 3 badges em atividade do tipo Page
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que Page exibe 3 badges.

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade do tipo "Page" na lista
   → Card da atividade é exibido
3. Verificar as badges "Roteiro", "Conteúdo" e "Imagens" exibidas no card
   → 3 badges exibidas: "Roteiro", "Conteúdo", "Imagens"

## TC4 — Validar badge "Pendente"/"Pronto" nos tipos sem subdivisão
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que Video/PDF/SCORM/Game/Questionário/Texto exibem só Pendente/Pronto.

### Passos
1. Pré-condição: Atividades dos tipos Vídeo, PDF, SCORM, Game, Questionário e Texto previamente cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Localizar atividade do tipo "Vídeo" na lista
   → Badge "Pendente" ou "Pronto" é exibida (sem subdivisão em etapas)
3. Localizar atividade do tipo "PDF" na lista
   → Badge "Pendente" ou "Pronto" é exibida
4. Localizar atividade do tipo "SCORM" na lista
   → Badge "Pendente" ou "Pronto" é exibida
5. Localizar atividade do tipo "Game" na lista
   → Badge "Pendente" ou "Pronto" é exibida
6. Localizar atividade do tipo "Questionário" na lista
   → Badge "Pendente" ou "Pronto" é exibida
7. Localizar atividade do tipo "Texto" na lista
   → Badge "Pendente" ou "Pronto" é exibida

## TC5 — Validar cor verde para etapa concluída
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir feedback visual de etapa completa.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com etapa "Roteiro" concluída.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade "Lesson" com Roteiro concluído
   → Badge "R" (Roteiro) é exibida em cor verde

## TC6 — Validar cor cinza/laranja para etapa pendente
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir feedback visual de etapa pendente.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com etapa "Slides" pendente.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade "Lesson" com Slides pendente
   → Badge "S" (Slides) é exibida em cor cinza ou laranja

## TC7 — Validar cor cinza-claro para etapa opcional (Imagens)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir feedback visual de etapa opcional.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade com etapa "Imagens" marcada como opcional.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade com etapa "Imagens" opcional
   → Badge "I" (Imagens) é exibida em cor cinza-claro indicando opcional

## TC8 — Validar card sem pendências NÃO exibe badges
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir limpeza visual quando tudo concluído.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade com todas as etapas concluídas ou opcionais resolvidas.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade sem pendências
   → Card NÃO exibe as badges de etapa (limpeza visual)

## TC9 — Validar tooltip ao passar mouse sobre badge
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir detalhamento via tooltip.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com Roteiro de 4 cenas geradas aguardando aprovação.
   → Estado descrito pré-existe no ambiente.
2. Passar o mouse sobre a badge "R" (Roteiro) da atividade
   → Tooltip exibida com detalhe da etapa, ex.: "Roteiro: 4 cenas geradas, aguardando aprovação"

## TC10 — Validar click em badge abre copiloto contextualizado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que click na badge abre copiloto com prompt-template específico.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" (Aula 3) com etapa "Imagens" pendente.
   → Estado descrito pré-existe no ambiente.
2. Clicar na badge "I" (Imagens) da Aula 3
   → Drawer do copiloto é aberto
3. Verificar o conteúdo da mensagem inicial do "Copiloto"
   → Mensagem exibida: "Você quer que eu gere as imagens da aula 3? Confirme abaixo." (ou prompt-template equivalente)
4. Verificar o contexto carregado no "Copiloto"
   → Copiloto está pré-contextualizado para gerar imagens da Aula 3

## TC11 — Validar reorder API disparada ao soltar drag and drop
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que reorder é por evento e não em batch.

### Passos
1. Pré-condição: Lista com pelo menos 3 atividades cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Arrastar a atividade da posição 1 para a posição 3 e soltar
   → Card é reposicionado visualmente
3. Monitorar requisição de rede no momento do soltar
   → Chamada PATCH para a API de reorder é disparada imediatamente ao soltar (não em batch)
4. Aguardar resposta da API
   → Posições visuais são atualizadas conforme retorno (1, 2, 3...)

## TC12 — Validar scroll infinito carrega próxima página de 50 atividades
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que ao rolar até o fim, próxima leva é carregada automaticamente.

### Passos
1. Pré-condição: Curso com pelo menos 100 atividades cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Rolar a lista de atividades até o último card visível
   → Próxima página de 50 atividades é carregada automaticamente sem ação adicional do usuário (carrega de 50 em 50)
3. Verificar a lista "Atividades" após o scroll
   → Lista exibe atividades adicionais (até 100 carregadas)

## TC13 — Validar performance da lista com 3000+ atividades
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que clientes Enterprise não sofrem queda de performance.

### Passos
1. Pré-condição: Curso com 3000 ou mais atividades cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio do curso
   → Lista carrega a primeira página (50 atividades) sem travamento
3. Rolar continuamente até carregar 500+ atividades
   → Scroll mantém-se fluido; tempo de resposta da API permanece dentro do aceitável

## TC14 — Validar botão "Ir para atividade X"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir jump-to via número de posição.

### Passos
1. Pré-condição: Curso com pelo menos 200 atividades cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Localizar o botão "Ir para atividade X" no topo da lista
   → Botão e input são exibidos
3. Preencher o campo com "150" e confirmar
   → Backend retorna a página que contém a posição 150
4. Verificar a rolagem da lista "Atividades"
   → Lista rola até o card da atividade na posição 150

## TC15 — Validar que jump-to rola até o card correto
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento visual do jump.

### Passos
1. Pré-condição: Curso com pelo menos 100 atividades cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Preencher "Ir para atividade X" com "75" e confirmar
   → Lista rola até a posição 75
3. Verificar o destaque/foco do card na lista "Atividades"
   → Card da posição 75 é exibido em viewport visível, eventualmente com destaque

## TC16 — Adicionar atividade sem nada selecionado - vai para o final
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento default de adicionar atividade.

### Passos
1. Pré-condição: Curso com pelo menos 3 atividades cadastradas; Nenhuma atividade selecionada na lista.
   → Estado descrito pré-existe no ambiente.
2. Garantir que nenhuma atividade está selecionada (checkbox)
   → Lista sem seleção
3. Clicar no botão "Adicionar atividade"
   → Seleção de tipos é exibida (modal/drawer)
4. Selecionar tipo "Página" (Page)
   → Cadastro da nova atividade é exibido
5. Salvar a nova atividade
   → Nova atividade é criada no final da lista

## TC17 — Adicionar atividade com atividade selecionada - logo após a selecionada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento contextual de adicionar atividade.

### Passos
1. Pré-condição: Curso com pelo menos 5 atividades cadastradas; Atividade da posição 2 selecionada via checkbox.
   → Estado descrito pré-existe no ambiente.
2. Marcar o checkbox da atividade na posição 2
   → Atividade é selecionada
3. Clicar no botão "Adicionar atividade"
   → Seleção de tipos é exibida
4. Selecionar tipo "Página" (Page) e salvar
   → Nova atividade é criada na posição 3 (logo após a atividade selecionada da posição 2)
5. Verificar a posição das atividades subsequentes na lista "Atividades"
   → Atividades originais nas posições 3, 4, 5 deslocam para 4, 5, 6

## TC18 — Validar exclusão de atividade sem confirmação extra
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que ações simples não pedem confirmação.

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Selecionar a atividade do tipo "Page" na lista
   → Atividade é selecionada
3. Clicar no botão "Excluir" (ou ícone correspondente)
   → Atividade é excluída imediatamente, sem modal de confirmação extra
4. Verificar a lista "Atividades" após a exclusão
   → Atividade não aparece mais na lista

## TC19 — Validar salvamento sem confirmação extra
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que salvar não pede confirmação.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Editar o nome da atividade "Lesson"
   → Campo é alterado
3. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso." (sem modal de confirmação extra)

## TC20 — Validar recálculo automático de posição numérica após reorder
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que posições são recalculadas sem campo editável.

### Passos
1. Pré-condição: Curso com pelo menos 5 atividades cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Arrastar a atividade da posição 5 para a posição 2
   → Atividade é reposicionada
3. Verificar todas as posições da lista "Atividades"
   → Posições recalculadas automaticamente: 1, 2, 3, 4, 5 (sem buracos nem campo editável)

## TC21 — Validar drag and drop restrito à janela carregada
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que reordenação não cruza fronteiras de página não-carregadas.

### Passos
1. Pré-condição: Curso com 200 atividades cadastradas; Apenas as 50 primeiras carregadas via scroll infinito.
   → Estado descrito pré-existe no ambiente.
2. Tentar arrastar a atividade da posição 1 para uma posição além do último card visível
   → Drag NÃO permite mover para posição fora da janela carregada
3. Carregar mais atividades via scroll
   → Após carregar próxima página, é possível arrastar para o novo range

## TC22 — Validar reparentação livre (filho movido para fora do pai)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que hierarquia pai-filho permite drag livre.

### Passos
1. Pré-condição: Curso com atividade pai contendo 3 atividades filhas.
   → Estado descrito pré-existe no ambiente.
2. Arrastar a atividade filha da posição 2 para fora da pai
   → Atividade filha é reparentada (vira atividade de primeiro nível ou outro pai)
3. Monitorar a requisição PATCH disparada
   → Payload inclui "{ activity_id, new_parent_id, position }"

## TC23 — Validar checkbox de seleção em massa
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir seleção múltipla via checkbox.

### Passos
1. Pré-condição: Curso com pelo menos 5 atividades cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Marcar o checkbox de 3 atividades distintas
   → 3 atividades aparecem selecionadas
3. Verificar ações em massa disponíveis (ex.: "Concluir geração com IA", "Excluir")
   → Ações em massa ficam disponíveis e refletem a seleção
4. Desmarcar uma das atividades selecionadas
   → 2 atividades permanecem selecionadas

## TC24 — Validar logs da reorder API
**Prioridade**: low
**Tipo**: db
**Playbooks adicionais**: []

> ⛔ **BLOQUEADO — logging não implementado.** Confirmado pelo dev Jeiel
> Alves de Oliveira em 08/06/2026: *"não tem logs ainda"*. A feature de
> logging de auditoria do Estúdio (Discovery RN 48.3) não foi entregue —
> não há tabela/banco de destino. Não gerar spec nem testar até a feature
> entrar. Quando entrar, pedir ao dev: banco (PostgreSQL/TimescaleDB vs
> DynamoDB), tabela e campo de correlação (`trace_id`). Reavaliar então.

### Objetivo
Garantir registro do reorder em postgres_logs.

### Passos
1. Pré-condição: Acesso ao postgres_logs do ambiente Stage.
   → Estado descrito pré-existe no ambiente.
2. Arrastar uma atividade para nova posição
   → Reorder é disparada
3. Consultar postgres_logs filtrando pelo endpoint de reorder
   → Log registrado contendo activity_id, new_parent_id, position e trace_id

## TC25 — Validar header da aba "Atividades" com contagem total
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o cabeçalho da coluna esquerda exibe a contagem total de atividades do curso.

### Passos
1. Pré-condição: Curso com 32 atividades previamente cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Clicar na aba "Atividades"
   → Estúdio é exibido com a aba "Atividades" ativa
3. Verificar o heading "Atividades (32)" no cabeçalho da coluna esquerda
   → Heading exibido: "Atividades (32)" (contagem reflete o total de atividades do curso)
4. Verificar os botões "Adicionar" e "Recolher lista de atividades" à direita do cabeçalho
   → Botões "Adicionar" e "Recolher lista de atividades" (ícone) são exibidos

## TC26 — Validar botão "Recolher lista de atividades"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o botão de recolher oculta/expande a coluna esquerda.

### Passos
1. Clicar no botão "Recolher lista de atividades"
   → Coluna esquerda da lista é recolhida/oculta, liberando espaço para o preview central
2. Clicar novamente no botão para expandir
   → Coluna esquerda volta a ser exibida com a lista de atividades

## TC27 — Validar componente "Ir para" (jump-to) com label e input numérico
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento exato do jump-to conforme protótipo.

### Passos
1. Pré-condição: Curso com 16 módulos cadastrados.
   → Estado descrito pré-existe no ambiente.
2. Localizar o componente "Ir para" no topo da lista
   → Componente exibido com label "Ir para", input numérico (spinbutton) e botão "Ir"
3. Verificar o label de range "Módulos de 1 a 16"
   → Label exibido: "Módulos de 1 a 16" (ou "Módulos de 1 a N" conforme total)
4. Preencher o campo "Ir para" com "10" e clicar em "Ir"
   → Lista rola até o módulo 10

## TC28 — Validar footer informativo da lista (paginação visual)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o footer informa progresso da lista e dica de drag.

### Passos
1. Pré-condição: Curso com 16 módulos, sendo 6 carregados na primeira página.
   → Estado descrito pré-existe no ambiente.
2. Rolar até o final da janela carregada
   → Footer informativo é exibido
3. Verificar o texto do footer "Mostrando 6 de 16 módulos na lista."
   → Parágrafos exibidos: "Mostrando 6 de 16 módulos na lista." e "Role até o fim para carregar mais."
4. Verificar a dica de drag "Arraste uma atividade sobre outra para criar sub-atividades"
   → Parágrafo exibido: "Arraste uma atividade sobre outra para criar sub-atividades"

## TC29 — Validar exibição de sub-atividades com numeração hierárquica X.Y
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que sub-atividades exibem posição hierárquica e podem ser expandidas/recolhidas.

### Passos
1. Pré-condição: Curso com atividade "Aula" pai contendo 3 sub-atividades.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade pai (ex.: posição 3) com badge "3 sub-atividades"
   → Card exibe botão "Expandir sub-atividades" (ícone chevron)
3. Clicar no botão "Expandir sub-atividades"
   → Sub-atividades são exibidas em árvore (treeitem "group") logo abaixo do pai
4. Verificar a numeração hierárquica das sub-atividades ("3.1", "3.2", "3.3")
   → Sub-atividades exibem posição hierárquica "3.1", "3.2", "3.3"
5. Verificar o tooltip do botão "Recolher sub-atividades" após abrir
   → Botão muda para "Recolher sub-atividades"
6. Clicar em "Recolher sub-atividades"
   → Sub-atividades são ocultadas; numeração filha não é mais exibida

## TC30 — Validar popover de detalhamento de pendências (badge clicável)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o botão "X pendentes" abre popover com lista clicável de etapas.

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade do tipo "Page" com 3 etapas pendentes.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade "Page" na lista com badge "3 pendentes"
   → Botão "X pendentes - Ver detalhes" é exibido no card
3. Clicar no botão "3 pendentes" (ou link "Ver detalhes.")
   → Popover/dialog é exibido
4. Verificar o título do popover "Clique em um item pendente para gerar com o copiloto:"
   → Parágrafo exibido: "Clique em um item pendente para gerar com o copiloto:"
5. Verificar os itens listados no popover ("roteiro - pendente", "conteúdo da página - pendente", "imagens - pendente")
   → Lista exibe 3 itens: "roteiro - pendente", "conteúdo da página - pendente", "imagens - pendente"
6. Verificar o atributo "aria-label" dos botões do popover
   → Cada item é um botão com aria-label "roteiro/conteúdo/imagens, pendente. Clique para gerar com o copiloto."

## TC31 — Validar popover de pendências para atividade Lesson (Aula)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que Lesson exibe 5 etapas no popover de pendências.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade do tipo "Lesson" com 5 etapas pendentes.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade "Lesson" com badge "5 pendentes"
   → Botão "5 pendentes - Ver detalhes" é exibido
3. Clicar no botão "5 pendentes"
   → Popover é exibido com 5 itens
4. Verificar os itens listados no popover ("roteiro", "slides", "imagens", "áudios", "renderização")
   → Lista exibe 5 itens correspondentes: "roteiro", "slides", "imagens", "áudios", "renderização" (todos pendentes)

## TC32 — Validar click em item pendente do popover abre copiloto contextualizado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que clicar em uma etapa pendente abre o copiloto pré-contextualizado.

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade "Page" com etapa "roteiro" pendente.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "3 pendentes" da atividade
   → Popover é exibido
3. Clicar no item "roteiro - pendente"
   → Drawer do copiloto é aberto pré-contextualizado para a etapa "roteiro" da atividade selecionada

## TC33 — Validar checkbox de seleção da atividade no card-rich
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que cada card exibe checkbox "Selecionar atividade: &lt;nome&gt;".

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade "Boas-vindas e como usar este curso" na lista
   → Card exibe checkbox com aria-label "Selecionar atividade: Boas-vindas e como usar este curso"
3. Marcar o checkbox
   → Checkbox passa para estado marcado e atividade fica selecionada

## TC34 — Validar status visual "Liberada" no card-rich
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir exibição do status visual da atividade.

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade "Page" liberada para alunos.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade "Page" liberada
   → Card exibe "Página • Liberada" com ícone de check ao lado de "Liberada"

---
suite: Renomear tipo e ícone por atividade
executor: playwright
playbooks:
- flipper
- toast-chakra
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Renomear tipo e ícone por atividade

## TC1 — Validar campo display_label no cadastro/edição de atividade
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o campo está disponível para edição.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Editar" da atividade "Lesson"
   → Formulário de cadastro/edição é aberto
3. Verificar a presença do campo "display_label" (Nome customizado do tipo)
   → Campo é exibido no formulário

## TC2 — Validar campo display_icon com seletor Google Icons
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o campo de ícone permite seleção dos ícones disponíveis.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Editar" da atividade "Lesson"
   → Formulário de cadastro/edição é aberto
3. Localizar e clicar no campo "display_icon"
   → Seletor de ícones do conjunto Google Icons é exibido
4. Selecionar um ícone diferente do default
   → Ícone é selecionado e exibido no campo

## TC3 — Validar default de display_label igual ao nome do tipo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir backfill semântico inicial.

### Passos
1. Pré-condição: Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar atividade"
   → Seleção de tipos é exibida
3. Selecionar tipo "Vídeo Upload"
   → Formulário é aberto
4. Verificar o valor default do campo "display_label"
   → Campo exibe o valor "Vídeo Upload" como default

## TC4 — Validar default de display_icon igual ao ícone do tipo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir herança visual padrão.

### Passos
1. Pré-condição: Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar atividade"
   → Seleção de tipos é exibida
3. Selecionar tipo "SCORM"
   → Formulário é aberto
4. Verificar o valor default do campo "display_icon"
   → Campo exibe o ícone atual do tipo "SCORM" como default

## TC5 — Validar display_label como obrigatório
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir validação ao salvar.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Editar" da atividade "Lesson"
   → Formulário é aberto
3. Limpar o campo "display_label"
   → Campo fica vazio
4. Clicar no botão "Salvar"
   → Mensagem de erro exibida: "O nome customizado é obrigatório" (ou texto equivalente). Salvamento bloqueado

## TC6 — Validar herança de display_icon do tipo quando não setado
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir fallback do ícone.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Editar" da atividade "Lesson"
   → Formulário é aberto
3. Não selecionar valor para "display_icon" (deixar vazio/default)
   → Campo aceita estar vazio
4. Clicar no botão "Salvar"
   → Atividade salva com display_icon herdado do tipo
5. Verificar o ícone do tipo "Lesson" na lista de atividades
   → Ícone exibido é o do tipo "Lesson"

## TC7 — Validar lista do Estúdio usa display_label
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a UI do instrutor reflete o label customizado.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com display_label = "Aula Introdutória".
   → Estado descrito pré-existe no ambiente.
2. Acessar o Estúdio do curso
   → Lista de atividades é exibida
3. Verificar o card da atividade com display_label "Aula Introdutória"
   → Card exibe "Aula Introdutória" como tipo (no lugar do default "Aula")

## TC8 — Validar Play do aluno usa display_label
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o aluno vê o label customizado.

### Passos
1. Pré-condição: Curso com atividade configurada com display_label customizado e publicada; Usuário aluno inscrito no curso.
   → Estado descrito pré-existe no ambiente.
2. Logar como aluno e acessar o curso
   → Listagem de atividades é exibida
3. Verificar o card da atividade no "Play" do aluno
   → Card exibe o display_label customizado configurado pelo instrutor
4. Acessar o breadcrumb e progresso
   → Tipo da atividade reflete o display_label customizado

## TC9 — Validar exceção do SCORM (instrutor vê "Conteúdo SCORM", aluno vê "Conteúdo")
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir a regra especial do SCORM.

### Passos
1. Pré-condição: Curso com atividade SCORM publicada; Usuário aluno inscrito.
   → Estado descrito pré-existe no ambiente.
2. Logar como instrutor e acessar o Estúdio do curso
   → Lista exibe atividade SCORM com tipo "Conteúdo SCORM"
3. Logar como aluno no mesmo curso
   → Play do aluno exibe a atividade com tipo "Conteúdo" (não "Conteúdo SCORM")

## TC10 — Validar persistência de display_label/display_icon após reload
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que os campos persistem em banco.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Editar atividade "Lesson" e preencher "display_label" com "Aula Customizada"
   → Campo aceita o valor
3. Selecionar um ícone customizado em "display_icon"
   → Ícone selecionado
4. Clicar no botão "Salvar"
   → Toast exibida: "Alterações salvas com sucesso."
5. Recarregar a página
   → Campos "display_label" e "display_icon" mantêm os valores configurados

## TC11 — [Validação Manual] Backfill de display_label em registros existentes
**Prioridade**: low
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir que registros antigos têm valor preenchido.

### Passos
1. Pré-condição: Acesso ao banco MySQL do ambiente Stage; Registros antigos de EventContent existentes antes da feature.
   → Estado descrito pré-existe no ambiente.
2. Consultar SELECT * FROM event_contents WHERE display_label IS NULL
   → Retorna 0 registros após o backfill OU sistema usa fallback "display_label || tipo.name"

## TC12 — Validar texto livre com acentos e caracteres especiais
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir suporte a i18n no display_label.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Editar" da atividade "Lesson"
   → Formulário é aberto
3. Preencher o campo "display_label" com "Sessão de Avaliação - Módulo 1"
   → Campo aceita acentos e caracteres especiais
4. Clicar no botão "Salvar"
   → Atividade salva com sucesso
5. Verificar o card "Sessão de Avaliação - Módulo 1" na lista
   → Card exibe "Sessão de Avaliação - Módulo 1" corretamente

---
suite: Pré-visualizar atividade selecionada
executor: playwright
playbooks:
- flipper
- filtro-drawer
- beforeunload
- cleanup-dados
preconditions:
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
- Curso de teste previamente cadastrado
- Acessar a URL "/o/{org}/events/:id/edit/studio"
---

# Pré-visualizar atividade selecionada

## TC1 — Validar renderização do preview ao selecionar atividade
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a coluna central exibe preview da atividade selecionada.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Acessar o Estúdio
   → Lista de atividades é exibida
3. Clicar na atividade "Lesson" na lista
   → Coluna central renderiza o preview da atividade selecionada

## TC2 — Validar preview de Lesson (player de vídeo navegável)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que Lesson abre player navegável.

### Passos
1. Pré-condição: Usuário logado como Instrutor com permissão de edição de curso; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com cenas geradas.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Lesson" na lista
   → Coluna central exibe player de vídeo
3. Navegar entre cenas no player
   → Player permite navegação entre cenas da aula

## TC3 — Validar preview de Page (render do template)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que Page renderiza igual ao aprender.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade "Page" com conteúdo cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Page" na lista
   → Coluna central renderiza o template com o conteúdo da página igual ao Play do aluno

## TC4 — Validar preview de Questionário com aviso de modo aleatório
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o aviso é exibido quando configurado.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Questionário" com "Exibir perguntas em ordem aleatória" habilitado.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Questionário" configurada como aleatória
   → Coluna central exibe preview do questionário
3. Verificar o aviso "perguntas em modo aleatório"
   → Texto exibido: "perguntas em modo aleatório"

## TC5 — Validar preview de Vídeo
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir renderização de Vídeo.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Vídeo Upload" com arquivo enviado.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Vídeo" na lista
   → Coluna central exibe player de vídeo igual ao componente do aprender

## TC6 — Validar preview de PDF
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir renderização de PDF.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "PDF" com arquivo enviado.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "PDF" na lista
   → Coluna central exibe visualizador de PDF

## TC7 — Validar preview de SCORM
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir renderização de SCORM.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "SCORM" com pacote enviado.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "SCORM" na lista
   → Coluna central carrega o componente SCORM (somente visual)

## TC8 — Validar preview de Game
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir renderização de Game.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Game" configurada.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Game" na lista
   → Coluna central carrega o componente do Game

## TC9 — Validar preview de Embed
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir renderização de Embed.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Embed" com URL configurada.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Embed" na lista
   → Coluna central exibe o iframe configurado

## TC10 — Preview NÃO simula timer mínimo de permanência
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o preview é simplificado.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade com timer mínimo configurado.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade com timer mínimo configurado
   → Preview NÃO inicia contagem regressiva de timer mínimo

## TC11 — Preview NÃO dispara modais de aprovação
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o preview é simplificado.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade configurada com modal de aprovação.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade com modal de aprovação configurado
   → Preview NÃO dispara o modal de aprovação

## TC12 — Preview NÃO marca progresso do aluno
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o preview é simplificado.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Lesson" e visualizar parcialmente o conteúdo
   → Preview é exibido
3. Sair do preview e verificar progresso de alunos inscritos
   → Progresso de alunos NÃO foi alterado pelo preview do instrutor

## TC13 — Validar botão "Visualizar como aluno"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o botão abre nova tela cheia simulando UX do aluno.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Lesson" para selecionar
   → Preview é exibido
3. Clicar no botão "Visualizar como aluno"
   → Nova tela cheia é aberta simulando UX completa do aluno (timer, modais, progresso, etc.)

## TC14 — Validar preview reage em tempo real (Canva Mode)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que edições do copiloto refletem instantaneamente.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Lesson" para selecionar
   → Preview é exibido
3. Abrir o copiloto e solicitar "regerar slides desta aula"
   → Canva Mode é ativado (chat à esquerda, preview central reage)
4. Aguardar a geração
   → Preview central atualiza em tempo real à medida que a IA gera os novos slides

## TC15 — Validar botão "Editar" abre Plate.js (Page) ou Fabric (Lesson)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir abertura do editor correto por tipo.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividades "Lesson" e "Page" previamente cadastradas.
   → Estado descrito pré-existe no ambiente.
2. Clicar na atividade "Page" e clicar no botão "Editar"
   → Modal/drawer com editor Plate.js é aberto
3. Fechar o editor
   → Editor fecha e retorna ao preview
4. Clicar na atividade "Lesson" e clicar no botão "Editar"
   → Modal/drawer com editor Fabric.js é aberto

## TC16 — Validar edição manual conclui a etapa Roteiro automaticamente
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir trigger automático de conclusão de roteiro.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade "Page" com etapa "Roteiro" pendente.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Editar" da atividade "Page"
   → Editor Plate.js é aberto
3. Digitar conteúdo manualmente no editor
   → Editor aceita o conteúdo
4. Salvar e fechar o editor
   → Conteúdo é salvo
5. Verificar a badge "Roteiro" da atividade na lista
   → Etapa "Roteiro" é marcada como concluída (badge verde) automaticamente após a edição manual

## TC17 — Validar header do preview central com tipo e pontos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o painel central exibe metadados da atividade selecionada.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade "Boas-vindas e como usar este curso" selecionada na lista.
   → Estado descrito pré-existe no ambiente.
2. Selecionar a atividade "Boas-vindas e como usar este curso"
   → Painel central de preview é atualizado
3. Verificar o heading "Boas-vindas e como usar este curso" no header do preview
   → Heading nível 2 exibido: "Boas-vindas e como usar este curso"
4. Verificar as badges "Página" e "5 Pontos" ao lado do título
   → Badge "Página" e badge "5 Pontos" são exibidas com ícones correspondentes

## TC18 — Validar barra de ações da atividade no preview
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o preview exibe os 4 botões de ação da atividade selecionada.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Page" (página) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Selecionar uma atividade na lista esquerda
   → Preview central é exibido
3. Verificar os botões "Concluir geração com IA", "Editar", "Bloquear atividade" e "Excluir atividade" na barra de ações superior do preview
   → Botões exibidos na ordem: "Concluir geração com IA" (ícone estrela), "Editar" (lápis), "Bloquear atividade" (cadeado, toggle), "Excluir atividade" (lixeira)
4. Verificar o aria-label "Concluir geração com inteligência artificial" do botão de IA
   → Botão exibe aria-label "Concluir geração com inteligência artificial"

## TC19 — Validar toggle "Bloquear atividade" no preview
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que bloquear é um toggle (pressed/unpressed).

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Page" (página) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Selecionar atividade não bloqueada
   → Botão "Bloquear atividade" exibido em estado não pressionado
3. Clicar no botão "Bloquear atividade"
   → Botão muda para estado "pressed" (atividade bloqueada visualmente)
4. Clicar novamente no botão
   → Botão volta ao estado não pressionado (atividade desbloqueada)

## TC20 — Validar estado vazio do preview central
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que atividade sem conteúdo exibe placeholder padrão.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade "Page" recém-criada e sem conteúdo cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Selecionar a atividade "Page" sem conteúdo
   → Preview central exibe estado vazio
3. Verificar os textos "Não há conteúdo" e "Adicione manualmente ou gere com IA." do estado vazio
   → Parágrafos exibidos: "Não há conteúdo" e "Adicione manualmente ou gere com IA."
4. Verificar botão "Pendência de conteúdo" acima dos textos
   → Botão com aria-label "Pendência de conteúdo" (ícone de alerta) é exibido

## TC21 — Validar toolbar inferior "Ações do estúdio" (Visualizar como aluno + Salvar como)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir presença e textos exatos da toolbar inferior fixa do Estúdio.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso.
   → Estado descrito pré-existe no ambiente.
2. Acessar a aba "Atividades" do Estúdio
   → Toolbar fixa inferior "Ações do estúdio" é exibida
3. Verificar os botões "Visualizar como aluno" e "Salvar como" da toolbar
   → Botões exibidos: "Visualizar como aluno" (ícone olho) e "Salvar como" (com chevron de dropdown)

## TC22 — Validar dropdown "Salvar como" com 3 opções
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o menu dropdown "Salvar como" exibe as opções corretas.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Salvar como" na toolbar inferior
   → Menu dropdown "Salvar como" é aberto
3. Verificar os itens "Rascunho", "Novo" e "Publicar alterações" do menu
   → Menu exibe 3 itens em ordem: "Rascunho", "Novo" (separador), "Publicar alterações"
4. Pressionar Esc para fechar o menu
   → Menu é fechado e nenhuma ação é executada

## TC23 — Validar item "Publicar alterações" do dropdown "Salvar como"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento da publicação a partir do dropdown.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Curso com edições não publicadas.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Salvar como"
   → Dropdown é aberto
3. Clicar no item "Publicar alterações"
   → Job de renderização é disparado (RN 46) e UI reflete início do processo

## TC24 — Validar item "Novo" do dropdown ("Salvar como novo" - P3)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que "Novo" aciona o fluxo de duplicação de curso.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Salvar como"
   → Dropdown é aberto
3. Clicar no item "Novo"
   → Fluxo de duplicação ("Salvar como novo") é iniciado (RN 60) — quando feature flag P3 estiver habilitada

## TC25 — Validar item "Rascunho" do dropdown
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que "Rascunho" salva como rascunho paralelo.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Curso com edições não persistidas.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Salvar como"
   → Dropdown é aberto
3. Clicar no item "Rascunho"
   → Edições são salvas como rascunho (RN 27) — quando feature P3 #R8 estiver habilitada; sem #R8, comportamento atual é preservado

## TC26 — Validar botão "Visualizar como aluno" abre tela cheia
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que "Visualizar como aluno" simula a UX completa.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Visualizar como aluno" na toolbar inferior
   → Nova tela cheia é aberta simulando a UX do aluno
3. Verificar a tela "Visualizar como aluno"
   → Tela exibe a atividade com timers, modais de aprovação e progresso ativos (diferente do preview central, que é simplificado)

## TC27 — Validar abas (navegação "Áreas do estúdio") incluindo "Atividades"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir presença das abas de gerenciamento do curso na ordem padrão.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso.
   → Estado descrito pré-existe no ambiente.
2. Acessar o Estúdio de Criação
   → Navegação "Áreas do estúdio" é exibida
3. Verificar as abas exibidas ("Identificação", "Modelo", "Acesso", "Banner", "Aprovação", "Cobrança", "Localização", "Dashboard", "Compartilhar", "Atividades")
   → Abas exibidas: "Identificação", "Modelo", "Acesso", "Banner", "Aprovação", "Cobrança", "Localização", "Dashboard", "Compartilhar", "Atividades"
4. Clicar na aba "Atividades"
   → Aba "Atividades" fica em estado ativo e conteúdo é exibido

## TC28 — Validar breadcrumb do Estúdio
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir hierarquia do breadcrumb na navegação do Estúdio.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso.
   → Estado descrito pré-existe no ambiente.
2. Acessar o Estúdio de um curso
   → Breadcrumb é exibido no topo
3. Verificar os itens do breadcrumb ("Conteúdos" &gt; nome do curso &gt; "Estúdio de criação")
   → Itens exibidos em sequência: "Conteúdos" &gt; "&lt;Nome do curso&gt;" &gt; "Estúdio de criação"
4. Clicar no item "Conteúdos" do breadcrumb
   → Navega de volta para a listagem de Conteúdos

---
suite: Versionar conteudo via rascunho
executor: playwright
playbooks:
- flipper
- toast-chakra
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Versionar conteudo via rascunho

## TC1 — [Regressão] Validar que rascunho NÃO está implementado (sem is_draft no schema)
**Prioridade**: low
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir que #R8 foi descartado e o schema não tem o campo.

### Passos
1. Pré-condição: Acesso ao banco MySQL do ambiente Stage.
   → Estado descrito pré-existe no ambiente.
2. Consultar "DESCRIBE event_contents" no MySQL
   → Tabela "event_contents" NÃO contém coluna "is_draft" nem "parent_event_content_id"
3. Consultar "SHOW COLUMNS FROM event_contents"
   → Nenhuma coluna relacionada a versionamento de rascunho está presente

## TC2 — [Regressão] Edição em produção é imediata (comportamento atual preservado)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que edição direta no event_content é refletida imediatamente para o aluno.

### Passos
1. Pré-condição: Curso publicado com atividade visível para alunos; Usuário aluno inscrito.
   → Estado descrito pré-existe no ambiente.
2. Logar como administrador e editar o conteúdo de uma atividade do tipo "Page"
   → Editor é aberto
3. Alterar o texto da página e salvar
   → Toast exibida: "Alterações salvas com sucesso."
4. Logar como aluno e abrir a mesma atividade no Play
   → Aluno vê o conteúdo já alterado (edição é imediata, sem rascunho intermediário)

---
suite: Operar copiloto e histórico por usuário no curso
executor: playwright
playbooks:
- flipper
- super-admin
- filtro-drawer
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Operar copiloto e histórico por usuário no curso

## TC1 — Abrir copiloto via ícone flutuante com pulse animation
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir abertura via ícone visual.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Aguardar a tela do Estúdio carregar
   → Ícone flutuante (estrela) com pulse animation é exibido no canto inferior direito
3. Clicar no ícone flutuante do copiloto
   → Drawer do copiloto é aberto à direita

## TC2 — Abrir copiloto via atalho Ctrl+J
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir atalho de teclado.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto fechado.
   → Estado descrito pré-existe no ambiente.
2. Pressionar a combinação de teclas Ctrl+J
   → Drawer do copiloto é aberto à direita

## TC3 — Fechar copiloto via botão X
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir fechamento via UI.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "X" do drawer do copiloto
   → Drawer é fechado

## TC4 — Fechar copiloto via Ctrl+J novamente (toggle)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir toggle do atalho.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Pressionar a combinação de teclas Ctrl+J novamente
   → Drawer é fechado (toggle)

## TC5 — Validar largura padrão do drawer (~30%)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir tamanho default.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Abrir o drawer do copiloto via ícone flutuante
   → Drawer é aberto ocupando ~30% da largura da tela

## TC6 — Expandir drawer até ~50% da largura
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir expansão do drawer.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão de expandir do drawer
   → Drawer expande até ~50% da largura da tela
3. Clicar novamente para recolher
   → Drawer retorna a ~30% da largura

## TC7 — Drawer vira tela cheia em mobile
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir adaptação em mobile.

### Passos
1. Pré-condição: Curso de teste cadastrado; Viewport Mobile (360x740).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events/:id/edit/studio"
   → Estúdio carrega em layout mobile
3. Abrir o copiloto
   → Drawer do copiloto ocupa tela cheia em mobile

## TC8 — Validar contexto da página injetado automaticamente
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o copiloto recebe contexto do curso/aba/seleção/preview.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Selecionar a atividade "Lesson" na lista
   → Atividade selecionada, preview exibido
3. Abrir o copiloto
   → Drawer é aberto
4. Enviar mensagem "Qual é o contexto atual?"
   → Copiloto responde indicando: id e nome do curso, aba ativa ("Atividades"), atividade selecionada (id, nome) e que o preview está aberto

## TC9 — Validar separação de conversas por contexto de aba
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que conversa muda conforme aba.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Abrir o copiloto na aba "Atividades" (Estúdio) e enviar mensagem "Olá Estúdio"
   → Mensagem registrada na conversa de "Atividades"
3. Clicar na aba "Identificação"
   → Aba é trocada
4. Abrir o copiloto na aba "Identificação"
   → Drawer exibe uma conversa diferente (vazia ou anterior da aba Identificação)

## TC10 — Validar troca automática de conversa ao trocar aba
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que conversa visível segue a aba.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Abrir o copiloto e enviar mensagem "Mensagem em Atividades" na aba "Atividades"
   → Mensagem é registrada
3. Clicar na aba "Banner"
   → Conversa visível troca para a conversa de Banner (não a de Atividades)
4. Retornar à aba "Atividades"
   → Conversa volta a exibir "Mensagem em Atividades"

## TC11 — Histórico por usuário x curso (privacidade entre instrutores)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que cada instrutor tem histórico privado.

### Passos
1. Pré-condição: Dois instrutores cadastrados na organização; Curso compartilhado.
   → Estado descrito pré-existe no ambiente.
2. Logar como Instrutor A, abrir o copiloto e enviar mensagem "Mensagem do A"
   → Mensagem é registrada
3. Logar como Instrutor B no mesmo curso, abrir o copiloto
   → Conversa do Instrutor B NÃO exibe "Mensagem do A" (histórico é privado)
4. Logar novamente como Instrutor A
   → Histórico do Instrutor A é restaurado com a mensagem original

## TC12 — Criar nova conversa estilo ChatGPT
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir múltiplas conversas no copiloto.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto com conversa atual em andamento.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Nova conversa" no copiloto
   → Nova conversa é criada e exibida (vazia)
3. Verificar o list lateral "Conversas" no drawer
   → Conversa antiga aparece no list lateral; nova conversa aparece como ativa

## TC13 — Validar conversa antiga acessível no list lateral
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir acesso ao histórico de conversas.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Usuário com mais de uma conversa criada no curso.
   → Estado descrito pré-existe no ambiente.
2. Abrir o drawer do copiloto
   → List lateral de conversas é exibido
3. Clicar em uma conversa antiga do list
   → Conversa antiga é carregada e exibida no chat

## TC14 — Validar título automático da conversa
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir geração de título pelas primeiras interações.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Iniciar nova conversa enviando uma primeira mensagem "Quero gerar uma aula sobre boas práticas de gestão"
   → Mensagem é registrada
3. Aguardar 2 ou 3 interações com o copiloto
   → Título da conversa é gerado automaticamente (LLM gera título curto baseado no início)
4. Verificar o título da conversa no list lateral "Conversas"
   → Conversa exibe título curto descritivo (ex.: "Aula sobre gestão")

## TC15 — Validar resumo automático de contexto em conversa grande
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento de sumarização em conversa extensa.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Conversa com muitas mensagens (acima do threshold de sumarização).
   → Estado descrito pré-existe no ambiente.
2. Enviar mensagens consecutivas até ultrapassar o threshold de sumarização
   → Conversa cresce além do limite
3. Verificar a mensagem "vou resumir esta conversa" do copiloto
   → Copiloto exibe mensagem semelhante a: "vou resumir esta conversa" e gera um sumário no histórico

## TC16 — [Worker] Retenção de 90 dias - sumarização e descarte de mensagens
**Prioridade**: low
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir worker de retenção.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Conversa com "last_message_at" > 90 dias.
   → Estado descrito pré-existe no ambiente.
2. Disparar manualmente o Sidekiq cron de retenção (ou aguardar a execução agendada)
   → Worker processa conversas com inatividade &gt; 90 dias
3. Consultar DynamoDB "messages" para a conversa antiga
   → Mensagens individuais foram descartadas; resta apenas mensagem-resumo única

## TC17 — Duplicar curso NÃO copia histórico de chat
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que histórico fica zerado no curso copiado.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Curso com conversas de copiloto existentes; Funcionalidade "Salvar como novo" habilitada (#R16 - P3).
   → Estado descrito pré-existe no ambiente.
2. No Estúdio do curso original, clicar no botão "Salvar como novo"
   → Job assíncrono de duplicação é disparado
3. Aguardar a conclusão e ser redirecionado ao novo curso
   → Novo curso é aberto no Estúdio
4. Abrir o copiloto no novo curso
   → Histórico de chat está zerado (não foi copiado do curso original)

## TC18 — Validar Canva Mode (chat à esquerda, preview reage)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento do modo Canva.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Selecionar a atividade "Lesson" na lista
   → Preview é exibido
3. Abrir o copiloto e solicitar "gere os slides desta aula"
   → Canva Mode é ativado
4. Verificar o layout do "Estúdio" durante a geração
   → Chat fica à esquerda (drawer expandido); preview central reage em tempo real à medida que a IA gera os slides

## TC19 — Validar escurecimento da UI no Canva Mode
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir foco visual na geração.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Disparar geração via copiloto que ativa o Canva Mode
   → Canva Mode é ativado
3. Verificar o restante da UI fora do "Copiloto"
   → Tela escurece ligeiramente o restante da UI para focar atenção no conteúdo sendo gerado

## TC20 — Validar transação fechada (monotarefa) por chamada de IA
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que cada geração é uma transação fechada.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Solicitar geração de slides para a atividade "Lesson"
   → Geração inicia
3. Aguardar o término da geração
   → Chat exibe mensagem "Concluído" ao fim da transação
4. Iniciar nova interação para a próxima ação
   → Nova interação é tratada como nova transação fechada

## TC21 — Validar streaming SSE via ActionCable (StudioGenerationChannel)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir uso do channel de streaming.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Ferramenta de monitoramento WebSocket habilitada.
   → Estado descrito pré-existe no ambiente.
2. Solicitar geração que dispara streaming
   → Geração inicia
3. Monitorar conexões WebSocket no DevTools
   → Conexão ao "StudioGenerationChannel" é aberta e eventos como "partition_started", "partition_completed", "agent_response_chunk" são recebidos

## TC22 — Validar abertura do copiloto via botão flutuante
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir presença e funcionamento do botão flutuante de abertura do copiloto.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Acessar a aba "Atividades" do Estúdio
   → Botão flutuante com aria-label "Abrir copiloto" é exibido (canto inferior direito, ícone estrela com pulse)
3. Clicar no botão "Abrir copiloto"
   → Drawer do copiloto é aberto à direita

## TC23 — Validar header do drawer do copiloto (título e subtítulo exatos)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir textos do cabeçalho do copiloto.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Verificar o heading "Copiloto" no título do drawer
   → Heading nível 3 exibido: "Copiloto"
3. Verificar o subtítulo "Cria atividades com aprovação"
   → Parágrafo exibido logo abaixo do título: "Cria atividades com aprovação"
4. Verificar os botões "Conversas" e "Expandir painel" no header (esquerda)
   → Botões exibidos: "Conversas" e "Expandir painel"
5. Verificar os botões "Configurar API key" e "Minimizar copiloto" no header (direita)
   → Botões exibidos: "Configurar API key" e "Minimizar copiloto"

## TC24 — Validar mensagem inicial de boas-vindas do copiloto
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir texto exato da mensagem inicial.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Copiloto aberto em conversa nova.
   → Estado descrito pré-existe no ambiente.
2. Abrir o copiloto pela primeira vez no curso
   → Mensagem de boas-vindas é exibida
3. Verificar o conteúdo da mensagem de boas-vindas ("Olá! Sou seu copiloto de criação. ...")
   → Texto exibido contém: "Olá! Sou seu copiloto de criação. Cada ação é uma transação: por exemplo, para adicionar atividades (aula e página), vou sugerir um plano, você ajusta e confirma uma vez." (negritos em "copiloto de criação" e "adicionar atividades")
4. Verificar a pergunta de fechamento "Por onde quer começar?"
   → Parágrafo exibido: "Por onde quer começar?"

## TC25 — Validar card de contexto do curso no copiloto
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir exibição da contagem dinâmica de atividades no copiloto.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Curso com 16 atividades cadastradas; Copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Abrir o copiloto
   → Card de contexto é exibido logo após a mensagem de boas-vindas
3. Verificar o texto do card "Curso com 16 atividades criadas."
   → Texto exibido: "Curso com 16 atividades criadas." (com "16" em negrito; valor dinâmico conforme curso)

## TC26 — Validar ações rápidas do copiloto
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir presença e textos dos botões de ações rápidas.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Localizar seção "Ações rápidas" no copiloto
   → Parágrafo "Ações rápidas" é exibido
3. Verificar os botões "Concluir conteúdo desta atividade", "Mais páginas" e "Adicionar avaliação"
   → Botões exibidos: "Concluir conteúdo desta atividade", "Mais páginas", "Adicionar avaliação"
4. Clicar em "Concluir conteúdo desta atividade"
   → Copiloto inicia uma transação de geração para a atividade selecionada

## TC27 — Validar campo de input e botão "Enviar" do copiloto
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir presença e placeholder do input principal.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Localizar campo de input do copiloto
   → Textbox exibida com placeholder "Ex: criar aulas sobre estratégias..."
3. Verificar botão "Enviar"
   → Botão "Enviar" (ícone de envio) é exibido ao lado do textbox e fica desabilitado quando o input está vazio
4. Verificar o hint "Enter para enviar · Shift+Enter para nova linha" abaixo do input
   → Parágrafo exibido: "Enter para enviar · Shift+Enter para nova linha"
5. Preencher o input com "Adicionar 5 páginas sobre SWOT"
   → Botão "Enviar" fica habilitado
6. Pressionar Enter
   → Mensagem é enviada ao copiloto
7. Pressionar Shift+Enter no input
   → Nova linha é adicionada ao input (mensagem não enviada)

## TC28 — Validar painel "Conversas" (histórico)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir abertura do painel lateral de conversas a partir do copiloto.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Copiloto aberto com pelo menos 2 conversas no histórico.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Conversas" no header do copiloto
   → Botão fica em estado "active" e painel de conversas é exibido
3. Verificar botão "Nova conversa"
   → Botão "Nova conversa" (ícone +) é exibido no painel
4. Clicar em "Nova conversa"
   → Nova conversa é criada e exibida; conversa antiga é preservada no histórico

## TC29 — Validar botão "Expandir painel" do copiloto
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir expansão do drawer até ~50% da largura.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Copiloto aberto em largura padrão (~30%).
   → Estado descrito pré-existe no ambiente.
2. Verificar a largura inicial do drawer do "Copiloto"
   → Drawer ocupa ~30% da largura da tela
3. Clicar no botão "Expandir painel"
   → Drawer expande até ~50% da largura da tela
4. Clicar novamente para colapsar
   → Drawer retorna à largura padrão (~30%)

## TC30 — Validar minimização do copiloto
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que minimizar fecha o drawer e libera espaço.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Minimizar copiloto" (X)
   → Drawer é fechado e botão flutuante "Abrir copiloto" volta a ser exibido
3. Verificar que a toolbar "Visualizar como aluno" / "Salvar como" fica acessível
   → Toolbar "Visualizar como aluno" / "Salvar como" fica visível sem sobreposição do drawer

## TC31 — Validar botão "Configurar API key" do copiloto
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir acesso à configuração de credenciais do copiloto.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Configurar API key" no header do copiloto
   → Modal/drawer de configuração de API key é aberto

## TC32 — Validar atalho Ctrl+J para abrir/fechar copiloto
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir atalho de teclado documentado em RN 30.2.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Pressionar Ctrl+J com o copiloto fechado
   → Drawer do copiloto é aberto
3. Pressionar Ctrl+J novamente com o copiloto aberto
   → Drawer é fechado/colapsado

---
suite: Gerar conteudo de aula e pagina via IA em sequencia fixa
executor: playwright
playbooks:
- flipper
- toast-chakra
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
- Curso de teste previamente cadastrado
- Acessar a URL "/o/{org}/events/:id/edit/studio"
---

# Gerar conteudo de aula e pagina via IA em sequencia fixa

## TC1 — Validar sequência fixa de Lesson (Roteiro→Slides→Imagens→Áudios→Renderização)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir DAG completo de geração para Lesson.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" sem etapas geradas.
   → Estado descrito pré-existe no ambiente.
2. Abrir o copiloto e solicitar "gerar conteúdo completo desta aula"
   → Sistema inicia a sequência fixa de geração
3. Validar a 1ª etapa gerada ("Roteiro")
   → Etapa "Roteiro" é gerada primeiro
4. Aprovar Roteiro e validar 2ª etapa
   → Etapa "Slides" é gerada após Roteiro
5. Aprovar Slides e validar 3ª etapa
   → Etapa "Imagens" é gerada após Slides
6. Aprovar Imagens e validar 4ª etapa
   → Etapa "Áudios" é gerada após Imagens
7. Aprovar Áudios e validar 5ª etapa
   → Etapa "Renderização" é disparada apenas via "Publicar alterações"

## TC2 — Validar sequência fixa de Page (Roteiro→Conteúdo→Imagens)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir DAG completo de geração para Page.

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade "Page" sem etapas geradas.
   → Estado descrito pré-existe no ambiente.
2. Abrir o copiloto e solicitar "gerar conteúdo completo desta página"
   → Sistema inicia a sequência fixa para Page
3. Validar as etapas geradas na ordem "Roteiro", "Conteúdo", "Imagens"
   → Etapas geradas na ordem: 1) Roteiro, 2) Conteúdo, 3) Imagens

## TC3 — Tentar gerar etapa fora de ordem - IA oferece gerar anterior
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir bloqueio educado em pulo de etapa.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" sem Roteiro gerado.
   → Estado descrito pré-existe no ambiente.
2. Solicitar ao copiloto "gerar imagens da aula"
   → Copiloto responde com mensagem similar a "Preciso do roteiro primeiro, vou gerar?" e oferece confirmação para gerar a etapa anterior
3. Confirmar a geração do roteiro
   → Roteiro é gerado primeiro

## TC4 — Validar etapa Imagens como opcional em Lesson
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir badge cinza-claro de opcional.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade "Lesson" na lista
   → Card é exibido
3. Verificar a badge "I" (Imagens)
   → Badge é exibida em cor cinza-claro (opcional), não cinza/laranja (pendente)
4. Aprovar a aula sem gerar imagens
   → Aula pode ser declarada como pronta sem gerar imagens

## TC5 — Validar etapa Imagens como opcional em Page
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir badge cinza-claro de opcional para Page.

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade "Page" na lista
   → Card é exibido
3. Verificar a badge "Imagens"
   → Badge é exibida como cinza-claro indicando opcional
4. Aprovar a página sem gerar imagens
   → Página pode ser declarada como pronta sem imagens

## TC6 — Validar que o roteiro persiste em "narrator_script"
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir reuso do campo existente.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Acesso ao banco MySQL do ambiente Stage.
   → Estado descrito pré-existe no ambiente.
2. Solicitar e aprovar a geração de roteiro para a atividade "Lesson"
   → Roteiro é gerado e aprovado
3. Consultar SELECT narrator_script FROM event_contents WHERE id = X
   → Coluna "narrator_script" contém o roteiro gerado (texto, não JSON separado)

## TC7 — Edição manual no Plate.js conclui Roteiro automaticamente
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir trigger automático no editor de Page.

### Passos
1. Pré-condição: Atividade do tipo "Page" (página) previamente cadastrada no curso; Atividade "Page" com etapa "Roteiro" pendente.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Editar" da atividade "Page"
   → Editor Plate.js é aberto
3. Editar manualmente o conteúdo da página
   → Editor aceita o conteúdo
4. Salvar e fechar o editor
   → Conteúdo é salvo
5. Verificar a badge "Roteiro" na lista
   → Badge "Roteiro" é marcada como concluída (verde) automaticamente

## TC8 — Edição manual no Fabric.js conclui Roteiro automaticamente
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir trigger automático no editor de Lesson.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com etapa "Roteiro" pendente.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Editar" da atividade "Lesson"
   → Editor Fabric.js é aberto
3. Editar manualmente o conteúdo da aula
   → Editor aceita o conteúdo
4. Salvar e fechar o editor
   → Conteúdo é salvo
5. Verificar a badge "R" (Roteiro) na lista
   → Badge "R" é marcada como concluída (verde) automaticamente

## TC9 — Validar botão "Aprovar" segue para próxima etapa
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir fluxo de aprovação default.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade com etapa "Roteiro" aguardando aprovação.
   → Estado descrito pré-existe no ambiente.
2. Localizar a partition "Roteiro" no chat do copiloto
   → Etapa exibe ações: "Aprovar", "Regerar", "Rejeitar e descartar"
3. Clicar no botão "Aprovar"
   → Roteiro é aprovado (POST /studio/partitions/:id/approve), conteúdo é copiado para event_contents e sistema avança para a próxima etapa ("Slides")

## TC10 — Validar botão "Regerar" dispara nova geração
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir capacidade de regerar etapa.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade com etapa "Roteiro" gerada.
   → Estado descrito pré-existe no ambiente.
2. Localizar a partition "Roteiro"
   → Etapa exibe ações disponíveis
3. Clicar no botão "Regerar" e informar prompt customizado "regere com tom mais informal"
   → Sistema dispara nova geração (POST /studio/partitions/:id/regenerate); partition antiga é marcada como "superseded"; nova partition entra em "queued"
4. Aguardar a conclusão da nova geração
   → Novo roteiro é exibido aguardando nova aprovação

## TC11 — Validar botão "Rejeitar e descartar" cancela a etapa
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir cancelamento de etapa.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade com etapa "Roteiro" gerada.
   → Estado descrito pré-existe no ambiente.
2. Localizar a partition "Roteiro"
   → Etapa exibe ações disponíveis
3. Clicar no botão "Rejeitar e descartar"
   → Etapa é cancelada; instrutor pode tentar abordagem diferente
4. Verificar o status da etapa "Roteiro" da atividade na lista
   → Etapa "Roteiro" volta a aparecer como pendente

## TC12 — Modo "Assistente por etapas" (default smart user)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir aprovação passo a passo.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Iniciar nova geração e selecionar o modo "Assistente por etapas"
   → Modo é ativado
3. Aguardar a geração da 1ª etapa (Roteiro)
   → Sistema gera Roteiro e PAUSA aguardando aprovação
4. Aprovar e aguardar a próxima etapa
   → Sistema gera Slides e PAUSA aguardando aprovação (ciclo se repete)

## TC13 — Modo "Automático pela IA" (light user)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir geração sem aprovações intermediárias.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Iniciar nova geração e selecionar o modo "Automático pela IA"
   → Modo é ativado
3. Aguardar a execução completa
   → Sistema gera Roteiro, Slides, Imagens e Áudios sequencialmente sem pedir aprovação intermediária
4. Verificar o resultado final das etapas geradas da atividade ("Roteiro" em diante)
   → Todas as etapas são geradas; instrutor revisa o resultado final e pode regerar individualmente o que não gostou

## TC14 — Validar escolha de modo no primeiro prompt
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir UI de escolha de modo.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Solicitar nova geração via copiloto
   → UI de início da geração exibe radio ou select para escolher o modo
3. Verificar as opções "Assistente por etapas" e "Automático pela IA"
   → Opções disponíveis: "Assistente por etapas" e "Automático pela IA"

## TC15 — Validar botão "Regerar imagem" por slide individual
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir regeneração granular por slide.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com slides e imagens geradas.
   → Estado descrito pré-existe no ambiente.
2. Abrir o preview de slides da atividade
   → Slides com imagens são exibidos
3. Localizar o botão "Regerar imagem" em um slide específico
   → Botão é exibido por slide (não só no chat)
4. Clicar no botão "Regerar imagem" do slide selecionado
   → Apenas a imagem daquele slide é regerada

## TC16 — Regerar imagem com prompt customizado por cena
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir personalização por imagem.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com imagens geradas.
   → Estado descrito pré-existe no ambiente.
2. Localizar o botão "Regerar imagem" em um slide
   → Botão é exibido
3. Clicar e informar prompt customizado "imagem mais escura, estilo cartoon"
   → Imagem é regerada com o prompt customizado
4. Validar o resultado da ação "Regerar imagem"
   → Nova imagem reflete as características solicitadas

## TC17 — Editar texto do roteiro invalida áudio dependente
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir invalidação de áudio após edição de roteiro.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade "Lesson" com Roteiro e Áudio gerados.
   → Estado descrito pré-existe no ambiente.
2. Abrir o editor da etapa "Roteiro" e alterar o texto de uma cena
   → Roteiro é alterado
3. Salvar a alteração
   → Alteração é registrada
4. Verificar o status da etapa "Áudio" (badge "U")
   → Áudio dependente é invalidado automaticamente; instrutor precisa regerar para refletir o novo roteiro

## TC18 — Badge "áudio desatualizado" exibida após edição de roteiro
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir feedback visual de invalidação.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade com roteiro alterado após áudio gerado.
   → Estado descrito pré-existe no ambiente.
2. Localizar a atividade na lista com roteiro alterado
   → Card é exibido
3. Verificar badge da etapa "Áudio"
   → Texto exibido na badge: "áudio desatualizado"

## TC19 — Renderização final só via "Publicar alterações"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir trigger de renderização.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade com todas as etapas exceto Renderização aprovadas.
   → Estado descrito pré-existe no ambiente.
2. Aprovar todas as etapas (Roteiro, Slides, Imagens, Áudios)
   → Etapas aprovadas
3. Verificar a etapa "Renderização" na lista
   → Etapa permanece pendente (não disparada automaticamente)
4. Clicar no botão "Publicar alterações"
   → Renderização é disparada apenas neste momento

## TC20 — Botão "Concluir geração com IA" multi-select
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir geração em lote via multi-select.

### Passos
1. Pré-condição: Curso com 3 atividades "Lesson" sem etapas geradas.
   → Estado descrito pré-existe no ambiente.
2. Marcar checkbox de 3 atividades "Lesson" distintas
   → 3 atividades são selecionadas
3. Clicar no botão "Concluir geração com IA"
   → Sistema dispara a sequência completa de geração para as 3 atividades, sem aprovações intermediárias
4. Verificar a UI durante o processo ("BulkValidationCard" e progresso por atividade)
   → Cada atividade tem progresso visual (via WebSocket); BulkValidationCard é exibido

## TC21 — Validar bloqueio das atividades durante processo assíncrono
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir lock por atividade.

### Passos
1. Pré-condição: Geração em massa em andamento.
   → Estado descrito pré-existe no ambiente.
2. Tentar editar manualmente uma atividade que está em geração assíncrona
   → Edição é bloqueada; mensagem exibida indica que atividade está em processamento
3. Aguardar a conclusão do processo
   → Após conclusão, atividade volta a permitir edição

## TC22 — Streaming de geração via ActionCable
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir feedback ao chat em tempo real.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Solicitar geração de etapa via copiloto
   → Geração inicia
3. Verificar o chat em tempo real (eventos "agent_response_chunk" e "agent_done")
   → Chunks de resposta chegam progressivamente via ActionCable (eventos "agent_response_chunk", "agent_done")

## TC23 — Validar aprovação humana antes de persistir em event_contents
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que conteúdo só é persistido após aprovação.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Solicitar geração da etapa "Roteiro" via copiloto
   → Geração inicia
3. Aguardar status "completed" da partition
   → Partition fica em "completed" com "result_data" preenchido (event_contents NÃO foi tocado ainda)
4. Consultar event_contents antes da aprovação
   → Campo "narrator_script" AINDA não contém o resultado
5. Clicar no botão "Aprovar" (POST /studio/partitions/:id/approve)
   → Rails copia "result_data.field" para "event_contents"; partition fica "approved"
6. Consultar event_contents após aprovação
   → Campo "narrator_script" agora contém o roteiro aprovado

## TC24 — Validar registros em studio_generation_partitions
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir lifecycle correto da partition.

### Passos
1. Pré-condição: Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Disparar geração de roteiro via copiloto
   → Nova partition é criada
3. Consultar "SELECT * FROM studio_generation_partitions WHERE event_content_id = X"
   → Partition existe com status "queued" → "processing" → "completed" → "approved" conforme lifecycle
4. Validar os campos de auditoria "applied_to_event_content_at", "approved_by" e "lock_active"
   → Campos "applied_to_event_content_at", "approved_by", "lock_active" são preenchidos corretamente

---
suite: Adicionar multiplas atividades em massa via copiloto
executor: playwright
playbooks:
- flipper
- filtro-drawer
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
- Curso de teste previamente cadastrado
---

# Adicionar multiplas atividades em massa via copiloto

## TC1 — Comando "adicionar N atividades" com N configurável
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir aceitação de N variável.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Enviar mensagem "adicionar 7 atividades sobre liderança"
   → Copiloto interpreta o comando e dispara a criação de 7 atividades
3. Verificar a lista "Atividades" após a criação em massa
   → 7 novas atividades são criadas na lista

## TC2 — Especificar tema livre em linguagem natural
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir interpretação de tema livre.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Enviar mensagem "adicionar 3 atividades sobre user experience nível iniciante"
   → Copiloto interpreta o tema e o nível
3. Verificar as 3 atividades criadas com o tema "user experience"
   → Atividades criadas refletem o tema "user experience" e o nível "iniciante"

## TC3 — IA respeita contexto do curso (idade, dificuldade, tom de voz)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir uso do contexto da Identificação.

### Passos
1. Pré-condição: Campos "Idade", "Dificuldade" e "Tom de voz" preenchidos na Identificação do curso; Usuário no Estúdio do curso.
   → Estado descrito pré-existe no ambiente.
2. Abrir o copiloto e solicitar "adicionar 2 atividades sobre gestão"
   → Copiloto gera as 2 atividades
3. Verificar o conteúdo gerado contra os campos da "Identificação"
   → Atividades respeitam o contexto do curso (idade, dificuldade e tom de voz) preenchidos na Identificação

## TC4 — Modo "Apenas estrutura" cria N atividades com título e resumo
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir modo apenas estrutura.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Enviar mensagem "adicionar 5 atividades apenas estrutura"
   → Copiloto cria 5 atividades com título e resumo vazios de conteúdo
3. Verificar uma das atividades criadas (título, resumo, conteúdo "Roteiro"/"Slides" vazio)
   → Atividade tem título e resumo gerados pela IA, conteúdo (Roteiro, Slides, etc.) vazio

## TC5 — Modo "Estrutura + conteúdo" dispara geração completa
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir geração completa por atividade.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Enviar mensagem "adicionar 3 atividades com estrutura e conteúdo completo"
   → Copiloto cria 3 atividades e dispara a sequência completa (#R10) para cada uma
3. Verificar o processo de geração via WebSocket (etapas "Roteiro"→"Slides"→"Imagens"→"Áudios" ou "Roteiro"→"Conteúdo"→"Imagens")
   → Para cada atividade, etapas são geradas sequencialmente (Roteiro→Slides→Imagens→Áudios para Lesson, ou Roteiro→Conteúdo→Imagens para Page)

## TC6 — Posicionamento das novas atividades após a selecionada
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir posicionamento contextual.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Curso com 5 atividades; atividade da posição 2 selecionada.
   → Estado descrito pré-existe no ambiente.
2. Marcar checkbox da atividade na posição 2
   → Atividade é selecionada
3. Enviar comando ao copiloto "adicionar 3 atividades sobre planejamento"
   → 3 atividades são criadas imediatamente após a posição 2 (nas posições 3, 4 e 5)
4. Verificar as posições subsequentes na lista "Atividades"
   → Atividades originais nas posições 3, 4, 5 deslocam para 6, 7, 8

## TC7 — Posicionamento no final se nada estiver selecionado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir posicionamento default no final.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Curso com 5 atividades; nenhuma atividade selecionada.
   → Estado descrito pré-existe no ambiente.
2. Garantir que nenhuma atividade está selecionada
   → Lista sem seleção
3. Enviar comando ao copiloto "adicionar 3 atividades"
   → 3 atividades são criadas no final da lista (posições 6, 7, 8)

## TC8 — Aviso de plano sem créditos antes de gerar
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir aviso prévio em planos baixos.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Organização em plano com créditos insuficientes para a geração solicitada.
   → Estado descrito pré-existe no ambiente.
2. Enviar comando ao copiloto "adicionar 10 atividades com conteúdo completo"
   → Copiloto exibe aviso de créditos insuficientes ANTES de gerar
3. Verificar a mensagem exibida sobre "créditos" necessários vs disponíveis
   → Texto exibido informa o número de créditos necessários vs disponíveis

## TC9 — Geração de questionário via chat bloqueada (fora-de-escopo)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir mensagem de fora-de-escopo.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer do copiloto aberto.
   → Estado descrito pré-existe no ambiente.
2. Enviar mensagem "gere um questionário sobre boas práticas"
   → Copiloto responde indicando que questionário via chat está fora do escopo deste release e sugere o fluxo manual ou o assistente de IA legado (4 passos)

## TC10 — HITL gate: count > 3 dispara awaiting_confirmation
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir gate de confirmação para bulk grande.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Threshold STUDIO_BULK_CONFIRM_THRESHOLD = 3.
   → Estado descrito pré-existe no ambiente.
2. Enviar comando "adicionar 10 atividades sobre marketing"
   → Sistema atinge count &gt; 3
3. Verificar o evento "awaiting_confirmation" no stream SSE
   → Evento "awaiting_confirmation" é emitido; stream encerra aguardando confirmação
4. Verificar a exibição do "BulkValidationCard"
   → BulkValidationCard é exibido solicitando confirmação

## TC11 — Endpoint /resume confirma operação após HITL
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir resumo da operação via endpoint dedicado.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Operação em "awaiting_confirmation" (bulk > 3).
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Confirmar" no BulkValidationCard
   → Sistema chama POST /studio/.../resume
3. Verificar o status da operação em massa no "Copiloto"
   → Operação reinicia e segue para a criação das atividades
4. Aguardar a conclusão da operação
   → Atividades são criadas conforme solicitado

## TC12 — Validar que não há limite fixo de 30 atividades
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que limite só é por créditos do plano.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Organização com plano que possui créditos suficientes para 50+ atividades.
   → Estado descrito pré-existe no ambiente.
2. Enviar comando "adicionar 50 atividades sobre análise de dados"
   → Sistema aceita a quantidade (não há limite fixo de 30)
3. Aguardar a conclusão
   → 50 atividades são criadas, limitadas apenas pelos créditos disponíveis

## TC13 — BulkValidationCard exibido pós-geração
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir UX pós-geração com card de validação.

### Passos
1. Pré-condição: Acessar a URL "/o/{org}/events/:id/edit/studio"; Bulk de atividades criadas via copiloto concluído.
   → Estado descrito pré-existe no ambiente.
2. Aguardar a conclusão do bulk
   → Bulk concluído
3. Verificar o "BulkValidationCard" na UI do chat
   → BulkValidationCard é exibido como camada de UX pós-geração, listando as atividades criadas e permitindo ações em massa (aprovar/regerar/descartar)

---
suite: Renderizar versao publicada de forma assincrona
executor: playwright
playbooks:
- flipper
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Renderizar versao publicada de forma assincrona

## TC1 — Clicar "Publicar alterações" dispara job assíncrono
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir disparo do job.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Atividade com etapas Roteiro, Slides, Imagens e Áudios aprovadas.
   → Estado descrito pré-existe no ambiente.
2. Localizar e clicar no botão "Publicar alterações" no topo do Estúdio
   → Job assíncrono é disparado
3. Verificar a atividade na lista após o click em "Publicar alterações"
   → Atividade entra em estado de renderização

## TC2 — Atividade marcada como is_rendering = true durante o job
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir flag de estado.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Job de renderização disparado; Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Após disparar a renderização, consultar SELECT is_rendering FROM event_contents WHERE id = X
   → Coluna "is_rendering" retorna "true" enquanto o job está em execução
3. Aguardar a conclusão e consultar novamente
   → Coluna "is_rendering" retorna "false" após a conclusão

## TC3 — Worker Sidekiq orquestra render + assembly + upload
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir orquestração do worker.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Acesso ao painel do Sidekiq do ambiente Stage.
   → Estado descrito pré-existe no ambiente.
2. Disparar "Publicar alterações" na atividade
   → Job é disparado
3. Verificar o worker "Sidekiq" (render + assembly + upload)
   → Worker Sidekiq é executado e orquestra: render dos slides + assembly do vídeo (caso aula com avatar/áudio) + upload para Bunny.net + atualização de VideoPlatformData

## TC4 — Upload para Bunny.net e atualização de VideoPlatformData
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir integração com Bunny.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Acesso ao painel do Bunny.net.
   → Estado descrito pré-existe no ambiente.
2. Disparar "Publicar alterações" na atividade
   → Job inicia
3. Aguardar conclusão
   → Vídeo é uploadado para Bunny.net
4. Consultar a tabela VideoPlatformData
   → Registro atualizado com o URL/ID do vídeo no Bunny

## TC5 — Badge "renderizando" + barra de progresso via WebSocket
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir feedback visual durante o render.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Job de renderização em andamento.
   → Estado descrito pré-existe no ambiente.
2. Após disparar "Publicar alterações", observar a atividade na lista
   → Badge exibida: "renderizando"
3. Verificar a barra de progresso exibida após "Publicar alterações"
   → Barra de progresso é exibida e atualizada via WebSocket (ou polling)

## TC6 — Instrutor pode editar outras atividades durante render
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que render não bloqueia outras atividades.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Curso com pelo menos 2 atividades; renderização em andamento na atividade 1.
   → Estado descrito pré-existe no ambiente.
2. Disparar renderização na atividade 1
   → Render inicia
3. Selecionar a atividade 2, sem aguardar o término da renderização
   → Atividade 2 fica selecionada na lista
4. Clicar em "Editar"
   → Editor da atividade 2 abre normalmente
5. Editar e salvar a atividade 2
   → Edição é concluída com sucesso

## TC7 — Editar a atividade que está em render é bloqueado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir bloqueio na atividade em render.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Renderização em andamento na atividade.
   → Estado descrito pré-existe no ambiente.
2. Tentar clicar em "Editar" na atividade que está renderizando
   → Edição é bloqueada (mensagem ou estado visual indica que a atividade está em renderização)

## TC8 — Retentativa automática (1x) com delay em falha
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir retry automático.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Simulação de falha intermitente no render.
   → Estado descrito pré-existe no ambiente.
2. Disparar renderização com falha intermitente forçada
   → Worker tenta uma vez, falha
3. Verificar os logs do "Sidekiq"
   → Worker faz 1 retentativa com delay configurado
4. Aguardar conclusão da retentativa bem-sucedida
   → Renderização finaliza com sucesso na 2ª tentativa

## TC9 — Falha definitiva: badge "erro" + notificação por email
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir feedback em falha definitiva.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Simulação de falha definitiva no render (após retentativa).
   → Estado descrito pré-existe no ambiente.
2. Disparar renderização com falha definitiva forçada
   → Worker tenta, falha, retenta, falha novamente
3. Verificar a badge "erro" da atividade na lista
   → Badge "erro" é exibida
4. Verificar a caixa de e-mail do instrutor ("notificação de falha")
   → E-mail de notificação de falha é recebido
5. Consultar NotificationHistory
   → Registro de notificação para o instrutor é criado

## TC10 — Logs estruturados em postgres_logs para investigação
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

> ⛔ **BLOQUEADO — logging não implementado.** Confirmado pelo dev Jeiel
> Alves de Oliveira em 08/06/2026: *"não tem logs ainda"*. A feature de
> logging de auditoria do Estúdio (Discovery RN 48.3) não foi entregue —
> não há tabela/banco de destino. Não gerar spec nem testar até a feature
> entrar. Quando entrar, pedir ao dev: banco (PostgreSQL/TimescaleDB vs
> DynamoDB), tabela e campo de correlação (`trace_id`). Reavaliar então.

### Objetivo
Garantir registro estruturado.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Acesso ao postgres_logs.
   → Estado descrito pré-existe no ambiente.
2. Disparar uma renderização (com sucesso ou falha)
   → Job é executado
3. Consultar postgres_logs filtrando pelo trace_id da operação
   → Logs estruturados são registrados com timestamp, status, payload e trace_id

## TC11 — Aluno passa a consumir nova versão na próxima sessão
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir consumo da nova versão.

### Passos
1. Pré-condição: Curso publicado com atividade renderizada; Aluno inscrito.
   → Estado descrito pré-existe no ambiente.
2. Como instrutor, publicar uma nova versão da atividade
   → Renderização é concluída
3. Logar como aluno (nova sessão) e abrir a atividade no Play
   → Aluno passa a consumir a nova versão renderizada

## TC12 — Aluno em meio à aula continua na versão antiga
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento de não interrupção.

### Passos
1. Pré-condição: Aluno com sessão ativa consumindo a versão antiga da atividade.
   → Estado descrito pré-existe no ambiente.
2. Como instrutor, publicar nova versão da mesma atividade
   → Renderização é concluída
3. Verificar a sessão do aluno no "Aprender" (ainda em curso)
   → Aluno continua consumindo a versão antiga (não é forçado para a nova nem vê aviso)
4. Após o aluno finalizar e iniciar nova sessão
   → Próxima sessão dele passa a usar a versão atual

---
suite: Manter criacao 100 porcento manual
executor: playwright
playbooks:
- flipper
- super-admin
- filtro-drawer
- switch-chakra
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Manter criacao 100 porcento manual

## TC1 — Botão "Adicionar atividade" abre seleção de tipos
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir paridade com fluxo atual.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar atividade"
   → Seleção de tipos é exibida com as opções: Aula, Página, Vídeo Upload, PDF, SCORM, Embed, Texto, Game, Questionário

## TC2 — Cadastro Lesson com 2 abas internas (Dados, Conteúdo)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir refactor do cadastro de Lesson.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar atividade" e selecionar "Aula"
   → Cadastro de Lesson é aberto
3. Verificar as abas internas "Dados" e "Conteúdo"
   → Cadastro exibe 2 abas internas: "Dados" e "Conteúdo"

## TC3 — Cadastro Page com 2 abas internas (Dados, Conteúdo)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir refactor do cadastro de Page.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar atividade" e selecionar "Página"
   → Cadastro de Page é aberto
3. Verificar as abas internas "Dados" e "Conteúdo"
   → Cadastro exibe 2 abas internas: "Dados" e "Conteúdo"

## TC4 — Cadastro de Vídeo Upload mantém comportamento atual
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir regressão (sem refactor).

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "Vídeo Upload"
   → Cadastro de Vídeo é aberto
3. Verificar o layout do cadastro (paridade com a tela antiga "Atividades")
   → Cadastro segue o layout atual (sem refactor neste release)
4. Fazer upload de um vídeo de teste no campo correspondente
   → Upload é concluído com sucesso

## TC5 — Cadastro de PDF mantém comportamento atual
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir regressão.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "PDF"
   → Cadastro de PDF é aberto
3. Fazer upload de um arquivo PDF
   → Upload é concluído com sucesso

## TC6 — Cadastro de SCORM mantém comportamento atual
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir regressão.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "SCORM"
   → Cadastro de SCORM é aberto
3. Fazer upload de um pacote SCORM
   → Pacote é enviado e validado

## TC7 — Cadastro de Texto mantém comportamento atual
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir regressão.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "Texto"
   → Cadastro de Texto é aberto
3. Preencher e salvar
   → Atividade salva com sucesso

## TC8 — Cadastro de Game mantém comportamento atual
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir regressão.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "Game"
   → Cadastro de Game é aberto
3. Configurar e salvar
   → Game salvo com sucesso

## TC9 — Cadastro de Embed mantém comportamento atual
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir regressão.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "Embed"
   → Cadastro de Embed é aberto
3. Preencher a URL do iframe e salvar
   → Embed é salvo com sucesso

## TC10 — Cadastro de Questionário mantém comportamento atual
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir regressão e ajustes cosméticos.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "Questionário"
   → Cadastro de Questionário é aberto
3. Adicionar uma pergunta e salvar
   → Questionário é salvo com sucesso

## TC11 — Aba "Dados" exibe título, descrição e configurações
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir conteúdo da aba Dados.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "Aula"
   → Cadastro é aberto
3. Clicar na aba interna "Dados"
   → Aba "Dados" exibe campos de título, descrição e configurações (visibilidade, peso, etc.)

## TC12 — Aba "Conteúdo" carrega Plate.js para Page
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir editor correto na aba Conteúdo.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "Página"
   → Cadastro é aberto
3. Clicar na aba interna "Conteúdo"
   → Editor Plate.js é carregado

## TC13 — Aba "Conteúdo" carrega Fabric.js para Lesson
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir editor correto na aba Conteúdo de Lesson.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Adicionar atividade" e selecionar "Aula"
   → Cadastro é aberto
3. Clicar na aba interna "Conteúdo"
   → Editor Fabric.js é carregado

## TC14 — Operações sem créditos disponíveis em planos sem IA
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir paridade para planos sem IA.

### Passos
1. Pré-condição: Organização em plano SEM créditos de IA; Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar o Estúdio do curso
   → Estúdio carrega normalmente
3. Clicar em "Adicionar atividade" e cadastrar manualmente
   → Operação sem créditos funciona normalmente
4. Fazer upload de Vídeo/PDF/SCORM e configurar Questionário
   → Todas as operações que não consomem créditos funcionam normalmente

## TC15 — Questionário: toggle "Exibir perguntas em ordem aleatória" (default off)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir toggle independente.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Cadastrar nova atividade do tipo "Questionário"
   → Cadastro é aberto
3. Verificar o toggle "Exibir perguntas em ordem aleatória"
   → Toggle exibido como independente; default é "Off"
4. Ativar o switch "Exibir perguntas em ordem aleatória"
   → Toggle muda para "On"
5. Salvar e recarregar
   → Configuração persiste

## TC16 — Questionário: toggle "Perguntas diferentes a cada tentativa" (default off)
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir 2º toggle independente.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Cadastrar nova atividade do tipo "Questionário"
   → Cadastro é aberto
3. Verificar o toggle "Perguntas diferentes a cada tentativa"
   → Toggle exibido como independente; default é "Off"
4. Ativar o switch "Perguntas diferentes a cada tentativa"
   → Toggle muda para "On"
5. Salvar e recarregar
   → Configuração persiste

## TC17 — Questionário: pontuação mínima default = 70%
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir default de pontuação.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Cadastrar nova atividade do tipo "Questionário"
   → Cadastro é aberto
3. Verificar campo "Pontuação mínima"
   → Campo exibe "70" como valor default (anteriormente vinha vazio)

## TC18 — Questionário: campos "peso" e "% pontuação final" em section "Avaliação no curso"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir realocação dos campos.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Cadastrar nova atividade do tipo "Questionário"
   → Cadastro é aberto
3. Verificar a section "Avaliação no curso"
   → Section exibe os campos "Peso" e "Percentual na pontuação final" (saíram do bloco de pontuação mínima)

## TC19 — [Regressão] Editor Fabric e Plate sem refactor neste release
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que editores não foram alterados.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Editar" da atividade "Lesson"
   → Editor Fabric.js é aberto
3. Verificar as funcionalidades do editor "Fabric.js"
   → Funcionalidades atuais do editor Fabric.js são mantidas (sem refactor)
4. Clicar em "Editar" de uma atividade "Page"
   → Editor Plate.js é aberto
5. Verificar as funcionalidades do editor "Plate.js"
   → Funcionalidades atuais do editor Plate.js são mantidas (sem refactor)

## TC20 — Validar abertura do drawer "Adicionar conteúdo" via botão "Adicionar"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir abertura do drawer de seleção de tipos a partir da lista de atividades.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Adicionar" do header da lista de atividades
   → Drawer/painel "Adicionar conteúdo" é aberto
3. Verificar o heading "Adicionar conteúdo" no título do drawer
   → Heading nível 2 exibido: "Adicionar conteúdo"
4. Verificar o botão "Fechar" (X) no topo direito do drawer
   → Botão "Fechar" (X) é exibido no topo direito do drawer

## TC21 — Validar seção "Conteúdo" do drawer "Adicionar conteúdo"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir tipos disponíveis na seção "Conteúdo" com textos literais.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer "Adicionar conteúdo" aberto.
   → Estado descrito pré-existe no ambiente.
2. Localizar a seção "Conteúdo" no drawer
   → Parágrafo de título "Conteúdo" é exibido
3. Verificar tipos da seção "Conteúdo"
   → 7 tipos são exibidos: "Texto", "Página", "Aula", "PDF Estampado", "Vídeo upload", "Vídeo externo", "Arquivos"
4. Verificar descrição do tipo "Texto"
   → Texto exibido abaixo do título: "Conteúdo em texto simples ou formatado"
5. Verificar descrição do tipo "Página"
   → Texto exibido: "Conteúdo rico com blocos editáveis"
6. Verificar descrição do tipo "Aula"
   → Texto exibido: "Aula com slides e partes sequenciais"
7. Verificar descrição do tipo "PDF Estampado"
   → Texto exibido: "Documento PDF para leitura"
8. Verificar descrição do tipo "Vídeo upload"
   → Texto exibido: "Faça upload de um vídeo"
9. Verificar descrição do tipo "Vídeo externo"
   → Texto exibido: "Link para vídeo externo (YouTube, Vimeo)"
10. Verificar descrição do tipo "Arquivos"
   → Texto exibido: "Upload de arquivos para download"

## TC22 — Validar seção "Interação e avaliação" do drawer
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir tipos disponíveis na seção "Interação e avaliação" com textos literais.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer "Adicionar conteúdo" aberto.
   → Estado descrito pré-existe no ambiente.
2. Localizar a seção "Interação e avaliação" no drawer
   → Parágrafo de título "Interação e avaliação" é exibido
3. Verificar os tipos "Questionário", "SCORM" e "Games" da seção
   → 3 tipos são exibidos: "Questionário", "SCORM", "Games"
4. Verificar descrição do tipo "Questionário"
   → Texto exibido: "Avaliação com perguntas e respostas"
5. Verificar descrição do tipo "SCORM"
   → Texto exibido: "Pacote SCORM compatível"
6. Verificar descrição do tipo "Games"
   → Texto exibido: "Atividade gamificada interativa"

## TC23 — Validar fechamento do drawer "Adicionar conteúdo"
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que o drawer pode ser fechado pelo botão "Fechar".

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer "Adicionar conteúdo" aberto.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Fechar" (X)
   → Drawer é fechado e nenhum tipo é selecionado
3. Verificar a lista "Atividades" após fechar
   → Lista permanece inalterada

## TC24 — Selecionar tipo "Texto" a partir do drawer "Adicionar conteúdo"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir fluxo de criação a partir do drawer.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer "Adicionar conteúdo" aberto.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão de tipo "Texto"
   → Cadastro de nova atividade "Texto" é aberto
3. Validar os campos "nome", "descrição" e "configurações" exibidos no cadastro
   → Campos de cadastro padrão são exibidos (nome, descrição, configurações)

## TC25 — Selecionar tipo "Página" a partir do drawer "Adicionar conteúdo"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir fluxo de criação "Page" com 2 abas internas (RN 50).

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer "Adicionar conteúdo" aberto.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão de tipo "Página"
   → Cadastro de nova atividade "Página" é aberto
3. Verificar as abas internas "Dados" e "Conteúdo" do cadastro (editor Plate.js)
   → Modal exibe 2 abas internas: "Dados" e "Conteúdo" (com editor Plate.js)

## TC26 — Selecionar tipo "Aula" a partir do drawer "Adicionar conteúdo"
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir fluxo de criação "Lesson" com 2 abas internas (RN 50).

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Drawer "Adicionar conteúdo" aberto.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão de tipo "Aula"
   → Cadastro de nova atividade "Aula" é aberto
3. Verificar as abas internas "Dados" e "Conteúdo" do cadastro (editor Fabric.js)
   → Modal exibe 2 abas internas: "Dados" e "Conteúdo" (com editor Fabric.js)

---
suite: Suportar mobile
executor: playwright
playbooks:
- flipper
- filtro-drawer
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Suportar mobile

## TC1 — Acessar Estúdio em viewport Mobile (360x740)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir abertura em mobile.

### Passos
1. Pré-condição: Curso de teste cadastrado; Viewport Mobile (360x740).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events/:id/edit/studio"
   → Estúdio carrega em layout mobile (largura &lt; 768px)

## TC2 — Drawer do copiloto vira tela cheia em mobile
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir adaptação do drawer.

### Passos
1. Pré-condição: Curso de teste cadastrado; Viewport Mobile (360x740).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio
   → Layout mobile é exibido
3. Abrir o copiloto via ícone flutuante
   → Drawer ocupa tela cheia em mobile

## TC3 — Lista, preview e copiloto viram 3 tabs no rodapé
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir tabs no rodapé.

### Passos
1. Pré-condição: Curso de teste cadastrado; Viewport Mobile (360x740).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio em mobile
   → Layout mobile exibe 3 ícones no rodapé
3. Verificar os ícones das tabs ("lista de atividades", "preview", "copiloto")
   → Ícones representam: lista de atividades, preview e copiloto

## TC4 — Alternar entre tabs no rodapé
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir navegação entre tabs.

### Passos
1. Pré-condição: Curso de teste cadastrado; Viewport Mobile (360x740).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio em mobile
   → Layout mobile com tabs é exibido
3. Tocar no ícone "Preview" do rodapé
   → Conteúdo principal alterna para o preview
4. Tocar no ícone "Copiloto" do rodapé
   → Conteúdo principal alterna para o copiloto
5. Tocar no ícone "Lista" do rodapé
   → Conteúdo principal alterna para a lista de atividades

## TC5 — Drag and drop touch com handle ampliado
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir reordenação em mobile via touch.

### Passos
1. Pré-condição: Curso com 3 atividades; Viewport Mobile (360x740).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio em mobile
   → Lista de atividades é exibida
3. Verificar o "drag handle" ampliado para touch
   → Handle é exibido ampliado para usabilidade touch
4. Executar drag &amp; drop touch na atividade da posição 1 para a posição 3
   → Reordenação é concluída com sucesso

## TC6 — Operações de IA disponíveis em mobile (latência maior aceita)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir IA em mobile.

### Passos
1. Pré-condição: Curso com 1 atividade "Lesson"; Viewport Mobile (360x740).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio em mobile
   → Layout mobile é exibido
3. Abrir o copiloto e solicitar "gerar roteiro desta aula"
   → Operação de IA é disparada normalmente
4. Aguardar a conclusão
   → Resultado é entregue (com tempo de resposta possivelmente maior em rede móvel)

## TC7 — Edição inline acessível em mobile (UX não otimizada)
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir acesso ao editor em mobile, mesmo sem UX otimizada.

### Passos
1. Pré-condição: Curso com 1 atividade "Page"; Viewport Mobile (360x740).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio em mobile
   → Layout mobile é exibido
3. Selecionar a atividade "Page" e clicar em "Editar"
   → Editor Plate.js é aberto (UX não é otimizada, conforme premissa)
4. Digitar conteúdo manualmente
   → Editor aceita a entrada

## TC8 — Viewport < 768px aplica layout mobile
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir breakpoint de 768px.

### Passos
1. Pré-condição: Curso de teste cadastrado; Viewport com largura 767px.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio com largura 767px
   → Layout mobile é aplicado (largura &lt; 768px)

## TC9 — Viewport Tablet (768x1024) com comportamento intermediário
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir adaptação para tablet.

### Passos
1. Pré-condição: Curso de teste cadastrado; Viewport Tablet (768x1024).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL do Estúdio
   → Layout adapta para tablet (entre desktop e mobile)
3. Validar os componentes principais ("lista", "preview", "copiloto") no viewport
   → Componentes são exibidos respeitando a largura disponível

---
suite: Coexistir com tela antiga via rota nova e feature flag
executor: playwright
playbooks:
- flipper
- super-admin
- cleanup-dados
preconditions:
- Ambiente Stage configurado
---

# Coexistir com tela antiga via rota nova e feature flag

## TC1 — Feature flag habilitada redireciona para nova rota
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir acesso ao Estúdio quando flag ativa.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) habilitada para a organização; Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events/:id/edit" e clicar em "Atividades" no menu lateral
   → Link aponta para a nova rota "/o/{org}/events/:id/edit/studio"
3. Verificar que a URL do navegador contém "/edit/studio"
   → URL contém "/edit/studio"
4. Aguardar o Estúdio carregar
   → Estúdio é exibido

## TC2 — Feature flag desabilitada redireciona para rota antiga
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir rollback automático quando flag inativa.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) DESABILITADA para a organização; Curso de teste previamente cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "/o/{org}/events/:id/edit" e clicar em "Atividades"
   → Link aponta para a rota antiga "/o/{org}/events/:id/edit/activities"
3. Verificar que a URL do navegador contém "/edit/activities"
   → URL contém "/edit/activities" (rota antiga)
4. Aguardar a tela carregar
   → Tela antiga de atividades é exibida

## TC3 — Habilitar feature flag para organização via Flipper
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir gestão via Flipper.

### Passos
1. Pré-condição: Usuário logado como Super Admin; Acesso ao painel do Flipper.
   → Estado descrito pré-existe no ambiente.
2. Acessar o painel do Flipper
   → Painel do Flipper é exibido
3. Localizar a feature "creation_studio"
   → Feature é listada
4. Habilitar a feature para a organização de teste
   → Flag fica ativa para a organização
5. Verificar o retorno de "Feature.enabled?(feature: :creation_studio, to: organization)"
   → Retorno true após habilitação

## TC4 — Rota nova /edit/studio acessível
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir acesso direto à rota nova.

### Passos
1. Pré-condição: Usuário logado como Instrutor com permissão de edição de curso; Feature flag "creation_studio" (Flipper) habilitada para a organização; Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar diretamente a URL "/o/{org}/events/:id/edit/studio"
   → Estúdio é carregado

## TC5 — Rota antiga /edit/activities continua acessível
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir convivência das rotas.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) habilitada para a organização; Curso de teste cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar diretamente a URL "/o/{org}/events/:id/edit/activities"
   → Tela antiga de atividades é carregada (mesmo com a flag habilitada)

## TC6 — Aluno consome conteúdo publicado independente da origem
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir consumo único pelo aluno.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) habilitada para a organização; Curso com atividade publicada via Estúdio (rota nova) E outra atividade publicada via rota antiga; Aluno inscrito.
   → Estado descrito pré-existe no ambiente.
2. Logar como aluno e acessar o curso no Play
   → Aluno vê todas as atividades publicadas (independente da rota de edição)
3. Abrir uma atividade publicada via Estúdio
   → Conteúdo é exibido normalmente
4. Abrir uma atividade publicada via rota antiga
   → Conteúdo é exibido normalmente

## TC7 — [Regressão] Tela antiga não recebe novas funcionalidades
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que a tela antiga não tem features do Estúdio.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) DESABILITADA para a organização; Curso de teste previamente cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Acessar a rota antiga "/edit/activities"
   → Tela antiga é exibida
3. Verificar a ausência das funcionalidades novas ("badges clicáveis", "copiloto", "geração IA particionada") na tela antiga
   → Funcionalidades novas (badges clicáveis, copiloto, geração IA particionada) NÃO estão presentes na tela antiga

## TC8 — Rollback (desligar flag) sem perda de dados
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir reversão segura.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) habilitada para a organização; Curso com atividades publicadas via Estúdio; Flag "creation_studio" habilitada.
   → Estado descrito pré-existe no ambiente.
2. No Estúdio, criar e publicar atividade
   → Atividade é publicada
3. Como Super Admin, desabilitar a flag "creation_studio" para a organização
   → Flag fica inativa
4. Como instrutor, acessar a edição do mesmo curso
   → Sistema redireciona para a rota antiga
5. Verificar a atividade criada anteriormente na tela antiga "Atividades"
   → Atividade está presente e funcional (zero perda de dados — o EventContent é o mesmo)

## TC9 — EventContent é o mesmo nas duas telas
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que ambas as telas operam sobre o mesmo registro.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) habilitada para a organização; Curso com atividade cadastrada; Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Editar uma atividade via Estúdio (nova rota) e salvar
   → Atividade é atualizada
3. Consultar event_contents WHERE id = X
   → Registro é único
4. Desabilitar a flag e editar via rota antiga
   → Atividade é editável com as mesmas alterações persistidas
5. Consultar event_contents novamente
   → Mesmo id é atualizado (sem duplicação de registro)

## TC10 — [Validação Manual] Métrica de adoção monitorada pelo CS
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir telemetria de adoção.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) habilitada para a organização; Acesso ao dashboard de métricas do CS.
   → Estado descrito pré-existe no ambiente.
2. Acessar o dashboard de métricas
   → Dashboard exibe métrica de adoção (% de instrutores usando o Estúdio vs antigo)

## TC11 — Transição entre estados de flag durante sessão ativa
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir comportamento em troca de estado em runtime.

### Passos
1. Pré-condição: Usuário logado como administrador com permissão de edição de curso; Feature flag "creation_studio" (Flipper) habilitada para a organização; Curso aberto no Estúdio (flag habilitada).
   → Estado descrito pré-existe no ambiente.
2. Manter Estúdio aberto e usar a edição normalmente
   → Estúdio funciona normalmente
3. Como Super Admin (outra sessão), desabilitar a flag para a organização
   → Flag fica inativa
4. Recarregar a página do instrutor
   → Instrutor é redirecionado para a rota antiga; dados continuam acessíveis

---
suite: Duplicar curso a partir do Estudio
executor: playwright
playbooks:
- flipper
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Duplicar curso a partir do Estudio

## TC1 — Botão "Salvar como novo" visível no menu secundário do topo
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir presença do botão.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Usuário no Estúdio do curso existente.
   → Estado descrito pré-existe no ambiente.
2. Acessar o Estúdio do curso existente
   → Estúdio é exibido
3. Abrir o menu secundário no topo do Estúdio
   → Botão "Salvar como novo" é exibido no menu secundário, junto com "Publicar alterações"

## TC2 — Botão visível apenas em cursos já criados
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir restrição contextual do botão.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Usuário no Estúdio de um curso existente (já salvo).
   → Estado descrito pré-existe no ambiente.
2. Acessar o Estúdio de um curso já criado
   → Botão "Salvar como novo" é exibido

## TC3 — Botão NÃO visível em curso novo em branco
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir ocultação em curso não persistido.

### Passos
1. Iniciar criação de um novo curso via card "Curso"
   → Estúdio é aberto com curso vazio (não salvo)
2. Abrir o menu secundário
   → Botão "Salvar como novo" NÃO é exibido

## TC4 — Click dispara job assíncrono de cópia
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir disparo do job.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Usuário no Estúdio do curso existente.
   → Estado descrito pré-existe no ambiente.
2. Clicar no botão "Salvar como novo"
   → Job assíncrono de duplicação é disparado
3. Verificar o feedback de "duplicação em andamento" ao usuário
   → Mensagem informa que a duplicação está em andamento

## TC5 — Novo Event criado com nome sufixo "(cópia)"
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir nome da cópia.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Curso original com nome "Curso Original".
   → Estado descrito pré-existe no ambiente.
2. No Estúdio, clicar em "Salvar como novo"
   → Job dispara
3. Aguardar a conclusão
   → Novo curso é criado com nome "Curso Original (cópia)"

## TC6 — EventContents e assets copiados
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir cópia das atividades.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Curso original com 5 atividades (mistura de Lesson, Page, Vídeo).
   → Estado descrito pré-existe no ambiente.
2. Disparar "Salvar como novo"
   → Job dispara
3. Aguardar a conclusão e abrir o novo curso
   → Novo curso contém as 5 atividades copiadas com seus assets (vídeos, imagens, slides)

## TC7 — Questions e QuestionLists associadas copiadas
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir cópia de questionários.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Curso com questionário cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Disparar "Salvar como novo" no curso original
   → Job dispara
3. Aguardar a conclusão e abrir o novo curso
   → Questionário e QuestionLists associadas estão presentes no novo curso

## TC8 — Banner, certificado e modelo de marca copiados
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir cópia de configurações visuais.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Curso com banner, certificado e modelo de marca configurados.
   → Estado descrito pré-existe no ambiente.
2. Disparar "Salvar como novo"
   → Job dispara
3. Aguardar a conclusão e abrir o novo curso
   → Banner, certificado e modelo de marca estão presentes no novo curso

## TC9 — Histórico de chat NÃO é copiado
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir privacidade.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Curso original com histórico de chat do copiloto.
   → Estado descrito pré-existe no ambiente.
2. Disparar "Salvar como novo"
   → Job dispara
3. Aguardar a conclusão e abrir o copiloto no novo curso
   → Histórico de chat está zerado no novo curso (não copiado)

## TC10 — Inscrições, pagamentos, métricas NÃO copiados
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir que dados sensíveis ficam restritos ao original.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Curso original com inscrições, pagamentos e certificados emitidos.
   → Estado descrito pré-existe no ambiente.
2. Disparar "Salvar como novo"
   → Job dispara
3. Aguardar a conclusão e abrir o novo curso
   → Novo curso NÃO contém inscrições, pagamentos, registros de aluno, métricas nem certificados emitidos

## TC11 — Redirect para Estúdio do novo curso ao concluir
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir UX pós-conclusão.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado.
   → Estado descrito pré-existe no ambiente.
2. Clicar em "Salvar como novo" no curso original
   → Job dispara
3. Aguardar a conclusão
   → Usuário é redirecionado automaticamente para o Estúdio do novo curso

## TC12 — Atomicidade: falha no meio gera rollback ou estado consistente
**Prioridade**: low
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir consistência em caso de falha.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Curso original com 100 atividades; simulação de falha forçada na atividade 80.
   → Estado descrito pré-existe no ambiente.
2. Disparar "Salvar como novo" com falha forçada na atividade 80
   → Job inicia, processa atividades, falha na 80
3. Verificar o estado pós-falha da duplicação ("rollback" ou estado parcial documentado)
   → Sistema executa rollback (não cria curso parcial) OU registra estado parcial documentado
4. Verificar a notificação de falha ao usuário (e-mail ou "notificação na UI")
   → Usuário recebe feedback de falha (e-mail ou notificação na UI)

---
suite: Exclusão do Banco Histórico
executor: playwright
playbooks:
- flipper
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
---

# Exclusão do Banco Histórico

## TC1 — Exclusão do ambiente e dos registros das tabelas do banco de dados
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir a exclusão dos registros das tabelas do banco de dados da organização que foi excluída.<br /> <br /> MySQL (novas):<br /> studio_generation_partitions<br /> activity_summaries<br /> org_generation_preferences<br /> user_course_preferences<br /> <br /> MySQL (estendidas):<br /> conversations<br /> messages<br /> event_contents<br /> <br /> DynamoDB:<br /> studio_checkpoints<br /> messages

### Passos
1. Acessar a tabela "studio_generation_partitions" (PostgreSQL) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela
2. Acessar a tabela "activity_summaries" (MySQL) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela
3. Acessar a tabela "org_generation_preferences" (PostgreSQL) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela
4. Acessar a tabela "user_course_preferences" (PostgreSQL) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela
5. Acessar a tabela "conversations" (PostgreSQL) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela
6. Acessar a tabela "messages" (PostgreSQL) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela
7. Acessar a tabela "event_contents" (PostgreSQL) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela
8. Acessar a tabela "studio_checkpoints" (DynamoDB) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela
9. Acessar a tabela "messages" (DynamoDB) e conferir todos os registros (colunas)
   → Todos os registros da organização excluída devem ser apagadas dessa tabela

---
suite: Tabelas do Banco de Dados
executor: playwright
playbooks:
- flipper
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
---

# Tabelas do Banco de Dados

## TC1 — [Validação Manual] Tabela "studio_generation_partitions" criada
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir criação da tabela com colunas esperadas.

### Passos
1. Pré-condição: Acesso ao banco MySQL do ambiente Stage.
   → Estado descrito pré-existe no ambiente.
2. Executar "DESCRIBE studio_generation_partitions"
   → Tabela existe com colunas: id, event_content_id (FK), status (enum: queued/processing/completed/failed/approved/superseded), artifact_type (roteiro/slides/imagem/audio/render/conteudo_pagina/resumo), result_data (JSON), lock_active, applied_to_event_content_at, approved_by, trace_id, created_at, updated_at

## TC2 — [Validação Manual] Tabela "activity_summaries" criada
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir criação da tabela.

### Passos
1. Pré-condição: Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Executar "DESCRIBE activity_summaries"
   → Tabela existe com colunas: id, event_content_id (FK), summary_one_line, key_takeaways (JSON), glossary_introduced (JSON), created_at, updated_at

## TC3 — [Validação Manual] Tabela "org_generation_preferences" criada
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir criação da tabela.

### Passos
1. Pré-condição: Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Executar "DESCRIBE org_generation_preferences"
   → Tabela existe com colunas: id, organization_id (FK), image_provider (enum: pexels/openai/google), audio_provider, voice_persona, created_at, updated_at

## TC4 — [Validação Manual] Tabela "user_course_preferences" criada (tab_order, last_tab)
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir criação da tabela para preferências de aba.

### Passos
1. Pré-condição: Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Executar "DESCRIBE user_course_preferences"
   → Tabela existe com colunas: id, user_id (FK), event_id (FK), tab_order (JSON), last_tab (string), created_at, updated_at

## TC5 — [Validação Manual] Tabela "conversations" estendida
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir extensão da tabela existente.

### Passos
1. Pré-condição: Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Executar "DESCRIBE conversations"
   → Tabela contém: organization_dataset_id (agora nullable), event_id (FK nova), user_id (FK nova), context_type (enum: studio_estudio / studio_assistente_conteudo)
3. Verificar as consultas existentes do "process_document"
   → Consultas antigas (com organization_dataset_id preenchido) continuam funcionando

## TC6 — [Validação Manual] Tabela "messages" estendida com studio_partition_id
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir extensão para mensagens do Estúdio.

### Passos
1. Pré-condição: Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Executar "DESCRIBE messages"
   → Tabela contém coluna nova "studio_partition_id" (FK opcional para studio_generation_partitions)

## TC7 — [Validação Manual] Tabela "event_contents" com display_label e display_icon
**Prioridade**: critical
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir adição das colunas para customização.

### Passos
1. Pré-condição: Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Executar "DESCRIBE event_contents"
   → Tabela contém as colunas novas: "display_label" (string, NOT NULL) e "display_icon" (string, nullable)

## TC8 — [Validação Manual] DynamoDB "studio_checkpoints" criada
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir criação da tabela DynamoDB.

### Passos
1. Pré-condição: Acesso ao DynamoDB do ambiente Stage.
   → Estado descrito pré-existe no ambiente.
2. Acessar o console DynamoDB
   → Tabela "studio_checkpoints" está presente
3. Verificar a "partitionKey" e a estrutura da tabela
   → Estrutura suporta LangGraph DynamoDBSaver (thread_id, checkpoint_id, state)

## TC9 — [Validação Manual] DynamoDB "messages" com mensagens individuais
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir criação da tabela de mensagens.

### Passos
1. Pré-condição: Acesso ao DynamoDB.
   → Estado descrito pré-existe no ambiente.
2. Acessar o console DynamoDB
   → Tabela "messages" está presente com partitionKey/sortKey adequados
3. Verificar os atributos esperados ("conversation_id", "message_id", "message_type", "content", "timestamp")
   → Atributos incluem: conversation_id, message_id, message_type (text/tool_call/tool_result/assistant/system), content, timestamp

## TC10 — [Validação Manual] FKs e constraints válidas (rollback testado)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir integridade referencial.

### Passos
1. Pré-condição: Acesso ao banco MySQL.
   → Estado descrito pré-existe no ambiente.
2. Verificar FKs em "studio_generation_partitions"
   → FK "event_content_id" referencia "event_contents.id" com ON DELETE CASCADE adequado
3. Verificar FKs em "user_course_preferences"
   → FKs "user_id" e "event_id" definidas corretamente
4. Tentar deletar um event_content com partitions associadas
   → Constraint reage conforme definição: DELETE em cascata remove os registros filhos OU erro de FK ("foreign key constraint") bloqueia a exclusão

## TC11 — [Validação Manual] Migrations reversíveis (up/down)
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir migrations reversíveis.

### Passos
1. Pré-condição: Acesso ao ambiente Rails Stage.
   → Estado descrito pré-existe no ambiente.
2. Executar "rails db:migrate:down VERSION=X" para a migration de uma das tabelas novas
   → Migration down executa sem erro
3. Verificar a remoção da tabela/coluna no banco ("DESCRIBE")
   → Tabela/coluna correspondente foi removida
4. Executar "rails db:migrate:up VERSION=X"
   → Migration up recria a tabela/coluna sem erro

---
suite: Tabela de Logs
executor: playwright
playbooks:
- flipper
- toast-chakra
- cleanup-dados
preconditions:
- Usuário logado como administrador com permissão de edição de curso
- Feature flag "creation_studio" (Flipper) habilitada para a organização
- Ambiente Stage configurado
- Acesso ao postgres_logs
---

# Tabela de Logs

> ⛔ **SUÍTE INTEIRA BLOQUEADA — logging não implementado.** Confirmado
> pelo dev Jeiel Alves de Oliveira em 08/06/2026: *"não tem logs ainda"*.
> Toda esta suíte (e os TCs de log TC24 da suíte "Listar atividades..." e
> TC10 da suíte "Renderizar versão publicada...") depende da feature de
> logging de auditoria do Estúdio (Discovery RN 48.3), que NÃO foi
> entregue. `postgres_logs` não é tabela existente — a Discovery (linha
> 281) deixou o backend de histórico sem confirmar (DynamoDB vs
> `postgres_logs`/TimescaleDB) e o dev confirmou que nada loga ainda.
> Não gerar specs nem testar. Quando a feature entrar, pedir ao dev:
> banco de destino, nome da tabela e campo de correlação (`trace_id`),
> e então reavaliar todos esses TCs. Recomendado linkar ticket de
> implementação de logging.

## TC1 — Log de criação de atividade registrado em postgres_logs
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir log de operação CREATE.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Criar nova atividade no Estúdio
   → Atividade criada
3. Consultar postgres_logs filtrando pela operação e activity_id
   → Log registrado com: timestamp, user_id, organization_id, event_id, activity_id, operação="CREATE", payload, trace_id

## TC2 — Log de edição de atividade registrado em postgres_logs
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir log de operação UPDATE.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Editar uma atividade existente e salvar
   → Atividade atualizada
3. Consultar postgres_logs
   → Log registrado com operação="UPDATE" e dados de antes/depois

## TC3 — Log de exclusão de atividade registrado em postgres_logs
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir log de operação DELETE.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Excluir uma atividade
   → Atividade removida
3. Consultar postgres_logs
   → Log registrado com operação="DELETE" e identificadores da atividade removida

## TC4 — Log de reorder via drag and drop registrado
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir log de operação de reorder.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Curso com pelo menos 3 atividades.
   → Estado descrito pré-existe no ambiente.
2. Arrastar uma atividade para nova posição
   → Reorder API é disparada
3. Consultar postgres_logs
   → Log registrado contendo activity_id, new_parent_id, position e trace_id

## TC5 — Log de falha de renderização registrado com trace_id
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir log estruturado de falha.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso; Simulação de falha de renderização.
   → Estado descrito pré-existe no ambiente.
2. Disparar "Publicar alterações" com falha forçada
   → Render falha
3. Consultar postgres_logs filtrando pelo trace_id da operação
   → Log de falha registrado com mensagem de erro, stack trace e trace_id

## TC6 — Logs de tool calling do copiloto registrados (correlation ID)
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir log das tool calls.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio".
   → Estado descrito pré-existe no ambiente.
2. Abrir o copiloto e enviar mensagem que dispara tool call (ex.: "leia o estado do curso")
   → Tool call é executada
3. Consultar postgres_logs filtrando por correlation ID/trace_id
   → Log registrado contendo: nome da tool ("read_course_state"), args, resultado, duração e trace_id

## TC7 — Logs de lifecycle de partition (started/completed/failed/approved)
**Prioridade**: medium
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir rastreabilidade do lifecycle.

### Passos
1. Pré-condição: Curso de teste previamente cadastrado; Acessar a URL "/o/{org}/events/:id/edit/studio"; Atividade do tipo "Lesson" (aula) previamente cadastrada no curso.
   → Estado descrito pré-existe no ambiente.
2. Disparar geração de etapa via copiloto
   → Partition transiciona pelos estados
3. Consultar postgres_logs filtrando por partition_id
   → Logs registrados para cada transição de estado (queued → processing → completed) com timestamp e trace_id
4. Aprovar a partition
   → Estado vai para "approved"
5. Consultar postgres_logs novamente
   → Log de aprovação é registrado com user_id do aprovador

## TC8 — [Validação Manual] Exclusão automática de logs (PostgreSQL retention)
**Prioridade**: low
**Tipo**: db
**Playbooks adicionais**: []

### Objetivo
Garantir política de retenção em postgres.

### Passos
1. Identificar registros antigos elegíveis para exclusão
   → Registros identificados
2. Aguardar a execução da política de retenção do PostgreSQL OU disparar manualmente
   → Registros antigos são excluídos conforme política
3. Validar que os registros recentes de "postgres_logs" não foram afetados
   → Logs dentro da janela de retenção continuam presentes

---
suite: Trial
executor: playwright
org: trial
playbooks:
- trial
- cleanup-dados
preconditions:
- Ambiente Stage configurado
---

# Trial

## TC1 — Criar trial via URL
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir criação de trial via URL pública.

### Passos
1. Pré-condição: Navegador limpo (sem sessão ativa).
   → Estado descrito pré-existe no ambiente.
2. Acessar a URL "https://stage.twygoead.com/new/register/steps?1"
   → Página de registro de trial é exibida
3. Preencher os campos obrigatórios (nome, e-mail, senha, organização)
   → Campos aceitam valores válidos
4. Confirmar o cadastro
   → Trial é criado; usuário é direcionado para a organização recém-criada

## TC2 — Criar trial via API
**Prioridade**: critical
**Tipo**: api
**Playbooks adicionais**: []

### Objetivo
Garantir criação de trial via API externa.

### Passos
1. Pré-condição: Ferramenta de teste de API (Postman/Insomnia/curl) disponível.
   → Estado descrito pré-existe no ambiente.
2. Enviar POST "https://stage.twygo.com/api/v2/external_onboarding" com payload válido (nome, e-mail, organização)
   → Status code 201 Created. Body contém: organization_id, user_id, access_token
3. Validar a criação no banco ("organizations" e "users" no MySQL)
   → Organização e usuário são criados com sucesso no MySQL

## TC3 — Trial recebe feature flag "creation_studio" habilitada por padrão
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir flag habilitada para novos trials.

### Passos
1. Pré-condição: Trial recém-criado via URL ou API.
   → Estado descrito pré-existe no ambiente.
2. Logar como usuário do trial recém-criado
   → Login bem-sucedido
3. Acessar a edição de um curso e clicar em "Atividades"
   → Sistema redireciona para a nova rota "/edit/studio" (flag "creation_studio" habilitada por padrão para trials)

## TC4 — Exclusão de trial remove dados do Estúdio
**Prioridade**: medium
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir limpeza dos dados na exclusão.

### Passos
1. Pré-condição: Trial com cursos, atividades, partitions, conversations e messages criadas.
   → Estado descrito pré-existe no ambiente.
2. Identificar a organização do trial a ser excluído
   → Organização identificada
3. Disparar a rotina de exclusão de trial (manual ou automática)
   → Rotina executa
4. Consultar tabelas relacionadas (studio_generation_partitions, conversations, messages)
   → Dados específicos do Estúdio relacionados à organização são removidos conforme política

## TC5 — Estúdio acessível em ambiente Stage com trial recém-criado
**Prioridade**: critical
**Tipo**: ui
**Playbooks adicionais**: []

### Objetivo
Garantir fluxo end-to-end de trial.

### Passos
1. Pré-condição: Trial recém-criado.
   → Estado descrito pré-existe no ambiente.
2. Logar como usuário do trial
   → Login bem-sucedido
3. Criar curso via card "Curso"
   → Curso é criado e Estúdio é aberto
4. Adicionar uma atividade manualmente
   → Atividade é criada com sucesso
5. Abrir o copiloto e enviar mensagem básica
   → Copiloto responde normalmente

