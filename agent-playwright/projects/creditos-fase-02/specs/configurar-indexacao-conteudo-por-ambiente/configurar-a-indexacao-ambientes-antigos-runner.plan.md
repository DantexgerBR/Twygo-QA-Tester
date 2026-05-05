# Configurar a indexação - Ambientes antigos - RUNNER

## Application Overview

Módulo Créditos de IA da plataforma Twygo (Super Admin). Aba Configurações exibe tabela de ambientes com colunas Ambiente, Acesso de IA ativo, Herdar configurações do principal e Ações (ícone edit data-test-id=ai-consumption-analysis-edit-button). Esta testcase valida o comportamento pós-execução do Runner para atualizar registros no banco vetorial em: (1) ambiente principal / ambiente antigo pré-implementação, (2) ambiente adicional que HERDA configurações do principal, e (3) ambiente adicional INDEPENDENTE. A operação de rodar o Runner é server-side — steps de Runner estão marcados como REVIEW_NEEDED com asserção UI alternativa para o estado pós-runner. Checkboxes LEGÍVEIS mapeados via DOM: Criação de conteúdo e sub-itens, Análise e acompanhamento e sub-item, Automação e assistência e sub-itens. NÃO elegíveis: Vídeo externo, Scorm, Games, Questionário. Ambientes identificados: principal=Stage 10 (envId=36602); herdado=Avião (Herdar marcado, edit bloqueado); independente=Stage 10.1 Parceira (envId=36690, Herdar desmarcado). Credenciais: email=evertongambeta@gmail.com / senha=123456. Feature flag analise_creditos_ia_beta_test deve estar habilitada e contrato com Agente de atendimento habilitado.

## Test Scenarios

### 1. Configurar a utilização do indexação de conteúdo por ambiente

**Seed:** `tests/seed.spec.ts`

#### 1.1. Configurar a indexação - Ambientes antigos - RUNNER

**File:** `tests/features/configurar-indexacao-conteudo-por-ambiente/configurar-a-indexacao-ambientes-antigos-runner.spec.ts`

