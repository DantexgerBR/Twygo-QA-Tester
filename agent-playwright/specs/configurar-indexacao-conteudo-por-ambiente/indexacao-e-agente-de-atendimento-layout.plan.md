# Indexação e Agente de atendimento - Layout

## Application Overview

Módulo Créditos de IA da plataforma Twygo (Super Admin). Aba "Configurações" exibe uma tabela de ambientes com colunas "Ambiente", "Acesso de IA ativo", "Herdar configurações do principal" e "Ações" (ícone edit). Ao clicar no ícone de edição de um ambiente abre a tela "/o/{orgId}/ai_consumption_analysis/{envId}/edit_additional_organization_permissions" com o título "Créditos de IA > Configurações > Editar configuração". Nela o administrador configura quais funcionalidades de IA ficam habilitadas, incluindo o toggle "Indexação de conteúdo" e o toggle "Agente de atendimento". Os sub-campos de Indexação (Período, Data inicial/final, Tipo de conteúdo, Situação, Exceções) são renderizados condicionalmente apenas quando o toggle "Indexação de conteúdo" está habilitado. Quando o toggle está desabilitado (ex.: sincronização em andamento), esses campos não existem no DOM. Os tooltips são implementados como span.tooltip-icon com ícone SVG e texto armazenado no prop "tipText" do componente React. Credenciais: email=evertongambeta@gmail.com / senha=123456. Feature flag analise_creditos_ia_beta_test deve estar habilitada e contrato com "Agente de atendimento" habilitado.

## Test Scenarios

### 1. Configurar a utilização da indexação de conteúdo por ambiente

**Seed:** `tests/seed.spec.ts`

#### 1.1. Indexação e Agente de atendimento - Layout

**File:** `tests/features/configurar-indexacao-conteudo-por-ambiente/indexacao-e-agente-de-atendimento-layout.spec.ts`