**Steps:**
  1. PRÉ-CONDIÇÃO login: navegar para https://stage10.stage.twygoead.com/users/login, preencher getByRole('textbox', { name: 'Login' }) com 'evertongambeta@gmail.com', preencher getByRole('textbox', { name: 'Senha' }) com '123456' e clicar em getByRole('button', { name: 'Entrar' }). Aguardar URL conter '/dashboard_students'. Clicar no botão de perfil e selecionar 'Administrador'. Aguardar URL conter '/o/36602/events'.
    - expect: O usuário é autenticado e redirecionado para /dashboard_students.
    - expect: Após trocar de perfil a URL muda para /o/36602/events com profile=admin.
    - expect: O botão de perfil no topo passa a exibir 'Administrador'.
  2. PRÉ-CONDIÇÃO navegação: acessar https://stage10.stage.twygoead.com/o/36602/ai_consumption_analysis?tab=settings. Aguardar que o tabpanel 'Configurações' fique visível e a tabela de ambientes seja renderizada.
    - expect: A URL é /o/36602/ai_consumption_analysis?tab=settings.
    - expect: O tab 'Configurações' está selecionado (aria-selected=true).
    - expect: A tabela exibe colunas: Ambiente, Acesso de IA ativo, Herdar configurações do principal, Ações.
    - expect: A linha 'Stage 10' aparece com célula 'Ambiente principal' na coluna Herdar configurações do principal.
  3. STEP 1 — RUNNER [REVIEW_NEEDED: operação server-side]. O XML exige executar o Runner para atualizar registros no banco vetorial antes deste step — essa operação é rake task backend sem interface Playwright. O tester manual deve garantir que o Runner foi executado ANTES de prosseguir. ASSERÇÃO UI ALTERNATIVA (estado pós-runner): na tabela localizar a linha 'Stage 10' e clicar no ícone edit (data-testid='ai-consumption-analysis-edit-button'). Aguardar URL /o/36602/ai_consumption_analysis/36602/edit_additional_organization_permissions. Verificar: (a) o alerta de sincronização NÃO está presente, (b) o checkbox 'Indexação de conteúdo' está enabled e checked. Verificar que os checkboxes LEGÍVEIS estão todos marcados. Clicar Cancelar ou Voltar sem salvar.
    - expect: REVIEW_NEEDED: o Runner server-side deve ter sido executado previamente antes da execução deste step automatizado.
    - expect: URL da tela de edição é /o/36602/ai_consumption_analysis/36602/edit_additional_organization_permissions.
    - expect: O alerta 'Existe uma sincronização de conteúdo em andamento. Aguarde a finalização para editar as configurações de indexação.' NÃO está presente — sincronização concluída.
    - expect: getByRole('checkbox', { name: 'Indexação de conteúdo' }) está visível, NÃO disabled e está checked=true.
    - expect: Checkboxes LEGÍVEIS todos marcados: Criação de conteúdo, Criação de conteúdos no tipo página ou em video com IA, Geração de questionários baseados em novos arquivos ou atividades já existentes, Criação de estrutura de atividades para auxiliar na construção de um conteudo, Geração de resumos para suas atividades, Edição de conteúdos do tipo página com IA, Edição de conteúdos do tipo aula com IA, Análise e acompanhamento, Geração de parecer da IA nos questionários aplicados para o usuário final, Automação e assistência, Importação de arquivos ou textos para a criação de questionários de forma automatizada, Compreensão de arquivos importados e geração de organograma da sua empresa função e competências de cada função, Registros externos: Leitura de arquivos com IA e auto preenchimento dos registros realizados.
    - expect: NÃO verificar como marcados os itens não elegíveis: Vídeo externo, Scorm, Games, Questionário — são desabilitados por design na seção Tipo de conteúdo.
  4. STEP 2 — Ambiente adicional que HERDA do principal: voltar para /o/36602/ai_consumption_analysis?tab=settings. Localizar a linha 'Avião' na tabela — checkbox na coluna 'Herdar configurações do principal' está marcado. Fazer hover no ícone edit da linha 'Avião' e verificar o tooltip de bloqueio por herança. Verificar que o checkbox 'Acesso de IA ativo' da linha 'Avião' está marcado.
    - expect: A linha 'Avião' está visível na tabela.
    - expect: O checkbox na coluna 'Acesso de IA ativo' da linha 'Avião' está checked=true.
    - expect: O checkbox na coluna 'Herdar configurações do principal' da linha 'Avião' está checked=true — confirmando herança do principal.
    - expect: Ao fazer hover no ícone edit da linha 'Avião' o tooltip exibe: 'Este ambiente está herdando configurações do ambiente principal. Desative a herança para editar.' — edição direta bloqueada enquanto herança ativa.
    - expect: REVIEW_NEEDED: a verificação de que os recursos de IA estão utilizando os conteúdos corretamente requer validação fim-a-fim no chat IA do aluno do ambiente Avião — fora do escopo Playwright UI puro desta tela de administração.
  5. STEP 3 — Ambiente adicional INDEPENDENTE (não herda): na tabela da aba Configurações localizar a linha 'Stage 10.1 Parceira' — checkbox na coluna 'Herdar configurações do principal' está desmarcado. Clicar no ícone edit da linha 'Stage 10.1 Parceira'. Aguardar URL /o/36602/ai_consumption_analysis/36690/edit_additional_organization_permissions. Verificar o estado dos toggles na tela de edição e compará-los com o ambiente principal.
    - expect: URL da tela de edição é /o/36602/ai_consumption_analysis/36690/edit_additional_organization_permissions.
    - expect: O heading da página exibe 'Stage 10.1 Parceira'.
    - expect: O checkbox 'Herdar configurações do principal' da linha 'Stage 10.1 Parceira' estava desmarcado na tabela — confirmando ambiente independente.
    - expect: getByRole('checkbox', { name: 'Agente de atendimento' }) está DESMARCADO (checked=false) — diferindo do principal onde estava marcado. A sub-seção 'Fontes de conhecimento' NÃO é renderizada.
    - expect: REVIEW_NEEDED (toggle Indexação): pós-runner o checkbox 'Indexação de conteúdo' deve estar enabled e checked; se sincronização ainda em andamento estará disabled com alerta visível. Estado esperado pós-runner: not disabled e checked=true.
    - expect: REVIEW_NEEDED: a verificação de que os recursos de IA do ambiente independente NÃO herdam configurações do principal e estão utilizando seus próprios conteúdos requer validação fim-a-fim no chat IA do aluno do ambiente Stage 10.1 Parceira — fora do escopo Playwright UI puro.
    - expect: Clicar em Cancelar ou Voltar para retornar à tabela sem salvar alterações.