**Steps:**
  1. Fazer login como SuperAdmin: navegar para https://stage10.stage.twygoead.com/users/login, preencher o campo 'Login' com 'evertongambeta@gmail.com', preencher 'Senha' com '123456' e clicar em 'Entrar'. Aguardar redirecionamento para /dashboard_students. Trocar para o perfil Administrador clicando no botão de perfil de usuário e selecionando 'Administrador'. Navegar para /o/36602/ai_consumption_analysis?tab=settings clicando em 'Configurações' > 'Créditos de IA BETA' no sidebar. Clicar na aba 'Configurações'. Localizar qualquer ambiente na tabela que tenha 'Acesso de IA ativo' habilitado e 'Indexação de conteúdo' não bloqueada por sincronização em andamento, clicar no ícone de edição (data-test-id='ai-consumption-analysis-edit-button') da linha correspondente. Aguardar URL conter '/edit_additional_organization_permissions'. Localizar o toggle 'Indexação de conteúdo' e garantir que ele esteja habilitado (não disabled). Fazer hover no ícone de tooltip (span.tooltip-icon) ao lado do label 'Indexação de conteúdo'.
    - expect: O tooltip do toggle 'Indexação de conteúdo' exibe o texto: 'Configure como a IA aprende com seus conteúdos. A indexação tem um custo inicial de créditos maior devido ao aprendizado, mas torna as operações futuras (como agente de atendimento, geração de questionários e outras funcionalidades) significativamente mais rápidas e econômicas.' — NOTA: o texto exato do XML ('...significativamente mais rápidas e baratas.') diverge do texto observado em produção ('...significativamente mais rápidas e econômicas.'); marcar como REVIEW_NEEDED para alinhamento com equipe de produto.
    - expect: O tooltip é renderizado via elemento com role='tooltip' no DOM após o hover.
    - expect: O toggle 'Indexação de conteúdo' está visível na seção de configurações do ambiente.
  2. Na mesma tela de edição do ambiente (pré-condição: toggle 'Indexação de conteúdo' está habilitado), rolar até a sub-seção abaixo do toggle 'Indexação de conteúdo'. Localizar o toggle 'Período' e fazer hover no ícone de tooltip (span.tooltip-icon) ao lado do label 'Período'.
    - expect: O toggle 'Período' está visível abaixo do toggle 'Indexação de conteúdo'.
    - expect: O tooltip do toggle 'Período' exibe o texto: 'Caso seja habilitado, a IA irá considerar apenas o período que o usuário inserir'.
    - expect: O tooltip aparece via role='tooltip' após hover no ícone de informação.
    - expect: NOTA: O toggle 'Período' e seus sub-campos são renderizados condicionalmente apenas quando o toggle 'Indexação de conteúdo' está habilitado. Se o toggle estiver desabilitado (ex.: sincronização em andamento), estes campos não estarão presentes no DOM — verificar pré-condição antes de executar este step.
  3. Na mesma tela de edição (pré-condição: toggle 'Indexação de conteúdo' habilitado e toggle 'Período' habilitado), localizar os campos de data logo abaixo do toggle 'Período'. Verificar a presença e os placeholders dos campos de data.
    - expect: Abaixo do toggle 'Período' há um campo com label 'Data inicial' e placeholder 'dd/mm/aaaa'.
    - expect: Há também um campo com label 'Data final (Opcional)' e placeholder 'dd/mm/aaaa'.
    - expect: Ambos os campos são inputs do tipo data ou texto formatado (verificar via getByPlaceholder('dd/mm/aaaa').
    - expect: NOTA: Esses campos só são renderizados no DOM quando o toggle 'Período' está habilitado dentro da seção 'Indexação de conteúdo' que por sua vez precisa estar habilitada — marcar como REVIEW_NEEDED se a pré-condição não puder ser satisfeita automaticamente.
  4. Na mesma tela de edição (pré-condição: toggle 'Indexação de conteúdo' habilitado), localizar a seção 'Tipo de conteúdo' abaixo dos campos de data. Verificar a presença de todos os checkboxes listados.
    - expect: A seção 'Tipo de conteúdo' está visível com checkboxes para: Curso, Trilha, Pacote.
    - expect: Na segunda linha de checkboxes estão: Texto, Página, Aula, PDF estampado, Vídeo.
    - expect: Na terceira linha de checkboxes estão: Arquivos, Questionário.
    - expect: Com indicação '(não elegível)' nos itens: Vídeo externo, Scorm, Games.
    - expect: Todos esses checkboxes são localizáveis por getByRole('checkbox') com seus respectivos names.
    - expect: NOTA: Esta seção é renderizada condicionalmente — só aparece quando o toggle 'Indexação de conteúdo' está habilitado — marcar como REVIEW_NEEDED se a pré-condição não puder ser satisfeita.
  5. Na mesma tela de edição (pré-condição: toggle 'Indexação de conteúdo' habilitado), localizar a seção 'Situação de conteúdos' abaixo da seção 'Tipo de conteúdo'. Verificar a presença dos checkboxes de situação.
    - expect: A seção 'Situação de conteúdos' está visível com checkboxes: 'Em desenvolvimento', 'Liberados', 'Suspensos'.
    - expect: Os checkboxes são localizáveis por getByRole('checkbox') com os respectivos labels.
    - expect: NOTA: Esta seção é renderizada condicionalmente dentro da área de 'Indexação de conteúdo' — marcar como REVIEW_NEEDED se a pré-condição não puder ser satisfeita.
  6. Na mesma tela de edição (pré-condição: toggle 'Indexação de conteúdo' habilitado), localizar a seção 'Exceções' abaixo de 'Situação de conteúdos'. Verificar a presença do campo de pesquisa.
    - expect: A seção 'Exceções' está visível com um campo de busca.
    - expect: O campo tem placeholder 'Digite o nome do conteúdo para adicionar às exceções'.
    - expect: O campo é localizável por getByPlaceholder('Digite o nome do conteúdo para adicionar às exceções').
    - expect: NOTA: Esta seção é renderizada condicionalmente — marcar como REVIEW_NEEDED se a pré-condição não puder ser satisfeita.
  7. Na mesma tela de edição do ambiente, rolar até a seção do toggle 'Agente de atendimento'. Verificar a presença do toggle, do tooltip e da sub-seção 'Fontes de conhecimento' com seus checkboxes e respectivos tooltips. Fazer hover no ícone de tooltip (span.tooltip-icon) ao lado de 'Agente de atendimento'. Depois mover o mouse para o ícone de tooltip ao lado de 'Interna'. Depois mover o mouse para o ícone de tooltip ao lado de 'Externa'.
    - expect: O toggle 'Agente de atendimento' está visível e localizável por getByRole('checkbox', { name: 'Agente de atendimento' }).
    - expect: O tooltip do 'Agente de atendimento' exibe: 'Agente de atendimento com respostas automatizadas, utilizando fontes de conhecimento configuráveis.' — NOTA: o texto do XML difere ('...com atendimento automatizado e fontes de conhecimento configuráveis'); marcar divergência como REVIEW_NEEDED.
    - expect: Abaixo do toggle 'Agente de atendimento', a seção 'Fontes de conhecimento' está visível com heading 'Fontes de conhecimento'.
    - expect: O checkbox 'Interna' está presente com ícone de tooltip.
    - expect: O tooltip do 'Interna' exibe: 'Utiliza conteúdos do seu ambiente como fonte de conhecimento. Para utilizar esta fonte, é necessário habilitar a indexação de conteúdo acima.' — NOTA: o texto do XML difere ('Utiliza conteúdos da sua organização...'); marcar divergência como REVIEW_NEEDED.
    - expect: O checkbox 'Externa' está presente com ícone de tooltip.
    - expect: O tooltip do 'Externa' exibe: 'Utiliza conteúdos públicos da internet como fonte de conhecimento.' — NOTA: o texto do XML difere ('Utiliza fontes de conhecimento público disponíveis na internet.'); marcar divergência como REVIEW_NEEDED.
  8. REVIEW_NEEDED — Validação visual subjetiva de fontes tipográficas, espaçamento, tamanho dos textos e margens. Na mesma tela de edição do ambiente, capturar screenshot completo da página e comparar visualmente com o design de referência aprovado para as seções 'Indexação de conteúdo' e 'Agente de atendimento'.
    - expect: REVIEW_NEEDED: Este step requer comparação visual com mock-up de referência. Não é automatizável de forma determinística por Playwright sem uma biblioteca de visual regression (ex.: Percy, Chromatic, ou playwright-visual-comparisons). Necessita de revisão manual ou configuração de baseline de visual testing.
    - expect: A fonte utilizada nos labels deve ser consistente com o design system Twygo.
    - expect: Os espaçamentos entre toggles e seus sub-itens devem ser uniformes.
    - expect: As margens laterais devem seguir o grid do design system.
  9. REVIEW_NEEDED — Validação de traduções alternando idioma do ambiente. Acessar as configurações de idioma do ambiente e alternar entre Português, Espanhol e Inglês, retornando à tela de edição de Créditos de IA após cada troca para verificar os textos traduzidos dos toggles, labels, placeholders e tooltips.
    - expect: REVIEW_NEEDED: Este step depende de mudar o idioma do ambiente/usuário (fora do fluxo direto de Créditos de IA) e pode exigir re-login ou troca de locale via configurações avançadas. Se a troca de idioma for feita em '/o/{orgId}/use_modes' ou nas configurações do usuário, o tester deve navegar de volta para a tela de edição do ambiente. A automação completa deste step é considerada fora do escopo Playwright puro sem fixtures de locale; necessita de revisão manual ou uso de i18n mocking.
    - expect: Em português (pt-BR): labels devem aparecer como observado (Indexação de conteúdo, Agente de atendimento, etc.).
    - expect: Em espanhol (es): labels devem aparecer traduzidos corretamente.
    - expect: Em inglês (en): labels devem aparecer em inglês.
